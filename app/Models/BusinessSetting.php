<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessSetting extends Model
{
  protected $fillable = [
    'key',
    'value',
    'type',
    'group',
    'label',
    'description',
    'options',
    'sort_order'
  ];

  protected $casts = [
    'options' => 'array',
    'value' => 'json',
  ];

  /**
   * Get setting value by key
   */
  public static function get($key, $default = null)
  {
    $setting = self::where('key', $key)->first();

    if (!$setting) {
      return $default;
    }

    $value = $setting->value;

    // Cast berdasarkan type
    return match ($setting->type) {
      'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
      'number' => is_numeric($value) ? (float) $value : $default,
      'json' => json_decode($value, true),
      default => $value,
    };
  }

  /**
   * Set setting value
   */
  public static function set($key, $value, $type = 'text', $group = 'general')
  {
    return self::updateOrCreate(
      ['key' => $key],
      [
        'value' => $value,
        'type' => $type,
        'group' => $group,
      ]
    );
  }
}
