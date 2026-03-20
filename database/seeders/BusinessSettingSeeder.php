<?php

namespace Database\Seeders;

use App\Models\BusinessSetting;
use Illuminate\Database\Seeder;

class BusinessSettingSeeder extends Seeder
{
  public function run(): void
  {
    $settings = [
      // General Settings
      [
        'key' => 'business_name',
        'value' => 'Smart Laundry',
        'type' => 'text',
        'group' => 'general',
        'label' => 'Nama Bisnis',
        'description' => 'Nama perusahaan atau brand laundry Anda',
        'sort_order' => 10,
      ],
      [
        'key' => 'business_address',
        'value' => 'Jl. Contoh No. 123, Jakarta',
        'type' => 'text',
        'group' => 'general',
        'label' => 'Alamat Bisnis',
        'description' => 'Alamat lengkap kantor pusat',
        'sort_order' => 20,
      ],
      [
        'key' => 'business_phone',
        'value' => '021-5551234',
        'type' => 'text',
        'group' => 'general',
        'label' => 'Nomor Telepon',
        'description' => 'Nomor telepon yang bisa dihubungi',
        'sort_order' => 30,
      ],
      [
        'key' => 'business_email',
        'value' => 'info@smartlaundry.com',
        'type' => 'email',
        'group' => 'general',
        'label' => 'Email Bisnis',
        'description' => 'Email untuk korespondensi',
        'sort_order' => 40,
      ],

      // Tax Settings
      [
        'key' => 'tax_enabled',
        'value' => 'false',
        'type' => 'boolean',
        'group' => 'tax',
        'label' => 'Aktifkan Pajak',
        'description' => 'Apakah akan mengenakan pajak pada transaksi',
        'sort_order' => 10,
      ],
      [
        'key' => 'tax_percentage',
        'value' => '11',
        'type' => 'number',
        'group' => 'tax',
        'label' => 'Persentase Pajak',
        'description' => 'Nilai pajak dalam persen (%)',
        'sort_order' => 20,
      ],
      [
        'key' => 'tax_number',
        'value' => '',
        'type' => 'text',
        'group' => 'tax',
        'label' => 'NPWP/Nomor Pajak',
        'description' => 'Nomor pokok wajib pajak',
        'sort_order' => 30,
      ],

      // Notification Settings
      [
        'key' => 'wa_notifications',
        'value' => 'true',
        'type' => 'boolean',
        'group' => 'notification',
        'label' => 'Notifikasi WhatsApp',
        'description' => 'Kirim notifikasi via WhatsApp',
        'sort_order' => 10,
      ],
      [
        'key' => 'wa_token',
        'value' => '',
        'type' => 'text',
        'group' => 'notification',
        'label' => 'WhatsApp API Token',
        'description' => 'Token dari provider WhatsApp',
        'sort_order' => 20,
      ],
      [
        'key' => 'email_notifications',
        'value' => 'false',
        'type' => 'boolean',
        'group' => 'notification',
        'label' => 'Notifikasi Email',
        'description' => 'Kirim notifikasi via Email',
        'sort_order' => 30,
      ],

      // Payment Settings
      [
        'key' => 'payment_cash',
        'value' => 'true',
        'type' => 'boolean',
        'group' => 'payment',
        'label' => 'Pembayaran Tunai',
        'description' => 'Terima pembayaran cash',
        'sort_order' => 10,
      ],
      [
        'key' => 'payment_transfer',
        'value' => 'true',
        'type' => 'boolean',
        'group' => 'payment',
        'label' => 'Transfer Bank',
        'description' => 'Terima pembayaran transfer',
        'sort_order' => 20,
      ],
      [
        'key' => 'payment_qris',
        'value' => 'true',
        'type' => 'boolean',
        'group' => 'payment',
        'label' => 'QRIS',
        'description' => 'Terima pembayaran QRIS',
        'sort_order' => 30,
      ],
    ];

    foreach ($settings as $setting) {
      BusinessSetting::updateOrCreate(
        ['key' => $setting['key']],
        $setting
      );
    }
  }
}
