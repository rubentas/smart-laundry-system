<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
  // Owner
  public function owner()
  {
    $today = now()->format('Y-m-d');

    $todayRevenue = Order::whereDate('order_date', $today)
      ->where('status', '!=', 'cancelled')
      ->sum('grand_total');

    $todayOrders = Order::whereDate('order_date', $today)->count();

    $todayCustomers = Customer::whereDate('created_at', $today)->count();

    $pendingOrders = Order::where('status', 'pending')->count();
    $readyOrders = Order::where('status', 'ready_pickup')->count();

    $revenueChart = Order::where('status', '!=', 'cancelled')
      ->where('order_date', '>=', now()->subDays(6)->startOfDay())
      ->select(
        DB::raw('DATE(order_date) as date'),
        DB::raw('SUM(grand_total) as total')
      )
      ->groupBy('date')
      ->orderBy('date')
      ->get()
      ->keyBy('date')
      ->map(function ($item) {
        return $item->total;
      });

    $dates = collect();
    for ($i = 6; $i >= 0; $i--) {
      $date = now()->subDays($i)->format('Y-m-d');
      $dates->put($date, $revenueChart[$date] ?? 0);
    }

    $topServices = DB::table('order_items')
      ->join('services', 'order_items.service_id', '=', 'services.id')
      ->select(
        'services.name',
        DB::raw('COUNT(*) as total_orders'),
        DB::raw('SUM(order_items.subtotal) as revenue')
      )
      ->where('order_items.created_at', '>=', now()->subDays(30))
      ->groupBy('services.id', 'services.name')
      ->orderByDesc('revenue')
      ->limit(5)
      ->get();

    $recentOrders = Order::with(['customer'])
      ->latest()
      ->limit(10)
      ->get()
      ->map(function ($order) {
        return [
          'id' => $order->id,
          'order_number' => $order->order_number,
          'customer_name' => $order->customer->name,
          'grand_total' => $order->grand_total,
          'status' => $order->status,
          'created_at' => $order->created_at?->format('Y-m-d H:i'),
        ];
      });

    return Inertia::render('dashboard/owner', [
      'stats' => [
        'todayRevenue' => $todayRevenue,
        'todayOrders' => $todayOrders,
        'todayCustomers' => $todayCustomers,
        'pendingOrders' => $pendingOrders,
        'readyOrders' => $readyOrders,
        'averageOrder' => $todayOrders > 0
          ? $todayRevenue / $todayOrders
          : 0,
      ],
      'charts' => [
        'revenue7days' => [
          'labels' => $dates->keys()->map(fn($date) => now()->parse($date)->format('d M')),
          'data' => $dates->values(),
        ],
      ],
      'topServices' => $topServices,
      'recentOrders' => $recentOrders,
      'branches' => \App\Models\Branch::all(),
      'currentBranchId' => session('selected_branch_id'),
    ]);
  }

  // Kasir
  public function cashier()
  {
    $today = now()->format('Y-m-d');
    /** @var \App\Models\User $authUser */
    $authUser = Auth::user();
    $cashierId = $authUser->id;
    $branchId = $authUser->branch_id;

    // Statistik untuk kasir
    $stats = [
      'todayOrders' => Order::whereDate('order_date', $today)
        ->where('cashier_id', $cashierId)
        ->count(),

      'todayRevenue' => Order::whereDate('order_date', $today)
        ->where('cashier_id', $cashierId)
        ->where('status', '!=', 'cancelled')
        ->sum('grand_total'),

      'pendingOrders' => Order::where('status', 'pending')
        ->where('cashier_id', $cashierId)
        ->count(),

      'readyOrders' => Order::where('status', 'ready_pickup')
        ->where('cashier_id', $cashierId)
        ->count(),

      'completedToday' => Order::whereDate('order_date', $today)
        ->where('cashier_id', $cashierId)
        ->where('status', 'completed')
        ->count(),
    ];

    // Order yang perlu diproses (pending)
    $pendingOrders = Order::with('customer')
      ->where('cashier_id', $cashierId)
      ->whereIn('status', ['pending', 'washing', 'drying', 'ironing'])
      ->latest()
      ->limit(10)
      ->get()
      ->map(function ($order) {
        return [
          'id' => $order->id,
          'order_number' => $order->order_number,
          'customer_name' => $order->customer->name,
          'status' => $order->status,
          'created_at' => $order->created_at->format('H:i, d M'),
        ];
      });

    // Order siap ambil
    $readyOrders = Order::with('customer')
      ->where('cashier_id', $cashierId)
      ->where('status', 'ready_pickup')
      ->latest()
      ->limit(10)
      ->get()
      ->map(function ($order) {
        return [
          'id' => $order->id,
          'order_number' => $order->order_number,
          'customer_name' => $order->customer->name,
          'grand_total' => $order->grand_total,
          'created_at' => $order->created_at->format('H:i, d M'),
        ];
      });

    return Inertia::render('dashboard/cashier', [
      'stats' => $stats,
      'pendingOrders' => $pendingOrders,
      'readyOrders' => $readyOrders,
    ]);
  }

  // Admin
  public function admin()
  {
    /** @var \App\Models\User $authUser */
    $authUser = Auth::user();
    $branchId = $authUser->branch_id;

    if (! $branchId) {
      return redirect()->back()->with('error', 'Anda tidak memiliki cabang');
    }

    $today = now()->format('Y-m-d');

    // Statistik cabang
    $stats = [
      'todayOrders' => Order::where('branch_id', $branchId)
        ->whereDate('order_date', $today)
        ->count(),

      'todayRevenue' => Order::where('branch_id', $branchId)
        ->whereDate('order_date', $today)
        ->where('status', '!=', 'cancelled')
        ->sum('grand_total'),

      'pendingOrders' => Order::where('branch_id', $branchId)
        ->where('status', 'pending')
        ->count(),

      'readyOrders' => Order::where('branch_id', $branchId)
        ->where('status', 'ready_pickup')
        ->count(),

      'totalCustomers' => Customer::whereHas('orders', function ($q) use ($branchId) {
        $q->where('branch_id', $branchId);
      })->count(),

      'avgOrderValue' => Order::where('branch_id', $branchId)
        ->where('status', '!=', 'cancelled')
        ->avg('grand_total') ?? 0,

      'activeCouriers' => Courier::where('status', 'available')->count(),
      'pendingDelivery' => Order::where('branch_id', $branchId)
        ->where('need_delivery', true)
        ->where('delivery_status', 'pending')
        ->count(),
    ];

    // Order hari ini
    $todayOrders = Order::with('customer')
      ->where('branch_id', $branchId)
      ->whereDate('order_date', $today)
      ->latest()
      ->limit(10)
      ->get();

    // Top services di cabang ini
    $topServices = DB::table('order_items')
      ->join('services', 'order_items.service_id', '=', 'services.id')
      ->join('orders', 'order_items.order_id', '=', 'orders.id')
      ->where('orders.branch_id', $branchId)
      ->where('order_items.created_at', '>=', now()->subDays(30))
      ->select(
        'services.name',
        DB::raw('COUNT(*) as total_orders'),
        DB::raw('SUM(order_items.subtotal) as revenue')
      )
      ->groupBy('services.id', 'services.name')
      ->orderByDesc('revenue')
      ->limit(5)
      ->get();

    return Inertia::render('dashboard/admin', [
      'stats' => $stats,
      'todayOrders' => $todayOrders,
      'topServices' => $topServices,
      'branchName' => $authUser->branch->name ?? 'Cabang Saya',
    ]);
  }

  // Pelanggan
  public function customer()
  {
    /** @var \App\Models\User $user */
    $user = Auth::user();

    // Cari customer berdasarkan user_id atau langsung dari tabel customers
    $customer = Customer::where('user_id', $user->id)->first();

    if (! $customer) {
      // Fallback: coba cari berdasarkan email atau langsung ambil dari user
      $customer = Customer::where('email', $user->email)->first();
    }

    if (! $customer) {
      // Jika tidak ada, buat dummy atau redirect
      return redirect()->back()->with('error', 'Data customer tidak ditemukan');
    }

    $customerId = $customer->id;

    // Statistik customer
    $stats = [
      'totalOrders' => Order::where('customer_id', $customerId)->count(),
      'totalSpent' => Order::where('customer_id', $customerId)
        ->where('status', '!=', 'cancelled')
        ->sum('grand_total'),
      'pendingOrders' => Order::where('customer_id', $customerId)
        ->whereIn('status', ['pending', 'washing', 'drying', 'ironing'])
        ->count(),
      'readyOrders' => Order::where('customer_id', $customerId)
        ->where('status', 'ready_pickup')
        ->count(),
      'completedOrders' => Order::where('customer_id', $customerId)
        ->where('status', 'completed')
        ->count(),
      'memberSince' => $customer->created_at ? $customer->created_at->format('d M Y') : date('d M Y'),
    ];

    // Order terbaru
    $recentOrders = Order::where('customer_id', $customerId)
      ->with('branch')
      ->latest()
      ->limit(10)
      ->get()
      ->map(function ($order) {
        return [
          'id' => $order->id,
          'order_number' => $order->order_number,
          'branch_name' => $order->branch->name,
          'grand_total' => $order->grand_total,
          'status' => $order->status,
          'created_at' => $order->created_at->format('d M Y H:i'),
          'is_paid' => $order->is_paid,
        ];
      });

    // Data customer dengan loyalty points
    $customerData = [
      'id' => $customer->id,
      'name' => $customer->name,
      'email' => $customer->email,
      'phone' => $customer->phone,
      'address' => $customer->address,
      'is_member' => $customer->is_member ?? false,
      'loyalty_points' => $customer->loyalty_points ?? 0,
      'membership_tier' => $customer->membership_tier ?? 'regular',
    ];

    return Inertia::render('dashboard/customer', [
      'stats' => $stats,
      'recentOrders' => $recentOrders,
      'customer' => $customerData,
    ]);
  }
}
