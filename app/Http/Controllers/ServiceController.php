<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use Inertia\Inertia;

class ServiceController extends Controller
{
  public function index()
  {
    $services = Service::latest()->paginate(10);

    return Inertia::render('services/index', [
      'services' => $services
    ]);
  }

  public function create()
  {
    return Inertia::render('services/create');
  }

  public function store(StoreServiceRequest $request)
  {
    Service::create($request->validated());

    return redirect()->route('services.index')
      ->with('success', 'Layanan berhasil ditambahkan.');
  }

  public function edit(Service $service)
  {
    return Inertia::render('services/edit', [
      'service' => $service
    ]);
  }

  public function update(UpdateServiceRequest $request, Service $service)
  {
    $service->update($request->validated());

    return redirect()->route('services.index')
      ->with('success', 'Layanan berhasil diupdate.');
  }

  public function destroy(Service $service)
  {
    $service->delete();

    return redirect()->route('services.index')
      ->with('success', 'Layanan berhasil dihapus.');
  }
}
