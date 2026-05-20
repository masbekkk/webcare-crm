<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->clients() as $attributes) {
            Client::updateOrCreate(
                ['company_name' => $attributes['company_name']],
                $attributes,
            );
        }
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function clients(): array
    {
        return [
            [
                'company_name' => 'Shayda',
                'display_name' => 'Shayda',
                'pic_name' => 'Shayda Admin',
                'pic_position' => 'Website Owner',
                'pic_email' => 'admin@shayda.webcareproject.my.id',
                'pic_phone' => null,
                'pic_whatsapp' => null,
                'company_email' => 'hello@shayda.webcareproject.my.id',
                'company_phone' => null,
                'address' => null,
                'city' => null,
                'province' => null,
                'status' => 'active',
                'notes' => 'Production website hosted at shayda.webcareproject.my.id.',
            ],
            [
                'company_name' => 'Anemi',
                'display_name' => 'Anemi',
                'pic_name' => 'Anemi Admin',
                'pic_position' => 'Website Owner',
                'pic_email' => 'admin@anemi.webcareproject.my.id',
                'pic_phone' => null,
                'pic_whatsapp' => null,
                'company_email' => 'hello@anemi.webcareproject.my.id',
                'company_phone' => null,
                'address' => null,
                'city' => null,
                'province' => null,
                'status' => 'active',
                'notes' => 'Production website hosted at anemi.webcareproject.my.id.',
            ],
            [
                'company_name' => 'Webcare Intern',
                'display_name' => 'Intern Portal',
                'pic_name' => 'Webcare Team',
                'pic_position' => 'Internal Owner',
                'pic_email' => 'admin@intern.webcareproject.my.id',
                'pic_phone' => null,
                'pic_whatsapp' => null,
                'company_email' => 'hello@intern.webcareproject.my.id',
                'company_phone' => null,
                'address' => null,
                'city' => null,
                'province' => null,
                'status' => 'active',
                'notes' => 'Internal website hosted at intern.webcareproject.my.id.',
            ],
        ];
    }
}
