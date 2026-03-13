import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  ArrowLeft,
  Save,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  FileText,
  UserCircle2,
} from 'lucide-react';

export default function CustomerCreate() {
  const { data, setData, post, processing, errors } = useForm({
    customer_code: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    birth_date: '',
    gender: '',
    notes: '',
    is_active: true,
    is_member: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/owner/customers');
  };

  const generateCustomerCode = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    const code = `CST${year}${month}${day}${random}`;
    setData('customer_code', code);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/owner/customers"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Pelanggan
            </Link>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Tambah Pelanggan Baru
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi data pelanggan laundry
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8 p-6">
                {/* Kode Pelanggan */}
                <div>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Kode Pelanggan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={data.customer_code}
                        onChange={(e) =>
                          setData('customer_code', e.target.value.toUpperCase())
                        }
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="CTH: CST240101001"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={generateCustomerCode}
                      className="mb-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                    >
                      Generate
                    </button>
                  </div>
                  {errors.customer_code && (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.customer_code}
                    </p>
                  )}
                </div>

                {/* Data Pribadi */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <UserCircle2 className="h-5 w-5 text-indigo-600" />
                    Data Pribadi
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="Contoh: John Doe"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-rose-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Tanggal Lahir
                      </label>
                      <input
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Jenis Kelamin
                      </label>
                      <select
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      >
                        <option value="">Pilih</option>
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                      </select>
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
                      <div className="relative">
                        <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={data.phone}
                          onChange={(e) => setData('phone', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                          placeholder="08123456789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alamat */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    Alamat
                  </h3>

                  <div>
                    <textarea
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      placeholder="Jl. Contoh No. 123, Jakarta"
                    />
                  </div>
                </div>

                {/* Catatan */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Catatan
                  </h3>

                  <div>
                    <textarea
                      value={data.notes}
                      onChange={(e) => setData('notes', e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                      placeholder="Catatan khusus tentang pelanggan (opsional)"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Status Pelanggan
                      </h3>
                      <p className="text-sm text-slate-500">
                        Nonaktifkan jika pelanggan tidak aktif
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

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Member
                      </h3>
                      <p className="text-sm text-slate-500">
                        Aktifkan jika pelanggan adalah member
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setData('is_member', !data.is_member)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none ${
                        data.is_member ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          data.is_member ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <Link
                  href="/owner/customers"
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
                  {processing ? 'Menyimpan...' : 'Simpan Pelanggan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
