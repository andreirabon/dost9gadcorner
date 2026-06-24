import { defineComponent, defineAsyncComponent, computed, ref, watch, onMounted, mergeProps, unref, withCtx, createVNode, useSSRContext, provide, inject } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderComponent, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./IndexSectionDecor-B6eML_EX.js";
import { _ as _sfc_main$4 } from "./AppFooter-ClQxMSzB.js";
import { _ as _sfc_main$2 } from "./ReportBackArrowIcon-DMMIaSWx.js";
import { Link, Head } from "@inertiajs/vue3";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const tabStorageKey = "year-report-last-tab";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "YearReportContent",
  __ssrInlineRender: true,
  props: {
    year: {}
  },
  setup(__props) {
    const AssemblyStackedBarChart = defineAsyncComponent(() => import("./AssemblyStackedBarChart-djYTcUKN.js"));
    const CestFundingChart = defineAsyncComponent(() => import("./CestFundingChart-CSUzloih.js"));
    const EmployeesGroupedBarChart = defineAsyncComponent(() => import("./EmployeesGroupedBarChart-BZ1QiKCN.js"));
    const GenderPieChart = defineAsyncComponent(() => import("./GenderPieChart-bV3og0NA.js"));
    const RstlWarmBodiesStackedChart = defineAsyncComponent(() => import("./RstlWarmBodiesStackedChart-DRyEea7D.js"));
    const ScholarsPieChart = defineAsyncComponent(() => import("./ScholarsPieChart-FrsOyBT-.js"));
    const SetupFundingChart = defineAsyncComponent(() => import("./SetupFundingChart-BjK8Vjir.js"));
    const props = __props;
    const emptyFundingData = {
      maleProjects: 0,
      maleAmount: 0,
      femaleProjects: 0,
      femaleAmount: 0
    };
    const reportData = computed(() => props.year.reportData ?? null);
    const assemblyData = computed(() => reportData.value?.gfpsAssemblies ?? []);
    const employeesData = computed(() => reportData.value?.employeeStatuses ?? []);
    const rstlWarmBodiesData = computed(() => reportData.value?.rstlMonthly ?? []);
    const setupFundingData = computed(() => reportData.value?.setupFunding ?? emptyFundingData);
    const cestFundingData = computed(() => reportData.value?.cestFunding ?? emptyFundingData);
    const setupFundingBreakdown = computed(() => reportData.value?.setupFundingBreakdown ?? []);
    const cestFundingBreakdown = computed(() => reportData.value?.cestFundingBreakdown ?? []);
    const sumFundingRows = (rows) => rows.reduce(
      (carry, row) => ({
        maleProjects: carry.maleProjects + row.maleProjects,
        maleAmount: carry.maleAmount + row.maleAmount,
        femaleProjects: carry.femaleProjects + row.femaleProjects,
        femaleAmount: carry.femaleAmount + row.femaleAmount
      }),
      { ...emptyFundingData }
    );
    const setupFundingRows = computed(() => {
      let rows = setupFundingBreakdown.value;
      if (rows.length === 0 && (setupFundingData.value.maleProjects > 0 || setupFundingData.value.femaleProjects > 0)) {
        rows = [
          {
            label: "SETUP",
            slug: "setup",
            ...setupFundingData.value
          }
        ];
      }
      return rows;
    });
    const cestFundingRows = computed(() => {
      let rows = cestFundingBreakdown.value;
      if (rows.length === 0 && (cestFundingData.value.maleProjects > 0 || cestFundingData.value.femaleProjects > 0)) {
        rows = [
          {
            label: "CEST",
            slug: "cest",
            ...cestFundingData.value
          }
        ];
      }
      return rows;
    });
    const selectedSetupCategorySlug = ref(null);
    const selectedCestCategorySlug = ref(null);
    const syncSelectedFundingCategory = (rows, selectedSlug) => {
      if (rows.length === 0) {
        selectedSlug.value = null;
        return;
      }
      if (selectedSlug.value === null || !rows.some((row) => row.slug === selectedSlug.value)) {
        selectedSlug.value = rows[0].slug;
      }
    };
    watch(
      setupFundingRows,
      (rows) => {
        syncSelectedFundingCategory(rows, selectedSetupCategorySlug);
      },
      { immediate: true }
    );
    watch(
      cestFundingRows,
      (rows) => {
        syncSelectedFundingCategory(rows, selectedCestCategorySlug);
      },
      { immediate: true }
    );
    const selectedSetupCategory = computed(
      () => setupFundingRows.value.find((row) => row.slug === selectedSetupCategorySlug.value) ?? null
    );
    const selectedCestCategory = computed(
      () => cestFundingRows.value.find((row) => row.slug === selectedCestCategorySlug.value) ?? null
    );
    const fundingCategoryButtonClass = (isActive) => [
      "inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-semibold tracking-wide transition-[transform,background-color,border-color,color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40 active:scale-[0.97]",
      isActive ? "border-purple-500 bg-purple-600 text-white shadow-sm" : "border-purple-400/35 bg-purple-900/55 text-purple-100 hover:border-purple-400/55 hover:bg-purple-900/75 report-light:border-slate-300 report-light:bg-slate-50 report-light:text-slate-700 report-light:hover:border-slate-400 report-light:hover:bg-slate-100"
    ];
    const percentage = (value, total) => {
      if (total === 0) {
        return 0;
      }
      return Number((value / total * 100).toFixed(1));
    };
    const isYearDataPending = computed(() => props.year.status !== "published" || reportData.value === null);
    const gfpsStats = computed(() => {
      const femaleCount = reportData.value?.gfpsMembership.femaleCount ?? 0;
      const maleCount = reportData.value?.gfpsMembership.maleCount ?? 0;
      const totalMembers = femaleCount + maleCount;
      return {
        totalMembers,
        femaleCount,
        maleCount,
        femalePercentage: percentage(femaleCount, totalMembers),
        malePercentage: percentage(maleCount, totalMembers)
      };
    });
    const employeesStats = computed(() => {
      const femaleCount = employeesData.value.reduce((sum, row) => sum + row.female, 0);
      const maleCount = employeesData.value.reduce((sum, row) => sum + row.male, 0);
      const totalEmployees = femaleCount + maleCount;
      return {
        totalEmployees,
        femaleCount,
        maleCount,
        femalePercentage: percentage(femaleCount, totalEmployees),
        malePercentage: percentage(maleCount, totalEmployees)
      };
    });
    const scholarsStats = computed(() => {
      const femaleCount = reportData.value?.scholarship.femaleCount ?? 0;
      const maleCount = reportData.value?.scholarship.maleCount ?? 0;
      const totalScholars = femaleCount + maleCount;
      return {
        totalScholars,
        femaleCount,
        maleCount,
        femalePercentage: percentage(femaleCount, totalScholars),
        malePercentage: percentage(maleCount, totalScholars),
        schoolYearLabel: reportData.value?.scholarship.schoolYearLabel ?? "",
        asOfDate: reportData.value?.scholarship.asOfDate ?? null
      };
    });
    const scholarshipHistory = computed(() => reportData.value?.scholarshipHistory ?? []);
    const expandedHistoryIndices = ref({ 0: true });
    const isHistoryExpanded = (idx) => {
      return !!expandedHistoryIndices.value[idx];
    };
    const rstlStats = computed(() => {
      const totalFemale = rstlWarmBodiesData.value.reduce((sum, row) => sum + row.female + row.femaleLed, 0);
      const totalMale = rstlWarmBodiesData.value.reduce((sum, row) => sum + row.male + row.maleLed, 0);
      const totalCustomers = totalFemale + totalMale;
      return {
        totalCustomers,
        femaleCount: totalFemale,
        maleCount: totalMale,
        femalePercentage: percentage(totalFemale, totalCustomers),
        malePercentage: percentage(totalMale, totalCustomers)
      };
    });
    const setupStats = computed(() => {
      const totals = sumFundingRows(setupFundingRows.value);
      return {
        totalProjects: totals.maleProjects + totals.femaleProjects,
        totalAmount: totals.maleAmount + totals.femaleAmount,
        maleProjects: totals.maleProjects,
        femaleProjects: totals.femaleProjects
      };
    });
    const cestStats = computed(() => {
      const totals = sumFundingRows(cestFundingRows.value);
      return {
        totalProjects: totals.maleProjects + totals.femaleProjects,
        totalAmount: totals.maleAmount + totals.femaleAmount,
        maleProjects: totals.maleProjects,
        femaleProjects: totals.femaleProjects
      };
    });
    const totalFemaleAcrossPrograms = computed(
      () => gfpsStats.value.femaleCount + employeesStats.value.femaleCount + scholarsStats.value.femaleCount + rstlStats.value.femaleCount
    );
    const totalMaleAcrossPrograms = computed(
      () => gfpsStats.value.maleCount + employeesStats.value.maleCount + scholarsStats.value.maleCount + rstlStats.value.maleCount
    );
    const combinedFundingAmount = computed(() => setupStats.value.totalAmount + cestStats.value.totalAmount);
    const combinedProjectsCount = computed(() => setupStats.value.totalProjects + cestStats.value.totalProjects);
    const tabs = ["Overview", "GFPS", "DOST IX Employees", "Scholarship", "RSTL", "Program Funding", "SETUP", "CEST"];
    const activeTab = ref("Overview");
    const isValidTab = (value) => tabs.includes(value);
    const formatCompactNumber = (value) => {
      return new Intl.NumberFormat("en-PH", {
        notation: "compact",
        maximumFractionDigits: 1
      }).format(value);
    };
    const overviewPrograms = computed(() => [
      {
        tab: "GFPS",
        title: "GFPS",
        metrics: [
          { label: "Total Members", value: gfpsStats.value.totalMembers },
          { label: "GFPS Assemblies", value: assemblyData.value.length, meta: "Quarterly" },
          { label: "Female Members", value: gfpsStats.value.femaleCount, meta: `${gfpsStats.value.femalePercentage}%` },
          { label: "Male Members", value: gfpsStats.value.maleCount, meta: `${gfpsStats.value.malePercentage}%` }
        ]
      },
      {
        tab: "DOST IX Employees",
        title: "DOST IX Employees",
        metrics: [
          { label: "Employment Types", value: employeesData.value.length, meta: "Categories" },
          { label: "Total Employees", value: employeesStats.value.totalEmployees },
          { label: "Female Employees", value: employeesStats.value.femaleCount, meta: `${employeesStats.value.femalePercentage}%` },
          { label: "Male Employees", value: employeesStats.value.maleCount, meta: `${employeesStats.value.malePercentage}%` }
        ]
      },
      {
        tab: "Scholarship",
        title: "Scholarship",
        metrics: [
          { label: "Total Scholars", value: scholarsStats.value.totalScholars },
          {
            label: "School Year",
            value: scholarsStats.value.schoolYearLabel || "Not set",
            meta: scholarsStats.value.asOfDate ?? "No date set"
          },
          { label: "Female Scholars", value: scholarsStats.value.femaleCount, meta: `${scholarsStats.value.femalePercentage}%` },
          { label: "Male Scholars", value: scholarsStats.value.maleCount, meta: `${scholarsStats.value.malePercentage}%` }
        ]
      },
      {
        tab: "RSTL",
        title: "RSTL",
        metrics: [
          { label: "Total Customers", value: rstlStats.value.totalCustomers },
          { label: "Period", value: props.year.year, meta: "Full Year" },
          { label: "Female", value: rstlStats.value.femaleCount, meta: `${rstlStats.value.femalePercentage}%` },
          { label: "Male", value: rstlStats.value.maleCount, meta: `${rstlStats.value.malePercentage}%` }
        ]
      },
      {
        tab: "Program Funding",
        title: "Program Funding",
        metrics: [
          { label: "Combined Projects", value: combinedProjectsCount.value },
          { label: "Combined Funding", value: formatCurrency(combinedFundingAmount.value) },
          {
            label: "SETUP Funding",
            value: formatCurrency(setupStats.value.totalAmount),
            meta: `${setupFundingRows.value.length} Categories`
          },
          {
            label: "CEST Funding",
            value: formatCurrency(cestStats.value.totalAmount),
            meta: `${cestFundingRows.value.length} Categories`
          }
        ]
      },
      {
        tab: "SETUP",
        title: "SETUP",
        metrics: [
          { label: "Categories", value: setupFundingRows.value.length },
          { label: "Total Projects", value: setupStats.value.totalProjects },
          { label: "Total Funding", value: formatCurrency(setupStats.value.totalAmount) },
          { label: "Male-led Projects", value: setupStats.value.maleProjects },
          { label: "Female-led Projects", value: setupStats.value.femaleProjects }
        ]
      },
      {
        tab: "CEST",
        title: "CEST",
        metrics: [
          { label: "Categories", value: cestFundingRows.value.length },
          { label: "Total Projects", value: cestStats.value.totalProjects },
          { label: "Total Funding", value: formatCurrency(cestStats.value.totalAmount) },
          { label: "Male-led Projects", value: cestStats.value.maleProjects },
          { label: "Female-led Projects", value: cestStats.value.femaleProjects }
        ]
      }
    ]);
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    };
    onMounted(() => {
      if (typeof window !== "undefined") {
        const storedTab = localStorage.getItem(tabStorageKey);
        if (storedTab !== null && isValidTab(storedTab)) {
          activeTab.value = storedTab;
        } else {
          activeTab.value = "Overview";
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: "report-view-shell",
        "aria-labelledby": `report-title-${__props.year.id}`
      }, _attrs))} data-v-0a8f2583><header class="animate-fade-in-up" data-v-0a8f2583><div class="report-view-hero-accent" data-v-0a8f2583></div><div class="report-view-hero px-page-gutter" data-v-0a8f2583><div class="report-view-hero-top" data-v-0a8f2583><div class="report-view-heading" data-v-0a8f2583><div class="report-view-kicker-row" data-v-0a8f2583><span class="report-view-year-badge" data-v-0a8f2583>${ssrInterpolate(__props.year.year)}</span><p class="report-view-kicker" data-v-0a8f2583>Annual report</p></div><div class="space-y-2" data-v-0a8f2583><h1${ssrRenderAttr("id", `report-title-${__props.year.id}`)} data-focus-anchor="true" tabindex="-1" class="report-view-title" data-v-0a8f2583> Sex Disaggregated Data </h1><p class="report-view-subtitle" data-v-0a8f2583> Department of Science and Technology Regional Office IX validated figures across GFPS, employment, scholarship, RSTL, SETUP, and CEST programs. </p></div></div><div class="report-view-actions" data-v-0a8f2583>`);
      _push(ssrRenderComponent(unref(Link), {
        href: `${_ctx.route("index")}#yearly`,
        class: "report-view-back-link",
        prefetch: ""
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, null, null, _parent2, _scopeId));
            _push2(`<span class="hidden sm:inline" data-v-0a8f2583${_scopeId}>Select Another Year</span><span class="sm:hidden" data-v-0a8f2583${_scopeId}>Back</span>`);
          } else {
            return [
              createVNode(_sfc_main$2),
              createVNode("span", { class: "hidden sm:inline" }, "Select Another Year"),
              createVNode("span", { class: "sm:hidden" }, "Back")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="report-view-hero-divider" aria-hidden="true" data-v-0a8f2583></div>`);
      if (!isYearDataPending.value) {
        _push(`<div class="report-view-tabs-container" data-v-0a8f2583><div class="report-view-tabs" role="tablist" aria-label="Report sections" data-v-0a8f2583><!--[-->`);
        ssrRenderList(tabs, (tab) => {
          _push(`<button class="${ssrRenderClass(["report-view-tab", { "is-active": activeTab.value === tab }])}" role="tab"${ssrRenderAttr("aria-selected", activeTab.value === tab)} type="button" data-v-0a8f2583>${ssrInterpolate(tab)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header><div class="report-view-body px-page-gutter animate-fade-in-up delay-1" data-v-0a8f2583>`);
      if (isYearDataPending.value) {
        _push(`<div class="report-view-empty" data-v-0a8f2583><div class="report-view-empty-icon" aria-hidden="true" data-v-0a8f2583><svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" data-v-0a8f2583><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" data-v-0a8f2583></path></svg></div><div class="max-w-md space-y-4" data-v-0a8f2583><p class="report-view-empty-title" data-v-0a8f2583>Data not yet available</p><p class="report-view-empty-desc" data-v-0a8f2583>${ssrInterpolate(__props.year.year)} figures are not available yet. This page will be updated as soon as validated annual data is ready. </p></div></div>`);
      } else {
        _push(`<div data-v-0a8f2583><div class="w-full" data-v-0a8f2583>`);
        if (activeTab.value === "Overview") {
          _push(`<div class="space-y-4 md:space-y-6" data-v-0a8f2583><div class="report-view-metrics" data-v-0a8f2583><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Female (all sections)</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(formatCompactNumber(totalFemaleAcrossPrograms.value))}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Male (all sections)</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(formatCompactNumber(totalMaleAcrossPrograms.value))}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Combined Projects</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(combinedProjectsCount.value)}</p><p class="report-view-metric-meta" data-v-0a8f2583>SETUP + CEST</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Combined Funding</p><p class="report-view-metric-value text-sm md:text-base" data-v-0a8f2583>${ssrInterpolate(formatCurrency(combinedFundingAmount.value))}</p><p class="report-view-metric-meta" data-v-0a8f2583>SETUP + CEST</p></div></div><div class="report-view-metric" data-v-0a8f2583><div class="report-view-block-header" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>Quick Access</h3></div><div class="report-view-quick-grid" data-v-0a8f2583><!--[-->`);
          ssrRenderList(overviewPrograms.value, (program) => {
            _push(`<button type="button" class="report-view-quick-item" data-v-0a8f2583><p class="report-view-quick-title" data-v-0a8f2583>${ssrInterpolate(program.title)}</p><!--[-->`);
            ssrRenderList(program.metrics, (metric, metricIndex) => {
              _push(`<div class="${ssrRenderClass(metricIndex > 0 ? "mt-2 border-t border-purple-500/10 pt-2 report-light:border-slate-200/80" : "")}" data-v-0a8f2583><p class="report-view-quick-label" data-v-0a8f2583>${ssrInterpolate(metric.label)}</p><p class="report-view-quick-value-sm" data-v-0a8f2583>${ssrInterpolate(metric.value)}</p>`);
              if (metric.meta) {
                _push(`<p class="text-[10px] text-purple-300/60 report-light:text-slate-500" data-v-0a8f2583>${ssrInterpolate(metric.meta)}</p>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></button>`);
          });
          _push(`<!--]--></div></div></div>`);
        } else if (activeTab.value === "GFPS") {
          _push(`<div class="space-y-4 md:space-y-6" data-v-0a8f2583><div class="report-view-metrics" data-v-0a8f2583><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Members</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(gfpsStats.value.totalMembers)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>GFPS Assemblies</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(assemblyData.value.length)}</p><p class="report-view-metric-meta" data-v-0a8f2583>Quarterly</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Female Members</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(gfpsStats.value.femaleCount)}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(gfpsStats.value.femalePercentage)}%</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Male Members</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(gfpsStats.value.maleCount)}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(gfpsStats.value.malePercentage)}%</p></div></div><div class="report-view-charts" data-v-0a8f2583><div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>GFPS Membership by Sex</h3><p class="report-view-block-desc" data-v-0a8f2583>Distribution of GFPS members</p></div><div class="report-chart-panel" data-v-0a8f2583>`);
          _push(ssrRenderComponent(unref(GenderPieChart), {
            "female-count": gfpsStats.value.femaleCount,
            "male-count": gfpsStats.value.maleCount
          }, null, _parent));
          _push(`</div></div><div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>GFPS Assembly Participation</h3><p class="report-view-block-desc" data-v-0a8f2583>Quarterly assembly attendance by sex</p></div><div class="report-chart-panel" data-v-0a8f2583>`);
          _push(ssrRenderComponent(unref(AssemblyStackedBarChart), { data: assemblyData.value }, null, _parent));
          _push(`</div></div></div></div>`);
        } else if (activeTab.value === "DOST IX Employees") {
          _push(`<div class="space-y-4 md:space-y-6" data-v-0a8f2583><div class="report-view-metrics" data-v-0a8f2583><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Employment Types</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(employeesData.value.length)}</p><p class="report-view-metric-meta" data-v-0a8f2583>Categories</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Employees</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(employeesStats.value.totalEmployees)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Female Employees</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(employeesStats.value.femaleCount)}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(employeesStats.value.femalePercentage)}%</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Male Employees</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(employeesStats.value.maleCount)}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(employeesStats.value.malePercentage)}%</p></div></div><div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>Employees by Employment Status</h3><p class="report-view-block-desc" data-v-0a8f2583>Sex-disaggregated data as of December 31, ${ssrInterpolate(__props.year.year)}</p></div><div class="report-chart-panel" data-v-0a8f2583>`);
          _push(ssrRenderComponent(unref(EmployeesGroupedBarChart), { data: employeesData.value }, null, _parent));
          _push(`</div></div></div>`);
        } else if (activeTab.value === "Scholarship") {
          _push(`<div class="space-y-4 md:space-y-6" data-v-0a8f2583><div class="report-view-metrics" data-v-0a8f2583><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Scholars</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(scholarsStats.value.totalScholars)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>School Year</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(scholarsStats.value.schoolYearLabel || "Not set")}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(scholarsStats.value.asOfDate ?? "No date set")}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Female Scholars</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(scholarsStats.value.femaleCount)}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(scholarsStats.value.femalePercentage)}%</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Male Scholars</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(scholarsStats.value.maleCount)}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(scholarsStats.value.malePercentage)}%</p></div></div><div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>Distribution of On-Going Scholars by Sex</h3><p class="report-view-block-desc" data-v-0a8f2583>${ssrInterpolate(scholarsStats.value.schoolYearLabel || `School Year ${__props.year.year}`)} `);
          if (scholarsStats.value.asOfDate) {
            _push(`<span data-v-0a8f2583> • Data as of ${ssrInterpolate(scholarsStats.value.asOfDate)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div><div class="report-chart-panel" data-v-0a8f2583>`);
          _push(ssrRenderComponent(unref(ScholarsPieChart), {
            "female-count": scholarsStats.value.femaleCount,
            "male-count": scholarsStats.value.maleCount
          }, null, _parent));
          _push(`</div></div>`);
          if (scholarshipHistory.value.length > 1) {
            _push(`<div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>Scholar Count History</h3><p class="report-view-block-desc" data-v-0a8f2583>Data progression across reporting periods</p></div><div class="space-y-2" data-v-0a8f2583><!--[-->`);
            ssrRenderList(scholarshipHistory.value, (entry, idx) => {
              _push(`<button type="button" class="${ssrRenderClass([isHistoryExpanded(idx) ? "border-purple-400/50 bg-purple-900/30 text-purple-100 report-light:border-purple-200 report-light:bg-purple-50/70 report-light:text-purple-950" : "border-transparent bg-purple-900/10 hover:bg-purple-900/20 text-purple-200/80 hover:text-purple-50 report-light:bg-slate-50 report-light:hover:bg-slate-100/80 report-light:border-slate-200/60 report-light:text-slate-700 report-light:hover:text-slate-900", "w-full rounded-xl border px-4 py-3.5 text-left transition-[transform,background-color,border-color,color] duration-200 ease-out active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40"])}" data-v-0a8f2583><div class="flex items-center justify-between" data-v-0a8f2583><div class="flex items-center gap-2.5" data-v-0a8f2583><svg class="${ssrRenderClass([{ "rotate-90": isHistoryExpanded(idx) }, "size-4 shrink-0 transition-transform duration-200 text-purple-400/70 report-light:text-purple-700/60"])}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true" data-v-0a8f2583><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" data-v-0a8f2583></path></svg><span class="${ssrRenderClass([isHistoryExpanded(idx) ? "font-semibold" : "font-medium", "text-sm tracking-tight"])}" data-v-0a8f2583>${ssrInterpolate(entry.asOfDate ?? "No date")}</span>`);
              if (idx === 0) {
                _push(`<span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase report-light:bg-emerald-100/80 report-light:text-emerald-800" data-v-0a8f2583> Latest </span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><span class="${ssrRenderClass([isHistoryExpanded(idx) ? "text-purple-200 report-light:text-purple-900/90" : "text-purple-300/60 report-light:text-slate-500", "text-sm font-medium tabular-nums"])}" data-v-0a8f2583><span class="font-mono" data-v-0a8f2583>${ssrInterpolate(entry.femaleCount + entry.maleCount)}</span> scholars </span></div>`);
              if (isHistoryExpanded(idx)) {
                _push(`<div class="mt-3.5 border-t border-purple-500/10 pt-3 text-xs report-light:border-purple-900/5" data-v-0a8f2583><div class="grid grid-cols-2 gap-4" data-v-0a8f2583><div data-v-0a8f2583><p class="text-[10px] font-semibold tracking-wider text-purple-300/50 uppercase report-light:text-slate-400" data-v-0a8f2583> School Year </p><p class="mt-1.5 text-sm font-bold text-purple-100 report-light:text-slate-800" data-v-0a8f2583>${ssrInterpolate(entry.schoolYearLabel || "No school year")}</p></div><div data-v-0a8f2583><p class="text-[10px] font-semibold tracking-wider text-purple-300/50 uppercase report-light:text-slate-400" data-v-0a8f2583> Gender Breakdown </p><div class="mt-1 flex items-baseline gap-3" data-v-0a8f2583><span class="text-xs text-purple-300/70 report-light:text-slate-500" data-v-0a8f2583> Female: <span class="text-base font-bold text-purple-100 report-light:text-slate-900 font-mono ml-0.5" data-v-0a8f2583>${ssrInterpolate(entry.femaleCount)}</span></span><span class="text-purple-500/20 report-light:text-slate-200" data-v-0a8f2583>|</span><span class="text-xs text-purple-300/70 report-light:text-slate-500" data-v-0a8f2583> Male: <span class="text-base font-bold text-purple-100 report-light:text-slate-900 font-mono ml-0.5" data-v-0a8f2583>${ssrInterpolate(entry.maleCount)}</span></span></div></div></div></div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</button>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (activeTab.value === "RSTL") {
          _push(`<div class="space-y-4 md:space-y-6" data-v-0a8f2583><div class="report-view-metrics" data-v-0a8f2583><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Customers</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(rstlStats.value.totalCustomers)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Period</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(__props.year.year)}</p><p class="report-view-metric-meta" data-v-0a8f2583>Full Year</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Female</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(rstlStats.value.femaleCount)}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(rstlStats.value.femalePercentage)}%</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Male</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(rstlStats.value.maleCount)}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(rstlStats.value.malePercentage)}%</p></div></div><div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>Testing and Calibration Services</h3><p class="report-view-block-desc" data-v-0a8f2583>Customers by sex (warm bodies) - Monthly breakdown for ${ssrInterpolate(__props.year.year)}</p></div><div class="report-chart-panel" data-v-0a8f2583>`);
          _push(ssrRenderComponent(unref(RstlWarmBodiesStackedChart), { data: rstlWarmBodiesData.value }, null, _parent));
          _push(`</div></div></div>`);
        } else if (activeTab.value === "Program Funding") {
          _push(`<div class="space-y-4 md:space-y-6" data-v-0a8f2583><div class="report-view-metrics" data-v-0a8f2583><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Combined Projects</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(combinedProjectsCount.value)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Combined Funding</p><p class="report-view-metric-value text-sm md:text-base" data-v-0a8f2583>${ssrInterpolate(formatCurrency(combinedFundingAmount.value))}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>SETUP Funding</p><p class="report-view-metric-value text-sm md:text-base" data-v-0a8f2583>${ssrInterpolate(formatCurrency(setupStats.value.totalAmount))}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(setupFundingRows.value.length)} Categories</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>CEST Funding</p><p class="report-view-metric-value text-sm md:text-base" data-v-0a8f2583>${ssrInterpolate(formatCurrency(cestStats.value.totalAmount))}</p><p class="report-view-metric-meta" data-v-0a8f2583>${ssrInterpolate(cestFundingRows.value.length)} Categories</p></div></div><div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>SETUP Categories</h3><p class="report-view-block-desc" data-v-0a8f2583>Funding split by category • ${ssrInterpolate(__props.year.year)}</p></div>`);
          if (setupFundingRows.value.length === 0) {
            _push(`<div class="report-view-block-desc" data-v-0a8f2583>No SETUP category data yet.</div>`);
          } else {
            _push(`<div class="report-view-category-grid" data-v-0a8f2583><!--[-->`);
            ssrRenderList(setupFundingRows.value, (category) => {
              _push(`<div class="report-view-quick-item" data-v-0a8f2583><p class="report-view-quick-title" data-v-0a8f2583>${ssrInterpolate(category.label)}</p><p class="report-view-quick-label" data-v-0a8f2583>Projects</p><p class="report-view-quick-value" data-v-0a8f2583>${ssrInterpolate(category.maleProjects + category.femaleProjects)}</p><p class="report-view-quick-label" data-v-0a8f2583>Funding</p><p class="report-view-quick-value-sm" data-v-0a8f2583>${ssrInterpolate(formatCurrency(category.maleAmount + category.femaleAmount))}</p></div>`);
            });
            _push(`<!--]--></div>`);
          }
          _push(`</div><div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>CEST Categories</h3><p class="report-view-block-desc" data-v-0a8f2583>Funding split by category • ${ssrInterpolate(__props.year.year)}</p></div>`);
          if (cestFundingRows.value.length === 0) {
            _push(`<div class="report-view-block-desc" data-v-0a8f2583>No CEST category data yet.</div>`);
          } else {
            _push(`<div class="report-view-category-grid" data-v-0a8f2583><!--[-->`);
            ssrRenderList(cestFundingRows.value, (category) => {
              _push(`<div class="report-view-quick-item" data-v-0a8f2583><p class="report-view-quick-title" data-v-0a8f2583>${ssrInterpolate(category.label)}</p><p class="report-view-quick-label" data-v-0a8f2583>Projects</p><p class="report-view-quick-value" data-v-0a8f2583>${ssrInterpolate(category.maleProjects + category.femaleProjects)}</p><p class="report-view-quick-label" data-v-0a8f2583>Funding</p><p class="report-view-quick-value-sm" data-v-0a8f2583>${ssrInterpolate(formatCurrency(category.maleAmount + category.femaleAmount))}</p></div>`);
            });
            _push(`<!--]--></div>`);
          }
          _push(`</div></div>`);
        } else if (activeTab.value === "SETUP") {
          _push(`<div class="space-y-4 md:space-y-6" data-v-0a8f2583><div class="report-view-metrics report-view-metrics--five-up" data-v-0a8f2583><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Categories</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(setupFundingRows.value.length)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Projects</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(setupStats.value.totalProjects)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Funding</p><p class="report-view-metric-value text-sm md:text-base" data-v-0a8f2583>${ssrInterpolate(formatCurrency(setupStats.value.totalAmount))}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Male-led Projects</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(setupStats.value.maleProjects)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Female-led Projects</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(setupStats.value.femaleProjects)}</p></div></div>`);
          if (setupFundingRows.value.length === 0) {
            _push(`<div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>Small Enterprise Technology Upgrading Program (SETUP)</h3><p class="report-view-block-desc" data-v-0a8f2583>No category data yet for ${ssrInterpolate(__props.year.year)}</p></div></div>`);
          } else {
            _push(`<div class="report-view-block space-y-4" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>Small Enterprise Technology Upgrading Program (SETUP)</h3><p class="report-view-block-desc" data-v-0a8f2583>Select category to preview chart • ${ssrInterpolate(__props.year.year)}</p></div><div class="flex flex-wrap gap-2" data-v-0a8f2583><!--[-->`);
            ssrRenderList(setupFundingRows.value, (category) => {
              _push(`<button type="button" class="${ssrRenderClass(fundingCategoryButtonClass(selectedSetupCategorySlug.value === category.slug))}"${ssrRenderAttr("aria-pressed", selectedSetupCategorySlug.value === category.slug)} data-v-0a8f2583>${ssrInterpolate(category.label)}</button>`);
            });
            _push(`<!--]--></div>`);
            if (selectedSetupCategory.value) {
              _push(`<div class="report-chart-panel" data-v-0a8f2583>`);
              _push(ssrRenderComponent(unref(SetupFundingChart), {
                data: selectedSetupCategory.value,
                title: selectedSetupCategory.value.label
              }, null, _parent));
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          }
          _push(`</div>`);
        } else if (activeTab.value === "CEST") {
          _push(`<div class="space-y-4 md:space-y-6" data-v-0a8f2583><div class="report-view-metrics report-view-metrics--five-up" data-v-0a8f2583><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Categories</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(cestFundingRows.value.length)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Projects</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(cestStats.value.totalProjects)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Total Funding</p><p class="report-view-metric-value text-sm md:text-base" data-v-0a8f2583>${ssrInterpolate(formatCurrency(cestStats.value.totalAmount))}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Male-led Projects</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(cestStats.value.maleProjects)}</p></div><div class="report-view-metric" data-v-0a8f2583><p class="report-view-metric-label" data-v-0a8f2583>Female-led Projects</p><p class="report-view-metric-value" data-v-0a8f2583>${ssrInterpolate(cestStats.value.femaleProjects)}</p></div></div>`);
          if (cestFundingRows.value.length === 0) {
            _push(`<div class="report-view-block" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>Community Empowerment thru Science and Technology (CEST)</h3><p class="report-view-block-desc" data-v-0a8f2583>No category data yet for ${ssrInterpolate(__props.year.year)}</p></div></div>`);
          } else {
            _push(`<div class="report-view-block space-y-4" data-v-0a8f2583><div class="report-view-chart-head" data-v-0a8f2583><h3 class="report-view-block-title" data-v-0a8f2583>Community Empowerment thru Science and Technology (CEST)</h3><p class="report-view-block-desc" data-v-0a8f2583>Select category to preview chart • ${ssrInterpolate(__props.year.year)}</p></div><div class="flex flex-wrap gap-2" data-v-0a8f2583><!--[-->`);
            ssrRenderList(cestFundingRows.value, (category) => {
              _push(`<button type="button" class="${ssrRenderClass(fundingCategoryButtonClass(selectedCestCategorySlug.value === category.slug))}"${ssrRenderAttr("aria-pressed", selectedCestCategorySlug.value === category.slug)} data-v-0a8f2583>${ssrInterpolate(category.label)}</button>`);
            });
            _push(`<!--]--></div>`);
            if (selectedCestCategory.value) {
              _push(`<div class="report-chart-panel" data-v-0a8f2583>`);
              _push(ssrRenderComponent(unref(CestFundingChart), {
                data: selectedCestCategory.value,
                title: selectedCestCategory.value.label
              }, null, _parent));
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div></article>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/reports/YearReportContent.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const YearReportContent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0a8f2583"]]);
const REPORT_PAGE_THEME_KEY = /* @__PURE__ */ Symbol("reportPageTheme");
function provideReportPageTheme() {
  const mode = ref("light");
  provide(REPORT_PAGE_THEME_KEY, mode);
  return { mode };
}
function useReportChartAppearance() {
  const injected = inject(REPORT_PAGE_THEME_KEY, void 0);
  return computed(() => injected?.value ?? "light");
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "ReportYearShowPage"
  },
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    year: {}
  },
  setup(__props) {
    provideReportPageTheme();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `${__props.year.year} Sex Disaggregated Data Report`
      }, null, _parent));
      _push(`<div class="report-view-page report-theme-light flex flex-col [color-scheme:light]"><section class="report-view-section"${ssrRenderAttr("aria-label", `${__props.year.year} annual report`)}>`);
      _push(ssrRenderComponent(_sfc_main$3, { variant: "yearly" }, null, _parent));
      _push(`<div class="report-view-main">`);
      _push(ssrRenderComponent(YearReportContent, { year: __props.year }, null, _parent));
      _push(`</div></section>`);
      _push(ssrRenderComponent(_sfc_main$4, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/reports/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Show = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
export {
  Show as S,
  useReportChartAppearance as u
};
