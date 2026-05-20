<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\WebsiteIncidentIndexRequest;
use App\Models\Client;
use App\Models\Project;
use App\Models\WebsiteIncident;
use App\Models\WebsiteMonitor;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteIncidentController extends Controller
{
    public function index(WebsiteIncidentIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = WebsiteIncident::query()
            ->with(['monitor:id,name,url', 'project.client:id,company_name', 'project:id,client_id,name,slug'])
            ->tap(fn (Builder $query) => $this->applyFilters($query, $filters));

        return Inertia::render('admin/website-incidents/index', [
            'incidents' => $query->latest('started_at')->paginate(10)->withQueryString(),
            'filters' => $this->filters($filters),
            'stats' => $this->stats((clone $query)->withoutEagerLoads()),
            ...$this->options(),
        ]);
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
                        ->where('reason', 'like', "%{$search}%")
                        ->orWhere('first_error_message', 'like', "%{$search}%")
                        ->orWhere('last_error_message', 'like', "%{$search}%")
                        ->orWhereHas('monitor', fn (Builder $query) => $query->where('name', 'like', "%{$search}%")->orWhere('url', 'like', "%{$search}%"));
                });
            })
            ->when($filters['client_id'] ?? null, fn (Builder $query, int $clientId) => $query->whereHas('project', fn (Builder $query) => $query->where('client_id', $clientId)))
            ->when($filters['project_id'] ?? null, fn (Builder $query, int $projectId) => $query->where('project_id', $projectId))
            ->when($filters['monitor_id'] ?? null, fn (Builder $query, int $monitorId) => $query->where('monitor_id', $monitorId))
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['started_from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('started_at', '>=', $date))
            ->when($filters['started_to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('started_at', '<=', $date));
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, string|null>
     */
    private function filters(array $filters): array
    {
        return [
            'search' => $filters['search'] ?? null,
            'client_id' => isset($filters['client_id']) ? (string) $filters['client_id'] : null,
            'project_id' => isset($filters['project_id']) ? (string) $filters['project_id'] : null,
            'monitor_id' => isset($filters['monitor_id']) ? (string) $filters['monitor_id'] : null,
            'status' => $filters['status'] ?? null,
            'started_from' => $filters['started_from'] ?? null,
            'started_to' => $filters['started_to'] ?? null,
        ];
    }

    /**
     * @return array<string, int>
     */
    private function stats(Builder $query): array
    {
        $stats = $query
            ->toBase()
            ->selectRaw('COUNT(*) as total_count')
            ->selectRaw("SUM(CASE WHEN status = 'ongoing' THEN 1 ELSE 0 END) as ongoing_count")
            ->selectRaw("SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count")
            ->first();

        return [
            'total_count' => (int) $stats->total_count,
            'ongoing_count' => (int) $stats->ongoing_count,
            'resolved_count' => (int) $stats->resolved_count,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function options(): array
    {
        return [
            'clients' => Client::query()->orderBy('company_name')->get(['id', 'company_name']),
            'projects' => Project::query()->orderBy('name')->get(['id', 'client_id', 'name']),
            'monitors' => WebsiteMonitor::query()->orderBy('name')->get(['id', 'project_id', 'name']),
        ];
    }
}
