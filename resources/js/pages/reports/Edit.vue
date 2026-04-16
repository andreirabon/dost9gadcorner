<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { REPORT_YEAR_FIELD_LIMITS } from '@/constants/reportYearFields';
import AppLayout from '@/layouts/AppLayout.vue';
import type { EditableReportYear, LookupSchoolYear } from '@/types/reports';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, FileChartColumnIncreasing } from 'lucide-vue-next';
import { computed, ref } from 'vue';

interface Props {
    reportYear: EditableReportYear;
    schoolYears: LookupSchoolYear[];
}

const props = defineProps<Props>();

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
    metadataForm.patch(route('report-years.update', props.reportYear.id), {
        preserveScroll: true,
    });
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

const inputClass = 'report-field rounded-md shadow-sm';

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

const activeTab = ref('metadata');

const tabs = [
    { id: 'metadata', name: 'Metadata' },
    { id: 'gfps_membership', name: 'GFPS Membership' },
    { id: 'scholarship', name: 'Scholarship' },
    { id: 'gfps_assemblies', name: 'GFPS Assemblies' },
    { id: 'employee_status', name: 'Employee Status' },
    { id: 'rstl_monthly', name: 'RSTL by Month' },
    { id: 'program_funding', name: 'Program Funding' },
];
</script>

<template>
    <AppLayout
        :show-footer="false"
        content-class="flex min-h-0 flex-1 flex-col bg-slate-100 dark:bg-zinc-950"
    >
        <Head :title="`Manage ${reportYear.year} report`" />

            <div class="w-full px-2 sm:px-4 py-6">
                <!-- Header and Tabs visually merged -->
                <header class="mb-2">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex min-w-0 flex-1 items-start gap-3">
                            <div
                                class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-800"
                                aria-hidden="true"
                            >
                                <FileChartColumnIncreasing class="size-5" :stroke-width="2" />
                            </div>
                            <div class="min-w-0 flex flex-col justify-center">
                                <p class="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase dark:text-zinc-400 mb-0.5">Editing year</p>
                                <h1 class="text-2xl font-bold tracking-tight text-slate-900 tabular-nums leading-none dark:text-zinc-50">
                                    {{ reportYear.year }}
                                </h1>
                                <p class="mt-1 max-w-xl text-xs text-slate-500 dark:text-zinc-400">
                                    You can work in any order—use each tab’s save button when that section’s data is complete.
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

                    <div class="border-b border-slate-200 dark:border-zinc-800 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <nav class="-mb-px flex space-x-8 min-w-max px-1" aria-label="Tabs">
                            <button
                                v-for="tab in tabs"
                                :key="tab.id"
                                @click="activeTab = tab.id"
                                :class="[
                                    activeTab === tab.id
                                        ? 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400'
                                        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:border-zinc-700',
                                    'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors'
                                ]"
                            >
                                {{ tab.name }}
                            </button>
                        </nav>
                    </div>
                </header>

                <div class="w-full">
                    <section v-show="activeTab === 'metadata'" class="report-panel">
                        <HeadingSmall
                        variant="report"
                        title="Metadata"
                    />

                    <form
                        class="mt-6 flex flex-col gap-5 max-w-3xl [&_label]:text-[11px] [&_label]:uppercase [&_label]:tracking-wide [&_label]:font-semibold [&_label]:text-zinc-500 dark:[&_label]:text-zinc-400"
                        autocomplete="off"
                        @submit.prevent="updateMetadata"
                    >
                        <div v-if="publishedAtLabel" class="rounded-lg border border-purple-200/90 bg-purple-50/80 px-3 py-2 text-sm text-purple-950 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-100">
                            <span class="font-medium">Published</span>
                            <span class="text-purple-800 dark:text-purple-200"> · {{ publishedAtLabel }}</span>
                            <span class="mt-0.5 block text-xs text-purple-800/80 dark:text-purple-300/80">From <code class="text-[11px]">published_at</code> (set on first publish).</span>
                        </div>

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

                            <div class="grid gap-2">
                                <Label for="status">Status</Label>
                                <select id="status" v-model="metadataForm.status" name="status" class="report-select">
                                    <option value="pending">Pending</option>
                                    <option value="published">Published</option>
                                </select>
                                <InputError :message="metadataForm.errors.status" />
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
                            <p class="text-xs text-zinc-500 dark:text-zinc-500">Max {{ REPORT_YEAR_FIELD_LIMITS.title }} characters.</p>
                            <InputError :message="metadataForm.errors.title" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="description">Description</Label>
                            <textarea
                                id="description"
                                v-model="metadataForm.description"
                                name="description"
                                rows="4"
                                class="report-textarea"
                                :maxlength="REPORT_YEAR_FIELD_LIMITS.description"
                            />
                            <p class="text-xs text-zinc-500 dark:text-zinc-500">
                                {{ descriptionLength }} / {{ REPORT_YEAR_FIELD_LIMITS.description }}
                            </p>
                            <InputError :message="metadataForm.errors.description" />
                        </div>

                        <div class="flex items-center gap-4">
                            <Button :disabled="metadataForm.processing" variant="outline" class="report-btn-primary h-9 px-5">SAVE METADATA</Button>
                            <p v-show="metadataForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>

                <section v-show="activeTab === 'gfps_membership'" class="report-panel">
                    <HeadingSmall variant="report" title="GFPS membership"/>

                        <form
                            class="mt-6 space-y-5 max-w-3xl [&_label]:text-[11px] [&_label]:uppercase [&_label]:tracking-wide [&_label]:font-semibold [&_label]:text-zinc-500 dark:[&_label]:text-zinc-400"
                            @submit.prevent="updateGfpsMembership"
                        >
                            <div class="grid gap-5 sm:grid-cols-[12rem_12rem]">
                                <div class="grid gap-2">
                                    <Label for="gfps_female_count">Female count</Label>
                                    <Input
                                        id="gfps_female_count"
                                        v-model="gfpsMembershipForm.female_count"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                    <InputError :message="gfpsMembershipForm.errors.female_count" />
                                </div>

                                <div class="grid gap-2">
                                    <Label for="gfps_male_count">Male count</Label>
                                    <Input id="gfps_male_count" v-model="gfpsMembershipForm.male_count" type="number" min="0" :class="inputClass" />
                                    <InputError :message="gfpsMembershipForm.errors.male_count" />
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <Button type="submit" variant="outline" class="report-btn-primary h-9 px-5" :disabled="gfpsMembershipForm.processing">
                                    SAVE GFPS MEMBERSHIP
                                </Button>
                                <p v-show="gfpsMembershipForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                            </div>
                        </form>
                </section>

                <section v-show="activeTab === 'scholarship'" class="report-panel">
                    <HeadingSmall variant="report" title="Scholarship"/>

                        <form
                            class="mt-6 space-y-5 max-w-3xl [&_label]:text-[11px] [&_label]:uppercase [&_label]:tracking-wide [&_label]:font-semibold [&_label]:text-zinc-500 dark:[&_label]:text-zinc-400"
                            @submit.prevent="updateScholarship"
                        >
                            <div class="grid gap-2 max-w-md">
                                <Label for="school_year_id">School year</Label>
                                <select
                                    id="school_year_id"
                                    v-model="scholarshipForm.school_year_id"
                                    class="report-select"
                                >
                                    <option value="" disabled>Select school year...</option>
                                    <option v-for="sy in schoolYears" :key="sy.id" :value="sy.id">
                                        {{ sy.label }}
                                    </option>
                                </select>
                                <InputError :message="scholarshipForm.errors.school_year_id" />
                            </div>

                            <div class="grid gap-2 max-w-xs">
                                <Label for="as_of_date">As of date</Label>
                                <Input id="as_of_date" v-model="scholarshipForm.as_of_date" type="date" :class="inputClass" />
                                <InputError :message="scholarshipForm.errors.as_of_date" />
                            </div>

                            <div class="grid gap-5 sm:grid-cols-[12rem_12rem]">
                                <div class="grid gap-2">
                                    <Label for="scholarship_female_count">Female count</Label>
                                    <Input
                                        id="scholarship_female_count"
                                        v-model="scholarshipForm.female_count"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                    <InputError :message="scholarshipForm.errors.female_count" />
                                </div>

                                <div class="grid gap-2">
                                    <Label for="scholarship_male_count">Male count</Label>
                                    <Input
                                        id="scholarship_male_count"
                                        v-model="scholarshipForm.male_count"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                    <InputError :message="scholarshipForm.errors.male_count" />
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <Button type="submit" variant="outline" class="report-btn-primary h-9 px-5" :disabled="scholarshipForm.processing">
                                    SAVE SCHOLARSHIP
                                </Button>
                                <p v-show="scholarshipForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                            </div>
                        </form>
                </section>

                <section v-show="activeTab === 'gfps_assemblies'" class="report-panel">
                    <HeadingSmall variant="report" title="GFPS assemblies"/>

                    <form class="mt-6 space-y-5 max-w-3xl [&_label]:text-[11px] [&_label]:uppercase [&_label]:tracking-wide [&_label]:font-semibold [&_label]:text-zinc-500 dark:[&_label]:text-zinc-400" @submit.prevent="updateGfpsAssemblies">
                        <div class="grid gap-4">
                            <div
                                v-for="(row, index) in gfpsAssembliesForm.attendances"
                                :key="row.period_id"
                                class="report-row grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_9rem_9rem]"
                            >
                                <div class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                    {{ reportYear.gfpsAssemblies[index]?.label }}
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`gfps_assembly_female_${row.period_id}`">Female count</Label>
                                    <Input
                                        :id="`gfps_assembly_female_${row.period_id}`"
                                        v-model="row.female_count"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`gfps_assembly_male_${row.period_id}`">Male count</Label>
                                    <Input
                                        :id="`gfps_assembly_male_${row.period_id}`"
                                        v-model="row.male_count"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                </div>
                            </div>
                        </div>

                        <InputError :message="gfpsAssembliesForm.errors.attendances" />

                        <div class="flex items-center gap-4">
                            <Button type="submit" variant="outline" class="report-btn-primary h-9 px-5" :disabled="gfpsAssembliesForm.processing">
                                SAVE ASSEMBLIES
                            </Button>
                            <p v-show="gfpsAssembliesForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>

                <section v-show="activeTab === 'employee_status'" class="report-panel">
                    <HeadingSmall variant="report" title="Employee status"/>

                    <form class="mt-6 space-y-5 max-w-3xl [&_label]:text-[11px] [&_label]:uppercase [&_label]:tracking-wide [&_label]:font-semibold [&_label]:text-zinc-500 dark:[&_label]:text-zinc-400" @submit.prevent="updateEmployeeStatuses">
                        <div class="grid gap-4">
                            <div
                                v-for="(row, index) in employeeStatusesForm.breakdowns"
                                :key="row.employment_status_id"
                                class="report-row grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_9rem_9rem]"
                            >
                                <div class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                    {{ reportYear.employeeStatuses[index]?.label }}
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`employee_female_${row.employment_status_id}`">Female count</Label>
                                    <Input
                                        :id="`employee_female_${row.employment_status_id}`"
                                        v-model="row.female_count"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`employee_male_${row.employment_status_id}`">Male count</Label>
                                    <Input
                                        :id="`employee_male_${row.employment_status_id}`"
                                        v-model="row.male_count"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                </div>
                            </div>
                        </div>

                        <InputError :message="employeeStatusesForm.errors.breakdowns" />

                        <div class="flex items-center gap-4">
                            <Button type="submit" variant="outline" class="report-btn-primary h-9 px-5" :disabled="employeeStatusesForm.processing">
                                SAVE EMPLOYEES
                            </Button>
                            <p v-show="employeeStatusesForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>

                <section v-show="activeTab === 'rstl_monthly'" class="report-panel">
                    <HeadingSmall variant="report" title="RSTL by month"/>

                    <form class="mt-6 space-y-5 max-w-5xl [&_label]:text-[11px] [&_label]:uppercase [&_label]:tracking-wide [&_label]:font-semibold [&_label]:text-zinc-500 dark:[&_label]:text-zinc-400" @submit.prevent="updateRstlMonthly">
                        <div class="grid gap-4">
                            <div
                                v-for="(row, index) in rstlForm.breakdowns"
                                :key="row.report_month_id"
                                class="report-row grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_repeat(4,8rem)]"
                            >
                                <div class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                    {{ reportYear.rstlMonthly[index]?.label }}
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`rstl_female_${row.report_month_id}`">Female</Label>
                                    <Input :id="`rstl_female_${row.report_month_id}`" v-model="row.female_count" type="number" min="0" :class="inputClass" />
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`rstl_female_led_${row.report_month_id}`">Female-led</Label>
                                    <Input
                                        :id="`rstl_female_led_${row.report_month_id}`"
                                        v-model="row.female_led_count"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`rstl_male_${row.report_month_id}`">Male</Label>
                                    <Input :id="`rstl_male_${row.report_month_id}`" v-model="row.male_count" type="number" min="0" :class="inputClass" />
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`rstl_male_led_${row.report_month_id}`">Male-led</Label>
                                    <Input
                                        :id="`rstl_male_led_${row.report_month_id}`"
                                        v-model="row.male_led_count"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                </div>
                            </div>
                        </div>

                        <InputError :message="rstlForm.errors.breakdowns" />

                        <div class="flex items-center gap-4">
                            <Button type="submit" variant="outline" class="report-btn-primary h-9 px-5" :disabled="rstlForm.processing">SAVE RSTL</Button>
                            <p v-show="rstlForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>

                <section v-show="activeTab === 'program_funding'" class="report-panel">
                    <HeadingSmall variant="report" title="Program funding"/>

                    <form class="mt-6 space-y-5 max-w-5xl [&_label]:text-[11px] [&_label]:uppercase [&_label]:tracking-wide [&_label]:font-semibold [&_label]:text-zinc-500 dark:[&_label]:text-zinc-400" @submit.prevent="updateProgramFunding">
                        <div class="grid gap-4">
                            <div
                                v-for="(row, index) in fundingForm.summaries"
                                :key="row.funding_program_id"
                                class="report-row grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_repeat(4,9rem)]"
                            >
                                <div class="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                    {{ reportYear.programFunding[index]?.label }}
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`funding_female_projects_${row.funding_program_id}`">Female projects</Label>
                                    <Input
                                        :id="`funding_female_projects_${row.funding_program_id}`"
                                        v-model="row.female_projects"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`funding_female_amount_${row.funding_program_id}`">Female amount</Label>
                                    <Input
                                        :id="`funding_female_amount_${row.funding_program_id}`"
                                        v-model="row.female_amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        :class="inputClass"
                                    />
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`funding_male_projects_${row.funding_program_id}`">Male projects</Label>
                                    <Input
                                        :id="`funding_male_projects_${row.funding_program_id}`"
                                        v-model="row.male_projects"
                                        type="number"
                                        min="0"
                                        :class="inputClass"
                                    />
                                </div>

                                <div class="grid gap-2">
                                    <Label :for="`funding_male_amount_${row.funding_program_id}`">Male amount</Label>
                                    <Input
                                        :id="`funding_male_amount_${row.funding_program_id}`"
                                        v-model="row.male_amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        :class="inputClass"
                                    />
                                </div>
                            </div>
                        </div>

                        <InputError :message="fundingForm.errors.summaries" />

                        <div class="flex items-center gap-4">
                            <Button type="submit" variant="outline" class="report-btn-primary h-9 px-5" :disabled="fundingForm.processing">
                                SAVE FUNDING
                            </Button>
                            <p v-show="fundingForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>
                </div>
            </div>
    </AppLayout>
</template>
