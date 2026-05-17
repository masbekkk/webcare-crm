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
                'project_slug' => 'shayda-production-website',
                'domain_name' => 'shayda.webcareproject.my.id',
                'registrar' => 'Webcare DNS',
                'registered_at' => '2026-05-01',
                'expired_at' => '2027-05-01',
                'auto_renew' => true,
            ],
            [
                'project_slug' => 'anemi-production-website',
                'domain_name' => 'anemi.webcareproject.my.id',
                'registrar' => 'Webcare DNS',
                'registered_at' => '2026-05-01',
                'expired_at' => '2027-05-01',
                'auto_renew' => true,
            ],
            [
                'project_slug' => 'webcare-intern-portal',
                'domain_name' => 'intern.webcareproject.my.id',
                'registrar' => 'Webcare DNS',
                'registered_at' => '2026-05-01',
                'expired_at' => '2027-05-01',
                'auto_renew' => true,
            ],
        ];
    }
}
