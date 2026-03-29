<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{

  use LogsActivity;

  protected $fillable = [
    'branch_code',
    'name',
    'address',
    'phone',
    'email',
    'city',
    'latitude',
    'longitude',
    'open_time',
    'close_time',
    'is_active',
  ];

  protected $casts = [
    'is_active' => 'boolean',
    'latitude' => 'decimal:8',
    'longitude' => 'decimal:8',
    'open_time' => 'datetime:H:i',
    'close_time' => 'datetime:H:i',
  ];

  public function users(): HasMany
  {
    return $this->hasMany(User::class);
  }

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }
}
