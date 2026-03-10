<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBranchRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->hasRole('owner');
  }

  public function rules(): array
  {
    return [
      'branch_code' => 'required|string|max:10|unique:branches,branch_code',
      'name' => 'required|string|max:100',
      'address' => 'nullable|string',
      'phone' => 'nullable|string|max:15',
      'email' => 'nullable|email|max:100',
      'city' => 'nullable|string|max:50',
      'latitude' => 'nullable|numeric',
      'longitude' => 'nullable|numeric',
      'open_time' => 'nullable|date_format:H:i',
      'close_time' => 'nullable|date_format:H:i',
      'is_active' => 'boolean',
    ];
  }
}