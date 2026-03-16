<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Customer;
use App\Services\MidtransService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
  protected $midtrans;

  public function __construct(MidtransService $midtrans)
  {
    $this->midtrans = $midtrans;
  }

  /**
   * Proses pembayaran untuk order
   */
  public function process(Order $order)
  {
    try {
      // Cek apakah order sudah lunas
      if ($order->is_paid) {
        return redirect()->route('owner.orders.show', $order->id)
          ->with('error', 'Order sudah lunas');
      }

      // Load relasi
      $order->load('customer', 'items');

      // Cek apakah sudah ada payment pending
      $existingPayment = Payment::where('order_id', $order->id)
        ->where('payment_status', 'pending')
        ->first();

      if ($existingPayment) {
        return Inertia::render('payments/process', [
          'order' => $order,
          'payment' => $existingPayment,
          'snapToken' => $existingPayment->midtrans_transaction_id,
          'clientKey' => config('services.midtrans.client_key'),
        ]);
      }

      DB::beginTransaction();

      // Generate payment number
      $paymentNumber = 'PAY-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

      // Buat transaksi di Midtrans
      $snapToken = $this->midtrans->createTransaction($order, $order->customer);

      // Simpan payment record
      $payment = Payment::create([
        'payment_number' => $paymentNumber,
        'order_id' => $order->id,
        'customer_id' => $order->customer_id,
        'amount' => $order->grand_total,
        'payment_status' => 'pending',
        'midtrans_transaction_id' => $snapToken,
      ]);

      DB::commit();

      return Inertia::render('payments/process', [
        'order' => $order,
        'payment' => $payment,
        'snapToken' => $snapToken,
        'clientKey' => config('services.midtrans.client_key'),
      ]);
    } catch (\Exception $e) {
      DB::rollBack();
      return redirect()->route('owner.orders.show', $order->id)
        ->with('error', 'System error: ' . $e->getMessage());
    }
  }
  /**
   * Handle notifikasi dari Midtrans
   */
  public function callback(Request $request)
  {
    try {
      $notification = $this->midtrans->handleNotification();

      $order = Order::where('order_number', $notification['order_id'])->first();

      if (!$order) {
        return response()->json(['error' => 'Order not found'], 404);
      }

      $payment = Payment::where('order_id', $order->id)->latest()->first();

      if (!$payment) {
        return response()->json(['error' => 'Payment not found'], 404);
      }

      // Update payment status berdasarkan notifikasi
      $paymentStatus = $this->mapMidtransStatus($notification['transaction_status']);

      $payment->update([
        'payment_status' => $paymentStatus,
        'midtrans_status' => $notification['transaction_status'],
        'midtrans_response' => json_encode($notification['raw']),
        'payment_date' => in_array($paymentStatus, ['paid', 'settlement']) ? now() : null,
      ]);

      // Update order status if payment is successful
      if (in_array($paymentStatus, ['paid', 'settlement'])) {
        $order->update([
          'is_paid' => true,
          'payment_method' => $this->mapMidtransPaymentMethod($notification['raw']),
        ]);
      }

      return response()->json(['success' => true]);
    } catch (\Exception $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }
  }

  /**
   * Halaman finish setelah pembayaran
   */
  public function finish(Request $request)
  {
    $orderId = $request->order_id;
    $order = Order::where('order_number', $orderId)->first();

    if (!$order) {
      return redirect()->route('owner.orders.index')->with('error', 'Order tidak ditemukan');
    }

    return redirect()->route('owner.orders.show', $order->id)
      ->with('success', 'Pembayaran berhasil diproses');
  }

  /**
   * Halaman (pembayaran belum selesai)
   */
  public function unfinish(Request $request)
  {
    $orderId = $request->order_id;

    return redirect()->route('orders.index')
      ->with('info', 'Pembayaran belum selesai, silakan coba lagi');
  }

  /**
   * Halaman error pembayaran
   */
  public function error(Request $request)
  {
    return redirect()->route('orders.index')
      ->with('error', 'Pembayaran gagal diproses');
  }

  /**
   * Cek status pembayaran manual
   */
  public function checkStatus(Order $order)
  {
    try {
      $status = $this->midtrans->checkStatus($order->order_number);

      $payment = Payment::where('order_id', $order->id)->latest()->first();

      if ($payment) {
        $paymentStatus = $this->mapMidtransStatus($status->transaction_status);

        $payment->update([
          'payment_status' => $paymentStatus,
          'midtrans_status' => $status->transaction_status,
          'payment_date' => in_array($paymentStatus, ['paid', 'settlement']) ? now() : null,
        ]);

        if (in_array($paymentStatus, ['paid', 'settlement'])) {
          $order->update([
            'is_paid' => true,
            'payment_method' => $this->mapMidtransPaymentMethod($status),
          ]);
        }
      }

      return back()->with('success', 'Status pembayaran berhasil diupdate');
    } catch (\Exception $e) {
      return back()->with('error', 'Gagal cek status: ' . $e->getMessage());
    }
  }

  /**
   * Map status Midtrans ke status payment lokal
   */
  private function mapMidtransStatus($midtransStatus)
  {
    return match ($midtransStatus) {
      'capture', 'settlement' => 'paid',
      'pending' => 'pending',
      'deny', 'cancel', 'expire' => 'failed',
      'refund' => 'refunded',
      default => 'pending',
    };
  }

  /**
   * Map metode pembayaran Midtrans
   */
  private function mapMidtransPaymentMethod($response)
  {
    if (isset($response->payment_type)) {
      return match ($response->payment_type) {
        'credit_card' => 'credit_card',
        'bank_transfer' => 'transfer',
        'qris' => 'qris',
        'cstore' => 'cash',
        'echannel' => 'va',
        default => 'transfer',
      };
    }
    return null;
  }
}
