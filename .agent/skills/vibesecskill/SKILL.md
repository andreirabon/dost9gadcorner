---
name: vibesecskill
description: Security-first coding rule for Laravel + Inertia + Vue 3 (Options API). Use for implementation, review, and audits.
---

# Secure Coding Guide for Web Applications

## Overview

This guide provides comprehensive secure coding practices for web applications. As an AI assistant, your role is to approach code from a **bug hunter's perspective** and make applications **as secure as possible** without breaking functionality.

**Key Principles:**

- Defense in depth: Never rely on a single security control
- Fail securely: When something fails, fail closed (deny access)
- Least privilege: Grant minimum permissions necessary
- Input validation: Never trust user input, validate everything server-side
- Output encoding: Encode data appropriately for the context it's rendered in

### Verification Status

- Last verified: **2026-04-27**
- Sources used for this rule update:
  - **Laravel Boost** `search-docs` (Laravel 13 + Inertia v3 ecosystem docs)
  - **Context7** (`/vuejs/docs`)
- Examples in this document should default to **Laravel + Inertia + Vue 3 Options API** patterns.

## Cursor MDC Usage

Use this rule as a Cursor `.mdc` skill/rule when:

- Building or reviewing Laravel backend code
- Building or reviewing Inertia + Vue 3 frontend code
- Performing security scans, audits, or secure refactors

### Documentation-First Workflow (Required)

For Laravel ecosystem work, documentation must be checked before implementing:

1. Use **Laravel Boost** `search-docs` first for Laravel, Inertia, Tailwind, Pest, and related ecosystem guidance.
2. Use **Context7** for up-to-date framework/library docs and code examples:
   - Resolve the library first with `resolve-library-id`
   - Then query with `query-docs` using a specific question
3. Do not guess framework behavior when docs can confirm it.

### Project Reality Overrides (Highest Priority)

- Runtime wiring in this project is centered in `bootstrap/app.php` and `bootstrap/providers.php`.
- Backend often uses service classes in `app/Services/**` and controller `option` branching; secure existing patterns incrementally.
- Authorization boundaries are commonly route middleware + role checks, with policies used where present.
- Frontend defaults to JS-first Vue 3 Options API with Inertia + axios coexistence.
- Do not force identifier migrations. Follow module conventions and existing schema unless migration work is explicitly requested.

---

## Vue 3 Options API Security Requirements

When generating or reviewing Vue code, prefer and secure the **Options API** shape (`props`, `data`, `computed`, `methods`, `watch`, lifecycle hooks):

- Keep templates escaped by default (`{{ value }}`), and avoid `v-html`. If `v-html` is unavoidable, sanitize content first.
- Treat all `props` and route/page data as untrusted input; validate and normalize before sensitive use.
- Keep side-effect logic in `methods` / guarded `watch` handlers, and avoid security decisions in template-only logic.
- Never store secrets, tokens, or private keys in component state, localStorage, sessionStorage, or rendered payloads.
- For forms, enforce server-side validation (Laravel Form Requests) and display errors safely in Vue.
- For auth/authorization, use backend enforcement (policies/gates/middleware). Frontend checks are UX only, never security boundaries.

```vue
<script>
import { router } from "@inertiajs/vue3";

export default {
  props: {
    initialQuery: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      query: this.initialQuery,
    };
  },
  methods: {
    submit() {
      router.get("/news", { q: this.query }, { preserveState: true });
    },
  },
};
</script>

<template>
  <form @submit.prevent="submit">
    <input
      v-model="query"
      type="text"
      name="q" />
    <button type="submit">Search</button>
    <!-- Escaped by default -->
    <p>{{ query }}</p>
  </form>
</template>
[Rest of the file unchanged – contains all the detailed security topics like Access Control, XSS, CSRF, SSRF, Upload
Security, etc.] Remember: Security is a continuous process. Keep dependencies updated, audit regularly, and always
validate input server-side.
```
