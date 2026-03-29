import { useForm } from '@inertiajs/react';
import { Truck } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function CouriersCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    phone: '',
    license_plate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/owner/couriers');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-100 p-3">
              <Truck className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Tambah Kurir
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Daftarkan kurir baru
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nama Kurir
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Nama lengkap kurir"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="08xxxxxxxxxx"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Plat Nomor <span className="text-slate-400">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={data.license_plate}
                  onChange={(e) => setData('license_plate', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="B 1234 ABC"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
                <a
                  href="/owner/couriers"
                  className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
