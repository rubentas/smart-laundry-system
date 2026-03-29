<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use App\Models\Service;
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
            'range' => $range
        ]);
    }
    
    private function getRevenueData($range)
    {
        $dates = $this->getDateRange($range);
        
        $data = Order::where('status', '!=', 'cancelled')
            ->whereBetween('order_date', [$dates['start'], $dates['end']])
            ->select(
                DB::raw('DATE(order_date) as date'),
                DB::raw('SUM(grand_total) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');
        
        $labels = [];
        $values = [];
        
        $current = clone $dates['start'];
        while ($current <= $dates['end']) {
            $dateKey = $current->format('Y-m-d');
            $labels[] = $current->format($range === 'week' ? 'D' : ($range === 'month' ? 'd M' : 'M Y'));
            $values[] = $data[$dateKey]->total ?? 0;
            $current->modify('+1 day');
        }
        
        return ['labels' => $labels, 'values' => $values];
    }
    
    private function getOrderStats($range)
    {
        $dates = $this->getDateRange($range);
        
        $previousDates = $this->getPreviousDateRange($range);
        
        $current = Order::whereBetween('order_date', [$dates['start'], $dates['end']])
            ->select(
                DB::raw('COUNT(*) as total'),
                DB::raw('AVG(grand_total) as avg_order'),
                DB::raw('SUM(grand_total) as revenue')
            )
            ->first();
            
        $previous = Order::whereBetween('order_date', [$previousDates['start'], $previousDates['end']])
            ->select(
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(grand_total) as revenue')
            )
            ->first();
            
        $statusBreakdown = Order::whereBetween('order_date', [$dates['start'], $dates['end']])
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');
            
        return [
            'total_orders' => $current->total ?? 0,
            'avg_order' => $current->avg_order ?? 0,
            'revenue' => $current->revenue ?? 0,
            'growth' => $this->calculateGrowth($previous->total ?? 0, $current->total ?? 0),
            'revenue_growth' => $this->calculateGrowth($previous->revenue ?? 0, $current->revenue ?? 0),
            'status_breakdown' => $statusBreakdown
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
    
    private function getCustomerStats($range)
    {
        $dates = $this->getDateRange($range);
        
        $newCustomers = Customer::whereBetween('created_at', [$dates['start'], $dates['end']])->count();
        
        $repeatCustomers = DB::table('orders')
            ->whereBetween('order_date', [$dates['start'], $dates['end']])
            ->select('customer_id', DB::raw('COUNT(*) as order_count'))
            ->groupBy('customer_id')
            ->having('order_count', '>', 1)
            ->count();
            
        $memberOrders = Order::whereBetween('order_date', [$dates['start'], $dates['end']])
            ->whereHas('customer', function($q) {
                $q->where('is_member', true);
            })
            ->count();
            
        $totalOrders = Order::whereBetween('order_date', [$dates['start'], $dates['end']])->count();
        
        return [
            'new_customers' => $newCustomers,
            'repeat_customers' => $repeatCustomers,
            'member_order_percentage' => $totalOrders > 0 ? round(($memberOrders / $totalOrders) * 100) : 0
        ];
    }
    
    private function getPrediction($range)
    {
        // Simple linear regression for next period prediction
        $dates = $this->getDateRange($range);
        $days = $dates['start']->diffInDays($dates['end']) + 1;
        
        $dailyRevenue = Order::where('status', '!=', 'cancelled')
            ->whereBetween('order_date', [$dates['start'], $dates['end']])
            ->select(
                DB::raw('DATE(order_date) as date'),
                DB::raw('SUM(grand_total) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
            
        if ($dailyRevenue->count() < 2) {
            return ['next_month' => 0, 'trend' => 'stable'];
        }
        
        // Calculate trend using linear regression
        $x = range(1, $dailyRevenue->count());
        $y = $dailyRevenue->pluck('revenue')->toArray();
        
        $n = count($x);
        $sumX = array_sum($x);
        $sumY = array_sum($y);
        $sumXY = 0;
        $sumX2 = 0;
        
        for ($i = 0; $i < $n; $i++) {
            $sumXY += $x[$i] * $y[$i];
            $sumX2 += $x[$i] * $x[$i];
        }
        
        $slope = ($n * $sumXY - $sumX * $sumY) / ($n * $sumX2 - $sumX * $sumX);
        $nextValue = end($y) + $slope * ($days / 7); // Predict next week
        
        $trend = $slope > 0 ? 'up' : ($slope < 0 ? 'down' : 'stable');
        
        return [
            'next_month' => max(0, round($nextValue * 4)),
            'trend' => $trend,
            'slope_percentage' => round(($slope / (array_sum($y)/$n)) * 100, 1)
        ];
    }
    
    private function getDateRange($range)
    {
        $end = now()->endOfDay();
        
        switch($range) {
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
        if ($previous == 0) return $current > 0 ? 100 : 0;
        return round(($current - $previous) / $previous * 100, 1);
    }
}