import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Building2, MapPin, Phone, Clock } from 'lucide-react';
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
    post('/owner/branches');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/owner/branches"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Cabang
            </Link>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Building2 className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Tambah Cabang Baru
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi informasi cabang laundry Anda
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit}>
              {/* Form Sections */}
              <div className="space-y-8 p-6">
                {/* Identitas Cabang */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    Identitas Cabang
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Kode Cabang <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={data.branch_code}
                        onChange={(e) =>
                          setData('branch_code', e.target.value.toUpperCase())
                        }
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="CTH: BRG-001"
                      />
                      {errors.branch_code && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.branch_code}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Nama Cabang <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="Contoh: Laundry Merdeka"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Alamat & Lokasi */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    Alamat & Lokasi
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Alamat Lengkap
                      </label>
                      <textarea
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        rows={3}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="Jl. Merdeka No. 10, Jakarta Pusat"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Kota
                        </label>
                        <input
                          type="text"
                          value={data.city}
                          onChange={(e) => setData('city', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                          placeholder="Jakarta"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Latitude
                          </label>
                          <input
                            type="text"
                            value={data.latitude}
                            onChange={(e) =>
                              setData('latitude', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                            placeholder="-6.2088"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            Longitude
                          </label>
                          <input
                            type="text"
                            value={data.longitude}
                            onChange={(e) =>
                              setData('longitude', e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                            placeholder="106.8456"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kontak */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Phone className="h-5 w-5 text-indigo-600" />
                    Kontak
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Nomor Telepon
                      </label>
                      <input
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="08123456789"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="cabang@laundry.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Jam Operasional */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    Jam Operasional
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Jam Buka
                      </label>
                      <input
                        type="time"
                        value={data.open_time}
                        onChange={(e) => setData('open_time', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Jam Tutup
                      </label>
                      <input
                        type="time"
                        value={data.close_time}
                        onChange={(e) => setData('close_time', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Status Cabang
                      </h3>
                      <p className="text-sm text-slate-500">
                        Nonaktifkan jika cabang tutup sementara
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
                  href="/owner/branches"
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
                  {processing ? 'Menyimpan...' : 'Simpan Cabang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
