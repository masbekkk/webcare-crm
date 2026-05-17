<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectPaymentTimeline extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'client_id',
        'type',
        'title',
        'description',
        'sequence_order',
        'percentage',
        'planned_amount',
        'paid_amount',
        'remaining_amount',
        'due_date',
        'paid_at',
        'billing_period_start',
        'billing_period_end',
        'status',
        'payment_method',
        'reference_number',
        'proof_file',
        'reminder_days_before',
        'is_additional_charge',
        'admin_notes',
        'client_notes',
        'created_by',
        'updated_by',
    ];

    protected $attributes = [
        'sequence_order' => 1,
        'planned_amount' => 0,
        'paid_amount' => 0,
        'remaining_amount' => 0,
        'status' => 'planned',
        'is_additional_charge' => false,
    ];

    protected function casts(): array
    {
        return [
            'percentage' => 'decimal:2',
            'planned_amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'remaining_amount' => 'decimal:2',
            'due_date' => 'date',
            'paid_at' => 'datetime',
            'billing_period_start' => 'date',
            'billing_period_end' => 'date',
            'is_additional_charge' => 'boolean',
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

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
