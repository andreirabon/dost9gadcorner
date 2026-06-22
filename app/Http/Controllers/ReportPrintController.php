<?php

namespace App\Http\Controllers;

use App\Models\ReportYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\LaravelPdf\Facades\Pdf;
use App\Support\ReportYearTransformer;

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
            'with_charts' => ['required', 'boolean'],
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
            'withCharts' => $request->boolean('with_charts'),
        ])
        ->format('a4')
        ->name('report-' . $reportYear->year . '.pdf');
    }
}
