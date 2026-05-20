<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('website_monitors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_link_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name', 150);
            $table->string('url');
            $table->string('method')->default('GET');
            $table->integer('expected_status_code')->default(200);
            $table->integer('timeout_seconds')->default(10);
            $table->integer('check_interval_seconds')->default(60);
            $table->boolean('is_active')->default(true)->index();
            $table->string('current_status')->default('unknown')->index();
            $table->integer('last_status_code')->nullable();
            $table->integer('last_response_time_ms')->nullable();
            $table->timestamp('last_checked_at')->nullable()->index();
            $table->timestamp('last_down_at')->nullable();
            $table->timestamp('last_recovered_at')->nullable();
            $table->integer('consecutive_failures')->default(0);
            $table->integer('consecutive_successes')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('project_id');
            $table->index('project_link_id');
        });

        Schema::create('website_check_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monitor_id')->constrained('website_monitors')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->timestamp('checked_at')->index();
            $table->boolean('is_success')->index();
            $table->string('status')->index();
            $table->integer('status_code')->nullable();
            $table->integer('response_time_ms')->nullable();
            $table->string('error_type', 100)->nullable();
            $table->text('error_message')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index('monitor_id');
            $table->index('project_id');
        });

        Schema::create('website_incidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('monitor_id')->constrained('website_monitors')->cascadeOnDelete();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->timestamp('started_at')->index();
            $table->timestamp('resolved_at')->nullable()->index();
            $table->integer('duration_seconds')->nullable();
            $table->string('status')->default('ongoing')->index();
            $table->string('reason')->nullable();
            $table->text('first_error_message')->nullable();
            $table->text('last_error_message')->nullable();
            $table->timestamps();

            $table->index('monitor_id');
            $table->index('project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('website_incidents');
        Schema::dropIfExists('website_check_logs');
        Schema::dropIfExists('website_monitors');
    }
};
