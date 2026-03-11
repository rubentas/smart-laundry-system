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
    Schema::create('services', function (Blueprint $table) {
      $table->id();
      $table->string('service_code')->unique();
      $table->string('name');
      $table->text('description')->nullable();
      $table->enum('unit', ['kg', 'pcs', 'item'])->default('kg');
      $table->decimal('base_price', 10, 2);
      $table->integer('estimated_days')->default(1);
      $table->integer('estimated_hours')->nullable();
      $table->boolean('is_active')->default(true);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('services');
  }
};
