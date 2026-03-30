import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Truck,
  Phone,
  Car,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

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
    current_page: number;
    last_page: number;
    total: number;
  };
  stats: {
    total: number;
    available: number;
    on_duty: number;
    offline: number;
  };
}

export default function AdminCouriersIndex({ couriers, stats }: Props) {
  const [updating, setUpdating] = useState<number | null>(null);

  const updateStatus = (courierId: number, status: string) => {
    if (confirm('Ubah status kurir?')) {
      setUpdating(courierId);
      router.post(
        `/admin/couriers/${courierId}/update-status`,
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
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
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
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Total Kurir</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Tersedia</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.available}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Bertugas</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.on_duty}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Offline</p>
              <p className="text-2xl font-bold text-gray-600">
                {stats.offline}
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
                    Order
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
                      <span className="text-sm font-medium">
                        {courier.orders_count || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders?courier_id=${courier.id}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-indigo-600 hover:bg-indigo-50"
                      >
                        <Eye className="h-4 w-4" /> Lihat Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {couriers.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                <button
                  disabled={couriers.current_page === 1}
                  onClick={() =>
                    router.get('/admin/couriers', {
                      page: couriers.current_page - 1,
                    })
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="text-sm">
                  Halaman {couriers.current_page} dari {couriers.last_page}
                </span>
                <button
                  disabled={couriers.current_page === couriers.last_page}
                  onClick={() =>
                    router.get('/admin/couriers', {
                      page: couriers.current_page + 1,
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
      </div>
    </AppLayout>
  );
}
