import { defineComponent, mergeProps, withCtx, unref, createTextVNode, createVNode, withModifiers, withDirectives, vModelSelect, openBlock, createBlock, toDisplayString, vModelText, vShow, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { _ as _sfc_main$2, R as REPORT_YEAR_FIELD_LIMITS } from "./reportYearFields-ClRreS0A.js";
import { _ as _sfc_main$5 } from "./InputError-CkRw5jBS.js";
import { _ as _sfc_main$4 } from "./Input-DgH3elPy.js";
import { _ as _sfc_main$3 } from "./Label-BPBW_hyv.js";
import { _ as _sfc_main$1 } from "./AppLayout-ZR8ZPUp4.js";
import { useForm, Head } from "@inertiajs/vue3";
import { Loader2 } from "@lucide/vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./ReportBackArrowIcon-DMMIaSWx.js";
import "class-variance-authority";
import "reka-ui";
import "clsx";
import "tailwind-merge";
import "@vueuse/core";
import "./AppFooter-ClQxMSzB.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Create",
  __ssrInlineRender: true,
  setup(__props) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const form = useForm({
      year: currentYear,
      title: "",
      description: "",
      status: "pending"
    });
    const submit = () => {
      form.post(route("report-years.store"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        "show-footer": false,
        "content-class": "report-years-page"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "New Report Year" }, null, _parent2, _scopeId));
            _push2(`<div class="report-years-inner report-years-inner--create" data-v-02827330${_scopeId}><header class="report-years-create-header animate-fade-in-up" data-v-02827330${_scopeId}><div class="report-years-create-hero" data-v-02827330${_scopeId}><div class="report-years-create-hero-top" data-v-02827330${_scopeId}><div data-v-02827330${_scopeId}><p class="report-years-kicker" data-v-02827330${_scopeId}>New record</p><h1 class="report-years-title" data-v-02827330${_scopeId}>Create report year</h1></div>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              href: _ctx.route("report-years.index"),
              inline: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Back to all years `);
                } else {
                  return [
                    createTextVNode(" Back to all years ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><p class="report-years-lede text-xs" data-v-02827330${_scopeId}> Set the reporting year, an optional custom title, and the initial status. </p></div></header><div class="report-years-form-card w-full min-w-0 animate-fade-in-up delay-1" data-v-02827330${_scopeId}><form autocomplete="off" class="report-years-create-form" data-v-02827330${_scopeId}><div class="report-years-create-form-grid" data-v-02827330${_scopeId}><div class="space-y-2" data-v-02827330${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              for: "year",
              class: "text-[13px] font-medium text-black"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Reporting year`);
                } else {
                  return [
                    createTextVNode("Reporting year")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$4), {
              id: "year",
              modelValue: unref(form).year,
              "onUpdate:modelValue": ($event) => unref(form).year = $event,
              name: "year",
              type: "number",
              min: unref(REPORT_YEAR_FIELD_LIMITS).yearMin,
              max: unref(REPORT_YEAR_FIELD_LIMITS).yearMax,
              inputmode: "numeric",
              class: "report-field h-11 w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$5, {
              message: unref(form).errors.year
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="space-y-2" data-v-02827330${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              for: "status",
              class: "text-[13px] font-medium text-black"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Initial status`);
                } else {
                  return [
                    createTextVNode("Initial status")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="relative" data-v-02827330${_scopeId}><select id="status" name="status" class="report-select h-11 w-full appearance-none pr-10 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]" data-v-02827330${_scopeId}><option value="pending" data-v-02827330${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "pending") : ssrLooseEqual(unref(form).status, "pending")) ? " selected" : ""}${_scopeId}>Pending (draft)</option><option value="published" data-v-02827330${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "published") : ssrLooseEqual(unref(form).status, "published")) ? " selected" : ""}${_scopeId}>Published (public)</option></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3" aria-hidden="true" data-v-02827330${_scopeId}><svg class="size-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-02827330${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-v-02827330${_scopeId}></path></svg></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              message: unref(form).errors.status
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="space-y-2" data-v-02827330${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              for: "title",
              class: "text-[13px] font-medium text-black"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Custom title <span class="font-normal text-black" data-v-02827330${_scopeId2}>(optional)</span>`);
                } else {
                  return [
                    createTextVNode(" Custom title "),
                    createVNode("span", { class: "font-normal text-black" }, "(optional)")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$4), {
              id: "title",
              modelValue: unref(form).title,
              "onUpdate:modelValue": ($event) => unref(form).title = $event,
              name: "title",
              type: "text",
              placeholder: "e.g., Annual regional review",
              maxlength: unref(REPORT_YEAR_FIELD_LIMITS).title,
              class: "report-field h-11 w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex justify-between gap-2" data-v-02827330${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              message: unref(form).errors.title
            }, null, _parent2, _scopeId));
            _push2(`<span class="ml-auto text-xs text-black tabular-nums" data-v-02827330${_scopeId}>${ssrInterpolate(unref(form).title?.length || 0)} / ${ssrInterpolate(unref(REPORT_YEAR_FIELD_LIMITS).title)}</span></div></div><div class="space-y-2" data-v-02827330${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              for: "description",
              class: "text-[13px] font-medium text-black"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Description <span class="font-normal text-black" data-v-02827330${_scopeId2}>(optional)</span>`);
                } else {
                  return [
                    createTextVNode(" Description "),
                    createVNode("span", { class: "font-normal text-black" }, "(optional)")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<textarea id="description" name="description" rows="3" placeholder="Brief summary of this reporting period..."${ssrRenderAttr("maxlength", unref(REPORT_YEAR_FIELD_LIMITS).description)} class="report-textarea w-full resize-y transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]" data-v-02827330${_scopeId}>${ssrInterpolate(unref(form).description)}</textarea><div class="flex justify-between gap-2" data-v-02827330${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              message: unref(form).errors.description
            }, null, _parent2, _scopeId));
            _push2(`<span class="ml-auto text-xs text-black tabular-nums" data-v-02827330${_scopeId}>${ssrInterpolate(unref(form).description?.length || 0)} / ${ssrInterpolate(unref(REPORT_YEAR_FIELD_LIMITS).description)}</span></div></div><div class="report-years-create-actions" data-v-02827330${_scopeId}><p class="mr-auto text-sm font-medium text-emerald-700" style="${ssrRenderStyle(unref(form).recentlySuccessful ? null : { display: "none" })}" data-v-02827330${_scopeId}> Saved successfully. </p><button type="button" class="report-years-btn-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]" data-v-02827330${_scopeId}> Reset </button><button type="submit" class="report-years-btn-primary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-50"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} data-v-02827330${_scopeId}>`);
            if (unref(form).processing) {
              _push2(ssrRenderComponent(unref(Loader2), { class: "mr-2 size-4 animate-spin" }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(` Create year </button></div></form></div></div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "New Report Year" }),
              createVNode("div", { class: "report-years-inner report-years-inner--create" }, [
                createVNode("header", { class: "report-years-create-header animate-fade-in-up" }, [
                  createVNode("div", { class: "report-years-create-hero" }, [
                    createVNode("div", { class: "report-years-create-hero-top" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "report-years-kicker" }, "New record"),
                        createVNode("h1", { class: "report-years-title" }, "Create report year")
                      ]),
                      createVNode(_sfc_main$2, {
                        href: _ctx.route("report-years.index"),
                        inline: ""
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Back to all years ")
                        ]),
                        _: 1
                      }, 8, ["href"])
                    ]),
                    createVNode("p", { class: "report-years-lede text-xs" }, " Set the reporting year, an optional custom title, and the initial status. ")
                  ])
                ]),
                createVNode("div", { class: "report-years-form-card w-full min-w-0 animate-fade-in-up delay-1" }, [
                  createVNode("form", {
                    autocomplete: "off",
                    class: "report-years-create-form",
                    onSubmit: withModifiers(submit, ["prevent"])
                  }, [
                    createVNode("div", { class: "report-years-create-form-grid" }, [
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$3), {
                          for: "year",
                          class: "text-[13px] font-medium text-black"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Reporting year")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$4), {
                          id: "year",
                          modelValue: unref(form).year,
                          "onUpdate:modelValue": ($event) => unref(form).year = $event,
                          name: "year",
                          type: "number",
                          min: unref(REPORT_YEAR_FIELD_LIMITS).yearMin,
                          max: unref(REPORT_YEAR_FIELD_LIMITS).yearMax,
                          inputmode: "numeric",
                          class: "report-field h-11 w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "max"]),
                        createVNode(_sfc_main$5, {
                          message: unref(form).errors.year
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode(unref(_sfc_main$3), {
                          for: "status",
                          class: "text-[13px] font-medium text-black"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Initial status")
                          ]),
                          _: 1
                        }),
                        createVNode("div", { class: "relative" }, [
                          withDirectives(createVNode("select", {
                            id: "status",
                            "onUpdate:modelValue": ($event) => unref(form).status = $event,
                            name: "status",
                            class: "report-select h-11 w-full appearance-none pr-10 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
                          }, [
                            createVNode("option", { value: "pending" }, "Pending (draft)"),
                            createVNode("option", { value: "published" }, "Published (public)")
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(form).status]
                          ]),
                          createVNode("div", {
                            class: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
                            "aria-hidden": "true"
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "size-4 text-slate-400",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M19 9l-7 7-7-7"
                              })
                            ]))
                          ])
                        ]),
                        createVNode(_sfc_main$5, {
                          message: unref(form).errors.status
                        }, null, 8, ["message"])
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$3), {
                        for: "title",
                        class: "text-[13px] font-medium text-black"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Custom title "),
                          createVNode("span", { class: "font-normal text-black" }, "(optional)")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$4), {
                        id: "title",
                        modelValue: unref(form).title,
                        "onUpdate:modelValue": ($event) => unref(form).title = $event,
                        name: "title",
                        type: "text",
                        placeholder: "e.g., Annual regional review",
                        maxlength: unref(REPORT_YEAR_FIELD_LIMITS).title,
                        class: "report-field h-11 w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "maxlength"]),
                      createVNode("div", { class: "flex justify-between gap-2" }, [
                        createVNode(_sfc_main$5, {
                          message: unref(form).errors.title
                        }, null, 8, ["message"]),
                        createVNode("span", { class: "ml-auto text-xs text-black tabular-nums" }, toDisplayString(unref(form).title?.length || 0) + " / " + toDisplayString(unref(REPORT_YEAR_FIELD_LIMITS).title), 1)
                      ])
                    ]),
                    createVNode("div", { class: "space-y-2" }, [
                      createVNode(unref(_sfc_main$3), {
                        for: "description",
                        class: "text-[13px] font-medium text-black"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Description "),
                          createVNode("span", { class: "font-normal text-black" }, "(optional)")
                        ]),
                        _: 1
                      }),
                      withDirectives(createVNode("textarea", {
                        id: "description",
                        "onUpdate:modelValue": ($event) => unref(form).description = $event,
                        name: "description",
                        rows: "3",
                        placeholder: "Brief summary of this reporting period...",
                        maxlength: unref(REPORT_YEAR_FIELD_LIMITS).description,
                        class: "report-textarea w-full resize-y transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
                      }, null, 8, ["onUpdate:modelValue", "maxlength"]), [
                        [vModelText, unref(form).description]
                      ]),
                      createVNode("div", { class: "flex justify-between gap-2" }, [
                        createVNode(_sfc_main$5, {
                          message: unref(form).errors.description
                        }, null, 8, ["message"]),
                        createVNode("span", { class: "ml-auto text-xs text-black tabular-nums" }, toDisplayString(unref(form).description?.length || 0) + " / " + toDisplayString(unref(REPORT_YEAR_FIELD_LIMITS).description), 1)
                      ])
                    ]),
                    createVNode("div", { class: "report-years-create-actions" }, [
                      withDirectives(createVNode("p", { class: "mr-auto text-sm font-medium text-emerald-700" }, " Saved successfully. ", 512), [
                        [vShow, unref(form).recentlySuccessful]
                      ]),
                      createVNode("button", {
                        type: "button",
                        class: "report-years-btn-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                        onClick: () => unref(form).reset()
                      }, " Reset ", 8, ["onClick"]),
                      createVNode("button", {
                        type: "submit",
                        class: "report-years-btn-primary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:opacity-50",
                        disabled: unref(form).processing
                      }, [
                        unref(form).processing ? (openBlock(), createBlock(unref(Loader2), {
                          key: 0,
                          class: "mr-2 size-4 animate-spin"
                        })) : createCommentVNode("", true),
                        createTextVNode(" Create year ")
                      ], 8, ["disabled"])
                    ])
                  ], 32)
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/reports/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-02827330"]]);
export {
  Create as default
};
