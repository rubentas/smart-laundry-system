import { Link } from '@inertiajs/react';
import { Star, TrendingUp, TrendingDown, ChevronLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Customer {
  id: number;
  name: string;
  loyalty_points: number;
  membership_tier: string;
}

interface Transaction {
  id: number;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  created_at: string;
  order?: { order_number: string } | null;
  reward?: { name: string } | null;
}

interface Props {
  customer: Customer;
  transactions: {
    data: Transaction[];
    current_page: number;
    last_page: number;
    total: number;
  };
}

export default function CustomerPoints({ customer, transactions }: Props) {
  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={`/owner/customers/${customer.id}`}
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali ke detail pelanggan
            </Link>
          </div>

          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3">
              <Star className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Riwayat Poin
              </h1>
              <p className="mt-1 text-sm text-slate-500">{customer.name}</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Poin Saat Ini</p>
              <p className="mt-1 text-3xl font-bold text-amber-600">
                {(customer.loyalty_points ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Membership Tier</p>
              <p className="mt-1 text-2xl font-bold text-slate-900 capitalize">
                {customer.membership_tier ?? 'regular'}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                Riwayat Transaksi Poin
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {transactions.data.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400">
                  <Star className="mx-auto mb-3 h-10 w-10 opacity-20" />
                  <p>Belum ada transaksi poin</p>
                </div>
              ) : (
                transactions.data.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-full p-2 ${tx.type === 'earn' ? 'bg-emerald-50' : 'bg-rose-50'}`}
                      >
                        {tx.type === 'earn' ? (
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-rose-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {tx.description}
                        </p>
                        <p className="text-xs text-slate-400">
                          {tx.created_at}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold ${tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {tx.type === 'earn' ? '+' : '-'}
                      {tx.points.toLocaleString()} poin
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
