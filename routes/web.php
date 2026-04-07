<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReportYearManagementController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('index');

Route::middleware('auth')
    ->prefix('report-years')
    ->name('report-years.')
    ->group(function (): void {
        Route::get('/', [ReportYearManagementController::class, 'index'])->name('index');
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

require __DIR__.'/settings.php';
