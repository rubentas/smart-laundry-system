import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  is_member: boolean;
  member_since: string | null;
  loyalty_points: number;
  membership_tier: 'regular' | 'silver' | 'gold' | 'platinum';
  total_orders: number;
  total_spent: number;
}

interface Props {
  customer: Customer;
  stats: {
    total_orders: number;
    total_spent: number;
    avg_order: number;
    points_earned: number;
    points_redeemed: number;
  };
}

export default function CustomerProfile({ customer, stats }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    name: customer.name,
    email: customer.email,
    phone: customer.phone || '',
    address: customer.address || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/customer/profile', {
      onSuccess: () => {
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      },
    });
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

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

  const getTierBadge = (tier: string) => {
    const styles = {
      regular: 'bg-gray-100 text-gray-700',
      silver: 'bg-gray-200 text-gray-800',
      gold: 'bg-amber-100 text-amber-800',
      platinum: 'bg-indigo-100 text-indigo-800',
    };
    return styles[tier as keyof typeof styles] || styles.regular;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <User className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Profil Saya
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Kelola informasi akun Anda
                </p>
              </div>
            </div>
          </div>

          {/* Success Alert */}
          {showSuccess && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-700">
                  Profil berhasil diperbarui!
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Profile Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Informasi Pribadi
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit Profil
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                      >
                        <X className="h-4 w-4" />
                        Batal
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Simpan
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                          !isEditing ? 'bg-slate-50 text-slate-600' : ''
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
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
                        disabled={!isEditing}
                        className={`w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                          !isEditing ? 'bg-slate-50 text-slate-600' : ''
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Nomor Telepon
                    </label>
                    <div className="relative">
                      <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        disabled={!isEditing}
                        className={`w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                          !isEditing ? 'bg-slate-50 text-slate-600' : ''
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Alamat
                    </label>
                    <div className="relative">
                      <MapPin className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                      <textarea
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                          !isEditing ? 'bg-slate-50 text-slate-600' : ''
                        }`}
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Stats & Membership */}
            <div className="space-y-6">
              {/* Membership Card */}
              <div
                className={`rounded-2xl bg-gradient-to-r ${getTierColor(customer.membership_tier)} p-6 text-white shadow-sm`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Membership Tier</p>
                    <p className="mt-1 text-2xl font-bold capitalize">
                      {customer.membership_tier}
                    </p>
                  </div>
                  {getTierIcon(customer.membership_tier)}
                </div>
                <div className="mt-2 border-t border-white/20 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-80">Total Poin</span>
                    <span className="text-xl font-bold">
                      {customer.loyalty_points.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm opacity-80">
                      Points Multiplier
                    </span>
                    <span className="text-sm font-medium">
                      {customer.membership_tier === 'regular' && '1x'}
                      {customer.membership_tier === 'silver' && '1.2x'}
                      {customer.membership_tier === 'gold' && '1.5x'}
                      {customer.membership_tier === 'platinum' && '2x'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-slate-900">
                  Statistik Belanja
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">Total Order</span>
                    <span className="font-semibold text-slate-900">
                      {stats.total_orders}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">
                      Total Belanja
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(stats.total_spent)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-sm text-slate-600">
                      Rata-rata per Order
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(stats.avg_order)}
                    </span>
                  </div>
                  {customer.member_since && (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">
                        Member Sejak
                      </span>
                      <span className="text-sm text-slate-700">
                        {new Date(customer.member_since).toLocaleDateString(
                          'id-ID',
                          {
                            month: 'long',
                            year: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Points Stats */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-slate-900">
                  Statistik Poin
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      Total Poin Didapat
                    </span>
                    <span className="font-medium text-green-600">
                      {stats.points_earned.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">
                      Total Poin Ditukar
                    </span>
                    <span className="font-medium text-orange-600">
                      {stats.points_redeemed.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-sm font-medium text-slate-700">
                      Poin Tersisa
                    </span>
                    <span className="text-xl font-bold text-indigo-600">
                      {customer.loyalty_points.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
