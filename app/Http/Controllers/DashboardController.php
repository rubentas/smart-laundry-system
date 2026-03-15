<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
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
    ]);
  }
}