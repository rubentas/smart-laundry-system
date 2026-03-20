<?php

namespace App\Services;

use App\Models\BusinessSetting;
use Illuminate\Support\Facades\Cache;

class BusinessSettingService
{
  /**
   * Get all settings by group
   */
  public function getGroup($group)
  {
    return Cache::remember("business_settings_{$group}", 86400, function () use ($group) {
      return BusinessSetting::where('group', $group)
        ->orderBy('sort_order')
        ->get()
        ->mapWithKeys(function ($item) {
          return [$item->key => $this->castValue($item)];
        });
    });
  }

  /**
   * Get single setting
   */
  public function get($key, $default = null)
  {
    $setting = Cache::remember("business_setting_{$key}", 86400, function () use ($key) {
      return BusinessSetting::where('key', $key)->first();
    });

    if (!$setting) {
      return $default;
    }

    return $this->castValue($setting);
  }

  /**
   * Update settings
   */
  public function update(array $data)
  {
    foreach ($data as $key => $value) {
      BusinessSetting::where('key', $key)->update(['value' => $value]);
      Cache::forget("business_setting_{$key}");
    }

    // Clear group cache
    $groups = BusinessSetting::whereIn('key', array_keys($data))
      ->pluck('group')
      ->unique();

    foreach ($groups as $group) {
      Cache::forget("business_settings_{$group}");
    }

    return true;
  }

  /**
   * Cast value berdasarkan type
   */
  private function castValue($setting)
  {
    return match ($setting->type) {
      'boolean' => filter_var($setting->value, FILTER_VALIDATE_BOOLEAN),
      'number' => is_numeric($setting->value) ? (float) $setting->value : null,
      'json' => json_decode($setting->value, true),
      default => $setting->value,
    };
  }
}
