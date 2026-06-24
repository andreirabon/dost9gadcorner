import { defineComponent, unref, mergeProps, withCtx, renderSlot, useSSRContext, computed, createVNode, createTextVNode, openBlock, createBlock, createCommentVNode, resolveDynamicComponent, Fragment, toDisplayString, ref, renderList } from "vue";
import { ssrRenderComponent, ssrRenderSlot, ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderVNode, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { cva } from "class-variance-authority";
import { c as cn, _ as _sfc_main$Y, a as _sfc_main$Z } from "./Input-DgH3elPy.js";
import { useForwardPropsEmits, DialogRoot, DialogClose, DialogOverlay, DialogPortal, DialogContent, DialogDescription, DialogTitle, DialogTrigger, createContext, Primitive, TooltipRoot, TooltipPortal, TooltipContent, TooltipArrow, TooltipProvider, TooltipTrigger, Separator, AvatarRoot, AvatarFallback, AvatarImage, ToastProvider, ToastRoot, ToastTitle, ToastDescription, ToastAction, ToastClose, ToastViewport } from "reka-ui";
import { reactiveOmit, useMediaQuery, useVModel, useEventListener } from "@vueuse/core";
import { X, PanelLeft, LogOut, FileChartColumnIncreasing, Printer, ChevronsLeft, ChevronsRight, ArrowLeft, MoreHorizontal, ChevronRight } from "@lucide/vue";
import { _ as _sfc_main$_ } from "./AppFooter-ClQxMSzB.js";
import { usePage, Link, router } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main$X = /* @__PURE__ */ defineComponent({
  __name: "Sheet",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    modal: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogRoot), mergeProps({ "data-slot": "sheet" }, unref(forwarded), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$X = _sfc_main$X.setup;
_sfc_main$X.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sheet/Sheet.vue");
  return _sfc_setup$X ? _sfc_setup$X(props, ctx) : void 0;
};
const _sfc_main$W = /* @__PURE__ */ defineComponent({
  __name: "SheetClose",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogClose), mergeProps({ "data-slot": "sheet-close" }, props, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$W = _sfc_main$W.setup;
_sfc_main$W.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sheet/SheetClose.vue");
  return _sfc_setup$W ? _sfc_setup$W(props, ctx) : void 0;
};
const _sfc_main$V = /* @__PURE__ */ defineComponent({
  __name: "SheetOverlay",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogOverlay), mergeProps({
        "data-slot": "sheet-overlay",
        class: unref(cn)("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80", props.class)
      }, delegatedProps.value, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sheet/SheetOverlay.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const _sfc_main$U = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "SheetContent",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] },
    side: { default: "right" },
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class", "side");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$V, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(DialogContent), mergeProps({
              "data-slot": "sheet-content",
              class: unref(cn)(
                "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
                __props.side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
                __props.side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
                __props.side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
                __props.side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
                props.class
              )
            }, { ...unref(forwarded), ..._ctx.$attrs }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  _push3(ssrRenderComponent(unref(DialogClose), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent4, _scopeId3));
                        _push4(`<span class="sr-only"${_scopeId3}>Close</span>`);
                      } else {
                        return [
                          createVNode(unref(X), { class: "size-4" }),
                          createVNode("span", { class: "sr-only" }, "Close")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default"),
                    createVNode(unref(DialogClose), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
                      default: withCtx(() => [
                        createVNode(unref(X), { class: "size-4" }),
                        createVNode("span", { class: "sr-only" }, "Close")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$V),
              createVNode(unref(DialogContent), mergeProps({
                "data-slot": "sheet-content",
                class: unref(cn)(
                  "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
                  __props.side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
                  __props.side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
                  __props.side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
                  __props.side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
                  props.class
                )
              }, { ...unref(forwarded), ..._ctx.$attrs }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default"),
                  createVNode(unref(DialogClose), { class: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none" }, {
                    default: withCtx(() => [
                      createVNode(unref(X), { class: "size-4" }),
                      createVNode("span", { class: "sr-only" }, "Close")
                    ]),
                    _: 1
                  })
                ]),
                _: 3
              }, 16, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sheet/SheetContent.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const _sfc_main$T = /* @__PURE__ */ defineComponent({
  __name: "SheetDescription",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogDescription), mergeProps({
        "data-slot": "sheet-description",
        class: unref(cn)("text-muted-foreground text-sm", props.class)
      }, delegatedProps.value, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sheet/SheetDescription.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const _sfc_main$S = /* @__PURE__ */ defineComponent({
  __name: "SheetFooter",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sheet-footer",
        class: unref(cn)("mt-auto flex flex-col gap-2 p-4", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sheet/SheetFooter.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const _sfc_main$R = /* @__PURE__ */ defineComponent({
  __name: "SheetHeader",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sheet-header",
        class: unref(cn)("flex flex-col gap-1.5 p-4", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sheet/SheetHeader.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const _sfc_main$Q = /* @__PURE__ */ defineComponent({
  __name: "SheetTitle",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTitle), mergeProps({
        "data-slot": "sheet-title",
        class: unref(cn)("text-foreground font-semibold", props.class)
      }, delegatedProps.value, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sheet/SheetTitle.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const _sfc_main$P = /* @__PURE__ */ defineComponent({
  __name: "SheetTrigger",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTrigger), mergeProps({ "data-slot": "sheet-trigger" }, props, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sheet/SheetTrigger.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "18rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "4.25rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const [useSidebar, provideSidebarContext] = createContext("Sidebar");
const _sfc_main$O = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "Sidebar",
  __ssrInlineRender: true,
  props: {
    side: { default: "left" },
    variant: { default: "sidebar" },
    collapsible: { default: "offcanvas" },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.collapsible === "none") {
        _push(`<div${ssrRenderAttrs(mergeProps({
          "data-slot": "sidebar",
          class: unref(cn)("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", props.class)
        }, _ctx.$attrs, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else if (unref(isMobile)) {
        _push(ssrRenderComponent(unref(_sfc_main$X), mergeProps({ open: unref(openMobile) }, _ctx.$attrs, { "onUpdate:open": unref(setOpenMobile) }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$U), {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar",
                "data-mobile": "true",
                side: __props.side,
                class: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
                style: {
                  "--sidebar-width": unref(SIDEBAR_WIDTH_MOBILE)
                }
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$R, { class: "sr-only" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_sfc_main$Q, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Sidebar`);
                              } else {
                                return [
                                  createTextVNode("Sidebar")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_sfc_main$T, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Displays the mobile sidebar.`);
                              } else {
                                return [
                                  createTextVNode("Displays the mobile sidebar.")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_sfc_main$Q, null, {
                              default: withCtx(() => [
                                createTextVNode("Sidebar")
                              ]),
                              _: 1
                            }),
                            createVNode(_sfc_main$T, null, {
                              default: withCtx(() => [
                                createTextVNode("Displays the mobile sidebar.")
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`<div class="flex h-full w-full flex-col"${_scopeId2}>`);
                    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode(_sfc_main$R, { class: "sr-only" }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$Q, null, {
                            default: withCtx(() => [
                              createTextVNode("Sidebar")
                            ]),
                            _: 1
                          }),
                          createVNode(_sfc_main$T, null, {
                            default: withCtx(() => [
                              createTextVNode("Displays the mobile sidebar.")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "flex h-full w-full flex-col" }, [
                        renderSlot(_ctx.$slots, "default")
                      ])
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$U), {
                  "data-sidebar": "sidebar",
                  "data-slot": "sidebar",
                  "data-mobile": "true",
                  side: __props.side,
                  class: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
                  style: {
                    "--sidebar-width": unref(SIDEBAR_WIDTH_MOBILE)
                  }
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$R, { class: "sr-only" }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$Q, null, {
                          default: withCtx(() => [
                            createTextVNode("Sidebar")
                          ]),
                          _: 1
                        }),
                        createVNode(_sfc_main$T, null, {
                          default: withCtx(() => [
                            createTextVNode("Displays the mobile sidebar.")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "flex h-full w-full flex-col" }, [
                      renderSlot(_ctx.$slots, "default")
                    ])
                  ]),
                  _: 3
                }, 8, ["side", "style"])
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "group peer text-sidebar-foreground hidden md:block",
          "data-slot": "sidebar",
          "data-state": unref(state),
          "data-collapsible": unref(state) === "collapsed" ? __props.collapsible : "",
          "data-variant": __props.variant,
          "data-side": __props.side
        }, _attrs))}><div class="${ssrRenderClass(unref(cn)(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          __props.variant === "floating" || __props.variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        ))}"></div><div${ssrRenderAttrs(mergeProps({
          class: unref(cn)(
            "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
            __props.side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            __props.variant === "floating" || __props.variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
            props.class
          )
        }, _ctx.$attrs))}><div data-sidebar="sidebar" class="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm">`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div></div></div>`);
      }
    };
  }
});
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/Sidebar.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const _sfc_main$N = /* @__PURE__ */ defineComponent({
  __name: "SidebarContent",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-content",
        "data-sidebar": "content",
        class: unref(cn)("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarContent.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const _sfc_main$M = /* @__PURE__ */ defineComponent({
  __name: "SidebarFooter",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-footer",
        "data-sidebar": "footer",
        class: unref(cn)("flex flex-col gap-2 p-2", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarFooter.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const _sfc_main$L = /* @__PURE__ */ defineComponent({
  __name: "SidebarGroup",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-group",
        "data-sidebar": "group",
        class: unref(cn)("relative flex w-full min-w-0 flex-col p-2", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarGroup.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const _sfc_main$K = /* @__PURE__ */ defineComponent({
  __name: "SidebarGroupAction",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        "data-slot": "sidebar-group-action",
        "data-sidebar": "group-action",
        as: __props.as,
        "as-child": __props.asChild,
        class: unref(cn)(
          "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "after:absolute after:-inset-2 md:after:hidden",
          "group-data-[collapsible=icon]:hidden",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarGroupAction.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const _sfc_main$J = /* @__PURE__ */ defineComponent({
  __name: "SidebarGroupContent",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-group-content",
        "data-sidebar": "group-content",
        class: unref(cn)("w-full text-sm", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarGroupContent.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const _sfc_main$I = /* @__PURE__ */ defineComponent({
  __name: "SidebarGroupLabel",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        "data-slot": "sidebar-group-label",
        "data-sidebar": "group-label",
        as: __props.as,
        "as-child": __props.asChild,
        class: unref(cn)(
          "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarGroupLabel.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const _sfc_main$H = /* @__PURE__ */ defineComponent({
  __name: "SidebarHeader",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-header",
        "data-sidebar": "header",
        class: unref(cn)("flex flex-col gap-2 p-2", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarHeader.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const _sfc_main$G = /* @__PURE__ */ defineComponent({
  __name: "SidebarInput",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$Y), mergeProps({
        "data-slot": "sidebar-input",
        "data-sidebar": "input",
        class: unref(cn)(
          "bg-background h-8 w-full shadow-none",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarInput.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const _sfc_main$F = /* @__PURE__ */ defineComponent({
  __name: "SidebarInset",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-inset",
        class: unref(cn)(
          "bg-background relative flex w-full flex-1 flex-col",
          "md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
    };
  }
});
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarInset.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const _sfc_main$E = /* @__PURE__ */ defineComponent({
  __name: "SidebarMenu",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<ul${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-menu",
        "data-sidebar": "menu",
        class: unref(cn)("flex w-full min-w-0 flex-col gap-1", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</ul>`);
    };
  }
});
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenu.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const _sfc_main$D = /* @__PURE__ */ defineComponent({
  __name: "SidebarMenuAction",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { default: "button" },
    showOnHover: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        "data-slot": "sidebar-menu-action",
        "data-sidebar": "menu-action",
        class: unref(cn)(
          "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
          "after:absolute after:-inset-2 md:after:hidden",
          "peer-data-[size=sm]/menu-button:top-1",
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "group-data-[collapsible=icon]:hidden",
          __props.showOnHover && "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
          props.class
        ),
        as: __props.as,
        "as-child": __props.asChild
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenuAction.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const _sfc_main$C = /* @__PURE__ */ defineComponent({
  __name: "SidebarMenuBadge",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-menu-badge",
        "data-sidebar": "menu-badge",
        class: unref(cn)(
          "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
          "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
          "peer-data-[size=sm]/menu-button:top-1",
          "peer-data-[size=default]/menu-button:top-1.5",
          "peer-data-[size=lg]/menu-button:top-2.5",
          "group-data-[collapsible=icon]:hidden",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenuBadge.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const _sfc_main$B = /* @__PURE__ */ defineComponent({
  __name: "Tooltip",
  __ssrInlineRender: true,
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    delayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipRoot), mergeProps({ "data-slot": "tooltip" }, unref(forwarded), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/tooltip/Tooltip.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const _sfc_main$A = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "TooltipContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: {},
    sideOffset: { default: 4 },
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    class: { type: [Boolean, null, String, Object, Array] },
    hideArrow: { type: Boolean, default: false }
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class", "hideArrow");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(TooltipContent), mergeProps({ "data-slot": "tooltip-content" }, { ...unref(forwarded), ..._ctx.$attrs }, {
              class: unref(cn)("bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance", props.class)
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  if (!__props.hideArrow) {
                    _push3(ssrRenderComponent(unref(TooltipArrow), { class: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default"),
                    !__props.hideArrow ? (openBlock(), createBlock(unref(TooltipArrow), {
                      key: 0,
                      class: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                    })) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(TooltipContent), mergeProps({ "data-slot": "tooltip-content" }, { ...unref(forwarded), ..._ctx.$attrs }, {
                class: unref(cn)("bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance", props.class)
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default"),
                  !__props.hideArrow ? (openBlock(), createBlock(unref(TooltipArrow), {
                    key: 0,
                    class: "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                  })) : createCommentVNode("", true)
                ]),
                _: 3
              }, 16, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/tooltip/TooltipContent.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const _sfc_main$z = /* @__PURE__ */ defineComponent({
  __name: "TooltipProvider",
  __ssrInlineRender: true,
  props: {
    delayDuration: { default: 0 },
    skipDelayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean },
    content: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipProvider), mergeProps(props, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/tooltip/TooltipProvider.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "TooltipTrigger",
  __ssrInlineRender: true,
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipTrigger), mergeProps({ "data-slot": "tooltip-trigger" }, props, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/tooltip/TooltipTrigger.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = /* @__PURE__ */ defineComponent({
  __name: "SidebarMenuButtonChild",
  __ssrInlineRender: true,
  props: {
    variant: { default: "default" },
    size: { default: "default" },
    isActive: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] },
    asChild: { type: Boolean },
    as: { default: "button" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        "data-slot": "sidebar-menu-button",
        "data-sidebar": "menu-button",
        "data-size": __props.size,
        "data-active": __props.isActive,
        class: unref(cn)(unref(sidebarMenuButtonVariants)({ variant: __props.variant, size: __props.size }), props.class),
        as: __props.as,
        "as-child": __props.asChild
      }, _ctx.$attrs, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenuButtonChild.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "SidebarMenuButton",
  __ssrInlineRender: true,
  props: {
    variant: { default: "default" },
    size: { default: "default" },
    isActive: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] },
    asChild: { type: Boolean },
    as: { default: "button" },
    tooltip: {}
  },
  setup(__props) {
    const props = __props;
    const { isMobile, state } = useSidebar();
    const delegatedProps = computed(() => {
      const { tooltip, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (!__props.tooltip) {
        _push(ssrRenderComponent(_sfc_main$x, mergeProps({ ...delegatedProps.value, ..._ctx.$attrs }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(ssrRenderComponent(unref(_sfc_main$B), _attrs, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$y), { "as-child": "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$x, { ...delegatedProps.value, ..._ctx.$attrs }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                        } else {
                          return [
                            renderSlot(_ctx.$slots, "default")
                          ];
                        }
                      }),
                      _: 3
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$x, { ...delegatedProps.value, ..._ctx.$attrs }, {
                        default: withCtx(() => [
                          renderSlot(_ctx.$slots, "default")
                        ]),
                        _: 3
                      }, 16)
                    ];
                  }
                }),
                _: 3
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$A), {
                side: "right",
                align: "center",
                hidden: unref(state) !== "collapsed" || unref(isMobile)
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (typeof __props.tooltip === "string") {
                      _push3(`<!--[-->${ssrInterpolate(__props.tooltip)}<!--]-->`);
                    } else {
                      ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(__props.tooltip), null, null), _parent3, _scopeId2);
                    }
                  } else {
                    return [
                      typeof __props.tooltip === "string" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode(toDisplayString(__props.tooltip), 1)
                      ], 64)) : (openBlock(), createBlock(resolveDynamicComponent(__props.tooltip), { key: 1 }))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$y), { "as-child": "" }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$x, { ...delegatedProps.value, ..._ctx.$attrs }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    }, 16)
                  ]),
                  _: 3
                }),
                createVNode(unref(_sfc_main$A), {
                  side: "right",
                  align: "center",
                  hidden: unref(state) !== "collapsed" || unref(isMobile)
                }, {
                  default: withCtx(() => [
                    typeof __props.tooltip === "string" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(toDisplayString(__props.tooltip), 1)
                    ], 64)) : (openBlock(), createBlock(resolveDynamicComponent(__props.tooltip), { key: 1 }))
                  ]),
                  _: 1
                }, 8, ["hidden"])
              ];
            }
          }),
          _: 3
        }, _parent));
      }
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenuButton.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "SidebarMenuItem",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<li${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-menu-item",
        "data-sidebar": "menu-item",
        class: unref(cn)("group/menu-item relative", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</li>`);
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenuItem.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "Skeleton",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "skeleton",
        class: unref(cn)("animate-pulse rounded-md bg-primary/10", props.class)
      }, _attrs))}></div>`);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/skeleton/Skeleton.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "SidebarMenuSkeleton",
  __ssrInlineRender: true,
  props: {
    showIcon: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    const width = computed(() => {
      return `${Math.floor(Math.random() * 40) + 50}%`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-menu-skeleton",
        "data-sidebar": "menu-skeleton",
        class: unref(cn)("flex h-8 items-center gap-2 rounded-md px-2", props.class)
      }, _attrs))}>`);
      if (__props.showIcon) {
        _push(ssrRenderComponent(unref(_sfc_main$u), {
          class: "size-4 rounded-md",
          "data-sidebar": "menu-skeleton-icon"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(_sfc_main$u), {
        class: "h-4 max-w-(--skeleton-width) flex-1",
        "data-sidebar": "menu-skeleton-text",
        style: { "--skeleton-width": width.value }
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenuSkeleton.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "SidebarMenuSub",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<ul${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-menu-sub",
        "data-sidebar": "menu-badge",
        class: unref(cn)(
          "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
          "group-data-[collapsible=icon]:hidden",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</ul>`);
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenuSub.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "SidebarMenuSubButton",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { default: "a" },
    size: { default: "md" },
    isActive: { type: Boolean },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        "data-slot": "sidebar-menu-sub-button",
        "data-sidebar": "menu-sub-button",
        as: __props.as,
        "as-child": __props.asChild,
        "data-size": __props.size,
        "data-active": __props.isActive,
        class: unref(cn)(
          "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
          __props.size === "sm" && "text-xs",
          __props.size === "md" && "text-sm",
          "group-data-[collapsible=icon]:hidden",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenuSubButton.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "SidebarMenuSubItem",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<li${ssrRenderAttrs(mergeProps({
        "data-slot": "sidebar-menu-sub-item",
        "data-sidebar": "menu-sub-item",
        class: unref(cn)("group/menu-sub-item relative", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</li>`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarMenuSubItem.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "SidebarProvider",
  __ssrInlineRender: true,
  props: {
    defaultOpen: { type: Boolean, default: true },
    open: { type: Boolean, default: void 0 },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const isMobile = useMediaQuery("(max-width: 768px)");
    const openMobile = ref(false);
    const open = useVModel(props, "open", emits, {
      defaultValue: props.defaultOpen ?? false,
      passive: props.open === void 0
    });
    function setOpen(value) {
      open.value = value;
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${open.value}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
    }
    function setOpenMobile(value) {
      openMobile.value = value;
    }
    function toggleSidebar() {
      return isMobile.value ? setOpenMobile(!openMobile.value) : setOpen(!open.value);
    }
    useEventListener("keydown", (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    });
    const state = computed(() => open.value ? "expanded" : "collapsed");
    provideSidebarContext({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipProvider), mergeProps({ "delay-duration": 0 }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${ssrRenderAttrs(mergeProps({
              "data-slot": "sidebar-wrapper",
              style: {
                "--sidebar-width": unref(SIDEBAR_WIDTH),
                "--sidebar-width-icon": unref(SIDEBAR_WIDTH_ICON)
              },
              class: unref(cn)("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", props.class)
            }, _ctx.$attrs))}${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", mergeProps({
                "data-slot": "sidebar-wrapper",
                style: {
                  "--sidebar-width": unref(SIDEBAR_WIDTH),
                  "--sidebar-width-icon": unref(SIDEBAR_WIDTH_ICON)
                },
                class: unref(cn)("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", props.class)
              }, _ctx.$attrs), [
                renderSlot(_ctx.$slots, "default")
              ], 16)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarProvider.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "SidebarRail",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    const { toggleSidebar } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        "data-sidebar": "rail",
        "data-slot": "sidebar-rail",
        "aria-label": "Toggle Sidebar",
        tabindex: -1,
        title: "Toggle Sidebar",
        class: unref(cn)(
          "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-[transform] duration-200 ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
          "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</button>`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarRail.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "Separator",
  __ssrInlineRender: true,
  props: {
    orientation: { default: "horizontal" },
    decorative: { type: Boolean, default: true },
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Separator), mergeProps({ "data-slot": "separator-root" }, unref(delegatedProps), {
        class: unref(cn)(
          `bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px`,
          props.class
        )
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/separator/Separator.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "SidebarSeparator",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$n), mergeProps({
        "data-slot": "sidebar-separator",
        "data-sidebar": "separator",
        class: unref(cn)("bg-sidebar-border mx-2 w-auto", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarSeparator.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "SidebarTrigger",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    const { toggleSidebar } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$Z), mergeProps({
        "data-sidebar": "trigger",
        "data-slot": "sidebar-trigger",
        variant: "ghost",
        size: "icon",
        class: unref(cn)("h-9 w-9 shrink-0", props.class),
        onClick: unref(toggleSidebar)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(PanelLeft), null, null, _parent2, _scopeId));
            _push2(`<span class="sr-only"${_scopeId}>Toggle Sidebar</span>`);
          } else {
            return [
              createVNode(unref(PanelLeft)),
              createVNode("span", { class: "sr-only" }, "Toggle Sidebar")
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/sidebar/SidebarTrigger.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:pr-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "AppContent",
  __ssrInlineRender: true,
  props: {
    variant: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const className = computed(() => props.class);
    return (_ctx, _push, _parent, _attrs) => {
      if (props.variant === "sidebar") {
        _push(ssrRenderComponent(unref(_sfc_main$F), mergeProps({ class: className.value }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<main${ssrRenderAttrs(mergeProps({
          class: ["mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl", className.value]
        }, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</main>`);
      }
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/layout/AppContent.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "AppShell",
  __ssrInlineRender: true,
  props: {
    variant: {}
  },
  setup(__props) {
    const isOpen = usePage().props.sidebarOpen;
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.variant === "header") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-h-screen w-full flex-col" }, _attrs))}>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(unref(_sfc_main$p), mergeProps({ "default-open": unref(isOpen) }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "default")
              ];
            }
          }),
          _: 3
        }, _parent));
      }
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/layout/AppShell.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  ...{
    name: "AppLogo"
  },
  __name: "AppLogo",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0" }, _attrs))}><div class="relative flex size-10 shrink-0 items-center justify-center" aria-hidden="true"><img src="/dostlogo.png" alt="DOST" class="h-10 w-auto max-w-11 object-contain object-left drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] group-data-[collapsible=icon]:object-center" loading="eager" decoding="async"></div><div class="group-data-[collapsible=icon]:hidden min-w-0 flex-1 text-left leading-tight"><span class="block text-[15px] font-semibold tracking-[-0.02em] text-blue-50">GAD Database</span><span class="block text-[10.5px] font-medium tracking-[0.04em] text-blue-200/40">DOST Region IX</span></div></div>`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/layout/AppLogo.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "NavMain",
  __ssrInlineRender: true,
  props: {
    items: {},
    sectionLabel: { default: "" }
  },
  setup(__props) {
    const page = usePage();
    function navItemIsActive(rawUrl, href) {
      const pathname = rawUrl.split("?")[0] ?? rawUrl;
      if (pathname === href) {
        return true;
      }
      const base = href.replace(/\/$/, "");
      if (base === "" || base === "/") {
        return false;
      }
      return pathname.startsWith(`${base}/`);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$L), mergeProps({ class: "p-0" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.sectionLabel) {
              _push2(ssrRenderComponent(unref(_sfc_main$I), { class: "mb-2.5 px-3 pt-1 pb-2 text-[10px] font-semibold tracking-[0.16em] text-blue-200/40 uppercase group-data-[collapsible=icon]:hidden" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(__props.sectionLabel)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(__props.sectionLabel), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(_sfc_main$E), { class: "gap-1" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(__props.items, (item) => {
                    _push3(ssrRenderComponent(unref(_sfc_main$v), {
                      key: item.title
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$w), {
                            "as-child": "",
                            "is-active": navItemIsActive(unref(page).url, item.href),
                            tooltip: item.title,
                            class: "sidebar-nav-item"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (item.onClick) {
                                  _push5(`<button type="button" class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center"${_scopeId4}>`);
                                  ssrRenderVNode(_push5, createVNode(resolveDynamicComponent(item.icon), {
                                    class: "size-[18px] shrink-0",
                                    "stroke-width": 1.8
                                  }, null), _parent5, _scopeId4);
                                  _push5(`<span class="group-data-[collapsible=icon]:hidden flex-1 text-left"${_scopeId4}>${ssrInterpolate(item.title)}</span>`);
                                  if (item.badge) {
                                    _push5(`<span class="group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"${_scopeId4}>${ssrInterpolate(item.badge)}</span>`);
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  _push5(`</button>`);
                                } else {
                                  _push5(ssrRenderComponent(unref(Link), {
                                    href: item.href,
                                    class: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        ssrRenderVNode(_push6, createVNode(resolveDynamicComponent(item.icon), {
                                          class: "size-[18px] shrink-0",
                                          "stroke-width": 1.8
                                        }, null), _parent6, _scopeId5);
                                        _push6(`<span class="group-data-[collapsible=icon]:hidden flex-1 text-left"${_scopeId5}>${ssrInterpolate(item.title)}</span>`);
                                        if (item.badge) {
                                          _push6(`<span class="group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"${_scopeId5}>${ssrInterpolate(item.badge)}</span>`);
                                        } else {
                                          _push6(`<!---->`);
                                        }
                                      } else {
                                        return [
                                          (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                            class: "size-[18px] shrink-0",
                                            "stroke-width": 1.8
                                          })),
                                          createVNode("span", { class: "group-data-[collapsible=icon]:hidden flex-1 text-left" }, toDisplayString(item.title), 1),
                                          item.badge ? (openBlock(), createBlock("span", {
                                            key: 0,
                                            class: "group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"
                                          }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                }
                              } else {
                                return [
                                  item.onClick ? (openBlock(), createBlock("button", {
                                    key: 0,
                                    type: "button",
                                    class: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center",
                                    onClick: item.onClick
                                  }, [
                                    (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                      class: "size-[18px] shrink-0",
                                      "stroke-width": 1.8
                                    })),
                                    createVNode("span", { class: "group-data-[collapsible=icon]:hidden flex-1 text-left" }, toDisplayString(item.title), 1),
                                    item.badge ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"
                                    }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                                  ], 8, ["onClick"])) : (openBlock(), createBlock(unref(Link), {
                                    key: 1,
                                    href: item.href,
                                    class: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center"
                                  }, {
                                    default: withCtx(() => [
                                      (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                        class: "size-[18px] shrink-0",
                                        "stroke-width": 1.8
                                      })),
                                      createVNode("span", { class: "group-data-[collapsible=icon]:hidden flex-1 text-left" }, toDisplayString(item.title), 1),
                                      item.badge ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: "group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"
                                      }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                                    ]),
                                    _: 2
                                  }, 1032, ["href"]))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$w), {
                              "as-child": "",
                              "is-active": navItemIsActive(unref(page).url, item.href),
                              tooltip: item.title,
                              class: "sidebar-nav-item"
                            }, {
                              default: withCtx(() => [
                                item.onClick ? (openBlock(), createBlock("button", {
                                  key: 0,
                                  type: "button",
                                  class: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center",
                                  onClick: item.onClick
                                }, [
                                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                    class: "size-[18px] shrink-0",
                                    "stroke-width": 1.8
                                  })),
                                  createVNode("span", { class: "group-data-[collapsible=icon]:hidden flex-1 text-left" }, toDisplayString(item.title), 1),
                                  item.badge ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"
                                  }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                                ], 8, ["onClick"])) : (openBlock(), createBlock(unref(Link), {
                                  key: 1,
                                  href: item.href,
                                  class: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center"
                                }, {
                                  default: withCtx(() => [
                                    (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                      class: "size-[18px] shrink-0",
                                      "stroke-width": 1.8
                                    })),
                                    createVNode("span", { class: "group-data-[collapsible=icon]:hidden flex-1 text-left" }, toDisplayString(item.title), 1),
                                    item.badge ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"
                                    }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                                  ]),
                                  _: 2
                                }, 1032, ["href"]))
                              ]),
                              _: 2
                            }, 1032, ["is-active", "tooltip"])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.items, (item) => {
                      return openBlock(), createBlock(unref(_sfc_main$v), {
                        key: item.title
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$w), {
                            "as-child": "",
                            "is-active": navItemIsActive(unref(page).url, item.href),
                            tooltip: item.title,
                            class: "sidebar-nav-item"
                          }, {
                            default: withCtx(() => [
                              item.onClick ? (openBlock(), createBlock("button", {
                                key: 0,
                                type: "button",
                                class: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center",
                                onClick: item.onClick
                              }, [
                                (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                  class: "size-[18px] shrink-0",
                                  "stroke-width": 1.8
                                })),
                                createVNode("span", { class: "group-data-[collapsible=icon]:hidden flex-1 text-left" }, toDisplayString(item.title), 1),
                                item.badge ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"
                                }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                              ], 8, ["onClick"])) : (openBlock(), createBlock(unref(Link), {
                                key: 1,
                                href: item.href,
                                class: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                    class: "size-[18px] shrink-0",
                                    "stroke-width": 1.8
                                  })),
                                  createVNode("span", { class: "group-data-[collapsible=icon]:hidden flex-1 text-left" }, toDisplayString(item.title), 1),
                                  item.badge ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"
                                  }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1032, ["href"]))
                            ]),
                            _: 2
                          }, 1032, ["is-active", "tooltip"])
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              __props.sectionLabel ? (openBlock(), createBlock(unref(_sfc_main$I), {
                key: 0,
                class: "mb-2.5 px-3 pt-1 pb-2 text-[10px] font-semibold tracking-[0.16em] text-blue-200/40 uppercase group-data-[collapsible=icon]:hidden"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(__props.sectionLabel), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(unref(_sfc_main$E), { class: "gap-1" }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.items, (item) => {
                    return openBlock(), createBlock(unref(_sfc_main$v), {
                      key: item.title
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$w), {
                          "as-child": "",
                          "is-active": navItemIsActive(unref(page).url, item.href),
                          tooltip: item.title,
                          class: "sidebar-nav-item"
                        }, {
                          default: withCtx(() => [
                            item.onClick ? (openBlock(), createBlock("button", {
                              key: 0,
                              type: "button",
                              class: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center",
                              onClick: item.onClick
                            }, [
                              (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                class: "size-[18px] shrink-0",
                                "stroke-width": 1.8
                              })),
                              createVNode("span", { class: "group-data-[collapsible=icon]:hidden flex-1 text-left" }, toDisplayString(item.title), 1),
                              item.badge ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"
                              }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                            ], 8, ["onClick"])) : (openBlock(), createBlock(unref(Link), {
                              key: 1,
                              href: item.href,
                              class: "flex min-w-0 flex-1 cursor-pointer items-center gap-3 group-data-[collapsible=icon]:justify-center"
                            }, {
                              default: withCtx(() => [
                                (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                  class: "size-[18px] shrink-0",
                                  "stroke-width": 1.8
                                })),
                                createVNode("span", { class: "group-data-[collapsible=icon]:hidden flex-1 text-left" }, toDisplayString(item.title), 1),
                                item.badge ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "group-data-[collapsible=icon]:hidden ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary"
                                }, toDisplayString(item.badge), 1)) : createCommentVNode("", true)
                              ]),
                              _: 2
                            }, 1032, ["href"]))
                          ]),
                          _: 2
                        }, 1032, ["is-active", "tooltip"])
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/layout/NavMain.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "Avatar",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarRoot), mergeProps({
        "data-slot": "avatar",
        class: unref(cn)("relative flex size-8 shrink-0 overflow-hidden rounded-full", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/avatar/Avatar.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "AvatarFallback",
  __ssrInlineRender: true,
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {},
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarFallback), mergeProps({ "data-slot": "avatar-fallback" }, delegatedProps.value, {
        class: unref(cn)("bg-muted flex size-full items-center justify-center rounded-full", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/avatar/AvatarFallback.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "AvatarImage",
  __ssrInlineRender: true,
  props: {
    src: {},
    referrerPolicy: {},
    crossOrigin: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarImage), mergeProps({ "data-slot": "avatar-image" }, props, { class: "aspect-square size-full" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/avatar/AvatarImage.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
function getInitials(fullName) {
  if (!fullName) return "";
  const names = fullName.trim().split(" ");
  if (names.length === 0) return "";
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
}
function useInitials() {
  return { getInitials };
}
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "NavUser",
  __ssrInlineRender: true,
  setup(__props) {
    const user = usePage().props.auth.user;
    const { getInitials: getInitials2 } = useInitials();
    const showAvatar = computed(() => Boolean(user.avatar && user.avatar !== ""));
    const displayHandle = computed(() => user.username?.trim() || "—");
    function handleLogout() {
      router.flushAll();
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$E), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$v), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex w-full flex-col gap-2.5"${_scopeId2}><div class="sidebar-user-card group-data-[collapsible=icon]:hidden"${_scopeId2}><div class="flex items-center gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$g), { class: "size-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (showAvatar.value) {
                          _push4(ssrRenderComponent(unref(_sfc_main$e), {
                            src: unref(user).avatar,
                            alt: displayHandle.value
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(unref(_sfc_main$f), { class: "rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(getInitials2)(displayHandle.value))}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(getInitials2)(displayHandle.value)), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          showAvatar.value ? (openBlock(), createBlock(unref(_sfc_main$e), {
                            key: 0,
                            src: unref(user).avatar,
                            alt: displayHandle.value
                          }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                          createVNode(unref(_sfc_main$f), { class: "rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(getInitials2)(displayHandle.value)), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="min-w-0 flex-1 text-left"${_scopeId2}><p class="truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] text-blue-50"${ssrRenderAttr("title", displayHandle.value)}${_scopeId2}>${ssrInterpolate(displayHandle.value)}</p><p class="mt-0.5 text-[11px] font-medium text-blue-200/45"${_scopeId2}>Signed in</p></div>`);
                  _push3(ssrRenderComponent(unref(Link), {
                    class: "sidebar-logout-btn",
                    method: "post",
                    href: _ctx.route("logout"),
                    as: "button",
                    title: "Log out",
                    onClick: handleLogout
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(LogOut), {
                          class: "size-3.5",
                          "stroke-width": 1.8,
                          "aria-hidden": "true"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(LogOut), {
                            class: "size-3.5",
                            "stroke-width": 1.8,
                            "aria-hidden": "true"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div><div class="hidden justify-center py-1 group-data-[collapsible=icon]:flex"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$g), { class: "size-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (showAvatar.value) {
                          _push4(ssrRenderComponent(unref(_sfc_main$e), {
                            src: unref(user).avatar,
                            alt: displayHandle.value
                          }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(unref(_sfc_main$f), { class: "rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(getInitials2)(displayHandle.value))}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(getInitials2)(displayHandle.value)), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          showAvatar.value ? (openBlock(), createBlock(unref(_sfc_main$e), {
                            key: 0,
                            src: unref(user).avatar,
                            alt: displayHandle.value
                          }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                          createVNode(unref(_sfc_main$f), { class: "rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(getInitials2)(displayHandle.value)), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex w-full flex-col gap-2.5" }, [
                      createVNode("div", { class: "sidebar-user-card group-data-[collapsible=icon]:hidden" }, [
                        createVNode("div", { class: "flex items-center gap-3" }, [
                          createVNode(unref(_sfc_main$g), { class: "size-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]" }, {
                            default: withCtx(() => [
                              showAvatar.value ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                key: 0,
                                src: unref(user).avatar,
                                alt: displayHandle.value
                              }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                              createVNode(unref(_sfc_main$f), { class: "rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(unref(getInitials2)(displayHandle.value)), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "min-w-0 flex-1 text-left" }, [
                            createVNode("p", {
                              class: "truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] text-blue-50",
                              title: displayHandle.value
                            }, toDisplayString(displayHandle.value), 9, ["title"]),
                            createVNode("p", { class: "mt-0.5 text-[11px] font-medium text-blue-200/45" }, "Signed in")
                          ]),
                          createVNode(unref(Link), {
                            class: "sidebar-logout-btn",
                            method: "post",
                            href: _ctx.route("logout"),
                            as: "button",
                            title: "Log out",
                            onClick: handleLogout
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(LogOut), {
                                class: "size-3.5",
                                "stroke-width": 1.8,
                                "aria-hidden": "true"
                              })
                            ]),
                            _: 1
                          }, 8, ["href"])
                        ])
                      ]),
                      createVNode("div", { class: "hidden justify-center py-1 group-data-[collapsible=icon]:flex" }, [
                        createVNode(unref(_sfc_main$g), { class: "size-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]" }, {
                          default: withCtx(() => [
                            showAvatar.value ? (openBlock(), createBlock(unref(_sfc_main$e), {
                              key: 0,
                              src: unref(user).avatar,
                              alt: displayHandle.value
                            }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                            createVNode(unref(_sfc_main$f), { class: "rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(getInitials2)(displayHandle.value)), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$v), null, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex w-full flex-col gap-2.5" }, [
                    createVNode("div", { class: "sidebar-user-card group-data-[collapsible=icon]:hidden" }, [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode(unref(_sfc_main$g), { class: "size-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]" }, {
                          default: withCtx(() => [
                            showAvatar.value ? (openBlock(), createBlock(unref(_sfc_main$e), {
                              key: 0,
                              src: unref(user).avatar,
                              alt: displayHandle.value
                            }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                            createVNode(unref(_sfc_main$f), { class: "rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(getInitials2)(displayHandle.value)), 1)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "min-w-0 flex-1 text-left" }, [
                          createVNode("p", {
                            class: "truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] text-blue-50",
                            title: displayHandle.value
                          }, toDisplayString(displayHandle.value), 9, ["title"]),
                          createVNode("p", { class: "mt-0.5 text-[11px] font-medium text-blue-200/45" }, "Signed in")
                        ]),
                        createVNode(unref(Link), {
                          class: "sidebar-logout-btn",
                          method: "post",
                          href: _ctx.route("logout"),
                          as: "button",
                          title: "Log out",
                          onClick: handleLogout
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(LogOut), {
                              class: "size-3.5",
                              "stroke-width": 1.8,
                              "aria-hidden": "true"
                            })
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ])
                    ]),
                    createVNode("div", { class: "hidden justify-center py-1 group-data-[collapsible=icon]:flex" }, [
                      createVNode(unref(_sfc_main$g), { class: "size-9 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]" }, {
                        default: withCtx(() => [
                          showAvatar.value ? (openBlock(), createBlock(unref(_sfc_main$e), {
                            key: 0,
                            src: unref(user).avatar,
                            alt: displayHandle.value
                          }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                          createVNode(unref(_sfc_main$f), { class: "rounded-xl bg-blue-800/60 text-[11px] font-semibold text-blue-100" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(getInitials2)(displayHandle.value)), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/layout/NavUser.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "AppSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const { open, toggleSidebar, isMobile } = useSidebar();
    const isIconOnly = computed(() => !isMobile.value && !open.value);
    const mainNavItems = computed(() => {
      const items = [];
      if (page.props.auth.user?.can?.accessReportYears) {
        items.push({
          title: "Sex Disaggregated Data Report",
          href: "/report-years",
          icon: FileChartColumnIncreasing
        });
        items.push({
          title: "Print Report",
          href: "/print-report",
          icon: Printer
        });
      }
      return items;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(_sfc_main$O), {
        collapsible: "icon",
        variant: "sidebar",
        class: "sidebar-shell border-r border-white/[0.06] text-sidebar-foreground"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$H), { class: "border-b border-white/[0.07] px-3.5 pt-5 pb-4 group-data-[collapsible=icon]:px-2.5 group-data-[collapsible=icon]:pt-4 group-data-[collapsible=icon]:pb-3" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex items-start justify-between gap-2.5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$E), { class: "min-w-0 flex-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:max-w-full group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$v), { class: "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$w), {
                                size: "lg",
                                "as-child": "",
                                tooltip: "Home",
                                class: "h-auto min-h-0 w-full p-0 hover:bg-transparent group-data-[collapsible=icon]:justify-center"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Link), {
                                      href: _ctx.route("index"),
                                      class: "flex min-w-0 cursor-pointer rounded-xl py-1 pr-1.5 text-left transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.04] active:scale-[0.98] group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pr-0"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(_sfc_main$i, null, null, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(_sfc_main$i)
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Link), {
                                        href: _ctx.route("index"),
                                        class: "flex min-w-0 cursor-pointer rounded-xl py-1 pr-1.5 text-left transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.04] active:scale-[0.98] group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pr-0"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$i)
                                        ]),
                                        _: 1
                                      }, 8, ["href"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$w), {
                                  size: "lg",
                                  "as-child": "",
                                  tooltip: "Home",
                                  class: "h-auto min-h-0 w-full p-0 hover:bg-transparent group-data-[collapsible=icon]:justify-center"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Link), {
                                      href: _ctx.route("index"),
                                      class: "flex min-w-0 cursor-pointer rounded-xl py-1 pr-1.5 text-left transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.04] active:scale-[0.98] group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pr-0"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$i)
                                      ]),
                                      _: 1
                                    }, 8, ["href"])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$v), { class: "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$w), {
                                size: "lg",
                                "as-child": "",
                                tooltip: "Home",
                                class: "h-auto min-h-0 w-full p-0 hover:bg-transparent group-data-[collapsible=icon]:justify-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("index"),
                                    class: "flex min-w-0 cursor-pointer rounded-xl py-1 pr-1.5 text-left transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.04] active:scale-[0.98] group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pr-0"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$i)
                                    ]),
                                    _: 1
                                  }, 8, ["href"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<button type="button" class="sidebar-collapse-btn shrink-0 rounded-lg p-2 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.93] focus-visible:ring-2 focus-visible:ring-blue-300/40 focus-visible:outline-none group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:p-2.5"${ssrRenderAttr(
                    "aria-label",
                    unref(isMobile) ? "Close sidebar" : isIconOnly.value ? "Expand sidebar to full width" : "Collapse sidebar to icon strip"
                  )}${ssrRenderAttr("aria-expanded", unref(isMobile) ? true : !isIconOnly.value)}${ssrRenderAttr(
                    "title",
                    unref(isMobile) ? "Close sidebar" : isIconOnly.value ? "Expand sidebar (full width)" : "Collapse to icon strip (Ctrl+B)"
                  )}${_scopeId2}>`);
                  if (!isIconOnly.value) {
                    _push3(ssrRenderComponent(unref(ChevronsLeft), {
                      class: "size-[18px]",
                      "stroke-width": 1.8,
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(ssrRenderComponent(unref(ChevronsRight), {
                      class: "size-[18px]",
                      "stroke-width": 1.8,
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                  }
                  _push3(`</button></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-start justify-between gap-2.5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3" }, [
                      createVNode(unref(_sfc_main$E), { class: "min-w-0 flex-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:max-w-full group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$v), { class: "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$w), {
                                size: "lg",
                                "as-child": "",
                                tooltip: "Home",
                                class: "h-auto min-h-0 w-full p-0 hover:bg-transparent group-data-[collapsible=icon]:justify-center"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("index"),
                                    class: "flex min-w-0 cursor-pointer rounded-xl py-1 pr-1.5 text-left transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.04] active:scale-[0.98] group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pr-0"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$i)
                                    ]),
                                    _: 1
                                  }, 8, ["href"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("button", {
                        type: "button",
                        class: "sidebar-collapse-btn shrink-0 rounded-lg p-2 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.93] focus-visible:ring-2 focus-visible:ring-blue-300/40 focus-visible:outline-none group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:p-2.5",
                        "aria-label": unref(isMobile) ? "Close sidebar" : isIconOnly.value ? "Expand sidebar to full width" : "Collapse sidebar to icon strip",
                        "aria-expanded": unref(isMobile) ? true : !isIconOnly.value,
                        title: unref(isMobile) ? "Close sidebar" : isIconOnly.value ? "Expand sidebar (full width)" : "Collapse to icon strip (Ctrl+B)",
                        onClick: unref(toggleSidebar)
                      }, [
                        !isIconOnly.value ? (openBlock(), createBlock(unref(ChevronsLeft), {
                          key: 0,
                          class: "size-[18px]",
                          "stroke-width": 1.8,
                          "aria-hidden": "true"
                        })) : (openBlock(), createBlock(unref(ChevronsRight), {
                          key: 1,
                          class: "size-[18px]",
                          "stroke-width": 1.8,
                          "aria-hidden": "true"
                        }))
                      ], 8, ["aria-label", "aria-expanded", "title", "onClick"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$N), { class: "px-3 py-5 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$h, { items: mainNavItems.value }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$h, { items: mainNavItems.value }, null, 8, ["items"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$M), { class: "mt-auto space-y-2 border-t border-white/[0.07] p-3 group-data-[collapsible=icon]:p-2" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$E), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$v), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$w), {
                                "as-child": "",
                                size: "default",
                                tooltip: "Go back to public site"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(Link), {
                                      href: _ctx.route("index"),
                                      class: "sidebar-back-link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(unref(ArrowLeft), {
                                            class: "size-4 shrink-0",
                                            "stroke-width": 1.8,
                                            "aria-hidden": "true"
                                          }, null, _parent7, _scopeId6));
                                          _push7(`<span class="truncate"${_scopeId6}>Public site</span>`);
                                        } else {
                                          return [
                                            createVNode(unref(ArrowLeft), {
                                              class: "size-4 shrink-0",
                                              "stroke-width": 1.8,
                                              "aria-hidden": "true"
                                            }),
                                            createVNode("span", { class: "truncate" }, "Public site")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(Link), {
                                        href: _ctx.route("index"),
                                        class: "sidebar-back-link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(ArrowLeft), {
                                            class: "size-4 shrink-0",
                                            "stroke-width": 1.8,
                                            "aria-hidden": "true"
                                          }),
                                          createVNode("span", { class: "truncate" }, "Public site")
                                        ]),
                                        _: 1
                                      }, 8, ["href"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$w), {
                                  "as-child": "",
                                  size: "default",
                                  tooltip: "Go back to public site"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Link), {
                                      href: _ctx.route("index"),
                                      class: "sidebar-back-link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(ArrowLeft), {
                                          class: "size-4 shrink-0",
                                          "stroke-width": 1.8,
                                          "aria-hidden": "true"
                                        }),
                                        createVNode("span", { class: "truncate" }, "Public site")
                                      ]),
                                      _: 1
                                    }, 8, ["href"])
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$v), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$w), {
                                "as-child": "",
                                size: "default",
                                tooltip: "Go back to public site"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Link), {
                                    href: _ctx.route("index"),
                                    class: "sidebar-back-link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(ArrowLeft), {
                                        class: "size-4 shrink-0",
                                        "stroke-width": 1.8,
                                        "aria-hidden": "true"
                                      }),
                                      createVNode("span", { class: "truncate" }, "Public site")
                                    ]),
                                    _: 1
                                  }, 8, ["href"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$d, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$E), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$v), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$w), {
                              "as-child": "",
                              size: "default",
                              tooltip: "Go back to public site"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Link), {
                                  href: _ctx.route("index"),
                                  class: "sidebar-back-link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(ArrowLeft), {
                                      class: "size-4 shrink-0",
                                      "stroke-width": 1.8,
                                      "aria-hidden": "true"
                                    }),
                                    createVNode("span", { class: "truncate" }, "Public site")
                                  ]),
                                  _: 1
                                }, 8, ["href"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_sfc_main$d)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$o), null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$H), { class: "border-b border-white/[0.07] px-3.5 pt-5 pb-4 group-data-[collapsible=icon]:px-2.5 group-data-[collapsible=icon]:pt-4 group-data-[collapsible=icon]:pb-3" }, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex items-start justify-between gap-2.5 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-3" }, [
                    createVNode(unref(_sfc_main$E), { class: "min-w-0 flex-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:max-w-full group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$v), { class: "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$w), {
                              size: "lg",
                              "as-child": "",
                              tooltip: "Home",
                              class: "h-auto min-h-0 w-full p-0 hover:bg-transparent group-data-[collapsible=icon]:justify-center"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Link), {
                                  href: _ctx.route("index"),
                                  class: "flex min-w-0 cursor-pointer rounded-xl py-1 pr-1.5 text-left transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white/[0.04] active:scale-[0.98] group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:pr-0"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$i)
                                  ]),
                                  _: 1
                                }, 8, ["href"])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("button", {
                      type: "button",
                      class: "sidebar-collapse-btn shrink-0 rounded-lg p-2 transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.93] focus-visible:ring-2 focus-visible:ring-blue-300/40 focus-visible:outline-none group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:p-2.5",
                      "aria-label": unref(isMobile) ? "Close sidebar" : isIconOnly.value ? "Expand sidebar to full width" : "Collapse sidebar to icon strip",
                      "aria-expanded": unref(isMobile) ? true : !isIconOnly.value,
                      title: unref(isMobile) ? "Close sidebar" : isIconOnly.value ? "Expand sidebar (full width)" : "Collapse to icon strip (Ctrl+B)",
                      onClick: unref(toggleSidebar)
                    }, [
                      !isIconOnly.value ? (openBlock(), createBlock(unref(ChevronsLeft), {
                        key: 0,
                        class: "size-[18px]",
                        "stroke-width": 1.8,
                        "aria-hidden": "true"
                      })) : (openBlock(), createBlock(unref(ChevronsRight), {
                        key: 1,
                        class: "size-[18px]",
                        "stroke-width": 1.8,
                        "aria-hidden": "true"
                      }))
                    ], 8, ["aria-label", "aria-expanded", "title", "onClick"])
                  ])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$N), { class: "px-3 py-5 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3" }, {
                default: withCtx(() => [
                  createVNode(_sfc_main$h, { items: mainNavItems.value }, null, 8, ["items"])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$M), { class: "mt-auto space-y-2 border-t border-white/[0.07] p-3 group-data-[collapsible=icon]:p-2" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$E), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$v), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$w), {
                            "as-child": "",
                            size: "default",
                            tooltip: "Go back to public site"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Link), {
                                href: _ctx.route("index"),
                                class: "sidebar-back-link flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-[background-color,color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(ArrowLeft), {
                                    class: "size-4 shrink-0",
                                    "stroke-width": 1.8,
                                    "aria-hidden": "true"
                                  }),
                                  createVNode("span", { class: "truncate" }, "Public site")
                                ]),
                                _: 1
                              }, 8, ["href"])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_sfc_main$d)
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$o))
            ];
          }
        }),
        _: 1
      }, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/layout/AppSidebar.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "Breadcrumb",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        "aria-label": "breadcrumb",
        "data-slot": "breadcrumb",
        class: props.class
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</nav>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/breadcrumb/Breadcrumb.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "BreadcrumbEllipsis",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        "data-slot": "breadcrumb-ellipsis",
        role: "presentation",
        "aria-hidden": "true",
        class: unref(cn)("flex size-9 items-center justify-center", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(ssrRenderComponent(unref(MoreHorizontal), { class: "size-4" }, null, _parent));
      }, _push, _parent);
      _push(`<span class="sr-only">More</span></span>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/breadcrumb/BreadcrumbEllipsis.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "BreadcrumbItem",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<li${ssrRenderAttrs(mergeProps({
        "data-slot": "breadcrumb-item",
        class: unref(cn)("inline-flex items-center gap-1.5", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</li>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/breadcrumb/BreadcrumbItem.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "BreadcrumbLink",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: { default: "a" },
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Primitive), mergeProps({
        "data-slot": "breadcrumb-link",
        as: __props.as,
        "as-child": __props.asChild,
        class: unref(cn)("hover:text-foreground transition-colors", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/breadcrumb/BreadcrumbLink.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "BreadcrumbList",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<ol${ssrRenderAttrs(mergeProps({
        "data-slot": "breadcrumb-list",
        class: unref(cn)("text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</ol>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/breadcrumb/BreadcrumbList.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "BreadcrumbPage",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        "data-slot": "breadcrumb-page",
        role: "link",
        "aria-disabled": "true",
        "aria-current": "page",
        class: unref(cn)("text-foreground font-normal", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/breadcrumb/BreadcrumbPage.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "BreadcrumbSeparator",
  __ssrInlineRender: true,
  props: {
    class: { type: [Boolean, null, String, Object, Array] }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<li${ssrRenderAttrs(mergeProps({
        "data-slot": "breadcrumb-separator",
        role: "presentation",
        "aria-hidden": "true",
        class: unref(cn)("[&>svg]:size-3.5", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(ssrRenderComponent(unref(ChevronRight), null, null, _parent));
      }, _push, _parent);
      _push(`</li>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/breadcrumb/BreadcrumbSeparator.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Breadcrumbs",
  __ssrInlineRender: true,
  props: {
    breadcrumbs: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$b), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$7), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(__props.breadcrumbs, (item, index) => {
                    _push3(`<!--[-->`);
                    _push3(ssrRenderComponent(unref(_sfc_main$9), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (index === __props.breadcrumbs.length - 1) {
                            _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(item.title)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(item.title), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(ssrRenderComponent(unref(_sfc_main$8), { "as-child": "" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(Link), {
                                    href: item.href ?? "#"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(item.title)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(item.title), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(Link), {
                                      href: item.href ?? "#"
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
                            }, _parent4, _scopeId3));
                          }
                        } else {
                          return [
                            index === __props.breadcrumbs.length - 1 ? (openBlock(), createBlock(unref(_sfc_main$6), { key: 0 }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(item.title), 1)
                              ]),
                              _: 2
                            }, 1024)) : (openBlock(), createBlock(unref(_sfc_main$8), {
                              key: 1,
                              "as-child": ""
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Link), {
                                  href: item.href ?? "#"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.title), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ]),
                              _: 2
                            }, 1024))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    if (index !== __props.breadcrumbs.length - 1) {
                      _push3(ssrRenderComponent(unref(_sfc_main$5), null, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<!--]-->`);
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.breadcrumbs, (item, index) => {
                      return openBlock(), createBlock(Fragment, { key: index }, [
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            index === __props.breadcrumbs.length - 1 ? (openBlock(), createBlock(unref(_sfc_main$6), { key: 0 }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(item.title), 1)
                              ]),
                              _: 2
                            }, 1024)) : (openBlock(), createBlock(unref(_sfc_main$8), {
                              key: 1,
                              "as-child": ""
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Link), {
                                  href: item.href ?? "#"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.title), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ]),
                              _: 2
                            }, 1024))
                          ]),
                          _: 2
                        }, 1024),
                        index !== __props.breadcrumbs.length - 1 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 0 })) : createCommentVNode("", true)
                      ], 64);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$7), null, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.breadcrumbs, (item, index) => {
                    return openBlock(), createBlock(Fragment, { key: index }, [
                      createVNode(unref(_sfc_main$9), null, {
                        default: withCtx(() => [
                          index === __props.breadcrumbs.length - 1 ? (openBlock(), createBlock(unref(_sfc_main$6), { key: 0 }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.title), 1)
                            ]),
                            _: 2
                          }, 1024)) : (openBlock(), createBlock(unref(_sfc_main$8), {
                            key: 1,
                            "as-child": ""
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Link), {
                                href: item.href ?? "#"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(item.title), 1)
                                ]),
                                _: 2
                              }, 1032, ["href"])
                            ]),
                            _: 2
                          }, 1024))
                        ]),
                        _: 2
                      }, 1024),
                      index !== __props.breadcrumbs.length - 1 ? (openBlock(), createBlock(unref(_sfc_main$5), { key: 0 })) : createCommentVNode("", true)
                    ], 64);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/layout/Breadcrumbs.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AppSidebarHeader",
  __ssrInlineRender: true,
  props: {
    breadcrumbs: { default: () => [] }
  },
  setup(__props) {
    const { open, toggleSidebar, isMobile } = useSidebar();
    const isIconOnly = computed(() => !isMobile.value && !open.value);
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.breadcrumbs && __props.breadcrumbs.length > 0) {
        _push(`<header${ssrRenderAttrs(mergeProps({ class: "app-topbar-surface sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sm:h-16 sm:px-4 md:px-6" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(_sfc_main$l), {
          class: "shrink-0 rounded-md border border-slate-300/80 bg-white/90 text-slate-700 shadow-sm transition-[background-color,color,border-color,transform] duration-200 ease-out hover:border-slate-400 hover:bg-white hover:text-slate-900 active:scale-[0.97] md:hidden",
          "aria-label": "Open sidebar"
        }, null, _parent));
        _push(`<div class="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">`);
        _push(ssrRenderComponent(_sfc_main$4, { breadcrumbs: __props.breadcrumbs }, null, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(unref(_sfc_main$Z), {
          type: "button",
          variant: "outline",
          size: "icon",
          class: "hidden h-9 w-9 shrink-0 rounded-md border border-slate-300/80 bg-white/90 text-slate-700 shadow-sm transition-[background-color,color,border-color,transform] duration-200 ease-out hover:border-slate-400 hover:bg-white hover:text-slate-900 active:scale-[0.97] md:inline-flex",
          "aria-label": isIconOnly.value ? "Expand sidebar to full width" : "Collapse sidebar to icon strip",
          title: isIconOnly.value ? "Expand sidebar (full width)" : "Collapse to icon strip (Ctrl+B)",
          onClick: unref(toggleSidebar)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!isIconOnly.value) {
                _push2(ssrRenderComponent(unref(ChevronsLeft), {
                  class: "size-4",
                  "stroke-width": 2,
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
              } else {
                _push2(ssrRenderComponent(unref(ChevronsRight), {
                  class: "size-4",
                  "stroke-width": 2,
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
              }
            } else {
              return [
                !isIconOnly.value ? (openBlock(), createBlock(unref(ChevronsLeft), {
                  key: 0,
                  class: "size-4",
                  "stroke-width": 2,
                  "aria-hidden": "true"
                })) : (openBlock(), createBlock(unref(ChevronsRight), {
                  key: 1,
                  class: "size-4",
                  "stroke-width": 2,
                  "aria-hidden": "true"
                }))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</header>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/layout/AppSidebarHeader.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppSidebarLayout",
  __ssrInlineRender: true,
  props: {
    breadcrumbs: { default: () => [] },
    showFooter: { type: Boolean, default: true },
    contentClass: { default: "" },
    compactMainColumn: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$j, mergeProps({ variant: "sidebar" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$c, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$k, {
              variant: "sidebar",
              class: "app-main-shell flex min-h-0 flex-1 flex-col overflow-x-hidden"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.breadcrumbs.length === 0) {
                    _push3(`<div class="flex h-12 shrink-0 items-center border-b border-sidebar-border/70 bg-background px-3 md:hidden"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(_sfc_main$l), {
                      class: "rounded-md border border-sidebar-border/80 bg-background shadow-sm",
                      "aria-label": "Open sidebar"
                    }, null, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_sfc_main$3, { breadcrumbs: __props.breadcrumbs }, null, _parent3, _scopeId2));
                  _push3(`<div class="${ssrRenderClass([__props.compactMainColumn ? "flex-none" : "flex-1", "flex min-h-0 flex-col"])}"${_scopeId2}><div class="${ssrRenderClass([[__props.contentClass, __props.compactMainColumn ? false : "flex-1"], "min-h-0"])}"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  _push3(`</div>`);
                  if (__props.showFooter) {
                    _push3(ssrRenderComponent(_sfc_main$_, null, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    __props.breadcrumbs.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex h-12 shrink-0 items-center border-b border-sidebar-border/70 bg-background px-3 md:hidden"
                    }, [
                      createVNode(unref(_sfc_main$l), {
                        class: "rounded-md border border-sidebar-border/80 bg-background shadow-sm",
                        "aria-label": "Open sidebar"
                      })
                    ])) : createCommentVNode("", true),
                    createVNode(_sfc_main$3, { breadcrumbs: __props.breadcrumbs }, null, 8, ["breadcrumbs"]),
                    createVNode("div", {
                      class: ["flex min-h-0 flex-col", __props.compactMainColumn ? "flex-none" : "flex-1"]
                    }, [
                      createVNode("div", {
                        class: ["min-h-0", [__props.contentClass, __props.compactMainColumn ? false : "flex-1"]]
                      }, [
                        renderSlot(_ctx.$slots, "default")
                      ], 2),
                      __props.showFooter ? (openBlock(), createBlock(_sfc_main$_, { key: 0 })) : createCommentVNode("", true)
                    ], 2)
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$c),
              createVNode(_sfc_main$k, {
                variant: "sidebar",
                class: "app-main-shell flex min-h-0 flex-1 flex-col overflow-x-hidden"
              }, {
                default: withCtx(() => [
                  __props.breadcrumbs.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex h-12 shrink-0 items-center border-b border-sidebar-border/70 bg-background px-3 md:hidden"
                  }, [
                    createVNode(unref(_sfc_main$l), {
                      class: "rounded-md border border-sidebar-border/80 bg-background shadow-sm",
                      "aria-label": "Open sidebar"
                    })
                  ])) : createCommentVNode("", true),
                  createVNode(_sfc_main$3, { breadcrumbs: __props.breadcrumbs }, null, 8, ["breadcrumbs"]),
                  createVNode("div", {
                    class: ["flex min-h-0 flex-col", __props.compactMainColumn ? "flex-none" : "flex-1"]
                  }, [
                    createVNode("div", {
                      class: ["min-h-0", [__props.contentClass, __props.compactMainColumn ? false : "flex-1"]]
                    }, [
                      renderSlot(_ctx.$slots, "default")
                    ], 2),
                    __props.showFooter ? (openBlock(), createBlock(_sfc_main$_, { key: 0 })) : createCommentVNode("", true)
                  ], 2)
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/app/AppSidebarLayout.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const TOAST_LIMIT = 3;
const toasts = ref([]);
function useToast() {
  return {
    toasts,
    toast: (props) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = {
        ...props,
        id,
        open: true,
        type: props.type ?? "default"
      };
      toasts.value = [newToast, ...toasts.value].slice(0, TOAST_LIMIT);
      return id;
    },
    dismiss: (toastId) => {
      if (toastId) {
        const index = toasts.value.findIndex((t) => t.id === toastId);
        if (index !== -1) {
          toasts.value[index].open = false;
        }
      } else {
        toasts.value.forEach((t) => t.open = false);
      }
      setTimeout(() => {
        if (toastId) {
          toasts.value = toasts.value.filter((t) => t.id !== toastId);
        } else {
          toasts.value = [];
        }
      }, 300);
    }
  };
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Toaster",
  __ssrInlineRender: true,
  setup(__props) {
    const { toasts: toasts2, dismiss } = useToast();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ToastProvider), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(toasts2), (toast) => {
              _push2(ssrRenderComponent(unref(ToastRoot), {
                key: toast.id,
                open: toast.open,
                "onUpdate:open": (val) => {
                  if (!val) unref(dismiss)(toast.id);
                },
                class: ["group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.95] data-[state=open]:zoom-in-[0.95] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]", [
                  toast.type === "error" ? "border-red-200 bg-red-50 text-red-900" : toast.type === "warning" ? "border-orange-200 bg-orange-50 text-orange-900" : "border-slate-200 bg-white text-slate-900"
                ]],
                duration: toast.duration ?? 5e3
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="flex flex-col gap-1.5" data-v-181cdb8e${_scopeId2}>`);
                    if (toast.title) {
                      _push3(ssrRenderComponent(unref(ToastTitle), { class: "text-sm font-semibold tracking-tight" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(toast.title)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(toast.title), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    if (toast.description) {
                      _push3(ssrRenderComponent(unref(ToastDescription), {
                        class: ["text-sm", toast.type === "error" ? "text-red-800/90" : toast.type === "warning" ? "text-orange-800/90" : "text-slate-500"]
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            if (typeof toast.description === "object") {
                              ssrRenderVNode(_push4, createVNode(resolveDynamicComponent(toast.description), null, null), _parent4, _scopeId3);
                            } else {
                              _push4(`<span data-v-181cdb8e${_scopeId3}>${ssrInterpolate(toast.description)}</span>`);
                            }
                          } else {
                            return [
                              typeof toast.description === "object" ? (openBlock(), createBlock(resolveDynamicComponent(toast.description), { key: 0 })) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(toast.description), 1))
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                    if (toast.action) {
                      _push3(ssrRenderComponent(unref(ToastAction), {
                        class: "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
                        altText: "Action",
                        onClick: toast.action.onClick
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(toast.action.label)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(toast.action.label), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(ssrRenderComponent(unref(ToastClose), { class: "absolute right-2 top-2 rounded-md p-1 text-slate-500 opacity-0 transition-opacity hover:text-slate-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 active:scale-[0.97]" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(X), { class: "size-4" })
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-col gap-1.5" }, [
                        toast.title ? (openBlock(), createBlock(unref(ToastTitle), {
                          key: 0,
                          class: "text-sm font-semibold tracking-tight"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(toast.title), 1)
                          ]),
                          _: 2
                        }, 1024)) : createCommentVNode("", true),
                        toast.description ? (openBlock(), createBlock(unref(ToastDescription), {
                          key: 1,
                          class: ["text-sm", toast.type === "error" ? "text-red-800/90" : toast.type === "warning" ? "text-orange-800/90" : "text-slate-500"]
                        }, {
                          default: withCtx(() => [
                            typeof toast.description === "object" ? (openBlock(), createBlock(resolveDynamicComponent(toast.description), { key: 0 })) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(toast.description), 1))
                          ]),
                          _: 2
                        }, 1032, ["class"])) : createCommentVNode("", true)
                      ]),
                      toast.action ? (openBlock(), createBlock(unref(ToastAction), {
                        key: 0,
                        class: "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
                        altText: "Action",
                        onClick: toast.action.onClick
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(toast.action.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick"])) : createCommentVNode("", true),
                      createVNode(unref(ToastClose), { class: "absolute right-2 top-2 rounded-md p-1 text-slate-500 opacity-0 transition-opacity hover:text-slate-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 active:scale-[0.97]" }, {
                        default: withCtx(() => [
                          createVNode(unref(X), { class: "size-4" })
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(unref(ToastViewport), { class: "fixed top-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:right-0 sm:flex-col md:max-w-[420px]" }, null, _parent2, _scopeId));
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(toasts2), (toast) => {
                return openBlock(), createBlock(unref(ToastRoot), {
                  key: toast.id,
                  open: toast.open,
                  "onUpdate:open": (val) => {
                    if (!val) unref(dismiss)(toast.id);
                  },
                  class: ["group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-[0.95] data-[state=open]:zoom-in-[0.95] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]", [
                    toast.type === "error" ? "border-red-200 bg-red-50 text-red-900" : toast.type === "warning" ? "border-orange-200 bg-orange-50 text-orange-900" : "border-slate-200 bg-white text-slate-900"
                  ]],
                  duration: toast.duration ?? 5e3
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "flex flex-col gap-1.5" }, [
                      toast.title ? (openBlock(), createBlock(unref(ToastTitle), {
                        key: 0,
                        class: "text-sm font-semibold tracking-tight"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(toast.title), 1)
                        ]),
                        _: 2
                      }, 1024)) : createCommentVNode("", true),
                      toast.description ? (openBlock(), createBlock(unref(ToastDescription), {
                        key: 1,
                        class: ["text-sm", toast.type === "error" ? "text-red-800/90" : toast.type === "warning" ? "text-orange-800/90" : "text-slate-500"]
                      }, {
                        default: withCtx(() => [
                          typeof toast.description === "object" ? (openBlock(), createBlock(resolveDynamicComponent(toast.description), { key: 0 })) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(toast.description), 1))
                        ]),
                        _: 2
                      }, 1032, ["class"])) : createCommentVNode("", true)
                    ]),
                    toast.action ? (openBlock(), createBlock(unref(ToastAction), {
                      key: 0,
                      class: "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
                      altText: "Action",
                      onClick: toast.action.onClick
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(toast.action.label), 1)
                      ]),
                      _: 2
                    }, 1032, ["onClick"])) : createCommentVNode("", true),
                    createVNode(unref(ToastClose), { class: "absolute right-2 top-2 rounded-md p-1 text-slate-500 opacity-0 transition-opacity hover:text-slate-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 active:scale-[0.97]" }, {
                      default: withCtx(() => [
                        createVNode(unref(X), { class: "size-4" })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 2
                }, 1032, ["open", "onUpdate:open", "class", "duration"]);
              }), 128)),
              createVNode(unref(ToastViewport), { class: "fixed top-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:right-0 sm:flex-col md:max-w-[420px]" })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/ui/toast/Toaster.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Toaster = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-181cdb8e"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AppLayout",
  __ssrInlineRender: true,
  props: {
    breadcrumbs: { default: () => [] },
    showFooter: { type: Boolean, default: true },
    contentClass: { default: "" },
    compactMainColumn: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$2, mergeProps({
        breadcrumbs: __props.breadcrumbs,
        "show-footer": __props.showFooter,
        "content-class": __props.contentClass,
        "compact-main-column": __props.compactMainColumn
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(ssrRenderComponent(Toaster, null, null, _parent2, _scopeId));
          } else {
            return [
              renderSlot(_ctx.$slots, "default"),
              createVNode(Toaster)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layouts/AppLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  _sfc_main$B as a,
  _sfc_main$y as b,
  _sfc_main$A as c,
  _sfc_main$n as d,
  useToast as u
};
