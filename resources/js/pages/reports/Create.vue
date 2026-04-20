<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import ReportPanelWatermark from '@/components/shared/ReportPanelWatermark.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { REPORT_YEAR_FIELD_LIMITS } from '@/constants/reportYearFields';
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { FileChartColumnIncreasing, FilePlus, Plus } from 'lucide-vue-next';

const currentYear = new Date().getFullYear();

const form = useForm({
    year: currentYear,
    title: '',
    description: '',
    status: 'pending',
});

const submit = () => {
    form.post(route('report-years.store'));
};
</script>

<template>
    <AppLayout
        :show-footer="false"
        compact-main-column
        content-class="flex w-full flex-col bg-slate-100 dark:bg-zinc-950"
    >
        <Head title="New report year" />

            <div class="mx-auto w-full max-w-[920px] space-y-2 px-3 pt-2 pb-3 sm:px-4">
                <header class="border-slate-200 border-b pb-2 dark:border-zinc-800">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex min-w-0 items-start gap-2.5">
                            <div
                                class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200/90 bg-slate-100 text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                aria-hidden="true"
                            >
                                <FileChartColumnIncreasing class="size-[18px]" :stroke-width="2" />
                            </div>
                            <div class="min-w-0">
                                <h1 class="text-lg font-semibold tracking-tight text-slate-900 md:text-xl dark:text-zinc-50">
                                    New year
                                </h1>
                                <p class="mt-0.5 max-w-2xl text-sm leading-snug text-slate-600 dark:text-zinc-400">
                                    Creates the shell; open the editor next to fill GFPS, RSTL, funding, and other sections.
                                </p>
                            </div>
                        </div>
                        <Button
                            as-child
                            variant="outline"
                            class="h-9 shrink-0 border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm transition-colors duration-200 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                        >
                            <Link class="cursor-pointer" :href="route('report-years.index')" prefetch>Back to all years</Link>
                        </Button>
                    </div>
                </header>

                <section class="report-panel scroll-mt-20 py-3! px-3! sm:px-4! sm:py-3!">
                    <ReportPanelWatermark>
                        <FilePlus class="size-32 sm:size-40" :stroke-width="1.5" />
                    </ReportPanelWatermark>
                    <HeadingSmall
                        variant="report"
                        title="Details"
                        description="Year, optional title and description, and status for the public year card."
                    />

                    <form
                        class="report-form mt-2 space-y-2"
                        autocomplete="off"
                        @submit.prevent="submit"
                    >
                        <div class="grid gap-1">
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

                        <div class="grid gap-1">
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
                            <p class="text-xs leading-tight text-zinc-500 dark:text-zinc-500">
                                Max {{ REPORT_YEAR_FIELD_LIMITS.title }} characters (matches database).
                            </p>
                            <InputError :message="form.errors.title" />
                        </div>

                        <div class="grid gap-1">
                            <Label for="description">Description</Label>
                            <textarea
                                id="description"
                                v-model="form.description"
                                name="description"
                                rows="2"
                                class="report-textarea min-h-14"
                                placeholder="Short description for the public year card"
                                :maxlength="REPORT_YEAR_FIELD_LIMITS.description"
                            />
                            <p class="text-xs text-zinc-500 dark:text-zinc-500">
                                {{ String(form.description ?? '').length }} / {{ REPORT_YEAR_FIELD_LIMITS.description }}
                            </p>
                            <InputError :message="form.errors.description" />
                        </div>

                        <div class="grid gap-1">
                            <Label for="status">Status</Label>
                            <select id="status" v-model="form.status" name="status" class="report-select">
                                <option value="pending">Pending</option>
                                <option value="published">Published</option>
                            </select>
                            <InputError :message="form.errors.status" />
                        </div>

                        <div class="flex flex-wrap items-center gap-2 pt-0.5">
                            <Button type="submit" class="report-save-btn" :disabled="form.processing">
                                <Plus class="size-4" :stroke-width="2.5" aria-hidden="true" />
                                Create year
                            </Button>
                            <p v-show="form.recentlySuccessful" class="text-sm text-zinc-500 dark:text-zinc-400">Saved.</p>
                        </div>
                    </form>
                </section>
            </div>
    </AppLayout>
</template>
