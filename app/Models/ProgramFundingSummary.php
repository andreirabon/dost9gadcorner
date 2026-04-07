<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramFundingSummary extends Model
{
    use HasFactory;

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
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'female_amount' => 'decimal:2',
            'male_amount' => 'decimal:2',
        ];
    }

    public function reportYear(): BelongsTo
    {
        return $this->belongsTo(ReportYear::class);
    }

    public function fundingProgram(): BelongsTo
    {
        return $this->belongsTo(FundingProgram::class);
    }
}
