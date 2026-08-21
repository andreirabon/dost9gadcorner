<?php

namespace App\Support;

use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\ProgramFundingSummary;
use App\Models\ReportYear;
use App\Models\ScholarshipApplicantSummary;
use App\Models\ScholarshipProgram;
use App\Models\ScholarshipSummary;
use Illuminate\Support\Collection;

class ReportYearTransformer
{
    /**
     * Lightweight payload for homepage year cards (no reportData).
     *
     * @return array<string, mixed>
     */
    public function toCardArray(ReportYear $reportYear): array
    {
        return [
            'id' => $reportYear->id,
            'year' => (string) $reportYear->year,
            'href' => route('reports.show', $reportYear),
            'description' => $reportYear->description,
        ];
    }

    /**
     * Minimal payload for the public report detail Inertia page.
     *
     * @return array<string, mixed>
     */
    public function toPublicDetailArray(ReportYear $reportYear): array
    {
        return [
            'id' => $reportYear->id,
            'year' => (string) $reportYear->year,
            'title' => (string) $reportYear->title,
            'description' => $reportYear->description,
            'reportData' => $this->transformReportData($reportYear),
        ];
    }

    /**
     * Full payload for PDF generation and other internal consumers.
     *
     * @return array<string, mixed>
     */
    public function toDetailArray(ReportYear $reportYear): array
    {
        return [
            'id' => $reportYear->id,
            'year' => (string) $reportYear->year,
            'title' => (string) $reportYear->title,
            'href' => route('reports.show', $reportYear),
            'description' => $reportYear->description,
            'status' => $reportYear->status,
            'reportData' => $this->transformReportData($reportYear),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function transformReportData(ReportYear $reportYear): ?array
    {
        if ($reportYear->status === ReportYear::STATUS_PENDING) {
            return null;
        }

        $latestScholarship = $reportYear->scholarshipSnapshots->first();

        $setupFundingBreakdown = $this->transformFundingBreakdown($reportYear, 'setup');
        $cestFundingBreakdown = $this->transformFundingBreakdown($reportYear, 'cest');
        $giaFundingBreakdown = $this->transformFundingBreakdown($reportYear, 'gia');

        return [
            'gfpsMembership' => [
                'femaleCount' => (int) ($reportYear->gfpsMembershipSummary?->female_count ?? 0),
                'maleCount' => (int) ($reportYear->gfpsMembershipSummary?->male_count ?? 0),
            ],
            'gfpsAssemblies' => $this->transformGfpsAssemblyAttendances($reportYear),
            'employeeStatuses' => $this->transformEmployeeStatusBreakdowns($reportYear),
            'gfpsMemberStatuses' => $this->transformGfpsMemberStatusBreakdowns($reportYear),
            // The relation is already ordered newest-first, so the head of the
            // collection is the latest snapshot. Resolve it once.
            'scholarship' => $this->transformLatestScholarship($latestScholarship),
            'scholarshipHistory' => $reportYear->scholarshipSnapshots
                ->map(fn (ScholarshipSummary $s): array => [
                    'id' => $s->id,
                    'schoolYearLabel' => (string) ($s->schoolYear?->name ?? ''),
                    'asOfDate' => $s->as_of_date?->toDateString(),
                    'femaleCount' => (int) $s->female_count,
                    'maleCount' => (int) $s->male_count,
                ])
                ->values()
                ->all(),
            'scholarshipApplicants' => $this->transformScholarshipApplicants($reportYear),
            'rstlMonthly' => $this->transformRstlMonthlyBreakdowns($reportYear),
            'setupFundingBreakdown' => $setupFundingBreakdown,
            'cestFundingBreakdown' => $cestFundingBreakdown,
            'giaFundingBreakdown' => $giaFundingBreakdown,
        ];
    }

    /**
     * @return array{id: int|null, schoolYearLabel: string, asOfDate: string|null, femaleCount: int, maleCount: int}
     */
    private function transformLatestScholarship(?ScholarshipSummary $snapshot): array
    {
        return [
            'id' => $snapshot?->id,
            'schoolYearLabel' => (string) ($snapshot?->schoolYear?->name ?? ''),
            'asOfDate' => $snapshot?->as_of_date?->toDateString(),
            'femaleCount' => (int) ($snapshot?->female_count ?? 0),
            'maleCount' => (int) ($snapshot?->male_count ?? 0),
        ];
    }

    /**
     * @return array<int, array{label: string, female: int, male: int}>
     */
    private function transformGfpsAssemblyAttendances(ReportYear $reportYear): array
    {
        return $reportYear->gfpsAssemblyAttendances
            ->sortBy(fn ($attendance) => $attendance->gfpsAssemblyPeriod?->sort_order)
            ->map(fn ($attendance): array => [
                'label' => (string) $attendance->gfpsAssemblyPeriod?->name,
                'female' => (int) $attendance->female_count,
                'male' => (int) $attendance->male_count,
            ])
            ->values()
            ->all();
    }

    /**
     * GFPS members per employment status, zero-filled across the reportable
     * statuses so the chart always plots the same bars.
     *
     * Entered independently of `gfpsMembership`, and deliberately not derived
     * from it: the two are separate figures and are allowed to disagree.
     *
     * @return array<int, array{label: string, female: int, male: int}>
     */
    private function transformGfpsMemberStatusBreakdowns(ReportYear $reportYear): array
    {
        $breakdowns = $reportYear->gfpsMemberStatusBreakdowns->keyBy('employment_status_id');

        return GfpsMemberStatuses::all()
            ->map(fn (EmploymentStatus $status): array => [
                'label' => (string) $status->name,
                'female' => (int) ($breakdowns->get($status->id)?->female_count ?? 0),
                'male' => (int) ($breakdowns->get($status->id)?->male_count ?? 0),
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, female: int, male: int}>
     */
    private function transformEmployeeStatusBreakdowns(ReportYear $reportYear): array
    {
        return $reportYear->employeeStatusBreakdowns
            ->sortBy(fn ($breakdown) => $breakdown->employmentStatus?->sort_order)
            ->map(fn ($breakdown): array => [
                'label' => (string) $breakdown->employmentStatus?->name,
                'female' => (int) $breakdown->female_count,
                'male' => (int) $breakdown->male_count,
            ])
            ->values()
            ->all();
    }

    /**
     * Applicants per scholarship program, in the lookup's own order so the
     * undergraduate programs stay ahead of the graduate ones.
     *
     * Programs with no row for this year come back as zeros rather than being
     * dropped, so the published table always lists the full programme set.
     *
     * @return array<int, array{label: string, fullName: string, slug: string, level: string, female: int, male: int}>
     */
    private function transformScholarshipApplicants(ReportYear $reportYear): array
    {
        /** @var Collection<int, ScholarshipApplicantSummary> $applicants */
        $applicants = $reportYear->scholarshipApplicantSummaries->keyBy('scholarship_program_id');

        return ScholarshipProgram::query()
            ->orderBy('sort_order')
            ->get(['id', 'name', 'short_name', 'slug', 'level'])
            ->map(function (ScholarshipProgram $program) use ($applicants): array {
                /** @var ScholarshipApplicantSummary|null $summary */
                $summary = $applicants->get($program->id);

                return [
                    // Acronym for the chart axis, where the full eighty-character
                    // name overlaps its neighbours. `fullName` carries the
                    // spelled-out title for the table and the chart tooltip, so a
                    // reader outside the programme is never left with only ERDT.
                    'label' => (string) ($program->short_name ?: $program->name),
                    'fullName' => (string) $program->name,
                    'slug' => (string) $program->slug,
                    'level' => (string) $program->level,
                    'female' => (int) ($summary?->female_count ?? 0),
                    'male' => (int) ($summary?->male_count ?? 0),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, female: int, femaleLed: int, male: int, maleLed: int}>
     */
    private function transformRstlMonthlyBreakdowns(ReportYear $reportYear): array
    {
        return $reportYear->rstlMonthlyBreakdowns
            ->sortBy(fn ($breakdown) => $breakdown->reportMonth?->month_number)
            ->map(fn ($breakdown): array => [
                'label' => (string) $breakdown->reportMonth?->name,
                'female' => (int) $breakdown->female_count,
                'femaleLed' => (int) $breakdown->female_led_count,
                'male' => (int) $breakdown->male_count,
                'maleLed' => (int) $breakdown->male_led_count,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{label: string, slug: string, maleProjects: int, maleAmount: float, femaleProjects: int, femaleAmount: float, fundedProjectsCount: int, fundedProjectsValue: float, trainingParticipants: int, jobsTotal: int, jobsMale: int, jobsFemale: int, jobsPwd: int, jobsSeniorCitizen: int, jobsIp: int, jobs4ps: int, specialProjectsResearchMale: int, specialProjectsResearchFemale: int}>
     */
    private function transformFundingBreakdown(ReportYear $reportYear, string $prefix): array
    {
        /** @var Collection<int, ProgramFundingSummary> $fundingSummaries */
        $fundingSummaries = $reportYear->programFundingSummaries->keyBy('funding_program_id');

        return FundingProgram::query()
            ->where(function ($query) use ($prefix): void {
                $query
                    ->where('slug', $prefix)
                    ->orWhere('slug', 'like', $prefix.'-%');
            })
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug'])
            ->map(function (FundingProgram $program) use ($fundingSummaries): array {
                /** @var ProgramFundingSummary|null $summary */
                $summary = $fundingSummaries->get($program->id);

                return [
                    'label' => (string) $program->name,
                    'slug' => (string) $program->slug,
                    'maleProjects' => (int) ($summary?->male_projects ?? 0),
                    'maleAmount' => (float) ($summary?->male_amount ?? 0),
                    'femaleProjects' => (int) ($summary?->female_projects ?? 0),
                    'femaleAmount' => (float) ($summary?->female_amount ?? 0),
                    'fundedProjectsCount' => (int) ($summary?->funded_projects_count ?? 0),
                    'fundedProjectsValue' => (float) ($summary?->funded_projects_value ?? 0),
                    'trainingParticipants' => (int) ($summary?->training_participants ?? 0),
                    'jobsTotal' => (int) ($summary?->jobs_total ?? 0),
                    'jobsMale' => (int) ($summary?->jobs_male ?? 0),
                    'jobsFemale' => (int) ($summary?->jobs_female ?? 0),
                    'jobsPwd' => (int) ($summary?->jobs_pwd ?? 0),
                    'jobsSeniorCitizen' => (int) ($summary?->jobs_senior_citizen ?? 0),
                    'jobsIp' => (int) ($summary?->jobs_ip ?? 0),
                    'jobs4ps' => (int) ($summary?->jobs_4ps ?? 0),
                    'specialProjectsResearchMale' => (int) ($summary?->special_projects_research_male ?? 0),
                    'specialProjectsResearchFemale' => (int) ($summary?->special_projects_research_female ?? 0),
                ];
            })
            ->values()
            ->all();
    }
}
