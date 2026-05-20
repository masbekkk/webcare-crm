<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebsiteIncident extends Model
{
    use HasFactory;

    protected $fillable = [
        'monitor_id',
        'project_id',
        'started_at',
        'resolved_at',
        'duration_seconds',
        'status',
        'reason',
        'first_error_message',
        'last_error_message',
    ];

    protected $attributes = [
        'status' => 'ongoing',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function monitor(): BelongsTo
    {
        return $this->belongsTo(WebsiteMonitor::class, 'monitor_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
