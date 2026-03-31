<?php

namespace App\Http\Middleware;

use App\Models\Branch;
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

    if (! $user) {
      return $next($request);
    }

    // Owner: dapat memilih branch dari session
    if ($user->hasRole('owner')) {
      $this->handleOwnerBranch();

      return $next($request);
    }

    // Customer: tidak perlu branch
    if ($user->hasRole('customer')) {
      return $next($request);
    }

    // Admin/Staff: wajib memiliki branch
    if (! $user->branch_id) {
      abort(403, 'Anda tidak memiliki cabang. Hubungi Owner.');
    }

    $this->setUserBranch($user);

    return $next($request);
  }

  /**
   * Handle branch selection for owner role.
   */
  protected function handleOwnerBranch(): void
  {
    $selectedBranchId = session('selected_branch_id');

    if ($selectedBranchId) {
      $branch = Branch::find($selectedBranchId);

      if ($branch) {
        view()->share('currentBranch', $branch);
        session(['current_branch_id' => $branch->id]);
        session(['current_branch_name' => $branch->name]);
      }
    }
  }

  /**
   * Set branch information for user with branch.
   */
  protected function setUserBranch($user): void
  {
    $branch = $user->branch;

    if ($branch) {
      view()->share('currentBranch', $branch);
      session(['current_branch_id' => $branch->id]);
      session(['current_branch_name' => $branch->name]);
    }
  }
}
