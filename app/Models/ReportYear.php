<?php

namespace App\Models;

use Database\Factories\ReportYearFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $year
 * @property string|null $title
 */
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
        'published_at',
        'is_locked',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_locked' => 'boolean',
        ];
    }

    /**
     * Audit-log item label: the title when set, otherwise "Report Year {year}".
     */
    protected function label(): Attribute
    {
        return Attribute::get(fn (): string => $this->title !== null && $this->title !== ''
            ? $this->title
            : "Report Year {$this->year}");
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

    public function gfpsMemberStatusBreakdowns(): HasMany
    {
        return $this->hasMany(GfpsMemberStatusBreakdown::class);
    }

    /**
     * Snapshots newest first: by as_of_date, then by id for same-day entries.
     *
     * Ordered here so every consumer agrees on which snapshot is "latest".
     * Sorting the loaded collection instead is what previously went wrong:
     * chained sortByDesc() calls do not compose, the last one simply wins.
     *
     * Undated snapshots sort last, since NULL orders below any date in DESC.
     */
    public function scholarshipSnapshots(): HasMany
    {
        return $this->hasMany(ScholarshipSummary::class)
            ->orderByDesc('as_of_date')
            ->orderByDesc('id');
    }

    public function rstlMonthlyBreakdowns(): HasMany
    {
        return $this->hasMany(RstlMonthlyBreakdown::class);
    }

    public function programFundingSummaries(): HasMany
    {
        return $this->hasMany(ProgramFundingSummary::class);
    }

    public function scholarshipApplicantSummaries(): HasMany
    {
        return $this->hasMany(ScholarshipApplicantSummary::class);
    }
}
