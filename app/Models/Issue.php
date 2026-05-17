<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Issue extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'client_id',
        'title',
        'description',
        'priority',
        'status',
        'reported_by',
        'assigned_to',
        'due_date',
        'resolved_at',
        'closed_at',
        'resolution_notes',
        'internal_notes',
    ];

    protected $attributes = [
        'priority' => 'medium',
        'status' => 'open',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'resolved_at' => 'datetime',
            'closed_at' => 'datetime',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(IssueAttachment::class);
    }
}
