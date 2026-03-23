<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromoController extends Controller
{
  public function index()
  {
    $promos = Promo::with('services')->latest()->paginate(10);
    return Inertia::render('promos/index', ['promos' => $promos]);
  }

  public function create()
  {
    $services = Service::all();
    return Inertia::render('promos/create', ['services' => $services]);
  }

  public function store(Request $request)
  {
    $validated = $request->validate([
      'code' => 'required|unique:promos',
      'name' => 'required',
      'type' => 'required|in:percentage,fixed',
      'value' => 'required|numeric|min:0',
      'min_purchase' => 'nullable|numeric|min:0',
      'start_date' => 'required|date',
      'end_date' => 'required|date|after:start_date',
      'services' => 'array',
    ]);

    $promo = Promo::create($validated);

    if (!empty($validated['services'])) {
      $promo->services()->sync($validated['services']);
    }

    return redirect()->route('owner.promos.index')->with('success', 'Promo berhasil dibuat');
  }
}
