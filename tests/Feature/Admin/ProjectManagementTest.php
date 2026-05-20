<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectLink;
use App\Models\ProjectMember;
use App\Models\ProjectPaymentTimeline;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_projects_index(): void
    {
        $admin = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);

        Project::create([
            'client_id' => $client->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'project_type' => 'Company Profile',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.projects.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/projects/index')
                ->where('filters.search', null)
                ->where('stats.total_count', 1)
                ->where('stats.live_count', 0)
                ->has('projects.data', 1)
                ->where('projects.data.0.name', 'Acme Website'));
    }

    public function test_admin_can_search_and_sort_projects_index(): void
    {
        $admin = User::factory()->create();
        $acme = Client::create(['company_name' => 'Acme Studio']);
        $zen = Client::create(['company_name' => 'Zen Works']);

        Project::create([
            'client_id' => $zen->id,
            'name' => 'Zen Portal',
            'slug' => 'zen-portal',
            'project_type' => 'CRM',
            'status' => 'development',
            'created_by' => $admin->id,
        ]);
        Project::create([
            'client_id' => $acme->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'project_type' => 'Company Profile',
            'status' => 'live',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.projects.index', [
                'search' => 'acme',
                'sort' => 'client',
                'direction' => 'asc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('projects.data', 1)
                ->where('filters.search', 'acme')
                ->where('filters.sort', 'client')
                ->where('filters.direction', 'asc')
                ->where('stats.total_count', 1)
                ->where('stats.live_count', 1)
                ->where('projects.data.0.name', 'Acme Website'));
    }

    public function test_admin_can_view_project_create_form(): void
    {
        $admin = User::factory()->create();
        Client::create(['company_name' => 'Acme Studio']);

        $this->actingAs($admin)
            ->get(route('admin.projects.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/projects/create')
                ->has('clients', 1)
                ->where('project', null));
    }

    public function test_admin_can_view_project_edit_form(): void
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

        $this->actingAs($admin)
            ->get(route('admin.projects.edit', $project))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/projects/edit')
                ->where('project.name', 'Acme Website')
                ->has('project.links')
                ->has('project.members')
                ->has('project.payment_timelines'));
    }

    public function test_admin_can_create_project_with_links_members_and_payment_timelines(): void
    {
        $admin = User::factory()->create();
        $member = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);

        $response = $this->actingAs($admin)->post(route('admin.projects.store'), [
            'client_id' => $client->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'description' => 'Company profile project',
            'project_type' => 'Company Profile',
            'contract_value' => 10000000,
            'payment_model' => 'one_time',
            'status' => 'planning',
            'start_date' => '2026-05-01',
            'target_finish_date' => '2026-06-01',
            'tech_stack' => 'Laravel, React',
            'internal_notes' => 'VIP client',
            'links' => [
                [
                    'type' => 'production',
                    'label' => 'Production',
                    'url' => 'https://acme.test',
                    'username' => null,
                    'notes' => null,
                    'is_primary' => true,
                    'is_active' => true,
                ],
            ],
            'members' => [
                [
                    'user_id' => $member->id,
                    'role' => 'Project Manager',
                    'assigned_at' => '2026-05-02 09:00:00',
                ],
            ],
            'payment_timelines' => [
                [
                    'type' => 'dp',
                    'title' => 'DP 50%',
                    'description' => 'Initial payment',
                    'sequence_order' => 1,
                    'percentage' => 50,
                    'planned_amount' => 5000000,
                    'paid_amount' => 1000000,
                    'due_date' => '2026-05-05',
                    'status' => 'partially_paid',
                    'payment_method' => 'bank_transfer',
                    'reference_number' => 'INV-001',
                    'reminder_days_before' => 3,
                    'is_additional_charge' => false,
                    'admin_notes' => 'Follow up',
                    'client_notes' => 'Please pay before kickoff',
                ],
            ],
        ]);

        $project = Project::query()->where('slug', 'acme-website')->firstOrFail();

        $response->assertRedirect(route('admin.projects.edit', $project, absolute: false));
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'client_id' => $client->id,
            'created_by' => $admin->id,
            'name' => 'Acme Website',
            'status' => 'planning',
        ]);
        $this->assertDatabaseHas('project_links', [
            'project_id' => $project->id,
            'type' => 'production',
            'url' => 'https://acme.test',
            'is_primary' => true,
        ]);
        $this->assertDatabaseHas('project_members', [
            'project_id' => $project->id,
            'user_id' => $member->id,
            'role' => 'Project Manager',
        ]);
        $this->assertDatabaseHas('project_payment_timelines', [
            'project_id' => $project->id,
            'client_id' => $client->id,
            'created_by' => $admin->id,
            'type' => 'dp',
            'planned_amount' => 5000000,
            'paid_amount' => 1000000,
            'remaining_amount' => 4000000,
        ]);
    }

    public function test_admin_can_update_project_and_replace_related_rows(): void
    {
        $admin = User::factory()->create();
        $oldMember = User::factory()->create();
        $newMember = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);
        $project = Project::create([
            'client_id' => $client->id,
            'name' => 'Old Project',
            'slug' => 'old-project',
            'project_type' => 'CRM',
            'created_by' => $admin->id,
        ]);

        ProjectLink::create([
            'project_id' => $project->id,
            'type' => 'staging',
            'label' => 'Old Staging',
            'url' => 'https://old.test',
        ]);
        ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => $oldMember->id,
            'role' => 'Developer',
        ]);
        ProjectPaymentTimeline::create([
            'project_id' => $project->id,
            'client_id' => $client->id,
            'type' => 'dp',
            'title' => 'Old DP',
            'planned_amount' => 1000,
            'created_by' => $admin->id,
        ]);

        $response = $this->actingAs($admin)->put(route('admin.projects.update', $project), [
            'client_id' => $client->id,
            'name' => 'Updated Project',
            'slug' => 'updated-project',
            'description' => null,
            'project_type' => 'CRM',
            'contract_value' => 15000000,
            'payment_model' => 'custom',
            'status' => 'development',
            'start_date' => null,
            'target_finish_date' => null,
            'live_date' => null,
            'tech_stack' => null,
            'internal_notes' => null,
            'links' => [
                [
                    'type' => 'repository',
                    'label' => 'Repository',
                    'url' => 'https://github.com/acme/project',
                    'is_primary' => false,
                    'is_active' => true,
                ],
            ],
            'members' => [
                [
                    'user_id' => $newMember->id,
                    'role' => 'Backend Developer',
                    'assigned_at' => null,
                ],
            ],
            'payment_timelines' => [
                [
                    'type' => 'final_payment',
                    'title' => 'Final Payment',
                    'sequence_order' => 1,
                    'planned_amount' => 15000000,
                    'paid_amount' => 0,
                    'status' => 'waiting',
                    'is_additional_charge' => false,
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.projects.edit', $project, absolute: false));
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project',
            'slug' => 'updated-project',
            'status' => 'development',
        ]);
        $this->assertSoftDeleted('project_links', [
            'project_id' => $project->id,
            'url' => 'https://old.test',
        ]);
        $this->assertDatabaseMissing('project_members', [
            'project_id' => $project->id,
            'user_id' => $oldMember->id,
        ]);
        $this->assertDatabaseHas('project_links', [
            'project_id' => $project->id,
            'type' => 'repository',
        ]);
        $this->assertDatabaseHas('project_members', [
            'project_id' => $project->id,
            'user_id' => $newMember->id,
        ]);
        $this->assertDatabaseHas('project_payment_timelines', [
            'project_id' => $project->id,
            'title' => 'Final Payment',
            'remaining_amount' => 15000000,
            'updated_by' => $admin->id,
        ]);
    }
}
