<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
  protected $fillable = [
    'user_id',
    'user_name',
    'user_role',
    'action',
    'model_type',
    'model_id',
    'description',
    'old_data',
    'new_data',
    'ip_address',
    'user_agent'
  ];

  protected $casts = [
    'old_data' => 'array',
    'new_data' => 'array',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function scopeFilter($query, $filters)
  {
    if ($filters['user'] ?? false) {
      $query->where('user_name', 'like', '%' . $filters['user'] . '%');
    }

    if ($filters['action'] ?? false) {
      $query->where('action', $filters['action']);
    }

    if ($filters['date'] ?? false) {
      $query->whereDate('created_at', $filters['date']);
    }

    return $query;
  }
}
