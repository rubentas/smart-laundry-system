<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
  protected $fillable = [
    'payment_number',
    'order_id',
    'customer_id',
    'amount',
    'payment_method',
    'payment_status',
    'midtrans_transaction_id',
    'midtrans_status',
    'midtrans_response',
    'payment_date',
    'notes',
  ];

  protected $casts = [
    'amount' => 'decimal:2',
    'payment_date' => 'datetime',
    'midtrans_response' => 'array',
  ];

  public function order(): BelongsTo
  {
    return $this->belongsTo(Order::class);
  }

  public function customer(): BelongsTo
  {
    return $this->belongsTo(Customer::class);
  }
}
