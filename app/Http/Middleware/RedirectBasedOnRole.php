<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RedirectBasedOnRole
{
  public function handle(Request $request, Closure $next)
  {
    if ($request->session()->has('login_role')) {
      $role = $request->session()->pull('login_role');

      if ($role === 'owner') {
        return redirect('/owner/dashboard');
      } elseif ($role === 'cashier') {
        return redirect('/cashier/dashboard');
      } elseif ($role === 'branch_admin') {
        return redirect('/admin/dashboard');
      } elseif ($role === 'customer') {
        return redirect('/customer/dashboard');
      }
    }

    return $next($request);
  }
}