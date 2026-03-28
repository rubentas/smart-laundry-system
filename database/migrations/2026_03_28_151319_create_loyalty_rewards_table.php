<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('loyalty_rewards', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->text('description')->nullable();
      $table->integer('points_required');
      $table->enum('reward_type', ['discount', 'free_service', 'voucher']);
      $table->decimal('discount_value', 10, 2)->nullable();
      $table->foreignId('service_id')->nullable()->constrained();
      $table->boolean('is_active')->default(true);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('loyalty_rewards');
  }
};