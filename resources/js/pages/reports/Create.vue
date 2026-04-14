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
import { Head, Link, useForm } from '@inertiajs/vue3';
import { FileChartColumnIncreasing } from 'lucide-vue-next';

const currentYear = new Date().getFullYear();

const form = useForm({
    year: currentYear,
    title: '',
    description: '',
    status: 'pending',
    color_theme: 'violet',
});

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Report years',
        href: '/report-years',
    },
    {
        title: 'New year',
        href: '/report-years/create',
    },
];

const submit = () => {
    form.post(route('report-years.store'));
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems" :show-footer="false">
        <Head title="New report year" />

        <ReportPageShell>
            <div class="space-y-4 md:space-y-5">
                <header class="border-zinc-200 border-b pb-4 dark:border-zinc-800">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex min-w-0 items-start gap-3">
                            <div
                                class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300"
                                aria-hidden="true"
                            >
                                <FileChartColumnIncreasing class="size-4" :stroke-width="2" />
                            </div>
                            <div class="min-w-0">
                                <h1 class="text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl dark:text-zinc-50">
                                    New year
                                </h1>
                                <p class="mt-1 max-w-2xl text-sm leading-snug text-zinc-600 dark:text-zinc-400">
                                    Creates the shell; open the editor next to fill GFPS, RSTL, funding, and other sections.
                                </p>
                            </div>
                        </div>
                        <Button
                            as-child
                            variant="outline"
                            class="h-9 shrink-0 border-zinc-300 bg-white px-3 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                        >
                            <Link class="cursor-pointer" :href="route('report-years.index')" prefetch>Back to all years</Link>
                        </Button>
                    </div>
                </header>

                <section class="report-panel scroll-mt-20 p-4 sm:p-5">
                    <HeadingSmall
                        variant="report"
                        title="Details"
                        description="Year, optional title and description, status, and theme for the public year card."
                    />

                    <form
                        class="mt-4 space-y-4 [&_label]:text-zinc-700 dark:[&_label]:text-zinc-300"
                        autocomplete="off"
                        @submit.prevent="submit"
                    >
                        <div class="grid gap-2">
                            <Label for="year">Year</Label>
                            <Input
                                id="year"
                                v-model="form.year"
                                name="year"
                                type="number"
                                :min="REPORT_YEAR_FIELD_LIMITS.yearMin"
                                :max="REPORT_YEAR_FIELD_LIMITS.yearMax"
                                inputmode="numeric"
                                class="report-field rounded-lg shadow-sm"
                            />
                            <InputError :message="form.errors.year" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="title">Title</Label>
                            <Input
                                id="title"
                                v-model="form.title"
                                name="title"
                                type="text"
                                placeholder="Optional custom title"
                                :maxlength="REPORT_YEAR_FIELD_LIMITS.title"
                                class="report-field rounded-lg shadow-sm"
                            />
                            <p class="text-xs text-zinc-500 dark:text-zinc-500">Max {{ REPORT_YEAR_FIELD_LIMITS.title }} characters (matches database).</p>
                            <InputError :message="form.errors.title" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="description">Description</Label>
                            <textarea
                                id="description"
                                v-model="form.description"
                                name="description"
                                rows="4"
                                class="report-textarea"
                                placeholder="Short description for the public year card"
                                :maxlength="REPORT_YEAR_FIELD_LIMITS.description"
                            />
                            <p class="text-xs text-zinc-500 dark:text-zinc-500">
                                {{ String(form.description ?? '').length }} / {{ REPORT_YEAR_FIELD_LIMITS.description }}
                            </p>
                            <InputError :message="form.errors.description" />
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="grid gap-2">
                                <Label for="status">Status</Label>
                                <select id="status" v-model="form.status" name="status" class="report-select">
                                    <option value="pending">Pending</option>
                                    <option value="published">Published</option>
                                </select>
                                <InputError :message="form.errors.status" />
                            </div>

                            <div class="grid gap-2">
                                <Label for="color_theme">Color theme</Label>
                                <select id="color_theme" v-model="form.color_theme" name="color_theme" class="report-select">
                                    <option value="violet">Violet</option>
                                    <option value="purple">Purple</option>
                                    <option value="indigo">Indigo</option>
                                </select>
                                <InputError :message="form.errors.color_theme" />
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-4">
                            <Button type="submit" variant="ghost" class="report-btn-primary h-9 px-5" :disabled="form.processing">
                                Create year
                            </Button>
                            <p v-show="form.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>
            </div>
        </ReportPageShell>
    </AppLayout>
</template>
