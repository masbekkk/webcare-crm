<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\DomainAsset;
use App\Models\HostingAsset;
use App\Models\Issue;
use App\Models\MaintenanceLog;
use App\Models\Project;
use App\Models\ProjectPaymentTimeline;
use App\Models\User;
use App\Models\WebsiteIncident;
use App\Models\WebsiteMonitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
    }

    public function test_dashboard_loads_database_backed_operational_summary(): void
    {
        $user = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);
        $project = Project::create([
            'client_id' => $client->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'project_type' => 'Company Profile',
            'contract_value' => 12000000,
            'status' => 'in_progress',
            'target_finish_date' => '2026-05-30',
            'created_by' => $user->id,
        ]);

        Issue::create([
            'project_id' => $project->id,
            'client_id' => $client->id,
            'title' => 'Homepage form broken',
            'description' => 'Contact form fails.',
            'priority' => 'high',
            'status' => 'open',
            'reported_by' => $user->id,
        ]);

        WebsiteMonitor::create([
            'project_id' => $project->id,
            'name' => 'Production website',
            'url' => 'https://example.test',
            'current_status' => 'down',
            'last_status_code' => 500,
            'last_response_time_ms' => 1200,
            'last_checked_at' => '2026-05-18 08:00:00',
        ]);

        WebsiteIncident::create([
            'monitor_id' => WebsiteMonitor::first()->id,
            'project_id' => $project->id,
            'started_at' => '2026-05-18 07:00:00',
            'status' => 'ongoing',
            'reason' => 'timeout',
        ]);

        ProjectPaymentTimeline::create([
            'project_id' => $project->id,
            'client_id' => $client->id,
            'type' => 'final_payment',
            'title' => 'Final payment',
            'planned_amount' => 5000000,
            'paid_amount' => 1000000,
            'remaining_amount' => 4000000,
            'due_date' => '2026-05-20',
            'status' => 'waiting',
            'created_by' => $user->id,
        ]);

        DomainAsset::create([
            'client_id' => $client->id,
            'project_id' => $project->id,
            'domain_name' => 'example.test',
            'registrar' => 'NameSilo',
            'expired_at' => '2026-05-25',
        ]);

        HostingAsset::create([
            'client_id' => $client->id,
            'project_id' => $project->id,
            'provider' => 'Cloud Host',
            'service_name' => 'VPS Basic',
            'expired_at' => '2026-05-26',
        ]);

        MaintenanceLog::create([
            'project_id' => $project->id,
            'title' => 'Patch PHP',
            'description' => 'Security patch.',
            'status' => 'planned',
            'scheduled_at' => '2026-05-21 09:00:00',
            'handled_by' => $user->id,
        ]);

        $this->actingAs($user)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('summary.clients', 1)
                ->where('summary.active_projects', 1)
                ->where('summary.open_issues', 1)
                ->where('summary.monitors_down', 1)
                ->where('finance.remaining_amount', '4000000.00')
                ->where('monitoring.ongoing_incidents', 1)
                ->has('recentIssues', 1)
                ->where('recentIssues.0.title', 'Homepage form broken')
                ->has('upcomingPayments', 1)
                ->where('upcomingPayments.0.title', 'Final payment')
                ->has('expiringAssets', 2)
                ->has('maintenanceSchedule', 1));
    }
}
