<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $range = $request->get('range', 'month'); // week, month, year

        $revenueData = $this->getRevenueData($range);
        $orderStats = $this->getOrderStats($range);
        $topServices = $this->getTopServices($range);
        $customerStats = $this->getCustomerStats($range);
        $prediction = $this->getPrediction($range);

        return Inertia::render('analytics/index', [
            'revenueData' => $revenueData,
            'orderStats' => $orderStats,
            'topServices' => $topServices,
            'customerStats' => $customerStats,
            'prediction' => $prediction,
            'range' => $range,
        ]);
    }

    private function getRevenueData(string $range): array
    {
        $dates = $this->getDateRange($range);

        // Group by week/month/year at DB level — no PHP date loop
        $groupFormat = match ($range) {
            'week' => '%Y-%m-%d',
            'month' => '%Y-%m-%d',
            'year' => '%Y-%m',
            default => '%Y-%m-%d',
        };

        $labelFormat = match ($range) {
            'week' => 'D',
            'month' => 'd M',
            'year' => 'M Y',
            default => 'd M',
        };

        $rows = Order::withoutGlobalScope(\App\Models\Scopes\BranchScope::class)
            ->where('status', '!=', 'cancelled')
            ->whereBetween('order_date', [$dates['start'], $dates['end']])
            ->select(
                DB::raw("DATE_FORMAT(order_date, '{$groupFormat}') as period"),
                DB::raw('SUM(grand_total) as total')
            )
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        $labels = $rows->map(fn ($r) => \Carbon\Carbon::parse($r->period)->format($labelFormat))->toArray();
        $values = $rows->pluck('total')->map(fn ($v) => (float) $v)->toArray();

        return ['labels' => $labels, 'values' => $values];
    }

    private function getOrderStats(string $range): array
    {
        $dates = $this->getDateRange($range);
        $previousDates = $this->getPreviousDateRange($range);

        $current = Order::withoutGlobalScope(\App\Models\Scopes\BranchScope::class)
            ->whereBetween('order_date', [$dates['start'], $dates['end']])
            ->selectRaw('COUNT(*) as total, AVG(grand_total) as avg_order, SUM(grand_total) as revenue')
            ->first();

        $previous = Order::withoutGlobalScope(\App\Models\Scopes\BranchScope::class)
            ->whereBetween('order_date', [$previousDates['start'], $previousDates['end']])
            ->selectRaw('COUNT(*) as total, SUM(grand_total) as revenue')
            ->first();

        $statusBreakdown = Order::withoutGlobalScope(\App\Models\Scopes\BranchScope::class)
            ->whereBetween('order_date', [$dates['start'], $dates['end']])
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

    private function getTopServices($range)
    {
        $dates = $this->getDateRange($range);

        return DB::table('order_items')
            ->join('services', 'order_items.service_id', '=', 'services.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereBetween('orders.order_date', [$dates['start'], $dates['end']])
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

        // Use join instead of whereHas to avoid N+1 and timeout
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

        $trend = $slope > 0 ? 'up' : ($slope < 0 ? 'down' : 'stable');
        $avgY = $sumY > 0 ? $sumY / $n : 1;

        return [
            'next_month' => max(0, round($nextValue * 4)),
            'trend' => $trend,
            'slope_percentage' => round(($slope / $avgY) * 100, 1),
        ];
    }

    private function getDateRange($range)
    {
        $end = now()->endOfDay();

        switch ($range) {
            case 'week':
                $start = now()->startOfWeek();
                break;
            case 'month':
                $start = now()->startOfMonth();
                break;
            case 'year':
                $start = now()->startOfYear();
                break;
            default:
                $start = now()->subDays(30)->startOfDay();
        }

        return ['start' => $start, 'end' => $end];
    }

    private function getPreviousDateRange($range)
    {
        $current = $this->getDateRange($range);
        $days = $current['start']->diffInDays($current['end']);

        $end = clone $current['start'];
        $end->subDay();
        $start = clone $end;
        $start->subDays($days);

        return ['start' => $start, 'end' => $end];
    }

    private function calculateGrowth($previous, $current)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round(($current - $previous) / $previous * 100, 1);
    }
}
