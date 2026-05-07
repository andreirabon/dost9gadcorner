---
name: laravel-patterns
description: Comprehensive patterns for Laravel 13 development in this repository.
---

# Laravel Development Patterns

Comprehensive patterns for Laravel 13 development in this repository.

**Last Updated**: 2026-04-27

## Version Snapshot (Source of Truth)

- PHP: 8.3.x (^8.3)
- Laravel: 13.6.0
- Inertia Laravel: 3.0.6
- Pest: 4.6.3
- PHPUnit: 12.5.23

## Documentation-First Workflow (Required)

Before implementing Laravel behavior:

1. Use Laravel Boost `search-docs` first for version-specific guidance.
2. Use Context7 as supplemental confirmation for framework behavior.
3. Follow touched-module conventions when docs and local style differ.

## Project Reality Overrides (Highest Priority)

- Follow touched-module conventions first.
- This repository uses domain-grouped controllers and service classes under `app/Services/**`.
- Legacy module flows may use `switch($request->option)` (or equivalent branching); preserve this style where already present.
- Repository abstraction is optional and not required for every module.
- Validation is mixed across the codebase; prefer Form Requests for new or significantly changed mutation paths.
- Authorization boundaries are typically route middleware + role checks; policy usage is partial and should be improved incrementally.
- Runtime bootstrapping is Laravel 13 style via `bootstrap/app.php` and `bootstrap/providers.php`.
- Do not assume `app/Http/Kernel.php` or `app/Console/Kernel.php` exists in this repository.
- Treat examples in this rule as templates; adapt names and structure to the touched domain.

## Controller Patterns

### Single Responsibility Principle (SRP) — Core Rule

Every controller class should have **one, and only one, reason to change**. A controller that handles login, registration, profile updates, and password resets violates SRP because a change to registration logic risks breaking login logic.

In practice, this means:
- **Prefer Single Action Controllers** (`__invoke`) for new work — one controller = one action.
- **Keep controllers skinny** — controllers handle the HTTP layer only (accept request → delegate → return response). All business logic belongs in Service classes, Action classes, or Models.
- **Multi-method resource controllers** are acceptable for simple CRUD with ≤5 thin methods, but should be split if any method grows complex.

### Single Action Controller Pattern (Preferred for New Work)

For new features, create one controller per action using the `__invoke` method. This enforces SRP at the class level.

```php
<?php

namespace App\Http\Controllers\Admin\Markets;

use App\Http\Controllers\Controller;
use App\Models\Market;
use Inertia\Inertia;
use Inertia\Response;

class IndexMarketController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/markets/Index', [
            'markets' => Market::query()
                ->select(['id', 'name', 'status', 'created_at'])
                ->latest()
                ->paginate(20)
                ->withQueryString(),
            'filters' => request()->only(['search', 'status']),
        ]);
    }
}
```

```php
<?php

namespace App\Http\Controllers\Admin\Markets;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Markets\StoreMarketRequest;
use App\Services\Admin\Markets\SaveClass;
use Illuminate\Http\RedirectResponse;

class StoreMarketController extends Controller
{
    public function __invoke(StoreMarketRequest $request, SaveClass $service): RedirectResponse
    {
        $market = $service->store($request->validated());

        return to_route('admin.markets.show', $market)
            ->with('success', 'Market created successfully.');
    }
}
```

**Route registration for single action controllers:**
```php
Route::get('/admin/markets', IndexMarketController::class)->name('admin.markets.index');
Route::post('/admin/markets', StoreMarketController::class)->name('admin.markets.store');
```

### Thin Resource Controller Pattern (Acceptable for Simple CRUD)

When a resource has simple CRUD operations with no complex business logic, a resource controller with thin methods is acceptable. Each method must remain skinny — no business logic, just orchestration.

```php
<?php

namespace App\Http\Controllers\Admin\Markets;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Markets\StoreMarketRequest;
use App\Models\Market;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MarketController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/markets/Index', [
            'markets' => Market::query()
                ->select(['id', 'name', 'status', 'created_at'])
                ->latest()
                ->paginate(20)
                ->withQueryString(),
            'filters' => request()->only(['search', 'status']),
        ]);
    }

    public function store(StoreMarketRequest $request): RedirectResponse
    {
        $market = Market::query()->create($request->validated());

        return to_route('admin.markets.show', $market)
            ->with('success', 'Market created successfully.');
    }
}
```

**When to split a resource controller into single action controllers:**
- Any method exceeds ~15 lines
- Business logic creeps into the controller
- The controller mixes unrelated concerns (e.g., user auth + product management)
- Testing individual methods requires excessive setup

### Legacy Option Branching Pattern (Preserve in Existing Modules)

```php
public function store(Request $request)
{
    return match ($request->string('option')->toString()) {
        'create' => $this->saveClass->store($request),
        'update' => $this->saveClass->update($request),
        'delete' => $this->saveClass->destroy($request),
        default => abort(422, 'Invalid option.'),
    };
}
```
Use this pattern only where the module already follows this convention. For new modules, prefer single action controllers instead.

Form Request Validation
Form Requests are preferred for new complex mutations and refactors that already touch validation logic deeply.

Create a Form Request
shell
php artisan make:request Admin/Markets/StoreMarketRequest --no-interaction
Form Request Example
php
<?php

namespace App\Http\Requests\Admin\Markets;

use App\Models\Market;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMarketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Market::class) ?? false;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:4000'],
            'category' => ['required', Rule::in(['politics', 'finance', 'sports'])],
            'end_date' => ['required', 'date', 'after:now'],
            'status' => ['required', Rule::in(['draft', 'active'])],
        ];
    }

    public function messages(): array
    {
        return [
            'end_date.after' => 'End date must be in the future.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
        ]);
    }
}
Use Validated Data Only
php
public function update(UpdateMarketRequest $request, Market $market): RedirectResponse
{
    $market->fill($request->validated())->save();

    return back()->with('success', 'Market updated.');
}
Never mass-assign raw $request->all() for mutations.

### Skinny Controllers, Fat Services/Models — The SRP Flow

Controllers should **only** handle the HTTP request/response cycle. Business logic belongs in:

1. **Service Classes** — for business logic, orchestration, and transaction boundaries
2. **Action Classes** — for single-purpose domain operations (e.g., `RegisterUser`, `ProcessPayment`)
3. **Models** — for data-specific logic (relationships, scopes, accessors, mutators)

```
Controller (skinny)          →  Service/Action (fat)          →  Model (data)
─────────────────────────────────────────────────────────────────────────────
• Accept HTTP request         • Business rules                 • Relationships
• Validate (via FormRequest)  • Orchestrate multi-step flows   • Scopes
• Authorize                   • Transaction boundaries         • Accessors/Mutators
• Delegate to service/action  • External API calls             • Casts
• Return HTTP response        • Event dispatching              • fillable/guarded
```

### Service Layer Pattern

Service classes are common in this repository, often named `*Class`. Each service method should handle **one cohesive business operation** (SRP applied to services).

**Service Example**
```php
<?php

namespace App\Services\Admin\Markets;

use App\Models\Market;
use Illuminate\Support\Facades\DB;

class SaveClass
{
    /**
     * @param array{name: string, description?: string|null, category: string, end_date: string, status: string} $data
     */
    public function store(array $data): Market
    {
        return DB::transaction(function () use ($data): Market {
            return Market::query()->create($data);
        });
    }
}
```

**Action Class Example (Single Responsibility)**
```php
<?php

namespace App\Actions\Markets;

use App\Models\Market;
use Illuminate\Support\Facades\DB;

class CreateMarketAction
{
    /**
     * @param array{name: string, description?: string|null, category: string, end_date: string, status: string} $data
     */
    public function execute(array $data): Market
    {
        return DB::transaction(function () use ($data): Market {
            $market = Market::query()->create($data);

            event(new \App\Events\MarketCreated($market));

            return $market;
        });
    }
}
```

Use services/actions when business logic is non-trivial, reused, or requires transaction boundaries.

Repository Pattern (Optional)
Repository classes are optional. Only add abstraction when it clearly improves the touched module.

php
<?php

namespace App\Repositories;

use App\Models\Market;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MarketRepository
{
    public function paginateForIndex(int $perPage = 20): LengthAwarePaginator
    {
        return Market::query()
            ->select(['id', 'name', 'status', 'created_at'])
            ->latest()
            ->paginate($perPage);
    }
}
If direct Eloquent queries are already clear and localized, keep them.

Eloquent Model Patterns
Relationships, Casts, Scopes
php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Market extends Model
{
    protected $fillable = [
        'name',
        'description',
        'category',
        'status',
        'end_date',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'end_date' => 'datetime',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    public function scopeActive(Builder $query): void
    {
        $query->where('status', 'active')->where('end_date', '>', now());
    }

    public function scopeSearch(Builder $query, string $search): void
    {
        $query->where(function (Builder $builder) use ($search): void {
            $builder
                ->where('name', 'like', '%' . $search . '%')
                ->orWhere('description', 'like', '%' . $search . '%');
        });
    }
}
Query Scope Usage
php
$markets = Market::query()
    ->active()
    ->search((string) request('search', ''))
    ->with(['creator:id,name'])
    ->latest()
    ->paginate(20)
    ->withQueryString();
API Resource Pattern
Use API Resources to shape JSON payloads consistently and safely.

php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MarketResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'end_date' => $this->end_date?->toISOString(),
            'creator' => UserResource::make($this->whenLoaded('creator')),
            'positions_count' => $this->whenCounted('positions'),
            'analytics' => $this->when(
                $request->user()?->can('viewAnalytics', $this->resource),
                fn () => [
                    'volume' => $this->positions()->sum('amount'),
                ]
            ),
        ];
    }
}
Inertia Server-Side Patterns (Laravel)
Page Response
php
return Inertia::render('admin/markets/Index', [
    'markets' => Market::query()->latest()->paginate(20),
    'filters' => request()->only(['search', 'status']),
]);
Deferred Props
php
return Inertia::render('admin/markets/Index', [
    'markets' => Market::query()->latest()->paginate(20),
    'stats' => Inertia::defer(fn () => [
        'active_count' => Market::query()->active()->count(),
    ]),
]);
Infinite Scroll Payloads
php
return Inertia::render('admin/markets/Index', [
    'markets' => Inertia::scroll(
        Market::query()->latest()->paginate(20)
    ),
]);
Database Query Optimization
N+1 Prevention
php
// Good: eager load needed relations
$markets = Market::query()->with(['creator:id,name'])->get();

// Good: constrain eager load
$markets = Market::query()->with([
    'positions' => fn ($query) => $query->latest()->limit(10),
])->get();
Efficient Query Techniques
php
// Use exists for checks
$exists = Market::query()->where('name', $name)->exists();

// Use count directly
$activeCount = Market::query()->where('status', 'active')->count();

// Chunk for large processing
Market::query()->chunkById(200, function ($markets): void {
    foreach ($markets as $market) {
        // Process...
    }
});
Middleware Patterns
Custom Middleware
php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMarketIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $market = $request->route('market');

        if ($market !== null && ! $market->isActive()) {
            abort(404);
        }

        return $next($request);
    }
}
Register Middleware in bootstrap/app.php
php
<?php

use App\Http\Middleware\EnsureMarketIsActive;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'market.active' => EnsureMarketIsActive::class,
        ]);
    })
    ->create();
Jobs and Queue Patterns
Job Example
php
<?php

namespace App\Jobs;

use App\Models\Market;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RecalculateMarketStats implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;
    public int $timeout = 120;

    public function __construct(public Market $market)
    {
    }

    public function handle(): void
    {
        // Domain computation...
    }

    public function failed(?\Throwable $exception): void
    {
        report($exception);
    }
}
Dispatching
php
RecalculateMarketStats::dispatch($market);

RecalculateMarketStats::dispatch($market)->onQueue('calculations');

RecalculateMarketStats::dispatch($market)->delay(now()->addMinutes(2));
Event and Listener Pattern
Use events/listeners when behavior is naturally decoupled or asynchronous.

php
event(new MarketCreated($market));
Keep event-driven flows simple and observable. Avoid over-engineering where a direct service call is clearer.

Migration Patterns
When modifying existing columns, preserve all relevant column attributes in the migration to avoid unintentional changes.

php
Schema::table('markets', function (Blueprint $table): void {
    $table->string('name', 120)->nullable(false)->change();
});
Security and Data Integrity Guardrails
Authorize every protected action (middleware, gates, or policies).

Validate all user input server-side.

Use validated payloads for persistence.

Protect against mass assignment ($fillable or guarded strategy).

Avoid exposing sensitive fields in Inertia props or API Resources.

Wrap multi-write operations in transactions.

Testing Expectations
Add or update focused tests for changed behavior.

Prefer Pest for new tests:

php artisan make:test --pest Name --no-interaction

Run minimum relevant tests first:

php artisan test --compact --filter=...

php artisan test --compact tests/Feature/...

Anti-Patterns To Avoid

**SRP Violations:**
- God controllers that handle multiple unrelated concerns (auth + CRUD + reports in one class).
- Thick controllers with business logic, DB calls, and authorization mixed together.
- Service classes that grow to handle every operation for a domain (split into focused actions).
- Models that contain HTTP/request logic or controller-level orchestration.

**Architecture Anti-Patterns:**
- Introducing repository layers in simple CRUD modules without a clear need.
- Using unvalidated request payloads for writes.
- Adding global architecture rewrites during routine feature work.
- Relying on stale assumptions about kernel/bootstrap structure.

Remember: In this repository, strong Laravel work means adapting to local module reality first, then improving safety, clarity, and test coverage incrementally. Apply SRP incrementally — split controllers and services as they grow, not preemptively.
```
