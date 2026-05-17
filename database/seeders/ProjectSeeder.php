<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $creator = User::query()->where('email', 'ian@webcare.test')->firstOrFail();

        foreach ($this->projects() as $attributes) {
            $client = Client::query()
                ->where('company_name', $attributes['company_name'])
                ->firstOrFail();

            Project::updateOrCreate(
                ['slug' => $attributes['slug']],
                [
                    'client_id' => $client->id,
                    'name' => $attributes['name'],
                    'description' => $attributes['description'],
                    'project_type' => $attributes['project_type'],
                    'contract_value' => $attributes['contract_value'],
                    'payment_model' => $attributes['payment_model'],
                    'status' => $attributes['status'],
                    'start_date' => $attributes['start_date'],
                    'target_finish_date' => $attributes['target_finish_date'],
                    'live_date' => $attributes['live_date'],
                    'tech_stack' => $attributes['tech_stack'],
                    'internal_notes' => $attributes['internal_notes'],
                    'created_by' => $creator->id,
                ],
            );
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function projects(): array
    {
        return [
            [
                'company_name' => 'Shayda',
                'name' => 'Shayda Production Website',
                'slug' => 'shayda-production-website',
                'description' => 'Production website published at shayda.webcareproject.my.id.',
                'project_type' => 'Company Profile',
                'contract_value' => 0,
                'payment_model' => 'custom',
                'status' => 'live',
                'start_date' => '2026-05-01',
                'target_finish_date' => '2026-05-10',
                'live_date' => '2026-05-10',
                'tech_stack' => 'Laravel, Webcare hosting',
                'internal_notes' => 'Seeded from production URL: https://shayda.webcareproject.my.id/',
            ],
            [
                'company_name' => 'Anemi',
                'name' => 'Anemi Production Website',
                'slug' => 'anemi-production-website',
                'description' => 'Production website published at anemi.webcareproject.my.id.',
                'project_type' => 'E-Commerce',
                'contract_value' => 0,
                'payment_model' => 'custom',
                'status' => 'live',
                'start_date' => '2026-05-01',
                'target_finish_date' => '2026-05-10',
                'live_date' => '2026-05-10',
                'tech_stack' => 'Laravel, Webcare hosting',
                'internal_notes' => 'Seeded from production URL: https://anemi.webcareproject.my.id/',
            ],
            [
                'company_name' => 'Webcare Intern',
                'name' => 'Webcare Intern Portal',
                'slug' => 'webcare-intern-portal',
                'description' => 'Internal portal published at intern.webcareproject.my.id.',
                'project_type' => 'Custom Web App',
                'contract_value' => 0,
                'payment_model' => 'custom',
                'status' => 'live',
                'start_date' => '2026-05-01',
                'target_finish_date' => '2026-05-10',
                'live_date' => '2026-05-10',
                'tech_stack' => 'Laravel, Webcare hosting',
                'internal_notes' => 'Seeded from production URL: http://intern.webcareproject.my.id/',
            ],
        ];
    }
}
