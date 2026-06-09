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
        abort_unless($reportYear->status === ReportYear::STATUS_PUBLISHED, 404);

        $reportYear->load([
            'gfpsMembershipSummary',
            'gfpsAssemblyAttendances.gfpsAssemblyPeriod',
            'employeeStatusBreakdowns.employmentStatus',
            'scholarshipSnapshots.schoolYear',
            'rstlMonthlyBreakdowns.reportMonth',
            'programFundingSummaries.fundingProgram',
        ]);

        return Inertia::render('reports/Show', [
            'year' => $this->reportYearTransformer->toDetailArray($reportYear),
        ]);
    }
}
