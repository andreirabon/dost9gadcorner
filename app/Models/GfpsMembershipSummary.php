<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GfpsMembershipSummary extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'report_year_id',
        'female_count',
        'non_binary_count',
        'genderqueer_count',
        'male_count',
    ];

    public function reportYear(): BelongsTo
    {
        return $this->belongsTo(ReportYear::class);
    }
}
