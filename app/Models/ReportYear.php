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

    /**
     * Convenience: latest active scholarship snapshot by as_of_date then id.
     */
    public function latestScholarshipSnapshot(): HasOne
    {
        return $this->hasOne(ScholarshipSummary::class)->ofMany(
            ['as_of_date' => 'max', 'id' => 'max'],
        );
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
