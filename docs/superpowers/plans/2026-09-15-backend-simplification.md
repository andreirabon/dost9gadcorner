# Backend Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove over-engineering from the Laravel backend without changing any HTTP, Inertia-prop, validation, authorization or audit-log behavior.

**Architecture:** Pure refactor, driven by the existing Pest feature suite. Each task first adds a characterization test for any behavior it touches that is not already covered, then deletes or collapses code, then re-runs the affected tests. Single-caller services fold into `ReportYearManagementController`. Repeated field lists derive from `RowSection::config(...)['valueFields']`.

**Tech Stack:** PHP 8.4, Laravel 12, Inertia v2 (Vue 3), Pest 3, SQLite in-memory for tests, Pint, PHPStan (`composer analyse`).

**Spec:** Ponytail audit findings from the 2026-09-15 session. The findings are restated in the Scope section below, which is the spec.

## Global Constraints

- No behavior change: routes, Inertia prop names and values, validation error keys and messages, policy outcomes, and audit-log rows must stay identical.
- No new Composer or npm dependencies.
- Do NOT delete or weaken existing tests (CLAUDE.md: "Do NOT delete tests without approval").
- Leave security code as it is: `LoginRequest` timing hash and throttles, `isSafeInternalRedirectTarget`, the `abort_if($reportYear->is_locked, ...)` guards, `PdfImage` path checks.
- Run `vendor/bin/pint --dirty --format agent` after each PHP task.
- Run tests with `php artisan test --compact <file or --filter>`.
- Commit messages follow `<type>: <description>` and end with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. Commit only when the user has approved committing for this run.

## Scope

In scope (task number in brackets):

1. Dead code: `HasFactory` on 13 models that have no factory, `Notifiable` on `User`, `ReportYear::latestScholarshipSnapshot`, empty `ProgramFundingSummary::casts()`, `HandleInertiaRequests::version()` and `resolveZiggyGroup()`, the `coverImageUrl` prop, and duplicate no-cache headers on the login page [T1]
2. `ConflictGuard` null-ladder collapse [T2]
3. Fold `SparseRecordPatcher`, `PatchReportYearAttributes` and `PatchRowSection` into the controller, and drop `RowSection['model']` [T3]
4. Deduplicate the controller's row mappers and the program-funding field maps (controller and transformer) [T4]
5. Program-funding request rules built from `valueFields`, `ValidatesSparsePatchPayload` switched to `Arr::hasAny`, unused `$keyField` parameter dropped [T5]
6. `ReportYearPolicy` role helper, and `User` helpers that duplicate the policy or the seeder constant [T6]
7. Small shrinks: `TrustedProxies`, `SecurityHeaders`, `StoreReportYearRequest` sanitizing, config readers, `ReportYear::label` accessor [T7]
8. Final verification [T8]

Out of scope (deliberately skipped):

- `auth:doctor` alias: `tests/Feature/ProductionCheckTest.php:32` asserts it, and removing it would need test deletion.
- Merging `toPublicDetailArray` into `toDetailArray`: low value, 4 test call sites, and it would leak `status`/`href` onto the public page.
- Migration squash (`schema:dump --prune`): needs production confirmation plus a separate SQLite dump for the in-memory test DB. Handled as a separate decision, see the end of this plan.

## File Map

| File | Change |
|------|--------|
| `app/Models/{EmployeeStatusBreakdown,EmploymentStatus,FundingProgram,GfpsAssemblyAttendance,GfpsAssemblyPeriod,GfpsMemberStatusBreakdown,GfpsMembershipSummary,ProgramFundingSummary,ReportMonth,RstlMonthlyBreakdown,ScholarshipApplicantSummary,ScholarshipProgram,ScholarshipSummary}.php` | T1: drop `HasFactory` |
| `app/Models/User.php` | T1: drop `Notifiable`. T6: `PRIMARY_ADMIN_USERNAME` const, drop 2 helpers |
| `app/Models/ReportYear.php` | T1: drop `latestScholarshipSnapshot`. T7: `label` accessor |
| `app/Models/ProgramFundingSummary.php` | T1: drop empty `casts()`. T4: `DECIMAL_FIELDS` const |
| `app/Http/Middleware/HandleInertiaRequests.php` | T1, T6 |
| `app/Http/Controllers/Auth/AuthenticatedSessionController.php` | T1, T6 |
| `app/Services/Reports/ConflictGuard.php` | T2 |
| `app/Services/Reports/{SparseRecordPatcher,PatchReportYearAttributes,PatchRowSection}.php` | T3: delete |
| `app/Services/Reports/RowSection.php` | T3: drop `model` key |
| `app/Http/Controllers/ReportYearManagementController.php` | T1, T3, T4, T7 |
| `app/Support/ReportYearTransformer.php` | T4 |
| `app/Http/Requests/Concerns/ValidatesSparsePatchPayload.php` | T5 |
| `app/Http/Requests/Update{EmployeeStatusBreakdowns,GfpsAssemblyAttendances,GfpsMemberStatusBreakdowns,ProgramFundingSummaries,RstlMonthlyBreakdowns,ScholarshipApplicantSummaries}Request.php` | T5 |
| `app/Policies/ReportYearPolicy.php` | T6 |
| `database/seeders/UserSeeder.php` | T6 |
| `app/Support/{TrustedProxies,GfpsMemberStatuses,FundingProgramScope}.php` | T7 |
| `app/Http/Middleware/SecurityHeaders.php` | T7 |
| `app/Http/Requests/StoreReportYearRequest.php` | T7 |
| `tests/Feature/ReportYearEditPropsTest.php` | T4: create |
| `tests/Feature/{Auth/LoginRedirectTest,ReportYearPartialPatchTest,SharedInertiaPropsTest,ReportManagementTest}.php` | add characterization tests |

---

### Task 0: Baseline

- [ ] **Step 1: Confirm a clean tree and a green suite**

Run: `git status` and then `php artisan test --compact`
Expected: clean tree and all tests pass. Record the pass count, because T8 must match it plus the tests this plan adds. If anything is already red, stop and report before touching code.

---

### Task 1: Delete dead code

**Files:**
- Modify: the 13 models listed in the File Map, `app/Models/User.php`, `app/Models/ReportYear.php:79-87`, `app/Models/ProgramFundingSummary.php:37-45`, `app/Http/Middleware/HandleInertiaRequests.php:21-29,61,68-75`, `app/Http/Controllers/Auth/AuthenticatedSessionController.php:15-26`, `app/Http/Controllers/ReportYearManagementController.php:181`
- Test: `tests/Feature/Auth/LoginRedirectTest.php`

**Interfaces:**
- Consumes: nothing
- Produces: `AuthenticatedSessionController::create(Request $request): Inertia\Response`

- [ ] **Step 1: Add a characterization test for the login page cache header**

Append to `tests/Feature/Auth/LoginRedirectTest.php`:

```php
test('the login page is never cached', function () {
    expect($this->get(route('login'))->headers->get('Cache-Control'))->toContain('no-store');
});
```

- [ ] **Step 2: Run it (it must pass before the change)**

Run: `php artisan test --compact --filter="the login page is never cached"`
Expected: PASS

- [ ] **Step 3: Remove `HasFactory` from the 13 factory-less models**

In each of `EmployeeStatusBreakdown`, `EmploymentStatus`, `FundingProgram`, `GfpsAssemblyAttendance`, `GfpsAssemblyPeriod`, `GfpsMemberStatusBreakdown`, `GfpsMembershipSummary`, `ProgramFundingSummary`, `ReportMonth`, `RstlMonthlyBreakdown`, `ScholarshipApplicantSummary`, `ScholarshipProgram` and `ScholarshipSummary` under `app/Models/`, delete these two lines:

```php
use Illuminate\Database\Eloquent\Factories\HasFactory;
```
```php
    use HasFactory;
```

Before deleting, confirm no caller exists. Grep for `(EmployeeStatusBreakdown|EmploymentStatus|FundingProgram|GfpsAssembly\w+|GfpsMember\w+|ProgramFundingSummary|ReportMonth|RstlMonthlyBreakdown|ScholarshipApplicantSummary|ScholarshipProgram|ScholarshipSummary)::factory` across `app`, `database` and `tests`. Expected: no matches.

- [ ] **Step 4: Drop `Notifiable` from `User`**

In `app/Models/User.php`, delete `// use Illuminate\Contracts\Auth\MustVerifyEmail;` and `use Illuminate\Notifications\Notifiable;`, then change:

```php
    use HasFactory, Notifiable;
```
to
```php
    use HasFactory;
```

Confirm with a grep for `->notify(|Notification::` in `app` and `tests`. Expected: no matches.

- [ ] **Step 5: Delete unused model code**

In `app/Models/ReportYear.php`, delete the whole `latestScholarshipSnapshot()` method and its docblock (lines 79-87).

In `app/Models/ProgramFundingSummary.php`, delete the whole `casts()` method and its docblock (lines 37-45).

- [ ] **Step 6: Trim `HandleInertiaRequests`**

Delete the `version()` method and its docblock (lines 21-29) and the `resolveZiggyGroup()` method (lines 68-75). Replace:

```php
                ...(new Ziggy($this->resolveZiggyGroup($request)))->toArray(),
```
with
```php
                ...(new Ziggy($user === null ? 'guest' : null))->toArray(),
```

- [ ] **Step 7: Let `NoCacheHeaders` own the login page headers**

In `AuthenticatedSessionController`, add `use Inertia\Response;` and replace `create()` with:

```php
    public function create(Request $request): Response
    {
        return Inertia::render('auth/Login', [
            'status' => $this->safeLoginStatus($request->session()->get('status')),
        ]);
    }
```

- [ ] **Step 8: Delete the dead `coverImageUrl` prop**

In `ReportYearManagementController::edit`, delete the line:

```php
                'coverImageUrl' => null,
```

`resources/js/types/reports.ts:202` already declares it optional (`coverImageUrl?: string | null`), so no TypeScript change is needed.

- [ ] **Step 9: Run the affected tests**

Run: `php artisan test --compact tests/Feature/Auth tests/Feature/SharedInertiaPropsTest.php tests/Feature/ZiggyRouteExposureTest.php tests/Feature/ReportManagementTest.php tests/Feature/DemoDataSeedingTest.php tests/Feature/DatabaseSeederTest.php`
Expected: PASS

- [ ] **Step 10: Format and commit**

```bash
vendor/bin/pint --dirty --format agent
git add app tests
git commit -m "refactor: remove dead backend code"
```

---

### Task 2: Collapse ConflictGuard

**Files:**
- Modify: `app/Services/Reports/ConflictGuard.php`
- Test: `tests/Feature/ReportConflictDetectionTest.php` (existing, 14 conflict cases)

**Interfaces:**
- Consumes: nothing
- Produces: unchanged public API: `assertFresh(?Model $model, ?string $expectedUpdatedAt): void` and `assertRelationFresh(ReportYear $reportYear, string $relationName, ?string $expectedUpdatedAt): void`

- [ ] **Step 1: Run the existing conflict tests (baseline)**

Run: `php artisan test --compact tests/Feature/ReportConflictDetectionTest.php`
Expected: PASS

- [ ] **Step 2: Replace the class body**

```php
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
```

Equivalence: the old code returned early only when both values were null, and otherwise threw on any mismatch. `null !== null` is false and `null !== 'x'` is true, so strict inequality gives the same result in every case. Every model involved uses timestamps, so an existing row never has a null `updated_at`.

- [ ] **Step 3: Run the tests**

Run: `php artisan test --compact tests/Feature/ReportConflictDetectionTest.php tests/Feature/ScholarshipSnapshotWriteTest.php`
Expected: PASS

- [ ] **Step 4: Format and commit**

```bash
vendor/bin/pint --dirty --format agent
git add app/Services/Reports/ConflictGuard.php
git commit -m "refactor: collapse ConflictGuard null checks"
```

---

### Task 3: Fold single-caller patch services into the controller

**Files:**
- Delete: `app/Services/Reports/SparseRecordPatcher.php`, `app/Services/Reports/PatchReportYearAttributes.php`, `app/Services/Reports/PatchRowSection.php`
- Modify: `app/Http/Controllers/ReportYearManagementController.php`, `app/Services/Reports/RowSection.php`
- Test: `tests/Feature/ReportYearPartialPatchTest.php` (add 2 tests); existing `ReportConflictDetectionTest`, `ScholarshipSnapshotWriteTest`, `GfpsMemberStatusTest`, `ScholarshipApplicantsTest`, `SpecialProjectsResearchTest`, `GiaFundingTest`, `FundingProgramScopeTest`, `AuditLoggerTest`, `ReportManagementTest`

**Interfaces:**
- Consumes: `ConflictGuard` (T2, unchanged API)
- Produces:
  - `ReportYearManagementController::SCHOLARSHIP_FIELDS` (private const `list<string>`)
  - private `upsertRows(ReportYear $reportYear, array $config, array $rows): void`
  - `RowSection::config()` shape without the `model` key

- [ ] **Step 1: Add characterization tests for `published_at` handling**

Append to `tests/Feature/ReportYearPartialPatchTest.php`. Add `use App\Models\ReportYear;` and `use App\Models\User;` if they are missing.

```php
test('re-saving a published report keeps its original publish time', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->published()->create([
        'year' => 2031,
        'published_at' => '2026-01-01 00:00:00',
    ]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", [
            'status' => ReportYear::STATUS_PUBLISHED,
            'title' => 'Renamed',
            'expected_updated_at' => $reportYear->updated_at->toIso8601String(),
        ])
        ->assertSessionHasNoErrors();

    expect($reportYear->fresh()->published_at->toDateString())->toBe('2026-01-01');
});

test('moving a report back to pending clears its publish time', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->published()->create(['year' => 2032]);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}", [
            'status' => ReportYear::STATUS_PENDING,
            'expected_updated_at' => $reportYear->updated_at->toIso8601String(),
        ])
        ->assertSessionHasNoErrors();

    expect($reportYear->fresh()->published_at)->toBeNull();
});
```

- [ ] **Step 2: Run the report-write tests (baseline, must pass)**

Run: `php artisan test --compact tests/Feature/ReportYearPartialPatchTest.php tests/Feature/ReportConflictDetectionTest.php tests/Feature/ScholarshipSnapshotWriteTest.php tests/Feature/GfpsMemberStatusTest.php tests/Feature/ScholarshipApplicantsTest.php tests/Feature/SpecialProjectsResearchTest.php tests/Feature/GiaFundingTest.php tests/Feature/FundingProgramScopeTest.php tests/Feature/AuditLoggerTest.php tests/Feature/ReportManagementTest.php`
Expected: PASS

- [ ] **Step 3: Update controller imports**

In `ReportYearManagementController`, remove these imports:

```php
use App\Services\Reports\PatchReportYearAttributes;
use App\Services\Reports\PatchRowSection;
use App\Services\Reports\SparseRecordPatcher;
```

Add these:

```php
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
```

Add this constant as the first member inside the class body:

```php
    private const SCHOLARSHIP_FIELDS = ['school_year_id', 'as_of_date', 'female_count', 'male_count'];
```

- [ ] **Step 4: Replace `update`, `updateMetadata` and `patchReportYearFields`**

```php
    public function update(UpdateReportYearRequest $request, ReportYear $reportYear, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchReportYearFields($request, $reportYear, $conflictGuard, ['year', 'title', 'description', 'status'], 'report_year.');
    }

    public function updateMetadata(UpdateReportYearMetadataRequest $request, ReportYear $reportYear, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchReportYearFields($request, $reportYear, $conflictGuard, ['year', 'title', 'description'], 'report_year.metadata_');
    }

    /**
     * Shared body of the two report-year attribute endpoints. They differ only
     * in which fields they may write and how the change is named in the audit
     * log; the authorization gate lives on each endpoint's FormRequest.
     *
     * @param  list<string>  $fields
     */
    private function patchReportYearFields(
        FormRequest $request,
        ReportYear $reportYear,
        ConflictGuard $conflictGuard,
        array $fields,
        string $auditActionPrefix,
    ): RedirectResponse {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertFresh($reportYear, $request->input('expected_updated_at'));

        $before = $reportYear->only($fields);
        $attributes = $request->safe()->only($fields);

        if (array_key_exists('status', $attributes)) {
            $attributes['published_at'] = $attributes['status'] === ReportYear::STATUS_PUBLISHED
                ? ($reportYear->published_at ?? now())
                : null;
        }

        if ($attributes !== []) {
            $reportYear->fill($attributes)->save();
        }

        $diff = AuditLogger::diff($before, $reportYear->only($fields));

        AuditLogger::record(
            $request->user(),
            $auditActionPrefix.AuditLogger::actionVerb($diff),
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            $diff,
            section: 'Report Year',
            column: AuditLogger::humanizeFields($diff),
        );

        return back();
    }
```

`$request->safe()->only($keys)` returns only the keys that are present, including keys whose value is null. That matches the old `array_intersect_key($validated, array_flip($fields))`.

- [ ] **Step 5: Replace `updateGfpsMembership`**

```php
    public function updateGfpsMembership(UpdateGfpsMembershipSummaryRequest $request, ReportYear $reportYear, ConflictGuard $conflictGuard): RedirectResponse
    {
        abort_if($reportYear->is_locked, 403, 'Report year is locked.');
        $conflictGuard->assertFresh($reportYear->gfpsMembershipSummary, $request->input('expected_updated_at'));

        $fields = ['female_count', 'male_count'];
        $before = $reportYear->gfpsMembershipSummary?->only($fields) ?? [];
        $attributes = $request->safe()->only($fields);

        if ($attributes !== []) {
            $reportYear->gfpsMembershipSummary()->updateOrCreate(['report_year_id' => $reportYear->id], $attributes);
        }

        $after = $reportYear->gfpsMembershipSummary?->fresh()?->only($fields) ?? [];
        $diff = AuditLogger::diff($before, $after);

        AuditLogger::record(
            $request->user(),
            'gfps_membership.'.AuditLogger::actionVerb($diff),
            $this->reportYearLabel($reportYear->title, $reportYear->year),
            $diff,
            section: 'GFPS Membership',
            column: AuditLogger::humanizeFields($diff),
        );

        return back();
    }
```

The `$after` read is copied as-is on purpose. On a first create it yields `[]` because the relation was cached as null. That looks like an audit-log gap, but fixing it is a behavior change: report it and leave it.

- [ ] **Step 6: Replace the scholarship field lists and the `updateScholarshipSnapshot` patch**

In `storeScholarshipSnapshot`, `updateScholarshipSnapshot` and `destroyScholarshipSnapshot`, replace every literal `['school_year_id', 'as_of_date', 'female_count', 'male_count']` with `self::SCHOLARSHIP_FIELDS`.

In `updateScholarshipSnapshot`, change the signature to drop `SparseRecordPatcher $patcher`:

```php
    public function updateScholarshipSnapshot(UpdateScholarshipSnapshotRequest $request, ReportYear $reportYear, ScholarshipSummary $scholarship, ConflictGuard $conflictGuard): RedirectResponse
```

Replace the `$patcher->applyToModel(...)` call, including the comment above it, with:

```php
        // Audit stamps ride along in the same save, and only when something
        // changed, so a no-op patch cannot bump updated_at past the client's token.
        $attributes = $request->safe()->only(self::SCHOLARSHIP_FIELDS);

        if ($attributes !== []) {
            $scholarship->fill([
                ...$attributes,
                'last_edited_by' => $request->user()?->id,
                'last_edited_at' => now(),
            ])->save();
        }
```

The `$before = $scholarship->only(self::SCHOLARSHIP_FIELDS);` line stays directly above this block.

- [ ] **Step 7: Replace the row-section plumbing**

Change each of the six row endpoints so they no longer inject `PatchRowSection`. Example for assemblies; apply the same edit to `updateEmployeeStatuses`, `updateGfpsMemberStatuses`, `updateRstlMonthly`, `updateScholarshipApplicants` and `updateProgramFunding`, keeping each one's own request class and `RowSection::*` constant:

```php
    public function updateGfpsAssemblies(UpdateGfpsAssemblyAttendancesRequest $request, ReportYear $reportYear, ConflictGuard $conflictGuard): RedirectResponse
    {
        return $this->patchRowSection($request, $reportYear, $conflictGuard, RowSection::GFPS_ASSEMBLIES);
    }
```

In `patchRowSection`, remove the `PatchRowSection $patchRowSection` parameter and replace:

```php
        $patchRowSection->apply($reportYear, $section, $submitted);
```
with
```php
        $this->upsertRows($reportYear, $config, $submitted);
```

Add this private method directly below `patchRowSection`:

```php
    /**
     * Rows without their identifying key, or with no value fields, are skipped
     * rather than written as empty records.
     *
     * @param  array{relation: string, identity: string, patchKey: string, valueFields: list<string>}  $config
     * @param  array<int, array<string, mixed>>  $rows
     */
    private function upsertRows(ReportYear $reportYear, array $config, array $rows): void
    {
        DB::transaction(function () use ($reportYear, $config, $rows): void {
            foreach ($rows as $row) {
                $attributes = Arr::only($row, $config['valueFields']);

                if (! array_key_exists($config['patchKey'], $row) || $attributes === []) {
                    continue;
                }

                $reportYear->{$config['relation']}()->updateOrCreate(
                    [$config['identity'] => $row[$config['patchKey']]],
                    $attributes,
                );
            }
        });
    }
```

`HasMany::updateOrCreate` scopes by and sets `report_year_id` itself, which replaces the old explicit `'report_year_id' => $reportYear->id`.

- [ ] **Step 8: Drop the `model` key from `RowSection`**

In `app/Services/Reports/RowSection.php`:
- Delete the 6 `'model' => ...::class,` lines.
- Delete `model: class-string<Model>,` from both array-shape docblocks.
- Delete these now-unused imports: `EmployeeStatusBreakdown`, `GfpsAssemblyAttendance`, `GfpsMemberStatusBreakdown`, `ProgramFundingSummary`, `RstlMonthlyBreakdown`, `ScholarshipApplicantSummary`.

Keep `Model`, because `labelModel: class-string<Model>` still uses it. In the class docblock, change "one patcher and one controller method" to "one controller method".

- [ ] **Step 9: Delete the three service files**

```bash
git rm app/Services/Reports/SparseRecordPatcher.php app/Services/Reports/PatchReportYearAttributes.php app/Services/Reports/PatchRowSection.php
```

Then grep for `SparseRecordPatcher|PatchReportYearAttributes|PatchRowSection` across `app`, `tests` and `routes`. Expected: no matches.

- [ ] **Step 10: Run the report-write tests**

Run: the same command as Step 2.
Expected: PASS, including the 2 new tests.

- [ ] **Step 11: Format and commit**

```bash
vendor/bin/pint --dirty --format agent
git add -A app tests
git commit -m "refactor: inline single-caller report patch services"
```

---

### Task 4: Deduplicate row mappers and program-funding field maps

**Files:**
- Create: `tests/Feature/ReportYearEditPropsTest.php`
- Modify: `app/Http/Controllers/ReportYearManagementController.php` (row helpers at the bottom and `edit()`), `app/Support/ReportYearTransformer.php:236-279`, `app/Models/ProgramFundingSummary.php`

**Interfaces:**
- Consumes: `RowSection::config(RowSection::PROGRAM_FUNDING)['valueFields']` (T3 shape)
- Produces:
  - `ProgramFundingSummary::DECIMAL_FIELDS` (public const `list<string>`)
  - private `femaleMaleRows(Collection $lookup, Collection $existing, string $idKey): array`
  - `zeroFilledRows(Collection $lookup, Collection $existing, callable $map): array` (now takes a Collection, not a Builder)

- [ ] **Step 1: Write characterization tests for the prop shapes**

Run: `php artisan make:test --pest ReportYearEditPropsTest --no-interaction`, then replace the file contents with:

```php
<?php

use App\Models\EmploymentStatus;
use App\Models\FundingProgram;
use App\Models\ReportYear;
use App\Models\User;
use Database\Seeders\ReportLookupSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(ReportLookupSeeder::class);
});

test('edit page program funding rows keep their prop shape and formatting', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $program = FundingProgram::query()->orderBy('sort_order')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $program->id,
        'female_amount' => '1234.5',
        'jobs_4ps' => 3,
        'special_projects_research_male' => 2,
    ]);

    $this->actingAs($user)
        ->get("/report-years/{$reportYear->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('reportYear.programFunding.0', 19)
            ->where('reportYear.programFunding.0.fundingProgramId', $program->id)
            ->where('reportYear.programFunding.0.slug', $program->slug)
            ->where('reportYear.programFunding.0.femaleAmount', '1234.50')
            ->where('reportYear.programFunding.0.maleAmount', '0.00')
            ->where('reportYear.programFunding.0.jobs4ps', 3)
            ->where('reportYear.programFunding.0.specialProjectsResearchMale', 2)
        );
});

test('edit page female and male count sections keep their prop shape', function () {
    $user = User::factory()->create();
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $status = EmploymentStatus::query()->where('slug', 'cos')->firstOrFail();

    $reportYear->employeeStatusBreakdowns()->create([
        'employment_status_id' => $status->id,
        'female_count' => 4,
        'male_count' => 1,
    ]);

    $this->actingAs($user)
        ->get("/report-years/{$reportYear->id}/edit")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('reportYear.employeeStatuses.0', 4)
            ->where('reportYear.employeeStatuses.1.employmentStatusId', $status->id)
            ->where('reportYear.employeeStatuses.1.label', 'COS')
            ->where('reportYear.employeeStatuses.1.femaleCount', 4)
            ->where('reportYear.employeeStatuses.1.maleCount', 1)
            ->has('reportYear.gfpsMemberStatuses', 3)
            ->has('reportYear.gfpsMemberStatuses.0', 4)
            ->has('reportYear.gfpsAssemblies.0', 4)
            ->has('reportYear.gfpsAssemblies.0.periodId')
        );
});

test('public report program funding rows keep float amounts and camel keys', function () {
    $reportYear = ReportYear::factory()->published()->create(['year' => 2025]);
    $setup = FundingProgram::query()->where('slug', 'like', 'setup-%')->orderBy('sort_order')->firstOrFail();

    $reportYear->programFundingSummaries()->create([
        'funding_program_id' => $setup->id,
        'male_amount' => '10.25',
        'jobs_senior_citizen' => 6,
    ]);

    $this->get(route('reports.show', $reportYear))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('year.reportData.setupFundingBreakdown.0.slug', $setup->slug)
            ->where('year.reportData.setupFundingBreakdown.0.maleAmount', 10.25)
            ->where('year.reportData.setupFundingBreakdown.0.jobsSeniorCitizen', 6)
            ->has('year.reportData.setupFundingBreakdown.0', 18)
        );
});
```

Check the fixtures in `database/seeders/ReportLookupSeeder.php` before running: `cos` sits at `sort_order` 2 in employment statuses, so it is index 1, and a setup program is the first `setup-%` row. If the seeder's order differs, adjust the index in the test (not the code) and note why.

- [ ] **Step 2: Run the new tests against the current code**

Run: `php artisan test --compact tests/Feature/ReportYearEditPropsTest.php`
Expected: PASS. These pin current behavior. If one fails, fix the test's fixture assumption, never the app code.

- [ ] **Step 3: Add the decimal field list to the model**

In `app/Models/ProgramFundingSummary.php` (T1 already removed `use HasFactory;`), add as the first member of the class:

```php
    /**
     * Money columns; every other value field is an integer count.
     *
     * @var list<string>
     */
    public const DECIMAL_FIELDS = ['female_amount', 'male_amount', 'funded_projects_value'];
```

- [ ] **Step 4: Replace the controller row helpers**

Add `use Illuminate\Support\Str;` and `use App\Models\ProgramFundingSummary;` to the controller imports.

In `edit()`, replace the three female/male row lines:

```php
                'gfpsAssemblies' => $this->editableGfpsAssemblyRows($reportYear),
                'employeeStatuses' => $this->editableEmployeeStatusRows($reportYear),
                'gfpsMemberStatuses' => $this->editableGfpsMemberStatusRows($reportYear),
```
with
```php
                'gfpsAssemblies' => $this->femaleMaleRows(
                    GfpsAssemblyPeriod::query()->orderBy('sort_order')->get(),
                    $reportYear->gfpsAssemblyAttendances->keyBy('gfps_assembly_period_id'),
                    'periodId',
                ),
                'employeeStatuses' => $this->femaleMaleRows(
                    EmploymentStatus::query()->orderBy('sort_order')->get(),
                    $reportYear->employeeStatusBreakdowns->keyBy('employment_status_id'),
                    'employmentStatusId',
                ),
                'gfpsMemberStatuses' => $this->femaleMaleRows(
                    GfpsMemberStatuses::all(),
                    $reportYear->gfpsMemberStatusBreakdowns->keyBy('employment_status_id'),
                    'employmentStatusId',
                ),
```

Delete these methods: `editableGfpsAssemblyRows`, `editableEmployeeStatusRows`, `editableGfpsMemberStatusRows`.

Replace `zeroFilledRows` with this Collection-based version and add `femaleMaleRows` below it:

```php
    /**
     * Every lookup row for a section, in lookup order, paired with the report
     * year's saved row for it — or nothing, which the mapper zero-fills. The
     * screen always offers the full list rather than only what was entered.
     *
     * @param  Collection<int, Model>  $lookup
     * @param  Collection<int, Model>  $existing  keyed by the lookup row's id
     * @param  callable(Model, ?Model): array<string, mixed>  $map
     * @return array<int, array<string, mixed>>
     */
    private function zeroFilledRows(Collection $lookup, Collection $existing, callable $map): array
    {
        return $lookup
            ->map(fn (Model $row): array => $map($row, $existing->get($row->getKey())))
            ->values()
            ->all();
    }

    /**
     * @param  Collection<int, Model>  $lookup
     * @param  Collection<int, Model>  $existing
     * @return array<int, array<string, int|string>>
     */
    private function femaleMaleRows(Collection $lookup, Collection $existing, string $idKey): array
    {
        return $this->zeroFilledRows($lookup, $existing, fn (Model $row, ?Model $saved): array => [
            $idKey => $row->getKey(),
            'label' => $row->name,
            'femaleCount' => (int) ($saved?->female_count ?? 0),
            'maleCount' => (int) ($saved?->male_count ?? 0),
        ]);
    }
```

In `editableRstlMonthlyRows` and `editableScholarshipApplicantRows`, add `->get()` to the lookup argument, e.g. `ReportMonth::query()->orderBy('month_number')->get()` and `ScholarshipProgram::query()->orderBy('sort_order')->get()`. Leave their mapper bodies unchanged.

Replace `editableProgramFundingRows` with:

```php
    /**
     * Money fields as fixed two-decimal strings so the inputs never show float noise.
     *
     * @return array<int, array<string, int|string>>
     */
    private function editableProgramFundingRows(ReportYear $reportYear): array
    {
        $valueFields = RowSection::config(RowSection::PROGRAM_FUNDING)['valueFields'];

        return $this->zeroFilledRows(
            FundingProgram::query()->orderBy('sort_order')->get(),
            $reportYear->programFundingSummaries->keyBy('funding_program_id'),
            fn (FundingProgram $program, ?Model $summary): array => [
                'fundingProgramId' => $program->id,
                'label' => $program->name,
                'slug' => $program->slug,
                ...collect($valueFields)->mapWithKeys(fn (string $field): array => [
                    Str::camel($field) => in_array($field, ProgramFundingSummary::DECIMAL_FIELDS, true)
                        ? number_format((float) ($summary?->{$field} ?? 0), 2, '.', '')
                        : (int) ($summary?->{$field} ?? 0),
                ])->all(),
            ],
        );
    }
```

`Str::camel('jobs_4ps')` returns `jobs4ps` and `Str::camel('special_projects_research_male')` returns `specialProjectsResearchMale`. Both match the existing keys, and Step 1's tests pin them.

- [ ] **Step 5: Replace the transformer's funding map**

In `app/Support/ReportYearTransformer.php`, add `use App\Services\Reports\RowSection;` and `use Illuminate\Support\Str;`. Replace the `->map(function (FundingProgram $program) use ($fundingSummaries): array { ... })` closure inside `transformFundingBreakdown` with:

```php
            ->map(function (FundingProgram $program) use ($fundingSummaries): array {
                /** @var ProgramFundingSummary|null $summary */
                $summary = $fundingSummaries->get($program->id);

                return [
                    'label' => (string) $program->name,
                    'slug' => (string) $program->slug,
                    ...collect(RowSection::config(RowSection::PROGRAM_FUNDING)['valueFields'])
                        ->mapWithKeys(fn (string $field): array => [
                            Str::camel($field) => in_array($field, ProgramFundingSummary::DECIMAL_FIELDS, true)
                                ? (float) ($summary?->{$field} ?? 0)
                                : (int) ($summary?->{$field} ?? 0),
                        ])
                        ->all(),
                ];
            })
```

Update that method's `@return` docblock to `array<int, array<string, int|float|string>>`.

- [ ] **Step 6: Run the tests**

Run: `php artisan test --compact tests/Feature/ReportYearEditPropsTest.php tests/Feature/ReportManagementTest.php tests/Feature/GfpsMemberStatusTest.php tests/Feature/ScholarshipApplicantsTest.php tests/Feature/SpecialProjectsResearchTest.php tests/Feature/GiaFundingTest.php tests/Feature/ReportHomepageTest.php tests/Feature/ReportYearSectionCoverageTest.php`
Expected: PASS

- [ ] **Step 7: Format and commit**

```bash
vendor/bin/pint --dirty --format agent
git add app tests
git commit -m "refactor: derive report row props from shared field lists"
```

---

### Task 5: Shrink sparse-patch validation

**Files:**
- Modify: `app/Http/Requests/Concerns/ValidatesSparsePatchPayload.php`, `app/Http/Requests/UpdateProgramFundingSummariesRequest.php`, and the 5 other callers: `UpdateEmployeeStatusBreakdownsRequest`, `UpdateGfpsAssemblyAttendancesRequest`, `UpdateGfpsMemberStatusBreakdownsRequest`, `UpdateRstlMonthlyBreakdownsRequest`, `UpdateScholarshipApplicantSummariesRequest`
- Test: existing `ReportYearPartialPatchTest`, `ReportManagementTest`, `SpecialProjectsResearchTest`, `GiaFundingTest`, `FundingProgramScopeTest`, `GfpsMemberStatusTest`, `ScholarshipApplicantsTest`, `ScholarshipSnapshotWriteTest`

**Interfaces:**
- Consumes: `RowSection::config(...)['valueFields']` and `ProgramFundingSummary::DECIMAL_FIELDS` (T4)
- Produces:
  - `assertEachItemHasPatchField(Validator $validator, array $items, array $valueFields, string $errorPrefix): void` (the `$keyField` parameter is removed)
  - `assertHasAtLeastOneField` (signature unchanged)

- [ ] **Step 1: Pin program-funding validation messages**

Append to `tests/Feature/ReportYearEditPropsTest.php`. Add `use App\Enums\UserRole;` at the top if it is missing.

```php
test('program funding validation still rejects bad amounts, counts and empty rows', function () {
    $user = User::factory()->create(['role' => UserRole::ADMINISTRATOR]);
    $reportYear = ReportYear::factory()->create(['year' => 2026]);
    $program = FundingProgram::query()->orderBy('sort_order')->firstOrFail();

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => [
                ['funding_program_id' => $program->id, 'female_amount' => '1000000000000', 'jobs_pwd' => 1.5],
            ],
        ])
        ->assertSessionHasErrors(['summaries.0.female_amount', 'summaries.0.jobs_pwd']);

    $this->actingAs($user)
        ->patch("/report-years/{$reportYear->id}/program-funding", [
            'summaries' => [['funding_program_id' => $program->id]],
        ])
        ->assertSessionHasErrors(['summaries.0' => 'At least one field must be provided besides the row identifier.']);
});
```

Run: `php artisan test --compact --filter="program funding validation still rejects"`
Expected: PASS

- [ ] **Step 2: Rewrite the trait**

Replace the body of `app/Http/Requests/Concerns/ValidatesSparsePatchPayload.php` with:

```php
<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Arr;

trait ValidatesSparsePatchPayload
{
    /**
     * @param  array<int, mixed>  $items
     * @param  list<string>  $valueFields
     */
    protected function assertEachItemHasPatchField(Validator $validator, array $items, array $valueFields, string $errorPrefix): void
    {
        foreach ($items as $index => $item) {
            if (is_array($item) && ! Arr::hasAny($item, $valueFields)) {
                $validator->errors()->add(
                    "{$errorPrefix}.{$index}",
                    'At least one field must be provided besides the row identifier.',
                );
            }
        }
    }

    /**
     * @param  array<string, mixed>  $payload
     * @param  list<string>  $allowedFields
     */
    protected function assertHasAtLeastOneField(Validator $validator, array $payload, array $allowedFields, string $errorKey = 'patch'): void
    {
        if (! Arr::hasAny($payload, $allowedFields)) {
            $validator->errors()->add($errorKey, 'At least one field must be provided.');
        }
    }
}
```

`Arr::hasAny` uses `array_key_exists` semantics, so a key present with a null value still counts, as it did before.

- [ ] **Step 3: Drop the identity-key argument at the 6 call sites**

In each file, delete the third argument line of `assertEachItemHasPatchField(...)`:

| File | Line to delete |
|------|----------------|
| `UpdateEmployeeStatusBreakdownsRequest.php` | `'employment_status_id',` |
| `UpdateGfpsMemberStatusBreakdownsRequest.php` | `'employment_status_id',` |
| `UpdateGfpsAssemblyAttendancesRequest.php` | `'period_id',` (line 51) |
| `UpdateRstlMonthlyBreakdownsRequest.php` | `'report_month_id',` |
| `UpdateScholarshipApplicantSummariesRequest.php` | `'scholarship_program_id',` |
| `UpdateProgramFundingSummariesRequest.php` | `'funding_program_id',` (replaced wholesale in Step 4) |

- [ ] **Step 4: Build program-funding rules from `valueFields`**

In `UpdateProgramFundingSummariesRequest.php`, add these imports:

```php
use App\Models\ProgramFundingSummary;
use App\Services\Reports\RowSection;
```

Replace `rules()` with:

```php
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $valueRules = collect(self::valueFields())->mapWithKeys(fn (string $field): array => [
            "summaries.*.{$field}" => in_array($field, ProgramFundingSummary::DECIMAL_FIELDS, true)
                ? ['sometimes', 'required', 'numeric', 'min:0', 'max:999999999999.99']
                : ['sometimes', 'required', 'integer', 'min:0', 'max:2147483647'],
        ])->all();

        return [
            'expected_updated_at' => ['sometimes', 'nullable', 'string'],
            'summaries' => ['required', 'array', 'min:1'],
            'summaries.*.funding_program_id' => ['required', 'integer', Rule::exists('funding_programs', 'id')],
            ...$valueRules,
        ];
    }

    /**
     * @return list<string>
     */
    private static function valueFields(): array
    {
        return RowSection::config(RowSection::PROGRAM_FUNDING)['valueFields'];
    }
```

Replace the `assertEachItemHasPatchField(...)` call inside `withValidator` with:

```php
            $this->assertEachItemHasPatchField($validator, $summaries, self::valueFields(), 'summaries');
```

- [ ] **Step 5: Run the tests**

Run: `php artisan test --compact tests/Feature/ReportYearEditPropsTest.php tests/Feature/ReportYearPartialPatchTest.php tests/Feature/ReportManagementTest.php tests/Feature/SpecialProjectsResearchTest.php tests/Feature/GiaFundingTest.php tests/Feature/FundingProgramScopeTest.php tests/Feature/GfpsMemberStatusTest.php tests/Feature/ScholarshipApplicantsTest.php tests/Feature/ScholarshipSnapshotWriteTest.php`
Expected: PASS

- [ ] **Step 6: Format and commit**

```bash
vendor/bin/pint --dirty --format agent
git add app tests
git commit -m "refactor: shrink sparse patch validation"
```

---

### Task 6: Consolidate role checks

**Files:**
- Modify: `app/Policies/ReportYearPolicy.php`, `app/Models/User.php`, `app/Http/Middleware/HandleInertiaRequests.php:49-50`, `app/Http/Controllers/Auth/AuthenticatedSessionController.php:48`, `database/seeders/UserSeeder.php:13`
- Test: `tests/Feature/SharedInertiaPropsTest.php` (add dataset test); existing `TesterRolePolicyTest`, `Auth/LoginRedirectTest`, `ReportManagementTest`, `UserManagementControllerTest`, `AuditLogControllerTest`, `DatabaseSeederTest`, `UserSeederTest`, `ProductionCheckTest`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `User::PRIMARY_ADMIN_USERNAME` (public const string `'ARR'`)
  - `ReportYearPolicy::delete(User $user, ?ReportYear $reportYear = null): bool`
  - `UserSeeder::PRIMARY_ADMIN_USERNAME` still exists (now an alias)

- [ ] **Step 1: Pin shared abilities per role**

Append to `tests/Feature/SharedInertiaPropsTest.php`:

```php
test('shared abilities match each role', function (UserRole $role, bool $canDelete, bool $canAccess) {
    $this->actingAs(User::factory()->create(['role' => $role]));

    $can = sharedProps()['auth']['user']['can'];

    expect($can['deleteReportYears'])->toBe($canDelete)
        ->and($can['accessReportYears'])->toBe($canAccess)
        ->and($can['manageUsers'])->toBeFalse();
})->with([
    'administrator' => [UserRole::ADMINISTRATOR, true, true],
    'gad' => [UserRole::GAD, true, true],
    'tester' => [UserRole::TESTER, false, true],
    'hr' => [UserRole::HR, false, true],
    'none' => [UserRole::None, false, false],
]);

test('only the primary administrator may manage users', function () {
    $this->actingAs(User::factory()->create(['username' => 'ARR', 'role' => UserRole::ADMINISTRATOR]));

    expect(sharedProps()['auth']['user']['can']['manageUsers'])->toBeTrue();
});
```

Run: `php artisan test --compact tests/Feature/SharedInertiaPropsTest.php`
Expected: PASS

- [ ] **Step 2: Rewrite `ReportYearPolicy`**

```php
<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\ReportYear;
use App\Models\User;

class ReportYearPolicy
{
    /**
     * Roles that may edit every data section of a report year.
     *
     * TESTER is included so the browser specs can exercise each tab, but it is
     * deliberately absent from create, update, publish, toggleLock, and delete
     * — a test run can fill sections in, never destroy a year or change what
     * the public site shows.
     */
    private const SECTION_EDITORS = [UserRole::ADMINISTRATOR, UserRole::GAD, UserRole::TESTER];

    private const YEAR_MANAGERS = [UserRole::ADMINISTRATOR, UserRole::GAD];

    public function viewAny(User $user): bool
    {
        return $user->role?->canAccessReportManagement() ?? false;
    }

    public function view(User $user, ReportYear $reportYear): bool
    {
        return $this->viewAny($user);
    }

    public function create(User $user): bool
    {
        return $this->hasRole($user, ...self::YEAR_MANAGERS);
    }

    public function update(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, UserRole::ADMINISTRATOR);
    }

    public function publish(User $user): bool
    {
        return $this->hasRole($user, UserRole::ADMINISTRATOR);
    }

    public function toggleLock(User $user, ?ReportYear $reportYear = null): bool
    {
        return $this->hasRole($user, ...self::YEAR_MANAGERS);
    }

    public function delete(User $user, ?ReportYear $reportYear = null): bool
    {
        return $this->hasRole($user, ...self::YEAR_MANAGERS);
    }

    public function updateMetadata(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS);
    }

    public function updateGfpsMembership(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS);
    }

    public function updateGfpsAssemblies(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS);
    }

    /**
     * GFPS membership data, but employment figures — HR owns the same split on
     * the Employees section, so they can enter it here too.
     */
    public function updateGfpsMemberStatuses(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::HR]);
    }

    public function updateScholarship(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::SCHOLARSHIP]);
    }

    public function deleteScholarship(User $user, ReportYear $reportYear): bool
    {
        return $this->updateScholarship($user, $reportYear);
    }

    public function updateEmployeeStatuses(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::HR]);
    }

    public function updateRstlMonthly(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::RSTL]);
    }

    public function updateProgramFunding(User $user, ReportYear $reportYear): bool
    {
        return $this->hasRole($user, ...self::SECTION_EDITORS, ...[UserRole::TOS]);
    }

    private function hasRole(User $user, UserRole ...$roles): bool
    {
        return in_array($user->role, $roles, true);
    }
}
```

PHP forbids a positional argument after argument unpacking (`...$a, UserRole::HR` is a compile error). That is why the extra role is unpacked from a one-element array (`...self::SECTION_EDITORS, ...[UserRole::HR]`). Enum cases in class constants are valid on PHP 8.1+.

- [ ] **Step 3: Replace the duplicate `User` helpers**

In `app/Models/User.php`:
- Add `public const PRIMARY_ADMIN_USERNAME = 'ARR';` above `$fillable`.
- Delete `shouldDefaultLoginToReportYears()` and `canDeleteReportYears()`.
- Change `isPrimaryAdministrator()` to:

```php
    public function isPrimaryAdministrator(): bool
    {
        return $this->role === UserRole::ADMINISTRATOR && $this->username === self::PRIMARY_ADMIN_USERNAME;
    }
```

In `database/seeders/UserSeeder.php`, change line 13 to:

```php
    public const PRIMARY_ADMIN_USERNAME = User::PRIMARY_ADMIN_USERNAME;
```

In `HandleInertiaRequests::share`, change:

```php
                    'deleteReportYears' => $user->canDeleteReportYears(),
```
to
```php
                    'deleteReportYears' => $user->can('delete', ReportYear::class),
```

In `AuthenticatedSessionController::store`, add `use App\Models\ReportYear;` and change:

```php
        $default = $user !== null && $user->shouldDefaultLoginToReportYears()
```
to
```php
        $default = $user !== null && $user->can('viewAny', ReportYear::class)
```

Grep for `canDeleteReportYears|shouldDefaultLoginToReportYears` across `app`, `tests` and `resources`. Expected: no matches.

- [ ] **Step 4: Run the tests**

Run: `php artisan test --compact tests/Feature/SharedInertiaPropsTest.php tests/Feature/TesterRolePolicyTest.php tests/Feature/Auth tests/Feature/ReportManagementTest.php tests/Feature/UserManagementControllerTest.php tests/Feature/AuditLogControllerTest.php tests/Feature/DatabaseSeederTest.php tests/Feature/UserSeederTest.php tests/Feature/ProductionCheckTest.php tests/Feature/GfpsMemberStatusTest.php tests/Feature/FundingProgramScopeTest.php`
Expected: PASS

- [ ] **Step 5: Format and commit**

```bash
vendor/bin/pint --dirty --format agent
git add app database tests
git commit -m "refactor: consolidate report year role checks"
```

---

### Task 7: Small shrinks

**Files:**
- Modify: `app/Support/TrustedProxies.php`, `app/Http/Middleware/SecurityHeaders.php`, `app/Http/Requests/StoreReportYearRequest.php`, `app/Support/GfpsMemberStatuses.php`, `app/Support/FundingProgramScope.php`, `app/Models/ReportYear.php`, `app/Http/Controllers/ReportYearManagementController.php`
- Test: `tests/Feature/ReportYearEditPropsTest.php` (add label test); existing `TrustedProxiesTest`, `SecurityHeadersTest`, `ReportManagementTest`, `FundingProgramScopeTest`, `GfpsMemberStatusTest`, `AuditLoggerTest`

**Interfaces:**
- Consumes: nothing new
- Produces: `ReportYear->label` (string accessor). `reportYearLabel()` is removed from the controller.

- [ ] **Step 1: Add the label test**

Append to `tests/Feature/ReportYearEditPropsTest.php`:

```php
test('a report year label falls back to the year when untitled', function () {
    expect(ReportYear::factory()->make(['year' => 2026, 'title' => null])->label)->toBe('Report Year 2026')
        ->and(ReportYear::factory()->make(['year' => 2026, 'title' => ''])->label)->toBe('Report Year 2026')
        ->and(ReportYear::factory()->make(['year' => 2026, 'title' => 'GAD Data'])->label)->toBe('GAD Data');
});
```

Run: `php artisan test --compact --filter="report year label falls back"`
Expected: FAIL. Before the accessor exists, `->label` returns null, so the test fails on `toBe('Report Year 2026')`.

- [ ] **Step 2: Add the accessor and use it**

In `app/Models/ReportYear.php`, add `use Illuminate\Database\Eloquent\Casts\Attribute;` and this method after `casts()`:

```php
    /**
     * Audit-log item label: the title when set, otherwise "Report Year {year}".
     */
    protected function label(): Attribute
    {
        return Attribute::get(fn (): string => $this->title !== null && $this->title !== ''
            ? $this->title
            : "Report Year {$this->year}");
    }
```

In `ReportYearManagementController`:
- Delete the private `reportYearLabel()` method and its docblock.
- Replace every `$this->reportYearLabel($reportYear->title, $reportYear->year)` with `$reportYear->label`.
- In `store()`, the argument is `$this->reportYearLabel($reportYear->title, $reportYear->year)` on the created model; replace it the same way.
- In `destroy()`, keep the `$label = ...` capture before `delete()`, now as `$label = $reportYear->label;`.

Grep for `reportYearLabel` in `app`. Expected: no matches.

Run: `php artisan test --compact --filter="report year label falls back"`
Expected: PASS

- [ ] **Step 3: Shrink `TrustedProxies::parse` (all 7 existing parse tests must stay green)**

Replace the method with:

```php
    /**
     * @return string|list<string>
     */
    public static function parse(mixed $configured): string|array
    {
        // '*' trusts every upstream hop. Only correct when the app is reachable
        // exclusively through a proxy that overwrites X-Forwarded-For itself.
        if (is_string($configured) && trim($configured) === '*') {
            return '*';
        }

        $proxies = is_array($configured) ? $configured : explode(',', is_string($configured) ? $configured : '');

        return array_values(array_filter(
            array_map(static fn (mixed $proxy): string => trim((string) $proxy), $proxies),
            static fn (string $proxy): bool => $proxy !== '',
        ));
    }
```

- [ ] **Step 4: Flatten `SecurityHeaders` CSP building**

Delete `shouldSendContentSecurityPolicy()` and `contentSecurityPolicy()`. Replace the CSP `if` block in `handle()` with:

```php
        if (config('app.csp_enabled', true) && ! app()->isLocal()) {
            $response->headers->set('Content-Security-Policy', implode('; ', [
                "default-src 'self'",
                "script-src 'self' 'nonce-{$nonce}'",
                // Styles cannot use the nonce: a nonce never applies to a `style`
                // attribute, and its mere presence makes browsers ignore
                // 'unsafe-inline'. Vue :style bindings and ApexCharts both emit
                // inline styles, so a nonce here blocks the sidebar and every chart.
                // style-src-attr would be tighter but Firefox ignores it and falls
                // back to style-src, which reintroduces the breakage.
                "style-src 'self' 'unsafe-inline'",
                // Fonts ship in the bundle via @fontsource; Google Fonts was removed
                // from the layout, so its origins no longer belong in the policy.
                "font-src 'self' data:",
                "img-src 'self' data: blob:",
                "connect-src 'self'",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'",
                "object-src 'none'",
            ]));
        }
```

- [ ] **Step 5: Reuse the sanitizer in `StoreReportYearRequest`**

Add `use App\Http\Requests\Concerns\EditsReportYearAttributes;` and `use EditsReportYearAttributes;` inside the class. Replace `prepareForValidation()` with:

```php
    protected function prepareForValidation(): void
    {
        $this->sanitizeReportYearText();
    }
```

(The trait's `reportYearAttributeRules()` reads the route model, but only when called, and this request never calls it.)

- [ ] **Step 6: Read owned config directly**

In `app/Support/GfpsMemberStatuses.php`, replace the `slugs()` body with:

```php
        return (array) config('reports.gfps_member_status_slugs', []);
```

In `app/Support/FundingProgramScope.php`, replace the `allowedSlugsFor()` body after the admin/null guard with:

```php
        return config('reports.funding_program_scopes', [])[$user->username] ?? null;
```

Do not use `config("reports.funding_program_scopes.{$user->username}")`. Usernames may contain `.`, which dot-notation would split, and a scoped user would silently become unrestricted.

- [ ] **Step 7: Run the tests**

Run: `php artisan test --compact tests/Feature/ReportYearEditPropsTest.php tests/Feature/TrustedProxiesTest.php tests/Feature/SecurityHeadersTest.php tests/Feature/ReportManagementTest.php tests/Feature/FundingProgramScopeTest.php tests/Feature/GfpsMemberStatusTest.php tests/Feature/AuditLoggerTest.php tests/Feature/AuditLogControllerTest.php tests/Feature/SpecialProjectsResearchTest.php`
Expected: PASS

- [ ] **Step 8: Format and commit**

```bash
vendor/bin/pint --dirty --format agent
git add app tests
git commit -m "refactor: small backend shrinks"
```

---

### Task 8: Final verification

- [ ] **Step 1: Full suite**

Run: `php artisan test --compact`
Expected: all pass. The count should equal the Task 0 baseline plus the new tests: 1 (T1) + 2 (T3) + 3 (T4) + 1 (T5) + 6 (T6: a 5-row dataset plus 1 test) + 1 (T7) = baseline + 14.

- [ ] **Step 2: Static analysis**

Run: `composer analyse`
Expected: no new errors compared with running the same command on the Task 0 commit. If new errors appear, fix the types, never by adding baseline entries.

- [ ] **Step 3: Frontend type check (prop removal sanity)**

Run: `npx vue-tsc --noEmit` (or the repo's `npm run` type-check script if `package.json` defines one)
Expected: no new errors.

- [ ] **Step 4: Line-count check**

Run: `git diff --stat <task-0-commit>..HEAD -- app database/seeders`
Expected: clearly net-negative in `app/` (target is about -300 lines). Report the actual number.

- [ ] **Step 5: Report back**

Summarize what each task removed, the test count, and the one behavior quirk found but deliberately not fixed: the GFPS membership audit entry on first create has empty `changes` (T3 Step 5).

---

## Deferred decision: migration squash

Not a task. It needs user sign-off first because:
- Every deployed database must already be migrated past `2026_09_02_063210`.
- Tests run on SQLite `:memory:`, so a MySQL-only dump would leave the test DB replaying pruned migrations. Both `database/schema/mysql-schema.sql` and `database/schema/sqlite-schema.sql` would have to be generated, which needs the `mysqldump` and `sqlite3` CLIs.

If approved, it becomes its own plan: `php artisan schema:dump --prune`, then generate the SQLite dump against a migrated SQLite file, then run the full suite.
