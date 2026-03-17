import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import {
  Brain,
  TrendingUp,
  Package,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';

interface InsightsProps {
  insights: {
    insight: string;
    data: any;
    generated_at: string;
    error?: string;
  };
}

export default function AIInsights({ insights }: InsightsProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    router.post(
      '/ai/refresh',
      {},
      {
        onFinish: () => setRefreshing(false),
      },
    );
  };

  const formatWITA = (dateStr: string) => {
    const date = new Date(dateStr);
    const witaDate = new Date(
      date.toLocaleString('en-US', { timeZone: 'Asia/Makassar' }),
    );

    const hari = witaDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      timeZone: 'Asia/Makassar',
    });
    const tanggal = witaDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Makassar',
    });
    const jam = witaDate
      .toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Makassar',
      })
      .replace(':', '.');

    return `${hari}, ${tanggal} pukul ${jam} WITA`;
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  AI Business Insights
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Analisis cerdas untuk pengambilan keputusan
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
              />
              Refresh Insight
            </button>
          </div>

          {/* Error State */}
          {insights.error && (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-rose-100 p-2">
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-rose-800">
                    Gagal Mendapatkan Insight
                  </h3>
                  <p className="mt-1 text-sm text-rose-600">{insights.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Insight Card */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">
                  Insight Hari Ini
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Diperbarui: {formatWITA(insights.generated_at)}
              </span>
            </div>

            <div className="prose prose-lg max-w-none">
              {insights.insight.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-slate-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Data Stats */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Current Month Stats */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Statistik Bulan Ini
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Order</span>
                  <span className="font-semibold text-slate-900">
                    {formatNumber(insights.data.total_orders_month)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Revenue</span>
                  <span className="font-semibold text-emerald-600">
                    {formatCurrency(insights.data.total_revenue_month)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Rata-rata Order
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(insights.data.avg_order_value)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Berat</span>
                  <span className="font-semibold text-slate-900">
                    {insights.data.total_weight_month} kg
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Growth</span>
                  <span
                    className={`font-semibold ${
                      insights.data.growth_percentage >= 0
                        ? 'text-emerald-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {insights.data.growth_percentage > 0 ? '+' : ''}
                    {insights.data.growth_percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Insights */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Package className="h-5 w-5 text-indigo-600" />
                Insight Tambahan
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Layanan Terlaris
                  </span>
                  <span className="font-semibold text-slate-900">
                    {insights.data.top_service}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Jam Tersibuk</span>
                  <span className="font-semibold text-slate-900">
                    {insights.data.busy_hour}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Hari Tersibuk</span>
                  <span className="font-semibold text-slate-900">
                    {insights.data.busy_day}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total Customer</span>
                  <span className="font-semibold text-slate-900">
                    {formatNumber(insights.data.total_customers)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Customer Baru</span>
                  <span className="font-semibold text-emerald-600">
                    +{insights.data.new_customers_month}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
