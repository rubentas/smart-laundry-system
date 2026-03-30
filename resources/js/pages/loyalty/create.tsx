import { useForm } from '@inertiajs/react';
import { Gift } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

interface Service {
  id: number;
  name: string;
}

interface Props {
  services: Service[];
}

export default function LoyaltyCreate({ services }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    points_required: '',
    reward_type: 'discount' as 'discount' | 'free_service' | 'voucher',
    discount_value: '',
    service_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/owner/loyalty');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3">
              <Gift className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Tambah Reward
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Buat reward baru untuk program loyalitas
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nama Reward
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                  placeholder="Contoh: Diskon 10%"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Poin Dibutuhkan
                </label>
                <input
                  type="number"
                  value={data.points_required}
                  onChange={(e) => setData('points_required', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                  placeholder="100"
                  min="1"
                />
                {errors.points_required && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.points_required}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Tipe Reward
                </label>
                <select
                  value={data.reward_type}
                  onChange={(e) =>
                    setData(
                      'reward_type',
                      e.target.value as typeof data.reward_type,
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                >
                  <option value="discount">Diskon</option>
                  <option value="free_service">Layanan Gratis</option>
                  <option value="voucher">Voucher</option>
                </select>
                {errors.reward_type && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.reward_type}
                  </p>
                )}
              </div>

              {data.reward_type === 'discount' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Nilai Diskon (%)
                  </label>
                  <input
                    type="number"
                    value={data.discount_value}
                    onChange={(e) => setData('discount_value', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                    placeholder="10"
                    min="1"
                    max="100"
                  />
                  {errors.discount_value && (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.discount_value}
                    </p>
                  )}
                </div>
              )}

              {data.reward_type === 'free_service' && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Layanan
                  </label>
                  <select
                    value={data.service_id}
                    onChange={(e) => setData('service_id', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none"
                  >
                    <option value="">Pilih layanan...</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  {errors.service_id && (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.service_id}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Simpan Reward
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
