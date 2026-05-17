<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectLinkIndexRequest;
use App\Models\ProjectLink;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;
use Inertia\Response;

class ProjectLinkController extends Controller
{
    public function index(ProjectLinkIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = ProjectLink::query()
            ->with(['project:id,client_id,name,slug', 'project.client:id,company_name'])
            ->tap(fn (Builder $query) => $this->applyFilters($query, $filters));
        $stats = $this->stats((clone $query)->withoutEagerLoads());

        return Inertia::render('admin/project-links/index', [
            'projectLinks' => $this->applySorting($query, $filters)
                ->paginate(10)
                ->withQueryString(),
            'filters' => $this->filters($filters),
            'stats' => $stats,
        ]);
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function (Builder $query, string $search): void {
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('project_links.label', 'like', "%{$search}%")
                    ->orWhere('project_links.url', 'like', "%{$search}%")
                    ->orWhere('project_links.type', 'like', "%{$search}%")
                    ->orWhere('project_links.username', 'like', "%{$search}%")
                    ->orWhereHas('project', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('project.client', fn (Builder $query) => $query->where('company_name', 'like', "%{$search}%"));
            });
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applySorting(Builder $query, array $filters): Builder
    {
        $direction = $filters['direction'] ?? 'asc';

        return match ($filters['sort'] ?? null) {
            'project' => $query
                ->select('project_links.*')
                ->leftJoin('projects', 'projects.id', '=', 'project_links.project_id')
                ->orderBy('projects.name', $direction)
                ->orderBy('project_links.label'),
            'client' => $query
                ->select('project_links.*')
                ->leftJoin('projects', 'projects.id', '=', 'project_links.project_id')
                ->leftJoin('clients', 'clients.id', '=', 'projects.client_id')
                ->orderBy('clients.company_name', $direction)
                ->orderBy('projects.name')
                ->orderBy('project_links.label'),
            default => $query->latest(),
        };
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, string|null>
     */
    private function filters(array $filters): array
    {
        return [
            'search' => $filters['search'] ?? null,
            'sort' => $filters['sort'] ?? null,
            'direction' => $filters['direction'] ?? null,
        ];
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
            ->selectRaw('SUM(CASE WHEN is_primary = 1 THEN 1 ELSE 0 END) as primary_count')
            ->selectRaw('SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_count')
            ->first();

        return [
            'total_count' => (int) $stats->total_count,
            'active_count' => (int) $stats->active_count,
            'primary_count' => (int) $stats->primary_count,
            'inactive_count' => (int) $stats->inactive_count,
        ];
    }
}
