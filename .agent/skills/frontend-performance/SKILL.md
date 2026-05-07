---
name: frontend-performance
description: Apply when writing or reviewing Tailwind/CSS styles and Vue templates to keep UI interactions smooth and avoid FPS drops.
---

# Frontend Performance (CSS and Animations)

Performance guardrails for responsive, smooth UI in lists, cards, modals, and scroll-heavy screens.

**Last Updated**: 2026-04-27

## Version Snapshot (Verified)

- Vue `3.5.33`
- Tailwind CSS `4.2.4`
- Vite `8.0.9`

## Project Reality Overrides (Highest Priority)

- Follow touched-file/module conventions first.
- Vue Options API is the default for new component/page work.
- Prefer Tailwind v4 utility patterns in touched frontend modules.
- Keep legacy local style patterns where already established, but avoid adding new heavy global effects.

## Avoid Expensive Effects

### 1) Backdrop Blur on Repeated Elements

- Do not apply `backdrop-filter: blur(...)` / `backdrop-blur-*` to many repeated items (cards in grids/lists).
- Prefer solid or semi-transparent backgrounds for repeated components.
- If glassmorphism is needed, keep blur to a single accent element per view.

### 2) Smooth Scrolling on Containers

- Do not set global `scroll-behavior: smooth` on large content containers.
- Prefer user-triggered smooth scrolling in JS:
  - `element.scrollTo({ behavior: 'smooth' })`
- Avoid `scroll-smooth` on continuously scrolled sections.

## Prefer Explicit Transitions

### 3) Avoid Broad Transition Targets

- Do not use `transition: all` or Tailwind `transition-all` by default.
- Use property-specific transitions only:
  - `transition-opacity`
  - `transition-colors`
  - `transition-[opacity,transform]` only when transform actually applies

```html
<!-- Avoid -->
<button class="transition-all duration-300">...</button>

<!-- Prefer -->
<button class="transition-colors duration-200">...</button>
4) Tailwind v4 Transform Transition Detail In Tailwind v4, transform utilities use individual properties (scale, rotate,
translate). If animating scale-*, do not rely on transition-[...,transform]. Prefer explicit property transitions such
as: transition-[opacity,scale] transition-[opacity,translate] Repaint and Layout Containment 5) Paint Containment for
Repeated Blocks Consider contain: paint; (or Tailwind arbitrary [contain:paint]) on repeated card/list roots. Use only
when containment does not break overflow/layout expectations. 6) Keep Animations Compositor-Friendly Prefer animating
opacity and transform. Avoid animating layout-heavy properties repeatedly (width, height, top, left) in dense UIs.
Global Style Audit Points Check resources/css/app.css for broad transitions/effects that impact whole pages. If legacy
module styles exist, audit those files too before adding new utility classes. Keep transitions near component scope
(SFC/local classes) when possible for easier auditing. Quick Do / Don’t Do Don’t Use transition-colors /
transition-opacity Use transition-all by default Use one optional blur accent per view Blur every card in a grid Use
JS-triggered smooth scroll for explicit actions Put smooth scroll on high-traffic containers Consider [contain:paint] on
repeated blocks Apply containment where overflow/layout must escape Verification Checklist No repeated blur filters on
grid/list items. No broad transition-all usage in touched UI. Transition properties match what actually changes. No
global smooth scrolling on heavy content sections. Checked resources/css/app.css for expensive global effects. UI
remains responsive during hover, scroll, and modal open/close.
```
