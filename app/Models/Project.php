<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'client_id',
        'name',
        'slug',
        'description',
        'project_type',
        'contract_value',
        'payment_model',
        'status',
        'start_date',
        'target_finish_date',
        'live_date',
        'tech_stack',
        'internal_notes',
        'created_by',
    ];

    protected $attributes = [
        'contract_value' => 0,
        'payment_model' => 'custom',
        'status' => 'draft',
    ];

    protected function casts(): array
    {
        return [
            'contract_value' => 'decimal:2',
            'start_date' => 'date',
            'target_finish_date' => 'date',
            'live_date' => 'date',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function links(): HasMany
    {
        return $this->hasMany(ProjectLink::class);
    }

    public function members(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot(['role', 'assigned_at'])
            ->withTimestamps();
    }

    public function paymentTimelines(): HasMany
    {
        return $this->hasMany(ProjectPaymentTimeline::class);
    }

    public function websiteMonitors(): HasMany
    {
        return $this->hasMany(WebsiteMonitor::class);
    }

    public function websiteCheckLogs(): HasMany
    {
        return $this->hasMany(WebsiteCheckLog::class);
    }

    public function websiteIncidents(): HasMany
    {
        return $this->hasMany(WebsiteIncident::class);
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
    }

    public function maintenanceLogs(): HasMany
    {
        return $this->hasMany(MaintenanceLog::class);
    }

    public function domainAssets(): HasMany
    {
        return $this->hasMany(DomainAsset::class);
    }

    public function hostingAssets(): HasMany
    {
        return $this->hasMany(HostingAsset::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }
}
