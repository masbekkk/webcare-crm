<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_users_index(): void
    {
        $admin = User::factory()->create(['name' => 'Admin User']);
        $client = Client::create(['company_name' => 'Acme Studio']);
        User::factory()->create([
            'client_id' => $client->id,
            'name' => 'Client User',
            'email' => 'client@example.test',
            'role' => 'client',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/users/index')
                ->has('users.data', 2)
                ->where('users.data.0.name', 'Client User')
                ->where('users.data.0.client.company_name', 'Acme Studio'));
    }

    public function test_admin_can_search_sort_and_view_user_index_stats(): void
    {
        $admin = User::factory()->create(['name' => 'Admin User']);
        $beta = Client::create(['company_name' => 'Beta Studio']);
        $acme = Client::create(['company_name' => 'Acme Studio']);
        User::factory()->create([
            'client_id' => $beta->id,
            'name' => 'Zara Client',
            'email' => 'zara@example.test',
            'role' => 'client',
            'is_active' => false,
        ]);
        User::factory()->create([
            'client_id' => $acme->id,
            'name' => 'Budi Client',
            'email' => 'budi@example.test',
            'role' => 'client',
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.users.index', [
                'search' => 'client',
                'sort' => 'client',
                'direction' => 'asc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/users/index')
                ->where('users.data.0.name', 'Budi Client')
                ->where('users.data.1.name', 'Zara Client')
                ->where('filters.search', 'client')
                ->where('filters.sort', 'client')
                ->where('filters.direction', 'asc')
                ->where('stats.total_count', 3)
                ->where('stats.client_count', 2)
                ->where('stats.active_count', 2));

        $this->actingAs($admin)
            ->get(route('admin.users.index', [
                'search' => 'zara',
                'sort' => 'user',
                'direction' => 'desc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('users.data', 1)
                ->where('users.data.0.name', 'Zara Client'));
    }

    public function test_admin_can_view_user_create_form(): void
    {
        $admin = User::factory()->create();
        Client::create(['company_name' => 'Acme Studio']);

        $this->actingAs($admin)
            ->get(route('admin.users.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/users/create')
                ->where('user', null)
                ->has('clients', 1));
    }

    public function test_admin_can_view_user_edit_form(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create(['name' => 'Editor User']);

        $this->actingAs($admin)
            ->get(route('admin.users.edit', $user))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/users/edit')
                ->where('user.name', 'Editor User'));
    }

    public function test_admin_can_create_user(): void
    {
        $admin = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);

        $response = $this->actingAs($admin)->post(route('admin.users.store'), [
            'client_id' => $client->id,
            'name' => 'Client Portal User',
            'email' => 'portal@example.test',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
            'role' => 'client',
            'phone' => '081234',
            'is_active' => true,
        ]);

        $user = User::query()->where('email', 'portal@example.test')->firstOrFail();

        $response->assertRedirect(route('admin.users.edit', $user, absolute: false));
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'client_id' => $client->id,
            'name' => 'Client Portal User',
            'email' => 'portal@example.test',
            'role' => 'client',
            'phone' => '081234',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_update_user_without_changing_password(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.test',
            'role' => 'admin',
            'phone' => null,
            'is_active' => true,
        ]);
        $originalPassword = $user->password;

        $response = $this->actingAs($admin)->put(route('admin.users.update', $user), [
            'client_id' => null,
            'name' => 'Updated Name',
            'email' => 'updated@example.test',
            'password' => null,
            'password_confirmation' => null,
            'role' => 'admin',
            'phone' => '089999',
            'is_active' => false,
        ]);

        $response->assertRedirect(route('admin.users.edit', $user, absolute: false));
        $user->refresh();

        $this->assertSame($originalPassword, $user->password);
        $this->assertSame('Updated Name', $user->name);
        $this->assertSame('updated@example.test', $user->email);
        $this->assertFalse($user->is_active);
    }

    public function test_client_role_requires_client_id(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'client_id' => null,
                'name' => 'Client User',
                'email' => 'client@example.test',
                'password' => 'secret-password',
                'password_confirmation' => 'secret-password',
                'role' => 'client',
                'phone' => null,
                'is_active' => true,
            ])
            ->assertSessionHasErrors('client_id');
    }

    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create(['email' => 'delete@example.test']);

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $user))
            ->assertRedirect(route('admin.users.index', absolute: false));

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }
}
