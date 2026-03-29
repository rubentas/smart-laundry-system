<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
  public function index(Request $request)
  {
    $logs = ActivityLog::with('user')
      ->filter($request->only(['user', 'action', 'date']))
      ->latest()
      ->paginate(20);

    $actions = ActivityLog::distinct('action')->pluck('action');

    return Inertia::render('activity-logs/index', [
      'logs' => $logs,
      'actions' => $actions,
      'filters' => $request->only(['user', 'action', 'date'])
    ]);
  }

  public function show(ActivityLog $log)
  {
    return Inertia::render('activity-logs/show', ['log' => $log]);
  }

  public function export(Request $request)
  {
    $logs = ActivityLog::filter($request->only(['user', 'action', 'date']))
      ->latest()
      ->get();

    // Export logic here (CSV/Excel)
    return response()->json($logs);
  }
}
