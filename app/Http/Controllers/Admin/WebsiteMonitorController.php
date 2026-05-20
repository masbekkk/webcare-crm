<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\WebsiteMonitorIndexRequest;
use App\Http\Requests\Admin\WebsiteMonitorRequest;
use App\Models\Client;
use App\Models\Project;
use App\Models\ProjectLink;
use App\Models\WebsiteMonitor;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteMonitorController extends Controller
{
    public function index(WebsiteMonitorIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = WebsiteMonitor::query()
            ->with(['project.client:id,company_name', 'project:id,client_id,name,slug', 'projectLink:id,label,url'])
            ->withCount(['checkLogs', 'incidents'])
            ->tap(fn (Builder $query) => $this->applyFilters($query, $filters));
        $stats = $this->stats((clone $query)->withoutEagerLoads());

        return Inertia::render('admin/monitors/index', [
            'monitors' => $this->applySorting($query, $filters)->paginate(10)->withQueryString(),
            'filters' => $this->filters($filters),
            'stats' => $stats,
            ...$this->options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/monitors/create', [
            ...$this->options(),
            'monitor' => null,
        ]);
    }

    public function store(WebsiteMonitorRequest $request): RedirectResponse
    {
        $monitor = WebsiteMonitor::create([
            ...$request->validated(),
            'is_active' => (bool) $request->boolean('is_active'),
        ]);

        return to_route('admin.monitors.show', $monitor)
            ->with('success', 'Website monitor created.');
    }

    public function show(WebsiteMonitor $monitor): Response
    {
        return Inertia::render('admin/monitors/show', [
            'monitor' => $monitor
                ->loadCount(['checkLogs', 'incidents'])
                ->load([
                    'checkLogs' => fn ($query) => $query
                        ->latest('checked_at')
                        ->limit(10),
                    'project.client:id,company_name',
                    'project:id,client_id,name,slug',
                    'projectLink:id,label,url',
                ]),
        ]);
    }

    public function edit(WebsiteMonitor $monitor): Response
    {
        return Inertia::render('admin/monitors/edit', [
            ...$this->options(),
            'monitor' => $monitor,
        ]);
    }

    public function update(WebsiteMonitorRequest $request, WebsiteMonitor $monitor): RedirectResponse
    {
        $monitor->update([
            ...$request->validated(),
            'is_active' => (bool) $request->boolean('is_active'),
        ]);

        return to_route('admin.monitors.show', $monitor)
            ->with('success', 'Website monitor updated.');
    }

    public function destroy(WebsiteMonitor $monitor): RedirectResponse
    {
        $monitor->delete();

        return to_route('admin.monitors.index')
            ->with('success', 'Website monitor deleted.');
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
                        ->where('website_monitors.name', 'like', "%{$search}%")
                        ->orWhere('website_monitors.url', 'like', "%{$search}%")
                        ->orWhereHas('project', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($filters['client_id'] ?? null, fn (Builder $query, int $clientId) => $query->whereHas('project', fn (Builder $query) => $query->where('client_id', $clientId)))
            ->when($filters['project_id'] ?? null, fn (Builder $query, int $projectId) => $query->where('project_id', $projectId))
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('current_status', $status))
            ->when(array_key_exists('is_active', $filters), fn (Builder $query) => $query->where('is_active', (bool) $filters['is_active']));
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
            'status' => $filters['status'] ?? null,
            'is_active' => isset($filters['is_active']) ? (string) (int) $filters['is_active'] : null,
            'sort' => $filters['sort'] ?? null,
            'direction' => $filters['direction'] ?? null,
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applySorting(Builder $query, array $filters): Builder
    {
        $direction = $filters['direction'] ?? 'asc';

        return match ($filters['sort'] ?? null) {
            'monitor' => $query->orderBy('website_monitors.name', $direction),
            'project' => $query
                ->select('website_monitors.*')
                ->leftJoin('projects', 'projects.id', '=', 'website_monitors.project_id')
                ->orderBy('projects.name', $direction)
                ->orderBy('website_monitors.name'),
            default => $query->latest(),
        };
    }

    /**
     * @return array<string, int>
     */
    private function stats(Builder $query): array
    {
        $stats = $query
            ->toBase()
            ->cloneWithout(['columns', 'orders', 'limit', 'offset'])
            ->cloneWithoutBindings(['select', 'order'])
            ->selectRaw('COUNT(*) as total_count')
            ->selectRaw('SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_count')
            ->selectRaw("SUM(CASE WHEN current_status = 'up' THEN 1 ELSE 0 END) as up_count")
            ->selectRaw("SUM(CASE WHEN current_status = 'down' THEN 1 ELSE 0 END) as down_count")
            ->first();

        return [
            'total_count' => (int) $stats->total_count,
            'active_count' => (int) $stats->active_count,
            'up_count' => (int) $stats->up_count,
            'down_count' => (int) $stats->down_count,
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
            'projectLinks' => ProjectLink::query()->orderBy('label')->get(['id', 'project_id', 'label', 'url']),
        ];
    }
}
