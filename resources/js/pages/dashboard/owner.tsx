import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Package,
  Eye,
} from 'lucide-react';

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import AppLayout from '@/layouts/app-layout';

interface Stats {
  todayRevenue: number;
  todayOrders: number;
  todayCustomers: number;
  pendingOrders: number;
  readyOrders: number;
  averageOrder: number;
}

interface Charts {
  revenue7days: {
    labels: string[];
    data: number[];
  };
}

interface TopService {
  name: string;
  total_orders: number;
  revenue: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  grand_total: number;
  status: string;
  created_at: string;
}

interface Props {
  stats: Stats;
  charts: Charts;
  topServices: TopService[];
  recentOrders: RecentOrder[];
}

export default function OwnerDashboard({
  stats,
  charts,
  topServices,
  recentOrders,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
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

  const statusColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'bg-slate-100', text: 'text-slate-700' },
    washing: { bg: 'bg-blue-100', text: 'text-blue-700' },
    drying: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
    ironing: { bg: 'bg-amber-100', text: 'text-amber-700' },
    ready_pickup: { bg: 'bg-green-100', text: 'text-green-700' },
    completed: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    cancelled: { bg: 'bg-rose-100', text: 'text-rose-700' },
  };

  // Data untuk chart revenue
  const revenueData = charts.revenue7days.labels.map((label, index) => ({
    name: label,
    revenue: charts.revenue7days.data[index],
  }));

  // Data untuk pie chart top services
  const pieData = topServices.map((service) => ({
    name: service.name,
    value: service.revenue,
  }));

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Dashboard Owner
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Ringkasan bisnis laundry Anda
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {/* Revenue Hari Ini */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Revenue Hari Ini
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    {formatCurrency(stats.todayRevenue)}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Order Hari Ini */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Order Hari Ini
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    {stats.todayOrders}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <ShoppingBag className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Customer Baru */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Customer Baru
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    {stats.todayCustomers}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Pending Orders */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Pending
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    {stats.pendingOrders}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Siap Ambil */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Siap Ambil
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    {stats.readyOrders}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Revenue 7 Hari Terakhir
              </h2>
              <div className="h-80 min-h-80">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis
                        stroke="#64748b"
                        width={80}
                        tickFormatter={(value) => {
                          if (value >= 1000000) {
                            return `Rp${(value / 1000000).toFixed(1)}Jt`;
                          }
                          if (value >= 1000) {
                            return `Rp${(value / 1000).toFixed(0)}K`;
                          }
                          return `Rp${value}`;
                        }}
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                        labelStyle={{ color: '#1e293b' }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Top Services Pie Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Top 5 Layanan (30 Hari)
              </h2>
              <div className="h-80 min-h-80">
                {topServices.length > 0 ? (
                  mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(value as number)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Package className="h-12 w-12 opacity-20" />
                    <p className="ml-2">Belum ada data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Order Terbaru
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
                      Tanggal
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
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-slate-400"
                      >
                        Belum ada order
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-sm font-medium text-slate-900">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {order.customer_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {order.created_at}
                        </td>
                        <td className="px-6 py-4 font-medium text-emerald-600">
                          {formatCurrency(order.grand_total)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}
                          >
                            {order.status === 'pending' && 'Pending'}
                            {order.status === 'washing' && 'Mencuci'}
                            {order.status === 'drying' && 'Mengering'}
                            {order.status === 'ironing' && 'Menyetrika'}
                            {order.status === 'ready_pickup' && 'Siap Ambil'}
                            {order.status === 'completed' && 'Selesai'}
                            {order.status === 'cancelled' && 'Dibatalkan'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/owner/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            <Eye className="h-4 w-4" />
                            Detail
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
    </AppLayout>
  );
}
