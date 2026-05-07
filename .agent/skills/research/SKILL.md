---
name: research
description: Exploration, investigation, learning mode for Laravel + Vue 3 + Inertia.js applications.
---

# Research Context

**Mode**: Exploration, investigation, learning for Laravel + Vue 3 + Inertia.js applications
**Focus**: Deep understanding before acting
**Goal**: Gather evidence, understand patterns, document findings

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

- Use repository conventions as source of truth: service `*Class` modules and frequent controller `option`-branching flows.
- Assume JS-first Vue Options API with Inertia + axios coexistence.
- Assume frontend structure uses `resources/js/pages`, `resources/js/components`, and `resources/js/layouts`.
- Assume Laravel runtime wiring is centered in `bootstrap/app.php` + `bootstrap/providers.php`; do not assume legacy kernel registration paths.
- For Laravel ecosystem docs, use Laravel Boost `search-docs` first; use Context7 as supplemental docs source.

## Core Research Principles

1. **Read Widely First** - Explore thoroughly before concluding
2. **Ask Questions** - Clarify requirements and constraints
3. **Document As You Go** - Track findings, patterns, and insights
4. **Evidence-Based** - Back conclusions with code examples and data
5. **No Code Yet** - Don't write code until understanding is complete
6. **Stack-Aware** - Consider Laravel, Vue, Inertia, MySQL, PestPHP contexts

## Research Process (6 Phases)

### Phase 1: Understand the Question

- What is being asked?
- What is the context (backend, frontend, full-stack)?
- What are the success criteria?
- What constraints exist (performance, security, compatibility)?
- What is the scope (single feature, architecture, performance, etc.)?

### Phase 2: Explore Relevant Code

- Search for existing implementations
- Review related components/services
- Check for similar patterns in codebase
- Read tests to understand expected behavior
- Examine database schema and relationships

### Phase 3: Research External Resources

- Check Laravel documentation (laravel.com)
- Check Vue 3 documentation (vuejs.org)
- Check Inertia.js documentation (inertiajs.com)
- Search for best practices and patterns
- Review relevant packages and tools

### Phase 4: Form Hypothesis

- Based on findings, propose solution approaches
- List pros and cons of each approach
- Consider edge cases and limitations
- Identify risks and dependencies

### Phase 5: Verify with Evidence

- Find code examples supporting hypothesis
- Check if pattern is used elsewhere in codebase
- Verify with tests (if applicable)
- Cross-reference with documentation

### Phase 6: Summarize Findings

- Present findings in structured format
- Include code examples and evidence
- Provide clear recommendations
- List next steps or questions

## Research Scenarios

### Backend (Laravel) Research

#### 1. Investigating Database Schema

```bash
# Check existing migrations
ls -la database/migrations/

# Search for table usage
rg "markets" database/migrations/

# Check model relationships
rg "belongsTo|hasMany|belongsToMany" app/Models/
Questions to Answer:

What tables exist?

What relationships are defined?

Are there indexes for performance?

Are foreign keys properly set up?

Are there any unused columns?

2. Understanding Service/Repository Pattern
bash
# Find all services
rg --files app/Services

# Find all repositories
rg --files app/Repositories

# Search for service usage
rg "SaveClass|UpdateClass|DeleteClass|option" app/Http/Controllers/
Questions to Answer:

Is Repository pattern used?

Is Service *Class layer implemented?

How is business logic organized?

Are services delegated from controllers (including option-branching)?

Are repositories tested?

3. Researching Routes and Controllers
bash
# List all routes
php artisan route:list

# Find controller methods
rg "public function" app/Http/Controllers/

# Search for route usage in frontend
rg "route\(" resources/js/
Questions to Answer:

What routes are defined?

Which controllers handle requests?

Are routes properly grouped and named?

Are middleware applied correctly?

Which routes are used by frontend?

4. Investigating Authentication/Authorization
bash
# Check policies
ls -la app/Policies/

# Search for authorization
rg "authorize|can:|@can" app/

# Check middleware wiring and mapped classes
rg "->withMiddleware|alias\\(|append\\(|prepend\\(" bootstrap/app.php
rg --files app/Http/Middleware
Questions to Answer:

How is authentication implemented?

What policies exist?

How is authorization checked?

What middleware protects routes?

Are gate definitions used?

5. Researching Jobs and Queues
bash
# Find all jobs
rg --files app/Jobs

# Search for dispatch calls
rg "dispatch|dispatchSync" app/

# Check scheduled tasks
php artisan schedule:list
Questions to Answer:

What jobs are defined?

How are jobs dispatched?

Are jobs queued or synchronous?

What scheduled tasks exist?

Are jobs properly tested?

Frontend (Vue 3) Research
1. Understanding Component Structure
bash
# Find all components
rg --files resources/js/components

# Find all pages
rg --files resources/js/pages

# Search for component usage
rg "<ComponentName" resources/js/
Questions to Answer:

What components exist?

How are components organized?

Are components reusable?

What props do components accept?

Are components properly typed?

2. Investigating Inertia.js Usage
bash
# Search for Inertia renders in backend
rg "Inertia::render" app/Http/Controllers/

# Search for Inertia forms in frontend
rg "this.\$inertia.form" resources/js/

# Check Inertia middleware data sharing
rg "share\(|Inertia" app/Http/Middleware/HandleInertiaRequests.php
Questions to Answer:

How is data passed from backend to frontend?

What shared data is available?

How are forms handled?

Are page props properly typed?

How is navigation implemented?

3. Researching State Management
bash
# Search for data() in components
rg "data\(\)" resources/js/

# Search for computed properties
rg "computed:" resources/js/

# Search for provide/inject
rg "provide|inject" resources/js/
Questions to Answer:

How is component state managed?

Are computed properties used effectively?

Is provide/inject used for global state?

How is data shared between components?

Are watchers used appropriately?

4. Understanding TypeScript Types
bash
# Check type definitions
rg --files resources/js/types

# Search for interface usage
rg "interface|type" resources/js/types/

# Find PropType usage
rg "PropType" resources/js/
Questions to Answer:

What TypeScript types are defined?

Are props properly typed?

Are API responses typed?

Are there any type errors?

Is type safety enforced?

Full-Stack (Inertia) Research
1. Tracing Request Flow
bash
# Start with route
php artisan route:list --name=markets

# Find controller method
rg "public function index" app/Http/Controllers/MarketController.php

# Find Inertia render
rg "Inertia::render\('Markets" app/Http/Controllers/

# Find Vue page
rg --files resources/js/pages/markets
Questions to Answer:

What is the complete request/response flow?

What data is passed from backend to frontend?

Are validations consistent?

How are errors handled?

What middleware is applied?

2. Investigating Performance
bash
# Check for N+1 queries
rg "->get\(\)|->all\(\)" app/Http/Controllers/

# Look for eager loading
rg "->with\(" app/

# Check for pagination
rg "paginate|simplePaginate" app/
Questions to Answer:

Are there N+1 query problems?

Is eager loading used?

Are large datasets paginated?

Are queries optimized?

Are database indexes present?

Database (MySQL) Research
1. Schema Investigation
bash
# Check migrations
ls -la database/migrations/

# Search for indexes
rg "index|unique" database/migrations/

# Check for foreign keys
rg "foreign|references" database/migrations/
Questions to Answer:

What tables and columns exist?

Are relationships properly indexed?

Are foreign keys defined?

Are migrations reversible?

Are there any naming inconsistencies?

Tools and Commands
Laravel Tools
bash
# Routes
php artisan route:list                    # List all routes
php artisan route:list --name=markets     # Filter by name
php artisan route:list --method=POST      # Filter by method

# Database
php artisan db:show                       # Show database info
php artisan db:table users                # Show table structure
php artisan migrate:status                # Migration status

# Models
php artisan model:show Market             # Show model info

# Cache
php artisan config:clear                  # Clear config cache
php artisan route:clear                   # Clear route cache

# Tinker (REPL)
php artisan tinker                        # Interactive shell
Search Tools
bash
# Ripgrep (rg) - Fast search
rg "pattern" app/                         # Search in app/
rg -t php "class.*Service" app/          # Search PHP files
rg -i "market" app/                       # Case-insensitive

# File listing with rg --files
rg --files app/Services                   # List services
rg --files app/Models                     # List models
Database Research
bash
# MySQL queries (via Tinker or database client)
php artisan tinker

# In Tinker:
App\Models\Market::query()->count();      # Count records
App\Models\Market::query()->first();      # Get first record
DB::getQueryLog();                        # Show queries (if enabled)
Frontend Tools
bash
# TypeScript
# npm run type-check                      # Check types (if configured)
# npx tsc --noEmit                        # TypeScript check (if configured)

# Build
npm run build                             # Production build
npm run dev                               # Development build

# Testing
# npm run test                            # Run frontend tests (if configured)
Documentation Research
Official Documentation
Laravel: https://laravel.com/docs/13.x

Vue 3: https://vuejs.org/guide/introduction.html

Inertia.js: https://inertiajs.com/

PestPHP: https://pestphp.com/

Vite: https://vitejs.dev/

Search for Best Practices
Use Laravel Boost search-docs first for Laravel ecosystem topics, then Context7/WebSearch for supplemental references:

"Laravel 13 [feature] best practices"

"Vue 3 Options API [pattern]"

"Inertia.js [use case] example"

"MySQL [optimization] technique"

"PestPHP [testing scenario]"

Research Output Format
Standard Research Report
markdown
# Research Report: [Topic]

## Summary

[2-3 sentence overview of findings]

## Current State

[What exists now in the codebase]

**Evidence:**

- File: app/Services/MarketService.php
- Pattern: Repository pattern is used
- Tests: tests/Unit/MarketServiceTest.php exists

## Findings

### Finding 1: [Title]

**Description:** [Detailed description]

**Evidence:**
[Code example or reference]

**Impact:** [High/Medium/Low]

### Finding 2: [Title]

...

## Recommendations

### Option 1: [Approach Name]

**Pros:**

- Advantage 1
- Advantage 2

**Cons:**

- Disadvantage 1
- Disadvantage 2

**Complexity:** [High/Medium/Low]

### Option 2: [Approach Name]

...

## Recommended Approach

[Which option and why]

## Next Steps

1. [Action 1]
2. [Action 2]
3. [Action 3]

## Questions/Unknowns

- [ ] Question 1
- [ ] Question 2

## References

- [Link to Laravel docs]
- [Link to similar implementation]
- [Link to package documentation]
Example Research Tasks
Task 1: "How do we handle file uploads?"
Search for upload handling: rg "store|storeAs" app/

Check for storage configuration: ReadFile config/filesystems.php

Look for upload validation: rg "file|mimes" app/Http/Requests/

Find frontend upload components: rg "type=\"file\"" resources/js/

Check tests: rg "UploadedFile" tests/

Document findings and recommend approach

Task 2: "What's our authentication flow?"
Check routes: ReadFile routes/auth.php

Examine controllers: rg --files app/Http/Controllers/Auth

Check middleware: ReadFile app/Http/Middleware/Authenticate.php

Find frontend components: rg --files resources/js/pages/auth

Review session config: ReadFile config/session.php

Document complete auth flow with diagrams

Task 3: "How can we optimize market listing performance?"
Check controller: ReadFile app/Http/Controllers/MarketController.php

Look for N+1 queries: Search for get() without with()

Check pagination: Look for paginate() usage

Examine indexes: rg "index" database/migrations/*markets*

Profile queries: Enable query log in Tinker

Recommend optimizations with evidence

Best Practices
Be Thorough: Explore all related code before concluding

Be Objective: Present findings without bias

Be Specific: Include file paths, line numbers, code examples

Be Clear: Use simple language and structured format

Be Helpful: Provide actionable recommendations

Be Honest: Acknowledge unknowns and limitations

Be Fast: Use appropriate tools (rg, targeted reads, scoped searches)

Be Stack-Aware: Consider Laravel, Vue, Inertia, MySQL contexts

When to Use Research Mode
✅ Use research mode when:

Exploring unfamiliar parts of codebase

Understanding complex business logic

Investigating performance issues

Learning about architecture decisions

Evaluating packages or approaches

Documenting existing systems

Planning major refactors

Resolving ambiguous requirements

❌ Don't use research mode when:

Requirements are crystal clear

Simple bug fix with obvious solution

Just need to run a command

Writing tests for new code

Implementing well-defined feature

Stack: Laravel 13.6 + PHP 8.3 + Vue 3.5 Options API (JS-first) + Inertia.js 3 + axios + Tailwind CSS 4 + Reka UI / Lucide Icons + MySQL + Pest 4

Remember: Good research takes time. Gather evidence, explore thoroughly, and document findings before recommending solutions.
```
