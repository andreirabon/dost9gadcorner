<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GfpsAssemblyAttendance extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'report_year_id',
        'gfps_assembly_period_id',
        'female_count',
        'male_count',
    ];

    public function reportYear(): BelongsTo
    {
        return $this->belongsTo(ReportYear::class);
    }

    public function gfpsAssemblyPeriod(): BelongsTo
    {
        return $this->belongsTo(GfpsAssemblyPeriod::class);
    }
}
