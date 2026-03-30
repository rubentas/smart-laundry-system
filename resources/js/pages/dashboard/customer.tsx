import { Link } from '@inertiajs/react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Package,
  Eye,
  MapPin,
  AlertCircle,
  User,
  Award,
  Star,
  TrendingUp,
  Gift,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Stats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  readyOrders: number;
  completedOrders: number;
  memberSince: string;
}

interface RecentOrder {
  id: number;
  order_number: string;
  branch_name: string;
  grand_total: number;
  status: string;
  created_at: string;
  is_paid: boolean;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  is_member: boolean;
  loyalty_points: number;
  membership_tier: 'regular' | 'silver' | 'gold' | 'platinum';
}

interface Props {
  stats: Stats;
  recentOrders: RecentOrder[];
  customer: Customer;
}

export default function CustomerDashboard({
  stats,
  recentOrders,
  customer,
}: Props) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('IDR', 'Rp');
  };

  const statusColors: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    pending: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Pending' },
    washing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Mencuci' },
    drying: { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'Mengering' },
    ironing: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      label: 'Menyetrika',
    },
    ready_pickup: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Siap Ambil',
    },
    completed: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: 'Selesai',
    },
    cancelled: {
      bg: 'bg-rose-100',
      text: 'text-rose-700',
      label: 'Dibatalkan',
    },
  };

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

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <User className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Halo, {customer.name}!
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Member sejak {stats.memberSince}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {/* Total Order */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Total Order
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-indigo-600">
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <ShoppingBag className="h-5 w-5 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Total Belanja */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Total Belanja
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                    {formatCurrency(stats.totalSpent)}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Sedang Diproses */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Sedang Diproses
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600">
                    {stats.pendingOrders}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Siap Ambil */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Siap Ambil
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-green-600">
                    {stats.readyOrders}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>

            {/* Selesai */}
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                    Selesai
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">
                    {stats.completedOrders}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Loyalty Program Card */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Award className="h-5 w-5 text-indigo-600" />
              Loyalty Program
            </h3>

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

            <div className="mt-4 flex gap-3">
              <Link
                href="/customer/loyalty"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Gift className="h-4 w-4" />
                Tukar Poin
              </Link>
              <Link
                href="/customer/points"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <TrendingUp className="h-4 w-4" />
                Riwayat Poin
              </Link>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Informasi Profil
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Nama</p>
                    <p className="font-medium text-slate-900">
                      {customer.name}
                    </p>
                  </div>
                </div>
                {customer.email && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-5 w-5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-slate-500">Telepon</p>
                      <p className="font-medium text-slate-900">
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Alamat</p>
                      <p className="font-medium text-slate-900">
                        {customer.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Ringkasan Keanggotaan
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm text-slate-600">Status Member</span>
                  {customer.is_member ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                      <CheckCircle className="h-4 w-4" />
                      Active Member
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
                      Regular Customer
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm text-slate-600">Total Order</span>
                  <span className="font-semibold text-slate-900">
                    {stats.totalOrders}x
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm text-slate-600">Total Belanja</span>
                  <span className="font-semibold text-emerald-600">
                    {formatCurrency(stats.totalSpent)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    Rata-rata per Order
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(
                      stats.totalOrders > 0
                        ? stats.totalSpent / stats.totalOrders
                        : 0,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Riwayat Order Terbaru
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      No Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Cabang
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Pembayaran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-slate-400"
                      >
                        <Package className="mx-auto h-8 w-8 opacity-20" />
                        <p className="mt-2">Belum ada order</p>
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-sm font-medium text-slate-900">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {order.branch_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {order.created_at}
                        </td>
                        <td className="px-6 py-4 font-medium text-emerald-600">
                          {formatCurrency(order.grand_total)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[order.status]?.bg} ${statusColors[order.status]?.text}`}
                          >
                            {statusColors[order.status]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {order.is_paid ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              <CheckCircle className="h-3 w-3" />
                              Lunas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                              <AlertCircle className="h-3 w-3" />
                              Belum
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/customer/orders/${order.id}`}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
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
    </AppLayout>
  );
}
