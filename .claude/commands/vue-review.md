---
description: Comprehensive Vue.js code review for Options API correctness, reactivity, mixin patterns, template security, accessibility, and Vue-specific performance. Invokes the vue-reviewer agent (and typescript-reviewer alongside on .vue/.ts changes).
---

# Vue Code Review

This command invokes the **vue-reviewer** agent for Vue-specific code review. For pull requests touching `.vue` files or Vue-containing `.ts`/`.js` files, both `vue-reviewer` and `typescript-reviewer` should run — each owns a distinct lane. This project standardizes on the **Options API exclusively**; Composition API usage (`<script setup>`, `setup()`, free-function `ref`/`reactive`/`computed`/`watch`, composables) is treated as a review violation, not a style preference.

## What This Command Does

1. **Identify Vue Changes**: Find modified `.vue` files and Vue-related `.ts`/`.js` files via `git diff`
2. **Run Lint**: Execute `eslint` with `eslint-plugin-vue`
3. **Typecheck**: Run `vue-tsc --noEmit` or the project's canonical typecheck command
4. **Detect Composition API Drift**: Grep for `<script setup>`, free-function reactivity imports, and Pinia setup-store syntax
5. **Review Vue Lanes Only**: Reactivity, mixins, template security, accessibility, Vue-specific performance
6. **Generate Report**: Categorize issues by severity (CRITICAL / HIGH / MEDIUM)

## When to Use

Use `/vue-review` when:

- A PR or commit touches `.vue` files
- After writing or modifying Vue components, mixins, or Pinia stores
- Before merging Vue code
- Auditing template security (`v-html`, URL bindings)
- Reviewing a new mixin for correctness
- Auditing Vue Router guards and navigation
- Reviewing Nuxt server routes or SSR-specific code
- Confirming a component hasn't drifted into Composition API syntax

For pure `.ts`/`.js` changes with no Vue imports, use `/code-review` (general) or invoke `typescript-reviewer` directly.

## Scope vs `/code-review` and TypeScript Review

| Tool | Scope |
|---|---|
| `vue-reviewer` (this command) | Reactivity, mixins, template security, a11y, Vue performance, Pinia/Router, Composition API drift |
| `typescript-reviewer` | Generic TS/JS — `any` abuse, async correctness, Node security |
| `security-reviewer` | Project-wide security audit |
| `/code-review` | Generic uncommitted-changes or PR review |

On a `.vue` / Vue-related PR, invoke both `vue-reviewer` and `typescript-reviewer`. Findings from each are non-overlapping by design.

## Review Categories

### CRITICAL (Must Fix)

- `<script setup>` used anywhere in the diff
- Free-function `ref()`/`reactive()`/`computed()`/`watch()`/`watchEffect()` used outside a narrowly-scoped, documented `setup()` escape hatch
- New composable (`useXxx`) function introduced
- `v-html` with unsanitized input
- `:href`/`:src` with unvalidated user URLs (`javascript:`, `data:`)
- Secret in client bundle (`VITE_*`, Nuxt `public` runtimeConfig)
- Server endpoint without input validation (Nuxt Nitro)
- `localStorage`/`sessionStorage` for session tokens
- `data()` returning a shared object instead of a fresh object per instance
- Arrow function used for a `methods`/`computed`/`watch` handler that needs `this`
- Computed property performing async work or a side effect

### HIGH (Should Fix)

- Pinia store written as a Composition "setup store" instead of an Options store
- Mixin/component `data()` or method name collisions
- `v-for` without `:key` or with `key={index}`
- `v-if` + `v-for` on same element
- Props mutation
- Missing prop validation
- Route guard returning false without redirect
- `this.$route.params` captured once with no reactive watcher for in-place navigation
- `v-model` bound to computed without setter, or two-way binding not using the `modelValue` prop + `update:modelValue` emit convention
- Accessibility violations (missing labels, non-semantic interactive elements)
- Direct store property mutation outside actions
- `mapState`/`mapActions` used on a bare object export instead of `defineComponent`

### MEDIUM (Consider)

- Partial Composition API drift (a single composable import in an otherwise Options-API component)
- Component over 300 lines
- `v-show` where `v-if` is more appropriate (or vice versa)
- Missing `:max` on `<KeepAlive>`
- Large deep-reactive structure that should be `Object.freeze()`d before assignment
- Custom validation instead of a vetted form library (Options-API-compatible, e.g. VeeValidate)
- Over-broad `expose: []` (or `defineExpose` remnant)
- `inheritAttrs` not disabled when using `v-bind="$attrs"`

## Automated Checks Run

```bash
# Lint (required)
npx eslint . --ext .vue,.ts,.js

# Vue-specific typecheck
vue-tsc --noEmit

# Composition API drift detection
grep -rn "<script setup" --include='*.vue' .
grep -rnE "\bimport\s*\{[^}]*\b(ref|reactive|computed|watch|watchEffect|onMounted|onUnmounted)\b[^}]*\}\s*from\s*['\"]vue['\"]" --include='*.vue' --include='*.ts' .

# Targeted security rules
npx eslint . --rule 'vue/no-v-html: warn' \
              --rule 'vue/no-template-target-blank: error'

# Supply-chain
npm audit
```

If `eslint-plugin-vue` or `vue-tsc` is not configured, the review will flag the gap as a HIGH config issue and continue.

## Example Usage

````text
User: /vue-review

Agent:
# Vue Code Review Report

## Files Reviewed
- src/components/UserCard.vue (modified)
- src/mixins/userMixin.ts (new)
- src/stores/useUserStore.ts (modified)

## Lint Results
PASS: eslint clean
PASS: vue-tsc clean
PASS: no <script setup> or free-function reactivity imports found

## Issues Found

[CRITICAL] Unsanitized v-html
File: src/components/UserCard.vue:15
Issue: User-controlled bio rendered as raw HTML via v-html.
Why: XSS via stored script tags in user input.
Fix: Sanitize with DOMPurify and expose the result via a computed property:
```vue
<script lang="ts">
import { defineComponent } from 'vue';
import DOMPurify from 'dompurify';

export default defineComponent({
  props: { bio: { type: String, default: '' } },
  computed: {
    safeBio(): string {
      return DOMPurify.sanitize(this.bio);
    },
  },
});
</script>
<template>
  <div v-html="safeBio" />
</template>
```

[HIGH] Pinia store using setup-store syntax
File: src/stores/useUserStore.ts:1
Issue: `defineStore('user', () => { const user = ref(null); return { user } })` uses Composition API.
Why: This project is Options API only; setup stores mix in Composition syntax that the rest of the codebase doesn't use, and drifts typing/tooling conventions.
Fix: Convert to an Options store:
```ts
export const useUserStore = defineStore('user', {
  state: () => ({ user: null as User | null }),
  getters: {
    isLoggedIn: (state) => state.user !== null,
  },
  actions: {
    setUser(user: User) {
      this.user = user;
    },
  },
});
```

## Summary
- CRITICAL: 1
- HIGH: 1
- MEDIUM: 0

Recommendation: FAIL: Block merge until CRITICAL issue is fixed
````

## Approval Criteria

| Status | Condition |
|---|---|
| PASS: Approve | No CRITICAL or HIGH issues |
| WARNING: Warning | Only MEDIUM issues (merge with caution) |
| FAIL: Block | CRITICAL or HIGH issues found |

## Integration with Other Commands

- Run your project's build command first if the build is broken
- Run tests to ensure component tests pass
- Run `/vue-review` before merging Vue code
- Use `/code-review` for non-Vue-specific concerns on the same PR

## Related

- Agent: `agents/vue-reviewer.md`
- Companion agent: `agents/typescript-reviewer.md` (run alongside for Vue-related TS/JS)
- Skills: `skills/vue-patterns/`
- Rules: `rules/vue/`
