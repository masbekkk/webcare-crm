<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PaymentTimelineIndexRequest;
use App\Http\Requests\Admin\PaymentTimelineStoreRequest;
use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectPaymentTimeline;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentTimelineController extends Controller
{
    public function index(PaymentTimelineIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = ProjectPaymentTimeline::query()
            ->with(['client:id,company_name', 'project:id,name,slug'])
            ->tap(fn (Builder $query) => $this->applyFilters($query, $filters));
        $paymentTimelines = (clone $query)
            ->tap(fn (Builder $query) => $this->applySorting($query, $filters))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/payment-timelines/index', [
            'paymentTimelines' => $paymentTimelines,
            'filters' => $this->filters($filters),
            'overallStats' => $this->stats(ProjectPaymentTimeline::query()),
            'filteredStats' => $this->stats((clone $query)->withoutEagerLoads()),
            'clients' => Client::query()
                ->orderBy('company_name')
                ->get(['id', 'company_name']),
            'projects' => Project::query()
                ->orderBy('name')
                ->get(['id', 'client_id', 'name']),
        ]);
    }

    public function store(PaymentTimelineStoreRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $plannedAmount = (float) $data['planned_amount'];
        $paidAmount = (float) $data['paid_amount'];

        ProjectPaymentTimeline::create([
            ...$data,
            'remaining_amount' => max($plannedAmount - $paidAmount, 0),
            'is_additional_charge' => (bool) ($data['is_additional_charge'] ?? false),
            'created_by' => $request->user()->id,
        ]);

        return to_route('admin.payment-timelines.index');
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        $query
            ->when($filters['search'] ?? null, function (Builder $query, string $search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('reference_number', 'like', "%{$search}%")
                        ->orWhereHas('project', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"))
                        ->orWhereHas('client', fn (Builder $query) => $query->where('company_name', 'like', "%{$search}%"));
                });
            })
            ->when($filters['client_id'] ?? null, fn (Builder $query, int $clientId) => $query->where('client_id', $clientId))
            ->when($filters['project_id'] ?? null, fn (Builder $query, int $projectId) => $query->where('project_id', $projectId))
            ->when($filters['type'] ?? null, fn (Builder $query, string $type) => $query->where('type', $type))
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['payment_method'] ?? null, fn (Builder $query, string $method) => $query->where('payment_method', $method))
            ->when($filters['due_from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('due_date', '>=', $date))
            ->when($filters['due_to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('due_date', '<=', $date))
            ->when($filters['paid_from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('paid_at', '>=', $date))
            ->when($filters['paid_to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('paid_at', '<=', $date))
            ->when($filters['billing_from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('billing_period_start', '>=', $date))
            ->when($filters['billing_to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('billing_period_end', '<=', $date))
            ->when(array_key_exists('is_additional_charge', $filters), fn (Builder $query) => $query->where('is_additional_charge', (bool) $filters['is_additional_charge']));
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applySorting(Builder $query, array $filters): void
    {
        if (($filters['sort'] ?? null) === 'client') {
            $query
                ->join('clients', 'clients.id', '=', 'project_payment_timelines.client_id')
                ->orderBy('clients.company_name', $this->sortDirection($filters))
                ->select('project_payment_timelines.*');

            return;
        }

        $query->orderBy(
            $filters['sort'] ?? 'due_date',
            $this->sortDirection($filters),
        );
    }

    /**
     * @return array<string, string|null>
     */
    private function filters(array $filters): array
    {
        return [
            'search' => $filters['search'] ?? null,
            'client_id' => isset($filters['client_id']) ? (string) $filters['client_id'] : null,
            'project_id' => isset($filters['project_id']) ? (string) $filters['project_id'] : null,
            'type' => $filters['type'] ?? null,
            'status' => $filters['status'] ?? null,
            'payment_method' => $filters['payment_method'] ?? null,
            'due_from' => $filters['due_from'] ?? null,
            'due_to' => $filters['due_to'] ?? null,
            'paid_from' => $filters['paid_from'] ?? null,
            'paid_to' => $filters['paid_to'] ?? null,
            'billing_from' => $filters['billing_from'] ?? null,
            'billing_to' => $filters['billing_to'] ?? null,
            'is_additional_charge' => isset($filters['is_additional_charge']) ? (string) (int) $filters['is_additional_charge'] : null,
            'sort' => $filters['sort'] ?? 'due_date',
            'direction' => $filters['direction'] ?? 'desc',
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function sortDirection(array $filters): string
    {
        return ($filters['direction'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
    }

    /**
     * @return array<string, mixed>
     */
    private function stats(Builder $query): array
    {
        $stats = $query
            ->toBase()
            ->selectRaw('COUNT(*) as total_count')
            ->selectRaw('COALESCE(SUM(planned_amount), 0) as total_planned_amount')
            ->selectRaw('COALESCE(SUM(paid_amount), 0) as total_paid_amount')
            ->selectRaw('COALESCE(SUM(remaining_amount), 0) as total_remaining_amount')
            ->selectRaw("SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_count")
            ->selectRaw("SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_count")
            ->first();

        return [
            'total_count' => (int) $stats->total_count,
            'total_planned_amount' => number_format((float) $stats->total_planned_amount, 2, '.', ''),
            'total_paid_amount' => number_format((float) $stats->total_paid_amount, 2, '.', ''),
            'total_remaining_amount' => number_format((float) $stats->total_remaining_amount, 2, '.', ''),
            'paid_count' => (int) $stats->paid_count,
            'overdue_count' => (int) $stats->overdue_count,
        ];
    }
}
