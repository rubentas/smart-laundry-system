<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  public function run()
  {
    // Owner
    $owner = User::create([
      'name' => 'Owner',
      'email' => 'owner@laundry.com',
      'password' => Hash::make('password123'),
    ]);
    $owner->assignRole('owner');

    // Admin Cabang
    $admin = User::create([
      'name' => 'Admin Cabang',
      'email' => 'admin@laundry.com',
      'password' => Hash::make('password123'),
      'branch_id' => 1,
    ]);
    $admin->assignRole('branch_admin');

    // Kasir
    $kasir = User::create([
      'name' => 'Kasir',
      'email' => 'kasir@laundry.com',
      'password' => Hash::make('password123'),
      'branch_id' => 1,
    ]);
    $kasir->assignRole('cashier');

    // Customer
    $customerUser = User::create([
      'name' => 'Customer',
      'email' => 'customer@laundry.com',
      'password' => Hash::make('password123'),
    ]);
    $customerUser->assignRole('customer');

    Customer::create([
      'user_id' => $customerUser->id,
      'customer_code' => 'CUST001',
      'name' => 'Customer',
      'email' => 'customer@laundry.com',
      'phone' => '08123456789',
      'is_member' => true,
      'is_active' => true,
      'loyalty_points' => 500,
    ]);
  }
}
