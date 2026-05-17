<?php

use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\DomainAssetController;
use App\Http\Controllers\Admin\HostingAssetController;
use App\Http\Controllers\Admin\PaymentTimelineController;
use App\Http\Controllers\Admin\ProjectController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('admin/clients', ClientController::class)
        ->names('admin.clients');

    Route::resource('admin/projects', ProjectController::class)
        ->names('admin.projects');

    Route::resource('admin/domain-assets', DomainAssetController::class)
        ->names('admin.domain-assets');

    Route::resource('admin/hosting-assets', HostingAssetController::class)
        ->names('admin.hosting-assets');

    Route::get('admin/payment-timelines', [PaymentTimelineController::class, 'index'])
        ->name('admin.payment-timelines.index');
});

require __DIR__.'/settings.php';
