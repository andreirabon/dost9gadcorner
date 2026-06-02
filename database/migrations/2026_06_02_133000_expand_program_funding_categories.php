<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $this->renameFundingProgram('setup', 'setup-zc-ic', 'SETUP ZC/IC', 1);
            $this->renameFundingProgram('cest', 'cest-zc-ic', 'CEST ZC/IC', 5);

            $timestamp = now();

            DB::table('funding_programs')->upsert([
                ['name' => 'SETUP ZC/IC', 'slug' => 'setup-zc-ic', 'sort_order' => 1, 'created_at' => $timestamp, 'updated_at' => $timestamp],
                ['name' => 'SETUP ZSP', 'slug' => 'setup-zsp', 'sort_order' => 2, 'created_at' => $timestamp, 'updated_at' => $timestamp],
                ['name' => 'SETUP ZDS', 'slug' => 'setup-zds', 'sort_order' => 3, 'created_at' => $timestamp, 'updated_at' => $timestamp],
                ['name' => 'SETUP ZDN', 'slug' => 'setup-zdn', 'sort_order' => 4, 'created_at' => $timestamp, 'updated_at' => $timestamp],
                ['name' => 'CEST ZC/IC', 'slug' => 'cest-zc-ic', 'sort_order' => 5, 'created_at' => $timestamp, 'updated_at' => $timestamp],
                ['name' => 'CEST ZSP', 'slug' => 'cest-zsp', 'sort_order' => 6, 'created_at' => $timestamp, 'updated_at' => $timestamp],
                ['name' => 'CEST ZDS', 'slug' => 'cest-zds', 'sort_order' => 7, 'created_at' => $timestamp, 'updated_at' => $timestamp],
                ['name' => 'CEST ZDN', 'slug' => 'cest-zdn', 'sort_order' => 8, 'created_at' => $timestamp, 'updated_at' => $timestamp],
            ], ['slug'], ['name', 'sort_order', 'updated_at']);
        });
    }

    public function down(): void
    {
        DB::transaction(function (): void {
            $this->renameFundingProgram('setup-zc-ic', 'setup', 'SETUP', 1);
            $this->renameFundingProgram('cest-zc-ic', 'cest', 'CEST', 2);

            DB::table('funding_programs')
                ->whereIn('slug', ['setup-zsp', 'setup-zds', 'setup-zdn', 'cest-zsp', 'cest-zds', 'cest-zdn'])
                ->delete();
        });
    }

    private function renameFundingProgram(string $fromSlug, string $toSlug, string $name, int $sortOrder): void
    {
        $source = DB::table('funding_programs')
            ->select(['id'])
            ->where('slug', $fromSlug)
            ->first();

        if ($source === null) {
            return;
        }

        if ($fromSlug !== $toSlug) {
            $targetExists = DB::table('funding_programs')
                ->where('slug', $toSlug)
                ->exists();

            if ($targetExists) {
                return;
            }
        }

        DB::table('funding_programs')
            ->where('id', $source->id)
            ->update([
                'name' => $name,
                'slug' => $toSlug,
                'sort_order' => $sortOrder,
                'updated_at' => now(),
            ]);
    }
};
