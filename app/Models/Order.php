<?php

namespace App\Models;

use App\Models\Scopes\BranchScope;
use App\Models\Traits\HasBranchScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
  use HasBranchScope;

  protected $fillable = [
    'order_number',
    'branch_id',
    'customer_id',
    'cashier_id',
    'order_date',
    'pickup_date',
    'status',
    'total_weight',
    'subtotal',
    'discount',
    'tax',
    'grand_total',
    'notes',
    'is_paid',
    'payment_method',
    'promo_id',
    'promo_code',
    'promo_discount',
  ];

  protected $casts = [
    'order_date' => 'datetime',
    'pickup_date' => 'datetime',
    'is_paid' => 'boolean',
    'total_weight' => 'decimal:2',
    'subtotal' => 'decimal:2',
    'discount' => 'decimal:2',
    'tax' => 'decimal:2',
    'grand_total' => 'decimal:2',
    'promo_discount' => 'decimal:2',
  ];

  /**
   * The "booted" method of the model.
   */
  protected static function booted(): void
  {
    static::addGlobalScope(new BranchScope);
  }

  public function branch(): BelongsTo
  {
    return $this->belongsTo(Branch::class);
  }

  public function customer(): BelongsTo
  {
    return $this->belongsTo(Customer::class);
  }

  public function cashier(): BelongsTo
  {
    return $this->belongsTo(User::class, 'cashier_id');
  }

  public function items(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }

  public function statusHistories(): HasMany
  {
    return $this->hasMany(OrderStatusHistory::class);
  }

  public function payments(): HasMany
  {
    return $this->hasMany(Payment::class);
  }

  /**
   * Scope to bypass branch scope (for owner)
   */
  public function scopeWithoutBranchScope($query)
  {
    return $query->withoutGlobalScope(BranchScope::class);
  }

  public function promo()
  {
    return $this->belongsTo(Promo::class);
  }
}
