<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::table('customers', function (Blueprint $table) {
      $table->integer('loyalty_points')->default(0);
      $table->enum('membership_tier', ['regular', 'silver', 'gold', 'platinum'])->default('regular');
      $table->date('membership_expiry')->nullable();
    });
  }

  public function down(): void
  {
    Schema::table('customers', function (Blueprint $table) {
      $table->dropColumn(['loyalty_points', 'membership_tier', 'membership_expiry']);
    });
  }
};