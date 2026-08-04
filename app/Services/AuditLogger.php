<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;

final class AuditLogger
{
    /**
     * @param  array<string, mixed>  $changes
     */
    public static function record(
        ?User $actor,
        string $action,
        string $itemLabel,
        array $changes = [],
        ?string $section = null,
        ?string $column = null,
        ?string $row = null,
    ): void {
        AuditLog::create([
            'actor_id' => $actor?->id,
            'actor_username' => $actor?->username ?? 'system',
            'actor_role' => $actor?->role?->value,
            'action' => $action,
            'section' => $section,
            'column' => $column,
            'row' => $row,
            'item_label' => $itemLabel,
            'changes' => $changes,
        ]);
    }

    /**
     * Diff two flat attribute arrays into a field => {old, new} map of only what changed.
     *
     * @param  array<string, mixed>  $before
     * @param  array<string, mixed>  $after
     * @return array<string, array{old: mixed, new: mixed}>
     */
    public static function diff(array $before, array $after): array
    {
        $changed = [];

        foreach ($after as $key => $value) {
            if (($before[$key] ?? null) !== $value) {
                $changed[$key] = ['old' => $before[$key] ?? null, 'new' => $value];
            }
        }

        return $changed;
    }

    /**
     * @param  array<string, mixed>  $attrs
     * @return array<string, array{old: null, new: mixed}>
     */
    public static function created(array $attrs): array
    {
        return array_map(fn ($value) => ['old' => null, 'new' => $value], $attrs);
    }

    /**
     * @param  array<string, mixed>  $attrs
     * @return array<string, array{old: mixed, new: null}>
     */
    public static function removed(array $attrs): array
    {
        return array_map(fn ($value) => ['old' => $value, 'new' => null], $attrs);
    }

    /**
     * Humanize a diff's field keys into a comma-joined "Column" summary.
     *
     * @param  array<string, mixed>  $diff
     */
    public static function humanizeFields(array $diff): ?string
    {
        if ($diff === []) {
            return null;
        }

        return implode(', ', array_map(
            fn (string $field): string => ucwords(str_replace('_', ' ', $field)),
            array_keys($diff),
        ));
    }

    /**
     * "added" when every changed field's prior value was empty (null/''/0),
     * "updated" when at least one field actually held a prior value.
     *
     * @param  array<string, array{old: mixed, new: mixed}>  $diff
     */
    public static function actionVerb(array $diff): string
    {
        if ($diff === []) {
            return 'updated';
        }

        foreach ($diff as $entry) {
            if (! self::isEmptyValue($entry['old'] ?? null)) {
                return 'updated';
            }
        }

        return 'added';
    }

    private static function isEmptyValue(mixed $value): bool
    {
        if ($value === null || $value === '') {
            return true;
        }

        return is_numeric($value) && (float) $value === 0.0;
    }
}
