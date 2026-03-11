import { Link, router } from '@inertiajs/react';
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Building2,
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
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

interface Branch {
  id: number;
  branch_code: string;
  name: string;
  city: string;
  phone: string;
  is_active: boolean;
  address?: string;
}

interface Props {
  branches: {
    data: Branch[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
}

export default function BranchIndex({ branches }: Props) {
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
      router.delete(`/owner/branches/${deleteDialog.id}`);
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/owner/branches', { search: searchTerm });
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
                  <Building2 className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Daftar Cabang
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Kelola semua cabang bisnis Anda dalam satu tempat
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/owner/branches/create"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-300 active:translate-y-0"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              Tambah Cabang
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Cabang
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {branches.total}
                  </p>
                </div>
                <div className="rounded-xl bg-indigo-50 p-3">
                  <Building2 className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Cabang Aktif
                  </p>
                  <p className="mt-2 text-3xl font-bold text-emerald-600">
                    {branches.data.filter((b) => b.is_active).length}
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
                    Cabang Nonaktif
                  </p>
                  <p className="mt-2 text-3xl font-bold text-rose-600">
                    {branches.data.filter((b) => !b.is_active).length}
                  </p>
                </div>
                <div className="rounded-xl bg-rose-50 p-3">
                  <XCircle className="h-6 w-6 text-rose-600" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Halaman</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {branches.current_page}{' '}
                    <span className="text-lg text-slate-400">
                      / {branches.last_page}
                    </span>
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
                  Menampilkan {branches.from || 0} - {branches.to || 0}
                </span>
                <span className="text-slate-300">|</span>
                <span>Total {branches.total} cabang</span>
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
                    placeholder="Cari cabang..."
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
                      Nama Cabang
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Lokasi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                      Kontak
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
                  {branches.data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <div className="mb-4 rounded-full bg-slate-100 p-4">
                            <Building2 className="h-12 w-12 text-slate-300" />
                          </div>
                          <p className="text-lg font-medium text-slate-600">
                            Belum ada cabang
                          </p>
                          <p className="mb-4 text-sm text-slate-500">
                            Tambahkan cabang pertama Anda untuk memulai
                          </p>
                          <Link
                            href="/owner/branches/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                          >
                            <Plus className="h-4 w-4" />
                            Tambah Cabang
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    branches.data.map((branch) => (
                      <tr
                        key={branch.id}
                        className="group transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 font-mono text-sm font-bold text-indigo-700 ring-1 ring-indigo-200">
                              {branch.branch_code.slice(0, 2)}
                            </div>
                            <span className="font-mono text-sm font-semibold text-slate-900">
                              {branch.branch_code}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                              {branch.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              ID: #{branch.id}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="text-sm">
                              {branch.city || '-'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-medium">
                              {branch.phone || '-'}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                              branch.is_active
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                                : 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${branch.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            />
                            {branch.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/owner/branches/${branch.id}/edit`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                              title="Edit cabang"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                            <button
                              onClick={() =>
                                handleDeleteClick(branch.id, branch.name)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50"
                              title="Hapus cabang"
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
            {branches.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <button
                  disabled={branches.current_page === 1}
                  onClick={() =>
                    router.get('/owner/branches', {
                      page: branches.current_page - 1,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Sebelumnya
                </button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, branches.last_page) },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => router.get('/owner/branches', { page })}
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                        page === branches.current_page
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {branches.last_page > 5 && (
                    <>
                      <span className="text-slate-400">...</span>
                      <button
                        onClick={() =>
                          router.get('/owner/branches', {
                            page: branches.last_page,
                          })
                        }
                        className="h-8 w-8 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200"
                      >
                        {branches.last_page}
                      </button>
                    </>
                  )}
                </div>

                <button
                  disabled={branches.current_page === branches.last_page}
                  onClick={() =>
                    router.get('/owner/branches', {
                      page: branches.current_page + 1,
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
              Hapus Cabang
            </DialogTitle>
            <DialogDescription className="pt-2">
              Apakah Anda yakin ingin menghapus cabang{' '}
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
