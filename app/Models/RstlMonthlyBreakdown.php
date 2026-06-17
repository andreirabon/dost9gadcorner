<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RstlMonthlyBreakdown extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'report_year_id',
        'report_month_id',
        'female_count',
        'female_led_count',
        'non_binary_count',
        'genderqueer_count',
        'non_binary_led_count',
        'genderqueer_led_count',
        'male_count',
        'male_led_count',
    ];

    public function reportYear(): BelongsTo
    {
        return $this->belongsTo(ReportYear::class);
    }

    public function reportMonth(): BelongsTo
    {
        return $this->belongsTo(ReportMonth::class);
    }
}
