<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('branch_services', function (Blueprint $table) {
      $table->id();
      $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
      $table->foreignId('service_id')->constrained()->cascadeOnDelete();
      $table->decimal('price', 10, 2);
      $table->decimal('min_weight', 8, 2)->nullable();
      $table->decimal('max_weight', 8, 2)->nullable();
      $table->boolean('is_active')->default(true);
      $table->timestamps();

      $table->unique(['branch_id', 'service_id']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('branch_services');
  }
};
