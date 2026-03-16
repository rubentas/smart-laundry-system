<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
  return Inertia::render('welcome');
})->name('home');

Route::get('/test-owner', function () {
  return 'Kamu owner!';
})->middleware(['auth', 'role:owner']);

Route::middleware(['auth'])->group(function () {

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

// Owner Routes
Route::middleware(['auth', 'role:owner'])->prefix('owner')->name('owner.')->group(function () {
  // Resource routes
  Route::resource('branches', BranchController::class);
  Route::resource('services', ServiceController::class);
  Route::resource('customers', CustomerController::class);
  Route::resource('orders', OrderController::class);

  // Custom order routes
  Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
  Route::get('orders/{order}/print', [OrderController::class, 'print'])->name('orders.print');

  // Dashboard Owner
  Route::get('/dashboard', [DashboardController::class, 'owner'])->name('dashboard');

  // Report routes
  Route::get('/reports', [App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
  Route::get('/reports/generate', [App\Http\Controllers\ReportController::class, 'generate'])->name('reports.generate');
  Route::get('/reports/export-pdf', [App\Http\Controllers\ReportController::class, 'exportPdf'])->name('reports.export-pdf');
  Route::get('/reports/export-excel', [App\Http\Controllers\ReportController::class, 'exportExcel'])->name('reports.export-excel');
});

require __DIR__ . '/settings.php';