<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GfpsAssemblyPeriod extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'sort_order',
    ];

    public function gfpsAssemblyAttendances(): HasMany
    {
        return $this->hasMany(GfpsAssemblyAttendance::class);
    }
}
