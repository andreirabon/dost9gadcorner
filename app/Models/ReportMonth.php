<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportMonth extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'short_name',
        'month_number',
    ];

    public function rstlMonthlyBreakdowns(): HasMany
    {
        return $this->hasMany(RstlMonthlyBreakdown::class);
    }
}
