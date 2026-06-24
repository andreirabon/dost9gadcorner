import { defineComponent, ref, watch, computed, onUnmounted, mergeProps, withCtx, unref, createTextVNode, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, withDirectives, withModifiers, vModelSelect, vModelText, vShow, Transition, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$2, R as REPORT_YEAR_FIELD_LIMITS } from "./reportYearFields-ClRreS0A.js";
import { _ as _sfc_main$3 } from "./HeadingSmall-BTYlDd0F.js";
import { _ as _sfc_main$6 } from "./InputError-CkRw5jBS.js";
import { _ as _sfc_main$5, a as _sfc_main$7 } from "./Input-DgH3elPy.js";
import { _ as _sfc_main$4 } from "./Label-BPBW_hyv.js";
import { _ as _sfc_main$1, u as useToast } from "./AppLayout-ZR8ZPUp4.js";
import { f as formatPublishedAt } from "./formatPublishedAt-CtyfcM-X.js";
import { usePage, useForm, Head, router } from "@inertiajs/vue3";
import { Calendar, Sparkles, Save, CheckCircle2, Plus, Pencil, Trash2, X } from "@lucide/vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./ReportBackArrowIcon-DMMIaSWx.js";
import "class-variance-authority";
import "reka-ui";
import "clsx";
import "tailwind-merge";
import "@vueuse/core";
import "./AppFooter-ClQxMSzB.js";
function normalizeNumeric(value) {
  if (value === "" || value === null || value === void 0) {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
function normalizeScalar(value) {
  if (value === null || value === void 0) {
    return "";
  }
  return String(value);
}
function diffRowPatches(originalRows, currentRows, keyField, valueFields, options = {}) {
  const decimalFields = new Set(options.decimalFields ?? []);
  const originalByKey = new Map(originalRows.map((row) => [row[keyField], row]));
  const patches = [];
  for (const current of currentRows) {
    const key = current[keyField];
    const original = originalByKey.get(key) ?? {};
    const patch = { [keyField]: key };
    let changed = false;
    for (const field of valueFields) {
      let originalValue;
      let currentValue;
      if (decimalFields.has(field)) {
        originalValue = normalizeNumeric(original[field]);
        currentValue = normalizeNumeric(current[field]);
      } else {
        originalValue = normalizeNumeric(original[field]);
        currentValue = normalizeNumeric(current[field]);
      }
      if (originalValue !== currentValue) {
        patch[field] = decimalFields.has(field) ? current[field] : currentValue;
        changed = true;
      }
    }
    if (changed) {
      patches.push(patch);
    }
  }
  return patches;
}
function diffObjectPatch(original, current, fields, options = {}) {
  const numericFields = new Set(options.numeric ?? []);
  const patch = {};
  let changed = false;
  for (const field of fields) {
    const originalValue = numericFields.has(field) ? normalizeNumeric(original[field]) : normalizeScalar(original[field]);
    const currentValue = numericFields.has(field) ? normalizeNumeric(current[field]) : normalizeScalar(current[field]);
    if (originalValue !== currentValue) {
      patch[field] = current[field];
      changed = true;
    }
  }
  return changed ? patch : null;
}
function hasPatch(payload) {
  if (payload == null) {
    return false;
  }
  if (Array.isArray(payload)) {
    return payload.length > 0;
  }
  if (typeof payload === "object") {
    return Object.keys(payload).length > 0;
  }
  return false;
}
function cloneSnapshot(value) {
  return JSON.parse(JSON.stringify(value));
}
const RECENT_UPDATE_TIMEOUT_MS = 2 * 60 * 1e3;
const inputClass = "report-field w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]";
const tableInputClass = "report-field report-years-data-input w-full transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    reportYear: {},
    schoolYears: {},
    abilities: {},
    sectionTimestamps: {}
  },
  setup(__props) {
    const props = __props;
    const { toast } = useToast();
    const sectionTs = ref({ ...props.sectionTimestamps });
    const STORAGE_KEY = `report-year-${props.reportYear.id}-section-timestamps`;
    const canUseBrowserStorage = typeof window !== "undefined" && typeof window.localStorage !== "undefined";
    function computeRecentlyUpdatedSections() {
      if (!canUseBrowserStorage) return /* @__PURE__ */ new Set();
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return /* @__PURE__ */ new Set();
      try {
        const storedTimestamps = JSON.parse(stored);
        const updated = /* @__PURE__ */ new Set();
        const mappings = [
          ["metadata", "metadata"],
          ["gfpsMembership", "gfps_membership"],
          ["gfpsAssemblies", "gfps_assemblies"],
          ["employeeStatuses", "employee_status"],
          ["scholarship", "scholarship"],
          ["rstlMonthly", "rstl_monthly"],
          ["programFunding", "program_funding"]
        ];
        for (const [tsKey, tabId] of mappings) {
          const storedVal = storedTimestamps[tsKey];
          const currentVal = props.sectionTimestamps[tsKey];
          if (storedVal !== currentVal) {
            updated.add(tabId);
          }
        }
        return updated;
      } catch {
        return /* @__PURE__ */ new Set();
      }
    }
    const recentlyUpdatedSections = ref(computeRecentlyUpdatedSections());
    const dismissRecentUpdate = (tabId) => {
      recentlyUpdatedSections.value.delete(tabId);
    };
    const hasRecentUpdate = (tabId) => recentlyUpdatedSections.value.has(tabId);
    watch(() => props.sectionTimestamps, (fresh) => {
      sectionTs.value = { ...fresh };
    });
    const handleConflictError = (errors) => {
      if (errors.conflict) {
        toast({
          title: "Save Conflict",
          description: errors.conflict,
          type: "error",
          duration: 0,
          action: {
            label: "Refresh",
            onClick: () => router.reload()
          }
        });
        return true;
      }
      return false;
    };
    const currentEditors = ref([]);
    const getAvatarColor = (username) => {
      const colors = [
        "bg-blue-100 text-blue-700",
        "bg-rose-100 text-rose-700",
        "bg-emerald-100 text-emerald-700",
        "bg-amber-100 text-amber-700",
        "bg-purple-100 text-purple-700",
        "bg-fuchsia-100 text-fuchsia-700",
        "bg-indigo-100 text-indigo-700",
        "bg-teal-100 text-teal-700",
        "bg-orange-100 text-orange-700",
        "bg-cyan-100 text-cyan-700"
      ];
      let hash = 0;
      for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };
    const page = usePage();
    computed(() => page.props.auth?.user?.id);
    onUnmounted(() => {
      if (!canUseBrowserStorage) {
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
    });
    if (canUseBrowserStorage) {
      const recentUpdateTimeoutId = setTimeout(() => {
        recentlyUpdatedSections.value.clear();
        localStorage.removeItem(STORAGE_KEY);
      }, RECENT_UPDATE_TIMEOUT_MS);
      onUnmounted(() => {
        clearTimeout(recentUpdateTimeoutId);
      });
    }
    const tabDefs = [
      { id: "metadata", name: "Metadata" },
      { id: "gfps_membership", name: "GFPS Membership" },
      { id: "scholarship", name: "Scholarship" },
      { id: "gfps_assemblies", name: "GFPS Assemblies" },
      { id: "employee_status", name: "Employee Status" },
      { id: "rstl_monthly", name: "RSTL by Month" },
      { id: "program_funding", name: "Program Funding" }
    ];
    function tabIsVisible(id) {
      const a = props.abilities;
      switch (id) {
        case "metadata":
          return a.updateMetadata || a.updateFullReport;
        case "gfps_membership":
          return a.updateGfpsMembership;
        case "scholarship":
          return a.updateScholarship;
        case "gfps_assemblies":
          return a.updateGfpsAssemblies;
        case "employee_status":
          return a.updateEmployeeStatuses;
        case "rstl_monthly":
          return a.updateRstlMonthly;
        case "program_funding":
          return a.updateProgramFunding;
        default:
          return false;
      }
    }
    const visibleTabs = computed(() => tabDefs.filter((t) => tabIsVisible(t.id)));
    const metadataForm = useForm({
      year: props.reportYear.year,
      title: props.reportYear.title ?? "",
      description: props.reportYear.description ?? "",
      status: props.reportYear.status
    });
    const gfpsMembershipForm = useForm({
      female_count: props.reportYear.gfpsMembership.femaleCount,
      male_count: props.reportYear.gfpsMembership.maleCount
    });
    const gfpsAssembliesForm = useForm({
      attendances: props.reportYear.gfpsAssemblies.map((row) => ({
        period_id: row.periodId,
        female_count: row.femaleCount,
        male_count: row.maleCount
      }))
    });
    const employeeStatusesForm = useForm({
      breakdowns: props.reportYear.employeeStatuses.map((row) => ({
        employment_status_id: row.employmentStatusId,
        female_count: row.femaleCount,
        male_count: row.maleCount
      }))
    });
    const latestSnapshot = computed(() => props.reportYear.scholarshipSnapshots[0] ?? null);
    const todayDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
    const newSnapshotForm = useForm({
      school_year_id: latestSnapshot.value?.schoolYearId ?? "",
      as_of_date: todayDate,
      female_count: 0,
      male_count: 0
    });
    const showAddForm = ref(false);
    const editingSnapshotId = ref(null);
    const editSnapshotForm = useForm({
      school_year_id: "",
      as_of_date: "",
      female_count: 0,
      male_count: 0
    });
    const startEditSnapshot = (snap) => {
      editingSnapshotId.value = snap.id;
      editSnapshotForm.school_year_id = snap.schoolYearId ?? "";
      editSnapshotForm.as_of_date = snap.asOfDate ?? "";
      editSnapshotForm.female_count = snap.femaleCount;
      editSnapshotForm.male_count = snap.maleCount;
    };
    const cancelEditSnapshot = () => {
      editingSnapshotId.value = null;
      editSnapshotForm.reset();
    };
    const rstlForm = useForm({
      breakdowns: props.reportYear.rstlMonthly.map((row) => ({
        report_month_id: row.reportMonthId,
        female_count: row.femaleCount,
        female_led_count: row.femaleLedCount,
        male_count: row.maleCount,
        male_led_count: row.maleLedCount
      }))
    });
    const fundingForm = useForm({
      summaries: props.reportYear.programFunding.map((row) => ({
        funding_program_id: row.fundingProgramId,
        female_projects: row.femaleProjects ?? 0,
        female_amount: row.femaleAmount ?? 0,
        male_projects: row.maleProjects ?? 0,
        male_amount: row.maleAmount ?? 0
      }))
    });
    const snapshotMetadataForm = () => cloneSnapshot({
      year: normalizeNumeric(metadataForm.year),
      title: metadataForm.title,
      description: metadataForm.description,
      status: metadataForm.status
    });
    const snapshotGfpsMembershipForm = () => cloneSnapshot({
      female_count: gfpsMembershipForm.female_count,
      male_count: gfpsMembershipForm.male_count
    });
    const originalMetadata = ref(snapshotMetadataForm());
    const originalGfpsMembership = ref(snapshotGfpsMembershipForm());
    const originalGfpsAssemblies = ref(cloneSnapshot(gfpsAssembliesForm.attendances));
    const originalEmployeeStatuses = ref(cloneSnapshot(employeeStatusesForm.breakdowns));
    const originalRstlBreakdowns = ref(cloneSnapshot(rstlForm.breakdowns));
    const originalFundingSummaries = ref(cloneSnapshot(fundingForm.summaries));
    const saveNotice = ref(null);
    const metadataSaving = ref(false);
    const showSaveNotice = (message) => {
      saveNotice.value = message;
      window.setTimeout(() => {
        if (saveNotice.value === message) {
          saveNotice.value = null;
        }
      }, 3e3);
    };
    const patchOptions = { preserveScroll: true };
    const updateMetadata = () => {
      const metadataFields = props.abilities.updateFullReport ? ["year", "title", "description", "status"] : ["year", "title", "description"];
      const patch = diffObjectPatch(originalMetadata.value, snapshotMetadataForm(), [...metadataFields], {
        numeric: ["year"]
      });
      if (!hasPatch(patch)) {
        showSaveNotice("No changes to save.");
        return;
      }
      const url = props.abilities.updateFullReport ? route("report-years.update", props.reportYear.id) : route("report-years.metadata.update", props.reportYear.id);
      metadataSaving.value = true;
      metadataForm.clearErrors();
      router.patch(url, { ...patch ?? {}, expected_updated_at: sectionTs.value.metadata }, {
        ...patchOptions,
        onSuccess: () => {
          originalMetadata.value = snapshotMetadataForm();
        },
        onError: (errors) => {
          if (handleConflictError(errors)) {
            metadataSaving.value = false;
            return;
          }
          metadataForm.setError(errors);
          const first = Object.values(errors)[0];
          const message = Array.isArray(first) ? first[0] : first;
          if (typeof message === "string" && message !== "") {
            showSaveNotice(message);
          }
        },
        onFinish: () => {
          metadataSaving.value = false;
        }
      });
    };
    const updateGfpsMembership = () => {
      const patch = diffObjectPatch(originalGfpsMembership.value, snapshotGfpsMembershipForm(), ["female_count", "male_count"], {
        numeric: ["female_count", "male_count"]
      });
      if (!hasPatch(patch)) {
        showSaveNotice("No changes to save.");
        return;
      }
      gfpsMembershipForm.transform(() => ({ ...patch, expected_updated_at: sectionTs.value.gfpsMembership })).patch(route("report-years.gfps-membership.update", props.reportYear.id), {
        ...patchOptions,
        onSuccess: () => {
          originalGfpsMembership.value = snapshotGfpsMembershipForm();
        },
        onError: (errors) => {
          handleConflictError(errors);
        }
      });
    };
    const updateGfpsAssemblies = () => {
      const attendances = diffRowPatches(
        originalGfpsAssemblies.value,
        gfpsAssembliesForm.attendances,
        "period_id",
        ["female_count", "male_count"]
      );
      if (!hasPatch(attendances)) {
        showSaveNotice("No changes to save.");
        return;
      }
      gfpsAssembliesForm.transform(() => ({ attendances, expected_updated_at: sectionTs.value.gfpsAssemblies })).patch(route("report-years.gfps-assemblies.update", props.reportYear.id), {
        ...patchOptions,
        onSuccess: () => {
          originalGfpsAssemblies.value = cloneSnapshot(gfpsAssembliesForm.attendances);
        },
        onError: (errors) => {
          handleConflictError(errors);
        }
      });
    };
    const updateEmployeeStatuses = () => {
      const breakdowns = diffRowPatches(
        originalEmployeeStatuses.value,
        employeeStatusesForm.breakdowns,
        "employment_status_id",
        ["female_count", "male_count"]
      );
      if (!hasPatch(breakdowns)) {
        showSaveNotice("No changes to save.");
        return;
      }
      employeeStatusesForm.transform(() => ({ breakdowns, expected_updated_at: sectionTs.value.employeeStatuses })).patch(route("report-years.employee-statuses.update", props.reportYear.id), {
        ...patchOptions,
        onSuccess: () => {
          originalEmployeeStatuses.value = cloneSnapshot(employeeStatusesForm.breakdowns);
        },
        onError: (errors) => {
          handleConflictError(errors);
        }
      });
    };
    const storeScholarshipSnapshot = () => {
      newSnapshotForm.post(route("report-years.scholarship.store", props.reportYear.id), {
        ...patchOptions,
        onSuccess: () => {
          newSnapshotForm.reset("female_count", "male_count");
          newSnapshotForm.as_of_date = todayDate;
          showAddForm.value = false;
        },
        onError: (errors) => {
          handleConflictError(errors);
        }
      });
    };
    const saveEditSnapshot = (snapshotId) => {
      const snap = props.reportYear.scholarshipSnapshots.find((s) => s.id === snapshotId);
      if (!snap) return;
      editSnapshotForm.transform((data) => ({ ...data, expected_updated_at: snap.updatedAt })).patch(route("report-years.scholarship.update", [props.reportYear.id, snapshotId]), {
        ...patchOptions,
        onSuccess: () => {
          editingSnapshotId.value = null;
        },
        onError: (errors) => {
          handleConflictError(errors);
        }
      });
    };
    const deleteScholarshipSnapshot = (snapshotId) => {
      if (!confirm("Permanently delete this snapshot? This cannot be undone.")) return;
      router.delete(route("report-years.scholarship.destroy", [props.reportYear.id, snapshotId]), {
        ...patchOptions
      });
    };
    const updateRstlMonthly = () => {
      const breakdowns = diffRowPatches(
        originalRstlBreakdowns.value,
        rstlForm.breakdowns,
        "report_month_id",
        ["female_count", "female_led_count", "male_count", "male_led_count"]
      );
      if (!hasPatch(breakdowns)) {
        showSaveNotice("No changes to save.");
        return;
      }
      rstlForm.transform(() => ({ breakdowns, expected_updated_at: sectionTs.value.rstlMonthly })).patch(route("report-years.rstl-monthly.update", props.reportYear.id), {
        ...patchOptions,
        onSuccess: () => {
          originalRstlBreakdowns.value = cloneSnapshot(rstlForm.breakdowns);
        },
        onError: (errors) => {
          handleConflictError(errors);
        }
      });
    };
    const updateProgramFunding = () => {
      const summaries = diffRowPatches(
        originalFundingSummaries.value,
        fundingForm.summaries,
        "funding_program_id",
        ["female_projects", "female_amount", "male_projects", "male_amount"],
        { decimalFields: ["female_amount", "male_amount"] }
      );
      if (!hasPatch(summaries)) {
        showSaveNotice("No changes to save.");
        return;
      }
      fundingForm.transform(() => ({ summaries, expected_updated_at: sectionTs.value.programFunding })).patch(route("report-years.program-funding.update", props.reportYear.id), {
        ...patchOptions,
        onSuccess: () => {
          originalFundingSummaries.value = cloneSnapshot(fundingForm.summaries);
        },
        onError: (errors) => {
          handleConflictError(errors);
        }
      });
    };
    const isSetupFundingSlug = (slug) => slug === "setup" || slug.startsWith("setup-");
    const isCestFundingSlug = (slug) => slug === "cest" || slug.startsWith("cest-");
    const fundingRows = computed(
      () => fundingForm.summaries.map((row, index) => ({
        row,
        label: props.reportYear.programFunding[index]?.label ?? `Program ${index + 1}`,
        slug: props.reportYear.programFunding[index]?.slug ?? ""
      }))
    );
    const setupFundingRows = computed(() => {
      const username = page.props.auth.user?.username?.toLowerCase();
      return fundingRows.value.filter((item) => {
        if (!isSetupFundingSlug(item.slug)) {
          return false;
        }
        if (username === "toszcic" && item.slug !== "setup-zc-ic") return false;
        if (username === "toszsp" && item.slug !== "setup-zsp") return false;
        if (username === "toszds" && item.slug !== "setup-zds") return false;
        if (username === "toszdn" && item.slug !== "setup-zdn") return false;
        return true;
      });
    });
    const cestFundingRows = computed(() => {
      const username = page.props.auth.user?.username?.toLowerCase();
      return fundingRows.value.filter((item) => {
        if (!isCestFundingSlug(item.slug)) {
          return false;
        }
        if (username === "toszcic" && item.slug !== "cest-zc-ic") return false;
        if (username === "toszsp" && item.slug !== "cest-zsp") return false;
        if (username === "toszds" && item.slug !== "cest-zds") return false;
        if (username === "toszdn" && item.slug !== "cest-zdn") return false;
        return true;
      });
    });
    const isPublished = computed(() => props.reportYear.status === "published");
    const publishedAtLabel = computed(() => formatPublishedAt(props.reportYear.publishedAt));
    const descriptionLength = computed(() => String(metadataForm.description ?? "").length);
    const metadataPatchError = computed(() => {
      const errors = metadataForm.errors;
      return errors.patch;
    });
    const displayReportTitle = computed(() => {
      const t = String(metadataForm.title ?? "").trim();
      if (t) {
        return t;
      }
      const fromServer = props.reportYear.title?.trim();
      if (fromServer) {
        return fromServer;
      }
      return `${props.reportYear.year} report`;
    });
    const toNum = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };
    const gfpsMembershipTotal = computed(
      () => toNum(gfpsMembershipForm.female_count) + toNum(gfpsMembershipForm.male_count)
    );
    const newSnapshotTotal = computed(
      () => toNum(newSnapshotForm.female_count) + toNum(newSnapshotForm.male_count)
    );
    const editSnapshotTotal = computed(
      () => toNum(editSnapshotForm.female_count) + toNum(editSnapshotForm.male_count)
    );
    const activeTab = ref("metadata");
    watch(
      visibleTabs,
      (vis) => {
        if (vis.length === 0) {
          return;
        }
        if (!vis.some((t) => t.id === activeTab.value)) {
          activeTab.value = vis[0].id;
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        "show-footer": false,
        "content-class": "report-years-page"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), {
              title: `Manage ${__props.reportYear.year} report`
            }, null, _parent2, _scopeId));
            _push2(`<div class="report-years-inner report-years-inner--edit" data-v-12d91347${_scopeId}><header class="report-years-edit-header animate-fade-in-up" data-v-12d91347${_scopeId}><div class="report-years-edit-intro" data-v-12d91347${_scopeId}><div class="report-years-edit-hero" data-v-12d91347${_scopeId}><div class="report-years-edit-hero-top" data-v-12d91347${_scopeId}><div class="report-years-edit-hero-badges" data-v-12d91347${_scopeId}>`);
            if (currentEditors.value.length > 1) {
              _push2(`<div class="flex space-x-1.5 mr-2" data-v-12d91347${_scopeId}><!--[-->`);
              ssrRenderList(currentEditors.value, (editor) => {
                _push2(`<div class="${ssrRenderClass([getAvatarColor(editor.username ?? ""), "flex h-6 items-center justify-center rounded-full px-2.5 text-[10px] font-bold shadow-sm"])}"${ssrRenderAttr("title", editor.username ?? "Unknown User")} data-v-12d91347${_scopeId}>${ssrInterpolate(editor.username)}</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<span class="report-years-edit-meta-chip" data-v-12d91347${_scopeId}>Currently Editing</span>`);
            }
            _push2(`<span class="${ssrRenderClass([isPublished.value ? "report-years-status-badge--published" : "report-years-status-badge--pending", "report-years-status-badge"])}" data-v-12d91347${_scopeId}>`);
            if (isPublished.value) {
              _push2(ssrRenderComponent(unref(Calendar), {
                class: "size-3.5 shrink-0 text-emerald-700",
                "stroke-width": 2,
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="${ssrRenderClass([isPublished.value ? "report-years-status-badge-label--published" : "report-years-status-badge-label--pending", "report-years-status-badge-label"])}" data-v-12d91347${_scopeId}>${ssrInterpolate(isPublished.value ? "Published" : "Pending")}</span>`);
            if (isPublished.value && publishedAtLabel.value) {
              _push2(`<span class="report-years-status-badge-detail report-years-status-badge-detail--published" data-v-12d91347${_scopeId}>${ssrInterpolate(publishedAtLabel.value)}</span>`);
            } else if (isPublished.value) {
              _push2(`<span class="report-years-status-badge-detail report-years-status-badge-detail--published" data-v-12d91347${_scopeId}> Not set </span>`);
            } else {
              _push2(`<span class="report-years-status-badge-detail report-years-status-badge-detail--pending" data-v-12d91347${_scopeId}> Awaiting publication </span>`);
            }
            _push2(`</span></div>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              href: _ctx.route("report-years.index"),
              inline: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Select Another Year `);
                } else {
                  return [
                    createTextVNode(" Select Another Year ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><h1 class="report-years-edit-hero-title" data-v-12d91347${_scopeId}>${ssrInterpolate(displayReportTitle.value)}</h1><p class="report-years-lede text-xs" data-v-12d91347${_scopeId}> Sections may be updated in any order. Save each tab when you finish that section. Visible tabs follow your account access. </p></div><div class="report-years-tab-bar" data-v-12d91347${_scopeId}><nav class="report-years-tab-nav" aria-label="Report sections" role="tablist" data-v-12d91347${_scopeId}><!--[-->`);
            ssrRenderList(visibleTabs.value, (tab) => {
              _push2(`<button type="button" role="tab"${ssrRenderAttr("aria-selected", activeTab.value === tab.id)} class="${ssrRenderClass([{ "is-active": activeTab.value === tab.id, "has-recent-update": hasRecentUpdate(tab.id) }, "report-years-tab transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[0.98] active:scale-[0.95]"])}" data-v-12d91347${_scopeId}>`);
              if (hasRecentUpdate(tab.id)) {
                _push2(ssrRenderComponent(unref(Sparkles), {
                  class: "mr-1.5 size-3.5 text-amber-500",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(tab.name)} `);
              if (hasRecentUpdate(tab.id)) {
                _push2(`<span class="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800" data-v-12d91347${_scopeId}> Updated </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</button>`);
            });
            _push2(`<!--]--></nav></div></div>`);
            if (saveNotice.value) {
              _push2(`<p class="text-xs font-medium text-amber-800" role="status" aria-live="polite" data-v-12d91347${_scopeId}>${ssrInterpolate(saveNotice.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</header><div class="w-full animate-fade-in-up delay-1" data-v-12d91347${_scopeId}><section class="report-panel" role="tabpanel" style="${ssrRenderStyle(activeTab.value === "metadata" ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            if (hasRecentUpdate("metadata")) {
              _push2(`<div class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Sparkles), {
                class: "size-4 shrink-0 text-amber-500",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="flex-1" data-v-12d91347${_scopeId}>This section was recently updated by another user.</span><button type="button" class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]" data-v-12d91347${_scopeId}> Dismiss </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$3, {
              variant: "report",
              title: "Metadata",
              description: "Calendar year, publication status, and the title and description readers see for this report."
            }, null, _parent2, _scopeId));
            _push2(`<form class="report-form report-form--edit w-full" autocomplete="off" data-v-12d91347${_scopeId}><div class="grid gap-4 sm:grid-cols-[10rem_14rem]" data-v-12d91347${_scopeId}><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "year" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Year`);
                } else {
                  return [
                    createTextVNode("Year")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$5), {
              id: "year",
              modelValue: unref(metadataForm).year,
              "onUpdate:modelValue": ($event) => unref(metadataForm).year = $event,
              name: "year",
              type: "number",
              min: unref(REPORT_YEAR_FIELD_LIMITS).yearMin,
              max: unref(REPORT_YEAR_FIELD_LIMITS).yearMax,
              inputmode: "numeric",
              class: inputClass
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              message: unref(metadataForm).errors.year
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            if (__props.abilities.updateFullReport) {
              _push2(`<div class="grid gap-2" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "status" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Status`);
                  } else {
                    return [
                      createTextVNode("Status")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<select id="status" name="status" class="report-select transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]" data-v-12d91347${_scopeId}><option value="pending" data-v-12d91347${ssrIncludeBooleanAttr(Array.isArray(unref(metadataForm).status) ? ssrLooseContain(unref(metadataForm).status, "pending") : ssrLooseEqual(unref(metadataForm).status, "pending")) ? " selected" : ""}${_scopeId}>Pending</option><option value="published" data-v-12d91347${ssrIncludeBooleanAttr(Array.isArray(unref(metadataForm).status) ? ssrLooseContain(unref(metadataForm).status, "published") : ssrLooseEqual(unref(metadataForm).status, "published")) ? " selected" : ""}${_scopeId}>Published</option></select>`);
              _push2(ssrRenderComponent(_sfc_main$6, {
                message: unref(metadataForm).errors.status
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="grid gap-2" data-v-12d91347${_scopeId}><span class="text-sm font-medium text-black" data-v-12d91347${_scopeId}>Status</span><p class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-black" data-v-12d91347${_scopeId}>`);
              if (unref(metadataForm).status === "published") {
                _push2(`<span class="font-medium text-emerald-800" data-v-12d91347${_scopeId}> Published`);
                if (publishedAtLabel.value) {
                  _push2(`<!--[--> · ${ssrInterpolate(publishedAtLabel.value)}<!--]-->`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</span>`);
              } else {
                _push2(`<span class="font-medium text-amber-800" data-v-12d91347${_scopeId}>Pending</span>`);
              }
              _push2(`</p></div>`);
            }
            _push2(`</div><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "title" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Title`);
                } else {
                  return [
                    createTextVNode("Title")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$5), {
              id: "title",
              modelValue: unref(metadataForm).title,
              "onUpdate:modelValue": ($event) => unref(metadataForm).title = $event,
              name: "title",
              type: "text",
              placeholder: "Optional custom title",
              maxlength: unref(REPORT_YEAR_FIELD_LIMITS).title,
              class: inputClass
            }, null, _parent2, _scopeId));
            _push2(`<p class="text-xs text-black" data-v-12d91347${_scopeId}>Up to ${ssrInterpolate(unref(REPORT_YEAR_FIELD_LIMITS).title)} characters.</p>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              message: unref(metadataForm).errors.title
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "description" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Description`);
                } else {
                  return [
                    createTextVNode("Description")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<textarea id="description" name="description" rows="4" class="report-textarea transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"${ssrRenderAttr("maxlength", unref(REPORT_YEAR_FIELD_LIMITS).description)} data-v-12d91347${_scopeId}>${ssrInterpolate(unref(metadataForm).description)}</textarea><p class="text-xs text-black" data-v-12d91347${_scopeId}>${ssrInterpolate(descriptionLength.value)} / ${ssrInterpolate(unref(REPORT_YEAR_FIELD_LIMITS).description)}</p>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              message: unref(metadataForm).errors.description
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$6, { message: metadataPatchError.value }, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$7), {
              type: "submit",
              disabled: metadataSaving.value,
              class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Save), {
                    class: "size-4",
                    "stroke-width": 2.5,
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                  _push3(` Save metadata `);
                } else {
                  return [
                    createVNode(unref(Save), {
                      class: "size-4",
                      "stroke-width": 2.5,
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" Save metadata ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p class="report-save-hint" style="${ssrRenderStyle(unref(metadataForm).recentlySuccessful ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckCircle2), {
              class: "size-4 shrink-0",
              "stroke-width": 2,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Saved </p></div></form></section><section class="report-panel" role="tabpanel" style="${ssrRenderStyle(activeTab.value === "gfps_membership" ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            if (hasRecentUpdate("gfps_membership")) {
              _push2(`<div class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Sparkles), {
                class: "size-4 shrink-0 text-amber-500",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="flex-1" data-v-12d91347${_scopeId}>This section was recently updated by another user.</span><button type="button" class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]" data-v-12d91347${_scopeId}> Dismiss </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$3, {
              variant: "report",
              title: "GFPS membership",
              description: "Total GFPS members by sex for this reporting year. Use whole numbers only."
            }, null, _parent2, _scopeId));
            _push2(`<form class="report-form report-form--edit w-full" data-v-12d91347${_scopeId}><div class="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 shadow-sm" data-v-12d91347${_scopeId}><div class="grid gap-4 sm:grid-cols-2" data-v-12d91347${_scopeId}><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "gfps_female_count" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Female`);
                } else {
                  return [
                    createTextVNode("Female")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$5), {
              id: "gfps_female_count",
              modelValue: unref(gfpsMembershipForm).female_count,
              "onUpdate:modelValue": ($event) => unref(gfpsMembershipForm).female_count = $event,
              type: "number",
              min: "0",
              inputmode: "numeric",
              class: inputClass
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              message: unref(gfpsMembershipForm).errors.female_count
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "gfps_male_count" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Male`);
                } else {
                  return [
                    createTextVNode("Male")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$5), {
              id: "gfps_male_count",
              modelValue: unref(gfpsMembershipForm).male_count,
              "onUpdate:modelValue": ($event) => unref(gfpsMembershipForm).male_count = $event,
              type: "number",
              min: "0",
              inputmode: "numeric",
              class: inputClass
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$6, {
              message: unref(gfpsMembershipForm).errors.male_count
            }, null, _parent2, _scopeId));
            _push2(`</div></div><p class="mt-1 max-w-md text-xs text-black" data-v-12d91347${_scopeId}> Total members: <span class="font-medium text-black tabular-nums" data-v-12d91347${_scopeId}>${ssrInterpolate(gfpsMembershipTotal.value)}</span></p></div><div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$7), {
              type: "submit",
              class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
              disabled: unref(gfpsMembershipForm).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Save), {
                    class: "size-4",
                    "stroke-width": 2.5,
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                  _push3(` Save GFPS membership `);
                } else {
                  return [
                    createVNode(unref(Save), {
                      class: "size-4",
                      "stroke-width": 2.5,
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" Save GFPS membership ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p class="report-save-hint" style="${ssrRenderStyle(unref(gfpsMembershipForm).recentlySuccessful ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckCircle2), {
              class: "size-4 shrink-0",
              "stroke-width": 2,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Saved </p></div></form></section><section class="report-panel" role="tabpanel" style="${ssrRenderStyle(activeTab.value === "scholarship" ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            if (hasRecentUpdate("scholarship")) {
              _push2(`<div class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Sparkles), {
                class: "size-4 shrink-0 text-amber-500",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="flex-1" data-v-12d91347${_scopeId}>This section was recently updated by another user.</span><button type="button" class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]" data-v-12d91347${_scopeId}> Dismiss </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$3, {
              variant: "report",
              title: "Scholarship",
              description: "Track scholar counts across the year. Each update is saved as a separate snapshot — previous data is always preserved."
            }, null, _parent2, _scopeId));
            if (!showAddForm.value) {
              _push2(`<div class="mt-6 mb-6" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$7), {
                type: "button",
                variant: "outline",
                class: "flex items-center gap-2 border-emerald-200 bg-emerald-50/20 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                onClick: ($event) => showAddForm.value = true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Plus), {
                      class: "size-4 text-emerald-600 animate-pulse",
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                    _push3(`<span data-v-12d91347${_scopeId2}>Add New Snapshot</span>`);
                  } else {
                    return [
                      createVNode(unref(Plus), {
                        class: "size-4 text-emerald-600 animate-pulse",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", null, "Add New Snapshot")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<form class="report-form report-form--edit w-full mb-6 border border-zinc-200 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mt-6 transition-[transform,background-color,border-color,color] duration-200 ease-out" data-v-12d91347${_scopeId}><div class="mb-4 flex items-center justify-between gap-2 border-b border-zinc-200 pb-3" data-v-12d91347${_scopeId}><div class="flex items-center gap-2" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Plus), {
                class: "size-4 text-emerald-600",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm font-semibold text-zinc-900" data-v-12d91347${_scopeId}>Add New Snapshot</span></div><button type="button" class="text-xs text-zinc-400 hover:text-zinc-700 underline transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]" data-v-12d91347${_scopeId}> Cancel </button></div><div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] mt-6" data-v-12d91347${_scopeId}><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "new_school_year_id" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`School year`);
                  } else {
                    return [
                      createTextVNode("School year")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<select id="new_school_year_id" class="report-select transition-all hover:border-zinc-300 focus:border-zinc-400" data-v-12d91347${_scopeId}><option value="" disabled data-v-12d91347${ssrIncludeBooleanAttr(Array.isArray(unref(newSnapshotForm).school_year_id) ? ssrLooseContain(unref(newSnapshotForm).school_year_id, "") : ssrLooseEqual(unref(newSnapshotForm).school_year_id, "")) ? " selected" : ""}${_scopeId}>Select school year…</option><!--[-->`);
              ssrRenderList(__props.schoolYears, (sy) => {
                _push2(`<option${ssrRenderAttr("value", sy.id)} data-v-12d91347${ssrIncludeBooleanAttr(Array.isArray(unref(newSnapshotForm).school_year_id) ? ssrLooseContain(unref(newSnapshotForm).school_year_id, sy.id) : ssrLooseEqual(unref(newSnapshotForm).school_year_id, sy.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(sy.label)}</option>`);
              });
              _push2(`<!--]--></select>`);
              _push2(ssrRenderComponent(_sfc_main$6, {
                message: unref(newSnapshotForm).errors.school_year_id
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "new_as_of_date" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`As of date`);
                  } else {
                    return [
                      createTextVNode("As of date")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: "new_as_of_date",
                modelValue: unref(newSnapshotForm).as_of_date,
                "onUpdate:modelValue": ($event) => unref(newSnapshotForm).as_of_date = $event,
                type: "date",
                max: unref(todayDate),
                class: inputClass
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$6, {
                message: unref(newSnapshotForm).errors.as_of_date
              }, null, _parent2, _scopeId));
              _push2(`</div></div><div class="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 mt-6 shadow-sm" data-v-12d91347${_scopeId}><div class="grid gap-4 sm:grid-cols-2" data-v-12d91347${_scopeId}><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "new_female_count" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Female`);
                  } else {
                    return [
                      createTextVNode("Female")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: "new_female_count",
                modelValue: unref(newSnapshotForm).female_count,
                "onUpdate:modelValue": ($event) => unref(newSnapshotForm).female_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: inputClass
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$6, {
                message: unref(newSnapshotForm).errors.female_count
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), { for: "new_male_count" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Male`);
                  } else {
                    return [
                      createTextVNode("Male")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: "new_male_count",
                modelValue: unref(newSnapshotForm).male_count,
                "onUpdate:modelValue": ($event) => unref(newSnapshotForm).male_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: inputClass
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_sfc_main$6, {
                message: unref(newSnapshotForm).errors.male_count
              }, null, _parent2, _scopeId));
              _push2(`</div></div><div class="mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm" data-v-12d91347${_scopeId}><span class="text-zinc-500 font-medium" data-v-12d91347${_scopeId}>Total Scholars</span><span class="rounded-lg bg-zinc-950 px-3 py-1 font-mono text-xs font-semibold text-white tabular-nums" data-v-12d91347${_scopeId}>${ssrInterpolate(newSnapshotTotal.value)}</span></div></div><div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-4 mt-6" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$7), {
                type: "submit",
                class: "report-save-btn flex items-center gap-2 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                disabled: unref(newSnapshotForm).processing
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Plus), {
                      class: "size-4",
                      "stroke-width": 2.5,
                      "aria-hidden": "true"
                    }, null, _parent3, _scopeId2));
                    _push3(` Save new snapshot `);
                  } else {
                    return [
                      createVNode(unref(Plus), {
                        class: "size-4",
                        "stroke-width": 2.5,
                        "aria-hidden": "true"
                      }),
                      createTextVNode(" Save new snapshot ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$7), {
                type: "button",
                variant: "ghost",
                class: "text-zinc-500 hover:text-zinc-800 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                onClick: ($event) => showAddForm.value = false
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Cancel `);
                  } else {
                    return [
                      createTextVNode(" Cancel ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<p class="report-save-hint" style="${ssrRenderStyle(unref(newSnapshotForm).recentlySuccessful ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(CheckCircle2), {
                class: "size-4 shrink-0 text-emerald-600",
                "stroke-width": 2,
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` Saved </p></div></form>`);
            }
            if (__props.reportYear.scholarshipSnapshots.length > 0) {
              _push2(`<div class="mt-8" data-v-12d91347${_scopeId}><div class="mb-4 flex items-center gap-2" data-v-12d91347${_scopeId}><span class="text-sm font-semibold text-zinc-900" data-v-12d91347${_scopeId}>Snapshot History</span><span class="rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700" data-v-12d91347${_scopeId}>${ssrInterpolate(__props.reportYear.scholarshipSnapshots.length)}</span></div><div class="relative pl-6 border-l border-zinc-200 ml-3 space-y-6" data-v-12d91347${_scopeId}><!--[-->`);
              ssrRenderList(__props.reportYear.scholarshipSnapshots, (snap, index) => {
                _push2(`<div class="${ssrRenderClass([index === 0 ? "border-emerald-200 bg-emerald-50/30 shadow-[0_8px_30px_rgb(0,0,0,0.01)]" : "border-zinc-200 bg-white", "relative rounded-2xl border p-5 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-zinc-300 hover:shadow-sm hover:-translate-y-0.5"])}" data-v-12d91347${_scopeId}><div class="${ssrRenderClass([index === 0 ? "border-emerald-500" : "border-zinc-300", "absolute -left-[33px] top-[26px] flex h-4 w-4 items-center justify-center rounded-full bg-white border-2"])}" data-v-12d91347${_scopeId}><div class="${ssrRenderClass([index === 0 ? "bg-emerald-500 animate-pulse" : "bg-zinc-300", "h-1.5 w-1.5 rounded-full"])}" data-v-12d91347${_scopeId}></div></div>`);
                if (editingSnapshotId.value !== snap.id) {
                  _push2(`<div class="flex items-start justify-between gap-4" data-v-12d91347${_scopeId}><div class="min-w-0 flex-1" data-v-12d91347${_scopeId}><div class="flex items-center gap-2 flex-wrap" data-v-12d91347${_scopeId}><span class="text-sm font-semibold text-zinc-900" data-v-12d91347${_scopeId}> As of ${ssrInterpolate(snap.asOfDate ?? "No date")}</span>`);
                  if (index === 0) {
                    _push2(`<span class="inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800" data-v-12d91347${_scopeId}> Latest Snapshot </span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div><div class="mt-2 text-xs text-zinc-600 flex flex-wrap gap-x-4 gap-y-1" data-v-12d91347${_scopeId}><span data-v-12d91347${_scopeId}>School Year: <span class="font-medium text-zinc-900" data-v-12d91347${_scopeId}>${ssrInterpolate(snap.schoolYearLabel || "No school year")}</span></span><span data-v-12d91347${_scopeId}>F: <span class="font-semibold text-zinc-950 font-mono tabular-nums" data-v-12d91347${_scopeId}>${ssrInterpolate(snap.femaleCount ?? 0)}</span></span><span data-v-12d91347${_scopeId}>M: <span class="font-semibold text-zinc-950 font-mono tabular-nums" data-v-12d91347${_scopeId}>${ssrInterpolate(snap.maleCount ?? 0)}</span></span><span class="font-medium text-zinc-900" data-v-12d91347${_scopeId}>Total: <span class="font-bold text-zinc-950 font-mono tabular-nums" data-v-12d91347${_scopeId}>${ssrInterpolate(Number(snap.femaleCount ?? 0) + Number(snap.maleCount ?? 0))}</span></span></div><p class="mt-2 text-[10px] text-zinc-400 flex items-center gap-1.5" data-v-12d91347${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Calendar), { class: "size-3 text-zinc-400" }, null, _parent2, _scopeId));
                  _push2(`<span data-v-12d91347${_scopeId}>Added ${ssrInterpolate(snap.createdAt ? new Date(snap.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : "unknown")}</span>`);
                  if (snap.lastEditedBy) {
                    _push2(`<!--[--><span data-v-12d91347${_scopeId}>·</span><span data-v-12d91347${_scopeId}>Last edited by <span class="font-medium text-zinc-600" data-v-12d91347${_scopeId}>${ssrInterpolate(snap.lastEditedBy)}</span></span>`);
                    if (snap.lastEditedAt) {
                      _push2(`<span data-v-12d91347${_scopeId}>on ${ssrInterpolate(new Date(snap.lastEditedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" }))}</span>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`<!--]-->`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</p></div><div class="flex shrink-0 items-center gap-1.5" data-v-12d91347${_scopeId}>`);
                  if (__props.abilities.updateScholarship) {
                    _push2(`<button type="button" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]" data-v-12d91347${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(Pencil), {
                      class: "size-3.5",
                      "aria-hidden": "true"
                    }, null, _parent2, _scopeId));
                    _push2(` Edit </button>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (__props.abilities.deleteScholarship) {
                    _push2(`<button type="button" class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]" data-v-12d91347${_scopeId}>`);
                    _push2(ssrRenderComponent(unref(Trash2), {
                      class: "size-3.5",
                      "aria-hidden": "true"
                    }, null, _parent2, _scopeId));
                    _push2(` Delete </button>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                } else {
                  _push2(`<form class="space-y-4" data-v-12d91347${_scopeId}><div class="mb-2 flex items-center justify-between gap-2 border-b border-zinc-200/80 pb-2" data-v-12d91347${_scopeId}><span class="text-sm font-semibold text-zinc-900 flex items-center gap-2" data-v-12d91347${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(Pencil), {
                    class: "size-4 text-zinc-500",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push2(` Editing Snapshot </span><button type="button" class="text-zinc-400 hover:text-zinc-700 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]" data-v-12d91347${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(X), { class: "size-4" }, null, _parent2, _scopeId));
                  _push2(`</button></div><div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] mt-4" data-v-12d91347${_scopeId}><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$4), {
                    for: `edit_school_year_${snap.id}`
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`School year`);
                      } else {
                        return [
                          createTextVNode("School year")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`<select${ssrRenderAttr("id", `edit_school_year_${snap.id}`)} class="report-select transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]" data-v-12d91347${_scopeId}><option value="" disabled data-v-12d91347${ssrIncludeBooleanAttr(Array.isArray(unref(editSnapshotForm).school_year_id) ? ssrLooseContain(unref(editSnapshotForm).school_year_id, "") : ssrLooseEqual(unref(editSnapshotForm).school_year_id, "")) ? " selected" : ""}${_scopeId}>Select school year…</option><!--[-->`);
                  ssrRenderList(__props.schoolYears, (sy) => {
                    _push2(`<option${ssrRenderAttr("value", sy.id)} data-v-12d91347${ssrIncludeBooleanAttr(Array.isArray(unref(editSnapshotForm).school_year_id) ? ssrLooseContain(unref(editSnapshotForm).school_year_id, sy.id) : ssrLooseEqual(unref(editSnapshotForm).school_year_id, sy.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(sy.label)}</option>`);
                  });
                  _push2(`<!--]--></select>`);
                  _push2(ssrRenderComponent(_sfc_main$6, {
                    message: unref(editSnapshotForm).errors.school_year_id
                  }, null, _parent2, _scopeId));
                  _push2(`</div><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$4), {
                    for: `edit_as_of_date_${snap.id}`
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`As of date`);
                      } else {
                        return [
                          createTextVNode("As of date")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(ssrRenderComponent(unref(_sfc_main$5), {
                    id: `edit_as_of_date_${snap.id}`,
                    modelValue: unref(editSnapshotForm).as_of_date,
                    "onUpdate:modelValue": ($event) => unref(editSnapshotForm).as_of_date = $event,
                    type: "date",
                    max: unref(todayDate),
                    class: inputClass
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(_sfc_main$6, {
                    message: unref(editSnapshotForm).errors.as_of_date
                  }, null, _parent2, _scopeId));
                  _push2(`</div></div><div class="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 mt-4" data-v-12d91347${_scopeId}><div class="grid gap-4 sm:grid-cols-2" data-v-12d91347${_scopeId}><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$4), {
                    for: `edit_female_${snap.id}`
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Female`);
                      } else {
                        return [
                          createTextVNode("Female")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(ssrRenderComponent(unref(_sfc_main$5), {
                    id: `edit_female_${snap.id}`,
                    modelValue: unref(editSnapshotForm).female_count,
                    "onUpdate:modelValue": ($event) => unref(editSnapshotForm).female_count = $event,
                    type: "number",
                    min: "0",
                    inputmode: "numeric",
                    class: inputClass
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(_sfc_main$6, {
                    message: unref(editSnapshotForm).errors.female_count
                  }, null, _parent2, _scopeId));
                  _push2(`</div><div class="grid gap-2" data-v-12d91347${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$4), {
                    for: `edit_male_${snap.id}`
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`Male`);
                      } else {
                        return [
                          createTextVNode("Male")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(ssrRenderComponent(unref(_sfc_main$5), {
                    id: `edit_male_${snap.id}`,
                    modelValue: unref(editSnapshotForm).male_count,
                    "onUpdate:modelValue": ($event) => unref(editSnapshotForm).male_count = $event,
                    type: "number",
                    min: "0",
                    inputmode: "numeric",
                    class: inputClass
                  }, null, _parent2, _scopeId));
                  _push2(ssrRenderComponent(_sfc_main$6, {
                    message: unref(editSnapshotForm).errors.male_count
                  }, null, _parent2, _scopeId));
                  _push2(`</div></div><div class="mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm" data-v-12d91347${_scopeId}><span class="text-zinc-500 font-medium" data-v-12d91347${_scopeId}>Total Scholars</span><span class="rounded-lg bg-zinc-950 px-3 py-1 font-mono text-xs font-semibold text-white tabular-nums" data-v-12d91347${_scopeId}>${ssrInterpolate(editSnapshotTotal.value)}</span></div></div><div class="flex flex-wrap items-center gap-3 border-zinc-200/80 border-t pt-4 mt-6" data-v-12d91347${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$7), {
                    type: "submit",
                    class: "report-save-btn active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    disabled: unref(editSnapshotForm).processing
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(unref(Save), {
                          class: "size-4",
                          "stroke-width": 2.5,
                          "aria-hidden": "true"
                        }, null, _parent3, _scopeId2));
                        _push3(` Save changes `);
                      } else {
                        return [
                          createVNode(unref(Save), {
                            class: "size-4",
                            "stroke-width": 2.5,
                            "aria-hidden": "true"
                          }),
                          createTextVNode(" Save changes ")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(ssrRenderComponent(unref(_sfc_main$7), {
                    type: "button",
                    variant: "ghost",
                    class: "text-zinc-500 hover:text-zinc-800 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    onClick: cancelEditSnapshot
                  }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(` Cancel `);
                      } else {
                        return [
                          createTextVNode(" Cancel ")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div></form>`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<div class="mt-6 rounded-2xl border border-dashed border-zinc-200 p-8 text-center bg-zinc-50/20" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Calendar), { class: "size-8 text-zinc-400 mx-auto mb-3" }, null, _parent2, _scopeId));
              _push2(`<h4 class="text-sm font-semibold text-zinc-900" data-v-12d91347${_scopeId}>No snapshots recorded</h4><p class="mt-1 text-xs text-zinc-500 max-w-sm mx-auto" data-v-12d91347${_scopeId}> No scholarship data snapshots have been added for this year yet. Click &quot;Add New Snapshot&quot; above to create the first record. </p></div>`);
            }
            _push2(`</section><section class="report-panel" role="tabpanel" style="${ssrRenderStyle(activeTab.value === "gfps_assemblies" ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            if (hasRecentUpdate("gfps_assemblies")) {
              _push2(`<div class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Sparkles), {
                class: "size-4 shrink-0 text-amber-500",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="flex-1" data-v-12d91347${_scopeId}>This section was recently updated by another user.</span><button type="button" class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]" data-v-12d91347${_scopeId}> Dismiss </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$3, {
              variant: "report",
              title: "GFPS assemblies",
              description: "Attendance by assembly period. Enter headcounts by sex for each row."
            }, null, _parent2, _scopeId));
            _push2(`<form class="report-form report-form--edit w-full" data-v-12d91347${_scopeId}><div class="report-years-data-table" data-v-12d91347${_scopeId}><div class="report-years-data-head report-years-data-head--3col" data-v-12d91347${_scopeId}><span class="report-years-data-head-label" data-v-12d91347${_scopeId}>Period</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Female</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Male</span></div><!--[-->`);
            ssrRenderList(unref(gfpsAssembliesForm).attendances, (row, index) => {
              _push2(`<div class="report-years-data-row report-years-data-row--3col" data-v-12d91347${_scopeId}><div class="report-years-data-row-label" data-v-12d91347${_scopeId}>${ssrInterpolate(__props.reportYear.gfpsAssemblies[index]?.label)}</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `gfps_assembly_female_${row.period_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Female count`);
                  } else {
                    return [
                      createTextVNode("Female count")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `gfps_assembly_female_${row.period_id}`,
                modelValue: row.female_count,
                "onUpdate:modelValue": ($event) => row.female_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `gfps_assembly_male_${row.period_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Male count`);
                  } else {
                    return [
                      createTextVNode("Male count")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `gfps_assembly_male_${row.period_id}`,
                modelValue: row.male_count,
                "onUpdate:modelValue": ($event) => row.male_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              message: unref(gfpsAssembliesForm).errors.attendances
            }, null, _parent2, _scopeId));
            _push2(`<div class="report-years-form-actions" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$7), {
              type: "submit",
              class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
              disabled: unref(gfpsAssembliesForm).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Save), {
                    class: "size-4",
                    "stroke-width": 2.5,
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                  _push3(` Save assemblies `);
                } else {
                  return [
                    createVNode(unref(Save), {
                      class: "size-4",
                      "stroke-width": 2.5,
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" Save assemblies ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p class="report-save-hint" style="${ssrRenderStyle(unref(gfpsAssembliesForm).recentlySuccessful ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckCircle2), {
              class: "size-4 shrink-0",
              "stroke-width": 2,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Saved </p></div></form></section><section class="report-panel" role="tabpanel" style="${ssrRenderStyle(activeTab.value === "employee_status" ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            if (hasRecentUpdate("employee_status")) {
              _push2(`<div class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Sparkles), {
                class: "size-4 shrink-0 text-amber-500",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="flex-1" data-v-12d91347${_scopeId}>This section was recently updated by another user.</span><button type="button" class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]" data-v-12d91347${_scopeId}> Dismiss </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$3, {
              variant: "report",
              title: "Employee status",
              description: "Workforce headcounts by employment status and sex. Use the same definitions as HR records."
            }, null, _parent2, _scopeId));
            _push2(`<form class="report-form report-form--edit w-full" data-v-12d91347${_scopeId}><div class="report-years-data-table" data-v-12d91347${_scopeId}><div class="report-years-data-head report-years-data-head--3col" data-v-12d91347${_scopeId}><span class="report-years-data-head-label" data-v-12d91347${_scopeId}>Employment status</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Female</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Male</span></div><!--[-->`);
            ssrRenderList(unref(employeeStatusesForm).breakdowns, (row, index) => {
              _push2(`<div class="report-years-data-row report-years-data-row--3col" data-v-12d91347${_scopeId}><div class="report-years-data-row-label" data-v-12d91347${_scopeId}>${ssrInterpolate(__props.reportYear.employeeStatuses[index]?.label)}</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `employee_female_${row.employment_status_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Female count`);
                  } else {
                    return [
                      createTextVNode("Female count")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `employee_female_${row.employment_status_id}`,
                modelValue: row.female_count,
                "onUpdate:modelValue": ($event) => row.female_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `employee_male_${row.employment_status_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Male count`);
                  } else {
                    return [
                      createTextVNode("Male count")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `employee_male_${row.employment_status_id}`,
                modelValue: row.male_count,
                "onUpdate:modelValue": ($event) => row.male_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              message: unref(employeeStatusesForm).errors.breakdowns
            }, null, _parent2, _scopeId));
            _push2(`<div class="report-years-form-actions" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$7), {
              type: "submit",
              class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
              disabled: unref(employeeStatusesForm).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Save), {
                    class: "size-4",
                    "stroke-width": 2.5,
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                  _push3(` Save employee status `);
                } else {
                  return [
                    createVNode(unref(Save), {
                      class: "size-4",
                      "stroke-width": 2.5,
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" Save employee status ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p class="report-save-hint" style="${ssrRenderStyle(unref(employeeStatusesForm).recentlySuccessful ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckCircle2), {
              class: "size-4 shrink-0",
              "stroke-width": 2,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Saved </p></div></form></section><section class="report-panel" role="tabpanel" style="${ssrRenderStyle(activeTab.value === "rstl_monthly" ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            if (hasRecentUpdate("rstl_monthly")) {
              _push2(`<div class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Sparkles), {
                class: "size-4 shrink-0 text-amber-500",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="flex-1" data-v-12d91347${_scopeId}>This section was recently updated by another user.</span><button type="button" class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]" data-v-12d91347${_scopeId}> Dismiss </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$3, {
              variant: "report",
              title: "RSTL by month",
              description: "Monthly RSTL activity: clients or visits by sex, plus female-led and male-led counts. Scroll horizontally on small screens if the column labels do not fit."
            }, null, _parent2, _scopeId));
            _push2(`<form class="report-form report-form--edit w-full" data-v-12d91347${_scopeId}><div class="report-years-data-table-scroll" data-v-12d91347${_scopeId}><div class="report-years-data-table report-years-data-table--wide report-years-data-table--rstl" data-v-12d91347${_scopeId}><div class="report-years-data-head report-years-data-head--5col" data-v-12d91347${_scopeId}><span class="report-years-data-head-label" data-v-12d91347${_scopeId}>Month</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Female</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Female-led</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Male</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Male-led</span></div><!--[-->`);
            ssrRenderList(unref(rstlForm).breakdowns, (row, index) => {
              _push2(`<div class="report-years-data-row report-years-data-row--5col" data-v-12d91347${_scopeId}><div class="report-years-data-row-label" data-v-12d91347${_scopeId}>${ssrInterpolate(__props.reportYear.rstlMonthly[index]?.label)}</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `rstl_female_${row.report_month_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Female`);
                  } else {
                    return [
                      createTextVNode("Female")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `rstl_female_${row.report_month_id}`,
                modelValue: row.female_count,
                "onUpdate:modelValue": ($event) => row.female_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `rstl_female_led_${row.report_month_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Female-led`);
                  } else {
                    return [
                      createTextVNode("Female-led")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `rstl_female_led_${row.report_month_id}`,
                modelValue: row.female_led_count,
                "onUpdate:modelValue": ($event) => row.female_led_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `rstl_male_${row.report_month_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Male`);
                  } else {
                    return [
                      createTextVNode("Male")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `rstl_male_${row.report_month_id}`,
                modelValue: row.male_count,
                "onUpdate:modelValue": ($event) => row.male_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `rstl_male_led_${row.report_month_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Male-led`);
                  } else {
                    return [
                      createTextVNode("Male-led")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `rstl_male_led_${row.report_month_id}`,
                modelValue: row.male_led_count,
                "onUpdate:modelValue": ($event) => row.male_led_count = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              message: unref(rstlForm).errors.breakdowns
            }, null, _parent2, _scopeId));
            _push2(`<div class="report-years-form-actions" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$7), {
              type: "submit",
              class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
              disabled: unref(rstlForm).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Save), {
                    class: "size-4",
                    "stroke-width": 2.5,
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                  _push3(` Save RSTL `);
                } else {
                  return [
                    createVNode(unref(Save), {
                      class: "size-4",
                      "stroke-width": 2.5,
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" Save RSTL ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p class="report-save-hint" style="${ssrRenderStyle(unref(rstlForm).recentlySuccessful ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckCircle2), {
              class: "size-4 shrink-0",
              "stroke-width": 2,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Saved </p></div></form></section><section class="report-panel" role="tabpanel" style="${ssrRenderStyle(activeTab.value === "program_funding" ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            if (hasRecentUpdate("program_funding")) {
              _push2(`<div class="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="status" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Sparkles), {
                class: "size-4 shrink-0 text-amber-500",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="flex-1" data-v-12d91347${_scopeId}>This section was recently updated by another user.</span><button type="button" class="shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]" data-v-12d91347${_scopeId}> Dismiss </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$3, {
              variant: "report",
              title: "Program funding",
              description: "Projects and funding amounts by program, split by sex. Amounts use your organization’s currency; enter decimals as needed."
            }, null, _parent2, _scopeId));
            _push2(`<form class="report-form report-form--edit w-full" data-v-12d91347${_scopeId}><div class="space-y-6" data-v-12d91347${_scopeId}><div class="space-y-2" data-v-12d91347${_scopeId}><p class="text-xs font-semibold tracking-wide text-foreground uppercase" data-v-12d91347${_scopeId}>SETUP</p><div class="report-years-data-table-scroll" data-v-12d91347${_scopeId}><div class="report-years-data-table report-years-data-table--wide report-years-data-table--funding" data-v-12d91347${_scopeId}><div class="report-years-data-head report-years-data-head--funding" data-v-12d91347${_scopeId}><span class="report-years-data-head-label" data-v-12d91347${_scopeId}>Program</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Female projects</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Female amount</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Male projects</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Male amount</span></div><!--[-->`);
            ssrRenderList(setupFundingRows.value, (item) => {
              _push2(`<div class="report-years-data-row report-years-data-row--funding" data-v-12d91347${_scopeId}><div class="report-years-data-row-label" data-v-12d91347${_scopeId}>${ssrInterpolate(item.label)}</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `funding_female_projects_${item.row.funding_program_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Female projects`);
                  } else {
                    return [
                      createTextVNode("Female projects")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `funding_female_projects_${item.row.funding_program_id}`,
                modelValue: item.row.female_projects,
                "onUpdate:modelValue": ($event) => item.row.female_projects = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `funding_female_amount_${item.row.funding_program_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Female amount`);
                  } else {
                    return [
                      createTextVNode("Female amount")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `funding_female_amount_${item.row.funding_program_id}`,
                modelValue: item.row.female_amount,
                "onUpdate:modelValue": ($event) => item.row.female_amount = $event,
                type: "number",
                min: "0",
                step: "0.01",
                inputmode: "decimal",
                placeholder: "0.00",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `funding_male_projects_${item.row.funding_program_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Male projects`);
                  } else {
                    return [
                      createTextVNode("Male projects")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `funding_male_projects_${item.row.funding_program_id}`,
                modelValue: item.row.male_projects,
                "onUpdate:modelValue": ($event) => item.row.male_projects = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `funding_male_amount_${item.row.funding_program_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Male amount`);
                  } else {
                    return [
                      createTextVNode("Male amount")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `funding_male_amount_${item.row.funding_program_id}`,
                modelValue: item.row.male_amount,
                "onUpdate:modelValue": ($event) => item.row.male_amount = $event,
                type: "number",
                min: "0",
                step: "0.01",
                inputmode: "decimal",
                placeholder: "0.00",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div></div></div><div class="space-y-2" data-v-12d91347${_scopeId}><p class="text-xs font-semibold tracking-wide text-foreground uppercase" data-v-12d91347${_scopeId}>CEST</p><div class="report-years-data-table-scroll" data-v-12d91347${_scopeId}><div class="report-years-data-table report-years-data-table--wide report-years-data-table--funding" data-v-12d91347${_scopeId}><div class="report-years-data-head report-years-data-head--funding" data-v-12d91347${_scopeId}><span class="report-years-data-head-label" data-v-12d91347${_scopeId}>Program</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Female projects</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Female amount</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Male projects</span><span class="report-years-data-head-label report-years-data-head-label--center" data-v-12d91347${_scopeId}>Male amount</span></div><!--[-->`);
            ssrRenderList(cestFundingRows.value, (item) => {
              _push2(`<div class="report-years-data-row report-years-data-row--funding" data-v-12d91347${_scopeId}><div class="report-years-data-row-label" data-v-12d91347${_scopeId}>${ssrInterpolate(item.label)}</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `funding_female_projects_${item.row.funding_program_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Female projects`);
                  } else {
                    return [
                      createTextVNode("Female projects")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `funding_female_projects_${item.row.funding_program_id}`,
                modelValue: item.row.female_projects,
                "onUpdate:modelValue": ($event) => item.row.female_projects = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `funding_female_amount_${item.row.funding_program_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Female amount`);
                  } else {
                    return [
                      createTextVNode("Female amount")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `funding_female_amount_${item.row.funding_program_id}`,
                modelValue: item.row.female_amount,
                "onUpdate:modelValue": ($event) => item.row.female_amount = $event,
                type: "number",
                min: "0",
                step: "0.01",
                inputmode: "decimal",
                placeholder: "0.00",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `funding_male_projects_${item.row.funding_program_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Male projects`);
                  } else {
                    return [
                      createTextVNode("Male projects")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `funding_male_projects_${item.row.funding_program_id}`,
                modelValue: item.row.male_projects,
                "onUpdate:modelValue": ($event) => item.row.male_projects = $event,
                type: "number",
                min: "0",
                inputmode: "numeric",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="report-years-data-cell" data-v-12d91347${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$4), {
                for: `funding_male_amount_${item.row.funding_program_id}`,
                class: "report-years-data-cell-label md:sr-only"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Male amount`);
                  } else {
                    return [
                      createTextVNode("Male amount")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$5), {
                id: `funding_male_amount_${item.row.funding_program_id}`,
                modelValue: item.row.male_amount,
                "onUpdate:modelValue": ($event) => item.row.male_amount = $event,
                type: "number",
                min: "0",
                step: "0.01",
                inputmode: "decimal",
                placeholder: "0.00",
                class: tableInputClass
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div></div></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              message: unref(fundingForm).errors.summaries
            }, null, _parent2, _scopeId));
            _push2(`<div class="report-years-form-actions" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$7), {
              type: "submit",
              class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
              disabled: unref(fundingForm).processing
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Save), {
                    class: "size-4",
                    "stroke-width": 2.5,
                    "aria-hidden": "true"
                  }, null, _parent3, _scopeId2));
                  _push3(` Save program funding `);
                } else {
                  return [
                    createVNode(unref(Save), {
                      class: "size-4",
                      "stroke-width": 2.5,
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" Save program funding ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p class="report-save-hint" style="${ssrRenderStyle(unref(fundingForm).recentlySuccessful ? null : { display: "none" })}" data-v-12d91347${_scopeId}>`);
            _push2(ssrRenderComponent(unref(CheckCircle2), {
              class: "size-4 shrink-0",
              "stroke-width": 2,
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Saved </p></div></form></section></div></div>`);
          } else {
            return [
              createVNode(unref(Head), {
                title: `Manage ${__props.reportYear.year} report`
              }, null, 8, ["title"]),
              createVNode("div", { class: "report-years-inner report-years-inner--edit" }, [
                createVNode("header", { class: "report-years-edit-header animate-fade-in-up" }, [
                  createVNode("div", { class: "report-years-edit-intro" }, [
                    createVNode("div", { class: "report-years-edit-hero" }, [
                      createVNode("div", { class: "report-years-edit-hero-top" }, [
                        createVNode("div", { class: "report-years-edit-hero-badges" }, [
                          currentEditors.value.length > 1 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex space-x-1.5 mr-2"
                          }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(currentEditors.value, (editor) => {
                              return openBlock(), createBlock("div", {
                                key: editor.id,
                                class: ["flex h-6 items-center justify-center rounded-full px-2.5 text-[10px] font-bold shadow-sm", getAvatarColor(editor.username ?? "")],
                                title: editor.username ?? "Unknown User"
                              }, toDisplayString(editor.username), 11, ["title"]);
                            }), 128))
                          ])) : (openBlock(), createBlock("span", {
                            key: 1,
                            class: "report-years-edit-meta-chip"
                          }, "Currently Editing")),
                          createVNode("span", {
                            class: ["report-years-status-badge", isPublished.value ? "report-years-status-badge--published" : "report-years-status-badge--pending"]
                          }, [
                            isPublished.value ? (openBlock(), createBlock(unref(Calendar), {
                              key: 0,
                              class: "size-3.5 shrink-0 text-emerald-700",
                              "stroke-width": 2,
                              "aria-hidden": "true"
                            })) : createCommentVNode("", true),
                            createVNode("span", {
                              class: ["report-years-status-badge-label", isPublished.value ? "report-years-status-badge-label--published" : "report-years-status-badge-label--pending"]
                            }, toDisplayString(isPublished.value ? "Published" : "Pending"), 3),
                            isPublished.value && publishedAtLabel.value ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: "report-years-status-badge-detail report-years-status-badge-detail--published"
                            }, toDisplayString(publishedAtLabel.value), 1)) : isPublished.value ? (openBlock(), createBlock("span", {
                              key: 2,
                              class: "report-years-status-badge-detail report-years-status-badge-detail--published"
                            }, " Not set ")) : (openBlock(), createBlock("span", {
                              key: 3,
                              class: "report-years-status-badge-detail report-years-status-badge-detail--pending"
                            }, " Awaiting publication "))
                          ], 2)
                        ]),
                        createVNode(_sfc_main$2, {
                          href: _ctx.route("report-years.index"),
                          inline: ""
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Select Another Year ")
                          ]),
                          _: 1
                        }, 8, ["href"])
                      ]),
                      createVNode("h1", { class: "report-years-edit-hero-title" }, toDisplayString(displayReportTitle.value), 1),
                      createVNode("p", { class: "report-years-lede text-xs" }, " Sections may be updated in any order. Save each tab when you finish that section. Visible tabs follow your account access. ")
                    ]),
                    createVNode("div", { class: "report-years-tab-bar" }, [
                      createVNode("nav", {
                        class: "report-years-tab-nav",
                        "aria-label": "Report sections",
                        role: "tablist"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(visibleTabs.value, (tab) => {
                          return openBlock(), createBlock("button", {
                            key: tab.id,
                            type: "button",
                            role: "tab",
                            "aria-selected": activeTab.value === tab.id,
                            class: ["report-years-tab transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[0.98] active:scale-[0.95]", { "is-active": activeTab.value === tab.id, "has-recent-update": hasRecentUpdate(tab.id) }],
                            onClick: ($event) => {
                              activeTab.value = tab.id;
                              dismissRecentUpdate(tab.id);
                            }
                          }, [
                            hasRecentUpdate(tab.id) ? (openBlock(), createBlock(unref(Sparkles), {
                              key: 0,
                              class: "mr-1.5 size-3.5 text-amber-500",
                              "aria-hidden": "true"
                            })) : createCommentVNode("", true),
                            createTextVNode(" " + toDisplayString(tab.name) + " ", 1),
                            hasRecentUpdate(tab.id) ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: "ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800"
                            }, " Updated ")) : createCommentVNode("", true)
                          ], 10, ["aria-selected", "onClick"]);
                        }), 128))
                      ])
                    ])
                  ]),
                  saveNotice.value ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-xs font-medium text-amber-800",
                    role: "status",
                    "aria-live": "polite"
                  }, toDisplayString(saveNotice.value), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "w-full animate-fade-in-up delay-1" }, [
                  withDirectives(createVNode("section", {
                    class: "report-panel",
                    role: "tabpanel"
                  }, [
                    hasRecentUpdate("metadata") ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                      role: "status"
                    }, [
                      createVNode(unref(Sparkles), {
                        class: "size-4 shrink-0 text-amber-500",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", { class: "flex-1" }, "This section was recently updated by another user."),
                      createVNode("button", {
                        type: "button",
                        class: "shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]",
                        onClick: ($event) => dismissRecentUpdate("metadata")
                      }, " Dismiss ", 8, ["onClick"])
                    ])) : createCommentVNode("", true),
                    createVNode(_sfc_main$3, {
                      variant: "report",
                      title: "Metadata",
                      description: "Calendar year, publication status, and the title and description readers see for this report."
                    }),
                    createVNode("form", {
                      class: "report-form report-form--edit w-full",
                      autocomplete: "off",
                      onSubmit: withModifiers(updateMetadata, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid gap-4 sm:grid-cols-[10rem_14rem]" }, [
                        createVNode("div", { class: "grid gap-2" }, [
                          createVNode(unref(_sfc_main$4), { for: "year" }, {
                            default: withCtx(() => [
                              createTextVNode("Year")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$5), {
                            id: "year",
                            modelValue: unref(metadataForm).year,
                            "onUpdate:modelValue": ($event) => unref(metadataForm).year = $event,
                            name: "year",
                            type: "number",
                            min: unref(REPORT_YEAR_FIELD_LIMITS).yearMin,
                            max: unref(REPORT_YEAR_FIELD_LIMITS).yearMax,
                            inputmode: "numeric",
                            class: inputClass
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "min", "max"]),
                          createVNode(_sfc_main$6, {
                            message: unref(metadataForm).errors.year
                          }, null, 8, ["message"])
                        ]),
                        __props.abilities.updateFullReport ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "grid gap-2"
                        }, [
                          createVNode(unref(_sfc_main$4), { for: "status" }, {
                            default: withCtx(() => [
                              createTextVNode("Status")
                            ]),
                            _: 1
                          }),
                          withDirectives(createVNode("select", {
                            id: "status",
                            "onUpdate:modelValue": ($event) => unref(metadataForm).status = $event,
                            name: "status",
                            class: "report-select transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
                          }, [
                            createVNode("option", { value: "pending" }, "Pending"),
                            createVNode("option", { value: "published" }, "Published")
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, unref(metadataForm).status]
                          ]),
                          createVNode(_sfc_main$6, {
                            message: unref(metadataForm).errors.status
                          }, null, 8, ["message"])
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "grid gap-2"
                        }, [
                          createVNode("span", { class: "text-sm font-medium text-black" }, "Status"),
                          createVNode("p", { class: "rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-black" }, [
                            unref(metadataForm).status === "published" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "font-medium text-emerald-800"
                            }, [
                              createTextVNode(" Published"),
                              publishedAtLabel.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                createTextVNode(" · " + toDisplayString(publishedAtLabel.value), 1)
                              ], 64)) : createCommentVNode("", true)
                            ])) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "font-medium text-amber-800"
                            }, "Pending"))
                          ])
                        ]))
                      ]),
                      createVNode("div", { class: "grid gap-2" }, [
                        createVNode(unref(_sfc_main$4), { for: "title" }, {
                          default: withCtx(() => [
                            createTextVNode("Title")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$5), {
                          id: "title",
                          modelValue: unref(metadataForm).title,
                          "onUpdate:modelValue": ($event) => unref(metadataForm).title = $event,
                          name: "title",
                          type: "text",
                          placeholder: "Optional custom title",
                          maxlength: unref(REPORT_YEAR_FIELD_LIMITS).title,
                          class: inputClass
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "maxlength"]),
                        createVNode("p", { class: "text-xs text-black" }, "Up to " + toDisplayString(unref(REPORT_YEAR_FIELD_LIMITS).title) + " characters.", 1),
                        createVNode(_sfc_main$6, {
                          message: unref(metadataForm).errors.title
                        }, null, 8, ["message"])
                      ]),
                      createVNode("div", { class: "grid gap-2" }, [
                        createVNode(unref(_sfc_main$4), { for: "description" }, {
                          default: withCtx(() => [
                            createTextVNode("Description")
                          ]),
                          _: 1
                        }),
                        withDirectives(createVNode("textarea", {
                          id: "description",
                          "onUpdate:modelValue": ($event) => unref(metadataForm).description = $event,
                          name: "description",
                          rows: "4",
                          class: "report-textarea transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]",
                          maxlength: unref(REPORT_YEAR_FIELD_LIMITS).description
                        }, null, 8, ["onUpdate:modelValue", "maxlength"]), [
                          [vModelText, unref(metadataForm).description]
                        ]),
                        createVNode("p", { class: "text-xs text-black" }, toDisplayString(descriptionLength.value) + " / " + toDisplayString(unref(REPORT_YEAR_FIELD_LIMITS).description), 1),
                        createVNode(_sfc_main$6, {
                          message: unref(metadataForm).errors.description
                        }, null, 8, ["message"])
                      ]),
                      createVNode(_sfc_main$6, { message: metadataPatchError.value }, null, 8, ["message"]),
                      createVNode("div", { class: "flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2" }, [
                        createVNode(unref(_sfc_main$7), {
                          type: "submit",
                          disabled: metadataSaving.value,
                          class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Save), {
                              class: "size-4",
                              "stroke-width": 2.5,
                              "aria-hidden": "true"
                            }),
                            createTextVNode(" Save metadata ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        withDirectives(createVNode("p", { class: "report-save-hint" }, [
                          createVNode(unref(CheckCircle2), {
                            class: "size-4 shrink-0",
                            "stroke-width": 2,
                            "aria-hidden": "true"
                          }),
                          createTextVNode(" Saved ")
                        ], 512), [
                          [vShow, unref(metadataForm).recentlySuccessful]
                        ])
                      ])
                    ], 32)
                  ], 512), [
                    [vShow, activeTab.value === "metadata"]
                  ]),
                  withDirectives(createVNode("section", {
                    class: "report-panel",
                    role: "tabpanel"
                  }, [
                    hasRecentUpdate("gfps_membership") ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                      role: "status"
                    }, [
                      createVNode(unref(Sparkles), {
                        class: "size-4 shrink-0 text-amber-500",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", { class: "flex-1" }, "This section was recently updated by another user."),
                      createVNode("button", {
                        type: "button",
                        class: "shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]",
                        onClick: ($event) => dismissRecentUpdate("gfps_membership")
                      }, " Dismiss ", 8, ["onClick"])
                    ])) : createCommentVNode("", true),
                    createVNode(_sfc_main$3, {
                      variant: "report",
                      title: "GFPS membership",
                      description: "Total GFPS members by sex for this reporting year. Use whole numbers only."
                    }),
                    createVNode("form", {
                      class: "report-form report-form--edit w-full",
                      onSubmit: withModifiers(updateGfpsMembership, ["prevent"])
                    }, [
                      createVNode("div", { class: "rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 shadow-sm" }, [
                        createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                          createVNode("div", { class: "grid gap-2" }, [
                            createVNode(unref(_sfc_main$4), { for: "gfps_female_count" }, {
                              default: withCtx(() => [
                                createTextVNode("Female")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$5), {
                              id: "gfps_female_count",
                              modelValue: unref(gfpsMembershipForm).female_count,
                              "onUpdate:modelValue": ($event) => unref(gfpsMembershipForm).female_count = $event,
                              type: "number",
                              min: "0",
                              inputmode: "numeric",
                              class: inputClass
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_sfc_main$6, {
                              message: unref(gfpsMembershipForm).errors.female_count
                            }, null, 8, ["message"])
                          ]),
                          createVNode("div", { class: "grid gap-2" }, [
                            createVNode(unref(_sfc_main$4), { for: "gfps_male_count" }, {
                              default: withCtx(() => [
                                createTextVNode("Male")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$5), {
                              id: "gfps_male_count",
                              modelValue: unref(gfpsMembershipForm).male_count,
                              "onUpdate:modelValue": ($event) => unref(gfpsMembershipForm).male_count = $event,
                              type: "number",
                              min: "0",
                              inputmode: "numeric",
                              class: inputClass
                            }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                            createVNode(_sfc_main$6, {
                              message: unref(gfpsMembershipForm).errors.male_count
                            }, null, 8, ["message"])
                          ])
                        ]),
                        createVNode("p", { class: "mt-1 max-w-md text-xs text-black" }, [
                          createTextVNode(" Total members: "),
                          createVNode("span", { class: "font-medium text-black tabular-nums" }, toDisplayString(gfpsMembershipTotal.value), 1)
                        ])
                      ]),
                      createVNode("div", { class: "flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2" }, [
                        createVNode(unref(_sfc_main$7), {
                          type: "submit",
                          class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                          disabled: unref(gfpsMembershipForm).processing
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Save), {
                              class: "size-4",
                              "stroke-width": 2.5,
                              "aria-hidden": "true"
                            }),
                            createTextVNode(" Save GFPS membership ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        withDirectives(createVNode("p", { class: "report-save-hint" }, [
                          createVNode(unref(CheckCircle2), {
                            class: "size-4 shrink-0",
                            "stroke-width": 2,
                            "aria-hidden": "true"
                          }),
                          createTextVNode(" Saved ")
                        ], 512), [
                          [vShow, unref(gfpsMembershipForm).recentlySuccessful]
                        ])
                      ])
                    ], 32)
                  ], 512), [
                    [vShow, activeTab.value === "gfps_membership"]
                  ]),
                  withDirectives(createVNode("section", {
                    class: "report-panel",
                    role: "tabpanel"
                  }, [
                    hasRecentUpdate("scholarship") ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                      role: "status"
                    }, [
                      createVNode(unref(Sparkles), {
                        class: "size-4 shrink-0 text-amber-500",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", { class: "flex-1" }, "This section was recently updated by another user."),
                      createVNode("button", {
                        type: "button",
                        class: "shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]",
                        onClick: ($event) => dismissRecentUpdate("scholarship")
                      }, " Dismiss ", 8, ["onClick"])
                    ])) : createCommentVNode("", true),
                    createVNode(_sfc_main$3, {
                      variant: "report",
                      title: "Scholarship",
                      description: "Track scholar counts across the year. Each update is saved as a separate snapshot — previous data is always preserved."
                    }),
                    createVNode(Transition, {
                      name: "fade-slide",
                      mode: "out-in"
                    }, {
                      default: withCtx(() => [
                        !showAddForm.value ? (openBlock(), createBlock("div", {
                          key: "btn",
                          class: "mt-6 mb-6"
                        }, [
                          createVNode(unref(_sfc_main$7), {
                            type: "button",
                            variant: "outline",
                            class: "flex items-center gap-2 border-emerald-200 bg-emerald-50/20 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                            onClick: ($event) => showAddForm.value = true
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Plus), {
                                class: "size-4 text-emerald-600 animate-pulse",
                                "aria-hidden": "true"
                              }),
                              createVNode("span", null, "Add New Snapshot")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])) : (openBlock(), createBlock("form", {
                          key: "form",
                          class: "report-form report-form--edit w-full mb-6 border border-zinc-200 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mt-6 transition-[transform,background-color,border-color,color] duration-200 ease-out",
                          onSubmit: withModifiers(storeScholarshipSnapshot, ["prevent"])
                        }, [
                          createVNode("div", { class: "mb-4 flex items-center justify-between gap-2 border-b border-zinc-200 pb-3" }, [
                            createVNode("div", { class: "flex items-center gap-2" }, [
                              createVNode(unref(Plus), {
                                class: "size-4 text-emerald-600",
                                "aria-hidden": "true"
                              }),
                              createVNode("span", { class: "text-sm font-semibold text-zinc-900" }, "Add New Snapshot")
                            ]),
                            createVNode("button", {
                              type: "button",
                              class: "text-xs text-zinc-400 hover:text-zinc-700 underline transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                              onClick: ($event) => showAddForm.value = false
                            }, " Cancel ", 8, ["onClick"])
                          ]),
                          createVNode("div", { class: "grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] mt-6" }, [
                            createVNode("div", { class: "grid gap-2" }, [
                              createVNode(unref(_sfc_main$4), { for: "new_school_year_id" }, {
                                default: withCtx(() => [
                                  createTextVNode("School year")
                                ]),
                                _: 1
                              }),
                              withDirectives(createVNode("select", {
                                id: "new_school_year_id",
                                "onUpdate:modelValue": ($event) => unref(newSnapshotForm).school_year_id = $event,
                                class: "report-select transition-all hover:border-zinc-300 focus:border-zinc-400"
                              }, [
                                createVNode("option", {
                                  value: "",
                                  disabled: ""
                                }, "Select school year…"),
                                (openBlock(true), createBlock(Fragment, null, renderList(__props.schoolYears, (sy) => {
                                  return openBlock(), createBlock("option", {
                                    key: sy.id,
                                    value: sy.id
                                  }, toDisplayString(sy.label), 9, ["value"]);
                                }), 128))
                              ], 8, ["onUpdate:modelValue"]), [
                                [vModelSelect, unref(newSnapshotForm).school_year_id]
                              ]),
                              createVNode(_sfc_main$6, {
                                message: unref(newSnapshotForm).errors.school_year_id
                              }, null, 8, ["message"])
                            ]),
                            createVNode("div", { class: "grid gap-2" }, [
                              createVNode(unref(_sfc_main$4), { for: "new_as_of_date" }, {
                                default: withCtx(() => [
                                  createTextVNode("As of date")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$5), {
                                id: "new_as_of_date",
                                modelValue: unref(newSnapshotForm).as_of_date,
                                "onUpdate:modelValue": ($event) => unref(newSnapshotForm).as_of_date = $event,
                                type: "date",
                                max: unref(todayDate),
                                class: inputClass
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "max"]),
                              createVNode(_sfc_main$6, {
                                message: unref(newSnapshotForm).errors.as_of_date
                              }, null, 8, ["message"])
                            ])
                          ]),
                          createVNode("div", { class: "rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 mt-6 shadow-sm" }, [
                            createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                              createVNode("div", { class: "grid gap-2" }, [
                                createVNode(unref(_sfc_main$4), { for: "new_female_count" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Female")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$5), {
                                  id: "new_female_count",
                                  modelValue: unref(newSnapshotForm).female_count,
                                  "onUpdate:modelValue": ($event) => unref(newSnapshotForm).female_count = $event,
                                  type: "number",
                                  min: "0",
                                  inputmode: "numeric",
                                  class: inputClass
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(_sfc_main$6, {
                                  message: unref(newSnapshotForm).errors.female_count
                                }, null, 8, ["message"])
                              ]),
                              createVNode("div", { class: "grid gap-2" }, [
                                createVNode(unref(_sfc_main$4), { for: "new_male_count" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Male")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$5), {
                                  id: "new_male_count",
                                  modelValue: unref(newSnapshotForm).male_count,
                                  "onUpdate:modelValue": ($event) => unref(newSnapshotForm).male_count = $event,
                                  type: "number",
                                  min: "0",
                                  inputmode: "numeric",
                                  class: inputClass
                                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                                createVNode(_sfc_main$6, {
                                  message: unref(newSnapshotForm).errors.male_count
                                }, null, 8, ["message"])
                              ])
                            ]),
                            createVNode("div", { class: "mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm" }, [
                              createVNode("span", { class: "text-zinc-500 font-medium" }, "Total Scholars"),
                              createVNode("span", { class: "rounded-lg bg-zinc-950 px-3 py-1 font-mono text-xs font-semibold text-white tabular-nums" }, toDisplayString(newSnapshotTotal.value), 1)
                            ])
                          ]),
                          createVNode("div", { class: "flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-4 mt-6" }, [
                            createVNode(unref(_sfc_main$7), {
                              type: "submit",
                              class: "report-save-btn flex items-center gap-2 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                              disabled: unref(newSnapshotForm).processing
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(Plus), {
                                  class: "size-4",
                                  "stroke-width": 2.5,
                                  "aria-hidden": "true"
                                }),
                                createTextVNode(" Save new snapshot ")
                              ]),
                              _: 1
                            }, 8, ["disabled"]),
                            createVNode(unref(_sfc_main$7), {
                              type: "button",
                              variant: "ghost",
                              class: "text-zinc-500 hover:text-zinc-800 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                              onClick: ($event) => showAddForm.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Cancel ")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            withDirectives(createVNode("p", { class: "report-save-hint" }, [
                              createVNode(unref(CheckCircle2), {
                                class: "size-4 shrink-0 text-emerald-600",
                                "stroke-width": 2,
                                "aria-hidden": "true"
                              }),
                              createTextVNode(" Saved ")
                            ], 512), [
                              [vShow, unref(newSnapshotForm).recentlySuccessful]
                            ])
                          ])
                        ], 32))
                      ]),
                      _: 1
                    }),
                    __props.reportYear.scholarshipSnapshots.length > 0 ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "mt-8"
                    }, [
                      createVNode("div", { class: "mb-4 flex items-center gap-2" }, [
                        createVNode("span", { class: "text-sm font-semibold text-zinc-900" }, "Snapshot History"),
                        createVNode("span", { class: "rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-700" }, toDisplayString(__props.reportYear.scholarshipSnapshots.length), 1)
                      ]),
                      createVNode("div", { class: "relative pl-6 border-l border-zinc-200 ml-3 space-y-6" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.reportYear.scholarshipSnapshots, (snap, index) => {
                          return openBlock(), createBlock("div", {
                            key: snap.id,
                            class: ["relative rounded-2xl border p-5 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-zinc-300 hover:shadow-sm hover:-translate-y-0.5", index === 0 ? "border-emerald-200 bg-emerald-50/30 shadow-[0_8px_30px_rgb(0,0,0,0.01)]" : "border-zinc-200 bg-white"]
                          }, [
                            createVNode("div", {
                              class: ["absolute -left-[33px] top-[26px] flex h-4 w-4 items-center justify-center rounded-full bg-white border-2", index === 0 ? "border-emerald-500" : "border-zinc-300"]
                            }, [
                              createVNode("div", {
                                class: ["h-1.5 w-1.5 rounded-full", index === 0 ? "bg-emerald-500 animate-pulse" : "bg-zinc-300"]
                              }, null, 2)
                            ], 2),
                            editingSnapshotId.value !== snap.id ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex items-start justify-between gap-4"
                            }, [
                              createVNode("div", { class: "min-w-0 flex-1" }, [
                                createVNode("div", { class: "flex items-center gap-2 flex-wrap" }, [
                                  createVNode("span", { class: "text-sm font-semibold text-zinc-900" }, " As of " + toDisplayString(snap.asOfDate ?? "No date"), 1),
                                  index === 0 ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800"
                                  }, " Latest Snapshot ")) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "mt-2 text-xs text-zinc-600 flex flex-wrap gap-x-4 gap-y-1" }, [
                                  createVNode("span", null, [
                                    createTextVNode("School Year: "),
                                    createVNode("span", { class: "font-medium text-zinc-900" }, toDisplayString(snap.schoolYearLabel || "No school year"), 1)
                                  ]),
                                  createVNode("span", null, [
                                    createTextVNode("F: "),
                                    createVNode("span", { class: "font-semibold text-zinc-950 font-mono tabular-nums" }, toDisplayString(snap.femaleCount ?? 0), 1)
                                  ]),
                                  createVNode("span", null, [
                                    createTextVNode("M: "),
                                    createVNode("span", { class: "font-semibold text-zinc-950 font-mono tabular-nums" }, toDisplayString(snap.maleCount ?? 0), 1)
                                  ]),
                                  createVNode("span", { class: "font-medium text-zinc-900" }, [
                                    createTextVNode("Total: "),
                                    createVNode("span", { class: "font-bold text-zinc-950 font-mono tabular-nums" }, toDisplayString(Number(snap.femaleCount ?? 0) + Number(snap.maleCount ?? 0)), 1)
                                  ])
                                ]),
                                createVNode("p", { class: "mt-2 text-[10px] text-zinc-400 flex items-center gap-1.5" }, [
                                  createVNode(unref(Calendar), { class: "size-3 text-zinc-400" }),
                                  createVNode("span", null, "Added " + toDisplayString(snap.createdAt ? new Date(snap.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : "unknown"), 1),
                                  snap.lastEditedBy ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                    createVNode("span", null, "·"),
                                    createVNode("span", null, [
                                      createTextVNode("Last edited by "),
                                      createVNode("span", { class: "font-medium text-zinc-600" }, toDisplayString(snap.lastEditedBy), 1)
                                    ]),
                                    snap.lastEditedAt ? (openBlock(), createBlock("span", { key: 0 }, "on " + toDisplayString(new Date(snap.lastEditedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric" })), 1)) : createCommentVNode("", true)
                                  ], 64)) : createCommentVNode("", true)
                                ])
                              ]),
                              createVNode("div", { class: "flex shrink-0 items-center gap-1.5" }, [
                                __props.abilities.updateScholarship ? (openBlock(), createBlock("button", {
                                  key: 0,
                                  type: "button",
                                  class: "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                                  onClick: ($event) => startEditSnapshot(snap)
                                }, [
                                  createVNode(unref(Pencil), {
                                    class: "size-3.5",
                                    "aria-hidden": "true"
                                  }),
                                  createTextVNode(" Edit ")
                                ], 8, ["onClick"])) : createCommentVNode("", true),
                                __props.abilities.deleteScholarship ? (openBlock(), createBlock("button", {
                                  key: 1,
                                  type: "button",
                                  class: "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                                  onClick: ($event) => deleteScholarshipSnapshot(snap.id)
                                }, [
                                  createVNode(unref(Trash2), {
                                    class: "size-3.5",
                                    "aria-hidden": "true"
                                  }),
                                  createTextVNode(" Delete ")
                                ], 8, ["onClick"])) : createCommentVNode("", true)
                              ])
                            ])) : (openBlock(), createBlock("form", {
                              key: 1,
                              onSubmit: withModifiers(($event) => saveEditSnapshot(snap.id), ["prevent"]),
                              class: "space-y-4"
                            }, [
                              createVNode("div", { class: "mb-2 flex items-center justify-between gap-2 border-b border-zinc-200/80 pb-2" }, [
                                createVNode("span", { class: "text-sm font-semibold text-zinc-900 flex items-center gap-2" }, [
                                  createVNode(unref(Pencil), {
                                    class: "size-4 text-zinc-500",
                                    "aria-hidden": "true"
                                  }),
                                  createTextVNode(" Editing Snapshot ")
                                ]),
                                createVNode("button", {
                                  type: "button",
                                  class: "text-zinc-400 hover:text-zinc-700 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.95]",
                                  onClick: cancelEditSnapshot
                                }, [
                                  createVNode(unref(X), { class: "size-4" })
                                ])
                              ]),
                              createVNode("div", { class: "grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem] mt-4" }, [
                                createVNode("div", { class: "grid gap-2" }, [
                                  createVNode(unref(_sfc_main$4), {
                                    for: `edit_school_year_${snap.id}`
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("School year")
                                    ]),
                                    _: 1
                                  }, 8, ["for"]),
                                  withDirectives(createVNode("select", {
                                    id: `edit_school_year_${snap.id}`,
                                    "onUpdate:modelValue": ($event) => unref(editSnapshotForm).school_year_id = $event,
                                    class: "report-select transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
                                  }, [
                                    createVNode("option", {
                                      value: "",
                                      disabled: ""
                                    }, "Select school year…"),
                                    (openBlock(true), createBlock(Fragment, null, renderList(__props.schoolYears, (sy) => {
                                      return openBlock(), createBlock("option", {
                                        key: sy.id,
                                        value: sy.id
                                      }, toDisplayString(sy.label), 9, ["value"]);
                                    }), 128))
                                  ], 8, ["id", "onUpdate:modelValue"]), [
                                    [vModelSelect, unref(editSnapshotForm).school_year_id]
                                  ]),
                                  createVNode(_sfc_main$6, {
                                    message: unref(editSnapshotForm).errors.school_year_id
                                  }, null, 8, ["message"])
                                ]),
                                createVNode("div", { class: "grid gap-2" }, [
                                  createVNode(unref(_sfc_main$4), {
                                    for: `edit_as_of_date_${snap.id}`
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("As of date")
                                    ]),
                                    _: 1
                                  }, 8, ["for"]),
                                  createVNode(unref(_sfc_main$5), {
                                    id: `edit_as_of_date_${snap.id}`,
                                    modelValue: unref(editSnapshotForm).as_of_date,
                                    "onUpdate:modelValue": ($event) => unref(editSnapshotForm).as_of_date = $event,
                                    type: "date",
                                    max: unref(todayDate),
                                    class: inputClass
                                  }, null, 8, ["id", "modelValue", "onUpdate:modelValue", "max"]),
                                  createVNode(_sfc_main$6, {
                                    message: unref(editSnapshotForm).errors.as_of_date
                                  }, null, 8, ["message"])
                                ])
                              ]),
                              createVNode("div", { class: "rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 mt-4" }, [
                                createVNode("div", { class: "grid gap-4 sm:grid-cols-2" }, [
                                  createVNode("div", { class: "grid gap-2" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `edit_female_${snap.id}`
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Female")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `edit_female_${snap.id}`,
                                      modelValue: unref(editSnapshotForm).female_count,
                                      "onUpdate:modelValue": ($event) => unref(editSnapshotForm).female_count = $event,
                                      type: "number",
                                      min: "0",
                                      inputmode: "numeric",
                                      class: inputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"]),
                                    createVNode(_sfc_main$6, {
                                      message: unref(editSnapshotForm).errors.female_count
                                    }, null, 8, ["message"])
                                  ]),
                                  createVNode("div", { class: "grid gap-2" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `edit_male_${snap.id}`
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Male")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `edit_male_${snap.id}`,
                                      modelValue: unref(editSnapshotForm).male_count,
                                      "onUpdate:modelValue": ($event) => unref(editSnapshotForm).male_count = $event,
                                      type: "number",
                                      min: "0",
                                      inputmode: "numeric",
                                      class: inputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"]),
                                    createVNode(_sfc_main$6, {
                                      message: unref(editSnapshotForm).errors.male_count
                                    }, null, 8, ["message"])
                                  ])
                                ]),
                                createVNode("div", { class: "mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm" }, [
                                  createVNode("span", { class: "text-zinc-500 font-medium" }, "Total Scholars"),
                                  createVNode("span", { class: "rounded-lg bg-zinc-950 px-3 py-1 font-mono text-xs font-semibold text-white tabular-nums" }, toDisplayString(editSnapshotTotal.value), 1)
                                ])
                              ]),
                              createVNode("div", { class: "flex flex-wrap items-center gap-3 border-zinc-200/80 border-t pt-4 mt-6" }, [
                                createVNode(unref(_sfc_main$7), {
                                  type: "submit",
                                  class: "report-save-btn active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                                  disabled: unref(editSnapshotForm).processing
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Save), {
                                      class: "size-4",
                                      "stroke-width": 2.5,
                                      "aria-hidden": "true"
                                    }),
                                    createTextVNode(" Save changes ")
                                  ]),
                                  _: 1
                                }, 8, ["disabled"]),
                                createVNode(unref(_sfc_main$7), {
                                  type: "button",
                                  variant: "ghost",
                                  class: "text-zinc-500 hover:text-zinc-800 active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                                  onClick: cancelEditSnapshot
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Cancel ")
                                  ]),
                                  _: 1
                                })
                              ])
                            ], 40, ["onSubmit"]))
                          ], 2);
                        }), 128))
                      ])
                    ])) : (openBlock(), createBlock("div", {
                      key: 2,
                      class: "mt-6 rounded-2xl border border-dashed border-zinc-200 p-8 text-center bg-zinc-50/20"
                    }, [
                      createVNode(unref(Calendar), { class: "size-8 text-zinc-400 mx-auto mb-3" }),
                      createVNode("h4", { class: "text-sm font-semibold text-zinc-900" }, "No snapshots recorded"),
                      createVNode("p", { class: "mt-1 text-xs text-zinc-500 max-w-sm mx-auto" }, ' No scholarship data snapshots have been added for this year yet. Click "Add New Snapshot" above to create the first record. ')
                    ]))
                  ], 512), [
                    [vShow, activeTab.value === "scholarship"]
                  ]),
                  withDirectives(createVNode("section", {
                    class: "report-panel",
                    role: "tabpanel"
                  }, [
                    hasRecentUpdate("gfps_assemblies") ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                      role: "status"
                    }, [
                      createVNode(unref(Sparkles), {
                        class: "size-4 shrink-0 text-amber-500",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", { class: "flex-1" }, "This section was recently updated by another user."),
                      createVNode("button", {
                        type: "button",
                        class: "shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]",
                        onClick: ($event) => dismissRecentUpdate("gfps_assemblies")
                      }, " Dismiss ", 8, ["onClick"])
                    ])) : createCommentVNode("", true),
                    createVNode(_sfc_main$3, {
                      variant: "report",
                      title: "GFPS assemblies",
                      description: "Attendance by assembly period. Enter headcounts by sex for each row."
                    }),
                    createVNode("form", {
                      class: "report-form report-form--edit w-full",
                      onSubmit: withModifiers(updateGfpsAssemblies, ["prevent"])
                    }, [
                      createVNode("div", { class: "report-years-data-table" }, [
                        createVNode("div", { class: "report-years-data-head report-years-data-head--3col" }, [
                          createVNode("span", { class: "report-years-data-head-label" }, "Period"),
                          createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Female"),
                          createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Male")
                        ]),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(gfpsAssembliesForm).attendances, (row, index) => {
                          return openBlock(), createBlock("div", {
                            key: row.period_id,
                            class: "report-years-data-row report-years-data-row--3col"
                          }, [
                            createVNode("div", { class: "report-years-data-row-label" }, toDisplayString(__props.reportYear.gfpsAssemblies[index]?.label), 1),
                            createVNode("div", { class: "report-years-data-cell" }, [
                              createVNode(unref(_sfc_main$4), {
                                for: `gfps_assembly_female_${row.period_id}`,
                                class: "report-years-data-cell-label md:sr-only"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Female count")
                                ]),
                                _: 1
                              }, 8, ["for"]),
                              createVNode(unref(_sfc_main$5), {
                                id: `gfps_assembly_female_${row.period_id}`,
                                modelValue: row.female_count,
                                "onUpdate:modelValue": ($event) => row.female_count = $event,
                                type: "number",
                                min: "0",
                                inputmode: "numeric",
                                class: tableInputClass
                              }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "report-years-data-cell" }, [
                              createVNode(unref(_sfc_main$4), {
                                for: `gfps_assembly_male_${row.period_id}`,
                                class: "report-years-data-cell-label md:sr-only"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Male count")
                                ]),
                                _: 1
                              }, 8, ["for"]),
                              createVNode(unref(_sfc_main$5), {
                                id: `gfps_assembly_male_${row.period_id}`,
                                modelValue: row.male_count,
                                "onUpdate:modelValue": ($event) => row.male_count = $event,
                                type: "number",
                                min: "0",
                                inputmode: "numeric",
                                class: tableInputClass
                              }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                            ])
                          ]);
                        }), 128))
                      ]),
                      createVNode(_sfc_main$6, {
                        message: unref(gfpsAssembliesForm).errors.attendances
                      }, null, 8, ["message"]),
                      createVNode("div", { class: "report-years-form-actions" }, [
                        createVNode(unref(_sfc_main$7), {
                          type: "submit",
                          class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                          disabled: unref(gfpsAssembliesForm).processing
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Save), {
                              class: "size-4",
                              "stroke-width": 2.5,
                              "aria-hidden": "true"
                            }),
                            createTextVNode(" Save assemblies ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        withDirectives(createVNode("p", { class: "report-save-hint" }, [
                          createVNode(unref(CheckCircle2), {
                            class: "size-4 shrink-0",
                            "stroke-width": 2,
                            "aria-hidden": "true"
                          }),
                          createTextVNode(" Saved ")
                        ], 512), [
                          [vShow, unref(gfpsAssembliesForm).recentlySuccessful]
                        ])
                      ])
                    ], 32)
                  ], 512), [
                    [vShow, activeTab.value === "gfps_assemblies"]
                  ]),
                  withDirectives(createVNode("section", {
                    class: "report-panel",
                    role: "tabpanel"
                  }, [
                    hasRecentUpdate("employee_status") ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                      role: "status"
                    }, [
                      createVNode(unref(Sparkles), {
                        class: "size-4 shrink-0 text-amber-500",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", { class: "flex-1" }, "This section was recently updated by another user."),
                      createVNode("button", {
                        type: "button",
                        class: "shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]",
                        onClick: ($event) => dismissRecentUpdate("employee_status")
                      }, " Dismiss ", 8, ["onClick"])
                    ])) : createCommentVNode("", true),
                    createVNode(_sfc_main$3, {
                      variant: "report",
                      title: "Employee status",
                      description: "Workforce headcounts by employment status and sex. Use the same definitions as HR records."
                    }),
                    createVNode("form", {
                      class: "report-form report-form--edit w-full",
                      onSubmit: withModifiers(updateEmployeeStatuses, ["prevent"])
                    }, [
                      createVNode("div", { class: "report-years-data-table" }, [
                        createVNode("div", { class: "report-years-data-head report-years-data-head--3col" }, [
                          createVNode("span", { class: "report-years-data-head-label" }, "Employment status"),
                          createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Female"),
                          createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Male")
                        ]),
                        (openBlock(true), createBlock(Fragment, null, renderList(unref(employeeStatusesForm).breakdowns, (row, index) => {
                          return openBlock(), createBlock("div", {
                            key: row.employment_status_id,
                            class: "report-years-data-row report-years-data-row--3col"
                          }, [
                            createVNode("div", { class: "report-years-data-row-label" }, toDisplayString(__props.reportYear.employeeStatuses[index]?.label), 1),
                            createVNode("div", { class: "report-years-data-cell" }, [
                              createVNode(unref(_sfc_main$4), {
                                for: `employee_female_${row.employment_status_id}`,
                                class: "report-years-data-cell-label md:sr-only"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Female count")
                                ]),
                                _: 1
                              }, 8, ["for"]),
                              createVNode(unref(_sfc_main$5), {
                                id: `employee_female_${row.employment_status_id}`,
                                modelValue: row.female_count,
                                "onUpdate:modelValue": ($event) => row.female_count = $event,
                                type: "number",
                                min: "0",
                                inputmode: "numeric",
                                class: tableInputClass
                              }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "report-years-data-cell" }, [
                              createVNode(unref(_sfc_main$4), {
                                for: `employee_male_${row.employment_status_id}`,
                                class: "report-years-data-cell-label md:sr-only"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Male count")
                                ]),
                                _: 1
                              }, 8, ["for"]),
                              createVNode(unref(_sfc_main$5), {
                                id: `employee_male_${row.employment_status_id}`,
                                modelValue: row.male_count,
                                "onUpdate:modelValue": ($event) => row.male_count = $event,
                                type: "number",
                                min: "0",
                                inputmode: "numeric",
                                class: tableInputClass
                              }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                            ])
                          ]);
                        }), 128))
                      ]),
                      createVNode(_sfc_main$6, {
                        message: unref(employeeStatusesForm).errors.breakdowns
                      }, null, 8, ["message"]),
                      createVNode("div", { class: "report-years-form-actions" }, [
                        createVNode(unref(_sfc_main$7), {
                          type: "submit",
                          class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                          disabled: unref(employeeStatusesForm).processing
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Save), {
                              class: "size-4",
                              "stroke-width": 2.5,
                              "aria-hidden": "true"
                            }),
                            createTextVNode(" Save employee status ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        withDirectives(createVNode("p", { class: "report-save-hint" }, [
                          createVNode(unref(CheckCircle2), {
                            class: "size-4 shrink-0",
                            "stroke-width": 2,
                            "aria-hidden": "true"
                          }),
                          createTextVNode(" Saved ")
                        ], 512), [
                          [vShow, unref(employeeStatusesForm).recentlySuccessful]
                        ])
                      ])
                    ], 32)
                  ], 512), [
                    [vShow, activeTab.value === "employee_status"]
                  ]),
                  withDirectives(createVNode("section", {
                    class: "report-panel",
                    role: "tabpanel"
                  }, [
                    hasRecentUpdate("rstl_monthly") ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                      role: "status"
                    }, [
                      createVNode(unref(Sparkles), {
                        class: "size-4 shrink-0 text-amber-500",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", { class: "flex-1" }, "This section was recently updated by another user."),
                      createVNode("button", {
                        type: "button",
                        class: "shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]",
                        onClick: ($event) => dismissRecentUpdate("rstl_monthly")
                      }, " Dismiss ", 8, ["onClick"])
                    ])) : createCommentVNode("", true),
                    createVNode(_sfc_main$3, {
                      variant: "report",
                      title: "RSTL by month",
                      description: "Monthly RSTL activity: clients or visits by sex, plus female-led and male-led counts. Scroll horizontally on small screens if the column labels do not fit."
                    }),
                    createVNode("form", {
                      class: "report-form report-form--edit w-full",
                      onSubmit: withModifiers(updateRstlMonthly, ["prevent"])
                    }, [
                      createVNode("div", { class: "report-years-data-table-scroll" }, [
                        createVNode("div", { class: "report-years-data-table report-years-data-table--wide report-years-data-table--rstl" }, [
                          createVNode("div", { class: "report-years-data-head report-years-data-head--5col" }, [
                            createVNode("span", { class: "report-years-data-head-label" }, "Month"),
                            createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Female"),
                            createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Female-led"),
                            createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Male"),
                            createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Male-led")
                          ]),
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(rstlForm).breakdowns, (row, index) => {
                            return openBlock(), createBlock("div", {
                              key: row.report_month_id,
                              class: "report-years-data-row report-years-data-row--5col"
                            }, [
                              createVNode("div", { class: "report-years-data-row-label" }, toDisplayString(__props.reportYear.rstlMonthly[index]?.label), 1),
                              createVNode("div", { class: "report-years-data-cell" }, [
                                createVNode(unref(_sfc_main$4), {
                                  for: `rstl_female_${row.report_month_id}`,
                                  class: "report-years-data-cell-label md:sr-only"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Female")
                                  ]),
                                  _: 1
                                }, 8, ["for"]),
                                createVNode(unref(_sfc_main$5), {
                                  id: `rstl_female_${row.report_month_id}`,
                                  modelValue: row.female_count,
                                  "onUpdate:modelValue": ($event) => row.female_count = $event,
                                  type: "number",
                                  min: "0",
                                  inputmode: "numeric",
                                  class: tableInputClass
                                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode("div", { class: "report-years-data-cell" }, [
                                createVNode(unref(_sfc_main$4), {
                                  for: `rstl_female_led_${row.report_month_id}`,
                                  class: "report-years-data-cell-label md:sr-only"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Female-led")
                                  ]),
                                  _: 1
                                }, 8, ["for"]),
                                createVNode(unref(_sfc_main$5), {
                                  id: `rstl_female_led_${row.report_month_id}`,
                                  modelValue: row.female_led_count,
                                  "onUpdate:modelValue": ($event) => row.female_led_count = $event,
                                  type: "number",
                                  min: "0",
                                  inputmode: "numeric",
                                  class: tableInputClass
                                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode("div", { class: "report-years-data-cell" }, [
                                createVNode(unref(_sfc_main$4), {
                                  for: `rstl_male_${row.report_month_id}`,
                                  class: "report-years-data-cell-label md:sr-only"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Male")
                                  ]),
                                  _: 1
                                }, 8, ["for"]),
                                createVNode(unref(_sfc_main$5), {
                                  id: `rstl_male_${row.report_month_id}`,
                                  modelValue: row.male_count,
                                  "onUpdate:modelValue": ($event) => row.male_count = $event,
                                  type: "number",
                                  min: "0",
                                  inputmode: "numeric",
                                  class: tableInputClass
                                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                              ]),
                              createVNode("div", { class: "report-years-data-cell" }, [
                                createVNode(unref(_sfc_main$4), {
                                  for: `rstl_male_led_${row.report_month_id}`,
                                  class: "report-years-data-cell-label md:sr-only"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Male-led")
                                  ]),
                                  _: 1
                                }, 8, ["for"]),
                                createVNode(unref(_sfc_main$5), {
                                  id: `rstl_male_led_${row.report_month_id}`,
                                  modelValue: row.male_led_count,
                                  "onUpdate:modelValue": ($event) => row.male_led_count = $event,
                                  type: "number",
                                  min: "0",
                                  inputmode: "numeric",
                                  class: tableInputClass
                                }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                              ])
                            ]);
                          }), 128))
                        ])
                      ]),
                      createVNode(_sfc_main$6, {
                        message: unref(rstlForm).errors.breakdowns
                      }, null, 8, ["message"]),
                      createVNode("div", { class: "report-years-form-actions" }, [
                        createVNode(unref(_sfc_main$7), {
                          type: "submit",
                          class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                          disabled: unref(rstlForm).processing
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Save), {
                              class: "size-4",
                              "stroke-width": 2.5,
                              "aria-hidden": "true"
                            }),
                            createTextVNode(" Save RSTL ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        withDirectives(createVNode("p", { class: "report-save-hint" }, [
                          createVNode(unref(CheckCircle2), {
                            class: "size-4 shrink-0",
                            "stroke-width": 2,
                            "aria-hidden": "true"
                          }),
                          createTextVNode(" Saved ")
                        ], 512), [
                          [vShow, unref(rstlForm).recentlySuccessful]
                        ])
                      ])
                    ], 32)
                  ], 512), [
                    [vShow, activeTab.value === "rstl_monthly"]
                  ]),
                  withDirectives(createVNode("section", {
                    class: "report-panel",
                    role: "tabpanel"
                  }, [
                    hasRecentUpdate("program_funding") ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800",
                      role: "status"
                    }, [
                      createVNode(unref(Sparkles), {
                        class: "size-4 shrink-0 text-amber-500",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", { class: "flex-1" }, "This section was recently updated by another user."),
                      createVNode("button", {
                        type: "button",
                        class: "shrink-0 text-amber-700 underline hover:text-amber-900 transition-all duration-300 active:scale-[0.95]",
                        onClick: ($event) => dismissRecentUpdate("program_funding")
                      }, " Dismiss ", 8, ["onClick"])
                    ])) : createCommentVNode("", true),
                    createVNode(_sfc_main$3, {
                      variant: "report",
                      title: "Program funding",
                      description: "Projects and funding amounts by program, split by sex. Amounts use your organization’s currency; enter decimals as needed."
                    }),
                    createVNode("form", {
                      class: "report-form report-form--edit w-full",
                      onSubmit: withModifiers(updateProgramFunding, ["prevent"])
                    }, [
                      createVNode("div", { class: "space-y-6" }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("p", { class: "text-xs font-semibold tracking-wide text-foreground uppercase" }, "SETUP"),
                          createVNode("div", { class: "report-years-data-table-scroll" }, [
                            createVNode("div", { class: "report-years-data-table report-years-data-table--wide report-years-data-table--funding" }, [
                              createVNode("div", { class: "report-years-data-head report-years-data-head--funding" }, [
                                createVNode("span", { class: "report-years-data-head-label" }, "Program"),
                                createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Female projects"),
                                createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Female amount"),
                                createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Male projects"),
                                createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Male amount")
                              ]),
                              (openBlock(true), createBlock(Fragment, null, renderList(setupFundingRows.value, (item) => {
                                return openBlock(), createBlock("div", {
                                  key: item.row.funding_program_id,
                                  class: "report-years-data-row report-years-data-row--funding"
                                }, [
                                  createVNode("div", { class: "report-years-data-row-label" }, toDisplayString(item.label), 1),
                                  createVNode("div", { class: "report-years-data-cell" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `funding_female_projects_${item.row.funding_program_id}`,
                                      class: "report-years-data-cell-label md:sr-only"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Female projects")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `funding_female_projects_${item.row.funding_program_id}`,
                                      modelValue: item.row.female_projects,
                                      "onUpdate:modelValue": ($event) => item.row.female_projects = $event,
                                      type: "number",
                                      min: "0",
                                      inputmode: "numeric",
                                      class: tableInputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", { class: "report-years-data-cell" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `funding_female_amount_${item.row.funding_program_id}`,
                                      class: "report-years-data-cell-label md:sr-only"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Female amount")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `funding_female_amount_${item.row.funding_program_id}`,
                                      modelValue: item.row.female_amount,
                                      "onUpdate:modelValue": ($event) => item.row.female_amount = $event,
                                      type: "number",
                                      min: "0",
                                      step: "0.01",
                                      inputmode: "decimal",
                                      placeholder: "0.00",
                                      class: tableInputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", { class: "report-years-data-cell" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `funding_male_projects_${item.row.funding_program_id}`,
                                      class: "report-years-data-cell-label md:sr-only"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Male projects")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `funding_male_projects_${item.row.funding_program_id}`,
                                      modelValue: item.row.male_projects,
                                      "onUpdate:modelValue": ($event) => item.row.male_projects = $event,
                                      type: "number",
                                      min: "0",
                                      inputmode: "numeric",
                                      class: tableInputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", { class: "report-years-data-cell" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `funding_male_amount_${item.row.funding_program_id}`,
                                      class: "report-years-data-cell-label md:sr-only"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Male amount")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `funding_male_amount_${item.row.funding_program_id}`,
                                      modelValue: item.row.male_amount,
                                      "onUpdate:modelValue": ($event) => item.row.male_amount = $event,
                                      type: "number",
                                      min: "0",
                                      step: "0.01",
                                      inputmode: "decimal",
                                      placeholder: "0.00",
                                      class: tableInputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("p", { class: "text-xs font-semibold tracking-wide text-foreground uppercase" }, "CEST"),
                          createVNode("div", { class: "report-years-data-table-scroll" }, [
                            createVNode("div", { class: "report-years-data-table report-years-data-table--wide report-years-data-table--funding" }, [
                              createVNode("div", { class: "report-years-data-head report-years-data-head--funding" }, [
                                createVNode("span", { class: "report-years-data-head-label" }, "Program"),
                                createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Female projects"),
                                createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Female amount"),
                                createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Male projects"),
                                createVNode("span", { class: "report-years-data-head-label report-years-data-head-label--center" }, "Male amount")
                              ]),
                              (openBlock(true), createBlock(Fragment, null, renderList(cestFundingRows.value, (item) => {
                                return openBlock(), createBlock("div", {
                                  key: item.row.funding_program_id,
                                  class: "report-years-data-row report-years-data-row--funding"
                                }, [
                                  createVNode("div", { class: "report-years-data-row-label" }, toDisplayString(item.label), 1),
                                  createVNode("div", { class: "report-years-data-cell" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `funding_female_projects_${item.row.funding_program_id}`,
                                      class: "report-years-data-cell-label md:sr-only"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Female projects")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `funding_female_projects_${item.row.funding_program_id}`,
                                      modelValue: item.row.female_projects,
                                      "onUpdate:modelValue": ($event) => item.row.female_projects = $event,
                                      type: "number",
                                      min: "0",
                                      inputmode: "numeric",
                                      class: tableInputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", { class: "report-years-data-cell" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `funding_female_amount_${item.row.funding_program_id}`,
                                      class: "report-years-data-cell-label md:sr-only"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Female amount")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `funding_female_amount_${item.row.funding_program_id}`,
                                      modelValue: item.row.female_amount,
                                      "onUpdate:modelValue": ($event) => item.row.female_amount = $event,
                                      type: "number",
                                      min: "0",
                                      step: "0.01",
                                      inputmode: "decimal",
                                      placeholder: "0.00",
                                      class: tableInputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", { class: "report-years-data-cell" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `funding_male_projects_${item.row.funding_program_id}`,
                                      class: "report-years-data-cell-label md:sr-only"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Male projects")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `funding_male_projects_${item.row.funding_program_id}`,
                                      modelValue: item.row.male_projects,
                                      "onUpdate:modelValue": ($event) => item.row.male_projects = $event,
                                      type: "number",
                                      min: "0",
                                      inputmode: "numeric",
                                      class: tableInputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                  ]),
                                  createVNode("div", { class: "report-years-data-cell" }, [
                                    createVNode(unref(_sfc_main$4), {
                                      for: `funding_male_amount_${item.row.funding_program_id}`,
                                      class: "report-years-data-cell-label md:sr-only"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Male amount")
                                      ]),
                                      _: 1
                                    }, 8, ["for"]),
                                    createVNode(unref(_sfc_main$5), {
                                      id: `funding_male_amount_${item.row.funding_program_id}`,
                                      modelValue: item.row.male_amount,
                                      "onUpdate:modelValue": ($event) => item.row.male_amount = $event,
                                      type: "number",
                                      min: "0",
                                      step: "0.01",
                                      inputmode: "decimal",
                                      placeholder: "0.00",
                                      class: tableInputClass
                                    }, null, 8, ["id", "modelValue", "onUpdate:modelValue"])
                                  ])
                                ]);
                              }), 128))
                            ])
                          ])
                        ])
                      ]),
                      createVNode(_sfc_main$6, {
                        message: unref(fundingForm).errors.summaries
                      }, null, 8, ["message"]),
                      createVNode("div", { class: "report-years-form-actions" }, [
                        createVNode(unref(_sfc_main$7), {
                          type: "submit",
                          class: "report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]",
                          disabled: unref(fundingForm).processing
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Save), {
                              class: "size-4",
                              "stroke-width": 2.5,
                              "aria-hidden": "true"
                            }),
                            createTextVNode(" Save program funding ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        withDirectives(createVNode("p", { class: "report-save-hint" }, [
                          createVNode(unref(CheckCircle2), {
                            class: "size-4 shrink-0",
                            "stroke-width": 2,
                            "aria-hidden": "true"
                          }),
                          createTextVNode(" Saved ")
                        ], 512), [
                          [vShow, unref(fundingForm).recentlySuccessful]
                        ])
                      ])
                    ], 32)
                  ], 512), [
                    [vShow, activeTab.value === "program_funding"]
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/reports/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Edit = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-12d91347"]]);
export {
  Edit as default
};
