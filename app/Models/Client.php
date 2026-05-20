<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_name',
        'display_name',
        'pic_name',
        'pic_position',
        'pic_email',
        'pic_phone',
        'pic_whatsapp',
        'company_email',
        'company_phone',
        'address',
        'city',
        'province',
        'status',
        'notes',
    ];

    protected $attributes = [
        'status' => 'active',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function paymentTimelines(): HasMany
    {
        return $this->hasMany(ProjectPaymentTimeline::class);
    }

    public function issues(): HasMany
    {
        return $this->hasMany(Issue::class);
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
