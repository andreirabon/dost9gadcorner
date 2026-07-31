---
paths:
  - "**/*.vue"
---

# Vue Testing

> This file extends [common/testing.md](../common/testing.md) with Vue specific content.

> **Applicability to this project.** Pinia is not installed, so the Pinia section
> below does not apply. Component tests live beside the component as
> `*.spec.ts` and run with `npm test` (Vitest + happy-dom). Server behaviour is
> covered by Pest under `tests/Feature`.

## Stack

- Vitest (Vite-native runner) plus `@vue/test-utils`. `create-vue` scaffolds `@vitejs/plugin-vue`.
- DOM environment via `happy-dom` or `jsdom`, set in `vite.config.ts` under `test.environment`.

## Rendering and Async

- `mount` for a full render. `shallowMount` to stub all child components.
- `trigger` and `setValue` return promises, `await` them.
- `flushPromises` flushes resolved promise handlers. `nextTick` settles the DOM after a state change.

## What to Test

- Test the public interface only: props, emitted events, slots, rendered output.
- Do not assert private state or internal methods, and do not rely solely on snapshots.

## Shared Logic

- Plain helper modules unit-test directly: import the function, assert on the return value. No mounting.
- Mixins are only meaningful merged into a component. Test them through a throwaway host component (`mount(defineComponent({ mixins: [useTimer], template: '<div/>' }))`), then assert on `wrapper.vm`.
- Mixin cleanup is a real test case: `wrapper.unmount()` and assert the timer/listener is gone.

## Pinia

- In components: `createTestingPinia()` from `@pinia/testing`, passed via `global.plugins`. Actions are stubbed by default, set `stubActions: false` to run them. `createSpy: vi.fn` is required under Vitest (no Jest globals).
- In isolation: `beforeEach(() => setActivePinia(createPinia()))` gives a fresh store per test and prevents state leakage.
- Components using `mapState` / `mapActions` read through the same testing pinia — no extra wiring.

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
