<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class WebsiteMonitor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'project_link_id',
        'name',
        'url',
        'method',
        'expected_status_code',
        'timeout_seconds',
        'check_interval_seconds',
        'is_active',
        'current_status',
        'last_status_code',
        'last_response_time_ms',
        'last_checked_at',
        'last_down_at',
        'last_recovered_at',
        'consecutive_failures',
        'consecutive_successes',
    ];

    protected $attributes = [
        'method' => 'GET',
        'expected_status_code' => 200,
        'timeout_seconds' => 10,
        'check_interval_seconds' => 60,
        'is_active' => true,
        'current_status' => 'unknown',
        'consecutive_failures' => 0,
        'consecutive_successes' => 0,
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'last_checked_at' => 'datetime',
            'last_down_at' => 'datetime',
            'last_recovered_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function projectLink(): BelongsTo
    {
        return $this->belongsTo(ProjectLink::class);
    }

    public function checkLogs(): HasMany
    {
        return $this->hasMany(WebsiteCheckLog::class, 'monitor_id');
    }

    public function incidents(): HasMany
    {
        return $this->hasMany(WebsiteIncident::class, 'monitor_id');
    }
}
