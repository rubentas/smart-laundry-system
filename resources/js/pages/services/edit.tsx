import { Link, useForm } from '@inertiajs/react';
import {
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  Clock,
  Scale,
  Box,
} from 'lucide-react';
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
  service: Service;
}

export default function ServiceEdit({ service }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    service_code: service.service_code,
    name: service.name,
    description: service.description || '',
    unit: service.unit,
    base_price: service.base_price.toString(),
    estimated_days: service.estimated_days,
    estimated_hours: service.estimated_hours || '',
    is_active: service.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/owner/services/${service.id}`);
  };

  const units = [
    { value: 'kg', label: 'Kilogram (kg)', icon: Scale },
    { value: 'pcs', label: 'Per Pieces (pcs)', icon: Box },
    { value: 'item', label: 'Per Item', icon: Package },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/owner/services"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Layanan
            </Link>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Package className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Edit Layanan
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {service.service_code} - {service.name}
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8 p-6">
                {/* Identitas Layanan */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Package className="h-5 w-5 text-indigo-600" />
                    Identitas Layanan
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Kode Layanan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={data.service_code}
                        onChange={(e) =>
                          setData('service_code', e.target.value.toUpperCase())
                        }
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      />
                      {errors.service_code && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.service_code}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Nama Layanan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Deskripsi
                      </label>
                      <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Unit & Harga */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                    Unit & Harga
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Satuan <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {units.map((unit) => {
                          const Icon = unit.icon;
                          return (
                            <button
                              key={unit.value}
                              type="button"
                              onClick={() => setData('unit', service.unit)}
                              className={`flex flex-col items-center gap-1 rounded-lg border p-3 transition-all ${
                                data.unit === unit.value
                                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                  : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="text-xs font-medium">
                                {unit.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {errors.unit && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.unit}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Harga Dasar <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          value={data.base_price}
                          onChange={(e) =>
                            setData('base_price', e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                          min="0"
                          step="1000"
                        />
                      </div>
                      {errors.base_price && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.base_price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estimasi Waktu */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    Estimasi Waktu
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Estimasi Hari <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={data.estimated_days}
                        onChange={(e) =>
                          setData('estimated_days', parseInt(e.target.value))
                        }
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        min="0"
                      />
                      {errors.estimated_days && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.estimated_days}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Estimasi Jam (Opsional)
                      </label>
                      <input
                        type="number"
                        value={data.estimated_hours}
                        onChange={(e) =>
                          setData(
                            'estimated_hours',
                            e.target.value ? parseInt(e.target.value) : '',
                          )
                        }
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        min="0"
                      />
                      <p className="mt-1 text-xs text-slate-400">
                        Kosongkan jika tidak perlu
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Status Layanan
                      </h3>
                      <p className="text-sm text-slate-500">
                        Nonaktifkan jika layanan tidak tersedia
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setData('is_active', !data.is_active)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
                        data.is_active ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          data.is_active ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <Link
                  href="/owner/services"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {processing ? 'Menyimpan...' : 'Update Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
