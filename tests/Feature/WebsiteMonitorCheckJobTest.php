<?php

namespace Tests\Feature;

use App\Jobs\CheckWebsiteMonitorJob;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use App\Models\WebsiteIncident;
use App\Models\WebsiteMonitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WebsiteMonitorCheckJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_job_records_successful_website_check(): void
    {
        Http::fake([
            'https://example.test/*' => Http::response('OK', 200),
        ]);

        $monitor = $this->monitor([
            'url' => 'https://example.test/health',
            'expected_status_code' => 200,
            'current_status' => 'unknown',
        ]);

        (new CheckWebsiteMonitorJob($monitor->id))->handle();

        $monitor->refresh();

        $this->assertSame('up', $monitor->current_status);
        $this->assertSame(200, $monitor->last_status_code);
        $this->assertSame(0, $monitor->consecutive_failures);
        $this->assertSame(1, $monitor->consecutive_successes);
        $this->assertDatabaseHas('website_check_logs', [
            'monitor_id' => $monitor->id,
            'project_id' => $monitor->project_id,
            'is_success' => true,
            'status' => 'up',
            'status_code' => 200,
        ]);
    }

    public function test_job_opens_and_resolves_incident(): void
    {
        Http::fake([
            'https://example.test/*' => Http::sequence()
                ->push('Server error', 500)
                ->push('OK', 200),
        ]);

        $monitor = $this->monitor([
            'url' => 'https://example.test/health',
            'expected_status_code' => 200,
            'current_status' => 'unknown',
        ]);

        (new CheckWebsiteMonitorJob($monitor->id))->handle();

        $monitor->refresh();
        $incident = WebsiteIncident::query()->where('monitor_id', $monitor->id)->firstOrFail();

        $this->assertSame('down', $monitor->current_status);
        $this->assertSame(1, $monitor->consecutive_failures);
        $this->assertSame('ongoing', $incident->status);
        $this->assertSame('unexpected_status_code', $incident->reason);
        $this->assertDatabaseHas('website_check_logs', [
            'monitor_id' => $monitor->id,
            'project_id' => $monitor->project_id,
            'is_success' => false,
            'status' => 'down',
            'status_code' => 500,
        ]);

        $monitor->forceFill([
            'last_checked_at' => now()->subMinutes(2),
        ])->save();
        (new CheckWebsiteMonitorJob($monitor->id))->handle();

        $monitor->refresh();
        $incident->refresh();

        $this->assertSame('up', $monitor->current_status);
        $this->assertNotNull($monitor->last_recovered_at);
        $this->assertSame('resolved', $incident->status);
        $this->assertNotNull($incident->resolved_at);
        $this->assertNotNull($incident->duration_seconds);
        $this->assertDatabaseHas('website_check_logs', [
            'monitor_id' => $monitor->id,
            'project_id' => $monitor->project_id,
            'is_success' => true,
            'status' => 'up',
            'status_code' => 200,
        ]);
        $this->assertDatabaseCount('website_check_logs', 2);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function monitor(array $attributes = []): WebsiteMonitor
    {
        $admin = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);
        $project = Project::create([
            'client_id' => $client->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'project_type' => 'Company Profile',
            'created_by' => $admin->id,
        ]);

        return WebsiteMonitor::create([
            'project_id' => $project->id,
            'name' => 'Production website',
            'url' => 'https://example.test',
            'method' => 'GET',
            'expected_status_code' => 200,
            'timeout_seconds' => 10,
            'check_interval_seconds' => 60,
            'is_active' => true,
            ...$attributes,
        ]);
    }
}
