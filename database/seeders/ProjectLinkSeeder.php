<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectLink;
use Illuminate\Database\Seeder;

class ProjectLinkSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->links() as $projectSlug => $links) {
            $project = Project::query()->where('slug', $projectSlug)->firstOrFail();

            foreach ($links as $link) {
                ProjectLink::updateOrCreate(
                    [
                        'project_id' => $project->id,
                        'type' => $link['type'],
                        'label' => $link['label'],
                    ],
                    [
                        'url' => $link['url'],
                        'username' => $link['username'] ?? null,
                        'notes' => $link['notes'] ?? null,
                        'is_primary' => $link['is_primary'] ?? false,
                        'is_active' => true,
                    ],
                );
            }
        }
    }

    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    private function links(): array
    {
        return [
            'shayda-production-website' => [
                ['type' => 'production', 'label' => 'Production Site', 'url' => 'https://shayda.webcareproject.my.id/', 'is_primary' => true],
                ['type' => 'admin_panel', 'label' => 'Admin Panel', 'url' => 'https://shayda.webcareproject.my.id/admin'],
            ],
            'anemi-production-website' => [
                ['type' => 'production', 'label' => 'Production Site', 'url' => 'https://anemi.webcareproject.my.id/', 'is_primary' => true],
                ['type' => 'admin_panel', 'label' => 'Admin Panel', 'url' => 'https://anemi.webcareproject.my.id/admin'],
            ],
            'webcare-intern-portal' => [
                ['type' => 'production', 'label' => 'Production Site', 'url' => 'http://intern.webcareproject.my.id/', 'is_primary' => true],
                ['type' => 'admin_panel', 'label' => 'Admin Panel', 'url' => 'http://intern.webcareproject.my.id/admin'],
            ],
        ];
    }
}
