<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home page
Route::get('/', function () {
  return Inertia::render('welcome');
})->name('home');

// Test route buat ngecek middleware role
Route::get('/test-owner', function () {
  return 'Kamu owner!';
})->middleware(['auth', 'role:owner']);

// Dashboard routes berdasarkan role
Route::middleware(['auth'])->group(function () {
  // Owner dashboard
  Route::get('/owner/dashboard', function () {
    return Inertia::render('Owner/Dashboard');
  })->name('owner.dashboard');

  // Cashier dashboard
  Route::get('/cashier/dashboard', function () {
    return Inertia::render('Cashier/Dashboard');
  })->name('cashier.dashboard');

  // Admin cabang dashboard
  Route::get('/admin/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
  })->name('admin.dashboard');

  // Customer dashboard
  Route::get('/customer/dashboard', function () {
    return Inertia::render('Customer/Dashboard');
  })->name('customer.dashboard');
});

// Auth routes (dari Fortify)
require __DIR__ . '/auth.php';

// Settings routes (profile, password, etc)
require __DIR__ . '/settings.php';