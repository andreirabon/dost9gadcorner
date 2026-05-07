---
name: patterns
description: Shared Laravel + Inertia + Vue patterns for consistent implementation.
---

# Common Patterns

Shared Laravel + Inertia + Vue patterns for consistent implementation.

**Last Updated**: 2026-04-27

## Version Snapshot (Source of Truth)

- PHP: 8.3.x (^8.3)
- Laravel: 13.6.0
- Inertia Laravel: 3.0.6
- Vue: 3.5.33
- @inertiajs/vue3: 3.0.3
- Tailwind CSS: 4.2.4

## Documentation-First Workflow (Required)

Before applying or changing framework behavior:

1. Use Laravel Boost `search-docs` first for version-specific guidance.
2. Use Context7 for supplemental docs/examples when needed.
3. If docs and touched-module conventions differ, follow touched-module conventions.

## Project Reality Overrides (Highest Priority)

- Follow touched-module conventions first.
- Backend commonly uses domain service classes named `*Class`; legacy modules may branch with controller `option` handling.
- **Single Responsibility Principle (SRP)**: Prefer Single Action Controllers (`__invoke`) for new features. Keep controllers skinny — HTTP orchestration only. Delegate business logic to services/actions/models.
- Inertia and `axios` are used together (Inertia for page navigation/render, axios for module interactions where already established).
- Frontend is mostly Vue SFCs with a mixed codebase; default to Vue Options API for new feature/page work unless the touched file is already `<script setup>`.
- Styling stack in active frontend paths is Tailwind v4 + Reka UI + Lucide icons, not BootstrapVue + SCSS-first.
- Runtime bootstrapping follows Laravel 13 via `bootstrap/app.php` and `bootstrap/providers.php`; do not rely on `app/Http/Kernel.php` / `app/Console/Kernel.php`.
- Repository interfaces are optional; direct service + Eloquent flows are common.

## Laravel API Response Format (for JSON endpoints)

```php
<?php

// For JSON API endpoints (non-Inertia)
return response()->json([
    'success' => true,
    'data' => $markets,
    'meta' => [
        'total' => $markets->total(),
        'page' => $markets->currentPage(),
        'per_page' => $markets->perPage(),
    ]
]);

// Error response
return response()->json([
    'success' => false,
    'message' => 'Resource not found',
    'errors' => $validator->errors()
], 404);

// Common module response envelope used in this repository
return response()->json([
    'status' => 'success',
    'message' => 'Saved successfully.',
    'info' => null,
    'data' => $payload,
]);
Keep one response envelope shape per endpoint/module. Do not mix success and status payload styles in the same endpoint flow.

typescript
// TypeScript interface for API responses
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
    meta?: {
        total: number;
        page: number;
        per_page: number;
    };
}

// JS-first modules may rely on runtime shape checks instead of TS interfaces.
Debounce Pattern (Vue 3 Options API)
vue
<script>
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            searchValue: '',
            debouncedValue: '',
            debounceTimeout: null,
        };
    },

    watch: {
        searchValue(newValue) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.debouncedValue = newValue;
            }, 300);
        },
    },

    beforeUnmount() {
        clearTimeout(this.debounceTimeout);
    },
});
</script>
Repository Pattern (Laravel)
Repository pattern is optional here. Use it only when the touched domain already follows repository abstractions or when explicitly requested.

php
<?php

namespace App\Repositories;

use App\Models\Market;
use Illuminate\Support\Collection;

// Repository Interface
interface MarketRepositoryInterface
{
    public function findAll(array $filters = []): Collection;
    public function findById(int $id): ?Market;
    public function create(array $data): Market;
    public function update(Market $market, array $data): Market;
    public function delete(Market $market): bool;
}

// Repository Implementation
class MarketRepository implements MarketRepositoryInterface
{
    public function __construct(
        protected Market $model
    ) {}

    public function findAll(array $filters = []): Collection
    {
        $query = $this->model->newQuery();

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        return $query->get();
    }

    public function findById(int $id): ?Market
    {
        return $this->model->find($id);
    }

    public function create(array $data): Market
    {
        return $this->model->create($data);
    }

    public function update(Market $market, array $data): Market
    {
        $market->update($data);
        return $market->fresh();
    }

    public function delete(Market $market): bool
    {
        return $market->delete();
    }
}
Service Layer Pattern (Laravel)

Service classes encapsulate business logic that doesn’t belong in controllers. Apply SRP: each service method should handle **one cohesive business operation**. When a service grows too large, split it into focused Action classes.

php
<?php

namespace App\Services;

use App\Models\Market;
use App\Repositories\MarketRepositoryInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class MarketService
{
    public function __construct(
        protected MarketRepositoryInterface $repository
    ) {}

    /**
     * Create a market with options in a transaction.
     */
    public function create(array $data): Market
    {
        return DB::transaction(function () use ($data) {
            $market = $this->repository->create([
                'name' => $data['name'],
                'description' => $data['description'],
                'category' => $data['category'],
                'creator_id' => auth()->id(),
            ]);

            // Create related options
            foreach ($data['options'] as $option) {
                $market->options()->create($option);
            }

            // Dispatch event
            event(new MarketCreated($market));

            return $market->load('options');
        });
    }

    /**
     * Update market with validation.
     */
    public function update(Market $market, array $data): Market
    {
        return DB::transaction(function () use ($market, $data) {
            $updated = $this->repository->update($market, $data);

            // Clear cache
            Cache::forget("market:{$market->id}");

            return $updated;
        });
    }
}
Inertia Response Pattern
In this repository, use Inertia for page-level rendering/navigation, and use axios for module-level partial table/filter interactions where that pattern already exists.

php
<?php

namespace App\Http\Controllers;

use App\Models\Market;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketController extends Controller
{
    /**
     * Display a listing of markets.
     */
    public function index(Request $request): Response
    {
        $markets = Market::query()
            ->when($request->input('search'), fn($q, $search) =>
                $q->where('name', 'like', "%{$search}%")
            )
            ->when($request->input('status'), fn($q, $status) =>
                $q->where('status', $status)
            )
            ->with(['creator:id,name'])
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Markets/Index', [
            'markets' => $markets,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show single market.
     */
    public function show(Market $market): Response
    {
        return Inertia::render('Markets/Show', [
            'market' => $market->load(['creator', 'options']),
        ]);
    }
}
Inertia Partial Reload Pattern (v3)
vue
<script>
import { defineComponent } from 'vue';
import { router } from '@inertiajs/vue3';

export default defineComponent({
    data() {
        return {
            filters: {
                search: '',
                status: '',
            },
        };
    },
    methods: {
        reloadTable() {
            router.get('/markets', this.filters, {
                only: ['markets', 'filters'],
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        },
    },
});
</script>
Inertia Form Pattern (Vue 3)
In touched files, follow the local form style (useForm or axios) rather than forcing one universal approach.

vue
<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { router, useForm } from '@inertiajs/vue3';

interface Market {
    id?: number;
    name: string;
    description: string;
    category: string;
}

export default defineComponent({
    props: {
        market: {
            type: Object as PropType<Market>,
            default: null,
        },
    },

    data() {
        return {
            form: useForm({
                name: this.market?.name || '',
                description: this.market?.description || '',
                category: this.market?.category || 'politics',
            }),
        };
    },

    methods: {
        submit() {
            if (this.market) {
                this.form.put(`/markets/${this.market.id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.reload({ only: ['markets'] });
                    },
                    onError: (errors) => {
                        console.error('Update failed:', errors);
                    },
                });
            } else {
                this.form.post('/markets', {
                    preserveScroll: true,
                    onSuccess: () => {
                        this.form.reset();
                    },
                    onError: (errors) => {
                        console.error('Creation failed:', errors);
                    },
                });
            }
        },
    },
});
</script>

<template>
    <form @submit.prevent="submit">
        <div>
            <input v-model="form.name" type="text" placeholder="Market name" />
            <span v-if="form.errors.name" class="error">
                {{ form.errors.name }}
            </span>
        </div>

        <div>
            <textarea v-model="form.description" placeholder="Description" />
            <span v-if="form.errors.description" class="error">
                {{ form.errors.description }}
            </span>
        </div>

        <button type="submit" :disabled="form.processing">
            {{ form.processing ? 'Saving...' : 'Save' }}
        </button>
    </form>
</template>
Middleware Alias Pattern (Laravel 13)
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
Eager Loading Pattern (Laravel)
php
<?php

// ❌ BAD: N+1 query problem
$markets = Market::all();
foreach ($markets as $market) {
    echo $market->creator->name; // N queries
}

// ✅ GOOD: Eager load relationships
$markets = Market::with('creator')->get();
foreach ($markets as $market) {
    echo $market->creator->name; // 2 queries total
}

// ✅ GOOD: Eager load with constraints
$markets = Market::with([
    'creator:id,name,email',
    'options' => fn($q) => $q->where('is_active', true),
    'positions' => fn($q) => $q->latest()->take(10)
])->get();
Computed Properties Pattern (Vue 3)
vue
<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Market {
    id: number;
    name: string;
    status: 'active' | 'closed';
}

export default defineComponent({
    props: {
        markets: {
            type: Array as PropType<Market[]>,
            required: true,
        },
    },

    data() {
        return {
            searchQuery: '',
        };
    },

    computed: {
        // Automatically cached
        activeMarkets(): Market[] {
            return this.markets.filter((m) => m.status === 'active');
        },

        filteredMarkets(): Market[] {
            if (!this.searchQuery) {
                return this.markets;
            }

            return this.markets.filter((m) => m.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
        },

        marketCount(): number {
            return this.filteredMarkets.length;
        },
    },
});
</script>

<template>
    <div>
        <input v-model="searchQuery" placeholder="Search markets..." />

        <p>Showing {{ marketCount }} markets</p>

        <MarketCard v-for="market in filteredMarkets" :key="market.id" :market="market" />
    </div>
</template>
Stack: Laravel 13 (bootstrap/app.php runtime) + Vue 3 (Options API preferred for new feature/page work) + Inertia v3 + Axios + Tailwind v4 + Reka UI + Lucide icons + MySQL 8.
```
