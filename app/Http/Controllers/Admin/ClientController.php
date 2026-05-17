<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClientRequest;
use App\Models\Client;
use App\Services\ClientService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function __construct(private readonly ClientService $clients) {}

    public function index(): Response
    {
        return Inertia::render('admin/clients/index', [
            'clients' => Client::query()
                ->withCount(['users', 'projects'])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/clients/create', [
            'client' => null,
        ]);
    }

    public function store(ClientRequest $request): RedirectResponse
    {
        $client = $this->clients->create($request->validated());

        return to_route('admin.clients.edit', $client)
            ->with('success', 'Client created.');
    }

    public function show(Client $client): RedirectResponse
    {
        return to_route('admin.clients.edit', $client);
    }

    public function edit(Client $client): Response
    {
        return Inertia::render('admin/clients/edit', [
            'client' => $client->load('users:id,client_id,name,email,phone,is_active,role'),
        ]);
    }

    public function update(ClientRequest $request, Client $client): RedirectResponse
    {
        $this->clients->update($client, $request->validated());

        return to_route('admin.clients.edit', $client)
            ->with('success', 'Client updated.');
    }

    public function destroy(Client $client): RedirectResponse
    {
        $client->delete();

        return to_route('admin.clients.index')
            ->with('success', 'Client deleted.');
    }
}
