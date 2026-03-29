<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogUserActivity
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if (Auth::check() && in_array(strtolower($request->method()), ['post', 'put', 'patch', 'delete'])) {
            $user = Auth::user();
            ActivityLog::create([
                'user_id' => Auth::id(),
                'user_name' => $user->name,
                'user_role' => $user->roles->first()?->name,
                'action' => strtoupper($request->method()),
                'description' => "User melakukan {$request->method()} pada {$request->path()}",
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
        }

        return $response;
    }
}
