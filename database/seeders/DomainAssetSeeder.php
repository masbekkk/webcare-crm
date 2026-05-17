<?php

namespace Database\Seeders;

use App\Models\DomainAsset;
use App\Models\Project;
use Illuminate\Database\Seeder;

class DomainAssetSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->domains() as $attributes) {
            $project = Project::query()->where('slug', $attributes['project_slug'])->firstOrFail();

            DomainAsset::updateOrCreate(
                ['domain_name' => $attributes['domain_name']],
                [
                    'client_id' => $project->client_id,
                    'project_id' => $project->id,
                    'registrar' => $attributes['registrar'],
                    'registered_at' => $attributes['registered_at'],
                    'expired_at' => $attributes['expired_at'],
                    'auto_renew' => $attributes['auto_renew'],
                    'notes' => $attributes['auto_renew']
                        ? 'Auto-renew enabled after client approval.'
                        : 'Renewal requires manual finance confirmation.',
                ],
            );
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function domains(): array
    {
        return [
            [
                'project_slug' => 'kopi-senja-company-profile',
                'domain_name' => 'kopisenja.test',
                'registrar' => 'Cloudflare',
                'registered_at' => '2026-01-05',
                'expired_at' => '2027-01-05',
                'auto_renew' => true,
            ],
            [
                'project_slug' => 'alika-fashion-ecommerce',
                'domain_name' => 'alikafashion.test',
                'registrar' => 'Niagahoster',
                'registered_at' => '2026-03-01',
                'expired_at' => '2027-03-01',
                'auto_renew' => true,
            ],
            [
                'project_slug' => 'medika-pratama-booking-system',
                'domain_name' => 'medikapratama.test',
                'registrar' => 'Rumahweb',
                'registered_at' => '2026-02-10',
                'expired_at' => '2027-02-10',
                'auto_renew' => false,
            ],
        ];
    }
}
