<script setup lang="ts">
import ReportPageShell from '@/components/reports/ReportPageShell.vue';
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/AppLayout.vue';
import type { ManagedReportYearListItem } from '@/types/reports';
import { Head, Link } from '@inertiajs/vue3';
import { FileChartColumnIncreasing, Plus } from 'lucide-vue-next';

import type { BreadcrumbItem } from '@/types';

interface Props {
    reportYears: ManagedReportYearListItem[];
}

defineProps<Props>();

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Report years',
        href: '/report-years',
    },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems" :show-footer="false">
        <Head title="Report years" />

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
                                    Yearly reports
                                </h1>
                                <p class="mt-1 max-w-2xl text-sm leading-snug text-zinc-600 dark:text-zinc-400">
                                    Add a year in a separate tab, edit data by section, publish when the public site should show it.
                                </p>
                            </div>
                        </div>
                        <Button
                            as-child
                            variant="outline"
                            class="h-9 shrink-0 gap-1.5 border-zinc-300 bg-white px-3 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                        >
                            <Link
                                class="inline-flex cursor-pointer items-center gap-1.5"
                                :href="route('report-years.create')"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Plus class="size-4" :stroke-width="2" aria-hidden="true" />
                                New year
                            </Link>
                        </Button>
                    </div>
                </header>

                <section class="report-panel p-4 sm:p-5">
                    <HeadingSmall variant="report" title="All years" description="Edit sections, totals, and publish state per year." />

                    <div
                        v-if="reportYears.length === 0"
                        class="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300/80 bg-zinc-100/40 px-4 py-10 text-center dark:border-zinc-700 dark:bg-zinc-950/40"
                    >
                        <FileChartColumnIncreasing class="mb-3 size-9 text-zinc-400 dark:text-zinc-500" :stroke-width="1.5" aria-hidden="true" />
                        <p class="text-sm font-medium text-zinc-800 dark:text-zinc-200">No years yet</p>
                        <p class="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                            Open
                            <Link
                                class="font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
                                :href="route('report-years.create')"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                New year
                            </Link>
                            in a new tab to add the first report year.
                        </p>
                    </div>

                    <div v-else class="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                        <table class="w-full min-w-176 border-collapse text-left text-sm">
                            <thead>
                                <tr class="border-b border-zinc-200 bg-zinc-50/90 dark:border-zinc-800 dark:bg-zinc-900/50">
                                    <th scope="col" class="px-3 py-2 text-xs font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-50">Year</th>
                                    <th scope="col" class="px-3 py-2 text-xs font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-50">Title</th>
                                    <th scope="col" class="px-3 py-2 text-xs font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-50">Status</th>
                                    <th scope="col" class="px-3 py-2 text-xs font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-50">Theme</th>
                                    <th scope="col" class="px-3 py-2 text-xs font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-50">Published</th>
                                    <th scope="col" class="px-3 py-2 text-right text-xs font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-50">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
                                <tr
                                    v-for="reportYear in reportYears"
                                    :key="reportYear.id"
                                    class="bg-white transition-colors hover:bg-zinc-50/80 dark:bg-zinc-950 dark:hover:bg-zinc-900/40"
                                >
                                    <td class="px-3 py-2 font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                                        {{ reportYear.year }}
                                    </td>
                                    <td class="max-w-56 px-3 py-2 text-zinc-800 dark:text-zinc-200">
                                        <span class="line-clamp-2">{{ reportYear.title ?? '—' }}</span>
                                    </td>
                                    <td class="px-3 py-2">
                                        <span
                                            :class="[
                                                'inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
                                                reportYear.status === 'published'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                                    : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200',
                                            ]"
                                        >
                                            {{ reportYear.status }}
                                        </span>
                                    </td>
                                    <td class="px-3 py-2 capitalize text-zinc-700 dark:text-zinc-300">
                                        {{ reportYear.colorTheme ?? '—' }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-2 text-zinc-600 dark:text-zinc-400">
                                        {{ reportYear.publishedAt ?? '—' }}
                                    </td>
                                    <td class="px-3 py-2 text-right">
                                        <Button as-child variant="ghost" class="report-btn-secondary h-8 shrink-0 px-3 text-xs">
                                            <Link class="cursor-pointer" :href="route('report-years.edit', reportYear.id)" prefetch>Open editor</Link>
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </ReportPageShell>
    </AppLayout>
</template>
