import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar,
  PieChart,
  BarChart3,
  LineChart,
} from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
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
  customerStats: {
    new_customers: number;
    repeat_customers: number;
    member_order_percentage: number;
  };
  prediction: {
    next_month: number;
    trend: string;
    slope_percentage: number;
  };
  range: string;
}

export default function AnalyticsIndex({
  revenueData,
  orderStats,
  topServices,
  customerStats,
  prediction,
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
      '/owner/analytics',
      { range: newRange },
      { preserveState: true },
    );
  };

  const getTrendIcon = () => {
    if (prediction.trend === 'up')
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (prediction.trend === 'down')
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-yellow-500" />;
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    washing: 'bg-blue-500',
    drying: 'bg-purple-500',
    ironing: 'bg-orange-500',
    ready_pickup: 'bg-green-500',
    completed: 'bg-emerald-500',
    cancelled: 'bg-red-500',
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
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Dashboard Analytics
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Analisis data dan prediksi performa bisnis
                  </p>
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
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-slate-900">
                    Rp {orderStats.revenue.toLocaleString()}
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
                    Rp {orderStats.avg_order.toLocaleString()}
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
                  <p className="text-sm text-slate-500">New Customers</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {customerStats.new_customers}
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-500">
                {customerStats.repeat_customers} repeat customers
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">Revenue Trend</h3>
              </div>
              <div className="relative h-64">
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
                    maintainAspectRatio: false,
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
            </div>

            {/* Order Status Pie Chart */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">
                  Order Status Distribution
                </h3>
              </div>
              <div className="relative h-64">
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
                        )
                          .map(
                            (s) =>
                              statusColors[s]?.replace(
                                'bg-',
                                'rgba(59, 130, 246, ',
                              ) || 'rgba(156, 163, 175, ',
                          )
                          .map((c) => c + '0.8)'),
                      },
                    ],
                  }}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>

          {/* Top Services & Prediction */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                        <span>Rp {service.revenue.toLocaleString()}</span>
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

            {/* Prediction Card */}
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Prediksi Revenue</p>
                  <p className="mt-1 text-3xl font-bold">
                    Rp {prediction.next_month.toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm opacity-80">
                    untuk periode berikutnya
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  {getTrendIcon()}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-white/20 pt-4">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  Trend:{' '}
                  {prediction.trend === 'up'
                    ? 'Meningkat'
                    : prediction.trend === 'down'
                      ? 'Menurun'
                      : 'Stabil'}
                  {prediction.slope_percentage !== 0 &&
                    ` (${Math.abs(prediction.slope_percentage)}%)`}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-900">
              Customer Insights
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">
                  {customerStats.new_customers}
                </p>
                <p className="text-sm text-slate-500">New Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {customerStats.repeat_customers}
                </p>
                <p className="text-sm text-slate-500">Repeat Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {customerStats.member_order_percentage}%
                </p>
                <p className="text-sm text-slate-500">Member Orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
