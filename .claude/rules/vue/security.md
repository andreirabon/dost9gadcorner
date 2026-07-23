---
paths:
  - "**/*.vue"
---

# Vue Security

> This file extends [common/security.md](../common/security.md) with Vue specific content.

## What Vue Escapes Automatically

- Text interpolation `{{ }}` and dynamic attribute bindings (`:title`) are auto-escaped. The vectors below are NOT protected.

## Rule No.1: Templates from Trusted Sources Only

- Never use non-trusted content as a component template. No runtime template compilation from user input.
- No user-controlled `:is` that resolves a component from an arbitrary string.

## v-html and Render Functions

- `v-html` bypasses escaping and is a direct XSS vector. Avoid it on user content.
- If unavoidable, sanitize with DOMPurify (allowlist config) before binding, or render in a sandboxed iframe. Vue itself recommends sanitizing on the backend before persisting.
- Render-function and scoped-slot output carry the same risk. Passing user HTML through `h()` with `innerHTML` is `v-html` by another name. Sanitize first.

## URL, Style, and Event Injection

- `:href` and `:src` are not escaped. `javascript:` URLs execute. Validate the scheme, allow `http` / `https` / `mailto` only. Vue docs reference `@braintree/sanitize-url`, but sanitize on the backend before persisting.
- `:style` with user input is unsafe (CSS exfiltration). Use object syntax with whitelisted properties, never a raw user string.
- Never bind user input to `onclick`, `onfocus`, or any event attribute.

## Client Bundle Secrets

- Anything in `import.meta.env.VITE_*` ships to the browser. Keep API keys and tokens server-side.
- Use httpOnly cookies for session tokens. Never bundle credentials into the client.

```vue
<!-- unsafe -->
<div v-html="userBio" />
<!-- safe: sanitize in a computed, Options API style -->
<div v-html="safeBio" />
```

```ts
// Options API — sanitize via a computed property, never inline in the template
import { defineComponent } from 'vue'
import DOMPurify from 'dompurify'

export default defineComponent({
  props: { userBio: { type: String, default: '' } },
  computed: {
    safeBio(): string {
      return DOMPurify.sanitize(this.userBio)
    },
  },
})
```

This project is Options API only (see [coding-style.md](coding-style.md)); every rule above applies identically regardless of API style — these are template/runtime-level vectors, not Composition vs. Options concerns. The only difference is where sanitization lives: a `computed` option, not a `computed()` call inside `setup()`.

## Reference

- ECC skills: `frontend-patterns`, `vite-patterns`.
- Docs: <https://vuejs.org/guide/best-practices/security.html> · <https://github.com/cure53/DOMPurify> · <https://github.com/braintree/sanitize-url>
