import { Link, router } from '@inertiajs/react';
import {
  Eye,
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
  Truck,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

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
  order_date: string;
  status: string;
  total_weight: number;
  grand_total: number;
  is_paid: boolean;
  need_delivery: boolean;
  delivery_status: string | null;
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
  };
}

export default function CustomerOrders({ orders, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

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

  const deliveryStatusLabels: Record<string, string> = {
    pending: 'Menunggu Kurir',
    waiting_pickup: 'Menunggu Diambil',
    picked_up: 'Sudah Diambil',
    on_delivery: 'Dalam Perjalanan',
    delivered: 'Telah Dikirim',
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    router.get('/customer/orders', {
      search: searchTerm || undefined,
      status: statusFilter || undefined,
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
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const config = statusColors[status] || statusColors.pending;
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <ShoppingBag className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Order Saya
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Lihat riwayat dan status order laundry Anda
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Order</p>
              <p className="text-2xl font-bold text-slate-900">
                {orders.total}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Sedang Diproses</p>
              <p className="text-2xl font-bold text-amber-600">
                {
                  orders.data.filter((o) =>
                    ['pending', 'washing', 'drying', 'ironing'].includes(
                      o.status,
                    ),
                  ).length
                }
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Siap Diambil</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.data.filter((o) => o.status === 'ready_pickup').length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Selesai</p>
              <p className="text-2xl font-bold text-emerald-600">
                {orders.data.filter((o) => o.status === 'completed').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  router.get('/customer/orders', {
                    search: searchTerm,
                    status: e.target.value || undefined,
                  });
                }}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
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

              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nomor order..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      No Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Cabang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Berat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Pengiriman
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {orders.data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        <ShoppingBag className="mx-auto mb-2 h-10 w-10 text-slate-300" />
                        <p>Belum ada order</p>
                      </td>
                    </tr>
                  ) : (
                    orders.data.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-sm font-medium text-slate-900">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(order.order_date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {order.branch.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4 text-slate-400" />
                            {order.total_weight} kg
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-emerald-600">
                          {formatCurrency(order.grand_total)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4">
                          {order.need_delivery ? (
                            <span className="inline-flex items-center gap-1 text-xs">
                              <Truck className="h-3 w-3 text-indigo-500" />
                              {deliveryStatusLabels[
                                order.delivery_status || 'pending'
                              ] || 'Menunggu'}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Ambil sendiri
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {order.is_paid ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <CheckCircle className="h-3 w-3" /> Lunas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                              <AlertCircle className="h-3 w-3" /> Belum
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/customer/orders/${order.id}`}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-indigo-600 hover:bg-indigo-50"
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

            {/* Pagination */}
            {orders.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                <button
                  disabled={orders.current_page === 1}
                  onClick={() =>
                    router.get('/customer/orders', {
                      page: orders.current_page - 1,
                      search: searchTerm,
                      status: statusFilter,
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" /> Sebelumnya
                </button>
                <span className="text-sm text-slate-600">
                  Halaman {orders.current_page} dari {orders.last_page}
                </span>
                <button
                  disabled={orders.current_page === orders.last_page}
                  onClick={() =>
                    router.get('/customer/orders', {
                      page: orders.current_page + 1,
                      search: searchTerm,
                      status: statusFilter,
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                >
                  Selanjutnya <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
