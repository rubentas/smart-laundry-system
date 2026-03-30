<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $range = $request->input('range', 'month');

        return Inertia::render('analytics/index', [
            'revenueData' => $this->getRevenueData($range),
            'orderStats' => $this->getOrderStats($range),
            'topServices' => $this->getTopServices($range),
            'customerStats' => $this->getCustomerStats($range),
            'prediction' => $this->getPrediction($range),
            'range' => $range,
        ]);
    }

    public function adminIndex(Request $request)
    {
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();
        $branchId = $authUser->branch_id;
        $range = $request->input('range', 'month');

        return Inertia::render('admin/analytics/index', [
            'revenueData' => $this->getRevenueData($range, $branchId),
            'orderStats' => $this->getOrderStats($range, $branchId),
            'topServices' => $this->getTopServices($range, $branchId),
            'branchName' => $authUser->branch->name ?? 'Cabang',
            'range' => $range,
        ]);
    }

    private function getRevenueData(string $range, ?int $branchId = null): array
    {
        $dates = $this->getDateRange($range);

        $groupFormat = match ($range) {
            'year' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        $labelFormat = match ($range) {
            'year' => 'M Y',
            default => 'd M',
        };

        $query = Order::where('status', '!=', 'cancelled')
            ->whereBetween('order_date', [$dates['start'], $dates['end']]);

        if ($branchId) {
            $query->where('branch_id', $branchId);
        } else {
            $query->withoutGlobalScope(\App\Models\Scopes\BranchScope::class);
        }

        $rows = $query->select(
            DB::raw("DATE_FORMAT(order_date, '{$groupFormat}') as period"),
            DB::raw('SUM(grand_total) as total')
        )
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return [
            'labels' => $rows->map(fn ($r) => \Carbon\Carbon::parse($r->period)->format($labelFormat))->toArray(),
            'values' => $rows->pluck('total')->map(fn ($v) => (float) $v)->toArray(),
        ];
    }

    private function getOrderStats(string $range, ?int $branchId = null): array
    {
        $dates = $this->getDateRange($range);
        $previousDates = $this->getPreviousDateRange($range);

        $baseQuery = fn () => Order::whereBetween('order_date', [$dates['start'], $dates['end']])
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when(! $branchId, fn ($q) => $q->withoutGlobalScope(\App\Models\Scopes\BranchScope::class));

        $prevQuery = fn () => Order::whereBetween('order_date', [$previousDates['start'], $previousDates['end']])
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when(! $branchId, fn ($q) => $q->withoutGlobalScope(\App\Models\Scopes\BranchScope::class));

        $current = $baseQuery()->selectRaw('COUNT(*) as total, AVG(grand_total) as avg_order, SUM(grand_total) as revenue')->first();
        $previous = $prevQuery()->selectRaw('COUNT(*) as total, SUM(grand_total) as revenue')->first();

        $statusBreakdown = $baseQuery()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        return [
            'total_orders' => (int) ($current->total ?? 0),
            'avg_order' => (float) ($current->avg_order ?? 0),
            'revenue' => (float) ($current->revenue ?? 0),
            'growth' => $this->calculateGrowth($previous->total ?? 0, $current->total ?? 0),
            'revenue_growth' => $this->calculateGrowth($previous->revenue ?? 0, $current->revenue ?? 0),
            'status_breakdown' => $statusBreakdown,
        ];
    }

    private function getTopServices(string $range, ?int $branchId = null)
    {
        $dates = $this->getDateRange($range);

        return DB::table('order_items')
            ->join('services', 'order_items.service_id', '=', 'services.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.order_date', [$dates['start'], $dates['end']])
            ->when($branchId, fn ($q) => $q->where('orders.branch_id', $branchId))
            ->select(
                'services.name',
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(order_items.subtotal) as revenue'),
                DB::raw('SUM(order_items.quantity) as total_quantity')
            )
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();
    }

    private function getCustomerStats(string $range): array
    {
        $dates = $this->getDateRange($range);

        $newCustomers = Customer::whereBetween('created_at', [$dates['start'], $dates['end']])->count();

        $repeatCustomers = DB::table('orders')
            ->whereBetween('order_date', [$dates['start'], $dates['end']])
            ->selectRaw('customer_id, COUNT(*) as order_count')
            ->groupBy('customer_id')
            ->having('order_count', '>', 1)
            ->count();

        $memberOrders = DB::table('orders')
            ->join('customers', 'orders.customer_id', '=', 'customers.id')
            ->whereBetween('orders.order_date', [$dates['start'], $dates['end']])
            ->where('customers.is_member', true)
            ->count();

        $totalOrders = DB::table('orders')
            ->whereBetween('order_date', [$dates['start'], $dates['end']])
            ->count();

        return [
            'new_customers' => $newCustomers,
            'repeat_customers' => $repeatCustomers,
            'member_order_percentage' => $totalOrders > 0 ? round(($memberOrders / $totalOrders) * 100) : 0,
        ];
    }

    private function getPrediction(string $range): array
    {
        $dates = $this->getDateRange($range);
        $days = $dates['start']->diffInDays($dates['end']) + 1;

        $dailyRevenue = Order::withoutGlobalScope(\App\Models\Scopes\BranchScope::class)
            ->where('status', '!=', 'cancelled')
            ->whereBetween('order_date', [$dates['start'], $dates['end']])
            ->selectRaw('DATE(order_date) as date, SUM(grand_total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('revenue')
            ->map(fn ($v) => (float) $v)
            ->toArray();

        if (\count($dailyRevenue) < 2) {
            return ['next_month' => 0, 'trend' => 'stable', 'slope_percentage' => 0];
        }

        $n = \count($dailyRevenue);
        $x = range(1, $n);
        $y = $dailyRevenue;
        $sumX = array_sum($x);
        $sumY = array_sum($y);
        $sumXY = 0;
        $sumX2 = 0;

        for ($i = 0; $i < $n; $i++) {
            $sumXY += $x[$i] * $y[$i];
            $sumX2 += $x[$i] * $x[$i];
        }

        $denominator = $n * $sumX2 - $sumX * $sumX;
        $slope = $denominator != 0 ? ($n * $sumXY - $sumX * $sumY) / $denominator : 0;
        $nextValue = end($y) + $slope * ($days / 7);
        $avgY = $sumY > 0 ? $sumY / $n : 1;

        return [
            'next_month' => max(0, round($nextValue * 4)),
            'trend' => $slope > 0 ? 'up' : ($slope < 0 ? 'down' : 'stable'),
            'slope_percentage' => round(($slope / $avgY) * 100, 1),
        ];
    }

    private function getDateRange(string $range): array
    {
        $end = now()->endOfDay();

        $start = match ($range) {
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->subDays(30)->startOfDay(),
        };

        return ['start' => $start, 'end' => $end];
    }

    private function getPreviousDateRange(string $range): array
    {
        $current = $this->getDateRange($range);
        $days = $current['start']->diffInDays($current['end']);

        $end = clone $current['start'];
        $end->subDay();
        $start = clone $end;
        $start->subDays($days);

        return ['start' => $start, 'end' => $end];
    }

    private function calculateGrowth(mixed $previous, mixed $current): float|int
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round(($current - $previous) / $previous * 100, 1);
    }
}
