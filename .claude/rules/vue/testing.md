---
paths:
  - "**/*.vue"
---

# Vue Testing

> This file extends [common/testing.md](../common/testing.md) with Vue specific content.

## Stack

- Vitest (Vite-native runner) plus `@vue/test-utils`. `create-vue` scaffolds `@vitejs/plugin-vue`.
- DOM environment via `happy-dom` or `jsdom`, set in `vite.config.ts` under `test.environment`.

## Rendering and Async

- `mount` for a full render. `shallowMount` to stub all child components.
- `trigger` and `setValue` return promises, `await` them.
- `flushPromises` flushes resolved promise handlers. `nextTick` settles the DOM after a state change.

## What to Test

- Test the public interface only: props, emitted events, slots, rendered output.
- Do not assert private state or internal methods (including `wrapper.vm.someDataProp`), and do not rely solely on snapshots.

## Mixins

- This project is Options API only (see [coding-style.md](coding-style.md)) — there are no composables to unit-test in isolation the way a Composition API `useXxx` function would be. Test a mixin's behavior through a small host component that consumes it via `mixins: [...]`, asserting on the rendered output, emitted events, and public `wrapper.vm` surface the mixin contributes (a method or computed the component template actually calls).
- If a mixin's logic is complex enough to want true unit-level isolation, that's usually a sign it should be a plain, mixin-independent utility function (import and test directly) that the mixin then simply calls — not a reason to reach for a composable.

## Pinia

- In components: `createTestingPinia()` from `@pinia/testing`, passed via `global.plugins`. Actions are stubbed by default, set `stubActions: false` to run them. `createSpy: vi.fn` is required under Vitest (no Jest globals).
- In isolation: `beforeEach(() => setActivePinia(createPinia()))` gives a fresh store per test and prevents state leakage.

## Mount Config

- `global.plugins`, `global.stubs` (stubs `Transition` / `TransitionGroup` by default), `global.mocks` (e.g. `$router`), `global.provide` (for `inject`, Symbol keys supported).
- `RouterLinkStub` stubs `router-link` without mounting a full router.

```ts
const wrapper = mount(AuctionCard, {
  props: { id: 1 },
  global: { plugins: [createTestingPinia({ createSpy: vi.fn })] },
})
await wrapper.find('button').trigger('click')
expect(wrapper.emitted('bid')).toBeTruthy()
```

## Reference

- ECC skills: `frontend-patterns`, `vite-patterns`.
- Docs: <https://test-utils.vuejs.org/api/> · <https://pinia.vuejs.org/cookbook/testing.html> · <https://vitest.dev/>
