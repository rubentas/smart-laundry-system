<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\LoyaltyReward;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoyaltyController extends Controller
{
    public function index()
    {
        $rewards = LoyaltyReward::with('service')->latest()->paginate(10);

        return Inertia::render('loyalty/index', ['rewards' => $rewards]);
    }

    public function create()
    {
        $services = \App\Models\Service::all();

        return Inertia::render('loyalty/create', ['services' => $services]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'points_required' => 'required|integer|min:1',
            'reward_type' => 'required|in:discount,free_service,voucher',
            'discount_value' => 'required_if:reward_type,discount|nullable|numeric',
            'service_id' => 'required_if:reward_type,free_service|nullable|exists:services,id',
        ]);

        LoyaltyReward::create($validated);

        return redirect()->route('owner.loyalty.index')->with('success', 'Reward berhasil ditambahkan');
    }

    public function customerPoints(Customer $customer)
    {
        $transactions = $customer->loyaltyTransactions()
            ->with(['order', 'reward'])
            ->latest()
            ->paginate(20);

        return Inertia::render('customers/points', [
            'customer' => $customer,
            'transactions' => $transactions,
        ]);
    }

    public function redeemReward(Request $request, Customer $customer)
    {
        $request->validate(['reward_id' => 'required|exists:loyalty_rewards,id']);

        $reward = LoyaltyReward::find($request->reward_id);

        if ($customer->loyalty_points < $reward->points_required) {
            return back()->with('error', 'Poin tidak mencukupi');
        }

        $customer->redeemPoints($reward->points_required, $reward->id, "Redeem: {$reward->name}");

        return back()->with('success', "Reward {$reward->name} berhasil ditukar!");
    }

    /**
     * Customer Loyalty Page (untuk customer sendiri)
     */
    public function customerLoyalty()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Cari customer berdasarkan user_id
        $customer = Customer::where('user_id', $user->id)->first();

        if (! $customer) {
            $customer = Customer::where('email', $user->email)->first();
        }

        if (! $customer) {
            return redirect()->back()->with('error', 'Data customer tidak ditemukan');
        }

        $rewards = LoyaltyReward::active()->get();
        $transactions = $customer->loyaltyTransactions()
            ->with('reward')
            ->latest()
            ->paginate(10);

        return Inertia::render('customer/loyalty', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'loyalty_points' => $customer->loyalty_points ?? 0,
                'membership_tier' => $customer->membership_tier ?? 'regular',
            ],
            'rewards' => $rewards,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Customer Points History
     */
    public function customerPointsHistory()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $customer = Customer::where('user_id', $user->id)->first();

        if (! $customer) {
            $customer = Customer::where('email', $user->email)->first();
        }

        if (! $customer) {
            return redirect()->back()->with('error', 'Data customer tidak ditemukan');
        }

        $transactions = $customer->loyaltyTransactions()
            ->with(['order', 'reward'])
            ->latest()
            ->paginate(20);

        $stats = [
            'total_earned' => $customer->loyaltyTransactions()->where('type', 'earn')->sum('points'),
            'total_redeemed' => $customer->loyaltyTransactions()->where('type', 'redeem')->sum('points'),
            'current_points' => $customer->loyalty_points ?? 0,
        ];

        return Inertia::render('customer/points-history', [
            'transactions' => $transactions,
            'stats' => $stats,
            'customer' => [
                'name' => $customer->name,
                'membership_tier' => $customer->membership_tier ?? 'regular',
            ],
        ]);
    }

    /**
     * Redeem reward by customer sendiri
     */
    public function customerRedeem(Request $request)
    {
        $request->validate(['reward_id' => 'required|exists:loyalty_rewards,id']);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $customer = Customer::where('user_id', $user->id)->first();

        if (! $customer) {
            $customer = Customer::where('email', $user->email)->first();
        }

        if (! $customer) {
            return back()->with('error', 'Data customer tidak ditemukan');
        }

        $reward = LoyaltyReward::find($request->reward_id);

        if ($customer->loyalty_points < $reward->points_required) {
            return back()->with('error', 'Poin tidak mencukupi');
        }

        $customer->redeemPoints($reward->points_required, $reward->id, "Redeem: {$reward->name}");

        return back()->with('success', "Reward {$reward->name} berhasil ditukar!");
    }

    /**
     * Get available rewards (API)
     */
    public function rewardsAvailable()
    {
        $rewards = LoyaltyReward::with('service')->active()->get();

        return response()->json($rewards);
    }
}
