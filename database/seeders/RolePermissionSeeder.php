<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
  public function run()
  {
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

    $permissions = [
      'manage_users',
      'manage_branches',
      'manage_services',
      'manage_prices',

      'create_orders',
      'update_orders',
      'view_orders',
      'delete_orders',

      'manage_payments',

      'view_reports',

      'manage_coupons',
      'view_ai_insights',

      'send_notifications',

      'manage_settings',
    ];

    foreach ($permissions as $permission) {
      Permission::create(['name' => $permission]);
    }

    $owner = Role::create(['name' => 'owner']);
    $admin = Role::create(['name' => 'branch_admin']);
    $cashier = Role::create(['name' => 'cashier']);
    $customer = Role::create(['name' => 'customer']);

    $owner->givePermissionTo(Permission::all());

    $admin->givePermissionTo([
      'manage_services',
      'manage_prices',
      'update_orders',
      'view_orders',
      'view_reports',
      'send_notifications',
    ]);

    $cashier->givePermissionTo([
      'create_orders',
      'update_orders',
      'view_orders',
      'manage_payments',
    ]);

    $customer->givePermissionTo([
      'view_orders',
    ]);
  }
}
