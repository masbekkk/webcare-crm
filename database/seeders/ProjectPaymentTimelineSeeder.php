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
            'kopi-senja-company-profile' => [
                ['type' => 'dp', 'title' => 'DP 50% sebelum kickoff', 'sequence_order' => 1, 'percentage' => 50, 'planned_amount' => 9000000, 'paid_amount' => 9000000, 'due_date' => '2026-01-10', 'status' => 'paid', 'paid_at' => '2026-01-09 10:30:00', 'reference_number' => 'BCA-20260109-001'],
                ['type' => 'final_payment', 'title' => 'Pelunasan setelah go-live', 'sequence_order' => 2, 'percentage' => 50, 'planned_amount' => 9000000, 'paid_amount' => 9000000, 'due_date' => '2026-02-14', 'status' => 'paid', 'paid_at' => '2026-02-12 15:10:00', 'reference_number' => 'BCA-20260212-003'],
            ],
            'alika-fashion-ecommerce' => [
                ['type' => 'dp', 'title' => 'DP desain dan setup project', 'sequence_order' => 1, 'percentage' => 30, 'planned_amount' => 15600000, 'paid_amount' => 15600000, 'due_date' => '2026-03-08', 'status' => 'paid', 'paid_at' => '2026-03-07 11:15:00', 'reference_number' => 'MANDIRI-20260307-011'],
                ['type' => 'installment', 'title' => 'Milestone catalog dan cart', 'sequence_order' => 2, 'percentage' => 40, 'planned_amount' => 20800000, 'paid_amount' => 8000000, 'due_date' => '2026-05-20', 'status' => 'partially_paid', 'paid_at' => null, 'reference_number' => 'INV-ALIKA-002'],
                ['type' => 'final_payment', 'title' => 'Pelunasan sebelum production release', 'sequence_order' => 3, 'percentage' => 30, 'planned_amount' => 15600000, 'paid_amount' => 0, 'due_date' => '2026-06-18', 'status' => 'planned', 'paid_at' => null, 'reference_number' => null],
            ],
            'medika-pratama-booking-system' => [
                ['type' => 'dp', 'title' => 'DP analisis jadwal dokter', 'sequence_order' => 1, 'percentage' => 40, 'planned_amount' => 14400000, 'paid_amount' => 14400000, 'due_date' => '2026-02-20', 'status' => 'paid', 'paid_at' => '2026-02-19 09:45:00', 'reference_number' => 'BRI-20260219-006'],
                ['type' => 'installment', 'title' => 'UAT booking dan reminder', 'sequence_order' => 2, 'percentage' => 40, 'planned_amount' => 14400000, 'paid_amount' => 0, 'due_date' => '2026-05-25', 'status' => 'waiting', 'paid_at' => null, 'reference_number' => 'INV-MEDIKA-002'],
                ['type' => 'monthly_subscription', 'title' => 'Support bulan pertama', 'sequence_order' => 3, 'percentage' => 20, 'planned_amount' => 7200000, 'paid_amount' => 0, 'due_date' => '2026-06-30', 'status' => 'planned', 'paid_at' => null, 'reference_number' => null],
            ],
        ];
    }
}
