---
name: review
description: Pull Request review, code analysis for Laravel + Vue 3 + Inertia.js applications, focusing on quality, security, maintainability, and performance.
---

# Code Review Context

**Mode**: Pull Request review, code analysis for Laravel + Vue 3 + Inertia.js applications
**Focus**: Quality, security, maintainability, performance
**Goal**: Provide constructive feedback with actionable improvements

**Last Updated**: 2026-04-27

## Version Snapshot (Source of Truth)

- PHP: 8.3.x (^8.3)
- Laravel: 13.6.0
- Inertia Laravel: 3.0.6
- @inertiajs/vue3: 3.0.3
- Vue: 3.5.33
- Tailwind CSS: 4.2.4
- Vite: 8.0.9
- Pest: 4.6.3
- PHPUnit: 12.5.23

## Project Reality Overrides (Highest Priority)

- Review against existing module conventions first (do not force idealized patterns across legacy modules).
- Backend often uses service classes under `app/Services/**` with `*Class` naming and controller `option` branching.
- Authorization is commonly enforced by route middleware/role checks, with policies used in some modules.
- Frontend is JS-first Vue Options API with Inertia + axios coexistence.
- UI conventions are Tailwind CSS v4 + Reka UI / Lucide icons in this repository, and TS/lint/frontend test tooling may still be optional by branch.
- Laravel runtime wiring is centered in `bootstrap/app.php` + `bootstrap/providers.php`; do not assume legacy kernel registration paths.

## Documentation-First Review (Required)

- Validate Laravel/Inertia/Pest review guidance with Laravel Boost `search-docs` first.
- Use Context7 as supplemental source for non-Laravel libraries and ecosystem tooling.
- If docs and touched-module conventions conflict, prioritize touched-module conventions and explain the trade-off in review feedback.

## Core Review Principles

1. **Read Thoroughly** - Understand the full context before commenting
2. **Be Constructive** - Suggest fixes, don't just point out problems
3. **Prioritize by Severity** - Critical > High > Medium > Low
4. **Be Specific** - Reference exact lines, provide code examples
5. **Check Security** - ALWAYS look for vulnerabilities first
6. **Verify Tests** - Ensure adequate test coverage
7. **Consider Performance** - Flag potential performance issues
8. **Maintain Standards** - Enforce PSR-12 (PHP) and project conventions (Vue)

## Review Process

### Phase 1: Overview (2 minutes)

- What is the PR trying to accomplish?
- What files are changed? (Backend, Frontend, Both?)
- Are there tests included?
- Is there a migration/database change?
- Are dependencies added/removed?

### Phase 2: Security Review (5 minutes) - CRITICAL

- SQL injection risks
- XSS vulnerabilities
- CSRF protection
- Authentication/Authorization
- Mass assignment protection
- Input validation
- Secret exposure
- File upload security

### Phase 3: Code Quality Review (10 minutes)

- Logic errors and edge cases
- Error handling
- Code duplication
- Naming conventions
- Method/function size
- Complexity
- Comments and documentation

### Phase 4: Performance Review (5 minutes)

- N+1 query problems
- Missing eager loading
- Unnecessary database calls
- Large payload sizes
- Missing pagination
- Inefficient algorithms

### Phase 5: Testing Review (5 minutes)

- Test coverage for new code
- Edge cases tested
- Error scenarios tested
- Integration tests for new features
- E2E tests for critical flows

### Phase 6: Final Check (3 minutes)

- PSR-12 compliance (PHP)
- ESLint compliance (if configured)
- TypeScript compilation (if TS-enabled)
- No console.log() left in code
- Documentation updated (only if requested)

## Backend (Laravel/PHP) Review Checklist

### 🔴 CRITICAL (Security)

#### SQL Injection

````php
// ❌ CRITICAL: SQL injection risk
$markets = DB::select("SELECT * FROM markets WHERE id = $id");

// ✅ CORRECT: Use parameter binding
$markets = DB::select("SELECT * FROM markets WHERE id = ?", [$id]);

// ✅ BETTER: Use Eloquent
$markets = Market::find($id);
Mass Assignment
php
// ❌ CRITICAL: Mass assignment vulnerability
class Market extends Model
{
    // No $fillable or $guarded defined
}

// ✅ CORRECT: Define fillable fields
class Market extends Model
{
    protected $fillable = ['name', 'description', 'category'];
}
Authorization
php
// ❌ HIGH: Missing authorization check
public function update(Request $request, Market $market)
{
    $market->update($request->validated());
}

// ✅ CORRECT: Enforce module authorization boundary (policy or middleware/role check)
public function update(UpdateMarketRequest $request, Market $market)
{
    $this->authorize('update', $market);
    $market->update($request->validated());
}
Input Validation
php
// ❌ HIGH: No validation
public function store(Request $request)
{
    Market::create($request->all());
}

// ✅ CORRECT: Use validated allowlisted input (Form Request preferred for new complex flows)
public function store(StoreMarketRequest $request)
{
    Market::create($request->validated());
}
Secret Exposure
php
// ❌ CRITICAL: Hardcoded secrets
$apiKey = 'sk-1234567890abcdef';

// ✅ CORRECT: Use environment variables
$apiKey = config('services.api.key');
🟡 HIGH (Code Quality)
N+1 Query Problem
php
// ❌ HIGH: N+1 query problem
$markets = Market::all();
foreach ($markets as $market) {
    echo $market->creator->name; // N queries
}

// ✅ CORRECT: Eager load relationships
$markets = Market::with('creator')->get();
foreach ($markets as $market) {
    echo $market->creator->name; // 2 queries
}
Business Logic in Controllers
php
// ❌ HIGH: Business logic in controller
public function store(Request $request)
{
    DB::transaction(function () use ($request) {
        $market = Market::create($request->all());
        foreach ($request->options as $option) {
            $market->options()->create($option);
        }
        // ... 50 more lines of logic
    });
}

// ✅ CORRECT: Delegate to existing service class pattern
public function store(StoreMarketRequest $request)
{
    return $this->saveClass->store($request);
}
Missing Database Transactions
php
// ❌ HIGH: No transaction for multi-step operation
public function resolve(Market $market, $winningOptionId)
{
    $market->update(['status' => 'resolved']);
    $market->positions()->where('option_id', $winningOptionId)
        ->update(['is_winning' => true]);
}

// ✅ CORRECT: Use transaction
public function resolve(Market $market, $winningOptionId)
{
    DB::transaction(function () use ($market, $winningOptionId) {
        $market->update(['status' => 'resolved']);
        $market->positions()->where('option_id', $winningOptionId)
            ->update(['is_winning' => true]);
    });
}
Missing Type Declarations
php
// ❌ MEDIUM: Missing type declarations
public function calculateTotal($items)
{
    return array_sum($items);
}

// ✅ CORRECT: Full type declarations
public function calculateTotal(array $items): float
{
    return array_sum(array_column($items, 'price'));
}
Large Methods
php
// ❌ MEDIUM: Method too large (>50 lines)
public function process()
{
    // ... 100 lines of code
}

// ✅ CORRECT: Break into smaller methods
public function process()
{
    $this->validateData();
    $this->prepareData();
    $this->saveData();
    $this->notifyUsers();
}
🟢 MEDIUM (Best Practices)
Missing Indexes
php
// ❌ MEDIUM: Missing index on frequently queried column
Schema::create('markets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('creator_id'); // No index
    $table->string('status'); // No index
});

// ✅ CORRECT: Add indexes
Schema::create('markets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('creator_id')->constrained()->cascadeOnDelete();
    $table->string('status')->index();
});
Magic Numbers
php
// ❌ LOW: Magic numbers
if ($market->volume > 10000) {
    // ...
}

// ✅ CORRECT: Named constants
class Market extends Model
{
    const VOLUME_THRESHOLD = 10000;
}

if ($market->volume > Market::VOLUME_THRESHOLD) {
    // ...
}
Frontend (Vue 3 / JS-first) Review Checklist
🔴 CRITICAL (Security)
XSS Vulnerability
vue
<!-- ❌ CRITICAL: XSS risk with v-html -->
<template>
    <div v-html="userInput"></div>
</template>

<!-- ✅ CORRECT: Use text interpolation (auto-escaped) -->
<template>
    <div>{{ userInput }}</div>
</template>

<!-- ✅ OK: If HTML is needed, sanitize first -->
<template>
    <div v-html="sanitizedHtml"></div>
</template>

<script lang="ts">
export default defineComponent({
    computed: {
        sanitizedHtml(): string {
            return DOMPurify.sanitize(this.userInput);
        },
    },
});
</script>
Exposed Secrets
typescript
// ❌ CRITICAL: API key in frontend
const API_KEY = "sk-1234567890abcdef";

// ✅ CORRECT: Use backend proxy
// Never put secrets in frontend code
🟡 HIGH (Code Quality)
Missing Prop Validation
vue
<!-- ❌ HIGH: No prop validation -->
<script>
export default defineComponent({
    props: ["market", "user"],
});
</script>

<!-- ✅ CORRECT: Explicit prop validation (JS-first) -->
<script>
export default defineComponent({
    props: {
        market: {
            type: Object,
            required: true,
        },
        user: {
            type: Object,
            default: null,
        },
    },
});
</script>
Unhandled Form Errors
vue
<!-- ❌ HIGH: No error handling -->
<template>
    <form @submit.prevent="submit">
        <input v-model="form.name" />
        <button :disabled="form.processing">Submit</button>
    </form>
</template>

<!-- ✅ CORRECT: Display validation errors -->
<template>
    <form @submit.prevent="submit">
        <input v-model="form.name" />
        <span v-if="form.errors.name" class="error">
            {{ form.errors.name }}
        </span>
        <button :disabled="form.processing">Submit</button>
    </form>
</template>
Missing Loading States
vue
<!-- ❌ MEDIUM: No loading indicator -->
<template>
    <button @click="submit">Submit</button>
</template>

<!-- ✅ CORRECT: Show loading state -->
<template>
    <button @click="submit" :disabled="form.processing">
        {{ form.processing ? "Submitting..." : "Submit" }}
    </button>
</template>
Computed Property with Side Effects
vue
<!-- ❌ HIGH: Computed property with side effects -->
<script lang="ts">
export default defineComponent({
    computed: {
        total(): number {
            this.saveToLocalStorage(); // ❌ Side effect in computed
            return this.items.reduce((sum, item) => sum + item.price, 0);
        },
    },
});
</script>

<!-- ✅ CORRECT: Use watcher for side effects -->
<script lang="ts">
export default defineComponent({
    computed: {
        total(): number {
            return this.items.reduce((sum, item) => sum + item.price, 0);
        },
    },
    watch: {
        total(newTotal) {
            this.saveToLocalStorage(newTotal);
        },
    },
});
</script>
🟢 MEDIUM (Best Practices)
Large Component Files
vue
<!-- ❌ MEDIUM: Component too large (>300 lines) -->
<script lang="ts">
export default defineComponent({
    // ... 400 lines of code
});
</script>

<!-- ✅ CORRECT: Split into smaller components -->
<!-- MarketList.vue (parent) -->
<!-- MarketCard.vue (child) -->
<!-- MarketFilters.vue (child) -->
Missing TypeScript Types
typescript
// ❌ MEDIUM: Using 'any'
function processData(data: any) {
    // ...
}

// ✅ CORRECT: Define proper types
interface MarketData {
    id: number;
    name: string;
    status: "active" | "closed";
}

function processData(data: MarketData) {
    // ...
}
Inertia.js Specific Review
Proper Inertia Responses
php
// ❌ Wrong: JSON response in Inertia route
public function index()
{
    return response()->json(Market::all());
}

// ✅ CORRECT: Inertia response
public function index()
{
    return Inertia::render('Markets/Index', [
        'markets' => Market::paginate(10)
    ]);
}
Shared Data Usage
php
// ❌ Passing auth data manually every time
public function index()
{
    return Inertia::render('Markets/Index', [
        'auth' => ['user' => auth()->user()],
        'markets' => Market::all()
    ]);
}

// ✅ CORRECT: Use HandleInertiaRequests middleware
class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user()
            ]
        ]);
    }
}
Testing Review Checklist
Backend Testing (PestPHP)
php
// ❌ Missing tests for authorization
test('user can create market', function () {
    $user = User::factory()->create();

    actingAs($user)->post('/markets', [
        'name' => 'Test Market'
    ])->assertRedirect();
});

// ✅ CORRECT: Test both authorized and unauthorized
test('authenticated user can create market', function () {
    $user = User::factory()->create();

    actingAs($user)->post('/markets', [
        'name' => 'Test Market'
    ])->assertRedirect();
});

test('guest cannot create market', function () {
    post('/markets', [
        'name' => 'Test Market'
    ])->assertRedirect('/login');
});
Frontend Testing (if configured)
typescript
// ✅ Test component with props and events
import { mount } from "@vue/test-utils";
import MarketCard from "./MarketCard.vue";

test("emits update event when clicked", () => {
    const wrapper = mount(MarketCard, {
        props: {
            market: { id: 1, name: "Test" },
        },
    });

    wrapper.find("button").trigger("click");
    expect(wrapper.emitted("update")).toBeTruthy();
});
Database/Migration Review
php
// ❌ Migration not reversible
public function up()
{
    Schema::table('markets', function (Blueprint $table) {
        $table->string('new_column');
    });
}

public function down()
{
    // Empty - not reversible!
}

// ✅ CORRECT: Implement down() method
public function up()
{
    Schema::table('markets', function (Blueprint $table) {
        $table->string('new_column')->after('name');
    });
}

public function down()
{
    Schema::table('markets', function (Blueprint $table) {
        $table->dropColumn('new_column');
    });
}
Review Output Format
Standard Review Template
markdown
## Code Review: [PR Title]

### Summary

[1-2 sentences about what this PR does]

### Overall Assessment

- **Approval Status**: ✅ Approved / ⚠️ Approved with Comments / ❌ Needs Changes
- **Security**: [Pass/Fail]
- **Tests**: [Pass/Fail - X% coverage]
- **Performance**: [No concerns / Minor concerns / Major concerns]

---

## 🔴 CRITICAL Issues (Must Fix)

### [File: app/Http/Controllers/MarketController.php]

**Line 45: SQL Injection Risk**

```php
// Current code
$markets = DB::select("SELECT * FROM markets WHERE id = $id");

// Suggested fix
$markets = DB::select("SELECT * FROM markets WHERE id = ?", [$id]);
````

Severity: CRITICAL
Impact: Security vulnerability - SQL injection
Recommendation: Use parameter binding or Eloquent

🟡 HIGH Issues (Should Fix)
[File: app/Services/Markets/SaveClass.php]
Line 67: N+1 Query Problem

php
// Current code
$markets = Market::all();
foreach ($markets as $market) {
echo $market->creator->name;
}

// Suggested fix
$markets = Market::with('creator')->get();
Severity: HIGH
Impact: Performance - N queries instead of 2
Recommendation: Use eager loading

🟢 MEDIUM Issues (Nice to Have)
[File: resources/js/components/MarketCard.vue]
Line 23: Missing Prop Validation

typescript
// Add prop types
props: {
market: {
type: Object as PropType<Market>,
required: true
}
}
Severity: MEDIUM
Impact: Type safety and maintainability
Recommendation: Add explicit prop validation (and TS typing only in TS-enabled files)

✅ Positive Feedback
Good use of Form Request for validation

Comprehensive test coverage (87%)

Well-structured service layer

Clean component organization

Proper use of Inertia.js patterns

📋 Checklist
Security review completed

Tests included and passing

No N+1 queries

Authorization checks present

Input validation implemented

Documentation updated (if needed)

Migration is reversible

No console.log() in production code

Next Steps
Fix CRITICAL issues (SQL injection)

Address HIGH priority items (N+1 queries)

Consider MEDIUM suggestions

Re-request review after changes

text

## Review Best Practices

1. **Start with Security** - Always review security issues first
2. **Be Specific** - Reference exact lines and files
3. **Provide Examples** - Show both bad and good code
4. **Explain Impact** - Why does this issue matter?
5. **Offer Solutions** - Don't just point out problems
6. **Acknowledge Good Work** - Point out what's done well
7. **Use Severity Levels** - Critical > High > Medium > Low
8. **Check Tests** - Ensure adequate coverage
9. **Verify Standards** - PSR-12 (PHP), plus frontend lint/type checks if configured
10. **Be Professional** - Constructive, not condescending

## Common Review Mistakes to Avoid

- ❌ Nitpicking style issues (let linters handle it)
- ❌ Reviewing without understanding context
- ❌ Focusing only on what's wrong (acknowledge good code too)
- ❌ Being vague ("This could be better")
- ❌ Not explaining why something is a problem
- ❌ Ignoring test coverage
- ❌ Missing security vulnerabilities
- ❌ Not checking for N+1 queries

## Quick Review Commands

```bash
# Run before reviewing
php artisan test --compact --filter=[RelatedArea]  # Run related backend tests
# ./vendor/bin/phpstan analyse           # Static analysis (if configured)
./vendor/bin/pint --dirty --format agent # Format changed PHP files
# npm run test                           # Frontend tests (if configured)
# npm run type-check                     # TypeScript check (if configured)
# npm run lint                           # ESLint check (if configured)

# Performance check
php artisan debugbar:clear            # Clear debugbar
# Enable query logging and check for N+1

# Security check
rg "DB::raw|DB::select\(" app/       # Find raw queries
rg "all\(\)|get\(\)" app/Http/Controllers/  # Check for missing pagination
```

---

**Stack**: Laravel 13.6 + PHP 8.3 + Vue 3.5 Options API (JS-first) + Inertia.js 3 + axios + Tailwind CSS 4 + Reka UI / Lucide Icons + MySQL + Pest 4

**Remember**: The goal of code review is to improve code quality and share knowledge, not to criticize. Be constructive, specific, and helpful.

```

All versions, framework labels, and UI library references have been updated. Ready for the next rule.
```
