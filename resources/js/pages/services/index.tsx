import { Link, router } from '@inertiajs/react';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  Clock,
  DollarSign,
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Scale,
  Box,
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

interface Service {
  id: number;
  service_code: string;
  name: string;
  description: string | null;
  unit: 'kg' | 'pcs' | 'item';
  base_price: number;
  estimated_days: number;
  estimated_hours: number | null;
  is_active: boolean;
}

interface Props {
  services: {
    data: Service[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
}

export default function ServiceIndex({ services }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
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
      router.delete(`/owner/services/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/owner/services', { search: searchTerm });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getUnitIcon = (unit: string) => {
    switch (unit) {
      case 'kg':
        return <Scale className="h-3 w-3" />;
      case 'pcs':
        return <Box className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3">
                  <Package className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Daftar Layanan
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Kelola layanan laundry yang tersedia
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/owner/services/create"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 active:translate-y-0"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Tambah Layanan
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Layanan
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {services.total}
                  </p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-3">
                  <Package className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Layanan Aktif
                  </p>
                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {services.data.filter((s) => s.is_active).length}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Harga Termurah
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {formatPrice(
                      Math.min(...services.data.map((s) => s.base_price)),
                    )}
                  </p>
                </div>
                <div className="rounded-xl bg-green-50 p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Rata-rata Harga
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {formatPrice(
                      services.data.reduce((acc, s) => acc + s.base_price, 0) /
                        services.data.length || 0,
                    )}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
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
                  Menampilkan {services.from || 0} - {services.to || 0}
                </span>
                <span className="text-slate-300">|</span>
                <span>Total {services.total} layanan</span>
              </div>

              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari layanan..."
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
                      Layanan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Estimasi
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
                  {services.data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <div className="mb-4 rounded-full bg-slate-100 p-4">
                            <Package className="h-12 w-12 text-slate-300" />
                          </div>
                          <p className="text-lg font-medium text-slate-600">
                            Belum ada layanan
                          </p>
                          <p className="mb-4 text-sm text-slate-500">
                            Tambahkan layanan pertama Anda
                          </p>
                          <Link
                            href="/owner/services/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                          >
                            <Plus className="h-4 w-4" />
                            Tambah Layanan
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    services.data.map((service) => (
                      <tr
                        key={service.id}
                        className="group transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 font-mono text-sm font-bold text-indigo-700 ring-1 ring-indigo-200">
                              {service.service_code.slice(0, 2)}
                            </div>
                            <span className="font-mono text-sm font-semibold text-slate-900">
                              {service.service_code}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                              {service.name}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                              {getUnitIcon(service.unit)}
                              {service.unit === 'kg'
                                ? 'Per Kilogram'
                                : service.unit === 'pcs'
                                  ? 'Per Pcs'
                                  : 'Per Item'}
                            </span>
                            {service.description && (
                              <span className="mt-1 line-clamp-1 text-xs text-slate-500">
                                {service.description}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-slate-400" />
                            <span className="font-semibold text-slate-900">
                              {formatPrice(service.base_price)}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-700">
                              {service.estimated_days}{' '}
                              {service.estimated_days > 1 ? 'hari' : 'hari'}
                              {service.estimated_hours &&
                                ` (${service.estimated_hours} jam)`}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                              service.is_active
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${service.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            />
                            {service.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/owner/services/${service.id}/edit`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                              title="Edit layanan"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteClick(service.id, service.name)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50"
                              title="Hapus layanan"
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
            {services.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <button
                  disabled={services.current_page === 1}
                  onClick={() =>
                    router.get('/owner/services', {
                      page: services.current_page - 1,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, services.last_page) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => router.get('/owner/services', { page })}
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                        page === services.current_page
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {services.last_page > 5 && (
                    <>
                      <span className="text-slate-400">...</span>
                      <button
                        onClick={() =>
                          router.get('/owner/services', {
                            page: services.last_page,
                          })
                        }
                        className="h-8 w-8 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200"
                      >
                        {services.last_page}
                      </button>
                    </>
                  )}
                </div>

                <button
                  disabled={services.current_page === services.last_page}
                  onClick={() =>
                    router.get('/owner/services', {
                      page: services.current_page + 1,
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <Trash2 className="h-5 w-5" />
              Hapus Layanan
            </DialogTitle>
            <DialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus layanan{' '}
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
