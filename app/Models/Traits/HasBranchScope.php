<?php

namespace App\Models\Traits;

use App\Models\Scopes\BranchScope;
use Illuminate\Support\Facades\Auth;

trait HasBranchScope
{
    protected static function bootHasBranchScope()
    {
        static::addGlobalScope(new BranchScope);
    }

    /**
     * Scope for current user's branch (with owner filter support)
     */
    public function scopeForCurrentBranch($query)
    {
        $user = Auth::user();

        if (! $user) {
            return $query;
        }

        // Owner with selected branch filter
        if ($user->hasRole('owner') && session('selected_branch_id')) {
            return $query->where($this->getTable().'.branch_id', session('selected_branch_id'));
        }

        // Non-owner: filter by their branch
        if (! $user->hasRole('owner') && $user->branch_id) {
            return $query->where($this->getTable().'.branch_id', $user->branch_id);
        }

        return $query;
    }

    /**
     * Bypass all branch filters (for export/super admin)
     */
    public function scopeAllBranches($query)
    {
        return $query->withoutGlobalScope(BranchScope::class);
    }
}
