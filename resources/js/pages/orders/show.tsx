import { Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  Printer,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  User,
  Calendar,
  DollarSign,
  Scale,
  FileText,
  History,
  CreditCard,
  AlertCircle,
  Truck,
  MapPin,
  Phone,
  Car,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';

interface OrderItem {
  id: number;
  service_name: string;
  quantity: number | string;
  unit: string;
  price_per_unit: number | string;
  subtotal: number | string;
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
  } | null;
}

interface Courier {
  id: number;
  name: string;
  phone: string;
  license_plate: string | null;
}

interface Order {
  id: number;
  order_number: string;
  customer: {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    is_member: boolean;
  };
  branch: {
    id: number;
    name: string;
  };
  cashier: {
    id: number;
    name: string;
  };
  order_date: string;
  pickup_date: string | null;
  status:
    | 'pending'
    | 'washing'
    | 'drying'
    | 'ironing'
    | 'ready_pickup'
    | 'completed'
    | 'cancelled';
  total_weight: number | string;
  subtotal: number | string;
  discount: number | string;
  tax: number | string;
  grand_total: number | string;
  notes: string | null;
  is_paid: boolean;
  payment_method: string | null;
  items: OrderItem[];
  status_histories: StatusHistory[];
  // Delivery fields
  need_delivery?: boolean;
  delivery_type?: 'pickup' | 'delivery';
  pickup_address?: string;
  delivery_address?: string;
  delivery_scheduled_at?: string;
  delivery_fee?: number | string;
  delivery_notes?: string | null;
  courier?: Courier | null;
  delivery_status?: string;
}

interface Props {
  order: Order;
  couriers?: Courier[];
}

// Helper function to get delivery step index
const getDeliveryStep = (status?: string) => {
  const steps = [
    'pending',
    'waiting_pickup',
    'picked_up',
    'on_delivery',
    'delivered',
  ];
  return steps.indexOf(status || 'pending');
};

// Assign Courier Modal Component
function AssignCourierModal({
  order,
  couriers = [],
  onClose,
  onAssign,
}: {
  order: Order;
  couriers: Courier[];
  onClose: () => void;
  onAssign: (courierId: number) => void;
}) {
  const [selectedCourierId, setSelectedCourierId] = useState<number | null>(
    null,
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Kurir</DialogTitle>
          <DialogDescription>
            Pilih kurir untuk order #{order.order_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Pilih Kurir
            </label>
            <select
              value={selectedCourierId || ''}
              onChange={(e) => setSelectedCourierId(parseInt(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            >
              <option value="">Pilih kurir...</option>
              {couriers.map((courier) => (
                <option key={courier.id} value={courier.id}>
                  {courier.name} - {courier.phone}{' '}
                  {courier.license_plate ? `(${courier.license_plate})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="default"
            onClick={() => selectedCourierId && onAssign(selectedCourierId)}
            disabled={!selectedCourierId}
          >
            Assign Kurir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OrderShow({ order, couriers = [] }: Props) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [statusNotes, setStatusNotes] = useState('');
  const [showAssignCourier, setShowAssignCourier] = useState(false);

  const toNumber = (value: unknown): number => {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  };

  const statusColors: Record<
    string,
    { bg: string; text: string; label: string; icon: any }
  > = {
    pending: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      label: 'Pending',
      icon: Clock,
    },
    washing: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: 'Mencuci',
      icon: Package,
    },
    drying: {
      bg: 'bg-cyan-100',
      text: 'text-cyan-700',
      label: 'Mengering',
      icon: Package,
    },
    ironing: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      label: 'Menyetrika',
      icon: Package,
    },
    ready_pickup: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      label: 'Siap Ambil',
      icon: CheckCircle,
    },
    completed: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-700',
      label: 'Selesai',
      icon: CheckCircle,
    },
    cancelled: {
      bg: 'bg-rose-100',
      text: 'text-rose-700',
      label: 'Dibatalkan',
      icon: XCircle,
    },
  };

  const updateStatus = () => {
    router.post(
      `/owner/orders/${order.id}/status`,
      {
        status: selectedStatus,
        notes: statusNotes,
      },
      {
        onSuccess: () => {
          setShowStatusDialog(false);
          setStatusNotes('');
        },
      },
    );
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

  const statusConfig = statusColors[order.status] ?? statusColors.pending;
  const StatusIcon = statusConfig.icon || Clock;

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link
                href="/owner/orders"
                className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-indigo-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Daftar Order
              </Link>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-indigo-100 p-3">
                  <Package className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-900">
                      Order #{order.order_number}
                    </h1>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Dibuat pada {formatDate(order.order_date)} oleh{' '}
                    {order.cashier.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Tombol Proses Pembayaran - Hanya muncul jika belum dibayar */}
              {!order.is_paid && (
                <Link
                  href={`/owner/orders/${order.id}/payment`}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <CreditCard className="h-4 w-4" />
                  Proses Pembayaran
                </Link>
              )}

              <button
                onClick={() => setShowStatusDialog(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                <Edit className="h-4 w-4" />
                Update Status
              </button>
              <Link
                href={`/owner/orders/${order.id}/print`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Printer className="h-4 w-4" />
                Cetak Nota
              </Link>

              {order.customer?.phone && (
                <button
                  onClick={() => {
                    if (confirm('Kirim notifikasi WhatsApp ke customer?')) {
                      router.post(
                        `/owner/orders/${order.id}/send-notification`,
                      );
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.077 4.928C17.191 3.041 14.683 2 12.006 2 6.798 2 2.537 6.193 2.523 11.396c-.005 1.745.456 3.452 1.328 4.985L2.25 21.75l5.421-1.572c1.466.796 3.113 1.216 4.804 1.217h.004c5.202 0 9.47-4.195 9.484-9.4.007-2.51-1.013-4.872-2.886-6.757zm-7.07 14.527c-1.494 0-2.958-.402-4.23-1.155l-.303-.18-3.215.933 1.004-3.115-.184-.316c-.821-1.38-1.256-2.977-1.253-4.614.011-4.284 3.49-7.762 7.78-7.762 2.082 0 4.036.813 5.507 2.284 1.472 1.471 2.282 3.426 2.278 5.507-.012 4.283-3.49 7.76-7.777 7.76h-.007z" />
                  </svg>
                  Kirim WA
                </button>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Order Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Items Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Item Laundry
                  </h2>
                </div>
                <div className="p-6">
                  <table className="w-full">
                    <thead className="text-xs font-medium text-slate-500 uppercase">
                      <tr className="border-b border-slate-200">
                        <th className="pb-3 text-left">Layanan</th>
                        <th className="pb-3 text-right">Qty</th>
                        <th className="pb-3 text-right">Harga</th>
                        <th className="pb-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className="py-4">
                            <div className="font-medium text-slate-900">
                              {item.service_name}
                            </div>
                            {item.notes && (
                              <div className="mt-1 text-xs text-slate-500">
                                {item.notes}
                              </div>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-4 text-right">
                            {formatCurrency(toNumber(item.price_per_unit))}
                          </td>
                          <td className="py-4 text-right font-medium text-emerald-600">
                            {formatCurrency(toNumber(item.subtotal))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200">
                      <tr>
                        <td
                          colSpan={3}
                          className="pt-4 text-right font-medium text-slate-600"
                        >
                          Subtotal
                        </td>
                        <td className="pt-4 text-right font-medium text-slate-900">
                          {formatCurrency(toNumber(order.subtotal))}
                        </td>
                      </tr>
                      {toNumber(order.discount) > 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="pt-2 text-right font-medium text-slate-600"
                          >
                            Diskon
                          </td>
                          <td className="pt-2 text-right font-medium text-rose-600">
                            -{formatCurrency(toNumber(order.discount))}
                          </td>
                        </tr>
                      )}
                      {toNumber(order.tax) > 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="pt-2 text-right font-medium text-slate-600"
                          >
                            Pajak
                          </td>
                          <td className="pt-2 text-right font-medium text-slate-900">
                            {formatCurrency(toNumber(order.tax))}
                          </td>
                        </tr>
                      )}
                      {order.need_delivery &&
                        toNumber(order.delivery_fee) > 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="pt-2 text-right font-medium text-slate-600"
                            >
                              Biaya Pengiriman
                            </td>
                            <td className="pt-2 text-right font-medium text-slate-900">
                              {formatCurrency(toNumber(order.delivery_fee))}
                            </td>
                          </tr>
                        )}
                      <tr>
                        <td
                          colSpan={3}
                          className="pt-4 text-right text-lg font-bold text-slate-800"
                        >
                          Total
                        </td>
                        <td className="pt-4 text-right text-xl font-bold text-indigo-600">
                          {formatCurrency(toNumber(order.grand_total))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status History */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <History className="h-5 w-5 text-indigo-600" />
                    Riwayat Status
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {order.status_histories.map((history, index) => {
                      const fromConfig =
                        statusColors[history.status_from] ||
                        statusColors.pending;
                      const toConfig =
                        statusColors[history.status_to] || statusColors.pending;

                      return (
                        <div key={history.id} className="flex gap-4">
                          <div className="relative flex flex-col items-center">
                            <div
                              className={`h-3 w-3 rounded-full ${toConfig.bg} ring-4 ${toConfig.bg.replace('bg-', 'ring-')}/20`}
                            />
                            {index < order.status_histories.length - 1 && (
                              <div className="absolute top-4 h-full w-0.5 bg-slate-200" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium text-slate-900">
                                {history.user?.name || 'System'}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatDate(history.created_at)}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs ${fromConfig.bg} ${fromConfig.text}`}
                              >
                                {fromConfig.label}
                              </span>
                              <span className="text-slate-400">→</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs ${toConfig.bg} ${toConfig.text}`}
                              >
                                {toConfig.label}
                              </span>
                            </div>
                            {history.notes && (
                              <p className="mt-1 text-xs text-slate-500">
                                Catatan: {history.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer & Payment Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <User className="h-5 w-5 text-indigo-600" />
                    Data Pelanggan
                  </h2>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {order.customer.name}
                    </p>
                    {order.customer.is_member && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <CheckCircle className="h-3 w-3" />
                        Member
                      </span>
                    )}
                  </div>

                  {order.customer.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Telp:</span>
                      <span className="text-slate-900">
                        {order.customer.phone}
                      </span>
                    </div>
                  )}

                  {order.customer.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-slate-500">Alamat:</span>
                      <span className="text-slate-900">
                        {order.customer.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                    Informasi Pembayaran
                  </h2>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Status</span>
                    {order.is_paid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        <CheckCircle className="h-4 w-4" />
                        Lunas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                        <AlertCircle className="h-4 w-4" />
                        Belum Dibayar
                      </span>
                    )}
                  </div>

                  {order.payment_method && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Metode</span>
                      <span className="flex items-center gap-1 text-sm font-medium text-slate-900">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        {order.payment_method === 'cash' && 'Tunai'}
                        {order.payment_method === 'transfer' && 'Transfer'}
                        {order.payment_method === 'qris' && 'QRIS'}
                        {order.payment_method === 'va' && 'Virtual Account'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Berat</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-slate-900">
                      <Scale className="h-4 w-4 text-slate-400" />
                      {toNumber(order.total_weight)} kg
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Estimasi Selesai
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium text-slate-900">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {order.pickup_date
                        ? formatDateOnly(order.pickup_date)
                        : '-'}
                    </span>
                  </div>

                  {order.notes && (
                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-xs font-medium text-slate-500">
                            Catatan
                          </p>
                          <p className="text-sm text-slate-900">
                            {order.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Section */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Truck className="h-5 w-5 text-indigo-600" />
                    Informasi Pengiriman
                  </h3>
                </div>
                <div className="p-6">
                  {order.need_delivery ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-slate-50 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-indigo-600" />
                            <span className="font-medium">
                              Alamat{' '}
                              {order.delivery_type === 'pickup'
                                ? 'Jemput'
                                : 'Antar'}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">
                            {order.delivery_type === 'pickup'
                              ? order.pickup_address
                              : order.delivery_address}
                          </p>
                        </div>

                        <div className="rounded-lg bg-slate-50 p-4">
                          <div className="mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-indigo-600" />
                            <span className="font-medium">Jadwal</span>
                          </div>
                          <p className="text-sm text-slate-700">
                            {order.delivery_scheduled_at
                              ? new Date(
                                  order.delivery_scheduled_at,
                                ).toLocaleString()
                              : 'Belum dijadwalkan'}
                          </p>
                        </div>
                      </div>

                      {/* Courier Info */}
                      <div className="rounded-lg border border-slate-200 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-indigo-600" />
                            <span className="font-medium">Kurir</span>
                          </div>
                          {!order.courier && (
                            <button
                              onClick={() => setShowAssignCourier(true)}
                              className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              Assign Kurir
                            </button>
                          )}
                        </div>

                        {order.courier ? (
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-indigo-100 p-2">
                              <Truck className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {order.courier.name}
                              </p>
                              <div className="mt-1 flex items-center gap-3">
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                  <Phone className="h-3 w-3" />{' '}
                                  {order.courier.phone}
                                </span>
                                {order.courier.license_plate && (
                                  <span className="flex items-center gap-1 text-xs text-slate-500">
                                    <Car className="h-3 w-3" />{' '}
                                    {order.courier.license_plate}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="ml-auto text-sm font-medium">
                              {order.delivery_status === 'pending' &&
                                'Menunggu Kurir'}
                              {order.delivery_status === 'waiting_pickup' &&
                                'Menunggu Diambil'}
                              {order.delivery_status === 'picked_up' &&
                                'Sudah Diambil'}
                              {order.delivery_status === 'on_delivery' &&
                                'Dalam Perjalanan'}
                              {order.delivery_status === 'delivered' &&
                                'Telah Dikirim'}
                            </span>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">
                            Belum ada kurir ditugaskan
                          </p>
                        )}
                      </div>

                      {/* Delivery Status Timeline */}
                      {order.delivery_status &&
                        order.delivery_status !== 'pending' && (
                          <div className="mt-4">
                            <h4 className="mb-3 text-sm font-medium text-slate-700">
                              Status Pengiriman
                            </h4>
                            <div className="relative">
                              <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-slate-200"></div>
                              {[
                                {
                                  status: 'waiting_pickup',
                                  label: 'Menunggu Diambil',
                                  icon: Clock,
                                },
                                {
                                  status: 'picked_up',
                                  label: 'Sudah Diambil',
                                  icon: Truck,
                                },
                                {
                                  status: 'on_delivery',
                                  label: 'Dalam Perjalanan',
                                  icon: Car,
                                },
                                {
                                  status: 'delivered',
                                  label: 'Telah Dikirim',
                                  icon: MapPin,
                                },
                              ].map((step, idx) => {
                                const isCompleted =
                                  getDeliveryStep(order.delivery_status) >=
                                  idx + 1;
                                const Icon = step.icon;
                                return (
                                  <div
                                    key={step.status}
                                    className="relative mb-6 pl-10 last:mb-0"
                                  >
                                    <div
                                      className={`absolute top-0 left-2.5 h-3 w-3 rounded-full ${
                                        isCompleted
                                          ? 'bg-indigo-600'
                                          : 'bg-slate-300'
                                      }`}
                                    ></div>
                                    <div
                                      className={`text-sm ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}
                                    >
                                      <Icon className="mr-2 inline h-4 w-4" />
                                      {step.label}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      {order.delivery_notes && (
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs font-medium text-slate-500">
                            Catatan Pengiriman
                          </p>
                          <p className="text-sm text-slate-700">
                            {order.delivery_notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Tidak menggunakan layanan antar jemput
                    </p>
                  )}
                </div>
              </div>

              {/* Branch Info */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Package className="h-5 w-5 text-indigo-600" />
                    Cabang
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium text-slate-900">
                    {order.branch.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Kasir: {order.cashier.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status Order</DialogTitle>
            <DialogDescription>
              Ubah status proses laundry untuk order #{order.order_number}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Status Baru
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="washing">Mencuci</option>
                <option value="drying">Mengering</option>
                <option value="ironing">Menyetrika</option>
                <option value="ready_pickup">Siap Ambil</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Catatan (Opsional)
              </label>
              <textarea
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                placeholder="Tambahkan catatan..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Batal
            </Button>
            <Button variant="default" onClick={updateStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Courier Modal */}
      {showAssignCourier && (
        <AssignCourierModal
          order={order}
          couriers={couriers}
          onClose={() => setShowAssignCourier(false)}
          onAssign={(courierId) => {
            router.post(`/owner/orders/${order.id}/assign-courier`, {
              courier_id: courierId,
            });
            setShowAssignCourier(false);
          }}
        />
      )}
    </AppLayout>
  );
}
