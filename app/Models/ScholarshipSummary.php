<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScholarshipSummary extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'report_year_id',
        'school_year_id',
        'as_of_date',
        'female_count',
        'male_count',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'as_of_date' => 'date',
        ];
    }

    public function reportYear(): BelongsTo
    {
        return $this->belongsTo(ReportYear::class);
    }

    public function schoolYear(): BelongsTo
    {
        return $this->belongsTo(SchoolYear::class);
    }
}
