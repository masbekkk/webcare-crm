<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\WebsiteCheckLogIndexRequest;
use App\Models\Client;
use App\Models\Project;
use App\Models\WebsiteCheckLog;
use App\Models\WebsiteMonitor;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteCheckLogController extends Controller
{
    public function index(WebsiteCheckLogIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = WebsiteCheckLog::query()
            ->with(['monitor:id,name,url', 'project.client:id,company_name', 'project:id,client_id,name,slug'])
            ->tap(fn (Builder $query) => $this->applyFilters($query, $filters));

        return Inertia::render('admin/website-check-logs/index', [
            'checkLogs' => $query->latest('checked_at')->paginate(10)->withQueryString(),
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
                        ->where('error_type', 'like', "%{$search}%")
                        ->orWhere('error_message', 'like', "%{$search}%")
                        ->orWhereHas('monitor', fn (Builder $query) => $query->where('name', 'like', "%{$search}%")->orWhere('url', 'like', "%{$search}%"));
                });
            })
            ->when($filters['client_id'] ?? null, fn (Builder $query, int $clientId) => $query->whereHas('project', fn (Builder $query) => $query->where('client_id', $clientId)))
            ->when($filters['project_id'] ?? null, fn (Builder $query, int $projectId) => $query->where('project_id', $projectId))
            ->when($filters['monitor_id'] ?? null, fn (Builder $query, int $monitorId) => $query->where('monitor_id', $monitorId))
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when(array_key_exists('is_success', $filters), fn (Builder $query) => $query->where('is_success', (bool) $filters['is_success']))
            ->when($filters['checked_from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('checked_at', '>=', $date))
            ->when($filters['checked_to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('checked_at', '<=', $date));
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
            'is_success' => isset($filters['is_success']) ? (string) (int) $filters['is_success'] : null,
            'checked_from' => $filters['checked_from'] ?? null,
            'checked_to' => $filters['checked_to'] ?? null,
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
            ->selectRaw('SUM(CASE WHEN is_success = 1 THEN 1 ELSE 0 END) as success_count')
            ->selectRaw('SUM(CASE WHEN is_success = 0 THEN 1 ELSE 0 END) as failure_count')
            ->first();

        return [
            'total_count' => (int) $stats->total_count,
            'success_count' => (int) $stats->success_count,
            'failure_count' => (int) $stats->failure_count,
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
