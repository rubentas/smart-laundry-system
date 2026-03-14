<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\CustomerController;
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
    Route::get('/dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    Route::get('/owner/dashboard', fn () => Inertia::render('owner/dashboard'))
        ->middleware('role:owner')
        ->name('owner.dashboard');

    Route::get('/cashier/dashboard', fn () => Inertia::render('cashier/dashboard'))
        ->middleware('role:cashier')
        ->name('cashier.dashboard');

    Route::get('/admin/dashboard', fn () => Inertia::render('admin/dashboard'))
        ->middleware('role:branch_admin')
        ->name('admin.dashboard');

    Route::get('/customer/dashboard', fn () => Inertia::render('customer/dashboard'))
        ->middleware('role:customer')
        ->name('customer.dashboard');
});

// Owner routes
Route::middleware(['auth', 'role:owner'])->prefix('owner')->group(function () {
    Route::resource('branches', BranchController::class);
    Route::resource('services', ServiceController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('orders', OrderController::class); // PINDAHKAN KE SINI
});

// Status update & print tetap di dalam group owner
Route::middleware(['auth', 'role:owner'])->prefix('owner')->group(function () {
    Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
    Route::get('orders/{order}/print', [OrderController::class, 'print'])->name('orders.print');
});

require __DIR__.'/settings.php';
