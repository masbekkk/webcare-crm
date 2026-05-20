<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectLinkIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_project_links_index(): void
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

        ProjectLink::create([
            'project_id' => $project->id,
            'type' => 'production',
            'label' => 'Production',
            'url' => 'https://acme.test',
            'username' => 'admin',
            'notes' => 'Main website',
            'is_primary' => true,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.project-links.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/project-links/index')
                ->has('projectLinks.data', 1)
                ->where('filters.search', null)
                ->where('stats.total_count', 1)
                ->where('stats.active_count', 1)
                ->where('stats.primary_count', 1)
                ->where('projectLinks.data.0.label', 'Production')
                ->where('projectLinks.data.0.project.name', 'Acme Website')
                ->where('projectLinks.data.0.project.client.company_name', 'Acme Studio'));
    }

    public function test_admin_can_search_and_sort_project_links_index(): void
    {
        $admin = User::factory()->create();
        $acme = Client::create(['company_name' => 'Acme Studio']);
        $zen = Client::create(['company_name' => 'Zen Works']);
        $acmeProject = Project::create([
            'client_id' => $acme->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'project_type' => 'Company Profile',
            'created_by' => $admin->id,
        ]);
        $zenProject = Project::create([
            'client_id' => $zen->id,
            'name' => 'Zen Portal',
            'slug' => 'zen-portal',
            'project_type' => 'CRM',
            'created_by' => $admin->id,
        ]);

        ProjectLink::create([
            'project_id' => $zenProject->id,
            'type' => 'production',
            'label' => 'Zen Production',
            'url' => 'https://zen.test',
        ]);
        ProjectLink::create([
            'project_id' => $acmeProject->id,
            'type' => 'staging',
            'label' => 'Acme Staging',
            'url' => 'https://staging.acme.test',
            'is_active' => false,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.project-links.index', [
                'search' => 'acme',
                'sort' => 'client',
                'direction' => 'asc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('projectLinks.data', 1)
                ->where('filters.search', 'acme')
                ->where('filters.sort', 'client')
                ->where('filters.direction', 'asc')
                ->where('stats.total_count', 1)
                ->where('stats.inactive_count', 1)
                ->where('projectLinks.data.0.label', 'Acme Staging'));
    }
}
