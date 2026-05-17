<?php

use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\DomainAssetController;
use App\Http\Controllers\Admin\HostingAssetController;
use App\Http\Controllers\Admin\IssueController;
use App\Http\Controllers\Admin\PaymentTimelineController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectLinkController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WebsiteCheckLogController;
use App\Http\Controllers\Admin\WebsiteIncidentController;
use App\Http\Controllers\Admin\WebsiteMonitorController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('admin/clients', ClientController::class)
        ->names('admin.clients');

    Route::resource('admin/users', UserController::class)
        ->names('admin.users');

    Route::resource('admin/projects', ProjectController::class)
        ->names('admin.projects');

    Route::get('admin/project-links', [ProjectLinkController::class, 'index'])
        ->name('admin.project-links.index');

    Route::resource('admin/domain-assets', DomainAssetController::class)
        ->names('admin.domain-assets');

    Route::resource('admin/hosting-assets', HostingAssetController::class)
        ->names('admin.hosting-assets');

    Route::get('admin/payment-timelines', [PaymentTimelineController::class, 'index'])
        ->name('admin.payment-timelines.index');

    Route::post('admin/payment-timelines', [PaymentTimelineController::class, 'store'])
        ->name('admin.payment-timelines.store');

    Route::resource('admin/issues', IssueController::class)
        ->names('admin.issues');

    Route::resource('admin/monitors', WebsiteMonitorController::class)
        ->names('admin.monitors');

    Route::get('admin/website-check-logs', [WebsiteCheckLogController::class, 'index'])
        ->name('admin.website-check-logs.index');

    Route::get('admin/website-incidents', [WebsiteIncidentController::class, 'index'])
        ->name('admin.website-incidents.index');
});

require __DIR__.'/settings.php';
