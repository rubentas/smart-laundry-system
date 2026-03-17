<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class WhatsAppService
{
  /**
   * Send WhatsApp message (mock untuk testing)
   */
  public function send(string $phone, string $message): bool
  {
    // Format nomor (hapus 0 depan, tambah 62)
    $phone = $this->formatPhoneNumber($phone);

    // Mock: simpan ke log
    Log::info('📱 WhatsApp Notification', [
      'to' => $phone,
      'message' => $message,
      'timestamp' => now()->toDateTimeString(),
    ]);

    // Bisa juga pake library beneran nanti:
    // $fonnte = new \Fonnte\Fonnte(env('FONNTE_TOKEN'));
    // $response = $fonnte->send($phone, $message);

    return true;
  }

  /**
   * Send order status update
   */
  public function sendOrderStatusUpdate($order, $status): bool
  {
    $customer = $order->customer;

    if (!$customer->phone) {
      Log::warning('No phone number for customer', ['customer_id' => $customer->id]);
      return false;
    }

    $messages = [
      'pending' => "Order laundry Anda telah diterima!\nNo. Order: {$order->order_number}\nEstimasi: " . ($order->pickup_date ?? '2 hari'),
      'washing' => "Laundry Anda sedang dicuci.\nNo. Order: {$order->order_number}",
      'drying' => "Laundry Anda sedang dikeringkan.\nNo. Order: {$order->order_number}",
      'ironing' => " Laundry Anda sedang disetrika.\nNo. Order: {$order->order_number}",
      'ready_pickup' => "Laundry Anda siap diambil!\nNo. Order: {$order->order_number}\nTotal: Rp " . number_format($order->grand_total, 0, ',', '.'),
      'completed' => "Terima kasih telah menggunakan layanan kami.\nNo. Order: {$order->order_number}",
      'cancelled' => "Order laundry Anda dibatalkan.\nNo. Order: {$order->order_number}",
    ];

    $message = $messages[$status] ?? "Status order Anda: " . strtoupper($status);

    return $this->send($customer->phone, $message);
  }

  /**
   * Format phone number ke internasional
   */
  private function formatPhoneNumber(string $phone): string
  {
    // Hapus karakter non-digit
    $phone = preg_replace('/[^0-9]/', '', $phone);

    // Jika dimulai dengan 0, ganti dengan 62
    if (str_starts_with($phone, '0')) {
      $phone = '62' . substr($phone, 1);
    }

    // Jika tidak dimulai dengan 62, tambahkan 62
    if (!str_starts_with($phone, '62')) {
      $phone = '62' . $phone;
    }

    return $phone;
  }

  /**
   * Send broadcast ke semua customer (untuk promo)
   */
  public function broadcast(array $phoneNumbers, string $message): array
  {
    $results = [];

    foreach ($phoneNumbers as $phone) {
      $results[$phone] = $this->send($phone, $message);
      sleep(1); // Delay 1 detik biar gak kena limit
    }

    return $results;
  }
}
