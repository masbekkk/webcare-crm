<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(private readonly ProjectService $projects) {}

    public function index(): Response
    {
        return Inertia::render('admin/projects/index', [
            'projects' => Project::query()
                ->with(['client:id,company_name', 'creator:id,name'])
                ->withCount(['links', 'members', 'paymentTimelines'])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
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
}
