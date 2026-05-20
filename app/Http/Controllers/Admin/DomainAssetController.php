<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DomainAssetRequest;
use App\Models\Client;
use App\Models\DomainAsset;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DomainAssetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/domain-assets/index', [
            'domainAssets' => DomainAsset::query()
                ->with(['client:id,company_name', 'project:id,name'])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/domain-assets/create', [
            ...$this->formOptions(),
            'domainAsset' => null,
        ]);
    }

    public function store(DomainAssetRequest $request): RedirectResponse
    {
        $domainAsset = DomainAsset::create($request->validated());

        return to_route('admin.domain-assets.edit', $domainAsset)
            ->with('success', 'Domain asset created.');
    }

    public function show(DomainAsset $domainAsset): RedirectResponse
    {
        return to_route('admin.domain-assets.edit', $domainAsset);
    }

    public function edit(DomainAsset $domainAsset): Response
    {
        return Inertia::render('admin/domain-assets/edit', [
            ...$this->formOptions(),
            'domainAsset' => $domainAsset,
        ]);
    }

    public function update(DomainAssetRequest $request, DomainAsset $domainAsset): RedirectResponse
    {
        $domainAsset->update($request->validated());

        return to_route('admin.domain-assets.edit', $domainAsset)
            ->with('success', 'Domain asset updated.');
    }

    public function destroy(DomainAsset $domainAsset): RedirectResponse
    {
        $domainAsset->delete();

        return to_route('admin.domain-assets.index')
            ->with('success', 'Domain asset deleted.');
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
            'projects' => Project::query()
                ->orderBy('name')
                ->get(['id', 'client_id', 'name']),
        ];
    }
}
