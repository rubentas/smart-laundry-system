import { router } from '@inertiajs/react';
import {
  Settings2,
  Building2,
  Percent,
  Bell,
  CreditCard,
  Save,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

type SettingsGroup = Record<string, any>;

interface SettingsProps {
  settings: {
    general: SettingsGroup;
    tax: SettingsGroup;
    notification: SettingsGroup;
    payment: SettingsGroup;
  };
}

interface FormData {
  general: SettingsGroup;
  tax: SettingsGroup;
  notification: SettingsGroup;
  payment: SettingsGroup;
}

export default function BusinessSettings({ settings }: SettingsProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<FormData>({
    general: { ...settings.general },
    tax: { ...settings.tax },
    notification: { ...settings.notification },
    payment: { ...settings.payment },
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (group: keyof FormData, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Flatten settings untuk dikirim
    const flattened: Record<string, any> = {};
    (Object.keys(formData) as Array<keyof FormData>).forEach((group) => {
      Object.keys(formData[group]).forEach((key) => {
        flattened[key] = formData[group][key];
      });
    });

    router.post(
      '/owner/business/settings',
      { settings: flattened },
      {
        onSuccess: () => {
          setSaving(false);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        },
        onError: () => {
          setSaving(false);
        },
      },
    );
  };

  const tabs = [
    { id: 'general', label: 'Umum', icon: Building2 },
    { id: 'tax', label: 'Pajak', icon: Percent },
    { id: 'notification', label: 'Notifikasi', icon: Bell },
    { id: 'payment', label: 'Pembayaran', icon: CreditCard },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-100 p-3">
                <Settings2 className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Pengaturan Bisnis
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Kelola konfigurasi dan preferensi sistem
                </p>
              </div>
            </div>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-700">
                  Pengaturan berhasil disimpan!
                </p>
              </div>
            </div>
          )}

          {/* Main Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Tabs */}
            <div className="border-b border-slate-200 bg-slate-50/50 px-6">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 border-b-2 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                      Informasi Umum
                    </h3>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Nama Bisnis
                        </label>
                        <div className="relative">
                          <Building2 className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={formData.general.business_name || ''}
                            onChange={(e) =>
                              handleChange(
                                'general',
                                'business_name',
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            placeholder="Smart Laundry"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Email Bisnis
                        </label>
                        <div className="relative">
                          <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            value={formData.general.business_email || ''}
                            onChange={(e) =>
                              handleChange(
                                'general',
                                'business_email',
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            placeholder="info@laundry.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Nomor Telepon
                        </label>
                        <div className="relative">
                          <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={formData.general.business_phone || ''}
                            onChange={(e) =>
                              handleChange(
                                'general',
                                'business_phone',
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            placeholder="021-5551234"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                          Alamat Bisnis
                        </label>
                        <div className="relative">
                          <MapPin className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                          <textarea
                            value={formData.general.business_address || ''}
                            onChange={(e) =>
                              handleChange(
                                'general',
                                'business_address',
                                e.target.value,
                              )
                            }
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            placeholder="Jl. Contoh No. 123, Jakarta"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Settings */}
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <Bell className="h-5 w-5 text-indigo-600" />
                      Pengaturan WhatsApp
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div>
                          <h4 className="font-medium text-slate-900">
                            Aktifkan WhatsApp
                          </h4>
                          <p className="text-sm text-slate-500">
                            Kirim notifikasi ke pelanggan via WhatsApp
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleChange(
                              'general',
                              'whatsapp_enabled',
                              !formData.general.whatsapp_enabled,
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            formData.general.whatsapp_enabled
                              ? 'bg-indigo-600'
                              : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.general.whatsapp_enabled
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {formData.general.whatsapp_enabled && (
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                          <div>
                            <h4 className="font-medium text-slate-900">
                              Auto Kirim Status
                            </h4>
                            <p className="text-sm text-slate-500">
                              Kirim otomatis saat status order berubah
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleChange(
                                'general',
                                'whatsapp_auto_send',
                                !formData.general.whatsapp_auto_send,
                              )
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              formData.general.whatsapp_auto_send
                                ? 'bg-indigo-600'
                                : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formData.general.whatsapp_auto_send
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tax Settings */}
              {activeTab === 'tax' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <Percent className="h-5 w-5 text-indigo-600" />
                      Pengaturan Pajak
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div>
                          <h4 className="font-medium text-slate-900">
                            Aktifkan Pajak
                          </h4>
                          <p className="text-sm text-slate-500">
                            Kenakan pajak pada setiap transaksi
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleChange(
                              'tax',
                              'tax_enabled',
                              !formData.tax.tax_enabled,
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            formData.tax.tax_enabled
                              ? 'bg-indigo-600'
                              : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.tax.tax_enabled
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {formData.tax.tax_enabled && (
                        <>
                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                              Persentase Pajak (%)
                            </label>
                            <div className="relative">
                              <Percent className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <input
                                type="number"
                                value={formData.tax.tax_percentage || 11}
                                onChange={(e) =>
                                  handleChange(
                                    'tax',
                                    'tax_percentage',
                                    e.target.value,
                                  )
                                }
                                step="0.1"
                                min="0"
                                max="100"
                                className="w-full rounded-lg border border-slate-300 py-2 pr-4 pl-9 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                              NPWP / Nomor Pajak
                            </label>
                            <input
                              type="text"
                              value={formData.tax.tax_number || ''}
                              onChange={(e) =>
                                handleChange(
                                  'tax',
                                  'tax_number',
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                              placeholder="00.000.000.0-000.000"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notification' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <Bell className="h-5 w-5 text-indigo-600" />
                      Pengaturan Notifikasi
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div>
                          <h4 className="font-medium text-slate-900">
                            Notifikasi WhatsApp
                          </h4>
                          <p className="text-sm text-slate-500">
                            Kirim notifikasi ke pelanggan via WhatsApp
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleChange(
                              'notification',
                              'wa_notifications',
                              !formData.notification.wa_notifications,
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            formData.notification.wa_notifications
                              ? 'bg-indigo-600'
                              : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.notification.wa_notifications
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {formData.notification.wa_notifications && (
                        <div>
                          <label className="mb-1 block text-sm font-medium text-slate-700">
                            WhatsApp API Token
                          </label>
                          <input
                            type="password"
                            value={formData.notification.wa_token || ''}
                            onChange={(e) =>
                              handleChange(
                                'notification',
                                'wa_token',
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            placeholder="Masukkan token dari provider"
                          />
                          <p className="mt-1 text-xs text-slate-400">
                            Token dari Fonnte / Wablas / provider WhatsApp
                            lainnya
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div>
                          <h4 className="font-medium text-slate-900">
                            Notifikasi Email
                          </h4>
                          <p className="text-sm text-slate-500">
                            Kirim notifikasi via email
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleChange(
                              'notification',
                              'email_notifications',
                              !formData.notification.email_notifications,
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            formData.notification.email_notifications
                              ? 'bg-indigo-600'
                              : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              formData.notification.email_notifications
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                      Metode Pembayaran
                    </h3>

                    <div className="space-y-4">
                      {[
                        {
                          key: 'payment_cash',
                          label: 'Tunai',
                          description: 'Pembayaran langsung dengan uang tunai',
                        },
                        {
                          key: 'payment_transfer',
                          label: 'Transfer Bank',
                          description: 'Pembayaran via transfer antar bank',
                        },
                        {
                          key: 'payment_qris',
                          label: 'QRIS',
                          description: 'Pembayaran via scan QRIS',
                        },
                      ].map((method) => (
                        <div
                          key={method.key}
                          className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                        >
                          <div>
                            <h4 className="font-medium text-slate-900">
                              {method.label}
                            </h4>
                            <p className="text-sm text-slate-500">
                              {method.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleChange(
                                'payment',
                                method.key,
                                !formData.payment[method.key],
                              )
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              formData.payment[method.key]
                                ? 'bg-indigo-600'
                                : 'bg-slate-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                formData.payment[method.key]
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      general: { ...settings.general },
                      tax: { ...settings.tax },
                      notification: { ...settings.notification },
                      payment: { ...settings.payment },
                    });
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
