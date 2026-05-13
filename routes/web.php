<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard/Home')->name('dashboard');
    Route::inertia('calendar', 'Calendar')->name('calendar');
    Route::inertia('profile', 'UserProfiles')->name('profile.show');
    Route::inertia('form-elements', 'Forms/FormElements')->name('form-elements');
    Route::inertia('basic-tables', 'Tables/BasicTables')->name('basic-tables');
    Route::inertia('blank', 'Blank')->name('blank');
    Route::inertia('error-404', 'OtherPage/NotFound')->name('error-404');
    Route::inertia('line-chart', 'Charts/LineChart')->name('line-chart');
    Route::inertia('bar-chart', 'Charts/BarChart')->name('bar-chart');
    Route::inertia('alerts', 'UiElements/Alerts')->name('alerts');
    Route::inertia('avatars', 'UiElements/Avatars')->name('avatars');
    Route::inertia('badge', 'UiElements/Badges')->name('badge');
    Route::inertia('buttons', 'UiElements/Buttons')->name('buttons');
    Route::inertia('images', 'UiElements/Images')->name('images');
    Route::inertia('videos', 'UiElements/Videos')->name('videos');
});

Route::inertia('signin', 'AuthPages/SignIn')->name('signin');
Route::inertia('signup', 'AuthPages/SignUp')->name('signup');

require __DIR__.'/settings.php';
