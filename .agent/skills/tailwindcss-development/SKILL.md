---
name: tailwindcss-development
description: Always invoke when the user's message includes 'tailwind' in any form. Also invoke for building responsive grid layouts, flex/grid page structures, styling UI components, adding dark mode variants, fixing spacing or typography, and Tailwind v4 work. The core use case is writing or fixing Tailwind utility classes in HTML templates (Blade, JSX, Vue).
---

# Tailwind CSS v4 in the VILT Workflow

Tailwind CSS v4 development standards for this Laravel + Inertia + Vue (VILT) codebase. In 2026, the biggest shift is that your **Vite config and CSS files do the heavy lifting**, not a `.js` config file.

**Last Updated**: 2026-04-29

## Version Snapshot (Verified)

- Tailwind CSS `4.2.4`
- Vite `8.0.9` + Lightning CSS (faster builds)
- Vue `3.5.33`
- Laravel `13.6.0`

## Project Reality Overrides (Highest Priority)

- Follow touched-file/module conventions first.
- This project already uses Tailwind v4 CSS-first configuration — do not regress to v3 patterns.
- The design token system lives in `resources/css/app.css` inside `@theme inline {}`.
- Reka UI, Lucide icons, and tw-animate-css are part of the component toolkit.
- Build engine is **Vite + Lightning CSS** — no PostCSS config needed.

## 2026 VILT Best Practice Comparison

| Feature               | The "Old" Way (2024)                    | The 2026 Standard (VILT)                           |
| --------------------- | --------------------------------------- | -------------------------------------------------- |
| Styling Config        | `tailwind.config.js`                    | CSS-First `@theme` in `app.css`                    |
| Component Logic       | Giant `methods` objects                 | Imported Action / Service JS files                 |
| Responsive UI         | Media Queries (`sm:`, `lg:`)            | Container Queries (`@sm:`, `@lg:`)                 |
| Controller Layout     | Massive `UserController.php`            | Directory-based Invokable Controllers              |
| Build Engine          | PostCSS / Vite                          | Vite + Lightning CSS (faster builds)               |
| Color System          | Hex / HSL                               | OKLCH (perceptually uniform)                       |
| Content Scanning      | Manual `content` arrays                 | Zero-config auto-scanning                          |

---

## 1) CSS-First Configuration (No `tailwind.config.js`)

In v4, `tailwind.config.js` is a **legacy artifact**. The standard is using the `@theme` block inside `app.css`.

### Practice

Define all brand variables using CSS variables inside the `@theme` directive. This keeps your Vue components "lean" because you reference high-level variables instead of repeating complex arbitrary values.

### Why

This allows design tokens (colors, spacing, fonts) to be used in both standard CSS and Tailwind classes simultaneously without duplication.

### Project Example (`resources/css/app.css`)

```css
@import "tailwindcss";

@theme {
    --color-primary: oklch(0.65 0.24 288); /* Modern OKLCH color */
    --font-brand: "Inter", sans-serif;
}
```

When tokens reference CSS custom properties from `:root` / `.dark`:

```css
@theme inline {
    --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
    --color-primary: var(--primary);
    --color-accent: var(--accent);
    --radius-lg: var(--radius);
    --radius-md: calc(var(--radius) - 2px);
}
```

### Rules

- **Never create a `tailwind.config.js`** for new configuration. All customization goes in `@theme`.
- Use `@theme inline` when tokens reference CSS custom properties defined elsewhere (e.g., `:root` or `.dark`).
- Use plain `@theme` when defining literal values directly.
- Keep the `@theme` block as the single source of truth for design tokens.
- If a legacy `tailwind.config.js` exists, migrate its tokens to `@theme` incrementally.

---

## 2) Component-First Layout with Native Container Queries

Shift from "Mobile First" (media queries) to **"Component First"** (container queries) for reusable components.

### Practice

Use `@` container-query classes (e.g., `@sm:grid-cols-2`) instead of viewport-based `sm:grid-cols-2` for reusable components.

### Why

This follows the **Single Responsibility Principle**: a component should be responsible for its own layout based on the space *it* has, not the size of the entire browser window. A sidebar widget should render the same whether it's on a mobile screen or in a narrow column on a desktop.

### When to Use Container Queries vs Media Queries

| Use Container Queries (`@sm:`, `@md:`)      | Use Media Queries (`sm:`, `md:`)          |
| -------------------------------------------- | ----------------------------------------- |
| Reusable cards, widgets, sidebar components  | Page-level layout (main grid columns)     |
| Components placed in varying-width slots     | Top-level nav, footer, full-width sections|
| Any component that may appear in sidebars    | App shell breakpoints                     |

### Example

```html
<!-- Container-aware card grid -->
<div class="@container">
    <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-4">
        <div class="p-4 bg-card rounded-lg">...</div>
    </div>
</div>
```

---

## 3) OKLCH Color System

Use the `oklch()` function for colors instead of hex or HSL where defining new color values.

### Practice

Use `oklch()` for new color definitions. The existing project uses HSL in `:root` custom properties — keep those stable but prefer OKLCH for any new additions.

### Why

OKLCH is **perceptually uniform**: decreasing Lightness by 10% on two different colors makes them *appear* 10% darker to the human eye. This is essential for:

- Building **accessible dark modes** with predictable contrast.
- Generating consistent color scales programmatically.
- Achieving color harmony across the UI palette.

### Syntax

```css
/* oklch(Lightness Chroma Hue) */
--color-primary: oklch(0.65 0.24 288);     /* Modern OKLCH color */
--color-brand: oklch(0.6 0.18 250);        /* Vivid blue */
--color-brand-light: oklch(0.85 0.08 250); /* Tinted lighter */
--color-brand-dark: oklch(0.35 0.18 250);  /* Shaded darker */
```

### Migration Rules

- Do **not** bulk-convert existing HSL tokens — change only when modifying or adding colors.
- New color tokens added to `@theme` should use `oklch()`.
- Document the OKLCH values alongside their purpose in comments.

---

## 4) Zero-Runtime Component Extraction

With Lightning CSS built into Tailwind v4, the performance penalty for `@apply` has vanished. However, the **architectural rule** remains:

### The SRP Rule

| Scenario                                    | Approach                              |
| ------------------------------------------- | ------------------------------------- |
| Component needs **logic** (conditionals, loops, state) | Make it a **Vue component** or **Blade component** |
| Component is **purely visual** (a recurring border-gradient, badge style) | Use `@apply` in CSS |

### Practice

- Use **Vue components** for logic-heavy UI (active links, conditional rendering, state).
- Use `@apply` in your CSS for "utility-only" visual components used everywhere.

### Example

```css
/* Good: purely visual extraction */
@layer components {
    .btn-primary {
        @apply rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground
               transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring;
    }
}
```

```vue
<!-- Good: logic-heavy → keep as Vue component -->
<template>
    <a :href="href" :class="['nav-link', { 'nav-link--active': isActive }]">
        <slot />
    </a>
</template>
```

### Rules for `@apply`

- Place extracted components in `@layer components` to maintain correct specificity.
- In Vue `<style>` blocks, use `@reference "../../css/app.css"` before `@apply` to resolve theme tokens.
- Keep `@apply` rules short (< 8 utilities). If longer, it's a sign the pattern should be a Vue component.

---

## 5) Automatic Content Detection (Zero-Config)

In Laravel 13, you **no longer need to tell Tailwind** where your `.vue` or `.blade.php` files are. The Vite plugin for Tailwind v4 automatically scans your entire `resources` directory.

### Practice

**Stop manually listing content paths** in configuration.

### Why

This prevents the "missing class" bug that used to happen when you forgot to update the `content` array after adding a new folder to `resources/views`.

### Rules

- Do **not** add a `content` array in any Tailwind config.
- Use `@source` directives only for files outside the auto-scan scope (e.g., vendor views, storage-compiled views):

```css
@source '../../vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php';
@source '../../storage/framework/views/*.php';
```

- If a class is not being picked up, check that the file is within the project root before adding manual `@source` paths.

---

## Dark Mode

This project uses the class-based dark mode strategy:

```css
@custom-variant dark (&:is(.dark *));
```

- Toggle dark mode by adding/removing the `.dark` class on the root element.
- All dark mode tokens live in the `.dark` selector in `app.css`.
- Use `dark:` variant in templates for dark-mode-specific overrides.

---

## Performance Guardrails

- Avoid `transition-all`; use property-specific transitions (`transition-colors`, `transition-opacity`).
- Do not apply `backdrop-blur-*` to repeated grid/list items.
- In Tailwind v4, transforms use individual properties — animate `scale` / `translate` directly, not `transform`.
- Use `[contain:paint]` on repeated card/list roots where safe.

---

## Styling Workflow

1. **Check `app.css`** for existing design tokens before adding new ones.
2. **Use existing Tailwind utilities** before writing custom CSS.
3. **Extract with `@apply`** only for purely visual patterns repeated 3+ times.
4. **Use Vue components** for anything requiring logic or interactivity.
5. **Run `npm run build`** (or confirm `npm run dev` is running) to verify class detection.

---

## Anti-Patterns

- Creating `tailwind.config.js` for new tokens (use `@theme` instead).
- Using viewport media queries (`sm:`, `md:`) for reusable components that belong in varying-width containers.
- Bulk-converting existing HSL colors to OKLCH without reason.
- Over-extracting with `@apply` — prefer inline utilities unless repeated 3+ times.
- Manually listing content paths that Tailwind auto-detects.
- Using `transition-all` by default.

---

## Verification Checklist

- [ ] No `tailwind.config.js` created for new configuration.
- [ ] New design tokens defined in `@theme` block of `app.css`.
- [ ] Container queries used for reusable components; media queries for page-level layout.
- [ ] New color values use `oklch()` with descriptive comments.
- [ ] `@apply` used only for purely visual patterns; logic-heavy UI is in Vue components.
- [ ] No manual content paths added for auto-detectable files.
- [ ] No `transition-all` in new code.
- [ ] Dark mode uses `dark:` variant consistently.
