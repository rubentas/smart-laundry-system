import { Link } from '@inertiajs/react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  TrendingUp,
  Package,
  Eye,
  AlertCircle,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Stats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  readyOrders: number;
  completedToday: number;
}

interface PendingOrder {
  id: number;
  order_number: string;
  customer_name: string;
  status: string;
  created_at: string;
}

interface ReadyOrder {
  id: number;
  order_number: string;
  customer_name: string;
  grand_total: number;
  created_at: string;
}

interface Props {
  stats: Stats;
  pendingOrders: PendingOrder[];
  readyOrders: ReadyOrder[];
}

export default function CashierDashboard({
  stats,
  pendingOrders,
  readyOrders,
}: Props) {
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

  const statusColors: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    pending: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Pending' },
    washing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Mencuci' },
    drying: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Mengering' },
    ironing: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      label: 'Menyetrika',
    },
    ready_pickup: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Siap Ambil',
    },
    completed: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: 'Selesai',
    },
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Dashboard Kasir
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Ringkasan aktivitas hari ini
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Order Hari Ini
                  </p>
                  <p className="mt-2 text-2xl font-bold text-indigo-600">
                    {stats.todayOrders}
                  </p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-3">
                  <ShoppingBag className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Revenue Hari Ini
                  </p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    {formatCurrency(stats.todayRevenue)}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="mt-2 text-2xl font-bold text-amber-600">
                    {stats.pendingOrders}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 p-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Siap Ambil
                  </p>
                  <p className="mt-2 text-2xl font-bold text-green-600">
                    {stats.readyOrders}
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Selesai Hari Ini
                  </p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    {stats.completedToday}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/owner/orders/create"
              className="group rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">Order Baru</p>
                  <p className="mt-1 text-sm text-indigo-100">
                    Buat transaksi laundry
                  </p>
                </div>
                <div className="rounded-xl bg-white/20 p-3 backdrop-blur">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
              </div>
            </Link>

            <Link
              href="/owner/customers/create"
              className="group rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">
                    Customer Baru
                  </p>
                  <p className="mt-1 text-sm text-emerald-100">
                    Tambah data pelanggan
                  </p>
                </div>
                <div className="rounded-xl bg-white/20 p-3 backdrop-blur">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </Link>
          </div>

          {/* Order Lists */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pending Orders */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Perlu Diproses
                  </h2>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    {pendingOrders.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-200">
                {pendingOrders.length === 0 ? (
                  <div className="px-6 py-8 text-center text-slate-400">
                    <Package className="mx-auto h-8 w-8 opacity-20" />
                    <p className="mt-2 text-sm">Tidak ada order pending</p>
                  </div>
                ) : (
                  pendingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between px-6 py-3 hover:bg-slate-50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-slate-900">
                            {order.order_number}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}
                          >
                            {statusColors[order.status]?.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-slate-600">
                          {order.customer_name} • {order.created_at}
                        </p>
                      </div>
                      <Link
                        href={`/owner/orders/${order.id}`}
                        className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ready for Pickup */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Siap Diambil
                  </h2>
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {readyOrders.length}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-slate-200">
                {readyOrders.length === 0 ? (
                  <div className="px-6 py-8 text-center text-slate-400">
                    <CheckCircle className="mx-auto h-8 w-8 opacity-20" />
                    <p className="mt-2 text-sm">Tidak ada order siap ambil</p>
                  </div>
                ) : (
                  readyOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between px-6 py-3 hover:bg-slate-50"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-slate-900">
                            {order.order_number}
                          </span>
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Siap Ambil
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-slate-600">
                          {order.customer_name} • {order.created_at}
                        </p>
                        <p className="text-xs font-medium text-emerald-600">
                          {formatCurrency(order.grand_total)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Link
                          href={`/owner/orders/${order.id}`}
                          className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/owner/orders/${order.id}/print`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <AlertCircle className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
