<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('customer_code', 'like', "%{$search}%");
            });
        }

        // Filter status
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'member') {
                $query->where('is_member', true);
            }
        }

        $customers = $query->latest()->paginate(10);

        return Inertia::render('customers/index', [
            'customers' => $customers,
        ]);
    }

    public function create()
    {
        return Inertia::render('customers/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_code' => 'required|string|max:20|unique:customers,customer_code',
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:100|unique:customers,email',
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
            'is_member' => 'boolean',
        ]);

        Customer::create($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    public function show(Customer $customer)
    {
        return Inertia::render('customers/show', [
            'customer' => $customer->load(['orders' => function ($q) {
                $q->latest()->limit(10);
            }]),
        ]);
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('customers/edit', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'customer_code' => 'required|string|max:20|unique:customers,customer_code,'.$customer->id,
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:100|unique:customers,email,'.$customer->id,
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
            'is_member' => 'boolean',
        ]);

        $customer->update($validated);

        return redirect()->route('customers.index')
            ->with('success', 'Pelanggan berhasil diupdate.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')
            ->with('success', 'Pelanggan berhasil dihapus.');
    }

    public function profile()
    {
        $customer = auth()->user()->customer()
            ->with(['orders' => function ($query) {
                $query->latest()->limit(5);
            }])
            ->first();

        abort_if(! $customer, 404, 'Customer profile not found');

        $stats = [
            'total_orders' => $customer->total_orders ?? 0,
            'total_spent' => $customer->total_spent ?? 0,
            'avg_order' => $customer->total_orders > 0
              ? round($customer->total_spent / $customer->total_orders, 2)
              : 0,
            'points_earned' => $customer->loyaltyTransactions()
                ->where('type', 'earn')
                ->sum('points') ?? 0,
            'points_redeemed' => $customer->loyaltyTransactions()
                ->where('type', 'redeem')
                ->sum('points') ?? 0,
        ];

        return Inertia::render('customer/profile', [
            'customer' => $customer,
            'stats' => $stats,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $customer = auth()->user()->customer;

        abort_if(! $customer, 404, 'Customer profile not found');

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:100|unique:customers,email,'.$customer->id,
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
        ]);

        $customer->update($validated);

        return redirect()->route('customer.profile')
            ->with('success', 'Profile berhasil diupdate.');
    }
}
