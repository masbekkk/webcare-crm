<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\DomainAsset;
use App\Models\HostingAsset;
use App\Models\Issue;
use App\Models\MaintenanceLog;
use App\Models\Project;
use App\Models\ProjectPaymentTimeline;
use App\Models\WebsiteIncident;
use App\Models\WebsiteMonitor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('dashboard', [
            'summary' => $this->summary(),
            'finance' => $this->finance(),
            'monitoring' => $this->monitoring(),
            'projectStatus' => $this->projectStatus(),
            'recentIssues' => $this->recentIssues(),
            'upcomingPayments' => $this->upcomingPayments(),
            'expiringAssets' => $this->expiringAssets(),
            'maintenanceSchedule' => $this->maintenanceSchedule(),
        ]);
    }

    /**
     * @return array<string, int>
     */
    private function summary(): array
    {
        return [
            'clients' => Client::query()->count(),
            'projects' => Project::query()->count(),
            'active_projects' => Project::query()
                ->whereIn('status', ['in_progress', 'active', 'maintenance'])
                ->count(),
            'open_issues' => Issue::query()
                ->whereNotIn('status', ['resolved', 'closed', 'cancelled'])
                ->count(),
            'monitors_down' => WebsiteMonitor::query()
                ->where('current_status', 'down')
                ->count(),
        ];
    }

    /**
     * @return array<string, string|int>
     */
    private function finance(): array
    {
        $stats = ProjectPaymentTimeline::query()
            ->toBase()
            ->selectRaw('COUNT(*) as total_count')
            ->selectRaw('COALESCE(SUM(planned_amount), 0) as planned_amount')
            ->selectRaw('COALESCE(SUM(paid_amount), 0) as paid_amount')
            ->selectRaw('COALESCE(SUM(remaining_amount), 0) as remaining_amount')
            ->selectRaw("SUM(CASE WHEN status = 'overdue' THEN 1 ELSE 0 END) as overdue_count")
            ->first();

        return [
            'payment_items' => (int) $stats->total_count,
            'planned_amount' => number_format((float) $stats->planned_amount, 2, '.', ''),
            'paid_amount' => number_format((float) $stats->paid_amount, 2, '.', ''),
            'remaining_amount' => number_format((float) $stats->remaining_amount, 2, '.', ''),
            'overdue_count' => (int) $stats->overdue_count,
        ];
    }

    /**
     * @return array<string, int>
     */
    private function monitoring(): array
    {
        return [
            'monitors' => WebsiteMonitor::query()->count(),
            'active_monitors' => WebsiteMonitor::query()->where('is_active', true)->count(),
            'monitors_up' => WebsiteMonitor::query()->where('current_status', 'up')->count(),
            'monitors_down' => WebsiteMonitor::query()->where('current_status', 'down')->count(),
            'ongoing_incidents' => WebsiteIncident::query()->where('status', 'ongoing')->count(),
        ];
    }

    /**
     * @return array<int, array{status: string, count: int}>
     */
    private function projectStatus(): array
    {
        return Project::query()
            ->toBase()
            ->select('status')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('status')
            ->orderByDesc('count')
            ->get()
            ->map(fn (object $row): array => [
                'status' => (string) $row->status,
                'count' => (int) $row->count,
            ])
            ->all();
    }

    /**
     * @return Collection<int, Issue>
     */
    private function recentIssues()
    {
        return Issue::query()
            ->with(['client:id,company_name', 'project:id,name'])
            ->whereNotIn('status', ['resolved', 'closed', 'cancelled'])
            ->latest()
            ->limit(5)
            ->get([
                'id',
                'client_id',
                'project_id',
                'title',
                'priority',
                'status',
                'due_date',
                'created_at',
            ]);
    }

    /**
     * @return Collection<int, ProjectPaymentTimeline>
     */
    private function upcomingPayments()
    {
        return ProjectPaymentTimeline::query()
            ->with(['client:id,company_name', 'project:id,name'])
            ->whereNotIn('status', ['paid', 'cancelled'])
            ->orderByRaw('due_date IS NULL, due_date ASC')
            ->limit(5)
            ->get([
                'id',
                'client_id',
                'project_id',
                'title',
                'planned_amount',
                'paid_amount',
                'remaining_amount',
                'due_date',
                'status',
            ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function expiringAssets(): array
    {
        $cutoff = Carbon::now()->addDays(45)->toDateString();

        $domains = DomainAsset::query()
            ->with(['client:id,company_name', 'project:id,name'])
            ->whereDate('expired_at', '<=', $cutoff)
            ->orderBy('expired_at')
            ->limit(5)
            ->get(['id', 'client_id', 'project_id', 'domain_name', 'registrar', 'expired_at'])
            ->map(fn (DomainAsset $asset): array => [
                'id' => $asset->id,
                'type' => 'domain',
                'name' => $asset->domain_name,
                'provider' => $asset->registrar,
                'expired_at' => $asset->expired_at,
                'client' => $asset->client,
                'project' => $asset->project,
            ]);

        $hosting = HostingAsset::query()
            ->with(['client:id,company_name', 'project:id,name'])
            ->whereDate('expired_at', '<=', $cutoff)
            ->orderBy('expired_at')
            ->limit(5)
            ->get(['id', 'client_id', 'project_id', 'provider', 'service_name', 'expired_at'])
            ->map(fn (HostingAsset $asset): array => [
                'id' => $asset->id,
                'type' => 'hosting',
                'name' => $asset->service_name ?? $asset->provider,
                'provider' => $asset->provider,
                'expired_at' => $asset->expired_at,
                'client' => $asset->client,
                'project' => $asset->project,
            ]);

        return $domains
            ->merge($hosting)
            ->sortBy('expired_at')
            ->take(6)
            ->values()
            ->all();
    }

    /**
     * @return Collection<int, MaintenanceLog>
     */
    private function maintenanceSchedule()
    {
        return MaintenanceLog::query()
            ->with(['project:id,name', 'handler:id,name'])
            ->where(function (Builder $query): void {
                $query
                    ->whereNull('completed_at')
                    ->orWhere('status', '!=', 'completed');
            })
            ->orderByRaw('scheduled_at IS NULL, scheduled_at ASC')
            ->limit(5)
            ->get([
                'id',
                'project_id',
                'title',
                'status',
                'scheduled_at',
                'handled_by',
            ]);
    }
}
