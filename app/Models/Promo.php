<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Traits\LogsActivity;

class Promo extends Model
{

  use LogsActivity;

  protected $fillable = [
    'code',
    'name',
    'description',
    'type',
    'value',
    'min_purchase',
    'start_date',
    'end_date',
    'max_uses',
    'used_count',
    'is_active',
  ];

  protected $casts = [
    'value' => 'decimal:2',
    'min_purchase' => 'decimal:2',
    'start_date' => 'datetime',
    'end_date' => 'datetime',
    'is_active' => 'boolean',
  ];

  public function services(): BelongsToMany
  {
    return $this->belongsToMany(Service::class, 'promo_services');
  }

  public function scopeActive($query)
  {
    return $query->where('is_active', true)
      ->where('start_date', '<=', now())
      ->where('end_date', '>=', now());
  }
}
