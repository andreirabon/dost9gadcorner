<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReportYearManagementController;
use App\Http\Controllers\ReportYearPublicController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('index');

Route::middleware([\App\Http\Middleware\NoCacheHeaders::class, 'guest'])->group(function (): void {
    Route::get('open', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('open', [AuthenticatedSessionController::class, 'store'])->name('login.store');
});

Route::get('close', fn () => redirect('/'))->name('logout.fallback');
Route::post('close', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

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
        Route::patch('/{reportYear}/metadata', [ReportYearManagementController::class, 'updateMetadata'])->name('metadata.update');
        Route::delete('/{reportYear}', [ReportYearManagementController::class, 'destroy'])->name('destroy');
        Route::patch('/{reportYear}/gfps-membership', [ReportYearManagementController::class, 'updateGfpsMembership'])->name('gfps-membership.update');
        Route::patch('/{reportYear}/gfps-assemblies', [ReportYearManagementController::class, 'updateGfpsAssemblies'])->name('gfps-assemblies.update');
        Route::patch('/{reportYear}/employee-statuses', [ReportYearManagementController::class, 'updateEmployeeStatuses'])->name('employee-statuses.update');
        Route::post('/{reportYear}/scholarship', [ReportYearManagementController::class, 'storeScholarshipSnapshot'])->name('scholarship.store');
        Route::patch('/{reportYear}/scholarship/{scholarship}', [ReportYearManagementController::class, 'updateScholarshipSnapshot'])->name('scholarship.update');
        Route::delete('/{reportYear}/scholarship/{scholarship}', [ReportYearManagementController::class, 'destroyScholarshipSnapshot'])->name('scholarship.destroy');
        Route::patch('/{reportYear}/rstl-monthly', [ReportYearManagementController::class, 'updateRstlMonthly'])->name('rstl-monthly.update');
        Route::patch('/{reportYear}/program-funding', [ReportYearManagementController::class, 'updateProgramFunding'])->name('program-funding.update');
    });

use App\Http\Controllers\ReportPrintController;

Route::get('/print-report', [ReportPrintController::class, 'index'])->middleware('auth')->name('print-report');
Route::get('/print-report/generate', [ReportPrintController::class, 'generate'])->middleware('auth')->name('print-report.generate');

Route::middleware('auth')
    ->prefix('settings')
    ->name('settings.')
    ->group(function (): void {
        Route::redirect('/', '/settings/profile');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        Route::get('/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    });
