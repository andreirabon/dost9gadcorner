<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import type { BreadcrumbItem } from '@/types';
import type { EditableReportYear } from '@/types/reports';
import { Head, Link, useForm } from '@inertiajs/vue3';

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
    background_image: props.reportYear.backgroundImage ?? '/svg/reports.svg',
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
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <Head :title="`Manage ${reportYear.year} report`" />

        <div class="space-y-6 p-4 md:p-6">
            <div class="flex items-center justify-between gap-4">
                <HeadingSmall
                    :title="`Manage ${reportYear.year} report`"
                    description="Update one normalized section at a time. Each save targets a single backend table group."
                />

                <Button as-child variant="outline">
                    <Link :href="route('report-years.index')">Back to list</Link>
                </Button>
            </div>

            <section class="rounded-xl border bg-card p-6 shadow-sm">
                <HeadingSmall title="Report metadata" description="This powers the year card, status badge, and publishing state." />

                <form class="mt-6 grid gap-5 lg:grid-cols-2" @submit.prevent="updateMetadata">
                    <div class="grid gap-2">
                        <Label for="year">Year</Label>
                        <Input id="year" v-model="metadataForm.year" type="number" min="2000" max="2100" />
                        <InputError :message="metadataForm.errors.year" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="status">Status</Label>
                        <select
                            id="status"
                            v-model="metadataForm.status"
                            class="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <option value="pending">Pending</option>
                            <option value="published">Published</option>
                        </select>
                        <InputError :message="metadataForm.errors.status" />
                    </div>

                    <div class="grid gap-2 lg:col-span-2">
                        <Label for="title">Title</Label>
                        <Input id="title" v-model="metadataForm.title" type="text" placeholder="Optional custom title" />
                        <InputError :message="metadataForm.errors.title" />
                    </div>

                    <div class="grid gap-2 lg:col-span-2">
                        <Label for="description">Description</Label>
                        <textarea
                            id="description"
                            v-model="metadataForm.description"
                            rows="4"
                            class="min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        />
                        <InputError :message="metadataForm.errors.description" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="color_theme">Color theme</Label>
                        <select
                            id="color_theme"
                            v-model="metadataForm.color_theme"
                            class="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            <option value="violet">Violet</option>
                            <option value="purple">Purple</option>
                            <option value="indigo">Indigo</option>
                        </select>
                        <InputError :message="metadataForm.errors.color_theme" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="background_image">Background image</Label>
                        <Input id="background_image" v-model="metadataForm.background_image" type="text" />
                        <InputError :message="metadataForm.errors.background_image" />
                    </div>

                    <div class="lg:col-span-2 flex items-center gap-4">
                        <Button :disabled="metadataForm.processing">Save metadata</Button>
                        <p v-show="metadataForm.recentlySuccessful" class="text-sm text-muted-foreground">Saved.</p>
                    </div>
                </form>
            </section>

            <section class="grid gap-6 xl:grid-cols-2">
                <div class="rounded-xl border bg-card p-6 shadow-sm">
                    <HeadingSmall title="GFPS membership" description="Single yearly summary row." />

                    <form class="mt-6 space-y-5" @submit.prevent="updateGfpsMembership">
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="grid gap-2">
                                <Label for="gfps_female_count">Female count</Label>
                                <Input id="gfps_female_count" v-model="gfpsMembershipForm.female_count" type="number" min="0" />
                                <InputError :message="gfpsMembershipForm.errors.female_count" />
                            </div>

                            <div class="grid gap-2">
                                <Label for="gfps_male_count">Male count</Label>
                                <Input id="gfps_male_count" v-model="gfpsMembershipForm.male_count" type="number" min="0" />
                                <InputError :message="gfpsMembershipForm.errors.male_count" />
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <Button :disabled="gfpsMembershipForm.processing">Save GFPS membership</Button>
                            <p v-show="gfpsMembershipForm.recentlySuccessful" class="text-sm text-muted-foreground">Saved.</p>
                        </div>
                    </form>
                </div>

                <div class="rounded-xl border bg-card p-6 shadow-sm">
                    <HeadingSmall title="Scholarship summary" description="Yearly scholar counts and reference date." />

                    <form class="mt-6 space-y-5" @submit.prevent="updateScholarship">
                        <div class="grid gap-2">
                            <Label for="school_year_label">School year label</Label>
                            <Input id="school_year_label" v-model="scholarshipForm.school_year_label" type="text" placeholder="2025-2026" />
                            <InputError :message="scholarshipForm.errors.school_year_label" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="as_of_date">As of date</Label>
                            <Input id="as_of_date" v-model="scholarshipForm.as_of_date" type="date" />
                            <InputError :message="scholarshipForm.errors.as_of_date" />
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="grid gap-2">
                                <Label for="scholarship_female_count">Female count</Label>
                                <Input id="scholarship_female_count" v-model="scholarshipForm.female_count" type="number" min="0" />
                                <InputError :message="scholarshipForm.errors.female_count" />
                            </div>

                            <div class="grid gap-2">
                                <Label for="scholarship_male_count">Male count</Label>
                                <Input id="scholarship_male_count" v-model="scholarshipForm.male_count" type="number" min="0" />
                                <InputError :message="scholarshipForm.errors.male_count" />
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <Button :disabled="scholarshipForm.processing">Save scholarship summary</Button>
                            <p v-show="scholarshipForm.recentlySuccessful" class="text-sm text-muted-foreground">Saved.</p>
                        </div>
                    </form>
                </div>
            </section>

            <section class="rounded-xl border bg-card p-6 shadow-sm">
                <HeadingSmall title="GFPS assembly attendance" description="One normalized row per assembly period." />

                <form class="mt-6 space-y-5" @submit.prevent="updateGfpsAssemblies">
                    <div class="grid gap-4">
                        <div
                            v-for="(row, index) in gfpsAssembliesForm.attendances"
                            :key="row.period_id"
                            class="grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(0,1fr)_12rem_12rem]"
                        >
                            <div class="text-sm font-medium text-foreground">
                                {{ reportYear.gfpsAssemblies[index]?.label }}
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`gfps_assembly_female_${row.period_id}`">Female count</Label>
                                <Input :id="`gfps_assembly_female_${row.period_id}`" v-model="row.female_count" type="number" min="0" />
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`gfps_assembly_male_${row.period_id}`">Male count</Label>
                                <Input :id="`gfps_assembly_male_${row.period_id}`" v-model="row.male_count" type="number" min="0" />
                            </div>
                        </div>
                    </div>

                    <InputError :message="gfpsAssembliesForm.errors.attendances" />

                    <div class="flex items-center gap-4">
                        <Button :disabled="gfpsAssembliesForm.processing">Save GFPS assemblies</Button>
                        <p v-show="gfpsAssembliesForm.recentlySuccessful" class="text-sm text-muted-foreground">Saved.</p>
                    </div>
                </form>
            </section>

            <section class="rounded-xl border bg-card p-6 shadow-sm">
                <HeadingSmall title="Employee status breakdown" description="One normalized row per employment status." />

                <form class="mt-6 space-y-5" @submit.prevent="updateEmployeeStatuses">
                    <div class="grid gap-4">
                        <div
                            v-for="(row, index) in employeeStatusesForm.breakdowns"
                            :key="row.employment_status_id"
                            class="grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(0,1fr)_12rem_12rem]"
                        >
                            <div class="text-sm font-medium text-foreground">
                                {{ reportYear.employeeStatuses[index]?.label }}
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`employee_female_${row.employment_status_id}`">Female count</Label>
                                <Input :id="`employee_female_${row.employment_status_id}`" v-model="row.female_count" type="number" min="0" />
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`employee_male_${row.employment_status_id}`">Male count</Label>
                                <Input :id="`employee_male_${row.employment_status_id}`" v-model="row.male_count" type="number" min="0" />
                            </div>
                        </div>
                    </div>

                    <InputError :message="employeeStatusesForm.errors.breakdowns" />

                    <div class="flex items-center gap-4">
                        <Button :disabled="employeeStatusesForm.processing">Save employee breakdown</Button>
                        <p v-show="employeeStatusesForm.recentlySuccessful" class="text-sm text-muted-foreground">Saved.</p>
                    </div>
                </form>
            </section>

            <section class="rounded-xl border bg-card p-6 shadow-sm">
                <HeadingSmall title="RSTL monthly breakdown" description="One normalized row per month, including female-led and male-led counts." />

                <form class="mt-6 space-y-5" @submit.prevent="updateRstlMonthly">
                    <div class="grid gap-4">
                        <div
                            v-for="(row, index) in rstlForm.breakdowns"
                            :key="row.report_month_id"
                            class="grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,10rem))]"
                        >
                            <div class="text-sm font-medium text-foreground">
                                {{ reportYear.rstlMonthly[index]?.label }}
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`rstl_female_${row.report_month_id}`">Female</Label>
                                <Input :id="`rstl_female_${row.report_month_id}`" v-model="row.female_count" type="number" min="0" />
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`rstl_female_led_${row.report_month_id}`">Female-led</Label>
                                <Input :id="`rstl_female_led_${row.report_month_id}`" v-model="row.female_led_count" type="number" min="0" />
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`rstl_male_${row.report_month_id}`">Male</Label>
                                <Input :id="`rstl_male_${row.report_month_id}`" v-model="row.male_count" type="number" min="0" />
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`rstl_male_led_${row.report_month_id}`">Male-led</Label>
                                <Input :id="`rstl_male_led_${row.report_month_id}`" v-model="row.male_led_count" type="number" min="0" />
                            </div>
                        </div>
                    </div>

                    <InputError :message="rstlForm.errors.breakdowns" />

                    <div class="flex items-center gap-4">
                        <Button :disabled="rstlForm.processing">Save RSTL monthly data</Button>
                        <p v-show="rstlForm.recentlySuccessful" class="text-sm text-muted-foreground">Saved.</p>
                    </div>
                </form>
            </section>

            <section class="rounded-xl border bg-card p-6 shadow-sm">
                <HeadingSmall title="Program funding summaries" description="One normalized row per funding program with project counts and PHP amounts." />

                <form class="mt-6 space-y-5" @submit.prevent="updateProgramFunding">
                    <div class="grid gap-4">
                        <div
                            v-for="(row, index) in fundingForm.summaries"
                            :key="row.funding_program_id"
                            class="grid gap-4 rounded-lg border p-4 md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(0,11rem))]"
                        >
                            <div class="text-sm font-medium text-foreground">
                                {{ reportYear.programFunding[index]?.label }}
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`funding_female_projects_${row.funding_program_id}`">Female projects</Label>
                                <Input :id="`funding_female_projects_${row.funding_program_id}`" v-model="row.female_projects" type="number" min="0" />
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`funding_female_amount_${row.funding_program_id}`">Female amount</Label>
                                <Input :id="`funding_female_amount_${row.funding_program_id}`" v-model="row.female_amount" type="number" min="0" step="0.01" />
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`funding_male_projects_${row.funding_program_id}`">Male projects</Label>
                                <Input :id="`funding_male_projects_${row.funding_program_id}`" v-model="row.male_projects" type="number" min="0" />
                            </div>

                            <div class="grid gap-2">
                                <Label :for="`funding_male_amount_${row.funding_program_id}`">Male amount</Label>
                                <Input :id="`funding_male_amount_${row.funding_program_id}`" v-model="row.male_amount" type="number" min="0" step="0.01" />
                            </div>
                        </div>
                    </div>

                    <InputError :message="fundingForm.errors.summaries" />

                    <div class="flex items-center gap-4">
                        <Button :disabled="fundingForm.processing">Save program funding</Button>
                        <p v-show="fundingForm.recentlySuccessful" class="text-sm text-muted-foreground">Saved.</p>
                    </div>
                </form>
            </section>
        </div>
    </AppLayout>
</template>
