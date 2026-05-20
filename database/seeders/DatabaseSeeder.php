<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed realistic demo data for active CRM tables.
     */
    public function run(): void
    {
        $this->call([
            ClientSeeder::class,
            UserSeeder::class,
            ProjectSeeder::class,
            ProjectLinkSeeder::class,
            ProjectMemberSeeder::class,
            ProjectPaymentTimelineSeeder::class,
            WebsiteMonitorSeeder::class,
            DomainAssetSeeder::class,
            HostingAssetSeeder::class,
        ]);
    }
}
