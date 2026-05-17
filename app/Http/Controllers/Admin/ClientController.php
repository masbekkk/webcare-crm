<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ClientIndexRequest;
use App\Http\Requests\Admin\ClientRequest;
use App\Models\Client;
use App\Models\User;
use App\Services\ClientService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function __construct(private readonly ClientService $clients) {}

    public function index(ClientIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = Client::query()
            ->withCount(['users', 'projects'])
            ->tap(fn (Builder $query) => $this->applyIndexFilters($query, $filters))
            ->tap(fn (Builder $query) => $this->applyIndexSort($query, $filters));

        return Inertia::render('admin/clients/index', [
            'clients' => $query
                ->paginate(10)
                ->withQueryString(),
            'filters' => $this->indexFilters($filters),
            'stats' => $this->indexStats(),
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

    public function show(Client $client): Response
    {
        return Inertia::render('admin/clients/show', [
            'client' => $client
                ->loadCount(['users', 'projects'])
                ->load([
                    'users:id,client_id,name,email,phone,is_active,role,last_login_at',
                    'projects' => fn ($query) => $query
                        ->withCount(['members', 'paymentTimelines', 'issues'])
                        ->with(['members.user:id,name,email,role'])
                        ->latest()
                        ->select([
                            'id',
                            'client_id',
                            'name',
                            'slug',
                            'description',
                            'project_type',
                            'contract_value',
                            'payment_model',
                            'status',
                            'start_date',
                            'target_finish_date',
                            'live_date',
                        ]),
                ]),
        ]);
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

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyIndexFilters(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function (Builder $query, string $search): void {
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('company_name', 'like', "%{$search}%")
                    ->orWhere('display_name', 'like', "%{$search}%")
                    ->orWhere('pic_name', 'like', "%{$search}%")
                    ->orWhere('pic_email', 'like', "%{$search}%")
                    ->orWhere('company_email', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('province', 'like', "%{$search}%");
            });
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyIndexSort(Builder $query, array $filters): void
    {
        $direction = $filters['direction'] ?? 'asc';

        match ($filters['sort'] ?? 'client') {
            'pic' => $query->orderBy('pic_name', $direction)->orderBy('company_name'),
            default => $query->orderBy('company_name', $direction)->orderBy('id'),
        };
    }

    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, string>
     */
    private function indexFilters(array $filters): array
    {
        return [
            'search' => $filters['search'] ?? '',
            'sort' => $filters['sort'] ?? 'client',
            'direction' => $filters['direction'] ?? 'asc',
        ];
    }

    /**
     * @return array<string, int>
     */
    private function indexStats(): array
    {
        return [
            'total_count' => Client::query()->count(),
            'active_count' => Client::query()->where('status', 'active')->count(),
            'prospect_count' => Client::query()->where('status', 'prospect')->count(),
            'client_user_count' => User::query()->where('role', 'client')->count(),
        ];
    }
}
