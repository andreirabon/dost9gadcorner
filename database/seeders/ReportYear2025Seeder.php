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
                    'published_at' => now(),
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
                    'as_of_date' => '2025-01-13',
                    'female_count' => 64,
                    'male_count' => 114,
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

            $fundingPrograms = FundingProgram::query()->pluck('id', 'slug');
            $zeroFundingValues = [
                'male_projects' => 0,
                'male_amount' => 0.00,
                'female_projects' => 0,
                'female_amount' => 0.00,
            ];

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
                    $zeroFundingValues,
                );
            }
        });
    }
}
