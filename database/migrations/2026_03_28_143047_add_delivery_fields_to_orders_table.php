<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::table('orders', function (Blueprint $table) {
      $table->boolean('need_delivery')->default(false);
      $table->enum('delivery_type', ['pickup', 'delivery'])->nullable();
      $table->text('pickup_address')->nullable();
      $table->text('delivery_address')->nullable();
      $table->dateTime('pickup_scheduled_at')->nullable();
      $table->dateTime('delivery_scheduled_at')->nullable();
      $table->dateTime('pickup_completed_at')->nullable();
      $table->dateTime('delivery_completed_at')->nullable();
      $table->foreignId('courier_id')->nullable()->constrained();
      $table->enum('delivery_status', ['pending', 'waiting_pickup', 'picked_up', 'on_delivery', 'delivered'])->default('pending');
      $table->decimal('delivery_fee', 10, 2)->default(0);
      $table->text('delivery_notes')->nullable();
    });
  }

  public function down(): void
  {
    Schema::table('orders', function (Blueprint $table) {
      $table->dropForeign(['courier_id']);
      $table->dropColumn([
        'need_delivery',
        'delivery_type',
        'pickup_address',
        'delivery_address',
        'pickup_scheduled_at',
        'delivery_scheduled_at',
        'pickup_completed_at',
        'delivery_completed_at',
        'courier_id',
        'delivery_status',
        'delivery_fee',
        'delivery_notes'
      ]);
    });
  }
};
