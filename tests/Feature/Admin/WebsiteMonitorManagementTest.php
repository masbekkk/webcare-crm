<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectLink;
use App\Models\User;
use App\Models\WebsiteMonitor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WebsiteMonitorManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_monitor_create_form(): void
    {
        [$admin] = $this->projectContext();

        $this->actingAs($admin)
            ->get(route('admin.monitors.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/monitors/create')
                ->has('clients', 1)
                ->has('projects', 1)
                ->has('projectLinks', 1)
                ->where('monitor', null));
    }

    public function test_admin_can_create_website_monitor(): void
    {
        [$admin, $project, $projectLink] = $this->projectContext();

        $response = $this->actingAs($admin)->post(route('admin.monitors.store'), [
            'project_id' => $project->id,
            'project_link_id' => $projectLink->id,
            'name' => 'Production website',
            'url' => 'https://example.test',
            'method' => 'GET',
            'expected_status_code' => 200,
            'timeout_seconds' => 10,
            'check_interval_seconds' => 60,
            'is_active' => true,
            'current_status' => 'unknown',
            'last_status_code' => null,
            'last_response_time_ms' => null,
            'last_checked_at' => null,
            'last_down_at' => null,
            'last_recovered_at' => null,
            'consecutive_failures' => 0,
            'consecutive_successes' => 0,
        ]);

        $monitor = WebsiteMonitor::query()->where('name', 'Production website')->firstOrFail();

        $response->assertRedirect(route('admin.monitors.show', $monitor, absolute: false));
        $this->assertDatabaseHas('website_monitors', [
            'id' => $monitor->id,
            'project_id' => $project->id,
            'project_link_id' => $projectLink->id,
            'url' => 'https://example.test',
            'method' => 'GET',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_view_monitor_show_page(): void
    {
        [$admin, $project, $projectLink] = $this->projectContext();
        $monitor = WebsiteMonitor::create([
            'project_id' => $project->id,
            'project_link_id' => $projectLink->id,
            'name' => 'Production website',
            'url' => 'https://example.test',
            'current_status' => 'up',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.monitors.show', $monitor))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/monitors/show')
                ->where('monitor.name', 'Production website')
                ->where('monitor.project.name', 'Acme Website')
                ->where('monitor.project_link.label', 'Production'));
    }

    public function test_admin_can_view_monitor_edit_form(): void
    {
        [$admin, $project, $projectLink] = $this->projectContext();
        $monitor = WebsiteMonitor::create([
            'project_id' => $project->id,
            'project_link_id' => $projectLink->id,
            'name' => 'Production website',
            'url' => 'https://example.test',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.monitors.edit', $monitor))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/monitors/edit')
                ->where('monitor.name', 'Production website')
                ->has('projectLinks', 1));
    }

    public function test_admin_can_update_website_monitor(): void
    {
        [$admin, $project, $projectLink] = $this->projectContext();
        $monitor = WebsiteMonitor::create([
            'project_id' => $project->id,
            'project_link_id' => $projectLink->id,
            'name' => 'Production website',
            'url' => 'https://example.test',
        ]);

        $response = $this->actingAs($admin)->put(route('admin.monitors.update', $monitor), [
            'project_id' => $project->id,
            'project_link_id' => $projectLink->id,
            'name' => 'Production monitor',
            'url' => 'https://example.test/health',
            'method' => 'HEAD',
            'expected_status_code' => 204,
            'timeout_seconds' => 5,
            'check_interval_seconds' => 120,
            'is_active' => false,
            'current_status' => 'degraded',
            'last_status_code' => 503,
            'last_response_time_ms' => 900,
            'last_checked_at' => '2026-05-18 08:00:00',
            'last_down_at' => null,
            'last_recovered_at' => null,
            'consecutive_failures' => 2,
            'consecutive_successes' => 0,
        ]);

        $response->assertRedirect(route('admin.monitors.show', $monitor, absolute: false));
        $this->assertDatabaseHas('website_monitors', [
            'id' => $monitor->id,
            'name' => 'Production monitor',
            'url' => 'https://example.test/health',
            'method' => 'HEAD',
            'expected_status_code' => 204,
            'is_active' => false,
            'current_status' => 'degraded',
        ]);
    }

    public function test_admin_can_delete_website_monitor(): void
    {
        [$admin, $project] = $this->projectContext();
        $monitor = WebsiteMonitor::create([
            'project_id' => $project->id,
            'name' => 'Production website',
            'url' => 'https://example.test',
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.monitors.destroy', $monitor))
            ->assertRedirect(route('admin.monitors.index'));

        $this->assertSoftDeleted('website_monitors', [
            'id' => $monitor->id,
        ]);
    }

    /**
     * @return array{0: User, 1: Project, 2: ProjectLink}
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
        $projectLink = ProjectLink::create([
            'project_id' => $project->id,
            'type' => 'production',
            'label' => 'Production',
            'url' => 'https://example.test',
        ]);

        return [$admin, $project, $projectLink];
    }
}
