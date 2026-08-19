<?php

namespace Database\Seeders;

use App\Models\EmployeeStatusBreakdown;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyAttendance;
use App\Models\GfpsAssemblyPeriod;
use App\Models\GfpsMembershipSummary;
use App\Models\ProgramFundingSummary;
use App\Models\ReportMonth;
use App\Models\ReportYear;
use App\Models\RstlMonthlyBreakdown;
use App\Models\ScholarshipApplicantSummary;
use App\Models\ScholarshipProgram;
use App\Models\ScholarshipSummary;
use App\Models\SchoolYear;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReportYear2025Seeder extends Seeder
{
    public function run(): void
    {
        $this->call(ReportLookupSeeder::class);

        DB::transaction(function (): void {
            $reportYear = ReportYear::query()->updateOrCreate(
                ['year' => 2025],
                [
                    'title' => '2025 Sex Disaggregated Data Report',
                    'description' => 'Data report for 2025 covering DOST IX employees, RSTL services, and categorized SETUP/CEST programs.',
                    'status' => ReportYear::STATUS_PUBLISHED,
                    // Kept inside the reporting year so the published date never
                    // reads as later than the data it describes.
                    'published_at' => fake()->dateTimeBetween('2025-11-01', '2025-12-31'),
                ],
            );

            GfpsMembershipSummary::query()->updateOrCreate(
                ['report_year_id' => $reportYear->id],
                [
                    'female_count' => 22,
                    'male_count' => 6,
                ],
            );

            $assemblyPeriods = GfpsAssemblyPeriod::query()->pluck('id', 'slug');

            foreach ([
                '1st_assembly' => ['female_count' => 20, 'male_count' => 5],
                '2nd_assembly' => ['female_count' => 20, 'male_count' => 5],
                '3rd_quarter' => ['female_count' => 14, 'male_count' => 3],
                '4th_quarter' => ['female_count' => 16, 'male_count' => 4],
            ] as $slug => $values) {
                GfpsAssemblyAttendance::query()->updateOrCreate(
                    [
                        'report_year_id' => $reportYear->id,
                        'gfps_assembly_period_id' => $assemblyPeriods[$slug],
                    ],
                    $values,
                );
            }

            $employmentStatuses = EmploymentStatus::query()->pluck('id', 'slug');

            foreach ([
                'plantilla' => ['female_count' => 16, 'male_count' => 17],
                'cos' => ['female_count' => 40, 'male_count' => 42],
                'agency' => ['female_count' => 0, 'male_count' => 11],
                'jo' => ['female_count' => 1, 'male_count' => 1],
            ] as $slug => $values) {
                EmployeeStatusBreakdown::query()->updateOrCreate(
                    [
                        'report_year_id' => $reportYear->id,
                        'employment_status_id' => $employmentStatuses[$slug],
                    ],
                    $values,
                );
            }

            $schoolYear = SchoolYear::query()->where('name', '2025-2026')->first();

            ScholarshipSummary::query()->updateOrCreate(
                ['report_year_id' => $reportYear->id],
                [
                    'school_year_id' => $schoolYear->id ?? null,
                    'as_of_date' => fake()->dateTimeBetween('2025-01-01', '2025-12-31')->format('Y-m-d'),
                    'female_count' => fake()->numberBetween(40, 90),
                    'male_count' => fake()->numberBetween(80, 140),
                ],
            );

            $months = ReportMonth::query()->pluck('id', 'short_name');

            foreach ([
                'Jan' => ['female_count' => 0, 'female_led_count' => 0, 'male_count' => 0, 'male_led_count' => 0],
                'Feb' => ['female_count' => 9, 'female_led_count' => 0, 'male_count' => 9, 'male_led_count' => 0],
                'Mar' => ['female_count' => 28, 'female_led_count' => 7, 'male_count' => 6, 'male_led_count' => 0],
                'Apr' => ['female_count' => 24, 'female_led_count' => 0, 'male_count' => 9, 'male_led_count' => 0],
                'May' => ['female_count' => 3, 'female_led_count' => 0, 'male_count' => 8, 'male_led_count' => 0],
                'Jun' => ['female_count' => 3, 'female_led_count' => 4, 'male_count' => 0, 'male_led_count' => 0],
                'Jul' => ['female_count' => 7, 'female_led_count' => 0, 'male_count' => 4, 'male_led_count' => 0],
                'Aug' => ['female_count' => 5, 'female_led_count' => 2, 'male_count' => 4, 'male_led_count' => 0],
                'Sep' => ['female_count' => 7, 'female_led_count' => 4, 'male_count' => 14, 'male_led_count' => 0],
                'Oct' => ['female_count' => 8, 'female_led_count' => 0, 'male_count' => 5, 'male_led_count' => 0],
                'Nov' => ['female_count' => 23, 'female_led_count' => 0, 'male_count' => 6, 'male_led_count' => 0],
                'Dec' => ['female_count' => 19, 'female_led_count' => 0, 'male_count' => 8, 'male_led_count' => 0],
            ] as $shortName => $values) {
                RstlMonthlyBreakdown::query()->updateOrCreate(
                    [
                        'report_year_id' => $reportYear->id,
                        'report_month_id' => $months[$shortName],
                    ],
                    $values,
                );
            }

            foreach (ScholarshipProgram::query()->get() as $program) {
                ScholarshipApplicantSummary::query()->updateOrCreate(
                    [
                        'report_year_id' => $reportYear->id,
                        'scholarship_program_id' => $program->id,
                    ],
                    [
                        'female_count' => fake()->numberBetween(0, 120),
                        'male_count' => fake()->numberBetween(0, 120),
                    ],
                );
            }

            $fundingPrograms = FundingProgram::query()->pluck('id', 'slug');

            foreach ([
                'setup-zc-ic',
                'setup-zsp',
                'setup-zds',
                'setup-zdn',
                'cest-zc-ic',
                'cest-zsp',
                'cest-zds',
                'cest-zdn',
            ] as $slug) {
                ProgramFundingSummary::query()->updateOrCreate(
                    [
                        'report_year_id' => $reportYear->id,
                        'funding_program_id' => $fundingPrograms[$slug],
                    ],
                    $this->randomProgramFundingValues(),
                );
            }
        });
    }

    /**
     * Demo figures for one funding program.
     *
     * Deliberately generated rather than hardcoded so the sample report shows a
     * realistic spread across categories instead of the same number repeated.
     *
     * Two invariants are honoured so the seeded rows are values the edit screen
     * would actually accept:
     *  - jobs_male + jobs_female equals jobs_total, which the request validates.
     *  - PWD / senior citizen / IP / 4Ps are overlapping subsets of that total,
     *    never additional to it, so each is capped below it rather than summed.
     *
     * @return array<string, int|float>
     */
    private function randomProgramFundingValues(): array
    {
        $femaleProjects = fake()->numberBetween(0, 18);
        $maleProjects = fake()->numberBetween(0, 18);

        $jobsMale = fake()->numberBetween(0, 60);
        $jobsFemale = fake()->numberBetween(0, 60);
        $jobsTotal = $jobsMale + $jobsFemale;

        /** A subset category can never exceed the workforce it is drawn from. */
        $subsetOfJobs = fn (int $ceiling): int => $jobsTotal === 0 ? 0 : fake()->numberBetween(0, min($ceiling, intdiv($jobsTotal, 4)));

        return [
            'female_projects' => $femaleProjects,
            'female_amount' => $femaleProjects === 0 ? 0 : fake()->randomFloat(2, 50_000, 2_500_000),
            'male_projects' => $maleProjects,
            'male_amount' => $maleProjects === 0 ? 0 : fake()->randomFloat(2, 50_000, 2_500_000),

            'funded_projects_count' => $femaleProjects + $maleProjects,
            'funded_projects_value' => fake()->randomFloat(2, 100_000, 5_000_000),
            'training_participants' => fake()->numberBetween(0, 150),

            'jobs_total' => $jobsTotal,
            'jobs_male' => $jobsMale,
            'jobs_female' => $jobsFemale,
            'jobs_pwd' => $subsetOfJobs(8),
            'jobs_senior_citizen' => $subsetOfJobs(8),
            'jobs_ip' => $subsetOfJobs(8),
            'jobs_4ps' => $subsetOfJobs(10),

            'special_projects_research_male' => fake()->numberBetween(0, 12),
            'special_projects_research_female' => fake()->numberBetween(0, 12),
        ];
    }
}
