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
                'company_name' => 'PT Kopi Senja Nusantara',
                'name' => 'Kopi Senja Company Profile',
                'slug' => 'kopi-senja-company-profile',
                'description' => 'Company profile for store locations, menu highlights, and franchise inquiries.',
                'project_type' => 'Company Profile',
                'contract_value' => 18000000,
                'payment_model' => 'one_time',
                'status' => 'live',
                'start_date' => '2026-01-08',
                'target_finish_date' => '2026-02-12',
                'live_date' => '2026-02-10',
                'tech_stack' => 'Laravel, Inertia React, Tailwind CSS, MySQL',
                'internal_notes' => 'Client requests menu content updates every Friday before weekend campaign.',
            ],
            [
                'company_name' => 'CV Alika Fashion Indonesia',
                'name' => 'Alika Fashion E-Commerce',
                'slug' => 'alika-fashion-ecommerce',
                'description' => 'Online catalog, checkout workflow, order admin, and promo landing pages.',
                'project_type' => 'E-Commerce',
                'contract_value' => 52000000,
                'payment_model' => 'custom',
                'status' => 'development',
                'start_date' => '2026-03-04',
                'target_finish_date' => '2026-06-20',
                'live_date' => null,
                'tech_stack' => 'Laravel, React, Midtrans Sandbox, MySQL, Redis',
                'internal_notes' => 'Phase 1 covers catalog, cart, bank transfer confirmation, and admin product import.',
            ],
            [
                'company_name' => 'Klinik Medika Pratama',
                'name' => 'Medika Pratama Booking System',
                'slug' => 'medika-pratama-booking-system',
                'description' => 'Patient appointment booking, doctor schedule, and clinic operations dashboard.',
                'project_type' => 'Booking System',
                'contract_value' => 36000000,
                'payment_model' => 'subscription',
                'status' => 'testing',
                'start_date' => '2026-02-15',
                'target_finish_date' => '2026-05-30',
                'live_date' => null,
                'tech_stack' => 'Laravel, Inertia React, MySQL, WhatsApp gateway',
                'internal_notes' => 'UAT focuses on appointment slot conflicts and reminder content approval.',
            ],
        ];
    }
}
