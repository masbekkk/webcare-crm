<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->teamUsers() as $attributes) {
            User::updateOrCreate(
                ['email' => $attributes['email']],
                [
                    ...$attributes,
                    'client_id' => null,
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'is_active' => true,
                ],
            );
        }

        foreach ($this->clientUsers() as $attributes) {
            $client = Client::query()
                ->where('company_name', $attributes['company_name'])
                ->firstOrFail();

            User::updateOrCreate(
                ['email' => $attributes['email']],
                [
                    'client_id' => $client->id,
                    'name' => $attributes['name'],
                    'password' => Hash::make('password'),
                    'role' => 'client',
                    'phone' => $attributes['phone'],
                    'email_verified_at' => now(),
                    'is_active' => true,
                    'last_login_at' => now()->subDays(3),
                ],
            );
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function teamUsers(): array
    {
        return [
            [
                'name' => 'Ian Webcare',
                'email' => 'ian@webcare.test',
                'phone' => '0812-1000-0001',
                'role' => 'admin',
                'last_login_at' => now()->subMinutes(20),
            ],
            [
                'name' => 'Rani Project Manager',
                'email' => 'rani@webcare.test',
                'phone' => '0812-1000-0002',
                'role' => 'admin',
                'last_login_at' => now()->subHours(2),
            ],
            [
                'name' => 'Dimas Fullstack Developer',
                'email' => 'dimas@webcare.test',
                'phone' => '0812-1000-0003',
                'role' => 'admin',
                'last_login_at' => now()->subDay(),
            ],
            [
                'name' => 'Sinta Support Engineer',
                'email' => 'sinta@webcare.test',
                'phone' => '0812-1000-0004',
                'role' => 'admin',
                'last_login_at' => now()->subDays(2),
            ],
        ];
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function clientUsers(): array
    {
        return [
            [
                'company_name' => 'PT Kopi Senja Nusantara',
                'name' => 'Bima Pratama',
                'email' => 'portal@kopisenja.test',
                'phone' => '0813-2233-4401',
            ],
            [
                'company_name' => 'CV Alika Fashion Indonesia',
                'name' => 'Nadia Lestari',
                'email' => 'portal@alikafashion.test',
                'phone' => '0812-8844-5502',
            ],
            [
                'company_name' => 'Klinik Medika Pratama',
                'name' => 'Admin Medika',
                'email' => 'portal@medikapratama.test',
                'phone' => '0811-9000-3303',
            ],
        ];
    }
}
