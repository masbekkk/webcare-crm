<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_payment_timelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('type')->index();
            $table->string('title', 180);
            $table->text('description')->nullable();
            $table->integer('sequence_order')->default(1);
            $table->decimal('percentage', 5)->nullable();
            $table->decimal('planned_amount', 14)->default(0);
            $table->decimal('paid_amount', 14)->default(0);
            $table->decimal('remaining_amount', 14)->default(0);
            $table->date('due_date')->nullable()->index();
            $table->timestamp('paid_at')->nullable()->index();
            $table->date('billing_period_start')->nullable();
            $table->date('billing_period_end')->nullable();
            $table->string('status')->default('planned')->index();
            $table->string('payment_method')->nullable();
            $table->string('reference_number', 150)->nullable();
            $table->string('proof_file')->nullable();
            $table->integer('reminder_days_before')->nullable();
            $table->boolean('is_additional_charge')->default(false)->index();
            $table->text('admin_notes')->nullable();
            $table->text('client_notes')->nullable();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('project_id');
            $table->index('client_id');
            $table->index('created_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_payment_timelines');
    }
};
