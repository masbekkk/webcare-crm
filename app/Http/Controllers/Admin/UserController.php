<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserIndexRequest;
use App\Http\Requests\Admin\UserRequest;
use App\Models\Client;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $users) {}

    public function index(UserIndexRequest $request): Response
    {
        $filters = $request->validated();
        $query = User::query()
            ->with('client:id,company_name')
            ->tap(fn (Builder $query) => $this->applyIndexFilters($query, $filters))
            ->tap(fn (Builder $query) => $this->applyIndexSort($query, $filters));

        return Inertia::render('admin/users/index', [
            'users' => $query
                ->paginate(10)
                ->withQueryString(),
            'filters' => $this->indexFilters($filters),
            'stats' => $this->indexStats(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            ...$this->formOptions(),
            'user' => null,
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $user = $this->users->create($request->validated());

        return to_route('admin.users.edit', $user)
            ->with('success', 'User created.');
    }

    public function show(User $user): RedirectResponse
    {
        return to_route('admin.users.edit', $user);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/users/edit', [
            ...$this->formOptions(),
            'user' => $user->load('client:id,company_name'),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $this->users->update($user, $request->validated());

        return to_route('admin.users.edit', $user)
            ->with('success', 'User updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_if(request()->user()->is($user), 422, 'You cannot delete your own account.');

        $user->delete();

        return to_route('admin.users.index')
            ->with('success', 'User deleted.');
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
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyIndexFilters(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function (Builder $query, string $search): void {
            $query->where(function (Builder $query) use ($search): void {
                $query
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%")
                    ->orWhereHas('client', fn (Builder $query) => $query->where('company_name', 'like', "%{$search}%"));
            });
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function applyIndexSort(Builder $query, array $filters): void
    {
        if (! array_key_exists('sort', $filters)) {
            $query->latest('id');

            return;
        }

        $direction = $filters['direction'] ?? 'asc';

        match ($filters['sort']) {
            'client' => $query
                ->orderBy(
                    Client::query()
                        ->select('company_name')
                        ->whereColumn('clients.id', 'users.client_id'),
                    $direction
                )
                ->orderBy('name'),
            default => $query->orderBy('name', $direction)->orderBy('id'),
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
            'sort' => $filters['sort'] ?? 'user',
            'direction' => $filters['direction'] ?? 'asc',
        ];
    }

    /**
     * @return array<string, int>
     */
    private function indexStats(): array
    {
        return [
            'total_count' => User::query()->count(),
            'active_count' => User::query()->where('is_active', true)->count(),
            'admin_count' => User::query()->where('role', 'admin')->count(),
            'client_count' => User::query()->where('role', 'client')->count(),
        ];
    }
}
