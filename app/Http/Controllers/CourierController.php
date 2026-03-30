<?php

namespace App\Http\Controllers;

use App\Models\Courier;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourierController extends Controller
{
  public function index()
  {
    $couriers = Courier::latest()->paginate(10);
    return Inertia::render('couriers/index', ['couriers' => $couriers]);
  }

  public function create()
  {
    return Inertia::render('couriers/create');
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required',
      'phone' => 'required',
      'license_plate' => 'nullable',
    ]);

    Courier::create($validated);

    return redirect()->route('owner.couriers.index')->with('success', 'Kurir berhasil ditambahkan');
  }

  public function updateStatus(Request $request, Courier $courier)
  {
    $request->validate(['status' => 'required|in:available,on_duty,offline']);
    $courier->update(['status' => $request->status]);

    return back()->with('success', 'Status kurir diperbarui');
  }

  public function assignOrder(Request $request, Order $order)
  {
    $request->validate(['courier_id' => 'required|exists:couriers,id']);

    $order->update([
      'courier_id' => $request->courier_id,
      'delivery_status' => 'waiting_pickup'
    ]);

    return back()->with('success', 'Kurir berhasil ditugaskan');
  }

  public function updateDeliveryStatus(Request $request, Order $order)
  {
    $request->validate(['status' => 'required|in:picked_up,on_delivery,delivered']);

    $updates = ['delivery_status' => $request->status];

    if ($request->status === 'picked_up') {
      $updates['pickup_completed_at'] = now();
    } elseif ($request->status === 'delivered') {
      $updates['delivery_completed_at'] = now();
    }

    $order->update($updates);

    return back()->with('success', 'Status pengiriman diperbarui');
  }

  public function adminIndex(Request $request)
  {
    $branchId = auth()->user()->branch_id;

    $query = Courier::withCount('orders');

    $couriers = $query->latest()->paginate(10);

    $stats = [
      'total' => Courier::count(),
      'available' => Courier::where('status', 'available')->count(),
      'on_duty' => Courier::where('status', 'on_duty')->count(),
      'offline' => Courier::where('status', 'offline')->count(),
    ];

    return Inertia::render('admin/couriers/index', [
      'couriers' => $couriers,
      'stats' => $stats,
    ]);
  }
}
