<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->hasRole('owner');
  }

  public function rules(): array
  {
    return [
      'service_code' => 'required|string|max:20|unique:services,service_code',
      'name' => 'required|string|max:100',
      'description' => 'nullable|string',
      'unit' => 'required|in:kg,pcs,item',
      'base_price' => 'required|numeric|min:0',
      'estimated_days' => 'required|integer|min:0',
      'estimated_hours' => 'nullable|integer|min:0',
      'is_active' => 'boolean',
    ];
  }
}