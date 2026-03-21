<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetUserBranch
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->hasRole('owner')) {
            // Validasi apakah user punya branch_id
            if (! $user->branch_id) {
                abort(403, 'Anda tidak memiliki cabang. Hubungi Owner.');
            }

            // Share branch info ke semua view
            view()->share('currentBranch', $user->branch);

            // Simpan di session untuk kemudahan akses
            session(['current_branch_id' => $user->branch_id]);
            session(['current_branch_name' => $user->branch->name ?? 'Unknown']);
        } elseif ($user && $user->hasRole('owner')) {
            // Owner bisa pilih cabang (akan diimplement di step berikutnya)
            if (session('selected_branch_id')) {
                $branch = \App\Models\Branch::find(session('selected_branch_id'));
                if ($branch) {
                    view()->share('currentBranch', $branch);
                }
            }
        }

        return $next($request);
    }
}
