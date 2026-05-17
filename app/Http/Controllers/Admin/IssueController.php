<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\IssueIndexRequest;
use App\Http\Requests\Admin\IssueRequest;
use App\Models\Client;
use App\Models\Issue;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IssueController extends Controller
{
    public function index(IssueIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = Issue::query()
            ->with([
                'client:id,company_name',
                'project:id,name,slug',
                'reporter:id,name',
                'assignee:id,name',
            ])
            ->withCount('attachments')
            ->tap(fn (Builder $query) => $this->applyFilters($query, $filters));

        return Inertia::render('admin/issues/index', [
            'issues' => $query
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'filters' => $this->filters($filters),
            'stats' => $this->stats((clone $query)->withoutEagerLoads()),
            ...$this->options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/issues/create', [
            ...$this->options(),
            'issue' => null,
        ]);
    }

    public function store(IssueRequest $request): RedirectResponse
    {
        $issue = Issue::create([
            ...$request->validated(),
            'reported_by' => $request->user()->id,
        ]);

        return to_route('admin.issues.show', $issue)
            ->with('success', 'Issue created.');
    }

    public function show(Issue $issue): Response
    {
        return Inertia::render('admin/issues/show', [
            'issue' => $issue->load([
                'client:id,company_name',
                'project:id,name,slug',
                'reporter:id,name,email',
                'assignee:id,name,email',
                'attachments.uploader:id,name,email',
            ]),
        ]);
    }

    public function edit(Issue $issue): Response
    {
        return Inertia::render('admin/issues/edit', [
            ...$this->options(),
            'issue' => $issue,
        ]);
    }

    public function update(IssueRequest $request, Issue $issue): RedirectResponse
    {
        $issue->update($request->validated());

        return to_route('admin.issues.show', $issue)
            ->with('success', 'Issue updated.');
    }

    public function destroy(Issue $issue): RedirectResponse
    {
        $issue->delete();

        return to_route('admin.issues.index')
            ->with('success', 'Issue deleted.');
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
                        ->orWhere('resolution_notes', 'like', "%{$search}%")
                        ->orWhereHas('client', fn (Builder $query) => $query->where('company_name', 'like', "%{$search}%"))
                        ->orWhereHas('project', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($filters['client_id'] ?? null, fn (Builder $query, int $clientId) => $query->where('client_id', $clientId))
            ->when($filters['project_id'] ?? null, fn (Builder $query, int $projectId) => $query->where('project_id', $projectId))
            ->when($filters['priority'] ?? null, fn (Builder $query, string $priority) => $query->where('priority', $priority))
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['assigned_to'] ?? null, fn (Builder $query, int $userId) => $query->where('assigned_to', $userId))
            ->when($filters['due_from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('due_date', '>=', $date))
            ->when($filters['due_to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('due_date', '<=', $date));
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
            'priority' => $filters['priority'] ?? null,
            'status' => $filters['status'] ?? null,
            'assigned_to' => isset($filters['assigned_to']) ? (string) $filters['assigned_to'] : null,
            'due_from' => $filters['due_from'] ?? null,
            'due_to' => $filters['due_to'] ?? null,
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
            ->selectRaw("SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count")
            ->selectRaw("SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count")
            ->selectRaw("SUM(CASE WHEN priority IN ('high', 'urgent') THEN 1 ELSE 0 END) as high_priority_count")
            ->first();

        return [
            'total_count' => (int) $stats->total_count,
            'open_count' => (int) $stats->open_count,
            'in_progress_count' => (int) $stats->in_progress_count,
            'high_priority_count' => (int) $stats->high_priority_count,
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
            'users' => User::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'email']),
        ];
    }
}
