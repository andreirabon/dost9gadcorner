<?php

namespace App\Services\Reports;

use App\Models\ReportYear;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

final class ConflictGuard
{
    private const CONFLICT_MESSAGE = 'This section was modified by another user since you opened it. Please refresh to see the latest data.';

    /**
     * Assert a single-record section has not been modified since the client loaded it.
     *
     * @param  string|null  $expectedUpdatedAt  `null` asserts the section had no record yet.
     */
    public function assertFresh(?Model $model, ?string $expectedUpdatedAt): void
    {
        self::assertMatches($model?->updated_at?->toIso8601String(), $expectedUpdatedAt);
    }

    /**
     * Assert a multi-row section has not been modified since the client loaded it,
     * comparing against MAX(updated_at) across the report year's rows.
     *
     * @param  string|null  $expectedUpdatedAt  `null` asserts the section had no rows yet.
     */
    public function assertRelationFresh(ReportYear $reportYear, string $relationName, ?string $expectedUpdatedAt): void
    {
        $maxUpdatedAt = $reportYear->{$relationName}()->max('updated_at');

        self::assertMatches(
            $maxUpdatedAt === null ? null : Carbon::parse($maxUpdatedAt)->toIso8601String(),
            $expectedUpdatedAt,
        );
    }

    private static function assertMatches(?string $actual, ?string $expected): void
    {
        if ($actual !== $expected) {
            throw ValidationException::withMessages(['conflict' => self::CONFLICT_MESSAGE]);
        }
    }
}
