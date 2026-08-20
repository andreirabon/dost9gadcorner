<?php

namespace App\Services\Reports;

use App\Models\EmployeeStatusBreakdown;
use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\GfpsAssemblyAttendance;
use App\Models\GfpsAssemblyPeriod;
use App\Models\ProgramFundingSummary;
use App\Models\ReportMonth;
use App\Models\RstlMonthlyBreakdown;
use App\Models\ScholarshipApplicantSummary;
use App\Models\ScholarshipProgram;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

/**
 * Every multi-row report section, described once.
 *
 * The five sections differ only in which model they write, which column
 * identifies a row, which fields carry values, and how the change is labelled
 * in the audit log. Keeping that as data lets one patcher and one controller
 * method serve all of them.
 */
final class RowSection
{
    public const GFPS_ASSEMBLIES = 'gfpsAssemblies';

    public const EMPLOYEE_STATUSES = 'employeeStatuses';

    public const RSTL_MONTHLY = 'rstlMonthly';

    public const SCHOLARSHIP_APPLICANTS = 'scholarshipApplicants';

    public const PROGRAM_FUNDING = 'programFunding';

    /**
     * @var array<string, array{
     *     model: class-string<Model>,
     *     identity: string,
     *     patchKey: string,
     *     valueFields: list<string>,
     *     relation: string,
     *     labelModel: class-string<Model>,
     *     payloadKey: string,
     *     auditAction: string,
     *     auditSection: string
     * }>
     */
    private const SECTIONS = [
        self::GFPS_ASSEMBLIES => [
            'model' => GfpsAssemblyAttendance::class,
            // The payload calls it `period_id`; the column is fully qualified.
            'identity' => 'gfps_assembly_period_id',
            'patchKey' => 'period_id',
            'valueFields' => ['female_count', 'male_count'],
            'relation' => 'gfpsAssemblyAttendances',
            'labelModel' => GfpsAssemblyPeriod::class,
            'payloadKey' => 'attendances',
            'auditAction' => 'gfps_assemblies',
            'auditSection' => 'GFPS Assemblies',
        ],
        self::EMPLOYEE_STATUSES => [
            'model' => EmployeeStatusBreakdown::class,
            'identity' => 'employment_status_id',
            'patchKey' => 'employment_status_id',
            'valueFields' => ['female_count', 'male_count'],
            'relation' => 'employeeStatusBreakdowns',
            'labelModel' => EmploymentStatus::class,
            'payloadKey' => 'breakdowns',
            'auditAction' => 'employee_statuses',
            'auditSection' => 'Employee Statuses',
        ],
        self::RSTL_MONTHLY => [
            'model' => RstlMonthlyBreakdown::class,
            'identity' => 'report_month_id',
            'patchKey' => 'report_month_id',
            'valueFields' => ['female_count', 'female_led_count', 'male_count', 'male_led_count'],
            'relation' => 'rstlMonthlyBreakdowns',
            'labelModel' => ReportMonth::class,
            'payloadKey' => 'breakdowns',
            'auditAction' => 'rstl_monthly',
            'auditSection' => 'RSTL Monthly',
        ],
        self::SCHOLARSHIP_APPLICANTS => [
            'model' => ScholarshipApplicantSummary::class,
            'identity' => 'scholarship_program_id',
            'patchKey' => 'scholarship_program_id',
            'valueFields' => ['female_count', 'male_count'],
            'relation' => 'scholarshipApplicantSummaries',
            'labelModel' => ScholarshipProgram::class,
            'payloadKey' => 'applicants',
            'auditAction' => 'scholarship_applicants',
            'auditSection' => 'Scholarship Applicants',
        ],
        self::PROGRAM_FUNDING => [
            'model' => ProgramFundingSummary::class,
            'identity' => 'funding_program_id',
            'patchKey' => 'funding_program_id',
            'valueFields' => [
                'female_projects',
                'female_amount',
                'male_projects',
                'male_amount',
                'funded_projects_count',
                'funded_projects_value',
                'training_participants',
                'jobs_total',
                'jobs_male',
                'jobs_female',
                'jobs_pwd',
                'jobs_senior_citizen',
                'jobs_ip',
                'jobs_4ps',
                'special_projects_research_male',
                'special_projects_research_female',
            ],
            'relation' => 'programFundingSummaries',
            'labelModel' => FundingProgram::class,
            'payloadKey' => 'summaries',
            'auditAction' => 'program_funding',
            'auditSection' => 'Program Funding',
        ],
    ];

    /**
     * @return array{
     *     model: class-string<Model>,
     *     identity: string,
     *     patchKey: string,
     *     valueFields: list<string>,
     *     relation: string,
     *     labelModel: class-string<Model>,
     *     payloadKey: string,
     *     auditAction: string,
     *     auditSection: string
     * }
     */
    public static function config(string $section): array
    {
        if (! array_key_exists($section, self::SECTIONS)) {
            throw new InvalidArgumentException("Unknown report row section [{$section}].");
        }

        return self::SECTIONS[$section];
    }
}
