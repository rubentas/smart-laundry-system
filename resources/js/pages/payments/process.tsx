import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Package,
  Store,
  User,
  Calendar,
  Shield,
  Copy,
  ExternalLink,
} from 'lucide-react';

declare global {
  interface Window {
    snap: any;
  }
}

interface OrderItem {
  id: number;
  service_name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  subtotal: number;
}

interface Order {
  id: number;
  order_number: string;
  grand_total: number;
  customer: {
    name: string;
    email: string | null;
    phone: string | null;
  };
  items: OrderItem[];
}

interface Payment {
  id: number;
  payment_number: string;
  amount: number;
  payment_status: string;
}

interface Props {
  order: Order;
  payment: Payment;
  snapToken: string;
  clientKey: string;
}

export default function PaymentProcess({
  order,
  payment,
  snapToken,
  clientKey,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientKey]);

  const handlePayment = () => {
    setIsLoading(true);

    // @ts-ignore
    window.snap.pay(snapToken, {
      onSuccess: function () {
        setIsLoading(false);
        router.visit(`/owner/orders/${order.id}`, {
          data: { payment_status: 'success' },
        });
      },
      onPending: function () {
        setIsLoading(false);
        router.visit(`/owner/orders/${order.id}`, {
          data: { payment_status: 'pending' },
        });
      },
      onError: function () {
        setIsLoading(false);
        alert('Pembayaran gagal, silakan coba lagi');
      },
      onClose: function () {
        setIsLoading(false);
      },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('IDR', 'Rp');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={`/owner/orders/${order.id}`}
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Detail Order
            </Link>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <CreditCard className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Proses Pembayaran
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Order: {order.order_number}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Order Summary */}
            <div className="space-y-6 lg:col-span-2">
              {/* Order Details Card */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Ringkasan Order
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-slate-400" />
                      <span className="font-mono text-sm font-medium text-slate-900">
                        {order.order_number}
                      </span>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      {payment.payment_status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">Customer:</span>
                      <span className="font-medium text-slate-900">
                        {order.customer.name}
                      </span>
                    </div>

                    {order.customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="h-4 w-4 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-slate-600">Telepon:</span>
                        <span className="font-medium text-slate-900">
                          {order.customer.phone}
                        </span>
                      </div>
                    )}

                    {order.customer.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="h-4 w-4 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-slate-600">Email:</span>
                        <span className="font-medium text-slate-900">
                          {order.customer.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Detail Item
                  </h2>
                </div>
                <div className="p-6">
                  <table className="w-full">
                    <thead className="text-xs font-medium text-slate-500 uppercase">
                      <tr className="border-b border-slate-200">
                        <th className="pb-3 text-left">Layanan</th>
                        <th className="pb-3 text-right">Qty</th>
                        <th className="pb-3 text-right">Harga</th>
                        <th className="pb-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 text-sm text-slate-900">
                            {item.service_name}
                          </td>
                          <td className="py-3 text-right text-sm text-slate-700">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-3 text-right text-sm text-slate-700">
                            {formatCurrency(item.price_per_unit)}
                          </td>
                          <td className="py-3 text-right text-sm font-medium text-emerald-600">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <DollarSign className="h-5 w-5" />
                    Total Pembayaran
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-6 text-center">
                    <p className="mb-1 text-sm text-slate-500">
                      Jumlah yang harus dibayar
                    </p>
                    <p className="text-4xl font-bold text-indigo-600">
                      {formatCurrency(order.grand_total)}
                    </p>
                  </div>

                  {/* Payment Number */}
                  <div className="mb-4 rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        No. Pembayaran
                      </span>
                      <button
                        onClick={() => copyToClipboard(payment.payment_number)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {copied ? (
                          <span className="text-xs text-emerald-600">
                            Tersalin!
                          </span>
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 font-mono text-sm font-medium text-slate-900">
                      {payment.payment_number}
                    </p>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full rounded-xl bg-indigo-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Clock className="h-5 w-5 animate-spin" />
                        Memproses...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Bayar Sekarang
                      </span>
                    )}
                  </button>

                  <p className="mt-4 text-center text-xs text-slate-400">
                    <Shield className="mr-1 inline h-3 w-3" />
                    Pembayaran diproses oleh Midtrans
                  </p>
                </div>
              </div>

              {/* Payment Methods Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Metode Pembayaran
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>• Kartu Kredit / Debit</p>
                  <p>• Transfer Bank (BCA, Mandiri, BRI, BNI)</p>
                  <p>• E-Wallet (GoPay, OVO, Dana, ShopeePay)</p>
                  <p>• QRIS</p>
                  <p>• Indomaret / Alfamart</p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    Setelah pembayaran, status akan terupdate otomatis
                  </span>
                </div>
              </div>

              {/* Help Card */}
              <div className="rounded-2xl border border-slate-200 bg-blue-50 p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900">
                      Butuh bantuan?
                    </h4>
                    <p className="mt-1 text-xs text-blue-700">
                      Hubungi customer service jika mengalami kendala pembayaran
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
