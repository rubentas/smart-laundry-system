<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::table('orders', function (Blueprint $table) {
      $table->foreignId('promo_id')->nullable()->constrained();
      $table->string('promo_code')->nullable();
    });
  }

  public function down(): void
  {
    Schema::table('orders', function (Blueprint $table) {
      $table->dropForeign(['promo_id']);
      $table->dropColumn(['promo_id', 'promo_code']);
    });
  }
};
