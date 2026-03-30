import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Award, TrendingUp, Gift, ArrowLeft } from 'lucide-react';

interface Transaction {
  id: number;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  created_at: string;
  order?: {
    order_number: string;
  };
  reward?: {
    name: string;
  };
}

interface Stats {
  total_earned: number;
  total_redeemed: number;
  current_points: number;
}

interface Props {
  transactions: {
    data: Transaction[];
    current_page: number;
    last_page: number;
    total: number;
  };
  stats: Stats;
  customer: {
    name: string;
    membership_tier: string;
  };
}

export default function PointsHistory({
  transactions,
  stats,
  customer,
}: Props) {
  const getTierColor = (tier: string) => {
    const colors = {
      regular: 'text-gray-600 bg-gray-100',
      silver: 'text-gray-500 bg-gray-100',
      gold: 'text-amber-600 bg-amber-50',
      platinum: 'text-indigo-600 bg-indigo-50',
    };
    return colors[tier as keyof typeof colors] || colors.regular;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/customer/loyalty"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Loyalty
            </Link>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Riwayat Poin
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {customer.name} •
                  <span
                    className={`ml-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getTierColor(customer.membership_tier)}`}
                  >
                    {customer.membership_tier}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Poin Didapat</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.total_earned.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Poin Ditukar</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.total_redeemed.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-2">
                  <Gift className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Poin Saat Ini</p>
                  <p className="text-2xl font-bold">
                    {stats.current_points.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-2">
                  <Award className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Riwayat Transaksi
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Referensi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Jenis
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">
                      Poin
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {transactions.data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        <Award className="mx-auto mb-2 h-10 w-10 text-slate-300" />
                        <p>Belum ada riwayat transaksi poin</p>
                        <p className="text-sm">
                          Mulai order untuk mengumpulkan poin!
                        </p>
                      </td>
                    </tr>
                  ) : (
                    transactions.data.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(tx.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          {tx.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {tx.order && (
                            <span className="font-mono text-xs">
                              Order: {tx.order.order_number}
                            </span>
                          )}
                          {tx.reward && (
                            <span className="text-xs text-indigo-600">
                              Reward: {tx.reward.name}
                            </span>
                          )}
                          {!tx.order && !tx.reward && '-'}
                        </td>
                        <td className="px-6 py-4">
                          {tx.type === 'earn' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                              <TrendingUp className="h-3 w-3" />
                              Didapat
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                              <Gift className="h-3 w-3" />
                              Ditukar
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-medium ${tx.type === 'earn' ? 'text-green-600' : 'text-amber-600'}`}
                        >
                          {tx.type === 'earn' ? '+' : '-'}{' '}
                          {tx.points.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {transactions.last_page > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
                <div className="text-sm text-slate-500">
                  Total {transactions.total} transaksi
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={transactions.current_page === 1}
                    onClick={() =>
                      router.get('/customer/points', {
                        page: transactions.current_page - 1,
                      })
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sebelumnya
                  </button>
                  <span className="px-3 py-1 text-sm text-slate-500">
                    {transactions.current_page} / {transactions.last_page}
                  </span>
                  <button
                    disabled={
                      transactions.current_page === transactions.last_page
                    }
                    onClick={() =>
                      router.get('/customer/points', {
                        page: transactions.current_page + 1,
                      })
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
