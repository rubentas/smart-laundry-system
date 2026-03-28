import { Link, router } from '@inertiajs/react';
import { Plus, Truck, Phone, Car } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Courier {
  id: number;
  name: string;
  phone: string;
  license_plate: string | null;
  status: 'available' | 'on_duty' | 'offline';
  balance: number;
  is_active: boolean;
  orders_count?: number;
}

interface Props {
  couriers: {
    data: Courier[];
    links: any[];
  };
}

export default function CouriersIndex({ couriers }: Props) {
  const [updating, setUpdating] = useState<number | null>(null);

  const updateStatus = (courierId: number, status: string) => {
    if (confirm('Ubah status kurir?')) {
      setUpdating(courierId);
      router.post(
        `/owner/couriers/${courierId}/update-status`,
        { status },
        {
          onFinish: () => setUpdating(null),
        },
      );
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      available: 'bg-green-100 text-green-800',
      on_duty: 'bg-yellow-100 text-yellow-800',
      offline: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      available: 'Tersedia',
      on_duty: 'Bertugas',
      offline: 'Offline',
    };
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Truck className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Manajemen Kurir
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Kelola kurir dan tracking pengiriman
                </p>
              </div>
            </div>
            <Link
              href="/owner/couriers/create"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Kurir
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Total Kurir</p>
              <p className="text-2xl font-bold text-slate-900">
                {couriers.data.length}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Tersedia</p>
              <p className="text-2xl font-bold text-green-600">
                {couriers.data.filter((c) => c.status === 'available').length}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Bertugas</p>
              <p className="text-2xl font-bold text-yellow-600">
                {couriers.data.filter((c) => c.status === 'on_duty').length}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Offline</p>
              <p className="text-2xl font-bold text-gray-600">
                {couriers.data.filter((c) => c.status === 'offline').length}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Kurir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Kontak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Plat Nomor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                    Saldo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {couriers.data.map((courier) => (
                  <tr key={courier.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-indigo-100 p-2">
                          <Truck className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {courier.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {courier.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{courier.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">
                          {courier.license_plate || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(courier.status)}
                        <select
                          value={courier.status}
                          onChange={(e) =>
                            updateStatus(courier.id, e.target.value)
                          }
                          disabled={updating === courier.id}
                          className="rounded border px-2 py-1 text-xs"
                        >
                          <option value="available">Tersedia</option>
                          <option value="on_duty">Bertugas</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">
                        Rp {courier.balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/owner/orders?courier_id=${courier.id}`}
                        className="mr-3 text-indigo-600 hover:text-indigo-800"
                      >
                        Lihat Order
                      </Link>
                      <button className="text-red-600 hover:text-red-800">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
