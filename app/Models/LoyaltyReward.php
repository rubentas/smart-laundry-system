<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoyaltyReward extends Model
{
  protected $fillable = [
    'name',
    'description',
    'points_required',
    'reward_type',
    'discount_value',
    'service_id',
    'is_active'
  ];

  protected $casts = [
    'is_active' => 'boolean',
    'discount_value' => 'decimal:2',
  ];

  public function service()
  {
    return $this->belongsTo(Service::class);
  }

  public function scopeActive($query)
  {
    return $query->where('is_active', true);
  }
}
