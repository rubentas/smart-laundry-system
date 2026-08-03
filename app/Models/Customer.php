<?php

namespace App\Models;

use App\Models\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use LogsActivity;

    protected $fillable = [
        'user_id',
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
        'loyalty_points',
        'membership_tier',
        'membership_expiry',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'last_order_date' => 'date',
        'member_since' => 'date',
        'total_spent' => 'decimal:2',
        'is_member' => 'boolean',
        'is_active' => 'boolean',
        'membership_expiry' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function getMembershipTierAttribute($value)
    {
        return $value ?: 'regular';
    }

    public function getNextTierPoints()
    {
        $tiers = [
            'regular' => 100,
            'silver' => 500,
            'gold' => 1000,
            'platinum' => 2000,
        ];

        return $tiers[$this->membership_tier] ?? null;
    }

    public function getTierBenefits()
    {
        $benefits = [
            'regular' => ['discount' => 0, 'points_multiplier' => 1],
            'silver' => ['discount' => 5, 'points_multiplier' => 1.2],
            'gold' => ['discount' => 10, 'points_multiplier' => 1.5],
            'platinum' => ['discount' => 15, 'points_multiplier' => 2],
        ];

        return $benefits[$this->membership_tier];
    }

    public function addPoints($points, $orderId = null, $description = null)
    {
        $this->increment('loyalty_points', $points);

        $this->loyaltyTransactions()->create([
            'order_id' => $orderId,
            'type' => 'earn',
            'points' => $points,
            'description' => $description,
        ]);

        $this->updateMembershipTier();
    }

    public function redeemPoints($points, $rewardId = null, $description = null)
    {
        if ($this->loyalty_points < $points) {
            return false;
        }

        $this->decrement('loyalty_points', $points);

        $this->loyaltyTransactions()->create([
            'reward_id' => $rewardId,
            'type' => 'redeem',
            'points' => $points,
            'description' => $description,
        ]);

        return true;
    }

    public function updateMembershipTier()
    {
        $points = $this->loyalty_points;
        $newTier = 'regular';

        if ($points >= 2000) {
            $newTier = 'platinum';
        } elseif ($points >= 1000) {
            $newTier = 'gold';
        } elseif ($points >= 500) {
            $newTier = 'silver';
        }

        if ($this->membership_tier !== $newTier) {
            $this->update(['membership_tier' => $newTier]);
        }
    }

    public function loyaltyTransactions()
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }
}
