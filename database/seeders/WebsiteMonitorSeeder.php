<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\ProjectLink;
use App\Models\WebsiteMonitor;
use Illuminate\Database\Seeder;

class WebsiteMonitorSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Project::query()->get() as $project) {
            $primaryLink = ProjectLink::query()
                ->where('project_id', $project->id)
                ->where('is_primary', true)
                ->first();

            WebsiteMonitor::updateOrCreate(
                ['project_id' => $project->id, 'name' => "{$project->name} availability"],
                [
                    'project_link_id' => $primaryLink?->id,
                    'url' => $primaryLink?->url ?? "https://{$project->slug}.test",
                    'method' => 'GET',
                    'expected_status_code' => 200,
                    'timeout_seconds' => 10,
                    'check_interval_seconds' => $project->status === 'live' ? 60 : 300,
                    'is_active' => true,
                    'current_status' => $project->status === 'live' ? 'up' : 'unknown',
                    'last_status_code' => $project->status === 'live' ? 200 : null,
                    'last_response_time_ms' => $project->status === 'live' ? 184 : null,
                    'last_checked_at' => $project->status === 'live' ? now()->subMinutes(5) : null,
                    'last_down_at' => null,
                    'last_recovered_at' => $project->status === 'live' ? now()->subWeeks(3) : null,
                    'consecutive_failures' => 0,
                    'consecutive_successes' => $project->status === 'live' ? 18 : 0,
                ],
            );
        }
    }
}
