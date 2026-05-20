<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\DomainAsset;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DomainAssetManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_domain_assets_index(): void
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

        DomainAsset::create([
            'client_id' => $client->id,
            'project_id' => $project->id,
            'domain_name' => 'acme.test',
            'registrar' => 'Namecheap',
            'expired_at' => '2026-06-30',
            'auto_renew' => true,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.domain-assets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/domain-assets/index')
                ->has('domainAssets.data', 1)
                ->where('domainAssets.data.0.domain_name', 'acme.test')
                ->where('domainAssets.data.0.client.company_name', 'Acme Studio')
                ->where('domainAssets.data.0.project.name', 'Acme Website'));
    }

    public function test_admin_can_create_update_and_delete_domain_asset(): void
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

        $response = $this->actingAs($admin)->post(route('admin.domain-assets.store'), [
            'client_id' => $client->id,
            'project_id' => $project->id,
            'domain_name' => 'acme.test',
            'registrar' => 'Namecheap',
            'registered_at' => '2026-01-01',
            'expired_at' => '2026-12-31',
            'auto_renew' => true,
            'notes' => 'Main domain',
        ]);

        $domainAsset = DomainAsset::query()->where('domain_name', 'acme.test')->firstOrFail();

        $response->assertRedirect(route('admin.domain-assets.edit', $domainAsset, absolute: false));
        $this->assertDatabaseHas('domain_assets', [
            'id' => $domainAsset->id,
            'client_id' => $client->id,
            'project_id' => $project->id,
            'domain_name' => 'acme.test',
            'auto_renew' => true,
        ]);

        $this->actingAs($admin)
            ->put(route('admin.domain-assets.update', $domainAsset), [
                'client_id' => $client->id,
                'project_id' => null,
                'domain_name' => 'www.acme.test',
                'registrar' => 'Cloudflare',
                'registered_at' => null,
                'expired_at' => '2027-01-31',
                'auto_renew' => false,
                'notes' => null,
            ])
            ->assertRedirect(route('admin.domain-assets.edit', $domainAsset, absolute: false));

        $this->assertDatabaseHas('domain_assets', [
            'id' => $domainAsset->id,
            'project_id' => null,
            'domain_name' => 'www.acme.test',
            'registrar' => 'Cloudflare',
            'auto_renew' => false,
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.domain-assets.destroy', $domainAsset))
            ->assertRedirect(route('admin.domain-assets.index', absolute: false));

        $this->assertSoftDeleted('domain_assets', [
            'id' => $domainAsset->id,
        ]);
    }
}
