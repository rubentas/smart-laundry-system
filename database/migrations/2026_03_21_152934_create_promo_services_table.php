<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('promo_services', function (Blueprint $table) {
      $table->id();
      $table->foreignId('promo_id')->constrained()->onDelete('cascade');
      $table->foreignId('service_id')->constrained()->onDelete('cascade');
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('promo_services');
  }
};
