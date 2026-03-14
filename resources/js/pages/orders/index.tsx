import { Link, router } from '@inertiajs/react';
import {
  Plus,
  Eye,
  Printer,
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  User,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Package,
  X,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Order {
  id: number;
  order_number: string;
  customer: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
  };
  cashier: {
    id: number;
    name: string;
  };
  order_date: string;
  pickup_date: string | null;
  status:
    | 'pending'
    | 'washing'
    | 'drying'
    | 'ironing'
    | 'ready_pickup'
    | 'completed'
    | 'cancelled';
  total_weight: number;
  grand_total: number | string | null;
  is_paid: boolean;
  payment_method: string | null;
}

interface Props {
  orders: {
    data: Order[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
  filters: {
    search?: string;
    status?: string;
    date?: string;
  };
}

export default function OrderIndex({ orders, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');
  const [dateFilter, setDateFilter] = useState(filters.date || '');
  const [showRevenueDetail, setShowRevenueDetail] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    router.get('/owner/orders', {
      search: searchTerm || undefined,
      status: statusFilter || undefined,
      date: dateFilter || undefined,
    });
  };

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const config = statusColors[status] || statusColors.pending;
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.text.replace('text', 'bg')}`}
        />
        {config.label}
      </span>
    );
  };

  const totalRevenue = orders.data.reduce(
    (acc, o) => acc + toNumber(o.grand_total),
    0,
  );

  const sortedOrdersByRevenue = [...orders.data].sort((a, b) => 
    toNumber(b.grand_total) - toNumber(a.grand_total)
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3">
                  <ShoppingBag className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Daftar Order
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Kelola semua transaksi laundry
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/owner/orders/create"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 active:translate-y-0"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Order Baru
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Order
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {orders.total}
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
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="mt-2 text-3xl font-bold text-amber-600">
                    {orders.data.filter((o) => o.status === 'pending').length}
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
                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {
                      orders.data.filter((o) => o.status === 'ready_pickup')
                        .length
                    }
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* Card Total Revenue */}
            <div 
              onClick={() => setShowRevenueDetail(true)}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-medium text-slate-600 flex items-center gap-1">
                    Total Revenue
                  </p>
                  <p className="mt-2 text-3xl font-bold text-emerald-600 truncate">
                    {formatCurrency(totalRevenue)}
                  </p>
                </div>
                <div className="shrink-0 rounded-xl bg-emerald-50 p-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-medium">
                    Menampilkan {orders.from || 0} - {orders.to || 0}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span>Total {orders.total} order</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      router.get('/owner/orders', {
                        search: searchTerm,
                        status: e.target.value || undefined,
                        date: dateFilter,
                      });
                    }}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                  >
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="washing">Mencuci</option>
                    <option value="drying">Mengering</option>
                    <option value="ironing">Menyetrika</option>
                    <option value="ready_pickup">Siap Ambil</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>

                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      router.get('/owner/orders', {
                        search: searchTerm,
                        status: statusFilter,
                        date: e.target.value || undefined,
                      });
                    }}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                  />

                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari no order / pelanggan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64 rounded-lg border border-slate-300 py-1.5 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                    />
                  </form>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      No Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Pelanggan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Berat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Pembayaran
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {orders.data.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center text-slate-400">
                          <ShoppingBag className="mb-4 h-12 w-12 text-slate-300" />
                          <p className="text-lg font-medium text-slate-600">
                            Belum ada order
                          </p>
                          <p className="mb-4 text-sm text-slate-500">
                            Buat order baru untuk memulai
                          </p>
                          <Link
                            href="/owner/orders/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                          >
                            <Plus className="h-4 w-4" />
                            Order Baru
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.data.map((order) => (
                      <tr
                        key={order.id}
                        className="group transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 font-mono text-xs font-bold text-indigo-700">
                              #{order.id}
                            </div>
                            <span className="font-mono text-sm font-semibold text-slate-900">
                              {order.order_number}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-900">
                              {order.customer.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-700">
                            {formatDate(order.order_date)}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Package className="h-4 w-4 text-slate-400" />
                            <span>{order.total_weight} kg</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-emerald-600">
                            {formatCurrency(toNumber(order.grand_total))}
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

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/owner/orders/${order.id}`}
                              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                              title="Detail"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`/owner/orders/${order.id}/print`}
                              className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
                              title="Cetak Nota"
                            >
                              <Printer className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {orders.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <button
                  disabled={orders.current_page === 1}
                  onClick={() =>
                    router.get('/owner/orders', {
                      page: orders.current_page - 1,
                      search: searchTerm,
                      status: statusFilter,
                      date: dateFilter,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, orders.last_page) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() =>
                        router.get('/owner/orders', {
                          page,
                          search: searchTerm,
                          status: statusFilter,
                          date: dateFilter,
                        })
                      }
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                        page === orders.current_page
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={orders.current_page === orders.last_page}
                  onClick={() =>
                    router.get('/owner/orders', {
                      page: orders.current_page + 1,
                      search: searchTerm,
                      status: statusFilter,
                      date: dateFilter,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Detail Revenue */}
      <Dialog open={showRevenueDetail} onOpenChange={setShowRevenueDetail}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <DollarSign className="h-5 w-5" />
              Detail Revenue per Order
            </DialogTitle>
            <DialogDescription>
              Rincian pendapatan dari setiap transaksi (diurutkan dari tertinggi)
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-y-auto pr-2">
            <div className="space-y-3 py-2">
              {sortedOrdersByRevenue.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between border-b border-slate-100 pb-2 hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{order.order_number}</span>
                      {order.is_paid ? (
                        <CheckCircle className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {order.customer.name} • {formatDateOnly(order.order_date)} • {order.total_weight} kg
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(toNumber(order.grand_total))}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 mt-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-lg">Total Revenue</span>
              <span className="text-xl text-emerald-600">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowRevenueDetail(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}