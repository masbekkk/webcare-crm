<?php

namespace App\Jobs;

use App\Models\WebsiteCheckLog;
use App\Models\WebsiteIncident;
use App\Models\WebsiteMonitor;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable as QueueableJob;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Throwable;

class CheckWebsiteMonitorJob implements ShouldBeUnique, ShouldQueue
{
    use QueueableJob;

    public int $tries = 1;

    public int $timeout = 120;

    public int $uniqueFor = 120;

    public function __construct(
        public readonly int $monitorId,
    ) {}

    public function uniqueId(): string
    {
        return (string) $this->monitorId;
    }

    public function handle(): void
    {
        $monitor = WebsiteMonitor::query()->find($this->monitorId);

        if (! $monitor || ! $monitor->is_active || ! $this->isDue($monitor)) {
            return;
        }

        $checkedAt = now();
        $startedAt = microtime(true);

        try {
            $response = Http::timeout($monitor->timeout_seconds)
                ->connectTimeout(min($monitor->timeout_seconds, 5))
                ->send(strtoupper($monitor->method), $monitor->url);

            $statusCode = $response->status();
            $responseTimeMs = $this->responseTimeMs($startedAt);
            $isSuccess = $statusCode === $monitor->expected_status_code;

            $this->recordResult(
                monitorId: $monitor->id,
                checkedAt: $checkedAt,
                isSuccess: $isSuccess,
                statusCode: $statusCode,
                responseTimeMs: $responseTimeMs,
                errorType: $isSuccess ? null : 'unexpected_status_code',
                errorMessage: $isSuccess
                    ? null
                    : "Expected HTTP {$monitor->expected_status_code}, got HTTP {$statusCode}.",
            );
        } catch (ConnectionException $exception) {
            $this->recordResult(
                monitorId: $monitor->id,
                checkedAt: $checkedAt,
                isSuccess: false,
                statusCode: null,
                responseTimeMs: $this->responseTimeMs($startedAt),
                errorType: 'connection_error',
                errorMessage: $exception->getMessage(),
            );
        } catch (Throwable $exception) {
            $this->recordResult(
                monitorId: $monitor->id,
                checkedAt: $checkedAt,
                isSuccess: false,
                statusCode: null,
                responseTimeMs: $this->responseTimeMs($startedAt),
                errorType: class_basename($exception),
                errorMessage: $exception->getMessage(),
            );
        }
    }

    private function isDue(WebsiteMonitor $monitor): bool
    {
        if ($monitor->last_checked_at === null) {
            return true;
        }

        return $monitor->last_checked_at->lte(
            now()->subSeconds($monitor->check_interval_seconds),
        );
    }

    private function responseTimeMs(float $startedAt): int
    {
        return (int) round((microtime(true) - $startedAt) * 1000);
    }

    private function recordResult(
        int $monitorId,
        mixed $checkedAt,
        bool $isSuccess,
        ?int $statusCode,
        int $responseTimeMs,
        ?string $errorType,
        ?string $errorMessage,
    ): void {
        DB::transaction(function () use (
            $monitorId,
            $checkedAt,
            $isSuccess,
            $statusCode,
            $responseTimeMs,
            $errorType,
            $errorMessage,
        ): void {
            $monitor = WebsiteMonitor::query()
                ->whereKey($monitorId)
                ->lockForUpdate()
                ->first();

            if (! $monitor) {
                return;
            }

            $status = $isSuccess ? 'up' : 'down';

            WebsiteCheckLog::create([
                'monitor_id' => $monitor->id,
                'project_id' => $monitor->project_id,
                'checked_at' => $checkedAt,
                'is_success' => $isSuccess,
                'status' => $status,
                'status_code' => $statusCode,
                'response_time_ms' => $responseTimeMs,
                'error_type' => $errorType,
                'error_message' => $errorMessage,
            ]);

            $this->updateMonitorStatus(
                monitor: $monitor,
                checkedAt: $checkedAt,
                isSuccess: $isSuccess,
                statusCode: $statusCode,
                responseTimeMs: $responseTimeMs,
            );

            $isSuccess
                ? $this->resolveIncident($monitor, $checkedAt)
                : $this->openOrUpdateIncident($monitor, $checkedAt, $errorType, $errorMessage);
        });
    }

    private function updateMonitorStatus(
        WebsiteMonitor $monitor,
        mixed $checkedAt,
        bool $isSuccess,
        ?int $statusCode,
        int $responseTimeMs,
    ): void {
        $wasDown = $monitor->current_status === 'down';

        $monitor->update([
            'current_status' => $isSuccess ? 'up' : 'down',
            'last_status_code' => $statusCode,
            'last_response_time_ms' => $responseTimeMs,
            'last_checked_at' => $checkedAt,
            'last_down_at' => $isSuccess
                ? $monitor->last_down_at
                : ($wasDown ? $monitor->last_down_at : $checkedAt),
            'last_recovered_at' => $isSuccess && $wasDown
                ? $checkedAt
                : $monitor->last_recovered_at,
            'consecutive_failures' => $isSuccess ? 0 : $monitor->consecutive_failures + 1,
            'consecutive_successes' => $isSuccess ? $monitor->consecutive_successes + 1 : 0,
        ]);
    }

    private function openOrUpdateIncident(
        WebsiteMonitor $monitor,
        mixed $checkedAt,
        ?string $errorType,
        ?string $errorMessage,
    ): void {
        $reason = $errorType ?? 'check_failed';
        $incident = WebsiteIncident::query()
            ->where('monitor_id', $monitor->id)
            ->where('status', 'ongoing')
            ->latest('started_at')
            ->first();

        if ($incident) {
            $incident->update([
                'reason' => $reason,
                'last_error_message' => $errorMessage,
            ]);

            return;
        }

        WebsiteIncident::create([
            'monitor_id' => $monitor->id,
            'project_id' => $monitor->project_id,
            'started_at' => $checkedAt,
            'status' => 'ongoing',
            'reason' => $reason,
            'first_error_message' => $errorMessage,
            'last_error_message' => $errorMessage,
        ]);
    }

    private function resolveIncident(WebsiteMonitor $monitor, mixed $checkedAt): void
    {
        WebsiteIncident::query()
            ->where('monitor_id', $monitor->id)
            ->where('status', 'ongoing')
            ->get()
            ->each(function (WebsiteIncident $incident) use ($checkedAt): void {
                $incident->update([
                    'status' => 'resolved',
                    'resolved_at' => $checkedAt,
                    'duration_seconds' => max(
                        0,
                        $incident->started_at->diffInSeconds($checkedAt),
                    ),
                ]);
            });
    }
}
