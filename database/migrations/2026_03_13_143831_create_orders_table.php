<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('branch_id')->constrained();
            $table->foreignId('customer_id')->constrained();
            $table->foreignId('cashier_id')->constrained('users');
            $table->dateTime('order_date');
            $table->dateTime('pickup_date')->nullable();
            $table->enum('status', [
                'pending',
                'washing',
                'drying',
                'ironing',
                'ready_pickup',
                'completed',
                'cancelled',
            ])->default('pending');
            $table->decimal('total_weight', 8, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2)->default(0);
            $table->text('notes')->nullable();
            $table->boolean('is_paid')->default(false);
            $table->enum('payment_method', ['cash', 'transfer', 'qris', 'va'])->nullable();
            $table->timestamps();

            $table->index('order_number');
            $table->index('status');
            $table->index('order_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
