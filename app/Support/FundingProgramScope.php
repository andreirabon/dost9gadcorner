<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\UserRole;
use App\Models\FundingProgram;
use App\Models\User;

/**
 * Resolves which funding programs a user is allowed to write.
 *
 * Regional TOS accounts are limited to their own province. The limit is applied
 * on the server (UpdateProgramFundingSummariesRequest); the edit screen reads
 * the same list purely to hide rows it would be rejected for anyway.
 */
class FundingProgramScope
{
    /**
     * Funding program slugs this user may write, or null when unrestricted.
     *
     * @return list<string>|null
     */
    public static function allowedSlugsFor(?User $user): ?array
    {
        if ($user === null || $user->role === UserRole::ADMINISTRATOR) {
            return null;
        }

        $scopes = config('reports.funding_program_scopes', []);

        if (! is_array($scopes) || ! array_key_exists($user->username, $scopes)) {
            return null;
        }

        $slugs = $scopes[$user->username];

        return is_array($slugs) ? array_values(array_map(strval(...), $slugs)) : [];
    }

    /**
     * Funding program ids this user may write, or null when unrestricted.
     *
     * @return list<int>|null
     */
    public static function allowedProgramIdsFor(?User $user): ?array
    {
        $slugs = self::allowedSlugsFor($user);

        if ($slugs === null) {
            return null;
        }

        return FundingProgram::query()
            ->whereIn('slug', $slugs)
            ->pluck('id')
            ->map(intval(...))
            ->all();
    }
}
