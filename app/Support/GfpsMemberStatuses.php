<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\EmploymentStatus;
use Illuminate\Database\Eloquent\Collection;

/**
 * The employment statuses the GFPS membership breakdown reports on.
 *
 * A subset of the `employment_statuses` lookup, named by slug in
 * `config('reports.gfps_member_status_slugs')`. The DOST IX Employees section
 * still reports the full lookup; only GFPS membership is narrowed, so the two
 * sections stay independent when a status is added to the lookup.
 */
class GfpsMemberStatuses
{
    /**
     * @return list<string>
     */
    public static function slugs(): array
    {
        $slugs = config('reports.gfps_member_status_slugs', []);

        return is_array($slugs) ? array_values(array_map(strval(...), $slugs)) : [];
    }

    /**
     * Reportable statuses in lookup order, so the edit form, the payload and the
     * chart all list them the same way.
     *
     * @return Collection<int, EmploymentStatus>
     */
    public static function all(): Collection
    {
        return EmploymentStatus::query()
            ->whereIn('slug', self::slugs())
            ->orderBy('sort_order')
            ->get();
    }

    /**
     * @return list<int>
     */
    public static function allowedIds(): array
    {
        return self::all()->pluck('id')->map(intval(...))->all();
    }
}
