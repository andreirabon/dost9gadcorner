<?php

namespace App\Services\Reports;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

final class SparseRowPatcher
{
    /**
     * @param  class-string<Model>  $modelClass
     * @param  array<int, array<string, mixed>>  $patches
     * @param  callable(array<string, mixed>): array{identity: array<string, mixed>, attributes: array<string, mixed>}|null  $mapPatch
     */
    public function apply(string $modelClass, array $patches, callable $mapPatch): void
    {
        DB::transaction(function () use ($modelClass, $patches, $mapPatch): void {
            foreach ($patches as $patch) {
                $mapped = $mapPatch($patch);

                if ($mapped === null || $mapped['attributes'] === []) {
                    continue;
                }

                $modelClass::query()->updateOrCreate(
                    $mapped['identity'],
                    $mapped['attributes'],
                );
            }
        });
    }
}
