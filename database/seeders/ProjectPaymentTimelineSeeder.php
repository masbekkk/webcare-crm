<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectPaymentTimeline;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectPaymentTimelineSeeder extends Seeder
{
    public function run(): void
    {
        $creator = User::query()->where('email', 'ian@webcare.test')->firstOrFail();
        $updater = User::query()->where('email', 'rani@webcare.test')->firstOrFail();

        foreach ($this->timelines() as $projectSlug => $timelines) {
            $project = Project::query()->where('slug', $projectSlug)->firstOrFail();

            foreach ($timelines as $timeline) {
                ProjectPaymentTimeline::updateOrCreate(
                    [
                        'project_id' => $project->id,
                        'sequence_order' => $timeline['sequence_order'],
                    ],
                    [
                        'client_id' => $project->client_id,
                        'type' => $timeline['type'],
                        'title' => $timeline['title'],
                        'description' => 'Payment milestone generated from signed project agreement.',
                        'percentage' => $timeline['percentage'],
                        'planned_amount' => $timeline['planned_amount'],
                        'paid_amount' => $timeline['paid_amount'],
                        'remaining_amount' => max($timeline['planned_amount'] - $timeline['paid_amount'], 0),
                        'due_date' => $timeline['due_date'],
                        'paid_at' => $timeline['paid_at'],
                        'billing_period_start' => null,
                        'billing_period_end' => null,
                        'status' => $timeline['status'],
                        'payment_method' => $timeline['paid_amount'] > 0 ? 'bank_transfer' : null,
                        'reference_number' => $timeline['reference_number'],
                        'proof_file' => $timeline['paid_amount'] > 0 ? "payments/{$projectSlug}-{$timeline['sequence_order']}.pdf" : null,
                        'reminder_days_before' => 3,
                        'is_additional_charge' => false,
                        'admin_notes' => $timeline['status'] === 'partially_paid' ? 'Follow up remaining payment this week.' : null,
                        'client_notes' => null,
                        'created_by' => $creator->id,
                        'updated_by' => $updater->id,
                    ],
                );
            }
        }
    }

    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    private function timelines(): array
    {
        return [
            'shayda-production-website' => [
                ['type' => 'maintenance_fee', 'title' => 'Monthly maintenance - Shayda', 'sequence_order' => 1, 'percentage' => null, 'planned_amount' => 1000000, 'paid_amount' => 1000000, 'due_date' => '2026-05-10', 'status' => 'paid', 'paid_at' => '2026-05-09 10:30:00', 'reference_number' => 'BCA-SHAYDA-202605'],
                ['type' => 'maintenance_fee', 'title' => 'Next maintenance - Shayda', 'sequence_order' => 2, 'percentage' => null, 'planned_amount' => 1000000, 'paid_amount' => 0, 'due_date' => '2026-06-10', 'status' => 'planned', 'paid_at' => null, 'reference_number' => null],
            ],
            'anemi-production-website' => [
                ['type' => 'maintenance_fee', 'title' => 'Monthly maintenance - Anemi', 'sequence_order' => 1, 'percentage' => null, 'planned_amount' => 1250000, 'paid_amount' => 1250000, 'due_date' => '2026-05-10', 'status' => 'paid', 'paid_at' => '2026-05-09 11:15:00', 'reference_number' => 'BCA-ANEMI-202605'],
                ['type' => 'maintenance_fee', 'title' => 'Next maintenance - Anemi', 'sequence_order' => 2, 'percentage' => null, 'planned_amount' => 1250000, 'paid_amount' => 0, 'due_date' => '2026-06-10', 'status' => 'planned', 'paid_at' => null, 'reference_number' => null],
            ],
            'webcare-intern-portal' => [
                ['type' => 'server_fee', 'title' => 'Internal portal hosting', 'sequence_order' => 1, 'percentage' => null, 'planned_amount' => 0, 'paid_amount' => 0, 'due_date' => '2026-06-10', 'status' => 'planned', 'paid_at' => null, 'reference_number' => null],
            ],
        ];
    }
}
