import { Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  Printer,
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Truck,
  Phone,
  Mail,
  Receipt,
  CreditCard,
  Store,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

interface OrderItem {
  id: number;
  service_name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  subtotal: number;
  notes: string | null;
}

interface StatusHistory {
  id: number;
  status_from: string;
  status_to: string;
  notes: string | null;
  created_at: string;
  user: {
    name: string;
  };
}

interface Order {
  id: number;
  order_number: string;
  customer: {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  branch: {
    id: number;
    name: string;
    address: string;
    phone: string;
  };
  cashier: {
    id: number;
    name: string;
  };
  order_date: string;
  pickup_date: string | null;
  status: string;
  total_weight: number;
  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;
  notes: string | null;
  is_paid: boolean;
  payment_method: string | null;
  need_delivery: boolean;
  delivery_type: string | null;
  pickup_address: string | null;
  delivery_address: string | null;
  delivery_status: string | null;
  delivery_fee: number;
  delivery_notes: string | null;
  courier: {
    id: number;
    name: string;
    phone: string;
    license_plate: string;
  } | null;
  items: OrderItem[];
  statusHistories: StatusHistory[];
}

interface Props {
  order: Order;
}

export default function CustomerOrderShow({ order }: Props) {
  const [showTimeline, setShowTimeline] = useState(false);

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

  const deliveryStatusLabels: Record<string, string> = {
    pending: 'Menunggu Kurir',
    waiting_pickup: 'Menunggu Diambil',
    picked_up: 'Sudah Diambil',
    on_delivery: 'Dalam Perjalanan',
    delivered: 'Telah Dikirim',
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const config = statusColors[status] || statusColors.pending;
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getDeliveryStep = (status: string) => {
    const steps = [
      'pending',
      'waiting_pickup',
      'picked_up',
      'on_delivery',
      'delivered',
    ];
    return steps.indexOf(status);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/customer/orders"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Order
            </Link>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3">
                  <Receipt className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Detail Order
                  </h1>
                  <p className="mt-1 font-mono text-sm text-slate-500">
                    {order.order_number}
                  </p>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Printer className="h-4 w-4" />
                Cetak Nota
              </button>
            </div>
          </div>

          {/* Status Banner */}
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Status Order</p>
                <div className="mt-1 flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  {order.is_paid ? (
                    <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                      <CheckCircle className="h-4 w-4" /> Lunas
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                      <AlertCircle className="h-4 w-4" /> Belum Dibayar
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {showTimeline ? 'Sembunyikan Timeline' : 'Lihat Timeline'}
              </button>
            </div>

            {/* Timeline */}
            {showTimeline && (
              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-slate-200"></div>
                  {order.statusHistories.map((history, idx) => (
                    <div
                      key={history.id}
                      className="relative pb-6 pl-10 last:pb-0"
                    >
                      <div className="absolute top-1 left-2.5 h-3 w-3 rounded-full bg-indigo-600"></div>
                      <div className="text-sm">
                        <p className="font-medium text-slate-900">
                          {history.status_to
                            ? statusColors[history.status_to]?.label
                            : 'Order Dibuat'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(history.created_at)} oleh{' '}
                          {history.user.name}
                        </p>
                        {history.notes && (
                          <p className="mt-1 text-xs text-slate-500 italic">
                            "{history.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Order Items & Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Order Items */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                  Item Laundry
                </h2>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-slate-100 pb-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {item.service_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.quantity} {item.unit} x{' '}
                          {formatCurrency(item.price_per_unit)}
                        </p>
                        {item.notes && (
                          <p className="mt-1 text-xs text-slate-400">
                            Catatan: {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-emerald-600">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon</span>
                      <span>- {formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  {order.delivery_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Biaya Pengiriman</span>
                      <span>{formatCurrency(order.delivery_fee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                    <span>Grand Total</span>
                    <span className="text-indigo-600">
                      {formatCurrency(order.grand_total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              {order.need_delivery && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Truck className="h-5 w-5 text-indigo-600" />
                    Informasi Pengiriman
                  </h2>

                  <div className="space-y-4">
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="mb-2 text-sm font-medium text-slate-700">
                        Alamat{' '}
                        {order.delivery_type === 'pickup' ? 'Jemput' : 'Antar'}
                      </p>
                      <p className="text-sm text-slate-600">
                        {order.delivery_type === 'pickup'
                          ? order.pickup_address
                          : order.delivery_address}
                      </p>
                    </div>

                    {order.courier && (
                      <div className="rounded-lg bg-indigo-50 p-4">
                        <p className="mb-2 text-sm font-medium text-indigo-700">
                          Kurir
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-indigo-100 p-2">
                            <Truck className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium">{order.courier.name}</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />{' '}
                                {order.courier.phone}
                              </span>
                              {order.courier.license_plate && (
                                <span className="flex items-center gap-1">
                                  <Truck className="h-3 w-3" />{' '}
                                  {order.courier.license_plate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          Status:{' '}
                          <span className="font-medium">
                            {
                              deliveryStatusLabels[
                                order.delivery_status || 'pending'
                              ]
                            }
                          </span>
                        </p>
                      </div>
                    )}

                    {order.delivery_notes && (
                      <div className="text-sm text-slate-500">
                        <p className="font-medium">Catatan Pengiriman:</p>
                        <p>{order.delivery_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Customer & Branch Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <User className="h-5 w-5 text-indigo-600" />
                  Informasi Pelanggan
                </h2>
                <div className="space-y-3">
                  <p className="font-medium text-slate-900">
                    {order.customer.name}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" /> {order.customer.phone}
                  </p>
                  {order.customer.email && (
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4" /> {order.customer.email}
                    </p>
                  )}
                  {order.customer.address && (
                    <p className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4" />{' '}
                      {order.customer.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Branch Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Store className="h-5 w-5 text-indigo-600" />
                  Cabang
                </h2>
                <div className="space-y-3">
                  <p className="font-medium">{order.branch.name}</p>
                  <p className="text-sm text-slate-600">
                    {order.branch.address}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" /> {order.branch.phone}
                  </p>
                </div>
              </div>

              {/* Order Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Informasi Order
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal Order</span>
                    <span className="text-slate-900">
                      {formatDateOnly(order.order_date)}
                    </span>
                  </div>
                  {order.pickup_date && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tanggal Ambil</span>
                      <span className="text-slate-900">
                        {formatDateOnly(order.pickup_date)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Berat Total</span>
                    <span className="text-slate-900">
                      {order.total_weight} kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kasir</span>
                    <span className="text-slate-900">{order.cashier.name}</span>
                  </div>
                  {order.notes && (
                    <div className="border-t border-slate-200 pt-3">
                      <p className="mb-1 text-slate-500">Catatan:</p>
                      <p className="text-slate-700">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
