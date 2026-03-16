<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('payments', function (Blueprint $table) {
      $table->id();
      $table->string('payment_number')->unique();
      $table->foreignId('order_id')->constrained();
      $table->foreignId('customer_id')->constrained();
      $table->decimal('amount', 12, 2);
      $table->enum('payment_method', ['cash', 'transfer', 'qris', 'va', 'credit_card'])->nullable();
      $table->enum('payment_status', ['pending', 'paid', 'failed', 'expired', 'refunded'])->default('pending');
      $table->string('midtrans_transaction_id')->nullable();
      $table->string('midtrans_status')->nullable();
      $table->json('midtrans_response')->nullable();
      $table->timestamp('payment_date')->nullable();
      $table->text('notes')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('payments');
  }
};