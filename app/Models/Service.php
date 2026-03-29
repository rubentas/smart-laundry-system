<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{

  use LogsActivity;

  protected $fillable = [
    'service_code',
    'name',
    'description',
    'unit',
    'base_price',
    'estimated_days',
    'estimated_hours',
    'is_active',
  ];

  protected $casts = [
    'base_price' => 'decimal:2',
    'is_active' => 'boolean',
  ];

  public function branchServices(): HasMany
  {
    return $this->hasMany(BranchService::class);
  }

  public function orderItems(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }
}
