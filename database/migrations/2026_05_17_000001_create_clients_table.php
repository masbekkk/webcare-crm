<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('company_name', 180)->index();
            $table->string('display_name', 180)->nullable();
            $table->string('pic_name', 150)->nullable()->index();
            $table->string('pic_position', 100)->nullable();
            $table->string('pic_email', 150)->nullable();
            $table->string('pic_phone', 30)->nullable();
            $table->string('pic_whatsapp', 30)->nullable();
            $table->string('company_email', 150)->nullable();
            $table->string('company_phone', 30)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('province', 100)->nullable();
            $table->string('status')->default('active')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
