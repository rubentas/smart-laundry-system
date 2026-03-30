import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Ticket,
  Search,
  Calendar,
  Percent,
  DollarSign,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Promo {
  id: number;
  code: string;
  name: string;
  description: string | null;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase: number;
  start_date: string;
  end_date: string;
  used_count: number;
  max_uses: number | null;
  is_active: boolean;
}

interface Props {
  promos: {
    data: Promo[];
    current_page: number;
    last_page: number;
    total: number;
  };
  filters: {
    search?: string;
    status?: string;
  };
}

export default function CashierPromoIndex({ promos, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace('IDR', 'Rp');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isActive = (promo: Promo) => {
    const now = new Date();
    const start = new Date(promo.start_date);
    const end = new Date(promo.end_date);
    return promo.is_active && now >= start && now <= end;
  };

  const getStatusBadge = (promo: Promo) => {
    const active = isActive(promo);
    if (!active) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
          <XCircle className="h-3 w-3" /> Tidak Aktif
        </span>
      );
    }
    if (promo.max_uses && promo.used_count >= promo.max_uses) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
          <XCircle className="h-3 w-3" /> Kuota Habis
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
        <CheckCircle className="h-3 w-3" /> Aktif
      </span>
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    router.get('/cashier/promo', {
      search: searchTerm || undefined,
      status: statusFilter || undefined,
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Ticket className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Promo & Diskon
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Informasi promo yang sedang berlangsung
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  router.get('/cashier/promo', {
                    search: searchTerm,
                    status: e.target.value || undefined,
                  });
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="expired">Kadaluarsa</option>
              </select>

              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari kode promo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Promo Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promos.data.length === 0 ? (
              <div className="col-span-full rounded-2xl bg-white p-12 text-center text-slate-400">
                <Ticket className="mx-auto mb-2 h-12 w-12 text-slate-300" />
                <p>Belum ada promo</p>
              </div>
            ) : (
              promos.data.map((promo) => {
                const active = isActive(promo);
                return (
                  <div
                    key={promo.id}
                    className={`rounded-2xl border bg-white p-5 shadow-sm transition-all ${active ? 'hover:shadow-md' : 'opacity-60'}`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-lg bg-indigo-100 px-3 py-1 font-mono text-sm font-bold text-indigo-700">
                        {promo.code}
                      </span>
                      {getStatusBadge(promo)}
                    </div>

                    <h3 className="mb-1 text-lg font-bold text-slate-900">
                      {promo.name}
                    </h3>
                    {promo.description && (
                      <p className="mb-3 text-sm text-slate-500">
                        {promo.description}
                      </p>
                    )}

                    <div className="mb-3 rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                        {promo.type === 'percentage' ? (
                          <>
                            <Percent className="h-5 w-5" /> {promo.value}%
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-5 w-5" />{' '}
                            {formatCurrency(promo.value)}
                          </>
                        )}
                      </div>
                      {promo.min_purchase > 0 && (
                        <p className="mt-1 text-xs text-slate-500">
                          Min. belanja {formatCurrency(promo.min_purchase)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1 text-xs text-slate-500">
                      <div className="flex items-center justify-between">
                        <span>Berlaku:</span>
                        <span>
                          {formatDate(promo.start_date)} -{' '}
                          {formatDate(promo.end_date)}
                        </span>
                      </div>
                      {promo.max_uses && (
                        <div className="flex items-center justify-between">
                          <span>Kuota:</span>
                          <span>
                            {promo.used_count} / {promo.max_uses}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {promos.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-sm">
              <button
                disabled={promos.current_page === 1}
                onClick={() =>
                  router.get('/cashier/promo', {
                    page: promos.current_page - 1,
                  })
                }
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <span className="text-sm">
                Halaman {promos.current_page} dari {promos.last_page}
              </span>
              <button
                disabled={promos.current_page === promos.last_page}
                onClick={() =>
                  router.get('/cashier/promo', {
                    page: promos.current_page + 1,
                  })
                }
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
