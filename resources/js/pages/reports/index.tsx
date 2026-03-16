import { router } from '@inertiajs/react';
import {
  FileText,
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Store,
  BarChart3,
  PieChart,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Branch {
  id: number;
  name: string;
}

interface Props {
  branches: Branch[];
  filters: {
    type?: string;
    start_date?: string;
    end_date?: string;
    branch_id?: string;
  };
}

export default function ReportIndex({ branches, filters }: Props) {
  const [type, setType] = useState(filters.type || 'daily');
  const [startDate, setStartDate] = useState(filters.start_date || '');
  const [endDate, setEndDate] = useState(filters.end_date || '');
  const [branchId, setBranchId] = useState(filters.branch_id || '');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    let start = '';
    let end = '';

    if (type === 'daily') {
      start = new Date().toISOString().split('T')[0];
      end = start;
    } else if (type === 'weekly') {
      const today = new Date();
      const first = today.getDate() - today.getDay() + 1;
      const last = first + 6;

      start = new Date(today.setDate(first)).toISOString().split('T')[0];
      end = new Date(today.setDate(last)).toISOString().split('T')[0];
    } else if (type === 'monthly') {
      const today = new Date();
      start = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];
    }

    router.get('/owner/reports/generate', {
      type,
      start_date: type === 'custom' ? startDate : start,
      end_date: type === 'custom' ? endDate : end,
      branch_id: branchId || undefined,
    });
  };

  const reportCards = [
    {
      title: 'Laporan Harian',
      description:
        'Ringkasan transaksi harian dengan detail per order dan revenue.',
      icon: Calendar,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      type: 'daily',
      stats: {
        label: 'Hari ini',
        value: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      },
    },
    {
      title: 'Laporan Mingguan',
      description:
        'Analisis performa mingguan dengan perbandingan hari dan tren.',
      icon: BarChart3,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      type: 'weekly',
      stats: {
        label: 'Minggu ini',
        value: 'Senin - Minggu',
      },
    },
    {
      title: 'Laporan Bulanan',
      description:
        'Rekap bulanan lengkap dengan grafik dan statistik mendalam.',
      icon: PieChart,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      type: 'monthly',
      stats: {
        label: 'Bulan ini',
        value: new Date().toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric',
        }),
      },
    },
    {
      title: 'Laporan Kustom',
      description:
        'Generate laporan dengan rentang tanggal sesuai kebutuhan Anda.',
      icon: FileText,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      type: 'custom',
      stats: {
        label: 'Fleksibel',
        value: 'Pilih tanggal',
      },
    },
  ];

  const quickStats = [
    {
      label: 'Total Order',
      value: '1,234',
      icon: ShoppingBag,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Total Revenue',
      value: 'Rp 45.6M',
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Rata-rata',
      value: 'Rp 37K',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Cabang Aktif',
      value: branches.length,
      icon: Store,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Laporan Bisnis
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Analisis lengkap performa laundry Anda
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100" />
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-600">
                        {stat.label}
                      </p>
                      <p className="mt-2 truncate text-2xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`ml-4 shrink-0 rounded-xl ${stat.bg} p-3`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Type Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reportCards.map((card) => {
              const Icon = card.icon;
              const isActive = type === card.type;

              return (
                <button
                  key={card.type}
                  onClick={() => setType(card.type)}
                  className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition-all ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                      : 'border-slate-200 bg-white shadow-sm hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="h-5 w-5 text-indigo-600" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`mb-4 inline-flex rounded-xl ${card.iconBg} p-3`}
                  >
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    {card.title}
                  </h3>

                  {/* Description with ellipsis */}
                  <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                    {card.description}
                  </p>

                  {/* Stats */}
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-medium text-slate-500">
                      {card.stats.label}
                    </p>
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {card.stats.value}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl">
            <form onSubmit={handleGenerate} className="p-8">
              <div className="space-y-6">
                {/* Selected Report Info */}
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    {type === 'daily' && (
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    )}
                    {type === 'weekly' && (
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                    )}
                    {type === 'monthly' && (
                      <PieChart className="h-5 w-5 text-indigo-600" />
                    )}
                    {type === 'custom' && (
                      <FileText className="h-5 w-5 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Laporan {reportCards.find((c) => c.type === type)?.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {type === 'daily' && 'Ringkasan transaksi hari ini'}
                      {type === 'weekly' && 'Analisis performa minggu ini'}
                      {type === 'monthly' && 'Rekap bulanan lengkap'}
                      {type === 'custom' && 'Rentang tanggal sesuai pilihan'}
                    </p>
                  </div>
                </div>

                {/* Date Range (untuk custom) */}
                {type === 'custom' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Tanggal Mulai
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Tanggal Akhir
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                )}

                {/* Filter Cabang */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Filter Cabang
                  </label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="">Semua Cabang</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-400">
                    {branchId
                      ? 'Menampilkan data untuk cabang tertentu'
                      : 'Menampilkan data semua cabang'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setType('daily');
                      setBranchId('');
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl"
                  >
                    <Download className="h-4 w-4" />
                    Generate Laporan
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Info & Quick Links */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">
                    Export Options
                  </h4>
                  <p className="text-xs text-blue-700">
                    Laporan dapat diexport ke format PDF dan Excel setelah
                    di-generate.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900">
                    Insight Otomatis
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Dapatkan ringkasan dan insight penting dari data transaksi
                    Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
