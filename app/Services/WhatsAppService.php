<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $token;
    protected $sender;
    protected $isProduction;

    public function __construct()
    {
        $this->token = config('services.fonnte.token');
        $this->sender = config('services.fonnte.sender');
        $this->isProduction = config('services.fonnte.production', false);
    }

    public function sendOrderStatusUpdate(Order $order, string $status)
    {
        if (!$this->isProduction) {
            return $this->mockSend($order, $status);
        }

        $customerPhone = $order->customer->phone;
        if (!$customerPhone) {
            return false;
        }

        $message = $this->getStatusMessage($order, $status);
        
        return $this->sendMessage($customerPhone, $message);
    }

    public function sendMessage(string $phone, string $message)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->token,
            ])->post('https://api.fonnte.com/send', [
                'target' => $phone,
                'message' => $message,
                'countryCode' => '62',
            ]);

            if ($response->successful()) {
                Log::info('WhatsApp sent successfully', [
                    'phone' => $phone,
                    'response' => $response->json()
                ]);
                return true;
            }

            Log::error('WhatsApp failed', [
                'phone' => $phone,
                'response' => $response->json()
            ]);
            return false;

        } catch (\Exception $e) {
            Log::error('WhatsApp exception', [
                'error' => $e->getMessage(),
                'phone' => $phone
            ]);
            return false;
        }
    }

    protected function getStatusMessage(Order $order, string $status): string
    {
        $messages = [
            'pending' => "Halo *{$order->customer->name}*, pesanan laundry anda dengan no. *{$order->order_number}* telah diterima. Total: Rp " . number_format($order->grand_total) . ". Mohon menunggu proses selanjutnya.",
            'washing' => "Halo *{$order->customer->name}*, pesanan no. *{$order->order_number}* sedang dalam proses *pencucian*. Estimasi selesai: 2-3 jam lagi.",
            'drying' => "Halo *{$order->customer->name}*, pesanan no. *{$order->order_number}* sedang dalam proses *pengeringan*. Estimasi selesai: 1-2 jam lagi.",
            'ironing' => "Halo *{$order->customer->name}*, pesanan no. *{$order->order_number}* sedang dalam proses *penyetrikaan*. Estimasi selesai: 1 jam lagi.",
            'ready_pickup' => "Halo *{$order->customer->name}*, pesanan no. *{$order->order_number}* *SUDAH SIAP DIAMBIL*! Silakan datang ke cabang terdekat.",
            'completed' => "Halo *{$order->customer->name}*, pesanan no. *{$order->order_number}* telah *SELESAI*. Terima kasih telah menggunakan layanan kami!",
            'cancelled' => "Halo *{$order->customer->name}*, pesanan no. *{$order->order_number}* telah *DIBATALKAN*. Hubungi admin untuk info lebih lanjut."
        ];

        return $messages[$status] ?? "Status pesanan anda no. {$order->order_number} telah berubah menjadi {$status}.";
    }

    protected function mockSend(Order $order, string $status)
    {
        Log::info('[MOCK] WhatsApp notification', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $status,
            'phone' => $order->customer->phone,
            'message' => $this->getStatusMessage($order, $status)
        ]);

        return true;
    }

    public function sendPromoNotification($phone, $promoCode, $discount)
    {
        $message = "🎉 *PROMO SPESIAL* 🎉\n\nDapatkan diskon *{$discount}%* dengan kode *{$promoCode}*! Berlaku terbatas. Yuk laundry sekarang!";
        
        return $this->sendMessage($phone, $message);
    }
}