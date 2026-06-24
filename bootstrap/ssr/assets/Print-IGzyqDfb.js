import { defineComponent, ref, mergeProps, withCtx, unref, createTextVNode, openBlock, createBlock, createVNode, withModifiers, withDirectives, Fragment, renderList, toDisplayString, vModelSelect, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { a as _sfc_main$3 } from "./Input-DgH3elPy.js";
import { _ as _sfc_main$2 } from "./Label-BPBW_hyv.js";
import { _ as _sfc_main$1 } from "./AppLayout-ZR8ZPUp4.js";
import { usePage, useForm, Head } from "@inertiajs/vue3";
import { Printer, FileText } from "@lucide/vue";
import "class-variance-authority";
import "reka-ui";
import "clsx";
import "tailwind-merge";
import "@vueuse/core";
import "./AppFooter-ClQxMSzB.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Print",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const form = useForm({
      report_year_id: ""
    });
    const isGenerating = ref(false);
    const submit = () => {
      isGenerating.value = true;
      setTimeout(() => {
        const url = route("print-report.generate", {
          report_year_id: form.report_year_id
        });
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => {
          isGenerating.value = false;
        }, 1e3);
      }, 150);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        "show-footer": false,
        "content-class": "flex flex-1 items-center justify-center"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Print Report" }, null, _parent2, _scopeId));
            _push2(`<div class="flex w-full flex-col items-center justify-center p-4 sm:p-6"${_scopeId}><div class="w-full max-w-md rounded-2xl bg-white p-8 sm:p-10 shadow-lg border border-slate-200"${_scopeId}><div class="mb-8 flex flex-col items-center text-center"${_scopeId}><div class="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Printer), {
              class: ["h-7 w-7 transition-transform duration-500 ease-out", { "scale-110": isGenerating.value }]
            }, null, _parent2, _scopeId));
            _push2(`</div><h2 class="text-2xl font-semibold tracking-tight text-slate-900"${_scopeId}>Generate Report</h2><p class="mt-2 text-sm leading-relaxed text-slate-500"${_scopeId}>Download a clean, table-only PDF of the sex-disaggregated data report for the selected year.</p></div><form class="space-y-7"${_scopeId}><div class="space-y-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), {
              for: "report_year_id",
              class: "text-xs font-medium uppercase tracking-wider text-slate-500"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Target Year`);
                } else {
                  return [
                    createTextVNode("Target Year")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="relative group"${_scopeId}><select id="report_year_id" class="flex h-12 w-full appearance-none items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50" required${_scopeId}><option value="" disabled class="text-slate-500"${ssrIncludeBooleanAttr(Array.isArray(unref(form).report_year_id) ? ssrLooseContain(unref(form).report_year_id, "") : ssrLooseEqual(unref(form).report_year_id, "")) ? " selected" : ""}${_scopeId}>Select a reporting year</option><!--[-->`);
            ssrRenderList(unref(page).props.years, (year) => {
              _push2(`<option${ssrRenderAttr("value", year.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).report_year_id) ? ssrLooseContain(unref(form).report_year_id, year.id) : ssrLooseEqual(unref(form).report_year_id, year.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(year.year)} — ${ssrInterpolate(year.title)}</option>`);
            });
            _push2(`<!--]--></select><div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 transition-transform group-hover:translate-y-[1px]"${_scopeId}><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"${_scopeId}></path></svg></div></div></div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$3), {
              type: "submit",
              class: "w-full h-12 rounded-xl font-medium transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.98] active:duration-150",
              disabled: !unref(form).report_year_id || isGenerating.value
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!isGenerating.value) {
                    _push3(`<span class="flex items-center justify-center gap-2"${_scopeId2}>`);
                    _push3(ssrRenderComponent(unref(FileText), { class: "h-4 w-4 transition-transform duration-300 group-hover:-translate-y-[1px] group-active:translate-y-[1px]" }, null, _parent3, _scopeId2));
                    _push3(` Download PDF </span>`);
                  } else {
                    _push3(`<span class="flex items-center justify-center gap-2"${_scopeId2}><svg class="h-5 w-5 animate-spin text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId2}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId2}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId2}></path></svg> Compiling... </span>`);
                  }
                } else {
                  return [
                    !isGenerating.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "flex items-center justify-center gap-2"
                    }, [
                      createVNode(unref(FileText), { class: "h-4 w-4 transition-transform duration-300 group-hover:-translate-y-[1px] group-active:translate-y-[1px]" }),
                      createTextVNode(" Download PDF ")
                    ])) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: "flex items-center justify-center gap-2"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "h-5 w-5 animate-spin text-white/70",
                        xmlns: "http://www.w3.org/2000/svg",
                        fill: "none",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("circle", {
                          class: "opacity-25",
                          cx: "12",
                          cy: "12",
                          r: "10",
                          stroke: "currentColor",
                          "stroke-width": "4"
                        }),
                        createVNode("path", {
                          class: "opacity-75",
                          fill: "currentColor",
                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        })
                      ])),
                      createTextVNode(" Compiling... ")
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</form></div></div>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Print Report" }),
              createVNode("div", { class: "flex w-full flex-col items-center justify-center p-4 sm:p-6" }, [
                createVNode("div", { class: "w-full max-w-md rounded-2xl bg-white p-8 sm:p-10 shadow-lg border border-slate-200" }, [
                  createVNode("div", { class: "mb-8 flex flex-col items-center text-center" }, [
                    createVNode("div", { class: "relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200" }, [
                      createVNode(unref(Printer), {
                        class: ["h-7 w-7 transition-transform duration-500 ease-out", { "scale-110": isGenerating.value }]
                      }, null, 8, ["class"])
                    ]),
                    createVNode("h2", { class: "text-2xl font-semibold tracking-tight text-slate-900" }, "Generate Report"),
                    createVNode("p", { class: "mt-2 text-sm leading-relaxed text-slate-500" }, "Download a clean, table-only PDF of the sex-disaggregated data report for the selected year.")
                  ]),
                  createVNode("form", {
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "space-y-7"
                  }, [
                    createVNode("div", { class: "space-y-3" }, [
                      createVNode(unref(_sfc_main$2), {
                        for: "report_year_id",
                        class: "text-xs font-medium uppercase tracking-wider text-slate-500"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Target Year")
                        ]),
                        _: 1
                      }),
                      createVNode("div", { class: "relative group" }, [
                        withDirectives(createVNode("select", {
                          id: "report_year_id",
                          "onUpdate:modelValue": ($event) => unref(form).report_year_id = $event,
                          class: "flex h-12 w-full appearance-none items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
                          required: ""
                        }, [
                          createVNode("option", {
                            value: "",
                            disabled: "",
                            class: "text-slate-500"
                          }, "Select a reporting year"),
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(page).props.years, (year) => {
                            return openBlock(), createBlock("option", {
                              key: year.id,
                              value: year.id
                            }, toDisplayString(year.year) + " — " + toDisplayString(year.title), 9, ["value"]);
                          }), 128))
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, unref(form).report_year_id]
                        ]),
                        createVNode("div", { class: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 transition-transform group-hover:translate-y-[1px]" }, [
                          (openBlock(), createBlock("svg", {
                            class: "h-4 w-4",
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
                      ])
                    ]),
                    createVNode(unref(_sfc_main$3), {
                      type: "submit",
                      class: "w-full h-12 rounded-xl font-medium transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.98] active:duration-150",
                      disabled: !unref(form).report_year_id || isGenerating.value
                    }, {
                      default: withCtx(() => [
                        !isGenerating.value ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "flex items-center justify-center gap-2"
                        }, [
                          createVNode(unref(FileText), { class: "h-4 w-4 transition-transform duration-300 group-hover:-translate-y-[1px] group-active:translate-y-[1px]" }),
                          createTextVNode(" Download PDF ")
                        ])) : (openBlock(), createBlock("span", {
                          key: 1,
                          class: "flex items-center justify-center gap-2"
                        }, [
                          (openBlock(), createBlock("svg", {
                            class: "h-5 w-5 animate-spin text-white/70",
                            xmlns: "http://www.w3.org/2000/svg",
                            fill: "none",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("circle", {
                              class: "opacity-25",
                              cx: "12",
                              cy: "12",
                              r: "10",
                              stroke: "currentColor",
                              "stroke-width": "4"
                            }),
                            createVNode("path", {
                              class: "opacity-75",
                              fill: "currentColor",
                              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            })
                          ])),
                          createTextVNode(" Compiling... ")
                        ]))
                      ]),
                      _: 1
                    }, 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/reports/Print.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
