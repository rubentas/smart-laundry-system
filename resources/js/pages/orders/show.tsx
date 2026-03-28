import { Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Award,
  Star,
  TrendingUp,
  Gift,
  Clock,
  Wallet,
  Edit,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Order {
  id: number;
  order_number: string;
  order_date: string;
  grand_total: number;
  status: string;
  is_paid: boolean;
}

interface Transaction {
  id: number;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  created_at: string;
  reward?: {
    name: string;
  };
  order?: {
    order_number: string;
  };
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  customer_code: string;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
  is_member: boolean;
  member_since: string | null;
  loyalty_points: number;
  membership_tier: 'regular' | 'silver' | 'gold' | 'platinum';
  next_tier_points: number;
  created_at: string;
}

interface Props {
  customer: Customer;
  orders: Order[];
  transactions: Transaction[];
  stats: {
    avg_order: number;
    points_earned: number;
    points_redeemed: number;
  };
}

export default function CustomerShow({ customer, orders, stats }: Props) {
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(false);

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

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      washing: 'bg-blue-100 text-blue-800',
      drying: 'bg-purple-100 text-purple-800',
      ironing: 'bg-orange-100 text-orange-800',
      ready_pickup: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      washing: 'Dicuci',
      drying: 'Dikeringkan',
      ironing: 'Disetrika',
      ready_pickup: 'Siap Diambil',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  const fetchRewards = async () => {
    setLoadingRewards(true);
    try {
      const res = await fetch('/owner/loyalty/rewards-available');
      const data = await res.json();
      setRewards(data);
      setShowRedeemModal(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRewards(false);
    }
  };

  const redeemReward = (rewardId: number, points: number, name: string) => {
    if (confirm(`Tukar ${points} poin untuk ${name}?`)) {
      router.post(
        `/owner/customers/${customer.id}/redeem`,
        { reward_id: rewardId },
        {
          onSuccess: () => {
            setShowRedeemModal(false);
            router.reload();
          },
        },
      );
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/owner/customers"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Customer
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Detail Customer
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {customer.customer_code} • Bergabung sejak{' '}
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/owner/customers/${customer.id}/edit`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Hapus customer ini?')) {
                      router.delete(`/owner/customers/${customer.id}`);
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic Info Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  Informasi Customer
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Nama Lengkap</p>
                      <p className="font-medium text-slate-900">
                        {customer.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Nomor Telepon</p>
                      <p className="font-medium text-slate-900">
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                  {customer.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">
                          {customer.email}
                        </p>
                      </div>
                    </div>
                  )}
                  {customer.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500">Alamat</p>
                        <p className="font-medium text-slate-900">
                          {customer.address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Loyalty Program Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Award className="h-5 w-5 text-indigo-600" />
                  Loyalty Program
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-linear-to-r from-amber-500 to-orange-500 p-4 text-white">
                    <p className="text-sm opacity-90">Total Poin</p>
                    <p className="text-3xl font-bold">
                      {customer.loyalty_points.toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`rounded-lg bg-linear-to-r ${getTierColor(customer.membership_tier)} p-4 text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm opacity-90">Membership Tier</p>
                      {getTierIcon(customer.membership_tier)}
                    </div>
                    <p className="text-2xl font-bold capitalize">
                      {customer.membership_tier}
                    </p>
                  </div>

                  <div className="rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 p-4 text-white">
                    <p className="text-sm opacity-90">Next Tier</p>
                    <p className="text-xl font-bold">
                      {customer.next_tier_points
                        ? customer.next_tier_points - customer.loyalty_points
                        : 'Max'}
                      <span className="ml-1 text-sm">poin lagi</span>
                    </p>
                  </div>
                </div>

                {/* Tier Benefits */}
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <h4 className="mb-2 text-sm font-medium text-slate-700">
                    Benefits {customer.membership_tier.toUpperCase()}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span>
                        Points Multiplier:
                        {customer.membership_tier === 'regular' && ' 1x'}
                        {customer.membership_tier === 'silver' && ' 1.2x'}
                        {customer.membership_tier === 'gold' && ' 1.5x'}
                        {customer.membership_tier === 'platinum' && ' 2x'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-indigo-600" />
                      <span>
                        Member Discount:
                        {customer.membership_tier === 'regular' && ' 0%'}
                        {customer.membership_tier === 'silver' && ' 5%'}
                        {customer.membership_tier === 'gold' && ' 10%'}
                        {customer.membership_tier === 'platinum' && ' 15%'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/owner/customers/${customer.id}/points`}
                    className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Lihat Riwayat Poin <ChevronRight className="h-4 w-4" />
                  </Link>
                  {customer.loyalty_points >= 100 && (
                    <button
                      onClick={fetchRewards}
                      className="ml-4 inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800"
                    >
                      <Gift className="h-4 w-4" />
                      Tukar Poin
                    </button>
                  )}
                </div>
              </div>

              {/* Order History Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Riwayat Transaksi
                  </h2>
                  <Link
                    href={`/owner/orders/create?customer=${customer.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Order Baru
                  </Link>
                </div>

                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <p className="py-8 text-center text-slate-500">
                      Belum ada transaksi
                    </p>
                  ) : (
                    orders.map((order) => (
                      <Link
                        key={order.id}
                        href={`/owner/orders/${order.id}`}
                        className="block rounded-lg border border-slate-200 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/30"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">
                              {order.order_number}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(order.order_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-indigo-600">
                              Rp {order.grand_total.toLocaleString()}
                            </p>
                            <div className="mt-1 flex items-center justify-end gap-2">
                              {getStatusBadge(order.status)}
                              {order.is_paid ? (
                                <span className="text-xs text-green-600">
                                  Lunas
                                </span>
                              ) : (
                                <span className="text-xs text-yellow-600">
                                  Belum Bayar
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Actions */}
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-slate-900">Statistik</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">
                      Total Transaksi
                    </span>
                    <span className="font-semibold text-slate-900">
                      {customer.total_orders}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">
                      Total Belanja
                    </span>
                    <span className="font-semibold text-slate-900">
                      Rp {customer.total_spent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">
                      Rata-rata Order
                    </span>
                    <span className="font-semibold text-slate-900">
                      Rp {stats.avg_order.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Terakhir Order
                    </span>
                    <span className="font-semibold text-slate-900">
                      {customer.last_order_date
                        ? new Date(
                            customer.last_order_date,
                          ).toLocaleDateString()
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Points Stats */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-900">
                  <Wallet className="h-4 w-4 text-indigo-600" />
                  Statistik Poin
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Total Poin Didapat
                    </span>
                    <span className="font-semibold text-green-600">
                      {stats.points_earned.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Total Poin Ditukar
                    </span>
                    <span className="font-semibold text-orange-600">
                      {stats.points_redeemed.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-sm font-medium text-slate-700">
                      Poin Tersisa
                    </span>
                    <span className="text-xl font-bold text-indigo-600">
                      {customer.loyalty_points.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-slate-900">Aksi</h3>
                <div className="space-y-2">
                  <Link
                    href={`/owner/orders/create?customer=${customer.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Buat Order Baru
                  </Link>
                  <Link
                    href={`/owner/customers/${customer.id}/edit`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Customer
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Clock className="h-4 w-4" />
                    Cetak Riwayat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h3 className="text-lg font-semibold">Tukar Poin</h3>
              <button
                onClick={() => setShowRedeemModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              {loadingRewards ? (
                <p className="py-4 text-center">Loading...</p>
              ) : rewards.length === 0 ? (
                <p className="py-4 text-center text-slate-500">
                  Belum ada reward tersedia
                </p>
              ) : (
                <div className="space-y-3">
                  {rewards.map((reward) => (
                    <button
                      key={reward.id}
                      onClick={() =>
                        redeemReward(
                          reward.id,
                          reward.points_required,
                          reward.name,
                        )
                      }
                      disabled={
                        customer.loyalty_points < reward.points_required
                      }
                      className={`flex w-full items-center justify-between rounded-lg border p-3 transition-colors ${
                        customer.loyalty_points >= reward.points_required
                          ? 'border-slate-200 hover:border-indigo-200 hover:bg-indigo-50'
                          : 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-50'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-xs text-slate-500">
                          {reward.reward_type === 'discount' &&
                            `Diskon ${reward.discount_value}%`}
                          {reward.reward_type === 'free_service' &&
                            `Gratis ${reward.service?.name || 'Layanan'}`}
                          {reward.reward_type === 'voucher' &&
                            'Voucher Belanja'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-amber-600">
                          {reward.points_required} poin
                        </p>
                        <p className="text-xs text-slate-400">Tukar</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
