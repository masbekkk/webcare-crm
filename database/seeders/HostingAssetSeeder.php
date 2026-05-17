<?php

namespace Database\Seeders;

use App\Models\HostingAsset;
use App\Models\Project;
use Illuminate\Database\Seeder;

class HostingAssetSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->hostingAssets() as $attributes) {
            $project = Project::query()->where('slug', $attributes['project_slug'])->firstOrFail();

            HostingAsset::updateOrCreate(
                [
                    'client_id' => $project->client_id,
                    'project_id' => $project->id,
                    'provider' => $attributes['provider'],
                ],
                [
                    'service_name' => $attributes['service_name'],
                    'panel_url' => $attributes['panel_url'],
                    'server_ip' => $attributes['server_ip'],
                    'start_date' => $attributes['start_date'],
                    'expired_at' => $attributes['expired_at'],
                    'notes' => 'Demo asset based on typical production handover data.',
                ],
            );
        }
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function hostingAssets(): array
    {
        return [
            [
                'project_slug' => 'kopi-senja-company-profile',
                'provider' => 'Cloudways',
                'service_name' => 'DigitalOcean 2GB Production',
                'panel_url' => 'https://platform.cloudways.com',
                'server_ip' => '203.0.113.11',
                'start_date' => '2026-01-08',
                'expired_at' => '2027-01-08',
            ],
            [
                'project_slug' => 'alika-fashion-ecommerce',
                'provider' => 'DigitalOcean',
                'service_name' => 'Basic Droplet Staging',
                'panel_url' => 'https://cloud.digitalocean.com',
                'server_ip' => '203.0.113.21',
                'start_date' => '2026-03-04',
                'expired_at' => '2027-03-04',
            ],
            [
                'project_slug' => 'medika-pratama-booking-system',
                'provider' => 'IDCloudHost',
                'service_name' => 'VPS UAT 2 vCPU',
                'panel_url' => 'https://console.idcloudhost.com',
                'server_ip' => '203.0.113.31',
                'start_date' => '2026-02-15',
                'expired_at' => '2027-02-15',
            ],
        ];
    }
}
