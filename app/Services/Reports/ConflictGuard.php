<?php

namespace App\Services\Reports;

use App\Models\ReportYear;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

final class ConflictGuard
{
    private const CONFLICT_MESSAGE = 'This section was modified by another user since you opened it. Please refresh to see the latest data.';

    /**
     * Assert a single-record section has not been modified since the client loaded it.
     *
     * Use for metadata (ReportYear itself), GFPS membership, and scholarship.
     *
     * @param  string|false|null  $expectedUpdatedAt  Pass `false` to skip the check entirely (backward compat).
     */
    public function assertFresh(?Model $model, string|false|null $expectedUpdatedAt): void
    {
        if ($expectedUpdatedAt === false) {
            return;
        }

        if ($expectedUpdatedAt === null && $model === null) {
            return;
        }

        if ($expectedUpdatedAt === null && $model !== null) {
            throw self::conflict();
        }

        if ($expectedUpdatedAt !== null && $model === null) {
            throw self::conflict();
        }

        /** @var Model $model */
        if ($model->updated_at?->toIso8601String() !== $expectedUpdatedAt) {
            throw self::conflict();
        }
    }

    /**
     * Assert a multi-row section has not been modified since the client loaded it.
     *
     * Use for assemblies, employee statuses, RSTL monthly, and program funding.
     * Compares against MAX(updated_at) across all rows for the report year.
     *
     * @param  string|false|null  $expectedUpdatedAt  Pass `false` to skip the check entirely (backward compat).
     */
    public function assertRelationFresh(
        ReportYear $reportYear,
        string $relationName,
        string|false|null $expectedUpdatedAt,
    ): void {
        if ($expectedUpdatedAt === false) {
            return;
        }

        $maxUpdatedAt = $reportYear->{$relationName}()->max('updated_at');

        if ($expectedUpdatedAt === null && $maxUpdatedAt === null) {
            return;
        }

        if ($expectedUpdatedAt === null && $maxUpdatedAt !== null) {
            throw self::conflict();
        }

        if ($expectedUpdatedAt !== null && $maxUpdatedAt === null) {
            throw self::conflict();
        }

        $actualTimestamp = \Illuminate\Support\Carbon::parse($maxUpdatedAt)->toIso8601String();

        if ($actualTimestamp !== $expectedUpdatedAt) {
            throw self::conflict();
        }
    }

    private static function conflict(): ValidationException
    {
        return ValidationException::withMessages([
            'conflict' => self::CONFLICT_MESSAGE,
        ]);
    }
}
