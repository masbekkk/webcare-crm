<?php

namespace App\Console\Commands;

use App\Jobs\CheckWebsiteMonitorJob;
use App\Models\WebsiteMonitor;
use Illuminate\Console\Command;

class DispatchDueWebsiteMonitorChecksCommand extends Command
{
    protected $signature = 'monitors:dispatch-due-checks';

    protected $description = 'Dispatch queued jobs for website monitors that are due for checking.';

    public function handle(): int
    {
        $dispatched = 0;

        WebsiteMonitor::query()
            ->where('is_active', true)
            ->select(['id', 'last_checked_at', 'check_interval_seconds'])
            ->orderBy('id')
            ->chunkById(100, function ($monitors) use (&$dispatched): void {
                $monitors
                    ->filter(fn (WebsiteMonitor $monitor): bool => $monitor->last_checked_at === null
                        || $monitor->last_checked_at->lte(now()->subSeconds($monitor->check_interval_seconds)))
                    ->each(function (WebsiteMonitor $monitor) use (&$dispatched): void {
                        CheckWebsiteMonitorJob::dispatch($monitor->id);
                        $dispatched++;
                    });
            });

        $this->components->info("Dispatched {$dispatched} website monitor check job(s).");

        return self::SUCCESS;
    }
}
