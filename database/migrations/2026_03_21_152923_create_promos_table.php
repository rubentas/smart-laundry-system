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
    Schema::create('promos', function (Blueprint $table) {
      $table->id();
      $table->string('code')->unique();
      $table->string('name');
      $table->text('description')->nullable();
      $table->enum('type', ['percentage', 'fixed']);
      $table->decimal('value', 10, 2);
      $table->decimal('min_purchase', 10, 2)->default(0);
      $table->dateTime('start_date');
      $table->dateTime('end_date');
      $table->integer('max_uses')->nullable();
      $table->integer('used_count')->default(0);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
