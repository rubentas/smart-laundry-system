<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('couriers', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('phone');
      $table->string('license_plate')->nullable();
      $table->enum('status', ['available', 'on_duty', 'offline'])->default('available');
      $table->decimal('balance', 10, 2)->default(0);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('couriers');
  }
};