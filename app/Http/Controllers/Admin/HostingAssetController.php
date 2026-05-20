<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HostingAssetRequest;
use App\Models\Client;
use App\Models\HostingAsset;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HostingAssetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/hosting-assets/index', [
            'hostingAssets' => HostingAsset::query()
                ->with(['client:id,company_name', 'project:id,name'])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/hosting-assets/create', [
            ...$this->formOptions(),
            'hostingAsset' => null,
        ]);
    }

    public function store(HostingAssetRequest $request): RedirectResponse
    {
        $hostingAsset = HostingAsset::create($request->validated());

        return to_route('admin.hosting-assets.edit', $hostingAsset)
            ->with('success', 'Hosting asset created.');
    }

    public function show(HostingAsset $hostingAsset): RedirectResponse
    {
        return to_route('admin.hosting-assets.edit', $hostingAsset);
    }

    public function edit(HostingAsset $hostingAsset): Response
    {
        return Inertia::render('admin/hosting-assets/edit', [
            ...$this->formOptions(),
            'hostingAsset' => $hostingAsset,
        ]);
    }

    public function update(HostingAssetRequest $request, HostingAsset $hostingAsset): RedirectResponse
    {
        $hostingAsset->update($request->validated());

        return to_route('admin.hosting-assets.edit', $hostingAsset)
            ->with('success', 'Hosting asset updated.');
    }

    public function destroy(HostingAsset $hostingAsset): RedirectResponse
    {
        $hostingAsset->delete();

        return to_route('admin.hosting-assets.index')
            ->with('success', 'Hosting asset deleted.');
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
