import { defineComponent, mergeProps, useSSRContext, unref, withCtx, createTextVNode, toDisplayString, createVNode } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderSlot } from "vue/server-renderer";
import { a as _sfc_main$2 } from "./Input-DgH3elPy.js";
import { d as _sfc_main$3 } from "./AppLayout-ZR8ZPUp4.js";
import { usePage, Link } from "@inertiajs/vue3";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Heading",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-8 space-y-0.5" }, _attrs))}><h2 class="text-xl font-semibold tracking-tight">${ssrInterpolate(__props.title)}</h2>`);
      if (__props.description) {
        _push(`<p class="text-sm text-muted-foreground">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/shared/Heading.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Layout",
  __ssrInlineRender: true,
  setup(__props) {
    const sidebarNavItems = [
      {
        title: "Profile",
        href: "/settings/profile"
      },
      {
        title: "Password",
        href: "/settings/password"
      }
    ];
    const page = usePage();
    const currentPath = page.props.ziggy?.location ? new URL(page.props.ziggy.location).pathname : "";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8" }, _attrs))}><div class="mb-6">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Settings",
        description: "Account and password controls"
      }, null, _parent));
      _push(`</div><div class="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start"><aside class="w-full"><div class="app-surface-card rounded-2xl p-2"><nav class="flex flex-col space-y-1"><p class="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase"> Account </p><!--[-->`);
      ssrRenderList(sidebarNavItems, (item) => {
        _push(ssrRenderComponent(unref(_sfc_main$2), {
          key: item.href,
          variant: "ghost",
          class: [
            "h-10 w-full cursor-pointer justify-start rounded-xl px-3 text-sm font-medium transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.97]",
            unref(currentPath) === item.href ? "bg-blue-600 text-white hover:bg-blue-500" : "text-slate-700 hover:bg-slate-100"
          ],
          "as-child": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Link), {
                href: item.href
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(item.title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(item.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Link), {
                  href: item.href
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(item.title), 1)
                  ]),
                  _: 2
                }, 1032, ["href"])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav></div></aside>`);
      _push(ssrRenderComponent(unref(_sfc_main$3), { class: "my-6 lg:hidden" }, null, _parent));
      _push(`<div class="min-w-0"><section class="space-y-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</section></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/settings/Layout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
