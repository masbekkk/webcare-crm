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
            'kopi-senja-company-profile' => [
                ['type' => 'production', 'label' => 'Production Site', 'url' => 'https://kopisenja.test', 'is_primary' => true],
                ['type' => 'admin_panel', 'label' => 'Admin Panel', 'url' => 'https://kopisenja.test/admin', 'username' => 'admin@kopisenja.test'],
                ['type' => 'repository', 'label' => 'Git Repository', 'url' => 'https://github.com/webcare/kopi-senja-profile'],
            ],
            'alika-fashion-ecommerce' => [
                ['type' => 'staging', 'label' => 'Staging Site', 'url' => 'https://staging.alikafashion.test', 'is_primary' => true],
                ['type' => 'figma', 'label' => 'Figma Design', 'url' => 'https://figma.com/file/alika-commerce'],
                ['type' => 'repository', 'label' => 'Git Repository', 'url' => 'https://github.com/webcare/alika-commerce'],
            ],
            'medika-pratama-booking-system' => [
                ['type' => 'staging', 'label' => 'UAT Site', 'url' => 'https://uat.medikapratama.test', 'is_primary' => true],
                ['type' => 'documentation', 'label' => 'UAT Checklist', 'url' => 'https://docs.webcare.test/medika-uat'],
                ['type' => 'repository', 'label' => 'Git Repository', 'url' => 'https://github.com/webcare/medika-booking'],
            ],
        ];
    }
}
