<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('domain_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('domain_name', 180)->index();
            $table->string('registrar', 150)->nullable();
            $table->date('registered_at')->nullable();
            $table->date('expired_at')->nullable()->index();
            $table->boolean('auto_renew')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('client_id');
            $table->index('project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('domain_assets');
    }
};
