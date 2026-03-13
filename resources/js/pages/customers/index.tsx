import { Link, router } from '@inertiajs/react';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Calendar,
  DollarSign,
  MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';

interface Customer {
  id: number;
  customer_code: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  total_orders: number;
  total_spent: number | string;
  last_order_date: string | null;
  is_member: boolean;
  is_active: boolean;
}

interface Props {
  customers: {
    data: Customer[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
}

export default function CustomerIndex({ customers }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSpentDetail, setShowSpentDetail] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
    name: string;
  }>({
    open: false,
    id: null,
    name: '',
  });

  const handleDeleteClick = (id: number, name: string) => {
    setDeleteDialog({ open: true, id, name });
  };

  const confirmDelete = () => {
    if (deleteDialog.id) {
      router.delete(`/owner/customers/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/owner/customers', {
      search: searchTerm,
      status: filterStatus !== 'all' ? filterStatus : undefined,
    });
  };

  const formatCurrency = (amount: number | string | undefined | null) => {
    if (!amount) return 'Rp 0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return 'Rp 0';

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(num)
      .replace('IDR', 'Rp');
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const totalSpent = customers.data.reduce(
    (acc, c) => acc + parseFloat(c.total_spent?.toString() || '0'),
    0,
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Daftar Pelanggan
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Kelola data pelanggan laundry Anda
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/owner/customers/create"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 active:translate-y-0"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Tambah Pelanggan
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-5">
            {/* Card 1 - Total Pelanggan */}
            <div className="overflow-visible rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="text-sm font-medium text-slate-600">
                    Total Pelanggan
                  </p>
                  <p className="mt-2 text-3xl font-bold wrap-break-word text-slate-900">
                    {customers.total}
                  </p>
                </div>
                <div className="shrink-0 rounded-xl bg-indigo-50 p-3">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Card 2 - Member Aktif */}
            <div className="overflow-visible rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="text-sm font-medium text-slate-600">
                    Member Aktif
                  </p>
                  <p className="wrap-break-words mt-2 text-3xl font-bold text-amber-600">
                    {
                      customers.data.filter((c) => c.is_member && c.is_active)
                        .length
                    }
                  </p>
                </div>
                <div className="shrink-0 rounded-xl bg-amber-50 p-3">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Card 3 - Total Order */}
            <div className="overflow-visible rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="text-sm font-medium text-slate-600">
                    Total Order
                  </p>
                  <p className="wrap-break-words mt-2 text-3xl font-bold text-slate-900">
                    {customers.data.reduce((acc, c) => acc + c.total_orders, 0)}
                  </p>
                </div>
                <div className="shrink-0 rounded-xl bg-slate-50 p-3">
                  <Calendar className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </div>

            {/* Card 4 - Total Transaksi (Lihat Detail) */}
            <div
              onClick={() => setShowSpentDetail(true)}
              className="cursor-pointer overflow-visible rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="flex items-center gap-1 text-sm font-medium text-slate-600">
                    Total Transaksi
                    {/* <span className="ml-1 text-xs text-indigo-500">
                      (klik detail)
                    </span> */}
                  </p>
                  <p className="mt-2 max-w-32.5 truncate text-3xl font-bold text-emerald-600">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
                <div className="shrink-0 rounded-xl bg-emerald-50 p-3">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Card 5 - Halaman */}
            <div className="overflow-visible rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="text-sm font-medium text-slate-600">Halaman</p>
                  <p className="wrap-break-words mt-2 text-3xl font-bold text-slate-900">
                    {customers.current_page}{' '}
                    <span className="text-lg text-slate-400">
                      / {customers.last_page}
                    </span>
                  </p>
                </div>
                <div className="shrink-0 rounded-xl bg-slate-50 p-3">
                  <MoreHorizontal className="h-6 w-6 text-slate-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            {/* Table Header with Search */}
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">
                  Menampilkan {customers.from || 0} - {customers.to || 0}
                </span>
                <span className="text-slate-300">|</span>
                <span>Total {customers.total} pelanggan</span>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    router.get('/owner/customers', {
                      search: searchTerm,
                      status:
                        e.target.value !== 'all' ? e.target.value : undefined,
                    });
                  }}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                >
                  <option value="all">Semua</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                  <option value="member">Member</option>
                </select>

                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari pelanggan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 rounded-lg border border-slate-300 py-1.5 pr-4 pl-9 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                  />
                </form>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Kode
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Nama Pelanggan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Kontak
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Orders
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Transaksi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {customers.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <div className="mb-4 rounded-full bg-slate-100 p-4">
                            <Users className="h-12 w-12 text-slate-300" />
                          </div>
                          <p className="text-lg font-medium text-slate-600">
                            Belum ada pelanggan
                          </p>
                          <p className="mb-4 text-sm text-slate-500">
                            Tambahkan pelanggan pertama Anda
                          </p>
                          <Link
                            href="/owner/customers/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                          >
                            <Plus className="h-4 w-4" />
                            Tambah Pelanggan
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    customers.data.map((customer) => (
                      <tr
                        key={customer.id}
                        className="group transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 font-mono text-sm font-bold text-indigo-700 ring-1 ring-indigo-200">
                              {customer.customer_code.slice(0, 2)}
                            </div>
                            <span className="font-mono text-sm font-semibold text-slate-900">
                              {customer.customer_code}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                                {customer.name}
                              </span>
                              {customer.is_member && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
                                  <Star className="h-3 w-3" />
                                  Member
                                </span>
                              )}
                            </div>
                            {customer.address && (
                              <span className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                <MapPin className="h-3 w-3" />
                                {customer.address}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {customer.phone && (
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                {customer.phone}
                              </div>
                            )}
                            {customer.email && (
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                {customer.email}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-center">
                            <span className="text-lg font-semibold text-slate-900">
                              {customer.total_orders}
                            </span>
                            <span className="block text-xs text-slate-400">
                              {customer.last_order_date
                                ? formatDate(customer.last_order_date)
                                : 'Belum order'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-emerald-600">
                            {formatCurrency(customer.total_spent)}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                              customer.is_active
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${customer.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            />
                            {customer.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/owner/customers/${customer.id}/edit`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                              title="Edit pelanggan"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <Link
                              href={`/owner/customers/${customer.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                              title="Lihat detail"
                            >
                              <User className="h-3.5 w-3.5" />
                              Detail
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteClick(customer.id, customer.name)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50"
                              title="Hapus pelanggan"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {customers.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <button
                  disabled={customers.current_page === 1}
                  onClick={() =>
                    router.get('/owner/customers', {
                      page: customers.current_page - 1,
                      search: searchTerm,
                      status: filterStatus !== 'all' ? filterStatus : undefined,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, customers.last_page) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() =>
                        router.get('/owner/customers', {
                          page,
                          search: searchTerm,
                          status:
                            filterStatus !== 'all' ? filterStatus : undefined,
                        })
                      }
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                        page === customers.current_page
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {customers.last_page > 5 && (
                    <>
                      <span className="text-slate-400">...</span>
                      <button
                        onClick={() =>
                          router.get('/owner/customers', {
                            page: customers.last_page,
                            search: searchTerm,
                            status:
                              filterStatus !== 'all' ? filterStatus : undefined,
                          })
                        }
                        className="h-8 w-8 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200"
                      >
                        {customers.last_page}
                      </button>
                    </>
                  )}
                </div>

                <button
                  disabled={customers.current_page === customers.last_page}
                  onClick={() =>
                    router.get('/owner/customers', {
                      page: customers.current_page + 1,
                      search: searchTerm,
                      status: filterStatus !== 'all' ? filterStatus : undefined,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Selanjutnya
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Detail Total Transaksi */}
      <Dialog open={showSpentDetail} onOpenChange={setShowSpentDetail}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <DollarSign className="h-5 w-5" />
              Detail Total Transaksi per Pelanggan
            </DialogTitle>
            <DialogDescription>
              Rincian pengeluaran setiap pelanggan
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-100 overflow-y-auto pr-2">
            <div className="space-y-3 py-2">
              {customers.data.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between rounded-lg border-b border-slate-100 px-2 py-1 pb-2 transition-colors hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">
                        {customer.name}
                      </span>
                      {customer.is_member && (
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {customer.total_orders} order • {customer.customer_code}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(customer.total_spent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between font-bold">
              <span className="text-lg">Total Keseluruhan</span>
              <span className="text-xl text-emerald-600">
                {formatCurrency(totalSpent)}
              </span>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowSpentDetail(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-5 w-5" />
              Hapus Pelanggan
            </DialogTitle>
            <DialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus pelanggan{' '}
              <span className="font-semibold text-slate-900">
                {deleteDialog.name}
              </span>
              ?
              <br />
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({ open: false, id: null, name: '' })
              }
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
