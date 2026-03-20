<?php

namespace App\Http\Controllers;

use App\Services\BusinessSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessSettingController extends Controller
{
  protected $settingService;

  public function __construct(BusinessSettingService $settingService)
  {
    $this->settingService = $settingService;
  }

  public function index()
  {
    return Inertia::render('business/settings/index', [
      'settings' => [
        'general' => $this->settingService->getGroup('general'),
        'tax' => $this->settingService->getGroup('tax'),
        'notification' => $this->settingService->getGroup('notification'),
        'payment' => $this->settingService->getGroup('payment'),
      ]
    ]);
  }

  public function update(Request $request)
  {
    $validated = $request->validate([
      'settings' => 'required|array',
    ]);

    $this->settingService->update($validated['settings']);

    return back()->with('success', 'Pengaturan berhasil disimpan.');
  }
}
