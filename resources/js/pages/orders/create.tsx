import { Link, useForm, router } from '@inertiajs/react';
import {
  ArrowLeft,
  Save,
  ShoppingBag,
  User,
  Package,
  Plus,
  Trash2,
  Calendar,
  Search,
  X,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import PromoInput from '@/components/promo-input';

interface Customer {
  id: number;
  name: string;
  phone: string | null;
  customer_code: string;
}

interface Service {
  id: number;
  name: string;
  service_code: string;
  base_price: number;
  unit: 'kg' | 'pcs' | 'item';
  estimated_days: number;
}

interface Props {
  customers: Customer[];
  services: Service[];
}

export default function OrderCreate({ customers, services }: Props) {
  const [searchCustomer, setSearchCustomer] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  const { data, setData, processing, errors } = useForm({
    customer_id: '',
    items: [] as Array<{
      service_id: number;
      quantity: string;
      notes: string;
      service?: Service;
    }>,
    notes: '',
    pickup_date: '',
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
      c.phone?.includes(searchCustomer) ||
      c.customer_code.toLowerCase().includes(searchCustomer.toLowerCase()),
  );

  const addItem = () => {
    setData('items', [
      ...data.items,
      { service_id: 0, quantity: '', notes: '' },
    ]);
  };

  const removeItem = (index: number) => {
    setData(
      'items',
      data.items.filter((_, i) => i !== index),
    );
  };

  const updateItemService = (index: number, serviceId: number) => {
    const service = services.find((s) => s.id === serviceId);
    const newItems = [...data.items];
    newItems[index] = {
      ...newItems[index],
      service_id: serviceId,
      service: service,
    };
    setData('items', newItems);
  };

  const updateItemQuantity = (index: number, quantity: string) => {
    const newItems = [...data.items];
    newItems[index].quantity = quantity;
    setData('items', newItems);
  };

  const updateItemNotes = (index: number, notes: string) => {
    const newItems = [...data.items];
    newItems[index].notes = notes;
    setData('items', newItems);
  };

  const calculateSubtotal = () => {
    return data.items.reduce((total, item) => {
      if (item.service && item.quantity) {
        return (
          total + item.service.base_price * parseFloat(item.quantity || '0')
        );
      }
      return total;
    }, 0);
  };

  const calculateTotalWeight = () => {
    return data.items.reduce((total, item) => {
      if (item.service?.unit === 'kg' && item.quantity) {
        return total + parseFloat(item.quantity || '0');
      }
      return total;
    }, 0);
  };

  const calculateDiscount = () => {
    return appliedPromo?.discount || 0;
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedItems = data.items.map((item) => ({
      service_id: item.service_id,
      quantity: parseFloat(item.quantity),
      notes: item.notes,
    }));

    router.post('/owner/orders', {
      customer_id: data.customer_id,
      items: formattedItems,
      notes: data.notes,
      pickup_date: data.pickup_date,
      promo_code: appliedPromo?.code,
    });
  };

  const selectedCustomer = customers.find(
    (c) => c.id === parseInt(data.customer_id),
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href="/owner/orders"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Order
            </Link>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <ShoppingBag className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Buat Order Baru
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Input transaksi laundry pelanggan
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8 p-6">
                {/* Pilih Customer */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <User className="h-5 w-5 text-indigo-600" />
                    Data Pelanggan
                  </h3>

                  <div className="relative">
                    {!selectedCustomer ? (
                      <div>
                        <div className="relative">
                          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={searchCustomer}
                            onChange={(e) => {
                              setSearchCustomer(e.target.value);
                              setShowCustomerDropdown(true);
                            }}
                            onFocus={() => setShowCustomerDropdown(true)}
                            placeholder="Cari pelanggan berdasarkan nama, no HP, atau kode..."
                            className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                          />
                        </div>

                        {showCustomerDropdown &&
                          filteredCustomers.length > 0 && (
                            <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                              {filteredCustomers.map((customer) => (
                                <button
                                  key={customer.id}
                                  type="button"
                                  onClick={() => {
                                    setData(
                                      'customer_id',
                                      customer.id.toString(),
                                    );
                                    setSearchCustomer(
                                      `${customer.name} - ${customer.phone || '-'}`,
                                    );
                                    setShowCustomerDropdown(false);
                                  }}
                                  className="w-full px-4 py-2 text-left transition-colors hover:bg-indigo-50"
                                >
                                  <div className="font-medium text-slate-900">
                                    {customer.name}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    {customer.customer_code} •{' '}
                                    {customer.phone || '-'}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div>
                          <div className="font-medium text-slate-900">
                            {selectedCustomer.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {selectedCustomer.customer_code} •{' '}
                            {selectedCustomer.phone || '-'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setData('customer_id', '');
                            setSearchCustomer('');
                          }}
                          className="rounded-lg p-1 transition-colors hover:bg-slate-200"
                        >
                          <X className="h-4 w-4 text-slate-500" />
                        </button>
                      </div>
                    )}
                    {errors.customer_id && (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.customer_id}
                      </p>
                    )}
                  </div>
                </div>

                {/* Items Laundry */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <Package className="h-5 w-5 text-indigo-600" />
                      Item Laundry
                    </h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Tambah Item
                    </button>
                  </div>

                  {errors.items && (
                    <p className="mb-3 text-xs text-rose-600">{errors.items}</p>
                  )}

                  <div className="space-y-4">
                    {data.items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                            Item #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-rose-500 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                          <div className="sm:col-span-5">
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Pilih Layanan
                            </label>
                            <select
                              value={item.service_id}
                              onChange={(e) =>
                                updateItemService(
                                  index,
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                            >
                              <option value="">Pilih layanan</option>
                              {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                  {service.name} - {service.service_code} (Rp{' '}
                                  {service.base_price.toLocaleString()}/
                                  {service.unit})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              {item.service?.unit === 'kg'
                                ? 'Berat (kg)'
                                : 'Jumlah'}
                            </label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(index, e.target.value)
                              }
                              step="0.1"
                              min="0.1"
                              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                              placeholder="0.0"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Harga
                            </label>
                            <div className="flex h-full items-center py-1.5">
                              {item.service && item.quantity ? (
                                <span className="font-medium text-emerald-600">
                                  Rp{' '}
                                  {(
                                    item.service.base_price *
                                    parseFloat(item.quantity || '0')
                                  ).toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="mb-1 block text-xs font-medium text-slate-600">
                              Catatan
                            </label>
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) =>
                                updateItemNotes(index, e.target.value)
                              }
                              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                              placeholder="Optional"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {data.items.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center">
                        <Package className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                        <p className="text-sm text-slate-500">Belum ada item</p>
                        <button
                          type="button"
                          onClick={addItem}
                          className="mt-2 inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                        >
                          <Plus className="h-4 w-4" />
                          Tambah item pertama
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informasi Tambahan */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                    Informasi Tambahan
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Tanggal Ambil (Opsional)
                      </label>
                      <div className="relative">
                        <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="date"
                          value={data.pickup_date}
                          onChange={(e) =>
                            setData('pickup_date', e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Catatan Order
                      </label>
                      <input
                        type="text"
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                        placeholder="Catatan umum (opsional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Ringkasan Order */}
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    Ringkasan Order
                  </h3>

                  <div className="space-y-2 rounded-lg bg-slate-50 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Item:</span>
                      <span className="font-medium text-slate-900">
                        {data.items.length} item
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Berat:</span>
                      <span className="font-medium text-slate-900">
                        {calculateTotalWeight().toFixed(2)} kg
                      </span>
                    </div>

                    {/* Promo Input */}
                    <div className="pt-2">
                      <PromoInput
                        subtotal={calculateSubtotal()}
                        onApplied={(promo) => {
                          setAppliedPromo(promo);
                        }}
                      />
                    </div>

                    {appliedPromo && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Diskon ({appliedPromo.code})</span>
                        <span>
                          - Rp {appliedPromo.discount.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                      <span className="text-slate-800">Grand Total:</span>
                      <span className="text-indigo-600">
                        Rp {calculateGrandTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                <Link
                  href="/owner/orders"
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={
                    processing || data.items.length === 0 || !data.customer_id
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {processing ? 'Menyimpan...' : 'Buat Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
