<?php

namespace App\Http\Controllers;

use App\Models\ReportYear;
use App\Support\ReportYearTransformer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Browsershot\Browsershot;
use Spatie\LaravelPdf\Facades\Pdf;

class ReportPrintController extends Controller
{
    public function index(): Response
    {
        $years = ReportYear::query()
            ->orderBy('year', 'desc')
            ->get(['id', 'year', 'title']);

        return Inertia::render('reports/Print', [
            'years' => $years,
        ]);
    }

    public function generate(Request $request, ReportYearTransformer $transformer)
    {
        $validated = $request->validate([
            'report_year_id' => ['required', 'exists:report_years,id'],
        ]);

        $reportYear = ReportYear::with([
            'gfpsMembershipSummary',
            'gfpsAssemblyAttendances.gfpsAssemblyPeriod',
            'employeeStatusBreakdowns.employmentStatus',
            'scholarshipSnapshots.schoolYear',
            'rstlMonthlyBreakdowns.reportMonth',
            'programFundingSummaries.fundingProgram',
        ])->findOrFail($validated['report_year_id']);

        $data = $transformer->toDetailArray($reportYear);

        return Pdf::view('pdf.report', [
            'year' => $data,
        ])
            ->format('a4')
            ->name('report-'.$reportYear->year.'.pdf')
            ->withBrowsershot(function (Browsershot $browsershot): void {
                $browsershot->waitUntilNetworkIdle();
            });
    }
}
