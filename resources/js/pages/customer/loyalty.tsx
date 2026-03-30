import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Award,
  Gift,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Reward {
  id: number;
  name: string;
  description: string;
  points_required: number;
  reward_type: string;
  discount_value: number;
  service: { name: string } | null;
}

interface Transaction {
  id: number;
  type: string;
  points: number;
  description: string;
  created_at: string;
  reward?: { name: string };
}

interface Props {
  customer: {
    id: number;
    name: string;
    loyalty_points: number;
    membership_tier: string;
  };
  rewards: Reward[];
  transactions: { data: Transaction[]; links: any[] };
}

export default function CustomerLoyalty({
  customer,
  rewards,
  transactions,
}: Props) {
  const [redeeming, setRedeeming] = useState<number | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const getTierColor = (tier: string) => {
    const colors = {
      regular: 'from-gray-500 to-gray-600',
      silver: 'from-gray-400 to-gray-500',
      gold: 'from-amber-500 to-orange-500',
      platinum: 'from-indigo-500 to-purple-500',
    };
    return colors[tier as keyof typeof colors] || colors.regular;
  };

  const getTierIcon = (tier: string) => {
    const icons = {
      regular: <Star className="h-5 w-5" />,
      silver: <Star className="h-5 w-5" />,
      gold: <Star className="h-5 w-5 fill-amber-500" />,
      platinum: <Award className="h-5 w-5" />,
    };
    return icons[tier as keyof typeof icons] || icons.regular;
  };

  const handleRedeem = (reward: Reward) => {
    if (customer.loyalty_points < reward.points_required) return;
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;
    setRedeeming(selectedReward.id);
    router.post(
      '/customer/redeem',
      { reward_id: selectedReward.id },
      {
        onFinish: () => {
          setRedeeming(null);
          setShowRedeemModal(false);
          router.reload();
        },
      },
    );
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Loyalty Program
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Tukar poinmu dengan reward menarik
                </p>
              </div>
            </div>
          </div>

          {/* Points Card */}
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
                <p className="text-sm opacity-90">Total Poin</p>
                <p className="text-3xl font-bold">
                  {customer.loyalty_points?.toLocaleString() || 0}
                </p>
              </div>
              <div
                className={`rounded-lg bg-gradient-to-r ${getTierColor(customer.membership_tier)} p-4 text-white`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-90">Membership Tier</p>
                  {getTierIcon(customer.membership_tier)}
                </div>
                <p className="text-2xl font-bold capitalize">
                  {customer.membership_tier}
                </p>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white">
                <p className="text-sm opacity-90">Points Multiplier</p>
                <p className="text-2xl font-bold">
                  {customer.membership_tier === 'regular' && '1x'}
                  {customer.membership_tier === 'silver' && '1.2x'}
                  {customer.membership_tier === 'gold' && '1.5x'}
                  {customer.membership_tier === 'platinum' && '2x'}
                </p>
              </div>
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Tukar Poin
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rewards.map((reward) => {
                const isEligible =
                  customer.loyalty_points >= reward.points_required;
                return (
                  <div
                    key={reward.id}
                    className={`rounded-xl border p-5 transition-all ${
                      isEligible
                        ? 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md'
                        : 'border-slate-100 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="rounded-lg bg-indigo-100 p-2">
                        <Gift className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-sm font-bold text-amber-600">
                        {reward.points_required} poin
                      </span>
                    </div>
                    <h3 className="mb-1 font-semibold text-slate-900">
                      {reward.name}
                    </h3>
                    <p className="mb-3 text-sm text-slate-500">
                      {reward.description || 'Tukarkan poinmu sekarang!'}
                    </p>
                    <div className="mb-3 text-xs text-slate-400">
                      {reward.reward_type === 'discount' &&
                        `Diskon ${reward.discount_value}%`}
                      {reward.reward_type === 'free_service' &&
                        `Gratis ${reward.service?.name || 'Layanan'}`}
                      {reward.reward_type === 'voucher' && 'Voucher Belanja'}
                    </div>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!isEligible || redeeming === reward.id}
                      className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                        isEligible
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'cursor-not-allowed bg-slate-200 text-slate-400'
                      }`}
                    >
                      {redeeming === reward.id
                        ? 'Memproses...'
                        : 'Tukar Sekarang'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction History */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Riwayat Transaksi Poin
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500">
                      Jenis
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500">
                      Poin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {transactions.data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-slate-400"
                      >
                        Belum ada transaksi poin
                      </td>
                    </tr>
                  ) : (
                    transactions.data.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {tx.description}
                        </td>
                        <td className="px-6 py-4">
                          {tx.type === 'earn' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                              <TrendingUp className="h-3 w-3" /> Didapat
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                              <Gift className="h-3 w-3" /> Ditukar
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-medium ${tx.type === 'earn' ? 'text-green-600' : 'text-amber-600'}`}
                        >
                          {tx.type === 'earn' ? '+' : '-'} {tx.points}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              Konfirmasi Tukar Poin
            </h3>
            <p className="mb-4 text-slate-600">
              Yakin ingin menukar{' '}
              <span className="font-bold">
                {selectedReward.points_required} poin
              </span>{' '}
              untuk:
            </p>
            <p className="mb-6 rounded-lg bg-indigo-50 p-3 text-center font-semibold text-indigo-700">
              {selectedReward.name}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className="flex-1 rounded-lg border border-slate-300 py-2 text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 rounded-lg bg-indigo-600 py-2 text-white hover:bg-indigo-700"
              >
                Ya, Tukar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
