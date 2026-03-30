import { Link, router } from '@inertiajs/react';
import { Gift, Plus, Star, Trash2, Edit2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface LoyaltyReward {
  id: number;
  name: string;
  points_required: number;
  reward_type: 'discount' | 'free_service' | 'voucher';
  discount_value: number | null;
  is_active: boolean;
  service?: { name: string } | null;
}

interface Props {
  rewards: {
    data: LoyaltyReward[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function LoyaltyIndex({ rewards }: Props) {
  const rewardTypeLabel: Record<string, string> = {
    discount: 'Diskon',
    free_service: 'Layanan Gratis',
    voucher: 'Voucher',
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3">
                <Gift className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Loyalty Rewards
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Kelola reward program loyalitas
                </p>
              </div>
            </div>
            <Link
              href="/owner/loyalty/create"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-amber-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Reward
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                    Nama Reward
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                    Tipe
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                    Poin Dibutuhkan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-600 uppercase">
                    Detail
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
                {rewards.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center text-slate-400">
                        <Gift className="mb-3 h-12 w-12 opacity-30" />
                        <p className="font-medium text-slate-600">
                          Belum ada reward
                        </p>
                        <p className="text-sm">Tambahkan reward pertama Anda</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rewards.data.map((reward) => (
                    <tr key={reward.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {reward.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {rewardTypeLabel[reward.reward_type]}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                          <Star className="h-4 w-4" />
                          {reward.points_required.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {reward.reward_type === 'discount' &&
                          `${reward.discount_value}%`}
                        {reward.reward_type === 'free_service' &&
                          (reward.service?.name ?? '-')}
                        {reward.reward_type === 'voucher' && 'Voucher'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${reward.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                        >
                          {reward.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/owner/loyalty/${reward.id}/edit`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              router.delete(`/owner/loyalty/${reward.id}`)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:border-rose-200 hover:bg-rose-50"
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

            {rewards.last_page > 1 && (
              <div className="flex justify-end border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <span className="text-sm text-slate-500">
                  Halaman {rewards.current_page} dari {rewards.last_page} •{' '}
                  {rewards.total} reward
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
