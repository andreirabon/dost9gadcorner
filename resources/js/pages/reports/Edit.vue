<script setup lang="ts">
import ReportPageShell from '@/components/reports/ReportPageShell.vue';
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { REPORT_YEAR_FIELD_LIMITS } from '@/constants/reportYearFields';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem } from '@/types';
import type { EditableReportYear } from '@/types/reports';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, FileChartColumnIncreasing } from 'lucide-vue-next';
import { computed } from 'vue';

interface Props {
    reportYear: EditableReportYear;
}

const props = defineProps<Props>();

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Report years',
        href: '/report-years',
    },
    {
        title: `${props.reportYear.year}`,
        href: `/report-years/${props.reportYear.id}/edit`,
    },
];

const metadataForm = useForm({
    year: props.reportYear.year,
    title: props.reportYear.title ?? '',
    description: props.reportYear.description ?? '',
    status: props.reportYear.status,
    color_theme: props.reportYear.colorTheme ?? 'violet',
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
    school_year_label: props.reportYear.scholarship.schoolYearLabel,
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

const inputClass = 'report-field rounded-lg shadow-sm';

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
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems" :show-footer="false">
        <Head :title="`Manage ${reportYear.year} report`" />

        <ReportPageShell>
            <div class="space-y-10">
                <header
                    class="flex flex-col gap-5 border-zinc-200 border-b pb-8 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800"
                >
                    <div class="flex min-w-0 flex-1 items-start gap-4">
                        <div
                            class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300"
                            aria-hidden="true"
                        >
                            <FileChartColumnIncreasing class="size-5" :stroke-width="2" />
                        </div>
                        <div class="min-w-0">
                            <p class="text-[13px] font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">Editing year</p>
                            <h1 class="mt-1 text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums dark:text-zinc-50">
                                {{ reportYear.year }}
                            </h1>
                            <p class="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                Sections save independently—submit each block when its data is ready.
                            </p>
                        </div>
                    </div>
                    <Button as-child variant="ghost" class="report-btn-secondary h-9 w-full shrink-0 sm:w-auto">
                        <Link class="cursor-pointer" :href="route('report-years.index')" prefetch>
                            <ArrowLeft class="mr-2 inline size-4 align-middle" :stroke-width="2" aria-hidden="true" />
                            All years
                        </Link>
                    </Button>
                </header>

                <section class="report-panel report-panel-emphasis">
                    <HeadingSmall
                        variant="report"
                        title="Metadata"
                        description="Public card title, publish state, and color theme."
                    />

                    <form
                        class="mt-6 grid gap-5 lg:grid-cols-2 [&_label]:text-zinc-700 dark:[&_label]:text-zinc-300"
                        autocomplete="off"
                        @submit.prevent="updateMetadata"
                    >
                        <div v-if="publishedAtLabel" class="rounded-lg border border-emerald-200/90 bg-emerald-50/80 px-3 py-2 text-sm text-emerald-950 lg:col-span-2 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100">
                            <span class="font-medium">Published</span>
                            <span class="text-emerald-800 dark:text-emerald-200"> · {{ publishedAtLabel }}</span>
                            <span class="mt-0.5 block text-xs text-emerald-800/80 dark:text-emerald-300/80">From <code class="text-[11px]">published_at</code> (set on first publish).</span>
                        </div>

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

                        <div class="grid gap-2 lg:col-span-2">
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

                        <div class="grid gap-2 lg:col-span-2">
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

                        <div class="grid gap-2 lg:col-span-2">
                            <Label for="color_theme">Color theme</Label>
                            <select id="color_theme" v-model="metadataForm.color_theme" name="color_theme" class="report-select">
                                <option value="violet">Violet</option>
                                <option value="purple">Purple</option>
                                <option value="indigo">Indigo</option>
                            </select>
                            <InputError :message="metadataForm.errors.color_theme" />
                        </div>

                        <div class="flex items-center gap-4 lg:col-span-2">
                            <Button :disabled="metadataForm.processing" variant="ghost" class="report-btn-primary h-9 px-5">Save metadata</Button>
                            <p v-show="metadataForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>

                <section class="grid gap-6 xl:grid-cols-2">
                    <div class="report-panel">
                        <HeadingSmall variant="report" title="GFPS membership" description="Year totals (female / male)." />

                        <form
                            class="mt-6 space-y-5 [&_label]:text-zinc-700 dark:[&_label]:text-zinc-300"
                            @submit.prevent="updateGfpsMembership"
                        >
                            <div class="grid gap-4 sm:grid-cols-2">
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
                                <Button type="submit" variant="ghost" class="report-btn-primary h-9 px-5" :disabled="gfpsMembershipForm.processing">
                                    Save GFPS membership
                                </Button>
                                <p v-show="gfpsMembershipForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                            </div>
                        </form>
                    </div>

                    <div class="report-panel">
                        <HeadingSmall variant="report" title="Scholarship" description="School year label, as-of date, counts." />

                        <form
                            class="mt-6 space-y-5 [&_label]:text-zinc-700 dark:[&_label]:text-zinc-300"
                            @submit.prevent="updateScholarship"
                        >
                            <div class="grid gap-2">
                                <Label for="school_year_label">School year label</Label>
                                <Input
                                    id="school_year_label"
                                    v-model="scholarshipForm.school_year_label"
                                    type="text"
                                    placeholder="2025-2026"
                                    :class="inputClass"
                                />
                                <InputError :message="scholarshipForm.errors.school_year_label" />
                            </div>

                            <div class="grid gap-2">
                                <Label for="as_of_date">As of date</Label>
                                <Input id="as_of_date" v-model="scholarshipForm.as_of_date" type="date" :class="inputClass" />
                                <InputError :message="scholarshipForm.errors.as_of_date" />
                            </div>

                            <div class="grid gap-4 sm:grid-cols-2">
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
                                <Button type="submit" variant="ghost" class="report-btn-primary h-9 px-5" :disabled="scholarshipForm.processing">
                                    Save scholarship
                                </Button>
                                <p v-show="scholarshipForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                            </div>
                        </form>
                    </div>
                </section>

                <section class="report-panel">
                    <HeadingSmall variant="report" title="GFPS assemblies" description="One row per assembly period." />

                    <form class="mt-6 space-y-5 [&_label]:text-zinc-700 dark:[&_label]:text-zinc-300" @submit.prevent="updateGfpsAssemblies">
                        <div class="grid gap-4">
                            <div
                                v-for="(row, index) in gfpsAssembliesForm.attendances"
                                :key="row.period_id"
                                class="report-row grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_12rem_12rem]"
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
                            <Button type="submit" variant="ghost" class="report-btn-primary h-9 px-5" :disabled="gfpsAssembliesForm.processing">
                                Save assemblies
                            </Button>
                            <p v-show="gfpsAssembliesForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>

                <section class="report-panel">
                    <HeadingSmall variant="report" title="Employee status" description="One row per employment category." />

                    <form class="mt-6 space-y-5 [&_label]:text-zinc-700 dark:[&_label]:text-zinc-300" @submit.prevent="updateEmployeeStatuses">
                        <div class="grid gap-4">
                            <div
                                v-for="(row, index) in employeeStatusesForm.breakdowns"
                                :key="row.employment_status_id"
                                class="report-row grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_12rem_12rem]"
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
                            <Button type="submit" variant="ghost" class="report-btn-primary h-9 px-5" :disabled="employeeStatusesForm.processing">
                                Save employees
                            </Button>
                            <p v-show="employeeStatusesForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>

                <section class="report-panel">
                    <HeadingSmall variant="report" title="RSTL by month" description="Counts plus female-led / male-led per month." />

                    <form class="mt-6 space-y-5 [&_label]:text-zinc-700 dark:[&_label]:text-zinc-300" @submit.prevent="updateRstlMonthly">
                        <div class="grid gap-4">
                            <div
                                v-for="(row, index) in rstlForm.breakdowns"
                                :key="row.report_month_id"
                                class="report-row grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,10rem))]"
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
                            <Button type="submit" variant="ghost" class="report-btn-primary h-9 px-5" :disabled="rstlForm.processing">Save RSTL</Button>
                            <p v-show="rstlForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>

                <section class="report-panel">
                    <HeadingSmall variant="report" title="Program funding" description="Per program: project counts and amounts (PHP)." />

                    <form class="mt-6 space-y-5 [&_label]:text-zinc-700 dark:[&_label]:text-zinc-300" @submit.prevent="updateProgramFunding">
                        <div class="grid gap-4">
                            <div
                                v-for="(row, index) in fundingForm.summaries"
                                :key="row.funding_program_id"
                                class="report-row grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,11rem))]"
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
                            <Button type="submit" variant="ghost" class="report-btn-primary h-9 px-5" :disabled="fundingForm.processing">
                                Save funding
                            </Button>
                            <p v-show="fundingForm.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>
            </div>
        </ReportPageShell>
    </AppLayout>
</template>
