import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Calendar,
  ArrowUp,
  ArrowDown,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface Props {
  revenueData: { labels: string[]; values: number[] };
  orderStats: {
    total_orders: number;
    avg_order: number;
    revenue: number;
    growth: number;
    revenue_growth: number;
    status_breakdown: Record<string, number>;
  };
  topServices: Array<{
    name: string;
    total_orders: number;
    revenue: number;
    total_quantity: number;
  }>;
  branchName: string;
  range: string;
}

export default function AdminAnalytics({
  revenueData,
  orderStats,
  topServices,
  branchName,
  range,
}: Props) {
  const [selectedRange, setSelectedRange] = useState(range);

  const ranges = [
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'year', label: 'Tahun Ini' },
  ];

  const handleRangeChange = (newRange: string) => {
    setSelectedRange(newRange);
    router.get(
      '/admin/analytics',
      { range: newRange },
      { preserveState: true },
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace('IDR', 'Rp');
  };

  const statusColors: Record<string, string> = {
    pending: '#64748b',
    washing: '#3b82f6',
    drying: '#06b6d4',
    ironing: '#f59e0b',
    ready_pickup: '#10b981',
    completed: '#059669',
    cancelled: '#ef4444',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    washing: 'Dicuci',
    drying: 'Dikeringkan',
    ironing: 'Disetrika',
    ready_pickup: 'Siap Diambil',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Analytics Cabang
                </h1>
                <p className="mt-1 text-sm text-slate-500">{branchName}</p>
              </div>
            </div>

            {/* Range Selector */}
            <div className="flex gap-2 rounded-xl bg-white p-1 shadow-sm">
              {ranges.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRangeChange(r.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedRange === r.value
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(orderStats.revenue)}
                  </p>
                </div>
                <div className="rounded-full bg-emerald-100 p-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm">
                {orderStats.revenue_growth > 0 ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    orderStats.revenue_growth > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {Math.abs(orderStats.revenue_growth)}%
                </span>
                <span className="text-slate-500">vs periode sebelumnya</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Orders</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {orderStats.total_orders}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm">
                {orderStats.growth > 0 ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    orderStats.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {Math.abs(orderStats.growth)}%
                </span>
                <span className="text-slate-500">vs periode sebelumnya</span>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Average Order</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(orderStats.avg_order)}
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Top Service</p>
                  <p className="truncate text-lg font-bold text-slate-900">
                    {topServices[0]?.name || '-'}
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">Revenue Trend</h3>
              </div>
              <Line
                data={{
                  labels: revenueData.labels,
                  datasets: [
                    {
                      label: 'Revenue',
                      data: revenueData.values,
                      borderColor: 'rgb(79, 70, 229)',
                      backgroundColor: 'rgba(79, 70, 229, 0.1)',
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (ctx) =>
                          `Rp ${(ctx.raw as number).toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Order Status Pie Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">
                  Order Status Distribution
                </h3>
              </div>
              <Pie
                data={{
                  labels: Object.keys(orderStats.status_breakdown).map(
                    (s) => statusLabels[s] || s,
                  ),
                  datasets: [
                    {
                      data: Object.values(orderStats.status_breakdown),
                      backgroundColor: Object.keys(
                        orderStats.status_breakdown,
                      ).map((s) => statusColors[s] || '#94a3b8'),
                    },
                  ],
                }}
                options={{ responsive: true }}
              />
            </div>
          </div>

          {/* Top Services */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-900">
              Top 5 Services
            </h3>
            <div className="space-y-4">
              {topServices.map((service, idx) => (
                <div key={service.name} className="flex items-center gap-4">
                  <div className="w-8 text-center font-bold text-indigo-600">
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{service.name}</span>
                      <span>{formatCurrency(service.revenue)}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-indigo-600"
                        style={{
                          width: `${(service.revenue / topServices[0].revenue) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-slate-500">
                      <span>{service.total_orders} orders</span>
                      <span>{service.total_quantity} unit</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
