import { useForm } from '@inertiajs/react';
import { Gift, Star, Award } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Customer {
  id: number;
  name: string;
  loyalty_points: number;
  membership_tier: string;
}

interface LoyaltyReward {
  id: number;
  name: string;
  points_required: number;
  reward_type: 'discount' | 'free_service' | 'voucher';
  discount_value: number | null;
  service?: { name: string } | null;
}

interface Transaction {
  id: number;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  created_at: string;
  reward?: { name: string } | null;
}

interface Props {
  customer: Customer;
  rewards: LoyaltyReward[];
  transactions: {
    data: Transaction[];
    current_page: number;
    last_page: number;
  };
}

export default function CustomerLoyalty({
  customer,
  rewards,
  transactions,
}: Props) {
  const { post, processing } = useForm({});

  const redeem = (rewardId: number) => {
    if (!confirm('Tukar reward ini?')) return;
    post(`/customer/loyalty/redeem`, {
      data: { reward_id: rewardId },
    });
  };

  const rewardTypeLabel: Record<string, string> = {
    discount: 'Diskon',
    free_service: 'Layanan Gratis',
    voucher: 'Voucher',
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3">
              <Award className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Loyalty Program
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Tukar poin Anda dengan reward menarik
              </p>
            </div>
          </div>

          {/* Points Summary */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white shadow-lg">
              <p className="text-sm opacity-90">Poin Anda</p>
              <p className="mt-1 text-4xl font-bold">
                {(customer.loyalty_points ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-5 text-white shadow-lg">
              <p className="text-sm opacity-90">Membership Tier</p>
              <p className="mt-1 text-3xl font-bold capitalize">
                {customer.membership_tier ?? 'regular'}
              </p>
            </div>
          </div>

          {/* Available Rewards */}
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Reward Tersedia
            </h2>
            {rewards.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
                <Gift className="mx-auto mb-3 h-12 w-12 opacity-20" />
                <p>Belum ada reward tersedia</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rewards.map((reward) => {
                  const canRedeem =
                    customer.loyalty_points >= reward.points_required;
                  return (
                    <div
                      key={reward.id}
                      className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${canRedeem ? 'border-amber-200' : 'border-slate-200 opacity-70'}`}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="rounded-lg bg-amber-50 p-2">
                          <Gift className="h-5 w-5 text-amber-600" />
                        </div>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {rewardTypeLabel[reward.reward_type]}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900">
                        {reward.name}
                      </h3>
                      {reward.reward_type === 'discount' && (
                        <p className="mt-1 text-sm text-slate-500">
                          Diskon {reward.discount_value}%
                        </p>
                      )}
                      {reward.reward_type === 'free_service' &&
                        reward.service && (
                          <p className="mt-1 text-sm text-slate-500">
                            {reward.service.name}
                          </p>
                        )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                          <Star className="h-4 w-4" />
                          {reward.points_required.toLocaleString()} poin
                        </span>
                        <button
                          onClick={() => redeem(reward.id)}
                          disabled={!canRedeem || processing}
                          className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Tukar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                Riwayat Poin Terbaru
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {transactions.data.length === 0 ? (
                <div className="px-6 py-8 text-center text-slate-400">
                  Belum ada riwayat poin
                </div>
              ) : (
                transactions.data.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between px-6 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {tx.description}
                      </p>
                      <p className="text-xs text-slate-400">{tx.created_at}</p>
                    </div>
                    <span
                      className={`font-semibold ${tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {tx.type === 'earn' ? '+' : '-'}
                      {tx.points.toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
