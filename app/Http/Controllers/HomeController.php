<?php

namespace App\Http\Controllers;

use App\Models\ReportYear;
use App\Support\ReportYearTransformer;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private ReportYearTransformer $reportYearTransformer,
    ) {}

    public function index(): Response
    {
        $reportYears = ReportYear::query()
            ->orderByDesc('year')
            ->get();

        return Inertia::render('Index', [
            'years' => $reportYears->map(fn (ReportYear $reportYear): array => $this->reportYearTransformer->toCardArray($reportYear)),
        ]);
    }
}
