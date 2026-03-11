<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BranchService extends Model
{
  protected $fillable = [
    'branch_id',
    'service_id',
    'price',
    'min_weight',
    'max_weight',
    'is_active',
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'min_weight' => 'decimal:2',
    'max_weight' => 'decimal:2',
    'is_active' => 'boolean',
  ];

  public function branch(): BelongsTo
  {
    return $this->belongsTo(Branch::class);
  }

  public function service(): BelongsTo
  {
    return $this->belongsTo(Service::class);
  }
}