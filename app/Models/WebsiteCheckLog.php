<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebsiteCheckLog extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'monitor_id',
        'project_id',
        'checked_at',
        'is_success',
        'status',
        'status_code',
        'response_time_ms',
        'error_type',
        'error_message',
    ];

    protected function casts(): array
    {
        return [
            'checked_at' => 'datetime',
            'is_success' => 'boolean',
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
