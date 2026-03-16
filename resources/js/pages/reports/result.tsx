import { Link } from '@inertiajs/react';
import {
  ArrowLeft,
  FileSpreadsheet,
  FileText,
  Printer,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle,
  Store,
  BarChart3,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AppLayout from '@/layouts/app-layout';

interface Summary {
  total_orders: number;
  total_revenue: number;
  average_order: number;
  total_weight: number;
  paid_orders: number;
  unpaid_orders: number;
}

interface ByBranch {
  branch_name: string;
  total_orders: number;
  total_revenue: number;
}

interface ByStatus {
  status: string;
  total: number;
  revenue: number;
}

interface ByService {
  name: string;
  total_orders: number;
  total_quantity: number;
  revenue: number;
}

interface Order {
  id: number;
  order_number: string;
  order_date: string;
  customer: {
    name: string;
  };
  branch: {
    name: string;
  };
  total_weight: number;
  grand_total: number;
  status: string;
  is_paid: boolean;
}

interface Props {
  summary: Summary;
  byBranch: ByBranch[];
  byStatus: ByStatus[];
  byService: ByService[];
  orders: Order[];
  filters: {
    type: string;
    start_date: string;
    end_date: string;
    branch_id?: string;
  };
}

export default function ReportResult({
  summary,
  byBranch,
  byStatus,
  byService,
  orders,
  filters,
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
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

  // Data untuk pie chart status
  const pieData = byStatus.map((item) => ({
    name: statusColors[item.status]?.label || item.status,
    value: item.revenue,
  }));

  const COLORS = [
    '#4f46e5',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#ec4899',
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/owner/reports"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Form Laporan
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Hasil Laporan
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(filters.start_date)} -{' '}
                    {formatDate(filters.end_date)}
                  </p>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/owner/reports/export-excel?${new URLSearchParams(filters as any)}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  Excel
                </Link>
                <Link
                  href={`/owner/reports/export-pdf?${new URLSearchParams(filters as any)}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <FileText className="h-4 w-4 text-red-600" />
                  PDF
                </Link>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {/* Total Order */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Total Order
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-600">
                    {formatNumber(summary.total_orders)}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <ShoppingBag className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Total Revenue
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                    {formatCurrency(summary.total_revenue)}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Rata-rata */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Rata-rata
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-blue-600">
                    {formatCurrency(summary.average_order)}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Total Berat */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Total Berat
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600">
                    {formatNumber(summary.total_weight)} kg
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Lunas */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Lunas
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-green-600">
                    {formatNumber(summary.paid_orders)}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Belum Lunas */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Belum Lunas
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600">
                    {formatNumber(summary.unpaid_orders)}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue per Branch */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Revenue per Cabang
              </h2>
              <div className="h-80">
                {byBranch.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byBranch}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="branch_name" stroke="#64748b" />
                      <YAxis
                        stroke="#64748b"
                        tickFormatter={(value) => `Rp${value / 1000}K`}
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Bar
                        dataKey="total_revenue"
                        fill="#4f46e5"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Store className="h-12 w-12 opacity-20" />
                    <p className="ml-2">Tidak ada data</p>
                  </div>
                )}
              </div>
            </div>

            {/* Revenue by Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Revenue per Status
              </h2>
              <div className="h-80">
                {byStatus.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent! * 100).toFixed(0)}%`
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
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <AlertCircle className="h-12 w-12 opacity-20" />
                    <p className="ml-2">Tidak ada data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Services Table */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Top 5 Layanan
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Layanan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Total Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Total Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {byService.map((service, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {service.total_orders}x
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {service.total_quantity}{' '}
                        {service.name.includes('Cuci') ? 'kg' : 'pcs'}
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-600">
                        {formatCurrency(service.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders List */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Detail Order
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
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Cabang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Berat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-mono text-sm font-medium text-slate-900">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatDate(order.order_date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {order.customer.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {order.branch.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {order.total_weight} kg
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
                        {order.is_paid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <CheckCircle className="h-3 w-3" />
                            Lunas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <AlertCircle className="h-3 w-3" />
                            Belum
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
