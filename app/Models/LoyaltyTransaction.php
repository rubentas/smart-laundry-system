<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoyaltyTransaction extends Model
{
  protected $fillable = [
    'customer_id',
    'order_id',
    'reward_id',
    'type',
    'points',
    'description'
  ];

  public function customer()
  {
    return $this->belongsTo(Customer::class);
  }

  public function order()
  {
    return $this->belongsTo(Order::class);
  }

  public function reward()
  {
    return $this->belongsTo(LoyaltyReward::class);
  }
}
