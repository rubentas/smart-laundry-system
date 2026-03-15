import { Link } from '@inertiajs/react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Users,
  Package,
  Eye,
  BarChart3,
  Store,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AppLayout from '@/layouts/app-layout';

interface Stats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  readyOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
}

interface TodayOrder {
  id: number;
  order_number: string;
  customer: {
    name: string;
  };
  grand_total: number;
  status: string;
  created_at: string;
}

interface TopService {
  name: string;
  total_orders: number;
  revenue: number;
}

interface Props {
  stats: Stats;
  todayOrders: TodayOrder[];
  topServices: TopService[];
  branchName: string;
}

export default function AdminDashboard({
  stats,
  todayOrders,
  topServices,
  branchName,
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
    cancelled: {
      bg: 'bg-rose-100',
      text: 'text-rose-700',
      label: 'Dibatalkan',
    },
  };

  // Data untuk chart top services
  const chartData = topServices.map((service) => ({
    name:
      service.name.length > 10
        ? service.name.substring(0, 10) + '...'
        : service.name,
    revenue: service.revenue,
  }));

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Store className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {branchName}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Dashboard Admin Cabang
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
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
                    Total Customers
                  </p>
                  <p className="mt-2 text-2xl font-bold text-purple-600">
                    {stats.totalCustomers}
                  </p>
                </div>
                <div className="rounded-xl bg-purple-50 p-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Rata-rata Order
                  </p>
                  <p className="mt-2 text-2xl font-bold text-emerald-600">
                    {formatCurrency(stats.avgOrderValue)}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/owner/orders/create"
              className="group rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">Order Baru</p>
                  <p className="mt-1 text-sm text-indigo-100">Buat transaksi</p>
                </div>
                <div className="rounded-xl bg-white/20 p-3 backdrop-blur">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
              </div>
            </Link>

            <Link
              href="/owner/services"
              className="group rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">
                    Kelola Layanan
                  </p>
                  <p className="mt-1 text-sm text-emerald-100">
                    Atur harga & layanan
                  </p>
                </div>
                <div className="rounded-xl bg-white/20 p-3 backdrop-blur">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
            </Link>

            <Link
              href="/owner/reports"
              className="group rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-500 to-amber-600 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">Laporan</p>
                  <p className="mt-1 text-sm text-amber-100">
                    Lihat rekap harian
                  </p>
                </div>
                <div className="rounded-xl bg-white/20 p-3 backdrop-blur">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
              </div>
            </Link>
          </div>

          {/* Charts & Tables */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Top Services Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Top Layanan (30 Hari)
              </h2>
              <div className="h-64">
                {topServices.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis
                        stroke="#64748b"
                        tickFormatter={(value) => `Rp${value / 1000}K`}
                      />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#4f46e5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Package className="h-12 w-12 opacity-20" />
                    <p className="ml-2">Belum ada data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Today's Orders */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Order Hari Ini
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        No Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Pelanggan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {todayOrders.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-slate-400"
                        >
                          Belum ada order hari ini
                        </td>
                      </tr>
                    ) : (
                      todayOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono text-sm font-medium text-slate-900">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {order.customer.name}
                          </td>
                          <td className="px-6 py-4 font-medium text-emerald-600">
                            {formatCurrency(order.grand_total)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}
                            >
                              {statusColors[order.status]?.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/owner/orders/${order.id}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
