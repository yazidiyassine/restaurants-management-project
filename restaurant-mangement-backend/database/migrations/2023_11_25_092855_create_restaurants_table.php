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
        Schema::create('restaurants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->string('name', 100)->unique();
            $table->string('address_line_1', 250);
            $table->string('address_line_2', 250)->nullable();
            $table->string('pincode');
            $table->string('city');
            $table->string('image')->nullable();
            $table->foreignId('state_id')->nullable()->constrained('states')->onDelete('cascade');
            $table->foreignId('country_id')->nullable()->constrained('countries')->onDelete('cascade');
            $table->string('ispromoting');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('restaurants');
    }
};
