<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class DomainAsset extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'project_id',
        'domain_name',
        'registrar',
        'registered_at',
        'expired_at',
        'auto_renew',
        'notes',
    ];

    protected $attributes = [
        'auto_renew' => false,
    ];

    protected function casts(): array
    {
        return [
            'registered_at' => 'date',
            'expired_at' => 'date',
            'auto_renew' => 'boolean',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
