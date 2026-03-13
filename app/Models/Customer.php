<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
  protected $fillable = [
    'customer_code',
    'name',
    'phone',
    'email',
    'address',
    'birth_date',
    'gender',
    'total_orders',
    'total_spent',
    'last_order_date',
    'is_member',
    'member_since',
    'notes',
    'is_active',
  ];

  protected $casts = [
    'birth_date' => 'date',
    'last_order_date' => 'date',
    'member_since' => 'date',
    'total_spent' => 'decimal:2',
    'is_member' => 'boolean',
    'is_active' => 'boolean',
  ];

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }

  public function payments(): HasMany
  {
    return $this->hasMany(Payment::class);
  }
}
