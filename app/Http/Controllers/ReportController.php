<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportExport;

class ReportController extends Controller
{
  public function index(Request $request)
  {
    $branches = Branch::where('is_active', true)->get(['id', 'name']);

    return Inertia::render('reports/index', [
      'branches' => $branches,
      'filters' => $request->only(['type', 'start_date', 'end_date', 'branch_id'])
    ]);
  }

  public function generate(Request $request)
  {
    $request->validate([
      'type' => 'required|in:daily,weekly,monthly,custom',
      'start_date' => 'required|date',
      'end_date' => 'required|date|after_or_equal:start_date',
      'branch_id' => 'nullable|exists:branches,id',
    ]);

    $query = Order::with(['customer', 'branch'])
      ->whereBetween('order_date', [$request->start_date, $request->end_date])
      ->where('status', '!=', 'cancelled');

    if ($request->branch_id) {
      $query->where('branch_id', $request->branch_id);
    }

    $orders = $query->get();

    // Summary
    $summary = [
      'total_orders' => $orders->count(),
      'total_revenue' => $orders->sum('grand_total'),
      'average_order' => $orders->count() > 0 ? $orders->avg('grand_total') : 0,
      'total_weight' => $orders->sum('total_weight'),
      'paid_orders' => $orders->where('is_paid', true)->count(),
      'unpaid_orders' => $orders->where('is_paid', false)->count(),
    ];

    // Per cabang
    $byBranch = $orders->groupBy('branch_id')->map(function ($branchOrders, $branchId) {
      $branch = Branch::find($branchId);
      return [
        'branch_name' => $branch->name ?? 'Unknown',
        'total_orders' => $branchOrders->count(),
        'total_revenue' => $branchOrders->sum('grand_total'),
      ];
    })->values();

    // Per status
    $byStatus = $orders->groupBy('status')->map(function ($statusOrders, $status) {
      return [
        'status' => $status,
        'total' => $statusOrders->count(),
        'revenue' => $statusOrders->sum('grand_total'),
      ];
    })->values();

    // Per layanan
    $byService = DB::table('order_items')
      ->join('orders', 'order_items.order_id', '=', 'orders.id')
      ->join('services', 'order_items.service_id', '=', 'services.id')
      ->whereBetween('orders.order_date', [$request->start_date, $request->end_date])
      ->when($request->branch_id, function ($q, $branchId) {
        return $q->where('orders.branch_id', $branchId);
      })
      ->select(
        'services.name',
        DB::raw('COUNT(*) as total_orders'),
        DB::raw('SUM(order_items.quantity) as total_quantity'),
        DB::raw('SUM(order_items.subtotal) as revenue')
      )
      ->groupBy('services.id', 'services.name')
      ->orderByDesc('revenue')
      ->get();

    return Inertia::render('reports/result', [
      'summary' => $summary,
      'byBranch' => $byBranch,
      'byStatus' => $byStatus,
      'byService' => $byService,
      'orders' => $orders,
      'filters' => $request->all(),
    ]);
  }

  public function exportPdf(Request $request)
  {
    // Generate PDF
    $data = $this->getReportData($request);
    $pdf = Pdf::loadView('reports.pdf', $data);
    return $pdf->download('laporan-' . now()->format('Ymd') . '.pdf');
  }

  public function exportExcel(Request $request)
  {
    // Generate Excel
    return Excel::download(new ReportExport($request), 'laporan-' . now()->format('Ymd') . '.xlsx');
  }

  private function getReportData($request)
  {
    $query = Order::with(['customer', 'branch', 'items.service'])
      ->whereBetween('order_date', [$request->start_date, $request->end_date])
      ->where('status', '!=', 'cancelled');

    if ($request->branch_id) {
      $query->where('branch_id', $request->branch_id);
    }

    $orders = $query->get();

    // Summary
    $summary = [
      'total_orders' => $orders->count(),
      'total_revenue' => $orders->sum('grand_total'),
      'average_order' => $orders->count() > 0 ? $orders->avg('grand_total') : 0,
      'total_weight' => $orders->sum('total_weight'),
      'paid_orders' => $orders->where('is_paid', true)->count(),
      'unpaid_orders' => $orders->where('is_paid', false)->count(),
    ];

    // Per cabang - menggunakan eager loaded branch data (tidak ada N+1 query!)
    $byBranch = $orders->groupBy('branch_id')->map(function ($branchOrders) {
      $branchName = $branchOrders->first()?->branch?->name ?? 'Unknown';
      return [
        'branch_name' => $branchName,
        'total_orders' => $branchOrders->count(),
        'total_revenue' => $branchOrders->sum('grand_total'),
      ];
    })->values();

    // Per status
    $byStatus = $orders->groupBy('status')->map(function ($statusOrders, $status) {
      return [
        'status' => $status,
        'total' => $statusOrders->count(),
        'revenue' => $statusOrders->sum('grand_total'),
      ];
    })->values();

    // Per layanan
    $byService = DB::table('order_items')
      ->join('orders', 'order_items.order_id', '=', 'orders.id')
      ->join('services', 'order_items.service_id', '=', 'services.id')
      ->whereBetween('orders.order_date', [$request->start_date, $request->end_date])
      ->when($request->branch_id, function ($q, $branchId) {
        return $q->where('orders.branch_id', $branchId);
      })
      ->select(
        'services.name',
        DB::raw('COUNT(*) as total_orders'),
        DB::raw('SUM(order_items.quantity) as total_quantity'),
        DB::raw('SUM(order_items.subtotal) as revenue')
      )
      ->groupBy('services.id', 'services.name')
      ->orderByDesc('revenue')
      ->get();

    return [
      'summary' => $summary,
      'byBranch' => $byBranch,
      'byStatus' => $byStatus,
      'byService' => $byService,
      'orders' => $orders,
      'filters' => $request->all(),
    ];
  }
}
