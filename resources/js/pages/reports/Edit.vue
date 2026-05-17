<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { REPORT_YEAR_FIELD_LIMITS } from '@/constants/reportYearFields';
import AppLayout from '@/layouts/AppLayout.vue';
import type { EditableReportYear, LookupSchoolYear, ReportYearEditAbilities } from '@/types/reports';
import { Head, Link, useForm } from '@inertiajs/vue3';
import {
 ArrowLeft,
 Briefcase,
 Calendar,
 CheckCircle2,
 FileChartColumnIncreasing,
 FlaskConical,
 GraduationCap,
 PieChart,
 Presentation,
 Save,
 Users,
} from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

interface Props {
 reportYear: EditableReportYear;
 schoolYears: LookupSchoolYear[];
 abilities: ReportYearEditAbilities;
}

const props = defineProps<Props>();

const tabDefs = [
 { id: 'metadata', name: 'Metadata' },
 { id: 'gfps_membership', name: 'GFPS Membership' },
 { id: 'scholarship', name: 'Scholarship' },
 { id: 'gfps_assemblies', name: 'GFPS Assemblies' },
 { id: 'employee_status', name: 'Employee Status' },
 { id: 'rstl_monthly', name: 'RSTL by Month' },
 { id: 'program_funding', name: 'Program Funding' },
] as const;

function tabIsVisible(id: (typeof tabDefs)[number]['id']): boolean {
 const a = props.abilities;
 switch (id) {
 case 'metadata':
 return a.updateMetadata || a.updateFullReport;
 case 'gfps_membership':
 return a.updateGfpsMembership;
 case 'scholarship':
 return a.updateScholarship;
 case 'gfps_assemblies':
 return a.updateGfpsAssemblies;
 case 'employee_status':
 return a.updateEmployeeStatuses;
 case 'rstl_monthly':
 return a.updateRstlMonthly;
 case 'program_funding':
 return a.updateProgramFunding;
 default:
 return false;
 }
}

const visibleTabs = computed(() => tabDefs.filter((t) => tabIsVisible(t.id)));

const metadataForm = useForm({
 year: props.reportYear.year,
 title: props.reportYear.title ?? '',
 description: props.reportYear.description ?? '',
 status: props.reportYear.status,
});

const gfpsMembershipForm = useForm({
 female_count: props.reportYear.gfpsMembership.femaleCount,
 male_count: props.reportYear.gfpsMembership.maleCount,
});

const gfpsAssembliesForm = useForm({
 attendances: props.reportYear.gfpsAssemblies.map((row) => ({
 period_id: row.periodId,
 female_count: row.femaleCount,
 male_count: row.maleCount,
 })),
});

const employeeStatusesForm = useForm({
 breakdowns: props.reportYear.employeeStatuses.map((row) => ({
 employment_status_id: row.employmentStatusId,
 female_count: row.femaleCount,
 male_count: row.maleCount,
 })),
});

const scholarshipForm = useForm({
 school_year_id: props.reportYear.scholarship.schoolYearId ?? '',
 as_of_date: props.reportYear.scholarship.asOfDate ?? '',
 female_count: props.reportYear.scholarship.femaleCount,
 male_count: props.reportYear.scholarship.maleCount,
});

const rstlForm = useForm({
 breakdowns: props.reportYear.rstlMonthly.map((row) => ({
 report_month_id: row.reportMonthId,
 female_count: row.femaleCount,
 female_led_count: row.femaleLedCount,
 male_count: row.maleCount,
 male_led_count: row.maleLedCount,
 })),
});

const fundingForm = useForm({
 summaries: props.reportYear.programFunding.map((row) => ({
 funding_program_id: row.fundingProgramId,
 female_projects: row.femaleProjects,
 female_amount: row.femaleAmount,
 male_projects: row.maleProjects,
 male_amount: row.maleAmount,
 })),
});

const updateMetadata = () => {
 const url = props.abilities.updateFullReport
 ? route('report-years.update', props.reportYear.id)
 : route('report-years.metadata.update', props.reportYear.id);
 metadataForm.patch(url, { preserveScroll: true });
};

const updateGfpsMembership = () => {
 gfpsMembershipForm.patch(route('report-years.gfps-membership.update', props.reportYear.id), {
 preserveScroll: true,
 });
};

const updateGfpsAssemblies = () => {
 gfpsAssembliesForm.patch(route('report-years.gfps-assemblies.update', props.reportYear.id), {
 preserveScroll: true,
 });
};

const updateEmployeeStatuses = () => {
 employeeStatusesForm.patch(route('report-years.employee-statuses.update', props.reportYear.id), {
 preserveScroll: true,
 });
};

const updateScholarship = () => {
 scholarshipForm.patch(route('report-years.scholarship.update', props.reportYear.id), {
 preserveScroll: true,
 });
};

const updateRstlMonthly = () => {
 rstlForm.patch(route('report-years.rstl-monthly.update', props.reportYear.id), {
 preserveScroll: true,
 });
};

const updateProgramFunding = () => {
 fundingForm.patch(route('report-years.program-funding.update', props.reportYear.id), {
 preserveScroll: true,
 });
};

const inputClass = 'h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-purple-50 transition-colors focus-visible:border-blue-500 focus-visible:bg-[#0e0716] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 w-full placeholder:text-purple-300/50';

const publishedAtLabel = computed(() => {
 const raw = props.reportYear.publishedAt;
 if (!raw) {
 return null;
 }
 const d = new Date(raw);
 if (Number.isNaN(d.getTime())) {
 return raw;
 }
 return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
});

const descriptionLength = computed(() => String(metadataForm.description ?? '').length);

const displayReportTitle = computed(() => {
 const t = String(metadataForm.title ?? '').trim();
 if (t) {
 return t;
 }
 const fromServer = props.reportYear.title?.trim();
 if (fromServer) {
 return fromServer;
 }

 return `${props.reportYear.year} report`;
});

const toNum = (v: unknown): number => {
 const n = Number(v);
 return Number.isFinite(n) ? n : 0;
};

const gfpsMembershipTotal = computed(() =>
 toNum(gfpsMembershipForm.female_count) + toNum(gfpsMembershipForm.male_count),
);

const scholarshipTotal = computed(() =>
 toNum(scholarshipForm.female_count) + toNum(scholarshipForm.male_count),
);

const activeTab = ref('metadata');

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
 { immediate: true },
);
</script>

<template>
 <AppLayout
 :show-footer="false"
 content-class="flex min-h-0 flex-1 flex-col bg-[#0e0716] text-purple-50 selection:bg-violet-500/30"
 >
 <Head :title="`Manage ${reportYear.year} report`" />

 <div class="w-full px-2 py-6 sm:px-4">
 <header class="mb-2">
 <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 <div class="flex min-w-0 flex-1 items-start gap-3">
 <div
 class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0e0716] text-purple-100 "
 aria-hidden="true"
 >
 <FileChartColumnIncreasing class="size-5" :stroke-width="2" />
 </div>
 <div class="min-w-0 flex flex-col justify-center">
 <div class="mb-0.5 flex flex-wrap items-center gap-x-4 gap-y-2">
 <p class="text-[10px] font-bold tracking-[0.15em] text-purple-200/70 uppercase dark:text-zinc-400">
 Editing year
 </p>
 <span
 class="inline-flex max-w-full items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 ring-1 ring-emerald-500/20"
 >
 <span
 class="flex size-7 shrink-0 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/20"
 aria-hidden="true"
 >
 <Calendar class="size-3.5 text-emerald-700 dark:text-emerald-300" :stroke-width="2" />
 </span>
 <span class="min-w-0 text-[10px] font-bold tracking-[0.12em] text-emerald-300 uppercase">
 Published date
 </span>
 <span
 v-if="publishedAtLabel"
 class="text-[11px] font-semibold normal-case tracking-normal text-emerald-50"
 >
 {{ publishedAtLabel }}
 </span>
 <span
 v-else
 class="text-[11px] font-medium normal-case tracking-normal text-emerald-600/75 dark:text-emerald-500/80"
 >
 —
 </span>
 </span>
 </div>
 <h1 class="text-2xl font-bold leading-none tracking-tight text-purple-50 tabular-nums">
 {{ displayReportTitle }}
 </h1>
 <p class="mt-1 max-w-xl text-xs text-purple-200/70 font-light">
 Sections may be updated in any order. Save your changes within each tab upon completing that section. Visible tabs are determined by your account's access privileges.
 </p>
 </div>
 </div>
 <Button as-child variant="ghost" class="report-btn-secondary h-9 w-full shrink-0 sm:w-auto">
 <Link class="cursor-pointer" :href="route('report-years.index')" prefetch>
 <ArrowLeft class="mr-2 inline size-4 align-middle" :stroke-width="2" aria-hidden="true" />
 All years
 </Link>
 </Button>
 </div>

 <div class="overflow-x-auto overflow-y-hidden border-white/10 border-b [scrollbar-width:none] dark:border-zinc-800 [&::-webkit-scrollbar]:hidden">
 <nav class="-mb-px flex min-w-max space-x-8 px-1" aria-label="Report sections" role="tablist">
 <button
 v-for="tab in visibleTabs"
 :key="tab.id"
 type="button"
 role="tab"
 :aria-selected="activeTab === tab.id"
 @click="activeTab = tab.id"
 :class="[
 activeTab === tab.id
 ? 'border-blue-500 text-purple-50 shadow-[0_1px_0_0_#2563eb]'
 : 'border-transparent border-transparent text-purple-200/70 hover:border-white/10 hover:text-purple-100',
 'cursor-pointer whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors duration-200',
 ]"
 >
 {{ tab.name }}
 </button>
 </nav>
 </div>
 </header>

 <div class="w-full">
 <section v-show="activeTab === 'metadata'" class="report-panel" role="tabpanel">

 <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
 <div
 class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0e0716] text-purple-100 "
 aria-hidden="true"
 >
 <Calendar class="size-5" :stroke-width="2" />
 </div>
 <div class="min-w-0 flex-1">
 <HeadingSmall
 variant="report"
 title="Metadata"
 description="Calendar year, publication status, and the title and description readers see for this report."
 />
 </div>
 </div>

 <form
 class="report-form mt-6 flex max-w-3xl flex-col gap-6"
 autocomplete="off"
 @submit.prevent="updateMetadata"
 >
 <div class="grid gap-5 sm:grid-cols-[10rem_14rem]">
 <div class="grid gap-2">
 <Label for="year">Year</Label>
 <Input
 id="year"
 v-model="metadataForm.year"
 name="year"
 type="number"
 :min="REPORT_YEAR_FIELD_LIMITS.yearMin"
 :max="REPORT_YEAR_FIELD_LIMITS.yearMax"
 inputmode="numeric"
 :class="inputClass"
 />
 <InputError :message="metadataForm.errors.year" />
 </div>

 <div v-if="abilities.updateFullReport" class="grid gap-2">
 <Label for="status">Status</Label>
 <select id="status" v-model="metadataForm.status" name="status" class="report-select bg-[#0e0716] border-white/10 text-purple-50">
 <option value="pending">Pending</option>
 <option value="published">Published</option>
 </select>
 <InputError :message="metadataForm.errors.status" />
 </div>
 <div v-else class="grid gap-2">
 <span class="text-sm font-medium text-purple-100">Status</span>
 <p
 class="rounded-md border border-white/10 bg-black/20 border-white/10 px-3 py-2 text-sm text-purple-50"
 >
 <span
 v-if="metadataForm.status === 'published'"
 class="font-medium text-emerald-800 dark:text-emerald-300"
 >Published</span
 >
 <span v-else class="font-medium text-amber-800 dark:text-amber-200">Pending</span>
 </p>
 </div>
 </div>

 <div class="grid gap-2">
 <Label for="title">Title</Label>
 <Input
 id="title"
 v-model="metadataForm.title"
 name="title"
 type="text"
 placeholder="Optional custom title"
 :maxlength="REPORT_YEAR_FIELD_LIMITS.title"
 :class="inputClass"
 />
 <p class="text-xs text-purple-200/70">Up to {{ REPORT_YEAR_FIELD_LIMITS.title }} characters.</p>
 <InputError :message="metadataForm.errors.title" />
 </div>

 <div class="grid gap-2">
 <Label for="description">Description</Label>
 <textarea
 id="description"
 v-model="metadataForm.description"
 name="description"
 rows="4"
 class="report-textarea bg-[#0e0716] border-white/10 text-purple-50"
 :maxlength="REPORT_YEAR_FIELD_LIMITS.description"
 />
 <p class="text-xs text-purple-200/70">
 {{ descriptionLength }} / {{ REPORT_YEAR_FIELD_LIMITS.description }}
 </p>
 <InputError :message="metadataForm.errors.description" />
 </div>

 <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2 dark:border-zinc-800">
 <Button type="submit" :disabled="metadataForm.processing" class="report-save-btn">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save metadata
 </Button>
 <p v-show="metadataForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

 <section v-show="activeTab === 'gfps_membership'" class="report-panel" role="tabpanel">

 <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
 <div
 class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0e0716] text-purple-100 "
 aria-hidden="true"
 >
 <Users class="size-5" :stroke-width="2" />
 </div>
 <div class="min-w-0 flex-1">
 <HeadingSmall
 variant="report"
 title="GFPS membership"
 description="Total GFPS members by sex for this reporting year. Use whole numbers only."
 />
 </div>
 </div>

 <form
 class="report-form mt-6 max-w-3xl space-y-6"
 @submit.prevent="updateGfpsMembership"
 >
 <div class="rounded-xl border border-white/10 bg-black/20 p-4 ">
 <div class="grid gap-5 sm:grid-cols-2">
 <div class="grid gap-2 border-l-2 border-rose-500/50 pl-3 ">
 <Label for="gfps_female_count">Female count</Label>
 <Input
 id="gfps_female_count"
 v-model="gfpsMembershipForm.female_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 <InputError :message="gfpsMembershipForm.errors.female_count" />
 </div>

 <div class="grid gap-2 border-l-2 border-sky-500/50 pl-3 ">
 <Label for="gfps_male_count">Male count</Label>
 <Input
 id="gfps_male_count"
 v-model="gfpsMembershipForm.male_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 <InputError :message="gfpsMembershipForm.errors.male_count" />
 </div>
 </div>
 <p class="mt-1 max-w-md text-xs text-purple-200/70">
 Total members: <span class="font-medium text-purple-100 tabular-nums">{{ gfpsMembershipTotal }}</span>
 </p>
 </div>

 <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2 dark:border-zinc-800">
 <Button type="submit" class="report-save-btn" :disabled="gfpsMembershipForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save GFPS membership
 </Button>
 <p v-show="gfpsMembershipForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

 <section v-show="activeTab === 'scholarship'" class="report-panel" role="tabpanel">

 <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
 <div
 class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0e0716] text-purple-100 "
 aria-hidden="true"
 >
 <GraduationCap class="size-5" :stroke-width="2" />
 </div>
 <div class="min-w-0 flex-1">
 <HeadingSmall
 variant="report"
 title="Scholarship"
 description="Pick the school year, the reference date for the counts, then enter scholars by sex."
 />
 </div>
 </div>

 <form
 class="report-form mt-6 max-w-3xl space-y-6"
 @submit.prevent="updateScholarship"
 >
 <div class="grid gap-5 sm:grid-cols-[minmax(0,1fr)_11rem]">
 <div class="grid gap-2">
 <Label for="school_year_id">School year</Label>
 <select
 id="school_year_id"
 v-model="scholarshipForm.school_year_id"
 class="report-select bg-[#0e0716] border-white/10 text-purple-50"
 >
 <option value="" disabled>Select school year…</option>
 <option v-for="sy in schoolYears" :key="sy.id" :value="sy.id">
 {{ sy.label }}
 </option>
 </select>
 <InputError :message="scholarshipForm.errors.school_year_id" />
 </div>

 <div class="grid gap-2">
 <Label for="as_of_date">As of date</Label>
 <Input id="as_of_date" v-model="scholarshipForm.as_of_date" type="date" :class="inputClass" />
 <InputError :message="scholarshipForm.errors.as_of_date" />
 </div>
 </div>

 <div class="rounded-xl border border-white/10 bg-black/20 p-4 ">
 <div class="grid gap-5 sm:grid-cols-2">
 <div class="grid gap-2 border-l-2 border-rose-500/50 pl-3 ">
 <Label for="scholarship_female_count">Female count</Label>
 <Input
 id="scholarship_female_count"
 v-model="scholarshipForm.female_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 <InputError :message="scholarshipForm.errors.female_count" />
 </div>

 <div class="grid gap-2 border-l-2 border-sky-500/50 pl-3 ">
 <Label for="scholarship_male_count">Male count</Label>
 <Input
 id="scholarship_male_count"
 v-model="scholarshipForm.male_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 <InputError :message="scholarshipForm.errors.male_count" />
 </div>
 </div>
 <p class="mt-1 max-w-md text-xs text-purple-200/70">
 Total scholars: <span class="font-medium text-purple-100 tabular-nums">{{ scholarshipTotal }}</span>
 </p>
 </div>

 <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2 dark:border-zinc-800">
 <Button type="submit" class="report-save-btn" :disabled="scholarshipForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save scholarship
 </Button>
 <p v-show="scholarshipForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

 <section v-show="activeTab === 'gfps_assemblies'" class="report-panel" role="tabpanel">

 <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
 <div
 class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0e0716] text-purple-100 "
 aria-hidden="true"
 >
 <Presentation class="size-5" :stroke-width="2" />
 </div>
 <div class="min-w-0 flex-1">
 <HeadingSmall
 variant="report"
 title="GFPS assemblies"
 description="Attendance by assembly period. Enter headcounts by sex for each row."
 />
 </div>
 </div>

 <form class="report-form mt-6 max-w-3xl space-y-6" @submit.prevent="updateGfpsAssemblies">
 <div class="report-data-shell divide-y divide-zinc-200/70 dark:divide-zinc-800">
 <div class="report-data-head md:grid-cols-[minmax(0,1fr)_9rem_9rem]">
 <span>Period</span>
 <span>Female</span>
 <span>Male</span>
 </div>
 <div
 v-for="(row, index) in gfpsAssembliesForm.attendances"
 :key="row.period_id"
 class="report-data-row md:grid-cols-[minmax(0,1fr)_9rem_9rem]"
 >
 <div class="mb-3 text-sm font-semibold text-purple-50 md:mb-0">
 {{ reportYear.gfpsAssemblies[index]?.label }}
 </div>

 <div class="grid gap-2">
 <Label :for="`gfps_assembly_female_${row.period_id}`" class="md:sr-only">Female count</Label>
 <Input
 :id="`gfps_assembly_female_${row.period_id}`"
 v-model="row.female_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>

 <div class="grid gap-2">
 <Label :for="`gfps_assembly_male_${row.period_id}`" class="md:sr-only">Male count</Label>
 <Input
 :id="`gfps_assembly_male_${row.period_id}`"
 v-model="row.male_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>
 </div>
 </div>

 <InputError :message="gfpsAssembliesForm.errors.attendances" />

 <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2 dark:border-zinc-800">
 <Button type="submit" class="report-save-btn" :disabled="gfpsAssembliesForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save assemblies
 </Button>
 <p v-show="gfpsAssembliesForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

 <section v-show="activeTab === 'employee_status'" class="report-panel" role="tabpanel">

 <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
 <div
 class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0e0716] text-purple-100 "
 aria-hidden="true"
 >
 <Briefcase class="size-5" :stroke-width="2" />
 </div>
 <div class="min-w-0 flex-1">
 <HeadingSmall
 variant="report"
 title="Employee status"
 description="Workforce headcounts by employment status and sex. Use the same definitions as HR records."
 />
 </div>
 </div>

 <form class="report-form mt-6 max-w-3xl space-y-6" @submit.prevent="updateEmployeeStatuses">
 <div class="report-data-shell divide-y divide-zinc-200/70 dark:divide-zinc-800">
 <div class="report-data-head md:grid-cols-[minmax(0,1fr)_9rem_9rem]">
 <span>Employment status</span>
 <span>Female</span>
 <span>Male</span>
 </div>
 <div
 v-for="(row, index) in employeeStatusesForm.breakdowns"
 :key="row.employment_status_id"
 class="report-data-row md:grid-cols-[minmax(0,1fr)_9rem_9rem]"
 >
 <div class="mb-3 text-sm font-semibold text-purple-50 md:mb-0">
 {{ reportYear.employeeStatuses[index]?.label }}
 </div>

 <div class="grid gap-2">
 <Label :for="`employee_female_${row.employment_status_id}`" class="md:sr-only">Female count</Label>
 <Input
 :id="`employee_female_${row.employment_status_id}`"
 v-model="row.female_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>

 <div class="grid gap-2">
 <Label :for="`employee_male_${row.employment_status_id}`" class="md:sr-only">Male count</Label>
 <Input
 :id="`employee_male_${row.employment_status_id}`"
 v-model="row.male_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>
 </div>
 </div>

 <InputError :message="employeeStatusesForm.errors.breakdowns" />

 <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2 dark:border-zinc-800">
 <Button type="submit" class="report-save-btn" :disabled="employeeStatusesForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save employee status
 </Button>
 <p v-show="employeeStatusesForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

 <section v-show="activeTab === 'rstl_monthly'" class="report-panel" role="tabpanel">

 <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
 <div
 class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0e0716] text-purple-100 "
 aria-hidden="true"
 >
 <FlaskConical class="size-5" :stroke-width="2" />
 </div>
 <div class="min-w-0 flex-1">
 <HeadingSmall
 variant="report"
 title="RSTL by month"
 description="Monthly RSTL activity: clients or visits by sex, plus female-led and male-led counts. Scroll horizontally on small screens if the column labels do not fit."
 />
 </div>
 </div>

 <form class="report-form mt-6 max-w-5xl space-y-6" @submit.prevent="updateRstlMonthly">
 <div class="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:px-0">
 <div class="min-w-176">
 <div class="report-data-shell divide-y divide-zinc-200/70 dark:divide-zinc-800">
 <div
 class="report-data-head md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(5.5rem,8rem))]"
 >
 <span>Month</span>
 <span>Female</span>
 <span>Female-led</span>
 <span>Male</span>
 <span>Male-led</span>
 </div>
 <div
 v-for="(row, index) in rstlForm.breakdowns"
 :key="row.report_month_id"
 class="report-data-row md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(5.5rem,8rem))]"
 >
 <div class="mb-3 text-sm font-semibold text-purple-50 md:mb-0">
 {{ reportYear.rstlMonthly[index]?.label }}
 </div>

 <div class="grid gap-2">
 <Label :for="`rstl_female_${row.report_month_id}`" class="md:sr-only">Female</Label>
 <Input
 :id="`rstl_female_${row.report_month_id}`"
 v-model="row.female_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>

 <div class="grid gap-2">
 <Label :for="`rstl_female_led_${row.report_month_id}`" class="md:sr-only">Female-led</Label>
 <Input
 :id="`rstl_female_led_${row.report_month_id}`"
 v-model="row.female_led_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>

 <div class="grid gap-2">
 <Label :for="`rstl_male_${row.report_month_id}`" class="md:sr-only">Male</Label>
 <Input
 :id="`rstl_male_${row.report_month_id}`"
 v-model="row.male_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>

 <div class="grid gap-2">
 <Label :for="`rstl_male_led_${row.report_month_id}`" class="md:sr-only">Male-led</Label>
 <Input
 :id="`rstl_male_led_${row.report_month_id}`"
 v-model="row.male_led_count"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>
 </div>
 </div>
 </div>
 </div>

 <InputError :message="rstlForm.errors.breakdowns" />

 <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2 dark:border-zinc-800">
 <Button type="submit" class="report-save-btn" :disabled="rstlForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save RSTL
 </Button>
 <p v-show="rstlForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>

 <section v-show="activeTab === 'program_funding'" class="report-panel" role="tabpanel">
 <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
 <div
 class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0e0716] text-purple-100 "
 aria-hidden="true"
 >
 <PieChart class="size-5" :stroke-width="2" />
 </div>
 <div class="min-w-0 flex-1">
 <HeadingSmall
 variant="report"
 title="Program funding"
 description="Projects and funding amounts by program, split by sex. Amounts use your organization’s currency; enter decimals as needed."
 />
 </div>
 </div>

 <form class="report-form mt-6 max-w-5xl space-y-6" @submit.prevent="updateProgramFunding">
 <div class="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:px-0">
 <div class="min-w-208">
 <div class="report-data-shell divide-y divide-zinc-200/70 dark:divide-zinc-800">
 <div class="report-data-head md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(6.5rem,9rem))]">
 <span>Program</span>
 <span>Female projects</span>
 <span>Female amount</span>
 <span>Male projects</span>
 <span>Male amount</span>
 </div>
 <div
 v-for="(row, index) in fundingForm.summaries"
 :key="row.funding_program_id"
 class="report-data-row md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(6.5rem,9rem))]"
 >
 <div class="mb-3 text-sm font-semibold text-purple-50 md:mb-0">
 {{ reportYear.programFunding[index]?.label }}
 </div>

 <div class="grid gap-2">
 <Label :for="`funding_female_projects_${row.funding_program_id}`" class="md:sr-only">Female projects</Label>
 <Input
 :id="`funding_female_projects_${row.funding_program_id}`"
 v-model="row.female_projects"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>

 <div class="grid gap-2">
 <Label :for="`funding_female_amount_${row.funding_program_id}`" class="md:sr-only">Female amount</Label>
 <Input
 :id="`funding_female_amount_${row.funding_program_id}`"
 v-model="row.female_amount"
 type="number"
 min="0"
 step="0.01"
 inputmode="decimal"
 placeholder="0.00"
 :class="inputClass"
 />
 </div>

 <div class="grid gap-2">
 <Label :for="`funding_male_projects_${row.funding_program_id}`" class="md:sr-only">Male projects</Label>
 <Input
 :id="`funding_male_projects_${row.funding_program_id}`"
 v-model="row.male_projects"
 type="number"
 min="0"
 inputmode="numeric"
 :class="inputClass"
 />
 </div>

 <div class="grid gap-2">
 <Label :for="`funding_male_amount_${row.funding_program_id}`" class="md:sr-only">Male amount</Label>
 <Input
 :id="`funding_male_amount_${row.funding_program_id}`"
 v-model="row.male_amount"
 type="number"
 min="0"
 step="0.01"
 inputmode="decimal"
 placeholder="0.00"
 :class="inputClass"
 />
 </div>
 </div>
 </div>
 </div>
 </div>

 <InputError :message="fundingForm.errors.summaries" />

 <div class="flex flex-wrap items-center gap-4 border-zinc-200/80 border-t pt-2 dark:border-zinc-800">
 <Button type="submit" class="report-save-btn" :disabled="fundingForm.processing">
 <Save class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Save program funding
 </Button>
 <p v-show="fundingForm.recentlySuccessful" class="report-save-hint">
 <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
 Saved
 </p>
 </div>
 </form>
 </section>
 </div>
 </div>
 </AppLayout>
</template>
