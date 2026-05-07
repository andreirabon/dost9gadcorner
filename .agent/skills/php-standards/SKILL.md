---
name: php-standards
description: Practical PHP standards for Laravel 13 applications in this repository.
---

# PHP Coding Standards & Best Practices

Practical PHP standards for Laravel 13 applications in this repository.

**Last Updated**: 2026-04-27

## Version Snapshot (Source of Truth)

- PHP: 8.3.x (^8.3)
- Laravel: 13.6.0
- Pest: 4.6.3
- PHPUnit: 12.5.23

## Documentation-First Workflow (Required)

Before enforcing a language/framework behavior:

1. Use Laravel Boost `search-docs` first for Laravel/Pest guidance.
2. Use Context7 for PHP language details when needed.
3. If docs and touched-file conventions differ, follow touched-file conventions.

## Project Reality Overrides (Highest Priority)

- Follow touched-file/module conventions first.
- Use modern PHP features incrementally; do not force broad rewrites in legacy files.
- Prefer explicit parameter and return types in new/changed methods.
- Constructor property promotion is preferred for new classes, not a mandatory retrofit.
- The codebase has mixed patterns (service `*Class`, mixed validation styles). Keep local consistency and improve safely.
- Runtime bootstrapping is Laravel 13 style (`bootstrap/app.php`, `bootstrap/providers.php`); do not assume legacy kernels are active.

## Core Style Baseline

- Follow PSR-12 and project formatting via Laravel Pint.
- Keep imports at the top of files.
- Use braces for all control structures.
- Prefer clear names over abbreviations.
- **Single Responsibility Principle**: Each class should have one reason to change. Keep classes focused on a single concern.

### Formatting Command

```bash
vendor/bin/pint --dirty --format agent
Type Declarations
Method Signatures
Add parameter and return types to new or significantly changed methods.

Use nullable and union types where they improve clarity.

Avoid changing many unrelated methods just for typing.

php
public function findByIdentifier(int|string $identifier): ?Market
{
    if (is_int($identifier)) {
        return Market::query()->find($identifier);
    }

    return Market::query()->where('slug', $identifier)->first();
}
Strict Types
declare(strict_types=1); is recommended in new PHP-only utility/domain files when consistent with surrounding module style.

Do not mass-add strict types across legacy files unless requested.

php
<?php
declare(strict_types=1);
Typed Properties
Use typed properties for service/DTO/internal objects.

For Eloquent models, prefer $casts for persisted attributes instead of typed public properties for database columns.

Constructors and Dependency Injection
Prefer constructor property promotion in new classes.

Inject interfaces/contracts/services, not facades.

php
class SaveClass
{
    public function __construct(
        private MarketRepository $repository,
        private \Psr\Log\LoggerInterface $logger,
    ) {
    }
}
Modern PHP Features (Use Pragmatically)
Match Expressions
php
public function getStatusColor(string $status): string
{
    return match ($status) {
        'active' => 'green',
        'resolved' => 'blue',
        'closed' => 'gray',
        default => 'red',
    };
}
Nullsafe Operator
php
$country = $user?->profile?->address?->country;
Enums
Use enums for bounded domain state (status, type, mode) when the touched module already uses enums or clearly benefits.

php
enum MarketStatus: string
{
    case Active = 'active';
    case Closed = 'closed';
}

class Market extends Model
{
    protected function casts(): array
    {
        return [
            'status' => MarketStatus::class,
        ];
    }
}
Readonly
readonly properties/classes are useful for DTO/value-object style classes.

Be mindful of PHP version-specific readonly write visibility behavior when designing inheritance.

php
readonly class MarketSummaryDto
{
    public function __construct(
        public int $id,
        public string $name,
        public string $status,
    ) {
    }
}
Named Arguments
Use named arguments for internal app methods when they improve readability.

Avoid named arguments for external/vendor APIs where parameter renames may cause compatibility risks.

php
$result = $this->searchMarkets(
    query: 'election',
    limit: 10,
    sortBy: 'volume',
);
Laravel-Oriented PHP Standards
Validation
Prefer Form Requests for new or significantly changed mutation flows.

Use $request->validated() / $request->safe() for persistence input.

Avoid unvalidated $request->all() writes.

php
public function store(StoreMarketRequest $request): RedirectResponse
{
    $market = Market::query()->create($request->validated());

    return to_route('markets.show', $market);
}
Configuration Access
Use config() in app code; never call env() outside config files.

php
$timezone = config('app.timezone');
Eloquent Relationships
Add explicit relationship return types.

Keep relationship names semantic and consistent (creator, positions, etc.).

php
public function creator(): BelongsTo
{
    return $this->belongsTo(User::class, 'creator_id');
}
Error Handling
Prefer transactional closure style for multi-write flows.

Catch specific exceptions where recovery is meaningful.

Log context without leaking secrets.

php
public function create(array $data): Market
{
    return DB::transaction(function () use ($data): Market {
        $market = Market::query()->create($data);

        foreach ($data['options'] as $option) {
            $market->options()->create($option);
        }

        return $market->load('options');
    });
}
PHPDoc Standards
Add PHPDoc where it adds clarity beyond native types.

Use array-shape docs for complex arrays.

Avoid redundant comments for obvious code.

php
/**
 * @param array{
 *   name: string,
 *   description?: string|null,
 *   category: string,
 *   options: array<int, array{name: string, probability: int|float}>
 * } $payload
 */
public function create(array $payload): Market
{
    // ...
}
Security Standards (PHP/Laravel)
Use Eloquent/query builder parameterization; avoid raw string interpolation in SQL.

Enforce mass-assignment protection with $fillable/$guarded.

Escape untrusted output by default (Blade {{ }} or equivalent safe rendering).

Validate and authorize server-side for every protected action.

Testing Standards
Use Pest for new tests.

Prefer focused, compact test runs before broad runs.

bash
php artisan test --compact --filter=market
php artisan test --compact tests/Feature/MarketTest.php
Optional: architecture tests may enforce stricter PHP standards (for example strict types) only when this is already part of the touched module/test suite conventions.

Anti-Patterns To Avoid
Massive type-only refactors in unrelated files.

Enforcing enums/readonly everywhere without clear domain benefit.

Injecting facades instead of contracts/services.

Mixing domain logic directly into controllers when service classes already organize that module.

Using env() in app code or raw $request->all() for writes.

**SRP Violations:**
- God classes that accumulate unrelated responsibilities over time.
- Controllers with embedded business logic, DB queries, and authorization interleaved.
- Service classes that grow to handle every operation for a domain (split into focused actions).

Remember: Good PHP standards here are incremental, context-aware, and test-backed. Improve correctness and clarity without destabilizing established module behavior. Apply SRP as classes grow — split when responsibilities diverge.
```
