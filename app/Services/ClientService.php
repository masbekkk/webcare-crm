<?php

namespace App\Services;

use App\Models\Client;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ClientService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Client
    {
        return DB::transaction(function () use ($data): Client {
            $client = Client::create($this->clientAttributes($data));
            $this->syncUsers($client, $data['users'] ?? []);

            return $client->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Client $client, array $data): Client
    {
        return DB::transaction(function () use ($client, $data): Client {
            $client->update($this->clientAttributes($data));
            $this->syncUsers($client, $data['users'] ?? []);

            return $client->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function clientAttributes(array $data): array
    {
        return Arr::only($data, [
            'company_name',
            'display_name',
            'pic_name',
            'pic_position',
            'pic_email',
            'pic_phone',
            'pic_whatsapp',
            'company_email',
            'company_phone',
            'address',
            'city',
            'province',
            'status',
            'notes',
        ]);
    }

    /**
     * @param  array<int, array<string, mixed>>  $users
     */
    private function syncUsers(Client $client, array $users): void
    {
        $keptIds = collect($users)
            ->pluck('id')
            ->filter()
            ->map(fn (mixed $id): int => (int) $id)
            ->all();

        $client->users()
            ->when($keptIds !== [], fn ($query) => $query->whereNotIn('id', $keptIds))
            ->delete();

        foreach ($users as $userData) {
            $attributes = [
                'name' => $userData['name'],
                'email' => $userData['email'],
                'phone' => $userData['phone'] ?? null,
                'is_active' => $userData['is_active'] ?? true,
                'role' => 'client',
            ];

            if (! empty($userData['password'])) {
                $attributes['password'] = $userData['password'];
            }

            if (! empty($userData['id'])) {
                $client->users()
                    ->whereKey($userData['id'])
                    ->firstOrFail()
                    ->update($attributes);

                continue;
            }

            $client->users()->create($attributes);
        }
    }
}
