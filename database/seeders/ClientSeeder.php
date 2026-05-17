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
                'company_name' => 'PT Kopi Senja Nusantara',
                'display_name' => 'Kopi Senja',
                'pic_name' => 'Bima Pratama',
                'pic_position' => 'Owner',
                'pic_email' => 'bima@kopisenja.test',
                'pic_phone' => '0813-2233-4401',
                'pic_whatsapp' => '0813-2233-4401',
                'company_email' => 'hello@kopisenja.test',
                'company_phone' => '021-7788-1020',
                'address' => 'Jl. Kemang Raya No. 21',
                'city' => 'Jakarta Selatan',
                'province' => 'DKI Jakarta',
                'status' => 'active',
                'notes' => 'Retail coffee brand with weekly promo updates.',
            ],
            [
                'company_name' => 'CV Alika Fashion Indonesia',
                'display_name' => 'Alika Fashion',
                'pic_name' => 'Nadia Lestari',
                'pic_position' => 'Marketing Lead',
                'pic_email' => 'nadia@alikafashion.test',
                'pic_phone' => '0812-8844-5502',
                'pic_whatsapp' => '0812-8844-5502',
                'company_email' => 'support@alikafashion.test',
                'company_phone' => '022-6060-1100',
                'address' => 'Jl. Trunojoyo No. 8',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'status' => 'active',
                'notes' => 'E-commerce client with seasonal catalog releases.',
            ],
            [
                'company_name' => 'Klinik Medika Pratama',
                'display_name' => 'Medika Pratama',
                'pic_name' => 'dr. Arif Wibowo',
                'pic_position' => 'Clinic Director',
                'pic_email' => 'arif@medikapratama.test',
                'pic_phone' => '0811-9000-3303',
                'pic_whatsapp' => '0811-9000-3303',
                'company_email' => 'admin@medikapratama.test',
                'company_phone' => '031-5012-7788',
                'address' => 'Jl. Diponegoro No. 14',
                'city' => 'Surabaya',
                'province' => 'Jawa Timur',
                'status' => 'active',
                'notes' => 'Clinic booking system with appointment reminders.',
            ],
        ];
    }
}
