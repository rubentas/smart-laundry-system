<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Courier extends Model
{
  protected $fillable = [
    'name',
    'phone',
    'license_plate',
    'status',
    'balance',
    'is_active'
  ];

  protected $casts = [
    'balance' => 'decimal:2',
    'is_active' => 'boolean',
  ];

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }

  public function scopeAvailable($query)
  {
    return $query->where('status', 'available')->where('is_active', true);
  }
}
