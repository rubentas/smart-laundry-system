<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class BranchScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = Auth::user();

        // Jika user login dan BUKAN owner, filter berdasarkan branch_id
        if ($user && ! $user->hasRole('owner')) {
            // Cek apakah model punya kolom branch_id
            if ($model->getConnection()->getSchemaBuilder()->hasColumn($model->getTable(), 'branch_id')) {
                $builder->where($model->getTable().'.branch_id', $user->branch_id);
            }
        }
    }
}
