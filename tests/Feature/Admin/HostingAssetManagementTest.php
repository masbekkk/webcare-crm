<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\HostingAsset;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class HostingAssetManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_hosting_assets_index(): void
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

        HostingAsset::create([
            'client_id' => $client->id,
            'project_id' => $project->id,
            'provider' => 'DigitalOcean',
            'service_name' => 'Basic Droplet',
            'expired_at' => '2026-06-30',
        ]);

        $this->actingAs($admin)
            ->get(route('admin.hosting-assets.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/hosting-assets/index')
                ->has('hostingAssets.data', 1)
                ->where('hostingAssets.data.0.provider', 'DigitalOcean')
                ->where('hostingAssets.data.0.client.company_name', 'Acme Studio')
                ->where('hostingAssets.data.0.project.name', 'Acme Website'));
    }

    public function test_admin_can_create_update_and_delete_hosting_asset(): void
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

        $response = $this->actingAs($admin)->post(route('admin.hosting-assets.store'), [
            'client_id' => $client->id,
            'project_id' => $project->id,
            'provider' => 'DigitalOcean',
            'service_name' => 'Basic Droplet',
            'panel_url' => 'https://cloud.digitalocean.com',
            'server_ip' => '203.0.113.10',
            'start_date' => '2026-01-01',
            'expired_at' => '2026-12-31',
            'notes' => 'Production server',
        ]);

        $hostingAsset = HostingAsset::query()->where('provider', 'DigitalOcean')->firstOrFail();

        $response->assertRedirect(route('admin.hosting-assets.edit', $hostingAsset, absolute: false));
        $this->assertDatabaseHas('hosting_assets', [
            'id' => $hostingAsset->id,
            'client_id' => $client->id,
            'project_id' => $project->id,
            'provider' => 'DigitalOcean',
            'server_ip' => '203.0.113.10',
        ]);

        $this->actingAs($admin)
            ->put(route('admin.hosting-assets.update', $hostingAsset), [
                'client_id' => $client->id,
                'project_id' => null,
                'provider' => 'Cloudways',
                'service_name' => 'Managed Hosting',
                'panel_url' => null,
                'server_ip' => null,
                'start_date' => null,
                'expired_at' => '2027-01-31',
                'notes' => null,
            ])
            ->assertRedirect(route('admin.hosting-assets.edit', $hostingAsset, absolute: false));

        $this->assertDatabaseHas('hosting_assets', [
            'id' => $hostingAsset->id,
            'project_id' => null,
            'provider' => 'Cloudways',
            'service_name' => 'Managed Hosting',
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.hosting-assets.destroy', $hostingAsset))
            ->assertRedirect(route('admin.hosting-assets.index', absolute: false));

        $this->assertSoftDeleted('hosting_assets', [
            'id' => $hostingAsset->id,
        ]);
    }
}
