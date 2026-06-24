import { defineComponent, computed, ref, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, TransitionGroup, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderAttrs, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$6, a as _sfc_main$7, b as _sfc_main$8, c as _sfc_main$9, d as _sfc_main$a, e as _sfc_main$b } from "./DialogTrigger-BXuAjQE2.js";
import { _ as _sfc_main$2 } from "./Input-DgH3elPy.js";
import { _ as _sfc_main$1, a as _sfc_main$3, b as _sfc_main$4, c as _sfc_main$5 } from "./AppLayout-ZR8ZPUp4.js";
import { f as formatPublishedAt } from "./formatPublishedAt-CtyfcM-X.js";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { Plus, FileChartColumnIncreasing, Search, RefreshCw, Pencil, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "@lucide/vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "reka-ui";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@vueuse/core";
import "./AppFooter-ClQxMSzB.js";
const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    reportYears: {}
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const canCreate = computed(() => page.props.auth.user?.can?.createReportYears === true);
    const canDelete = computed(() => page.props.auth.user?.can?.deleteReportYears === true);
    const localReportYears = ref([...props.reportYears]);
    watch(() => props.reportYears, (newVal) => {
      localReportYears.value = [...newVal];
    }, { deep: true });
    const searchQuery = ref("");
    const statusTab = ref("all");
    const currentPage = ref(1);
    const counts = computed(() => ({
      all: localReportYears.value.length,
      published: localReportYears.value.filter((r) => r.status === "published").length,
      pending: localReportYears.value.filter((r) => r.status === "pending").length
    }));
    const filteredYears = computed(() => {
      let rows = [...localReportYears.value];
      if (statusTab.value !== "all") {
        rows = rows.filter((r) => r.status === statusTab.value);
      }
      const q = searchQuery.value.trim().toLowerCase();
      if (q) {
        rows = rows.filter(
          (r) => String(r.year).includes(q) || r.title !== null && r.title.toLowerCase().includes(q) || r.description !== null && r.description.toLowerCase().includes(q)
        );
      }
      rows.sort((a, b) => b.year - a.year);
      return rows;
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredYears.value.length / perPage)));
    watch([searchQuery, statusTab], () => {
      currentPage.value = 1;
    });
    watch(totalPages, (tp) => {
      if (currentPage.value > tp) {
        currentPage.value = tp;
      }
    });
    const paginatedYears = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filteredYears.value.slice(start, start + perPage);
    });
    const showingFrom = computed(() => filteredYears.value.length === 0 ? 0 : (currentPage.value - 1) * perPage + 1);
    const showingTo = computed(() => Math.min(currentPage.value * perPage, filteredYears.value.length));
    function resetFilters() {
      searchQuery.value = "";
      statusTab.value = "all";
      currentPage.value = 1;
    }
    function goPage(page2) {
      const p = Math.min(Math.max(1, page2), totalPages.value);
      currentPage.value = p;
    }
    const tabs = computed(() => [
      { id: "all", label: "All years", count: counts.value.all },
      { id: "published", label: "Published", count: counts.value.published },
      { id: "pending", label: "Pending", count: counts.value.pending }
    ]);
    const deleteTarget = ref(null);
    const deleteProcessing = ref(false);
    function openDeleteDialog(reportYear) {
      deleteTarget.value = reportYear;
    }
    function onDeleteDialogOpenChange(open) {
      if (!open && !deleteProcessing.value) {
        deleteTarget.value = null;
      }
    }
    function confirmDeleteReportYear() {
      const row = deleteTarget.value;
      if (!row) {
        return;
      }
      deleteProcessing.value = true;
      router.delete(route("report-years.destroy", row.id), {
        preserveScroll: true,
        onSuccess: () => {
          deleteTarget.value = null;
        },
        onFinish: () => {
          deleteProcessing.value = false;
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        "show-footer": false,
        "content-class": "report-years-page"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "GAD Database" }, null, _parent2, _scopeId));
            _push2(`<div class="report-years-inner" data-v-ba6eaa17${_scopeId}><header class="report-years-header" data-v-ba6eaa17${_scopeId}><div data-v-ba6eaa17${_scopeId}><p class="report-years-kicker" data-v-ba6eaa17${_scopeId}>GAD database</p><h1 class="report-years-title" data-v-ba6eaa17${_scopeId}>Sex Disaggregated Data Reports</h1><p class="report-years-lede" data-v-ba6eaa17${_scopeId}> Track, analyze, and manage region-wide gender-disaggregated datasets, human resource demographics, and institutional GAD program statistics. </p></div>`);
            if (canCreate.value) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("report-years.create"),
                class: "report-years-btn-primary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Plus), {
                      class: "size-4",
                      "stroke-width": 2.5,
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                    _push3(` Create new year `);
                  } else {
                    return [
                      createVNode(unref(Plus), {
                        class: "size-4",
                        "stroke-width": 2.5,
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" Create new year ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</header>`);
            if (__props.reportYears.length === 0) {
              _push2(`<div class="report-years-empty" data-v-ba6eaa17${_scopeId}>`);
              _push2(ssrRenderComponent(unref(FileChartColumnIncreasing), {
                class: "mb-4 size-10 text-slate-300",
                "stroke-width": 1.5,
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<h3 class="text-lg font-medium text-black" data-v-ba6eaa17${_scopeId}>No reports found</h3><p class="mt-2 max-w-sm text-sm text-black" data-v-ba6eaa17${_scopeId}>`);
              if (canCreate.value) {
                _push2(`<!--[--> Get started by creating a new year to track GAD metrics. <!--]-->`);
              } else {
                _push2(`<!--[--> No reports have been created yet. Please check back later or contact an administrator. <!--]-->`);
              }
              _push2(`</p>`);
              if (canCreate.value) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("report-years.create"),
                  class: "report-years-btn-primary mt-6 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(Plus), {
                        class: "size-4",
                        "stroke-width": 2,
                        "aria-hidden": "true"
                      }, null, _parent3, _scopeId2));
                      _push3(` Create report year `);
                    } else {
                      return [
                        createVNode(unref(Plus), {
                          class: "size-4",
                          "stroke-width": 2,
                          "aria-hidden": "true"
                        }),
                        createTextVNode(" Create report year ")
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<div class="report-years-shell" data-v-ba6eaa17${_scopeId}><div class="report-years-toolbar" data-v-ba6eaa17${_scopeId}><div class="report-years-filter-tabs" role="tablist" aria-label="Filter by status" data-v-ba6eaa17${_scopeId}><!--[-->`);
              ssrRenderList(tabs.value, (tab) => {
                _push2(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", statusTab.value === tab.id)} class="${ssrRenderClass([{ "is-active": statusTab.value === tab.id }, "report-years-filter-tab transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[0.98] active:scale-[0.95]"])}" data-v-ba6eaa17${_scopeId}>${ssrInterpolate(tab.label)} <span class="report-years-filter-count" data-v-ba6eaa17${_scopeId}>${ssrInterpolate(tab.count)}</span></button>`);
              });
              _push2(`<!--]--></div><div class="flex w-full items-center gap-3 sm:w-auto" data-v-ba6eaa17${_scopeId}><div class="report-years-search-wrap" data-v-ba6eaa17${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Search), {
                class: "report-years-search-icon",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$2), {
                modelValue: searchQuery.value,
                "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                type: "search",
                class: "report-years-search"
              }, null, _parent2, _scopeId));
              _push2(`</div><button type="button" class="report-years-btn-icon transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]" aria-label="Reset filters" data-v-ba6eaa17${_scopeId}>`);
              _push2(ssrRenderComponent(unref(RefreshCw), {
                class: "size-4",
                "stroke-width": 2
              }, null, _parent2, _scopeId));
              _push2(`</button></div></div><div class="report-years-table-wrap" data-v-ba6eaa17${_scopeId}><table class="report-years-table" data-v-ba6eaa17${_scopeId}><thead data-v-ba6eaa17${_scopeId}><tr data-v-ba6eaa17${_scopeId}><th scope="col" class="w-24" data-v-ba6eaa17${_scopeId}>Year</th><th scope="col" data-v-ba6eaa17${_scopeId}>Title</th><th scope="col" class="w-52" data-v-ba6eaa17${_scopeId}>Published</th><th scope="col" class="w-32" data-v-ba6eaa17${_scopeId}>Status</th><th scope="col" class="w-32" data-v-ba6eaa17${_scopeId}>Actions</th></tr></thead><tbody${ssrRenderAttrs({ name: "list" })} data-v-ba6eaa17>`);
              if (filteredYears.value.length === 0) {
                _push2(`<tr data-v-ba6eaa17${_scopeId}><td colspan="5" class="py-12 text-center text-sm text-slate-600" data-v-ba6eaa17${_scopeId}> No reports found matching your criteria. <button type="button" class="ml-1 font-medium text-blue-700 underline underline-offset-4 hover:text-blue-800 transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" data-v-ba6eaa17${_scopeId}> Clear filters </button></td></tr>`);
              }
              ssrRenderList(paginatedYears.value, (reportYear) => {
                _push2(`<tr class="${ssrRenderClass([{ "bg-blue-50/70 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]": reportYear._justUpdated }, "transition-colors duration-500"])}" data-v-ba6eaa17${_scopeId}><td data-v-ba6eaa17${_scopeId}><span class="report-years-table-year" data-v-ba6eaa17${_scopeId}>${ssrInterpolate(reportYear.year)}</span></td><td data-v-ba6eaa17${_scopeId}><span class="line-clamp-1" data-v-ba6eaa17${_scopeId}>${ssrInterpolate(reportYear.title ?? "—")}</span></td><td class="tabular-nums" data-v-ba6eaa17${_scopeId}>${ssrInterpolate(unref(formatPublishedAt)(reportYear.publishedAt) ?? "—")}</td><td data-v-ba6eaa17${_scopeId}><span class="report-years-status" data-v-ba6eaa17${_scopeId}><span class="${ssrRenderClass([
                  reportYear.status === "published" ? "report-years-status-dot--published" : "report-years-status-dot--pending",
                  "report-years-status-dot"
                ])}" aria-hidden="true" data-v-ba6eaa17${_scopeId}></span> ${ssrInterpolate(reportYear.status)}</span></td><td data-v-ba6eaa17${_scopeId}><div class="report-years-row-actions" data-v-ba6eaa17${_scopeId}>`);
                _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(_sfc_main$4), { "as-child": "" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(Link), {
                              href: _ctx.route("report-years.edit", reportYear.id),
                              prefetch: "",
                              class: "report-years-row-action inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                              "aria-label": `Edit report year ${reportYear.year}`
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(Pencil), {
                                    class: "size-4",
                                    "stroke-width": 2,
                                    "aria-hidden": "true"
                                  }, null, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(Pencil), {
                                      class: "size-4",
                                      "stroke-width": 2,
                                      "aria-hidden": "true"
                                    })
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(Link), {
                                href: _ctx.route("report-years.edit", reportYear.id),
                                prefetch: "",
                                class: "report-years-row-action inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                                "aria-label": `Edit report year ${reportYear.year}`
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Pencil), {
                                    class: "size-4",
                                    "stroke-width": 2,
                                    "aria-hidden": "true"
                                  })
                                ]),
                                _: 1
                              }, 8, ["href", "aria-label"])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(ssrRenderComponent(unref(_sfc_main$5), { side: "top" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`Edit`);
                          } else {
                            return [
                              createTextVNode("Edit")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(_sfc_main$4), { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(unref(Link), {
                              href: _ctx.route("report-years.edit", reportYear.id),
                              prefetch: "",
                              class: "report-years-row-action inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                              "aria-label": `Edit report year ${reportYear.year}`
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Pencil), {
                                  class: "size-4",
                                  "stroke-width": 2,
                                  "aria-hidden": "true"
                                })
                              ]),
                              _: 1
                            }, 8, ["href", "aria-label"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$5), { side: "top" }, {
                          default: withCtx(() => [
                            createTextVNode("Edit")
                          ]),
                          _: 1
                        })
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
                if (canDelete.value) {
                  _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(unref(_sfc_main$4), { "as-child": "" }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`<button type="button" class="report-years-row-action report-years-row-action--danger inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]"${ssrRenderAttr("aria-label", `Delete Report Year ${reportYear.year}`)} data-v-ba6eaa17${_scopeId3}>`);
                              _push4(ssrRenderComponent(unref(Trash2), {
                                class: "size-4",
                                "stroke-width": 2,
                                "aria-hidden": "true"
                              }, null, _parent4, _scopeId3));
                              _push4(`</button>`);
                            } else {
                              return [
                                createVNode("button", {
                                  type: "button",
                                  class: "report-years-row-action report-years-row-action--danger inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                                  "aria-label": `Delete Report Year ${reportYear.year}`,
                                  onClick: ($event) => openDeleteDialog(reportYear)
                                }, [
                                  createVNode(unref(Trash2), {
                                    class: "size-4",
                                    "stroke-width": 2,
                                    "aria-hidden": "true"
                                  })
                                ], 8, ["aria-label", "onClick"])
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                        _push3(ssrRenderComponent(unref(_sfc_main$5), { side: "top" }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`Delete`);
                            } else {
                              return [
                                createTextVNode("Delete")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode("button", {
                                type: "button",
                                class: "report-years-row-action report-years-row-action--danger inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                                "aria-label": `Delete Report Year ${reportYear.year}`,
                                onClick: ($event) => openDeleteDialog(reportYear)
                              }, [
                                createVNode(unref(Trash2), {
                                  class: "size-4",
                                  "stroke-width": 2,
                                  "aria-hidden": "true"
                                })
                              ], 8, ["aria-label", "onClick"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$5), { side: "top" }, {
                            default: withCtx(() => [
                              createTextVNode("Delete")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></td></tr>`);
              });
              _push2(`</tbody></table></div><footer class="report-years-footer" data-v-ba6eaa17${_scopeId}><p class="report-years-footer-meta" data-v-ba6eaa17${_scopeId}>`);
              if (filteredYears.value.length === 0) {
                _push2(`<!--[-->0 of 0<!--]-->`);
              } else {
                _push2(`<!--[-->Showing ${ssrInterpolate(showingFrom.value)}–${ssrInterpolate(showingTo.value)} of ${ssrInterpolate(filteredYears.value.length)}<!--]-->`);
              }
              _push2(`</p>`);
              if (filteredYears.value.length > 0) {
                _push2(`<div class="report-years-pagination" data-v-ba6eaa17${_scopeId}><button type="button" class="report-years-page-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]"${ssrIncludeBooleanAttr(currentPage.value <= 1) ? " disabled" : ""} aria-label="First page" data-v-ba6eaa17${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ChevronsLeft), {
                  class: "size-4",
                  "stroke-width": 2
                }, null, _parent2, _scopeId));
                _push2(`</button><button type="button" class="report-years-page-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]"${ssrIncludeBooleanAttr(currentPage.value <= 1) ? " disabled" : ""} aria-label="Previous page" data-v-ba6eaa17${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ChevronLeft), {
                  class: "size-4",
                  "stroke-width": 2
                }, null, _parent2, _scopeId));
                _push2(`</button><span class="report-years-page-indicator" data-v-ba6eaa17${_scopeId}>${ssrInterpolate(currentPage.value)}</span><button type="button" class="report-years-page-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]"${ssrIncludeBooleanAttr(currentPage.value >= totalPages.value) ? " disabled" : ""} aria-label="Next page" data-v-ba6eaa17${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ChevronRight), {
                  class: "size-4",
                  "stroke-width": 2
                }, null, _parent2, _scopeId));
                _push2(`</button><button type="button" class="report-years-page-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]"${ssrIncludeBooleanAttr(currentPage.value >= totalPages.value) ? " disabled" : ""} aria-label="Last page" data-v-ba6eaa17${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ChevronsRight), {
                  class: "size-4",
                  "stroke-width": 2
                }, null, _parent2, _scopeId));
                _push2(`</button></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</footer></div>`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$6), {
              open: deleteTarget.value !== null,
              "onUpdate:open": onDeleteDialogOpenChange
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$7), {
                    class: "border-slate-200 bg-white text-black sm:max-w-md",
                    onPointerDownOutside: (e) => deleteProcessing.value && e.preventDefault()
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$9), { class: "text-black" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Delete Report Year`);
                                  } else {
                                    return [
                                      createTextVNode("Delete Report Year")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              if (deleteTarget.value) {
                                _push5(ssrRenderComponent(unref(_sfc_main$a), { class: "text-black" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` This will permanently delete the report for <span class="font-medium text-black" data-v-ba6eaa17${_scopeId5}>${ssrInterpolate(deleteTarget.value.year)}</span>. All associated data will be removed. This action cannot be undone. `);
                                    } else {
                                      return [
                                        createTextVNode(" This will permanently delete the report for "),
                                        createVNode("span", { class: "font-medium text-black" }, toDisplayString(deleteTarget.value.year), 1),
                                        createTextVNode(". All associated data will be removed. This action cannot be undone. ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                _push5(`<!---->`);
                              }
                            } else {
                              return [
                                createVNode(unref(_sfc_main$9), { class: "text-black" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Delete Report Year")
                                  ]),
                                  _: 1
                                }),
                                deleteTarget.value ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                  key: 0,
                                  class: "text-black"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" This will permanently delete the report for "),
                                    createVNode("span", { class: "font-medium text-black" }, toDisplayString(deleteTarget.value.year), 1),
                                    createTextVNode(". All associated data will be removed. This action cannot be undone. ")
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$b), { class: "report-years-dialog-footer mt-6 gap-3" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<button type="button" class="report-years-btn-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"${ssrIncludeBooleanAttr(deleteProcessing.value) ? " disabled" : ""} data-v-ba6eaa17${_scopeId4}> Cancel </button><button type="button" class="report-years-btn-danger transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"${ssrIncludeBooleanAttr(deleteProcessing.value) ? " disabled" : ""} data-v-ba6eaa17${_scopeId4}>${ssrInterpolate(deleteProcessing.value ? "Deleting..." : "Delete Report")}</button>`);
                            } else {
                              return [
                                createVNode("button", {
                                  type: "button",
                                  class: "report-years-btn-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                                  disabled: deleteProcessing.value,
                                  onClick: ($event) => onDeleteDialogOpenChange(false)
                                }, " Cancel ", 8, ["disabled", "onClick"]),
                                createVNode("button", {
                                  type: "button",
                                  class: "report-years-btn-danger transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                                  disabled: deleteProcessing.value,
                                  onClick: confirmDeleteReportYear
                                }, toDisplayString(deleteProcessing.value ? "Deleting..." : "Delete Report"), 9, ["disabled"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$9), { class: "text-black" }, {
                                default: withCtx(() => [
                                  createTextVNode("Delete Report Year")
                                ]),
                                _: 1
                              }),
                              deleteTarget.value ? (openBlock(), createBlock(unref(_sfc_main$a), {
                                key: 0,
                                class: "text-black"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" This will permanently delete the report for "),
                                  createVNode("span", { class: "font-medium text-black" }, toDisplayString(deleteTarget.value.year), 1),
                                  createTextVNode(". All associated data will be removed. This action cannot be undone. ")
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$b), { class: "report-years-dialog-footer mt-6 gap-3" }, {
                            default: withCtx(() => [
                              createVNode("button", {
                                type: "button",
                                class: "report-years-btn-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                                disabled: deleteProcessing.value,
                                onClick: ($event) => onDeleteDialogOpenChange(false)
                              }, " Cancel ", 8, ["disabled", "onClick"]),
                              createVNode("button", {
                                type: "button",
                                class: "report-years-btn-danger transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                                disabled: deleteProcessing.value,
                                onClick: confirmDeleteReportYear
                              }, toDisplayString(deleteProcessing.value ? "Deleting..." : "Delete Report"), 9, ["disabled"])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$7), {
                      class: "border-slate-200 bg-white text-black sm:max-w-md",
                      onPointerDownOutside: (e) => deleteProcessing.value && e.preventDefault()
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$8), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$9), { class: "text-black" }, {
                              default: withCtx(() => [
                                createTextVNode("Delete Report Year")
                              ]),
                              _: 1
                            }),
                            deleteTarget.value ? (openBlock(), createBlock(unref(_sfc_main$a), {
                              key: 0,
                              class: "text-black"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" This will permanently delete the report for "),
                                createVNode("span", { class: "font-medium text-black" }, toDisplayString(deleteTarget.value.year), 1),
                                createTextVNode(". All associated data will be removed. This action cannot be undone. ")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$b), { class: "report-years-dialog-footer mt-6 gap-3" }, {
                          default: withCtx(() => [
                            createVNode("button", {
                              type: "button",
                              class: "report-years-btn-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                              disabled: deleteProcessing.value,
                              onClick: ($event) => onDeleteDialogOpenChange(false)
                            }, " Cancel ", 8, ["disabled", "onClick"]),
                            createVNode("button", {
                              type: "button",
                              class: "report-years-btn-danger transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                              disabled: deleteProcessing.value,
                              onClick: confirmDeleteReportYear
                            }, toDisplayString(deleteProcessing.value ? "Deleting..." : "Delete Report"), 9, ["disabled"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["onPointerDownOutside"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Head), { title: "GAD Database" }),
              createVNode("div", { class: "report-years-inner" }, [
                createVNode("header", { class: "report-years-header" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "report-years-kicker" }, "GAD database"),
                    createVNode("h1", { class: "report-years-title" }, "Sex Disaggregated Data Reports"),
                    createVNode("p", { class: "report-years-lede" }, " Track, analyze, and manage region-wide gender-disaggregated datasets, human resource demographics, and institutional GAD program statistics. ")
                  ]),
                  canCreate.value ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: _ctx.route("report-years.create"),
                    class: "report-years-btn-primary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Plus), {
                        class: "size-4",
                        "stroke-width": 2.5,
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" Create new year ")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
                ]),
                __props.reportYears.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "report-years-empty"
                }, [
                  createVNode(unref(FileChartColumnIncreasing), {
                    class: "mb-4 size-10 text-slate-300",
                    "stroke-width": 1.5,
                    "aria-hidden": "true"
                  }),
                  createVNode("h3", { class: "text-lg font-medium text-black" }, "No reports found"),
                  createVNode("p", { class: "mt-2 max-w-sm text-sm text-black" }, [
                    canCreate.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                      createTextVNode(" Get started by creating a new year to track GAD metrics. ")
                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                      createTextVNode(" No reports have been created yet. Please check back later or contact an administrator. ")
                    ], 64))
                  ]),
                  canCreate.value ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: _ctx.route("report-years.create"),
                    class: "report-years-btn-primary mt-6 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Plus), {
                        class: "size-4",
                        "stroke-width": 2,
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" Create report year ")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true)
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "report-years-shell"
                }, [
                  createVNode("div", { class: "report-years-toolbar" }, [
                    createVNode("div", {
                      class: "report-years-filter-tabs",
                      role: "tablist",
                      "aria-label": "Filter by status"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(tabs.value, (tab) => {
                        return openBlock(), createBlock("button", {
                          key: tab.id,
                          type: "button",
                          role: "tab",
                          "aria-selected": statusTab.value === tab.id,
                          class: ["report-years-filter-tab transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[0.98] active:scale-[0.95]", { "is-active": statusTab.value === tab.id }],
                          onClick: ($event) => statusTab.value = tab.id
                        }, [
                          createTextVNode(toDisplayString(tab.label) + " ", 1),
                          createVNode("span", { class: "report-years-filter-count" }, toDisplayString(tab.count), 1)
                        ], 10, ["aria-selected", "onClick"]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "flex w-full items-center gap-3 sm:w-auto" }, [
                      createVNode("div", { class: "report-years-search-wrap" }, [
                        createVNode(unref(Search), {
                          class: "report-years-search-icon",
                          "aria-hidden": "true"
                        }),
                        createVNode(unref(_sfc_main$2), {
                          modelValue: searchQuery.value,
                          "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                          type: "search",
                          class: "report-years-search"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      createVNode("button", {
                        type: "button",
                        class: "report-years-btn-icon transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                        "aria-label": "Reset filters",
                        onClick: resetFilters
                      }, [
                        createVNode(unref(RefreshCw), {
                          class: "size-4",
                          "stroke-width": 2
                        })
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "report-years-table-wrap" }, [
                    createVNode("table", { class: "report-years-table" }, [
                      createVNode("thead", null, [
                        createVNode("tr", null, [
                          createVNode("th", {
                            scope: "col",
                            class: "w-24"
                          }, "Year"),
                          createVNode("th", { scope: "col" }, "Title"),
                          createVNode("th", {
                            scope: "col",
                            class: "w-52"
                          }, "Published"),
                          createVNode("th", {
                            scope: "col",
                            class: "w-32"
                          }, "Status"),
                          createVNode("th", {
                            scope: "col",
                            class: "w-32"
                          }, "Actions")
                        ])
                      ]),
                      createVNode(TransitionGroup, {
                        name: "list",
                        tag: "tbody"
                      }, {
                        default: withCtx(() => [
                          filteredYears.value.length === 0 ? (openBlock(), createBlock("tr", { key: "empty" }, [
                            createVNode("td", {
                              colspan: "5",
                              class: "py-12 text-center text-sm text-slate-600"
                            }, [
                              createTextVNode(" No reports found matching your criteria. "),
                              createVNode("button", {
                                type: "button",
                                class: "ml-1 font-medium text-blue-700 underline underline-offset-4 hover:text-blue-800 transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                                onClick: resetFilters
                              }, " Clear filters ")
                            ])
                          ])) : createCommentVNode("", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(paginatedYears.value, (reportYear) => {
                            return openBlock(), createBlock("tr", {
                              key: reportYear.id,
                              class: ["transition-colors duration-500", { "bg-blue-50/70 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]": reportYear._justUpdated }]
                            }, [
                              createVNode("td", null, [
                                createVNode("span", { class: "report-years-table-year" }, toDisplayString(reportYear.year), 1)
                              ]),
                              createVNode("td", null, [
                                createVNode("span", { class: "line-clamp-1" }, toDisplayString(reportYear.title ?? "—"), 1)
                              ]),
                              createVNode("td", { class: "tabular-nums" }, toDisplayString(unref(formatPublishedAt)(reportYear.publishedAt) ?? "—"), 1),
                              createVNode("td", null, [
                                createVNode("span", { class: "report-years-status" }, [
                                  createVNode("span", {
                                    class: [
                                      "report-years-status-dot",
                                      reportYear.status === "published" ? "report-years-status-dot--published" : "report-years-status-dot--pending"
                                    ],
                                    "aria-hidden": "true"
                                  }, null, 2),
                                  createTextVNode(" " + toDisplayString(reportYear.status), 1)
                                ])
                              ]),
                              createVNode("td", null, [
                                createVNode("div", { class: "report-years-row-actions" }, [
                                  createVNode(unref(_sfc_main$3), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$4), { "as-child": "" }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Link), {
                                            href: _ctx.route("report-years.edit", reportYear.id),
                                            prefetch: "",
                                            class: "report-years-row-action inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                                            "aria-label": `Edit report year ${reportYear.year}`
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(Pencil), {
                                                class: "size-4",
                                                "stroke-width": 2,
                                                "aria-hidden": "true"
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["href", "aria-label"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(unref(_sfc_main$5), { side: "top" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Edit")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 2
                                  }, 1024),
                                  canDelete.value ? (openBlock(), createBlock(unref(_sfc_main$3), { key: 0 }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$4), { "as-child": "" }, {
                                        default: withCtx(() => [
                                          createVNode("button", {
                                            type: "button",
                                            class: "report-years-row-action report-years-row-action--danger inline-flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                                            "aria-label": `Delete Report Year ${reportYear.year}`,
                                            onClick: ($event) => openDeleteDialog(reportYear)
                                          }, [
                                            createVNode(unref(Trash2), {
                                              class: "size-4",
                                              "stroke-width": 2,
                                              "aria-hidden": "true"
                                            })
                                          ], 8, ["aria-label", "onClick"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(unref(_sfc_main$5), { side: "top" }, {
                                        default: withCtx(() => [
                                          createTextVNode("Delete")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true)
                                ])
                              ])
                            ], 2);
                          }), 128))
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  createVNode("footer", { class: "report-years-footer" }, [
                    createVNode("p", { class: "report-years-footer-meta" }, [
                      filteredYears.value.length === 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        createTextVNode("0 of 0")
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createTextVNode("Showing " + toDisplayString(showingFrom.value) + "–" + toDisplayString(showingTo.value) + " of " + toDisplayString(filteredYears.value.length), 1)
                      ], 64))
                    ]),
                    filteredYears.value.length > 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "report-years-pagination"
                    }, [
                      createVNode("button", {
                        type: "button",
                        class: "report-years-page-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                        disabled: currentPage.value <= 1,
                        "aria-label": "First page",
                        onClick: ($event) => goPage(1)
                      }, [
                        createVNode(unref(ChevronsLeft), {
                          class: "size-4",
                          "stroke-width": 2
                        })
                      ], 8, ["disabled", "onClick"]),
                      createVNode("button", {
                        type: "button",
                        class: "report-years-page-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                        disabled: currentPage.value <= 1,
                        "aria-label": "Previous page",
                        onClick: ($event) => goPage(currentPage.value - 1)
                      }, [
                        createVNode(unref(ChevronLeft), {
                          class: "size-4",
                          "stroke-width": 2
                        })
                      ], 8, ["disabled", "onClick"]),
                      createVNode("span", { class: "report-years-page-indicator" }, toDisplayString(currentPage.value), 1),
                      createVNode("button", {
                        type: "button",
                        class: "report-years-page-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                        disabled: currentPage.value >= totalPages.value,
                        "aria-label": "Next page",
                        onClick: ($event) => goPage(currentPage.value + 1)
                      }, [
                        createVNode(unref(ChevronRight), {
                          class: "size-4",
                          "stroke-width": 2
                        })
                      ], 8, ["disabled", "onClick"]),
                      createVNode("button", {
                        type: "button",
                        class: "report-years-page-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                        disabled: currentPage.value >= totalPages.value,
                        "aria-label": "Last page",
                        onClick: ($event) => goPage(totalPages.value)
                      }, [
                        createVNode(unref(ChevronsRight), {
                          class: "size-4",
                          "stroke-width": 2
                        })
                      ], 8, ["disabled", "onClick"])
                    ])) : createCommentVNode("", true)
                  ])
                ]))
              ]),
              createVNode(unref(_sfc_main$6), {
                open: deleteTarget.value !== null,
                "onUpdate:open": onDeleteDialogOpenChange
              }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$7), {
                    class: "border-slate-200 bg-white text-black sm:max-w-md",
                    onPointerDownOutside: (e) => deleteProcessing.value && e.preventDefault()
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$8), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$9), { class: "text-black" }, {
                            default: withCtx(() => [
                              createTextVNode("Delete Report Year")
                            ]),
                            _: 1
                          }),
                          deleteTarget.value ? (openBlock(), createBlock(unref(_sfc_main$a), {
                            key: 0,
                            class: "text-black"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" This will permanently delete the report for "),
                              createVNode("span", { class: "font-medium text-black" }, toDisplayString(deleteTarget.value.year), 1),
                              createTextVNode(". All associated data will be removed. This action cannot be undone. ")
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$b), { class: "report-years-dialog-footer mt-6 gap-3" }, {
                        default: withCtx(() => [
                          createVNode("button", {
                            type: "button",
                            class: "report-years-btn-secondary transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                            disabled: deleteProcessing.value,
                            onClick: ($event) => onDeleteDialogOpenChange(false)
                          }, " Cancel ", 8, ["disabled", "onClick"]),
                          createVNode("button", {
                            type: "button",
                            class: "report-years-btn-danger transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                            disabled: deleteProcessing.value,
                            onClick: confirmDeleteReportYear
                          }, toDisplayString(deleteProcessing.value ? "Deleting..." : "Delete Report"), 9, ["disabled"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["onPointerDownOutside"])
                ]),
                _: 1
              }, 8, ["open"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/reports/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ba6eaa17"]]);
export {
  Index as default
};
