<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('name', 180);
            $table->string('slug', 200)->unique();
            $table->text('description')->nullable();
            $table->string('project_type', 100)->index();
            $table->decimal('contract_value', 14)->default(0);
            $table->string('payment_model')->default('custom')->index();
            $table->string('status')->default('draft')->index();
            $table->date('start_date')->nullable();
            $table->date('target_finish_date')->nullable();
            $table->date('live_date')->nullable();
            $table->text('tech_stack')->nullable();
            $table->text('internal_notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('client_id');
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
