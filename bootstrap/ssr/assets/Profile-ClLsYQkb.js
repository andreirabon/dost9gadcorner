import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext, toDisplayString } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useForm, usePage, Head } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./HeadingSmall-BTYlDd0F.js";
import { _ as _sfc_main$c } from "./InputError-CkRw5jBS.js";
import { a as _sfc_main$5, _ as _sfc_main$b } from "./Input-DgH3elPy.js";
import { _ as _sfc_main$3, f as _sfc_main$4, a as _sfc_main$6, b as _sfc_main$7, c as _sfc_main$8, d as _sfc_main$9, e as _sfc_main$d, g as _sfc_main$e } from "./DialogTrigger-BXuAjQE2.js";
import { _ as _sfc_main$a } from "./Label-BPBW_hyv.js";
import { _ as _sfc_main$f } from "./AppLayout-ZR8ZPUp4.js";
import { _ as _sfc_main$g } from "./Layout-DQLSP_yB.js";
import "class-variance-authority";
import "reka-ui";
import "clsx";
import "tailwind-merge";
import "@vueuse/core";
import "@lucide/vue";
import "./AppFooter-ClQxMSzB.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DeleteUser",
  __ssrInlineRender: true,
  setup(__props) {
    const passwordInput = ref(null);
    const form = useForm({
      password: ""
    });
    const deleteUser = (e) => {
      e.preventDefault();
      form.delete(route("settings.profile.destroy"), {
        preserveScroll: true,
        onSuccess: () => closeModal(),
        onError: () => passwordInput.value?.focus(),
        onFinish: () => form.reset()
      });
    };
    const closeModal = () => {
      form.clearErrors();
      form.reset();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-surface-card space-y-6 rounded-2xl p-5 sm:p-6" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        title: "Delete account",
        description: "Delete your account and all of its resources"
      }, null, _parent));
      _push(`<div class="space-y-4 rounded-xl border border-red-200 bg-red-50/90 p-4"><div class="relative space-y-1 text-red-700"><p class="text-xs font-semibold tracking-[0.14em] uppercase">Warning</p><p class="text-sm leading-relaxed">This action permanently deletes your account and all associated data.</p></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$3), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$4), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    variant: "destructive",
                    class: "cursor-pointer rounded-xl border border-red-700/20 transition-[transform,background-color,border-color] duration-200 ease-out active:scale-[0.97]"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Delete account `);
                      } else {
                        return [
                          createTextVNode(" Delete account ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$5), {
                      variant: "destructive",
                      class: "cursor-pointer rounded-xl border border-red-700/20 transition-[transform,background-color,border-color] duration-200 ease-out active:scale-[0.97]"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Delete account ")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$6), { class: "border-slate-200 bg-white text-slate-900 sm:max-w-md" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form class="space-y-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$7), { class: "space-y-3" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Are you sure you want to delete your account?`);
                            } else {
                              return [
                                createTextVNode("Are you sure you want to delete your account?")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Once your account is deleted, all resources and data will be permanently removed. Please enter your password to confirm. `);
                            } else {
                              return [
                                createTextVNode(" Once your account is deleted, all resources and data will be permanently removed. Please enter your password to confirm. ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode("Are you sure you want to delete your account?")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode(" Once your account is deleted, all resources and data will be permanently removed. Please enter your password to confirm. ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="grid gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$a), {
                    for: "password",
                    class: "sr-only"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Password`);
                      } else {
                        return [
                          createTextVNode("Password")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$b), {
                    id: "password",
                    ref_key: "passwordInput",
                    ref: passwordInput,
                    modelValue: unref(form).password,
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    type: "password",
                    name: "password",
                    placeholder: "Password",
                    class: "h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300/80"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_sfc_main$c, {
                    message: unref(form).errors.password
                  }, null, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$d), { class: "gap-2" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$e), { "as-child": "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$5), {
                                variant: "secondary",
                                class: "cursor-pointer rounded-xl",
                                onClick: closeModal
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Cancel `);
                                  } else {
                                    return [
                                      createTextVNode(" Cancel ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$5), {
                                  variant: "secondary",
                                  class: "cursor-pointer rounded-xl",
                                  onClick: closeModal
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Cancel ")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$5), {
                          type: "submit",
                          variant: "destructive",
                          class: "cursor-pointer rounded-xl transition-transform duration-200 ease-out active:scale-[0.97]",
                          disabled: unref(form).processing
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Delete account `);
                            } else {
                              return [
                                createTextVNode(" Delete account ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$e), { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$5), {
                                variant: "secondary",
                                class: "cursor-pointer rounded-xl",
                                onClick: closeModal
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Cancel ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$5), {
                            type: "submit",
                            variant: "destructive",
                            class: "cursor-pointer rounded-xl transition-transform duration-200 ease-out active:scale-[0.97]",
                            disabled: unref(form).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Delete account ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</form>`);
                } else {
                  return [
                    createVNode("form", {
                      class: "space-y-6",
                      onSubmit: deleteUser
                    }, [
                      createVNode(unref(_sfc_main$7), { class: "space-y-3" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createTextVNode("Are you sure you want to delete your account?")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode(" Once your account is deleted, all resources and data will be permanently removed. Please enter your password to confirm. ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "grid gap-2" }, [
                        createVNode(unref(_sfc_main$a), {
                          for: "password",
                          class: "sr-only"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Password")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$b), {
                          id: "password",
                          ref_key: "passwordInput",
                          ref: passwordInput,
                          modelValue: unref(form).password,
                          "onUpdate:modelValue": ($event) => unref(form).password = $event,
                          type: "password",
                          name: "password",
                          placeholder: "Password",
                          class: "h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300/80"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_sfc_main$c, {
                          message: unref(form).errors.password
                        }, null, 8, ["message"])
                      ]),
                      createVNode(unref(_sfc_main$d), { class: "gap-2" }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$e), { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$5), {
                                variant: "secondary",
                                class: "cursor-pointer rounded-xl",
                                onClick: closeModal
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Cancel ")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$5), {
                            type: "submit",
                            variant: "destructive",
                            class: "cursor-pointer rounded-xl transition-transform duration-200 ease-out active:scale-[0.97]",
                            disabled: unref(form).processing
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Delete account ")
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ]),
                        _: 1
                      })
                    ], 32)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$4), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$5), {
                    variant: "destructive",
                    class: "cursor-pointer rounded-xl border border-red-700/20 transition-[transform,background-color,border-color] duration-200 ease-out active:scale-[0.97]"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Delete account ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$6), { class: "border-slate-200 bg-white text-slate-900 sm:max-w-md" }, {
                default: withCtx(() => [
                  createVNode("form", {
                    class: "space-y-6",
                    onSubmit: deleteUser
                  }, [
                    createVNode(unref(_sfc_main$7), { class: "space-y-3" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$8), null, {
                          default: withCtx(() => [
                            createTextVNode("Are you sure you want to delete your account?")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createTextVNode(" Once your account is deleted, all resources and data will be permanently removed. Please enter your password to confirm. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "grid gap-2" }, [
                      createVNode(unref(_sfc_main$a), {
                        for: "password",
                        class: "sr-only"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Password")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$b), {
                        id: "password",
                        ref_key: "passwordInput",
                        ref: passwordInput,
                        modelValue: unref(form).password,
                        "onUpdate:modelValue": ($event) => unref(form).password = $event,
                        type: "password",
                        name: "password",
                        placeholder: "Password",
                        class: "h-11 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-300/80"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(_sfc_main$c, {
                        message: unref(form).errors.password
                      }, null, 8, ["message"])
                    ]),
                    createVNode(unref(_sfc_main$d), { class: "gap-2" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$e), { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$5), {
                              variant: "secondary",
                              class: "cursor-pointer rounded-xl",
                              onClick: closeModal
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Cancel ")
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$5), {
                          type: "submit",
                          variant: "destructive",
                          class: "cursor-pointer rounded-xl transition-transform duration-200 ease-out active:scale-[0.97]",
                          disabled: unref(form).processing
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Delete account ")
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ]),
                      _: 1
                    })
                  ], 32)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/settings/DeleteUser.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Profile",
  __ssrInlineRender: true,
  setup(__props) {
    const breadcrumbItems = [
      {
        title: "Profile settings",
        href: "/settings/profile"
      }
    ];
    const user = usePage().props.auth.user;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$f, mergeProps({ breadcrumbs: breadcrumbItems }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Profile settings" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$g, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="app-surface-card rounded-2xl p-5 sm:p-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_sfc_main$2, {
                    title: "Profile",
                    description: "Your sign-in username"
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4"${_scopeId2}><p class="text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase"${_scopeId2}>Username</p><p class="mt-1.5 font-sans text-base font-semibold tabular-nums tracking-tight text-slate-900"${_scopeId2}>${ssrInterpolate(unref(user).username ?? "—")}</p><p class="mt-2 text-sm leading-relaxed text-slate-600"${_scopeId2}> Contact an administrator to change this value. </p></div></div>`);
                  _push3(ssrRenderComponent(_sfc_main$1, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "app-surface-card rounded-2xl p-5 sm:p-6" }, [
                      createVNode(_sfc_main$2, {
                        title: "Profile",
                        description: "Your sign-in username"
                      }),
                      createVNode("div", { class: "mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4" }, [
                        createVNode("p", { class: "text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase" }, "Username"),
                        createVNode("p", { class: "mt-1.5 font-sans text-base font-semibold tabular-nums tracking-tight text-slate-900" }, toDisplayString(unref(user).username ?? "—"), 1),
                        createVNode("p", { class: "mt-2 text-sm leading-relaxed text-slate-600" }, " Contact an administrator to change this value. ")
                      ])
                    ]),
                    createVNode(_sfc_main$1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "Profile settings" }),
              createVNode(_sfc_main$g, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "app-surface-card rounded-2xl p-5 sm:p-6" }, [
                    createVNode(_sfc_main$2, {
                      title: "Profile",
                      description: "Your sign-in username"
                    }),
                    createVNode("div", { class: "mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4" }, [
                      createVNode("p", { class: "text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase" }, "Username"),
                      createVNode("p", { class: "mt-1.5 font-sans text-base font-semibold tabular-nums tracking-tight text-slate-900" }, toDisplayString(unref(user).username ?? "—"), 1),
                      createVNode("p", { class: "mt-2 text-sm leading-relaxed text-slate-600" }, " Contact an administrator to change this value. ")
                    ])
                  ]),
                  createVNode(_sfc_main$1)
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/settings/Profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
