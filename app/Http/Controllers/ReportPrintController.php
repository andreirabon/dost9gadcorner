<?php

namespace App\Http\Controllers;

use App\Models\ReportYear;
use App\Support\ReportYearTransformer;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class ReportPrintController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', ReportYear::class);

        $years = ReportYear::query()
            ->orderBy('year', 'desc')
            ->get(['id', 'year', 'title']);

        return Inertia::render('reports/Print', [
            'years' => $years,
        ]);
    }

    public function generate(Request $request, ReportYearTransformer $transformer): HttpResponse
    {
        $validated = $request->validate([
            'report_year_id' => ['required', 'integer', 'exists:report_years,id'],
        ]);

        $reportYear = ReportYear::with([
            'gfpsMembershipSummary',
            'gfpsAssemblyAttendances.gfpsAssemblyPeriod',
            'employeeStatusBreakdowns.employmentStatus',
            'scholarshipSnapshots.schoolYear',
            'rstlMonthlyBreakdowns.reportMonth',
            'programFundingSummaries.fundingProgram',
        ])->findOrFail($validated['report_year_id']);

        $this->authorize('view', $reportYear);

        $data = $transformer->toDetailArray($reportYear);

        $pdf = Pdf::loadView('pdf.report', [
            'year' => $data,
        ])->setPaper('a4', 'portrait');

        $filename = 'report-'.preg_replace('/[^0-9A-Za-z_-]+/', '', (string) $reportYear->year).'.pdf';

        return $pdf->stream($filename);
    }
}
