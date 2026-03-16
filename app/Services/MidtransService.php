<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Transaction;
use Midtrans\Notification;

class MidtransService
{
  public function __construct()
  {
    Config::$serverKey = config('services.midtrans.server_key');
    Config::$clientKey = config('services.midtrans.client_key');
    Config::$isProduction = config('services.midtrans.is_production', false);
    Config::$isSanitized = true;
    Config::$is3ds = true;
  }

  public function createTransaction($order, $customer)
  {
    $transactionDetails = [
      'order_id' => $order->order_number,
      'gross_amount' => (int) $order->grand_total,
    ];

    $customerDetails = [
      'first_name' => $customer->name,
      'email' => $customer->email ?? '',
      'phone' => $customer->phone ?? '',
    ];

    $itemDetails = [];
    foreach ($order->items as $item) {
      $itemDetails[] = [
        'id' => $item->service_id,
        'price' => (int) $item->price_per_unit,
        'quantity' => (int) $item->quantity,
        'name' => substr($item->service_name, 0, 50),
      ];
    }

    $params = [
      'transaction_details' => $transactionDetails,
      'customer_details' => $customerDetails,
      'item_details' => $itemDetails,
      'callbacks' => [
        'finish' => route('payment.finish'),
        'unfinish' => route('payment.unfinish'),
        'error' => route('payment.error'),
      ],
    ];

    try {
      $snapToken = Snap::getSnapToken($params);
      return $snapToken;
    } catch (\Exception $e) {
      throw new \Exception('Gagal membuat transaksi: ' . $e->getMessage());
    }
  }

  public function handleNotification()
  {
    try {
      $notification = new Notification();

      $transactionStatus = $notification->transaction_status;
      $orderId = $notification->order_id;
      $transactionId = $notification->transaction_id;

      return [
        'order_id' => $orderId,
        'transaction_status' => $transactionStatus,
        'transaction_id' => $transactionId,
        'raw' => $notification,
      ];
    } catch (\Exception $e) {
      throw new \Exception('Gagal handle notifikasi: ' . $e->getMessage());
    }
  }

  public function checkStatus($orderId)
  {
    try {
      $status = Transaction::status($orderId);
      return $status;
    } catch (\Exception $e) {
      throw new \Exception('Gagal cek status: ' . $e->getMessage());
    }
  }
}