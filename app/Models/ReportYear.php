<?php

namespace App\Models;

use Database\Factories\ReportYearFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ReportYear extends Model
{
    /** @use HasFactory<ReportYearFactory> */
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_PUBLISHED = 'published';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'year',
        'title',
        'description',
        'status',
        'color_theme',
        'background_image',
        'published_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function gfpsMembershipSummary(): HasOne
    {
        return $this->hasOne(GfpsMembershipSummary::class);
    }

    public function gfpsAssemblyAttendances(): HasMany
    {
        return $this->hasMany(GfpsAssemblyAttendance::class);
    }

    public function employeeStatusBreakdowns(): HasMany
    {
        return $this->hasMany(EmployeeStatusBreakdown::class);
    }

    public function scholarshipSummary(): HasOne
    {
        return $this->hasOne(ScholarshipSummary::class);
    }

    public function rstlMonthlyBreakdowns(): HasMany
    {
        return $this->hasMany(RstlMonthlyBreakdown::class);
    }

    public function programFundingSummaries(): HasMany
    {
        return $this->hasMany(ProgramFundingSummary::class);
    }
}
