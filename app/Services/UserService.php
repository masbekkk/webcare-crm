<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Arr;

class UserService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): User
    {
        return User::create($this->userAttributes($data));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(User $user, array $data): User
    {
        $user->update($this->userAttributes($data));

        return $user->refresh();
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function userAttributes(array $data): array
    {
        $attributes = Arr::only($data, [
            'client_id',
            'name',
            'email',
            'password',
            'role',
            'phone',
            'is_active',
        ]);

        if (($attributes['role'] ?? null) === 'admin') {
            $attributes['client_id'] = null;
        }

        if (blank($attributes['password'] ?? null)) {
            unset($attributes['password']);
        }

        $attributes['is_active'] = $attributes['is_active'] ?? false;

        return $attributes;
    }
}
