<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;

class LogUserActivity
{
  public function handle(Request $request, Closure $next)
  {
    $response = $next($request);

    if (auth()->check() && $request->isMethod('post', 'put', 'patch', 'delete')) {
      ActivityLog::create([
        'user_id' => auth()->id(),
        'user_name' => auth()->user()->name,
        'user_role' => auth()->user()->roles->first()?->name,
        'action' => strtoupper($request->method()),
        'description' => "User melakukan {$request->method()} pada {$request->path()}",
        'ip_address' => $request->ip(),
        'user_agent' => $request->userAgent(),
      ]);
    }

    return $response;
  }
}
