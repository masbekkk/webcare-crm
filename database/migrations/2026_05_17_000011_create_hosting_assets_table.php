<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hosting_assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('provider', 150)->index();
            $table->string('service_name', 150)->nullable();
            $table->string('panel_url')->nullable();
            $table->string('server_ip', 100)->nullable();
            $table->date('start_date')->nullable();
            $table->date('expired_at')->nullable()->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('client_id');
            $table->index('project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hosting_assets');
    }
};
