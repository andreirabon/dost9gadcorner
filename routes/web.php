<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReportYearManagementController;
use App\Http\Controllers\ReportYearPublicController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('index');

Route::middleware('guest')->group(function (): void {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

Route::get('/reports/{reportYear}', [ReportYearPublicController::class, 'show'])->name('reports.show');

Route::middleware('auth')
    ->prefix('report-years')
    ->name('report-years.')
    ->group(function (): void {
        Route::get('/', [ReportYearManagementController::class, 'index'])->name('index');
        Route::get('/create', [ReportYearManagementController::class, 'create'])->name('create');
        Route::post('/', [ReportYearManagementController::class, 'store'])->name('store');
        Route::get('/{reportYear}/edit', [ReportYearManagementController::class, 'edit'])->name('edit');
        Route::patch('/{reportYear}', [ReportYearManagementController::class, 'update'])->name('update');
        Route::patch('/{reportYear}/gfps-membership', [ReportYearManagementController::class, 'updateGfpsMembership'])->name('gfps-membership.update');
        Route::patch('/{reportYear}/gfps-assemblies', [ReportYearManagementController::class, 'updateGfpsAssemblies'])->name('gfps-assemblies.update');
        Route::patch('/{reportYear}/employee-statuses', [ReportYearManagementController::class, 'updateEmployeeStatuses'])->name('employee-statuses.update');
        Route::patch('/{reportYear}/scholarship', [ReportYearManagementController::class, 'updateScholarship'])->name('scholarship.update');
        Route::patch('/{reportYear}/rstl-monthly', [ReportYearManagementController::class, 'updateRstlMonthly'])->name('rstl-monthly.update');
        Route::patch('/{reportYear}/program-funding', [ReportYearManagementController::class, 'updateProgramFunding'])->name('program-funding.update');
    });

Route::middleware('auth')
    ->prefix('settings')
    ->name('settings.')
    ->group(function (): void {
        Route::redirect('/', '/settings/appearance');

        Route::get('/appearance', fn () => Inertia::render('settings/Appearance'))->name('appearance');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    });
