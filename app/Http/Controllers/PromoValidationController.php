<?php

namespace App\Http\Controllers;

use App\Models\Promo;
use Illuminate\Http\Request;

class PromoValidationController extends Controller
{
  public function validatePromo(Request $request)
  {
    $request->validate([
      'promo_code' => 'required|string',
      'subtotal' => 'nullable|numeric|min:0'
    ]);

    $promo = Promo::where('code', $request->promo_code)
      ->active()
      ->first();

    if (!$promo) {
      return response()->json([
        'error' => 'Promo tidak aktif atau sudah kadaluarsa'
      ], 422);
    }

    if ($promo->max_uses && $promo->used_count >= $promo->max_uses) {
      return response()->json([
        'error' => 'Kuota promo sudah habis'
      ], 422);
    }

    $subtotal = $request->subtotal ?? 0;
    if ($subtotal < $promo->min_purchase) {
      return response()->json([
        'error' => 'Minimal belanja Rp ' . number_format($promo->min_purchase, 0, ',', '.')
      ], 422);
    }

    // Hitung diskon
    $discount = 0;
    if ($promo->type === 'percentage') {
      $discount = $subtotal * ($promo->value / 100);
    } else {
      $discount = $promo->value;
    }

    $discount = min($discount, $subtotal);

    return response()->json([
      'success' => true,
      'code' => $promo->code,
      'discount' => $discount,
      'type' => $promo->type,
      'value' => $promo->value,
      'name' => $promo->name
    ]);
  }
}
