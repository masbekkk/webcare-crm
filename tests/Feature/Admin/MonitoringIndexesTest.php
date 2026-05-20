<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\Issue;
use App\Models\Project;
use App\Models\ProjectLink;
use App\Models\User;
use App\Models\WebsiteCheckLog;
use App\Models\WebsiteIncident;
use App\Models\WebsiteMonitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MonitoringIndexesTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_issue_list_index(): void
    {
        [$admin, $client, $project] = $this->projectContext();
        $assignee = User::factory()->create(['name' => 'Support Agent']);

        Issue::create([
            'project_id' => $project->id,
            'client_id' => $client->id,
            'title' => 'Homepage form broken',
            'description' => 'Contact form fails on submit.',
            'priority' => 'high',
            'status' => 'open',
            'reported_by' => $admin->id,
            'assigned_to' => $assignee->id,
            'due_date' => '2026-05-20',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.issues.index', [
                'search' => 'Homepage',
                'status' => 'open',
                'priority' => 'high',
                'client_id' => $client->id,
                'project_id' => $project->id,
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/issues/index')
                ->has('issues.data', 1)
                ->where('issues.data.0.title', 'Homepage form broken')
                ->where('filters.status', 'open')
                ->where('filters.priority', 'high'));
    }

    public function test_admin_can_view_website_monitors_index(): void
    {
        [$admin, $client, $project] = $this->projectContext();
        $projectLink = ProjectLink::create([
            'project_id' => $project->id,
            'type' => 'production',
            'label' => 'Production',
            'url' => 'https://example.test',
        ]);

        WebsiteMonitor::create([
            'project_id' => $project->id,
            'project_link_id' => $projectLink->id,
            'name' => 'Production website',
            'url' => 'https://example.test',
            'current_status' => 'up',
            'last_status_code' => 200,
            'last_response_time_ms' => 180,
            'last_checked_at' => '2026-05-18 08:00:00',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.monitors.index', [
                'search' => 'Production',
                'status' => 'up',
                'client_id' => $client->id,
                'project_id' => $project->id,
                'is_active' => true,
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/monitors/index')
                ->has('monitors.data', 1)
                ->where('monitors.data.0.name', 'Production website')
                ->where('monitors.data.0.project_link.label', 'Production')
                ->where('filters.status', 'up')
                ->where('filters.is_active', '1'));
    }

    public function test_admin_can_sort_website_monitors_by_monitor_and_project(): void
    {
        $admin = User::factory()->create();
        $acme = Client::create(['company_name' => 'Acme Studio']);
        $zen = Client::create(['company_name' => 'Zen Works']);
        $alphaProject = Project::create([
            'client_id' => $acme->id,
            'name' => 'Alpha Project',
            'slug' => 'alpha-project',
            'project_type' => 'Company Profile',
            'created_by' => $admin->id,
        ]);
        $zetaProject = Project::create([
            'client_id' => $zen->id,
            'name' => 'Zeta Project',
            'slug' => 'zeta-project',
            'project_type' => 'CRM',
            'created_by' => $admin->id,
        ]);

        WebsiteMonitor::create([
            'project_id' => $zetaProject->id,
            'name' => 'Beta monitor',
            'url' => 'https://beta.test',
        ]);
        WebsiteMonitor::create([
            'project_id' => $alphaProject->id,
            'name' => 'Alpha monitor',
            'url' => 'https://alpha.test',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.monitors.index', [
                'sort' => 'monitor',
                'direction' => 'desc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.sort', 'monitor')
                ->where('filters.direction', 'desc')
                ->where('monitors.data.0.name', 'Beta monitor'));

        $this->actingAs($admin)
            ->get(route('admin.monitors.index', [
                'sort' => 'project',
                'direction' => 'asc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('filters.sort', 'project')
                ->where('filters.direction', 'asc')
                ->where('monitors.data.0.project.name', 'Alpha Project'));
    }

    public function test_admin_can_view_website_check_logs_index(): void
    {
        [$admin, $client, $project] = $this->projectContext();
        $monitor = WebsiteMonitor::create([
            'project_id' => $project->id,
            'name' => 'API health',
            'url' => 'https://example.test/api/health',
            'current_status' => 'down',
        ]);

        WebsiteCheckLog::create([
            'monitor_id' => $monitor->id,
            'project_id' => $project->id,
            'checked_at' => '2026-05-18 08:01:00',
            'is_success' => false,
            'status' => 'down',
            'status_code' => 500,
            'response_time_ms' => 1200,
            'error_type' => 'http_error',
            'error_message' => 'Server error',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.website-check-logs.index', [
                'search' => 'Server',
                'status' => 'down',
                'client_id' => $client->id,
                'project_id' => $project->id,
                'monitor_id' => $monitor->id,
                'is_success' => false,
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/website-check-logs/index')
                ->has('checkLogs.data', 1)
                ->where('checkLogs.data.0.error_message', 'Server error')
                ->where('filters.status', 'down')
                ->where('filters.is_success', '0'));
    }

    public function test_admin_can_view_website_incidents_index(): void
    {
        [$admin, $client, $project] = $this->projectContext();
        $monitor = WebsiteMonitor::create([
            'project_id' => $project->id,
            'name' => 'Storefront',
            'url' => 'https://example.test/store',
            'current_status' => 'down',
        ]);

        WebsiteIncident::create([
            'monitor_id' => $monitor->id,
            'project_id' => $project->id,
            'started_at' => '2026-05-18 07:00:00',
            'status' => 'ongoing',
            'reason' => 'timeout',
            'first_error_message' => 'Connection timeout',
            'last_error_message' => 'Connection timeout',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.website-incidents.index', [
                'search' => 'timeout',
                'status' => 'ongoing',
                'client_id' => $client->id,
                'project_id' => $project->id,
                'monitor_id' => $monitor->id,
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/website-incidents/index')
                ->has('incidents.data', 1)
                ->where('incidents.data.0.reason', 'timeout')
                ->where('filters.status', 'ongoing'));
    }

    public function test_issue_and_monitor_stats_do_not_mix_aggregate_with_row_selects(): void
    {
        $issueSql = Issue::query()
            ->withCount('attachments')
            ->toBase()
            ->cloneWithout(['columns', 'orders', 'limit', 'offset'])
            ->cloneWithoutBindings(['select', 'order'])
            ->selectRaw('COUNT(*) as total_count')
            ->toSql();

        $monitorSql = WebsiteMonitor::query()
            ->withCount(['checkLogs', 'incidents'])
            ->toBase()
            ->cloneWithout(['columns', 'orders', 'limit', 'offset'])
            ->cloneWithoutBindings(['select', 'order'])
            ->selectRaw('COUNT(*) as total_count')
            ->toSql();

        $this->assertStringNotContainsString('select `issues`.*', $issueSql);
        $this->assertStringNotContainsString('issue_attachments', $issueSql);
        $this->assertStringNotContainsString('select `website_monitors`.*', $monitorSql);
        $this->assertStringNotContainsString('website_check_logs', $monitorSql);
        $this->assertStringNotContainsString('website_incidents', $monitorSql);
    }

    /**
     * @return array{0: User, 1: Client, 2: Project}
     */
    private function projectContext(): array
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

        return [$admin, $client, $project];
    }
}
