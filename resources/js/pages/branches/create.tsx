import { Link, useForm } from '@inertiajs/react';
import React from 'react';
import route from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';

export default function BranchCreate() {
  const { data, setData, post, processing, errors } = useForm({
    branch_code: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    city: '',
    latitude: '',
    longitude: '',
    open_time: '08:00',
    close_time: '21:00',
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('branches.store'));
  };

  return (
    <AppLayout>
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <h1 className="mb-6 text-2xl font-bold">Tambah Cabang Baru</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kode Cabang
                    </label>
                    <input
                      type="text"
                      value={data.branch_code}
                      onChange={(e) => setData('branch_code', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.branch_code && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.branch_code}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Cabang
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Alamat
                    </label>
                    <textarea
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telepon
                    </label>
                    <input
                      type="text"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kota
                    </label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Jam Buka
                      </label>
                      <input
                        type="time"
                        value={data.open_time}
                        onChange={(e) => setData('open_time', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Jam Tutup
                      </label>
                      <input
                        type="time"
                        value={data.close_time}
                        onChange={(e) => setData('close_time', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data.is_active}
                      onChange={(e) => setData('is_active', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Aktif
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Link
                    href={route('branches.index')}
                    className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {processing ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
