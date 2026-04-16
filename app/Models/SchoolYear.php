<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolYear extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'sort_order',
    ];

    public function scholarshipSummaries(): HasMany
    {
        return $this->hasMany(ScholarshipSummary::class);
    }
}
