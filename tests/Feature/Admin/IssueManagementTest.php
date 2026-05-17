<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\Issue;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class IssueManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_issue_create_page(): void
    {
        [$admin] = $this->projectContext();

        $this->actingAs($admin)
            ->get(route('admin.issues.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/issues/create')
                ->where('issue', null)
                ->has('clients', 1)
                ->has('projects', 1)
                ->has('users', 1));
    }

    public function test_admin_can_store_issue(): void
    {
        [$admin, $client, $project] = $this->projectContext();
        $assignee = User::factory()->create(['name' => 'Support Agent']);

        $this->actingAs($admin)
            ->post(route('admin.issues.store'), [
                'project_id' => $project->id,
                'client_id' => $client->id,
                'title' => 'Checkout error',
                'description' => 'Payment button throws a browser error.',
                'priority' => 'high',
                'status' => 'open',
                'assigned_to' => $assignee->id,
                'due_date' => '2026-05-25',
                'internal_notes' => 'Check payment gateway logs.',
            ])
            ->assertRedirect(route('admin.issues.show', Issue::first()));

        $this->assertDatabaseHas('issues', [
            'project_id' => $project->id,
            'client_id' => $client->id,
            'title' => 'Checkout error',
            'reported_by' => $admin->id,
            'assigned_to' => $assignee->id,
        ]);
    }

    public function test_admin_can_view_issue_show_page(): void
    {
        [$admin, $client, $project] = $this->projectContext();
        $issue = $this->issue($client, $project, $admin);

        $this->actingAs($admin)
            ->get(route('admin.issues.show', $issue))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/issues/show')
                ->where('issue.title', 'Homepage form broken')
                ->where('issue.client.company_name', 'Acme Studio')
                ->where('issue.project.name', 'Acme Website')
                ->where('issue.reporter.name', $admin->name));
    }

    public function test_admin_can_view_issue_edit_page(): void
    {
        [$admin, $client, $project] = $this->projectContext();
        $issue = $this->issue($client, $project, $admin);

        $this->actingAs($admin)
            ->get(route('admin.issues.edit', $issue))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/issues/edit')
                ->where('issue.title', 'Homepage form broken')
                ->has('clients', 1)
                ->has('projects', 1)
                ->has('users', 1));
    }

    public function test_admin_can_update_issue(): void
    {
        [$admin, $client, $project] = $this->projectContext();
        $issue = $this->issue($client, $project, $admin);
        $assignee = User::factory()->create(['name' => 'Support Agent']);

        $this->actingAs($admin)
            ->put(route('admin.issues.update', $issue), [
                'project_id' => $project->id,
                'client_id' => $client->id,
                'title' => 'Updated homepage form issue',
                'description' => 'Updated issue description.',
                'priority' => 'urgent',
                'status' => 'resolved',
                'assigned_to' => $assignee->id,
                'due_date' => '2026-05-26',
                'resolved_at' => '2026-05-20 10:00:00',
                'resolution_notes' => 'Fixed validation handler.',
                'internal_notes' => 'Validated in staging.',
            ])
            ->assertRedirect(route('admin.issues.show', $issue));

        $this->assertDatabaseHas('issues', [
            'id' => $issue->id,
            'title' => 'Updated homepage form issue',
            'priority' => 'urgent',
            'status' => 'resolved',
            'assigned_to' => $assignee->id,
        ]);
    }

    public function test_issue_validation_requires_matching_project_client(): void
    {
        [$admin, $client, $project] = $this->projectContext();
        $otherClient = Client::create(['company_name' => 'Other Client']);

        $this->actingAs($admin)
            ->post(route('admin.issues.store'), [
                'project_id' => $project->id,
                'client_id' => $otherClient->id,
                'title' => 'Mismatch',
                'description' => 'Client does not own project.',
                'priority' => 'medium',
                'status' => 'open',
            ])
            ->assertSessionHasErrors('project_id');

        $this->assertDatabaseMissing('issues', [
            'title' => 'Mismatch',
            'client_id' => $client->id,
        ]);
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

    private function issue(Client $client, Project $project, User $reporter): Issue
    {
        return Issue::create([
            'project_id' => $project->id,
            'client_id' => $client->id,
            'title' => 'Homepage form broken',
            'description' => 'Contact form fails on submit.',
            'priority' => 'high',
            'status' => 'open',
            'reported_by' => $reporter->id,
            'due_date' => '2026-05-20',
        ]);
    }
}
