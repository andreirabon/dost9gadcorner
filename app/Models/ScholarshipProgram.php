<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ScholarshipProgram extends Model
{
    use HasFactory;

    public const LEVEL_UNDERGRADUATE = 'undergraduate';

    public const LEVEL_GRADUATE = 'graduate';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'short_name',
        'slug',
        'level',
        'sort_order',
    ];

    public function scholarshipApplicantSummaries(): HasMany
    {
        return $this->hasMany(ScholarshipApplicantSummary::class);
    }
}
