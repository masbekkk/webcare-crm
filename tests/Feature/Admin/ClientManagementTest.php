<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ClientManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_clients_index(): void
    {
        $admin = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);
        User::factory()->create([
            'client_id' => $client->id,
            'role' => 'client',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.clients.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/clients/index')
                ->has('clients.data', 1)
                ->where('clients.data.0.company_name', 'Acme Studio')
                ->where('clients.data.0.users_count', 1));
    }

    public function test_admin_can_search_sort_and_view_client_index_stats(): void
    {
        $admin = User::factory()->create();
        $beta = Client::create([
            'company_name' => 'Beta Studio',
            'pic_name' => 'Zara',
            'status' => 'prospect',
        ]);
        $acme = Client::create([
            'company_name' => 'Acme Studio',
            'pic_name' => 'Budi',
            'status' => 'active',
        ]);
        User::factory()->create([
            'client_id' => $acme->id,
            'role' => 'client',
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.clients.index', [
                'search' => 'studio',
                'sort' => 'pic',
                'direction' => 'asc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/clients/index')
                ->where('clients.data.0.company_name', 'Acme Studio')
                ->where('clients.data.1.company_name', 'Beta Studio')
                ->where('filters.search', 'studio')
                ->where('filters.sort', 'pic')
                ->where('filters.direction', 'asc')
                ->where('stats.total_count', 2)
                ->where('stats.active_count', 1)
                ->where('stats.client_user_count', 1));

        $this->actingAs($admin)
            ->get(route('admin.clients.index', [
                'search' => 'acme',
                'sort' => 'client',
                'direction' => 'desc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('clients.data', 1)
                ->where('clients.data.0.id', $acme->id));
    }

    public function test_admin_can_view_client_create_form(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->get(route('admin.clients.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/clients/create')
                ->where('client', null));
    }

    public function test_admin_can_view_client_edit_form(): void
    {
        $admin = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);
        User::factory()->create([
            'client_id' => $client->id,
            'name' => 'Client User',
            'role' => 'client',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.clients.edit', $client))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/clients/edit')
                ->where('client.company_name', 'Acme Studio')
                ->has('client.users', 1)
                ->where('client.users.0.name', 'Client User'));
    }

    public function test_admin_can_view_client_show_page_with_users_and_projects(): void
    {
        $admin = User::factory()->create();
        $client = Client::create([
            'company_name' => 'Acme Studio',
            'pic_name' => 'Budi',
            'company_email' => 'hello@acme.test',
            'status' => 'active',
        ]);
        $clientUser = User::factory()->create([
            'client_id' => $client->id,
            'name' => 'Client User',
            'email' => 'client@acme.test',
            'role' => 'client',
        ]);
        $project = Project::create([
            'client_id' => $client->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'project_type' => 'Company Profile',
            'contract_value' => 15000000,
            'status' => 'development',
            'created_by' => $admin->id,
        ]);

        ProjectMember::create([
            'project_id' => $project->id,
            'user_id' => $clientUser->id,
            'role' => 'Reviewer',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.clients.show', $client))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/clients/show')
                ->where('client.company_name', 'Acme Studio')
                ->where('client.users_count', 1)
                ->where('client.projects_count', 1)
                ->where('client.users.0.name', 'Client User')
                ->where('client.projects.0.name', 'Acme Website')
                ->where('client.projects.0.members.0.user.name', 'Client User'));
    }

    public function test_admin_can_create_client_with_client_users(): void
    {
        $admin = User::factory()->create();

        $response = $this->actingAs($admin)->post(route('admin.clients.store'), [
            'company_name' => 'Acme Studio',
            'display_name' => 'Acme',
            'pic_name' => 'Budi',
            'pic_position' => 'Owner',
            'pic_email' => 'budi@example.test',
            'pic_phone' => '081234',
            'pic_whatsapp' => '081234',
            'company_email' => 'hello@acme.test',
            'company_phone' => '021123',
            'address' => 'Jl. Sudirman',
            'city' => 'Jakarta',
            'province' => 'DKI Jakarta',
            'status' => 'active',
            'notes' => 'Priority client',
            'users' => [
                [
                    'name' => 'Client Portal User',
                    'email' => 'client@acme.test',
                    'password' => 'secret-password',
                    'phone' => '081111',
                    'is_active' => true,
                ],
            ],
        ]);

        $client = Client::query()->where('company_name', 'Acme Studio')->firstOrFail();

        $response->assertRedirect(route('admin.clients.edit', $client, absolute: false));
        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'company_name' => 'Acme Studio',
            'pic_email' => 'budi@example.test',
            'status' => 'active',
        ]);
        $this->assertDatabaseHas('users', [
            'client_id' => $client->id,
            'name' => 'Client Portal User',
            'email' => 'client@acme.test',
            'role' => 'client',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_update_client_and_sync_client_users(): void
    {
        $admin = User::factory()->create();
        $client = Client::create([
            'company_name' => 'Old Client',
            'status' => 'prospect',
        ]);
        $keptUser = User::factory()->create([
            'client_id' => $client->id,
            'name' => 'Old User',
            'email' => 'old@client.test',
            'role' => 'client',
        ]);
        $removedUser = User::factory()->create([
            'client_id' => $client->id,
            'email' => 'removed@client.test',
            'role' => 'client',
        ]);

        $response = $this->actingAs($admin)->put(route('admin.clients.update', $client), [
            'company_name' => 'Updated Client',
            'display_name' => 'Updated',
            'pic_name' => null,
            'pic_position' => null,
            'pic_email' => null,
            'pic_phone' => null,
            'pic_whatsapp' => null,
            'company_email' => null,
            'company_phone' => null,
            'address' => null,
            'city' => 'Bandung',
            'province' => 'Jawa Barat',
            'status' => 'active',
            'notes' => null,
            'users' => [
                [
                    'id' => $keptUser->id,
                    'name' => 'Updated User',
                    'email' => 'updated@client.test',
                    'password' => null,
                    'phone' => '082222',
                    'is_active' => false,
                ],
                [
                    'name' => 'New User',
                    'email' => 'new@client.test',
                    'password' => 'secret-password',
                    'phone' => null,
                    'is_active' => true,
                ],
            ],
        ]);

        $response->assertRedirect(route('admin.clients.edit', $client, absolute: false));
        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'company_name' => 'Updated Client',
            'city' => 'Bandung',
            'status' => 'active',
        ]);
        $this->assertDatabaseHas('users', [
            'id' => $keptUser->id,
            'client_id' => $client->id,
            'name' => 'Updated User',
            'email' => 'updated@client.test',
            'is_active' => false,
        ]);
        $this->assertDatabaseHas('users', [
            'client_id' => $client->id,
            'name' => 'New User',
            'email' => 'new@client.test',
            'role' => 'client',
        ]);
        $this->assertDatabaseMissing('users', [
            'id' => $removedUser->id,
        ]);
    }
}
