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
                'project_slug' => 'shayda-production-website',
                'provider' => 'Webcare VPS',
                'service_name' => 'Shayda Production Hosting',
                'panel_url' => 'https://panel.webcareproject.my.id',
                'server_ip' => '43.133.155.164',
                'start_date' => '2026-05-01',
                'expired_at' => '2027-05-01',
            ],
            [
                'project_slug' => 'anemi-production-website',
                'provider' => 'Webcare VPS',
                'service_name' => 'Anemi Production Hosting',
                'panel_url' => 'https://panel.webcareproject.my.id',
                'server_ip' => '43.133.155.164',
                'start_date' => '2026-05-01',
                'expired_at' => '2027-05-01',
            ],
            [
                'project_slug' => 'webcare-intern-portal',
                'provider' => 'Webcare VPS',
                'service_name' => 'Intern Portal Hosting',
                'panel_url' => 'https://panel.webcareproject.my.id',
                'server_ip' => '43.133.155.164',
                'start_date' => '2026-05-01',
                'expired_at' => '2027-05-01',
            ],
        ];
    }
}
