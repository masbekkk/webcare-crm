<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectIndexRequest;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(private readonly ProjectService $projects) {}

    public function index(ProjectIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = Project::query()
            ->with(['client:id,company_name', 'creator:id,name'])
            ->withCount(['links', 'members', 'paymentTimelines'])
            ->tap(fn (Builder $query) => $this->applyFilters($query, $filters));
        $stats = $this->stats((clone $query)->withoutEagerLoads());

        return Inertia::render('admin/projects/index', [
            'projects' => $this->applySorting($query, $filters)
                ->paginate(10)
                ->withQueryString(),
            'filters' => $this->filters($filters),
            'stats' => $stats,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/projects/create', [
            ...$this->formOptions(),
            'project' => null,
        ]);
    }

    public function store(ProjectRequest $request): RedirectResponse
    {
        $project = $this->projects->create($request->validated(), $request->user());

        return to_route('admin.projects.edit', $project)
            ->with('success', 'Project created.');
    }

    public function show(Project $project): RedirectResponse
    {
        return to_route('admin.projects.edit', $project);
    }

    public function edit(Project $project): Response
    {
        return Inertia::render('admin/projects/edit', [
            ...$this->formOptions(),
            'project' => $project->load(['links', 'members', 'paymentTimelines']),
        ]);
    }

    public function update(ProjectRequest $request, Project $project): RedirectResponse
    {
        $this->projects->update($project, $request->validated(), $request->user());

        return to_route('admin.projects.edit', $project)
            ->with('success', 'Project updated.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return to_route('admin.projects.index')
            ->with('success', 'Project deleted.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'clients' => Client::query()
                ->orderBy('company_name')
                ->get(['id', 'company_name']),
            'users' => User::query()
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyFilters(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function (Builder $query, string $search): void {
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('projects.name', 'like', "%{$search}%")
                    ->orWhere('projects.slug', 'like', "%{$search}%")
                    ->orWhere('projects.project_type', 'like', "%{$search}%")
                    ->orWhere('projects.status', 'like', "%{$search}%")
                    ->orWhereHas('client', fn (Builder $query) => $query->where('company_name', 'like', "%{$search}%"));
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
            'project' => $query->orderBy('name', $direction),
            'client' => $query
                ->select('projects.*')
                ->leftJoin('clients', 'clients.id', '=', 'projects.client_id')
                ->orderBy('clients.company_name', $direction)
                ->orderBy('projects.name'),
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
            ->selectRaw("SUM(CASE WHEN projects.status = 'live' THEN 1 ELSE 0 END) as live_count")
            ->selectRaw("SUM(CASE WHEN projects.status IN ('planning', 'development', 'testing') THEN 1 ELSE 0 END) as in_progress_count")
            ->selectRaw("SUM(CASE WHEN projects.status IN ('paused', 'cancelled') THEN 1 ELSE 0 END) as blocked_count")
            ->first();

        return [
            'total_count' => (int) $stats->total_count,
            'live_count' => (int) $stats->live_count,
            'in_progress_count' => (int) $stats->in_progress_count,
            'blocked_count' => (int) $stats->blocked_count,
        ];
    }
}
