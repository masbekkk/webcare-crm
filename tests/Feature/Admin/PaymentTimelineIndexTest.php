<?php

namespace Tests\Feature\Admin;

use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectPaymentTimeline;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PaymentTimelineIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_payment_timeline_index_with_overall_statistics(): void
    {
        $admin = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);
        $project = Project::create([
            'client_id' => $client->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'project_type' => 'Company Profile',
            'created_by' => $admin->id,
        ]);

        ProjectPaymentTimeline::create([
            'project_id' => $project->id,
            'client_id' => $client->id,
            'type' => 'dp',
            'title' => 'DP 50%',
            'planned_amount' => 1000000,
            'paid_amount' => 250000,
            'remaining_amount' => 750000,
            'due_date' => '2026-05-10',
            'status' => 'waiting',
            'payment_method' => 'bank_transfer',
            'created_by' => $admin->id,
        ]);

        ProjectPaymentTimeline::create([
            'project_id' => $project->id,
            'client_id' => $client->id,
            'type' => 'final_payment',
            'title' => 'Final Payment',
            'planned_amount' => 2000000,
            'paid_amount' => 2000000,
            'remaining_amount' => 0,
            'due_date' => '2026-06-10',
            'paid_at' => '2026-06-01 10:00:00',
            'status' => 'paid',
            'payment_method' => 'cash',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.payment-timelines.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/payment-timelines/index')
                ->has('paymentTimelines.data', 2)
                ->where('overallStats.total_count', 2)
                ->where('overallStats.total_planned_amount', '3000000.00')
                ->where('overallStats.total_paid_amount', '2250000.00')
                ->where('overallStats.total_remaining_amount', '750000.00'));
    }

    public function test_admin_can_filter_payment_timelines(): void
    {
        $admin = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);
        $project = Project::create([
            'client_id' => $client->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'project_type' => 'Company Profile',
            'created_by' => $admin->id,
        ]);

        ProjectPaymentTimeline::create([
            'project_id' => $project->id,
            'client_id' => $client->id,
            'type' => 'dp',
            'title' => 'DP 50%',
            'planned_amount' => 1000000,
            'paid_amount' => 0,
            'remaining_amount' => 1000000,
            'due_date' => '2026-05-10',
            'status' => 'waiting',
            'payment_method' => 'bank_transfer',
            'created_by' => $admin->id,
        ]);

        ProjectPaymentTimeline::create([
            'project_id' => $project->id,
            'client_id' => $client->id,
            'type' => 'final_payment',
            'title' => 'Final Payment',
            'planned_amount' => 2000000,
            'paid_amount' => 0,
            'remaining_amount' => 2000000,
            'due_date' => '2026-06-10',
            'status' => 'planned',
            'payment_method' => 'cash',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.payment-timelines.index', [
                'search' => 'DP',
                'status' => 'waiting',
                'type' => 'dp',
                'client_id' => $client->id,
                'project_id' => $project->id,
                'payment_method' => 'bank_transfer',
                'due_from' => '2026-05-01',
                'due_to' => '2026-05-31',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('paymentTimelines.data', 1)
                ->where('paymentTimelines.data.0.title', 'DP 50%')
                ->where('filters.status', 'waiting')
                ->where('filters.type', 'dp')
                ->where('filters.payment_method', 'bank_transfer'));
    }

    public function test_admin_can_sort_payment_timelines(): void
    {
        $admin = User::factory()->create();
        $alphaClient = Client::create(['company_name' => 'Alpha Studio']);
        $zetaClient = Client::create(['company_name' => 'Zeta Commerce']);
        $alphaProject = Project::create([
            'client_id' => $alphaClient->id,
            'name' => 'Alpha Website',
            'slug' => 'alpha-website',
            'project_type' => 'Company Profile',
            'created_by' => $admin->id,
        ]);
        $zetaProject = Project::create([
            'client_id' => $zetaClient->id,
            'name' => 'Zeta Shop',
            'slug' => 'zeta-shop',
            'project_type' => 'E-Commerce',
            'created_by' => $admin->id,
        ]);

        ProjectPaymentTimeline::create([
            'project_id' => $zetaProject->id,
            'client_id' => $zetaClient->id,
            'type' => 'dp',
            'title' => 'Zeta DP',
            'planned_amount' => 3000000,
            'paid_amount' => 0,
            'remaining_amount' => 3000000,
            'due_date' => '2026-06-10',
            'status' => 'waiting',
            'created_by' => $admin->id,
        ]);

        ProjectPaymentTimeline::create([
            'project_id' => $alphaProject->id,
            'client_id' => $alphaClient->id,
            'type' => 'dp',
            'title' => 'Alpha DP',
            'planned_amount' => 1000000,
            'paid_amount' => 0,
            'remaining_amount' => 1000000,
            'due_date' => '2026-05-10',
            'status' => 'waiting',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->get(route('admin.payment-timelines.index', [
                'sort' => 'client',
                'direction' => 'asc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('paymentTimelines.data.0.title', 'Alpha DP')
                ->where('filters.sort', 'client')
                ->where('filters.direction', 'asc'));

        $this->actingAs($admin)
            ->get(route('admin.payment-timelines.index', [
                'sort' => 'due_date',
                'direction' => 'desc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('paymentTimelines.data.0.title', 'Zeta DP'));

        $this->actingAs($admin)
            ->get(route('admin.payment-timelines.index', [
                'sort' => 'planned_amount',
                'direction' => 'asc',
            ]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('paymentTimelines.data.0.title', 'Alpha DP'));
    }

    public function test_admin_can_create_payment_timeline(): void
    {
        $admin = User::factory()->create();
        $client = Client::create(['company_name' => 'Acme Studio']);
        $project = Project::create([
            'client_id' => $client->id,
            'name' => 'Acme Website',
            'slug' => 'acme-website',
            'project_type' => 'Company Profile',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin)
            ->post(route('admin.payment-timelines.store'), [
                'client_id' => $client->id,
                'project_id' => $project->id,
                'type' => 'dp',
                'title' => 'DP 50%',
                'description' => 'Initial payment',
                'sequence_order' => 1,
                'percentage' => 50,
                'planned_amount' => 1000000,
                'paid_amount' => 250000,
                'due_date' => '2026-05-20',
                'paid_at' => '2026-05-18',
                'billing_period_start' => '2026-05-01',
                'billing_period_end' => '2026-05-31',
                'status' => 'partially_paid',
                'payment_method' => 'bank_transfer',
                'reference_number' => 'INV-001',
                'reminder_days_before' => 3,
                'is_additional_charge' => true,
                'admin_notes' => 'Follow up next week',
                'client_notes' => 'Client confirmed',
            ])
            ->assertRedirect(route('admin.payment-timelines.index'));

        $this->assertDatabaseHas('project_payment_timelines', [
            'client_id' => $client->id,
            'project_id' => $project->id,
            'title' => 'DP 50%',
            'planned_amount' => 1000000,
            'paid_amount' => 250000,
            'remaining_amount' => 750000,
            'status' => 'partially_paid',
            'created_by' => $admin->id,
        ]);
    }
}
