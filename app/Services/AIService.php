<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Service;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use OpenAI;

class AIService
{
  protected $client;
  public function __construct()
  {
    $this->client = OpenAI::client(config('services.openai.api_key'));
  }

  /**
   * Generate business insights berdasarkan data
   */
  public function generateInsights()
  {
    // Cek cache (refresh setiap 24 jam)
    return Cache::remember('ai_insights', 86400, function () {
      return $this->fetchInsightsFromAI();
    });
  }

  /**
   * Fetch insights dari OpenAI
   */
  private function fetchInsightsFromAI()
  {
    try {
      // Kumpulkan data bisnis
      $data = $this->gatherBusinessData();

      // Build prompt
      $prompt = $this->buildPrompt($data);

      // Panggil OpenAI
      $response = $this->client->chat()->create([
        'model' => 'gpt-3.5-turbo',
        'messages' => [
          [
            'role' => 'system',
            'content' => 'Anda adalah asisten analis bisnis untuk laundry. Berikan analisis dalam bahasa Indonesia yang singkat, padat, dan actionable. Fokus pada insight yang bisa langsung digunakan pemilik bisnis.',
          ],
          [
            'role' => 'user',
            'content' => $prompt,
          ],
        ],
        'temperature' => 0.7,
        'max_tokens' => 300,
      ]);

      $insight = $response->choices[0]->message->content;

      // Simpan ke database (optional)
      $this->saveInsight($insight, $data);

      return [
        'insight' => $insight,
        'data' => $data,
        'generated_at' => now('Asia/Makassar')->toDateTimeString(),
      ];
    } catch (\Exception $e) {
      Log::error('AI Error: ' . $e->getMessage());

      // Fallback insight manual
      return [
        'insight' => $this->getFallbackInsight($this->gatherBusinessData()),
        'data' => $this->gatherBusinessData(),
        'generated_at' => now('Asia/Makassar')->toDateTimeString(),
        'note' => 'Fallback insight (AI offline)'
      ];
    }
  }

  /**
   * Fallback insight manual ketika OpenAI error
   */
  private function getFallbackInsight($data)
  {
    $insight = "📊 **Insight Bisnis:**\n\n";
    $insight .= "• **Total Order Bulan Ini:** {$data['total_orders_month']}\n";
    $insight .= "• **Total Revenue:** Rp " . number_format($data['total_revenue_month'], 0, ',', '.') . "\n";
    $insight .= "• **Rata-rata Order:** Rp " . number_format($data['avg_order_value'], 0, ',', '.') . "\n";
    $insight .= "• **Layanan Terlaris:** {$data['top_service']}\n";
    $insight .= "• **Jam Tersibuk:** {$data['busy_hour']}\n";
    $insight .= "• **Hari Tersibuk:** {$data['busy_day']}\n";
    $insight .= "• **Growth:** {$data['growth_percentage']}%\n\n";

    $insight .= "💡 **Rekomendasi:**\n";

    if ($data['growth_percentage'] > 10) {
      $insight .= "• Pertumbuhan sangat baik! Pertahankan kualitas layanan.\n";
      $insight .= "• Tambah staf di jam sibuk ({$data['busy_hour']}) untuk mengakomodasi permintaan.\n";
      $insight .= "• Fokus promosi pada layanan {$data['top_service']} yang sedang tren.";
    } elseif ($data['growth_percentage'] > 0) {
      $insight .= "• Pertumbuhan positif, tapi bisa ditingkatkan.\n";
      $insight .= "• Buat paket bundling untuk meningkatkan nilai transaksi.\n";
      $insight .= "• Beri diskon member untuk customer loyal.";
    } else {
      $insight .= "• Pertumbuhan menurun. Pertimbangkan promo weekend spesial.\n";
      $insight .= "• Evaluasi harga dan kualitas layanan.\n";
      $insight .= "• Kirim survei kepuasan ke customer yang sudah selesai.";
    }

    return $insight;
  }

  /**
   * Kumpulkan data bisnis untuk analisis
   */
  private function gatherBusinessData()
  {
    $now = now();
    $monthStart = $now->copy()->startOfMonth();
    $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
    $lastMonthEnd = $now->copy()->subMonth()->endOfMonth();

    // Data bulan ini
    $currentMonthOrders = Order::whereBetween('order_date', [$monthStart, $now])->get();

    // Data bulan lalu
    $lastMonthOrders = Order::whereBetween('order_date', [$lastMonthStart, $lastMonthEnd])->get();

    // Layanan terlaris
    $topService = Service::withCount('orderItems')
      ->orderBy('order_items_count', 'desc')
      ->first();

    // Jam tersibuk (dari order 7 hari terakhir)
    $busyHour = Order::where('order_date', '>=', $now->copy()->subDays(7))
      ->selectRaw('HOUR(order_date) as hour, COUNT(*) as total')
      ->groupBy('hour')
      ->orderBy('total', 'desc')
      ->first();

    // Hari tersibuk
    $busyDay = Order::where('order_date', '>=', $now->copy()->subDays(30))
      ->selectRaw('DAYNAME(order_date) as day, COUNT(*) as total')
      ->groupBy('day')
      ->orderBy('total', 'desc')
      ->first();

    return [
      'total_orders_month' => $currentMonthOrders->count(),
      'total_revenue_month' => $currentMonthOrders->sum('grand_total'),
      'avg_order_value' => $currentMonthOrders->avg('grand_total') ?? 0,
      'total_weight_month' => $currentMonthOrders->sum('total_weight'),

      'last_month_orders' => $lastMonthOrders->count(),
      'last_month_revenue' => $lastMonthOrders->sum('grand_total'),
      'growth_percentage' => $this->calculateGrowth(
        $lastMonthOrders->sum('grand_total'),
        $currentMonthOrders->sum('grand_total')
      ),

      'top_service' => $topService ? $topService->name : 'Belum ada data',
      'busy_hour' => $busyHour ? $busyHour->hour . ':00' : 'Tidak ada data',
      'busy_day' => $busyDay ? $busyDay->day : 'Tidak ada data',

      'total_customers' => \App\Models\Customer::count(),
      'new_customers_month' => \App\Models\Customer::whereMonth('created_at', $now->month)->count(),

      'pending_orders' => Order::where('status', 'pending')->count(),
      'completed_orders' => Order::where('status', 'completed')->count(),
    ];
  }

  /**
   * Hitung pertumbuhan
   */
  private function calculateGrowth($last, $current)
  {
    if ($last == 0) {
      return 100;
    }

    return round((($current - $last) / $last) * 100, 1);
  }

  /**
   * Build prompt untuk OpenAI
   */
  private function buildPrompt($data)
  {
    $prompt = "Analisis bisnis laundry dengan data berikut:\n\n";
    $prompt .= "BULAN INI:\n";
    $prompt .= "- Total Order: {$data['total_orders_month']}\n";
    $prompt .= '- Revenue: Rp ' . number_format($data['total_revenue_month']) . "\n";
    $prompt .= '- Rata-rata Order: Rp ' . number_format($data['avg_order_value']) . "\n";
    $prompt .= "- Total Berat: {$data['total_weight_month']} kg\n\n";

    $prompt .= "PERBANDINGAN:\n";
    $prompt .= "- Growth: {$data['growth_percentage']}% dari bulan lalu\n\n";

    $prompt .= "INSIGHT TAMBAHAN:\n";
    $prompt .= "- Layanan Terlaris: {$data['top_service']}\n";
    $prompt .= "- Jam Tersibuk: {$data['busy_hour']}\n";
    $prompt .= "- Hari Tersibuk: {$data['busy_day']}\n";
    $prompt .= "- Total Customer: {$data['total_customers']} ( {$data['new_customers_month']} baru bulan ini)\n";
    $prompt .= "- Order Pending: {$data['pending_orders']}\n";
    $prompt .= "- Order Selesai: {$data['completed_orders']}\n\n";

    $prompt .= "Berdasarkan data di atas, berikan:\n";
    $prompt .= "1. TIGA insight bisnis utama (poin-poin singkat)\n";
    $prompt .= "2. DUA rekomendasi actionable untuk meningkatkan revenue\n";
    $prompt .= "3. SATU prediksi singkat untuk bulan depan\n";
    $prompt .= "\nGunakan bahasa Indonesia yang profesional namun mudah dipahami.";

    return $prompt;
  }

  /**
   * Simpan insight ke database
   */
  private function saveInsight($insight, $data)
  {
    try {
      \App\Models\AIInsight::create([
        'insight' => $insight,
        'data_snapshot' => json_encode($data),
        'generated_at' => now(),
      ]);
    } catch (\Exception $e) {
      Log::error('Gagal simpan insight: ' . $e->getMessage());
    }
  }
}
