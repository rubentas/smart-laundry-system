<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\BranchSessionController;
use App\Http\Controllers\BusinessSettingController;
use App\Http\Controllers\CourierController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoyaltyController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\PromoValidationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ServiceController;
use App\Models\Order;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
  return Inertia::render('welcome');
})->name('home');

/*
|--------------------------------------------------------------------------
| Test Routes
|--------------------------------------------------------------------------
*/
Route::get('/test-owner', function () {
  return 'Kamu owner!';
})->middleware(['auth', 'role:owner']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes (All Roles)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
  // Role-based dashboards
  Route::get('/owner/dashboard', fn() => Inertia::render('owner/dashboard'))
    ->middleware('role:owner')
    ->name('owner.dashboard');

  Route::get('/cashier/dashboard', [DashboardController::class, 'cashier'])
    ->middleware('role:cashier')
    ->name('cashier.dashboard');

  Route::get('/admin/dashboard', [DashboardController::class, 'admin'])
    ->middleware('role:branch_admin')
    ->name('admin.dashboard');

  Route::get('/customer/dashboard', [DashboardController::class, 'customer'])
    ->middleware('role:customer')
    ->name('customer.dashboard');
});

/*
|--------------------------------------------------------------------------
| Owner Routes (Full Access)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:owner'])
  ->prefix('owner')
  ->name('owner.')
  ->group(function () {

    // Branch Session Routes (pilih cabang)
    Route::get('select-branch', [BranchSessionController::class, 'index'])->name('branch.select');
    Route::post('branch-session', [BranchSessionController::class, 'store'])->name('branch.session');
    Route::delete('branch-session', [BranchSessionController::class, 'destroy'])->name('branch.session.destroy');

    // Resource routes
    Route::resource('branches', BranchController::class);
    Route::resource('services', ServiceController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('orders', OrderController::class);

    // Custom order routes
    Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::get('orders/{order}/print', [OrderController::class, 'print'])->name('orders.print');

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'owner'])->name('dashboard');

    // Report routes
    Route::prefix('reports')->name('reports.')->group(function () {
      Route::get('/', [ReportController::class, 'index'])->name('index');
      Route::get('generate', [ReportController::class, 'generate'])->name('generate');
      Route::get('export-pdf', [ReportController::class, 'exportPdf'])->name('export-pdf');
      Route::get('export-excel', [ReportController::class, 'exportExcel'])->name('export-excel');
    });

    // Payment routes
    Route::prefix('orders/{order}/payment')->name('orders.payment.')->group(function () {
      Route::get('/', [PaymentController::class, 'process'])->name('index');
      Route::get('status', [PaymentController::class, 'checkStatus'])->name('status');
    });

    Route::post('/orders/{order}/send-notification', [OrderController::class, 'sendNotification'])->name('orders.send-notification');

    Route::get('/ai/insights', [AIController::class, 'insights'])->name('ai.insights');
    Route::post('/ai/refresh', [AIController::class, 'refresh'])->name('ai.refresh');

    Route::get('/business/settings', [BusinessSettingController::class, 'index'])->name('business.settings');
    Route::post('/business/settings', [BusinessSettingController::class, 'update'])->name('business.settings.update');

    // Promo routes
    Route::resource('promos', PromoController::class);
    Route::post('orders/{order}/apply-promo', [OrderController::class, 'applyPromo'])->name('orders.apply-promo');
    Route::post('promo/validate', [PromoValidationController::class, 'validatePromo'])->name('promo.validate');
    Route::get('/promo/code/generate', [PromoController::class, 'generateCode'])->name('promo.generate-code');

    // Courier routes
    Route::resource('couriers', CourierController::class);
    Route::post('couriers/{courier}/update-status', [CourierController::class, 'updateStatus'])->name('couriers.update-status');
    Route::post('orders/{order}/assign-courier', [CourierController::class, 'assignOrder'])->name('orders.assign-courier');
    Route::post('orders/{order}/update-delivery', [CourierController::class, 'updateDeliveryStatus'])->name('orders.update-delivery');

    // Loyalty routes
    Route::resource('loyalty', LoyaltyController::class);
    Route::get('customers/{customer}/points', [LoyaltyController::class, 'customerPoints'])->name('customers.points');
    Route::post('customers/{customer}/redeem', [LoyaltyController::class, 'redeemReward'])->name('customers.redeem');
    Route::get('loyalty/rewards-available', [LoyaltyController::class, 'rewardsAvailable'])->name('loyalty.rewards');

    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics');

    // Activity Logs
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    Route::get('activity-logs/{log}', [ActivityLogController::class, 'show'])->name('activity-logs.show');
    Route::get('activity-logs/export', [ActivityLogController::class, 'export'])->name('activity-logs.export');

    // Backup routes
    Route::prefix('backups')->name('backups.')->group(function () {
      Route::get('/', [BackupController::class, 'index'])->name('index');
      Route::post('/create', [BackupController::class, 'create'])->name('create');
      Route::get('/download/{filename}', [BackupController::class, 'download'])->name('download');
      Route::delete('/delete/{filename}', [BackupController::class, 'delete'])->name('delete');
      Route::post('/restore', [BackupController::class, 'restore'])->name('restore');
    });
  });

/*
|--------------------------------------------------------------------------
| Admin Cabang Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:branch_admin'])
  ->prefix('admin')
  ->name('admin.')
  ->group(function () {

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'admin'])->name('dashboard');

    // Orders
    Route::resource('orders', OrderController::class);
    Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::post('orders/{order}/apply-promo', [OrderController::class, 'applyPromo'])->name('orders.apply-promo');

    // Customers
    Route::resource('customers', CustomerController::class);

    // Services
    Route::resource('services', ServiceController::class);

    // Couriers
    Route::get('couriers', [CourierController::class, 'adminIndex'])->name('couriers.index');
    Route::post('couriers/{courier}/update-status', [CourierController::class, 'updateStatus'])->name('couriers.update-status');
    Route::post('orders/{order}/assign-courier', [CourierController::class, 'assignOrder'])->name('orders.assign-courier');
    Route::post('orders/{order}/update-delivery', [CourierController::class, 'updateDeliveryStatus'])->name('orders.update-delivery');
    // Loyalty
    Route::get('customers/{customer}/points', [LoyaltyController::class, 'customerPoints'])->name('customers.points');

    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics');
    Route::get('analytics', [AnalyticsController::class, 'adminIndex'])->name('analytics');

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
      Route::get('/', [ReportController::class, 'index'])->name('index');
      Route::get('generate', [ReportController::class, 'generate'])->name('generate');
    });
  });

/*
|--------------------------------------------------------------------------
| Cashier Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:cashier'])
  ->prefix('cashier')
  ->name('cashier.')
  ->group(function () {

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'cashier'])->name('dashboard');

    // Orders
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');

    // Promo
    Route::post('orders/{order}/apply-promo', [OrderController::class, 'applyPromo'])->name('orders.apply-promo');
    Route::post('promo/validate', [PromoValidationController::class, 'validatePromo'])->name('promo.validate');
    Route::get('promo', [PromoController::class, 'cashierIndex'])->name('promo.index');

    // Customers
    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/create', [CustomerController::class, 'create'])->name('customers.create');
    Route::post('customers', [CustomerController::class, 'store'])->name('customers.store');
  });

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer'])
  ->prefix('customer')
  ->name('customer.')
  ->group(function () {

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'customer'])->name('dashboard');

    // Orders
    Route::get('orders', [OrderController::class, 'customerOrders'])->name('orders');
    Route::get('orders/{order}', [OrderController::class, 'customerShow'])->name('orders.show');

    // Loyalty
    Route::get('loyalty', [LoyaltyController::class, 'customerLoyalty'])->name('loyalty');
    Route::get('points', [LoyaltyController::class, 'customerPoints'])->name('points');
    Route::post('redeem', [LoyaltyController::class, 'redeemReward'])->name('redeem');

    // Profile
    Route::get('profile', [CustomerController::class, 'profile'])->name('profile');
    Route::put('profile', [CustomerController::class, 'updateProfile'])->name('profile.update');
  });

/*
|--------------------------------------------------------------------------
| Public Payment Callbacks 
|--------------------------------------------------------------------------
*/
Route::prefix('payment')->name('payment.')->group(function () {
  Route::post('callback', [PaymentController::class, 'callback'])->name('callback');
  Route::get('finish', [PaymentController::class, 'finish'])->name('finish');
  Route::get('unfinish', [PaymentController::class, 'unfinish'])->name('unfinish');
  Route::get('error', [PaymentController::class, 'error'])->name('error');
});

/*
|--------------------------------------------------------------------------
| Test Routes
|--------------------------------------------------------------------------
*/
Route::get('/test-wa', function () {
  $whatsapp = new \App\Services\WhatsAppService();
  $order = Order::first();

  if ($order) {
    $result = $whatsapp->sendOrderStatusUpdate($order, 'ready_pickup');
    return response()->json(['success' => $result]);
  }

  return response()->json(['error' => 'No order found']);
})->middleware(['auth', 'role:owner']);

/*
|--------------------------------------------------------------------------
| Settings Routes 
|--------------------------------------------------------------------------
*/
require __DIR__ . '/settings.php';
