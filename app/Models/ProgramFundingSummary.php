<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramFundingSummary extends Model
{
    /**
     * Money columns; every other value field is an integer count.
     *
     * @var list<string>
     */
    public const DECIMAL_FIELDS = ['female_amount', 'male_amount', 'funded_projects_value'];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'report_year_id',
        'funding_program_id',
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
    ];

    public function reportYear(): BelongsTo
    {
        return $this->belongsTo(ReportYear::class);
    }

    public function fundingProgram(): BelongsTo
    {
        return $this->belongsTo(FundingProgram::class);
    }
}
