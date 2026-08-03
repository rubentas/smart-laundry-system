<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetUserBranch
{
  public function handle(Request $request, Closure $next): Response
  {
    $user = $request->user();

    if (!$user) {
      return $next($request);
    }

    // Customer skip branch check
    if ($user->hasRole('customer')) {
      return $next($request);
    }

    // Owner: optional branch filter
    if ($user->hasRole('owner')) {
      if (session('selected_branch_id')) {
        $branch = \App\Models\Branch::find(session('selected_branch_id'));
        if ($branch) {
          view()->share('currentBranch', $branch);
        }
      }
      return $next($request);
    }

    // Admin & Kasir: wajib branch
    if (!$user->branch_id) {
      abort(403, 'Anda tidak memiliki cabang. Hubungi Owner.');
    }

    view()->share('currentBranch', $user->branch);
    session(['current_branch_id' => $user->branch_id]);
    session(['current_branch_name' => $user->branch->name ?? 'Unknown']);

    return $next($request);
  }
}
