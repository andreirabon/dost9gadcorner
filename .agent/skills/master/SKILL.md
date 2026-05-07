---
name: master
description: >
    Master orchestrator skill. Always evaluate and apply all relevant skills before acting.
    This skill indexes every available skill and ensures the right ones are activated for each task.
---

# Master Skill Orchestrator

**Purpose**: Before answering or coding, review this index and activate all relevant skills for the task at hand.

**Last Updated**: 2026-04-29

## How to Use

1. Read the user's request and identify the task type
2. Match the task to the skill categories below
3. Mentally load and follow all matched skills before implementing
4. If multiple skills match, apply them in priority order: **Security → Architecture → Patterns → Standards → Tooling**

---

## Skill Index

### 🏗️ Architecture & Planning

| Skill              | When to Use                                                              |
| ------------------ | ------------------------------------------------------------------------ |
| `architect`        | Major architectural decisions, system design, scalability planning       |
| `plan`             | Creating implementation plans before coding                              |
| `planner`          | Detailed project planning with phases, milestones, and risk assessment   |
| `research`         | Exploring, investigating, or learning before implementing                |
| `rule-orchestrator` | Matching user intent to rules, resolving rule conflicts, version checks |

### 🔒 Security

| Skill               | When to Use                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| `security`           | Implementing secrets, validation, CSRF, auth, rate limiting, mass assignment   |
| `security-reviewer`  | Running security audits, detecting OWASP vulnerabilities, dependency scanning  |
| `vibesecskill`       | Security-first coding patterns for Laravel + Inertia + Vue 3 (Options API)    |

### 🐘 Backend (Laravel / PHP)

| Skill              | When to Use                                                                  |
| ------------------ | ---------------------------------------------------------------------------- |
| `laravel-patterns` | Laravel 13 patterns: SRP, Single Action Controllers, services, Form Requests, jobs, events, routes |
| `laravel-boost`    | Laravel Boost MCP tools, `search-docs`, Artisan, Tinker, conventions         |
| `backend-patterns` | Backend patterns: SRP, skinny controllers, services, middleware, Eloquent queries |
| `php-standards`    | PHP 8.3+ standards, SRP class design, type declarations, PSR-12, constructor promotion |

### 🖥️ Frontend (Vue / Inertia)

| Skill                  | When to Use                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `vue-patterns`             | Vue 3 Options API: components, props, events, lifecycle, state          |
| `frontend-patterns`        | Vue SRP: extract logic to Actions, prop-driven design, DefineModel, container queries |
| `frontend-performance`     | CSS/animation performance: transitions, blur, scroll, paint containment |
| `inertia-patterns`         | Inertia + Single Action Controllers, partial reloads with `only`, deferred props |
| `tailwindcss-development`  | VILT Tailwind v4: CSS-first @theme, container queries, OKLCH, Lightning CSS, auto-scanning |

### 📐 Coding Standards & Style

| Skill              | When to Use                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `coding-standards` | Code quality, VILT comparison table, Lean Stack directory, validation, authorization |
| `coding-style`     | Formatting, types, file structure, Tailwind v4, Vue/PHP style      |
| `patterns`         | Shared Laravel + Inertia + Vue patterns: API response, debounce, middleware |

### 🔧 Build & DevOps

| Skill                  | When to Use                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| `dev`                  | Active implementation: shipping changes quickly, safely, minimal diff      |
| `build-fix`            | Incrementally fixing build errors with fast feedback loops                 |
| `build-error-resolver` | Diagnosing TypeScript, Vue, Vite, Tailwind, or Laravel build failures      |

### 🔄 Refactoring & Review

| Skill              | When to Use                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| `refactor-clean`   | Safely identifying and removing dead code with test verification            |
| `refactor-cleaner` | Deep refactoring: code cleanup, consolidation, dependency removal           |
| `review`           | Pull Request review: quality, security, maintainability, performance, tests |

### 🗜️ Token Efficiency (Caveman)

| Skill              | When to Use                                                |
| ------------------ | ---------------------------------------------------------- |
| `caveman`          | Ultra-compressed communication mode (~75% token reduction) |
| `caveman-commit`   | Compressed commit messages in Conventional Commits format  |
| `caveman-compress` | Compress memory/instruction files to save tokens           |
| `caveman-help`     | Quick-reference card for all caveman commands              |
| `caveman-review`   | Compressed code review comments (one-line per finding)     |
| `compress`         | Compress natural language files into caveman format         |

---

## Task → Skill Mapping

### When writing new code:

→ `coding-standards` + `coding-style` + `patterns`
→ `security` + `vibesecskill` (always check security)
→ Stack-specific: `laravel-patterns` OR `vue-patterns` OR `inertia-patterns`

### When reviewing code:

→ `review` + `security-reviewer` + `coding-standards`

### When fixing bugs:

→ `build-fix` + `build-error-resolver` + `dev`

### When refactoring:

→ `refactor-clean` + `refactor-cleaner` + `patterns`

### When planning features:

→ `architect` + `plan` + `planner` + `research`

### When doing Laravel backend work:

→ `laravel-patterns` + `backend-patterns` + `php-standards` + `security`
→ Always enforce **SRP**: Single Action Controllers (`__invoke`) for new features, directory-based controller structure
→ Always use `laravel-boost` for `search-docs` and MCP tools

### When doing Vue frontend work:

→ `vue-patterns` + `frontend-patterns` + `inertia-patterns`
→ `tailwindcss-development` for Tailwind v4 / VILT styling work
→ `frontend-performance` if optimization needed
→ Extract complex logic to `resources/js/helpers` (see `frontend-patterns`)

### When doing full-stack work:

→ All backend skills + all frontend skills + `inertia-patterns`

### When resolving rule conflicts:

→ `rule-orchestrator` for priority resolution and version validation

---

## Priority Rules

1. **Security is ALWAYS relevant** — check `security` and `vibesecskill` for any code change
2. **Standards are ALWAYS relevant** — check `coding-standards` for any code change
3. **Use MCP tools** — check `laravel-boost` before guessing framework behavior
4. **Stack**: Laravel 13 (PHP 8.3+) + Vue 3.5+ Options API + Inertia.js 3 + Tailwind CSS 4 + MySQL 8 + PestPHP 4
