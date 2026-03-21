<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Service;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $whatsApp;

    public function __construct(WhatsAppService $whatsApp)
    {
        $this->whatsApp = $whatsApp;
    }

    public function index(Request $request)
    {
        $query = Order::with(['customer', 'branch', 'cashier']);

        $user = auth()->user();

        // Branch filtering based on role
        if ($user->hasRole('owner')) {
            // Owner: filter by selected branch if any
            if (session('selected_branch_id')) {
                $query->where('branch_id', session('selected_branch_id'));
            }
        } else {
            // Non-owner: filter by their branch
            if ($user->branch_id) {
                $query->where('branch_id', $user->branch_id);
            }
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn ($q) => $q->where('name', 'like', "%{$search}%"));
            });
        }

        // Filter status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter date
        if ($request->filled('date')) {
            $query->whereDate('order_date', $request->date);
        }

        $orders = $query->latest()->paginate(10);

        return Inertia::render('orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'date']),
        ]);
    }

    public function create()
    {
        $user = auth()->user();

        // Get services based on branch
        if ($user->hasRole('owner') && session('selected_branch_id')) {
            $branchId = session('selected_branch_id');
            $services = Service::whereHas('branchServices', function ($q) use ($branchId) {
                $q->where('branch_id', $branchId)->where('is_active', true);
            })->get(['id', 'name', 'service_code', 'base_price', 'unit', 'estimated_days']);
        } elseif (! $user->hasRole('owner') && $user->branch_id) {
            $services = Service::whereHas('branchServices', function ($q) use ($user) {
                $q->where('branch_id', $user->branch_id)->where('is_active', true);
            })->get(['id', 'name', 'service_code', 'base_price', 'unit', 'estimated_days']);
        } else {
            $services = Service::where('is_active', true)->get(['id', 'name', 'service_code', 'base_price', 'unit', 'estimated_days']);
        }

        $customers = Customer::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'phone', 'customer_code']);

        return Inertia::render('orders/create', [
            'customers' => $customers,
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.service_id' => 'required|exists:services,id',
            'items.*.quantity' => 'required|numeric|min:0.1',
            'items.*.notes' => 'nullable|string',
            'notes' => 'nullable|string',
            'pickup_date' => 'nullable|date',
        ]);

        try {
            DB::beginTransaction();

            $user = auth()->user();

            // Set branch_id based on role
            if ($user->hasRole('owner')) {
                $branchId = session('selected_branch_id');
                if (! $branchId) {
                    return back()->with('error', 'Silakan pilih cabang terlebih dahulu');
                }
            } else {
                $branchId = $user->branch_id;
                if (! $branchId) {
                    return back()->with('error', 'Anda tidak memiliki cabang');
                }
            }

            $date = now();
            $lastOrder = Order::whereDate('created_at', $date)->count();
            $orderNumber = 'ORD-'.$date->format('Ymd').'-'.str_pad($lastOrder + 1, 4, '0', STR_PAD_LEFT);

            $totalWeight = 0;
            $subtotal = 0;
            $items = [];

            foreach ($validated['items'] as $item) {
                $service = Service::find($item['service_id']);
                $itemSubtotal = $service->base_price * $item['quantity'];

                $items[] = [
                    'service_id' => $service->id,
                    'service_name' => $service->name,
                    'quantity' => $item['quantity'],
                    'unit' => $service->unit,
                    'price_per_unit' => $service->base_price,
                    'subtotal' => $itemSubtotal,
                    'notes' => $item['notes'] ?? null,
                ];

                if ($service->unit === 'kg') {
                    $totalWeight += $item['quantity'];
                }
                $subtotal += $itemSubtotal;
            }

            // Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'branch_id' => $branchId,
                'customer_id' => $validated['customer_id'],
                'cashier_id' => auth()->id(),
                'order_date' => now(),
                'pickup_date' => $validated['pickup_date'],
                'status' => 'pending',
                'total_weight' => $totalWeight,
                'subtotal' => $subtotal,
                'discount' => 0,
                'tax' => 0,
                'grand_total' => $subtotal,
                'notes' => $validated['notes'] ?? null,
                'is_paid' => false,
            ]);

            // Create order items
            foreach ($items as $item) {
                $order->items()->create($item);
            }

            // Create status history
            $order->statusHistories()->create([
                'status_from' => '',
                'status_to' => 'pending',
                'changed_by' => auth()->id(),
                'notes' => 'Order created',
            ]);

            $customer = Customer::find($validated['customer_id']);
            $customer->increment('total_orders');
            $customer->increment('total_spent', $subtotal);
            $customer->update(['last_order_date' => now()]);

            DB::commit();

            return redirect()->route('owner.orders.show', $order->id)
                ->with('success', 'Order berhasil dibuat.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Gagal membuat order: '.$e->getMessage());
        }
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'branch', 'cashier', 'items.service', 'statusHistories.user']);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }

    public function print(Order $order)
    {
        $order->load(['customer', 'branch', 'cashier', 'items']);

        return Inertia::render('orders/print', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,washing,drying,ironing,ready_pickup,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $order->status;

        $order->update([
            'status' => $request->status,
        ]);

        $order->statusHistories()->create([
            'status_from' => $oldStatus,
            'status_to' => $request->status,
            'changed_by' => auth()->id(),
            'notes' => $request->notes,
        ]);

        // Send WhatsApp notification
        if ($order->customer->phone) {
            $this->whatsApp->sendOrderStatusUpdate($order, $request->status);
        }

        return back()->with('success', 'Status order berhasil diupdate.');
    }

    public function sendNotification(Order $order)
    {
        if (! $order->customer->phone) {
            return back()->with('error', 'Nomor telepon customer tidak tersedia');
        }

        $sent = $this->whatsApp->sendOrderStatusUpdate($order, $order->status);

        if ($sent) {
            return back()->with('success', 'Notifikasi berhasil dikirim');
        }

        return back()->with('error', 'Gagal mengirim notifikasi');
    }
}
