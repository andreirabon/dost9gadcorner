<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReportPrintController;
use App\Http\Controllers\ReportYearManagementController;
use App\Http\Controllers\ReportYearPublicController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Middleware\NoCacheHeaders;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])
    ->middleware(NoCacheHeaders::class)
    ->name('index');

Route::middleware([NoCacheHeaders::class, 'guest'])->group(function (): void {
    Route::get('open', [AuthenticatedSessionController::class, 'create'])->name('login');

    // The credential throttle in LoginRequest only runs once validation passes,
    // so a malformed username would otherwise be an unlimited free POST.
    Route::post('open', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('login.store');
});

Route::get('close', fn () => redirect('/'))->name('logout.fallback');
Route::post('close', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth')->name('logout');

Route::get('/reports/{reportYear}', [ReportYearPublicController::class, 'show'])
    ->middleware(NoCacheHeaders::class)
    ->name('reports.show');

Route::middleware(['auth', NoCacheHeaders::class])
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
        Route::patch('/{reportYear}/scholarship-applicants', [ReportYearManagementController::class, 'updateScholarshipApplicants'])->name('scholarship-applicants.update');
        Route::patch('/{reportYear}/toggle-lock', [ReportYearManagementController::class, 'toggleLock'])->name('toggle-lock');
    });

Route::middleware(['auth', NoCacheHeaders::class])->group(function (): void {
    Route::get('/print-report', [ReportPrintController::class, 'index'])->name('print-report');
    // Eager-loads six relations per call; cap it so one session cannot spin the DB.
    Route::get('/print-report/generate', [ReportPrintController::class, 'generate'])
        ->middleware('throttle:30,1')
        ->name('print-report.generate');
});

Route::middleware(['auth', NoCacheHeaders::class])
    ->prefix('admin/users')
    ->name('admin.users.')
    ->group(function (): void {
        Route::get('/', [UserManagementController::class, 'index'])->name('index');
        Route::patch('/{user}/password', [UserManagementController::class, 'updatePassword'])
            ->middleware('throttle:6,1')
            ->name('password.update');
    });

Route::middleware(['auth', NoCacheHeaders::class])
    ->prefix('admin/audit-logs')
    ->name('admin.audit-logs.')
    ->group(function (): void {
        Route::get('/', [AuditLogController::class, 'index'])->name('index');
    });

Route::middleware('auth')
    ->prefix('settings')
    ->name('settings.')
    ->group(function (): void {
        Route::redirect('/', '/settings/profile');

        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

        // Both endpoints verify `current_password`, which makes them password
        // oracles for anyone who has hijacked a session. Throttle the guessing.
        Route::delete('/profile', [ProfileController::class, 'destroy'])
            ->middleware('throttle:6,1')
            ->name('profile.destroy');

        Route::get('/password', [PasswordController::class, 'edit'])->name('password.edit');
        Route::put('/password', [PasswordController::class, 'update'])
            ->middleware('throttle:6,1')
            ->name('password.update');
    });
