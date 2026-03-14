import { Link } from '@inertiajs/react';
import {
  ArrowLeft,
  Printer,
  Calendar,
  User,
  Scale,
  CheckCircle,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

interface OrderItem {
  id: number;
  service_name: string;
  quantity: number | string;
  unit: string;
  price_per_unit: number | string;
  subtotal: number | string;
  notes: string | null;
}

interface Order {
  id: number;
  order_number: string;
  customer: {
    name: string;
    phone: string | null;
    address: string | null;
    is_member: boolean;
  };
  branch: {
    name: string;
    address: string | null;
    phone: string | null;
  };
  cashier: {
    name: string;
  };
  order_date: string;
  pickup_date: string | null;
  status: string;
  total_weight: number | string;
  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  grand_total: number | string;
  notes: string | null;
  is_paid: boolean;
  payment_method: string | null;
  items: OrderItem[];
}

interface Props {
  order: Order;
}

export default function OrderPrint({ order }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto print when component mounts
    window.print();
  }, []);

  const toNumber = (value: unknown): number => {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  };

  const formatCurrency = (amount: number | string) => {
    const numeric = toNumber(amount);

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('IDR', 'Rp');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-4 print:px-0">
        {/* Tombol Kembali (hidden when printing) */}
        <div className="mb-4 flex items-center justify-between print:hidden">
          <Link
            href={`/owner/orders/${order.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Detail
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Printer className="h-4 w-4" />
            Cetak / Print
          </button>
        </div>

        {/* Nota / Struk */}
        <div
          ref={printRef}
          className="rounded-2xl bg-white p-8 shadow-xl print:p-6 print:shadow-none"
        >
          {/* Header Nota */}
          <div className="mb-6 border-b border-slate-200 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Smart Laundry
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {order.branch.name}
                </p>
                {order.branch.address && (
                  <p className="text-xs text-slate-400">
                    {order.branch.address}
                  </p>
                )}
                {order.branch.phone && (
                  <p className="text-xs text-slate-400">
                    Telp: {order.branch.phone}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-slate-500">NOTA</div>
                <div className="font-mono text-2xl font-bold text-indigo-600">
                  {order.order_number}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {formatDate(order.order_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Info Pelanggan */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <div>
              <h2 className="mb-2 text-xs font-semibold text-slate-500 uppercase">
                Pelanggan
              </h2>
              <div className="space-y-1">
                <p className="font-medium text-slate-900">
                  {order.customer.name}
                </p>
                {order.customer.phone && (
                  <p className="text-sm text-slate-600">
                    Telp: {order.customer.phone}
                  </p>
                )}
                {order.customer.address && (
                  <p className="text-sm text-slate-600">
                    {order.customer.address}
                  </p>
                )}
                {order.customer.is_member && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                    <CheckCircle className="h-3 w-3" />
                    Member
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-xs font-semibold text-slate-500 uppercase">
                Informasi Order
              </h2>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">
                    Ambil:{' '}
                    {order.pickup_date
                      ? formatDateOnly(order.pickup_date)
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Scale className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">
                    Total Berat: {order.total_weight} kg
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600">
                    Kasir: {order.cashier.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Table Items */}
          <div className="mb-6">
            <h2 className="mb-3 text-xs font-semibold text-slate-500 uppercase">
              Detail Layanan
            </h2>
            <table className="w-full">
              <thead className="border-y border-slate-200 text-xs text-slate-500">
                <tr>
                  <th className="py-2 text-left">Layanan</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Harga</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item) => (
                  <tr key={item.id} className="text-sm">
                    <td className="py-3">
                      <div className="font-medium text-slate-900">
                        {item.service_name}
                      </div>
                      {item.notes && (
                        <div className="text-xs text-slate-400">
                          Note: {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 text-right">
                      {formatCurrency(item.price_per_unit)}
                    </td>
                    <td className="py-3 text-right font-medium">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="mb-6 border-t border-slate-200 pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Diskon</span>
                    <span className="font-medium text-rose-600">
                      -{formatCurrency(order.discount)}
                    </span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Pajak</span>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(order.tax)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                  <span className="text-slate-800">TOTAL</span>
                  <span className="text-indigo-600">
                    {formatCurrency(order.grand_total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Pembayaran */}
          <div className="mb-6 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-slate-600">
                  Status Pembayaran:
                </span>
                <span
                  className={`ml-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                    order.is_paid
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {order.is_paid ? '✓ Lunas' : '○ Belum Dibayar'}
                </span>
              </div>
              {order.payment_method && (
                <span className="text-sm text-slate-500">
                  Metode: {order.payment_method === 'cash' && 'Tunai'}
                  {order.payment_method === 'transfer' && 'Transfer'}
                  {order.payment_method === 'qris' && 'QRIS'}
                  {order.payment_method === 'va' && 'Virtual Account'}
                </span>
              )}
            </div>
          </div>

          {/* Catatan */}
          {order.notes && (
            <div className="mb-6 border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">Catatan:</p>
              <p className="mt-1 text-sm text-slate-700">{order.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-slate-200 pt-6 text-center">
            <p className="text-xs text-slate-400">
              Terima kasih telah menggunakan layanan Smart Laundry
            </p>
            <p className="mt-1 text-xs text-slate-300">
              Nota ini adalah bukti transaksi sah
            </p>
          </div>
        </div>

        {/* Catatan Print */}
        <p className="mt-4 text-center text-xs text-slate-400 print:hidden">
          Gunakan tombol Print atau tekan Ctrl+P untuk mencetak
        </p>
      </div>
    </div>
  );
}
