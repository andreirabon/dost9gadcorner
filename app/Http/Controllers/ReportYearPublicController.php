<?php

namespace App\Http\Controllers;

use App\Models\ReportYear;
use App\Support\ReportYearTransformer;
use Inertia\Inertia;
use Inertia\Response;

class ReportYearPublicController extends Controller
{
    public function __construct(
        private ReportYearTransformer $reportYearTransformer,
    ) {}

    public function show(ReportYear $reportYear): Response
    {
        $reportYear->load([
            'gfpsMembershipSummary',
            'gfpsAssemblyAttendances.gfpsAssemblyPeriod',
            'employeeStatusBreakdowns.employmentStatus',
            'scholarshipSummary',
            'rstlMonthlyBreakdowns.reportMonth',
            'programFundingSummaries.fundingProgram',
        ]);

        return Inertia::render('reports/Show', [
            'year' => $this->reportYearTransformer->toDetailArray($reportYear),
        ]);
    }
}
