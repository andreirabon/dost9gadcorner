<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/AppLayout.vue';
import type { ManagedReportYearListItem } from '@/types/reports';
import { Head, Link, router } from '@inertiajs/vue3';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    FileChartColumnIncreasing,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

interface Props {
    reportYears: ManagedReportYearListItem[];
}

const props = defineProps<Props>();

const searchQuery = ref('');
const statusTab = ref<'all' | 'published' | 'pending'>('all');
const currentPage = ref(1);
const perPage = 10;

const counts = computed(() => ({
    all: props.reportYears.length,
    published: props.reportYears.filter((r) => r.status === 'published').length,
    pending: props.reportYears.filter((r) => r.status === 'pending').length,
}));

const filteredYears = computed((): ManagedReportYearListItem[] => {
    let rows = [...props.reportYears];
    if (statusTab.value !== 'all') {
        rows = rows.filter((r) => r.status === statusTab.value);
    }
    const q = searchQuery.value.trim().toLowerCase();
    if (q) {
        rows = rows.filter(
            (r) =>
                String(r.year).includes(q) ||
                (r.title !== null && r.title.toLowerCase().includes(q)) ||
                (r.description !== null && r.description.toLowerCase().includes(q)),
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

const showingFrom = computed(() => (filteredYears.value.length === 0 ? 0 : (currentPage.value - 1) * perPage + 1));

const showingTo = computed(() => Math.min(currentPage.value * perPage, filteredYears.value.length));

function resetFilters(): void {
    searchQuery.value = '';
    statusTab.value = 'all';
    currentPage.value = 1;
}

function goPage(page: number): void {
    const p = Math.min(Math.max(1, page), totalPages.value);
    currentPage.value = p;
}

const tabs = computed(() => [
    { id: 'all' as const, label: 'All years', count: counts.value.all },
    { id: 'published' as const, label: 'Published', count: counts.value.published },
    { id: 'pending' as const, label: 'Pending', count: counts.value.pending },
]);

const deleteTarget = ref<ManagedReportYearListItem | null>(null);
const deleteProcessing = ref(false);

function openDeleteDialog(reportYear: ManagedReportYearListItem): void {
    deleteTarget.value = reportYear;
}

function onDeleteDialogOpenChange(open: boolean): void {
    if (!open && !deleteProcessing.value) {
        deleteTarget.value = null;
    }
}

function confirmDeleteReportYear(): void {
    const row = deleteTarget.value;
    if (!row) {
        return;
    }

    deleteProcessing.value = true;
    router.delete(route('report-years.destroy', row.id), {
        preserveScroll: true,
        onSuccess: () => {
            deleteTarget.value = null;
        },
        onFinish: () => {
            deleteProcessing.value = false;
        },
    });
}
</script>

<template>
    <AppLayout
        :show-footer="false"
        content-class="flex min-h-0 flex-1 flex-col bg-slate-100 dark:bg-zinc-950"
    >
        <Head title="Report years" />

            <div class="mx-auto w-full max-w-[1400px] space-y-4 px-3 pt-4 pb-8 md:space-y-5 md:px-6">
                <div class="flex flex-col gap-1.5 border-slate-200/90 border-b pb-3 dark:border-zinc-800">
                    <p class="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase dark:text-zinc-400">Yearly reports</p>
                    <p class="flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-zinc-500">
                        <span>List</span>
                        <ChevronRight class="size-3.5 shrink-0 text-slate-300 dark:text-zinc-600" aria-hidden="true" />
                        <span class="font-semibold text-slate-900 dark:text-zinc-50">Yearly reports</span>
                    </p>
                </div>

                <div
                    v-if="reportYears.length === 0"
                    class="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none"
                >
                    <div class="flex flex-col items-center justify-center px-4 py-14 text-center">
                        <FileChartColumnIncreasing class="mb-3 size-10 text-slate-400 dark:text-zinc-500" :stroke-width="1.5" aria-hidden="true" />
                        <p class="text-sm font-medium text-slate-800 dark:text-zinc-200">No years yet</p>
                        <p class="mt-1 max-w-sm text-sm text-slate-600 dark:text-zinc-400">
                            Open
                            <Link
                                class="cursor-pointer font-medium text-teal-700 underline-offset-2 transition-colors hover:text-teal-800 hover:underline dark:text-teal-400 dark:hover:text-teal-300"
                                :href="route('report-years.create')"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Create
                            </Link>
                            in a new tab to add the first report year.
                        </p>
                    </div>
                </div>

                <div
                    v-else
                    class="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none"
                >
                    <div class="flex flex-col gap-4 p-5 sm:p-6">
                        <div class="flex min-w-0 gap-4">
                            <div
                                class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-100 text-slate-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                                aria-hidden="true"
                            >
                                <FileChartColumnIncreasing class="size-6" :stroke-width="2" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h1 class="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl dark:text-zinc-50">
                                    List of report years
                                </h1>
                                <p class="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                                    Add a year in a separate tab, edit data by section, publish when the public site should show it.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="border-slate-100 border-t px-4 py-3 dark:border-zinc-800"
                        role="tablist"
                        aria-label="Filter by status"
                    >
                        <div class="inline-flex flex-wrap gap-1 rounded-lg bg-slate-200/70 p-1 dark:bg-zinc-800/80">
                            <button
                                v-for="tab in tabs"
                                :key="tab.id"
                                type="button"
                                role="tab"
                                :aria-selected="statusTab === tab.id"
                                class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a5d96]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-teal-500/40 dark:focus-visible:ring-offset-zinc-950"
                                :class="
                                    statusTab === tab.id
                                        ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
                                        : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                                "
                                @click="statusTab = tab.id"
                            >
                                {{ tab.label }}
                                <span
                                    class="rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums"
                                    :class="
                                        statusTab === tab.id
                                            ? 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
                                            : 'bg-slate-300/50 text-slate-700 dark:bg-zinc-700 dark:text-zinc-200'
                                    "
                                    >({{ tab.count }})</span
                                >
                            </button>
                        </div>
                    </div>

                    <div
                        class="flex flex-col gap-3 border-slate-100 border-t bg-slate-50/80 px-4 py-3 sm:flex-row sm:items-stretch sm:gap-3 dark:border-zinc-800 dark:bg-zinc-950/40"
                    >
                        <div class="relative min-w-0 flex-1 sm:max-w-md">
                            <label for="report-years-search" class="sr-only">Search report years by year, title, or description</label>
                            <Search
                                class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
                                aria-hidden="true"
                            />
                            <Input
                                id="report-years-search"
                                v-model="searchQuery"
                                type="search"
                                placeholder="Search by year or title"
                                class="h-10 border-slate-200 bg-white pl-9 text-sm shadow-sm dark:border-zinc-700 dark:bg-zinc-950"
                                autocomplete="off"
                            />
                        </div>
                        <div class="flex shrink-0 items-center gap-2 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                class="size-10 shrink-0 cursor-pointer border-slate-200 bg-white shadow-sm transition-colors duration-200 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                                aria-label="Reset filters"
                                @click="resetFilters"
                            >
                                <RefreshCw class="size-4 text-slate-600 dark:text-zinc-400" :stroke-width="2" />
                            </Button>
                            <Button as-child class="report-save-btn">
                                <Link
                                    class="inline-flex cursor-pointer items-center gap-2"
                                    :href="route('report-years.create')"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Plus class="size-4" :stroke-width="2.5" aria-hidden="true" />
                                    Create
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div class="overflow-x-auto border-slate-100 border-t dark:border-zinc-800">
                        <table class="w-full min-w-[720px] table-fixed border-collapse text-left text-sm">
                            <colgroup>
                                <col class="w-20" />
                                <col />
                                <col class="w-36" />
                                <col class="w-36" />
                                <col class="w-36" />
                            </colgroup>
                            <thead>
                                <tr class="bg-slate-50 dark:bg-zinc-900/90">
                                    <th
                                        scope="col"
                                        class="px-4 py-3.5 text-left align-middle text-xs font-extrabold tracking-wide text-slate-900 uppercase dark:text-zinc-50"
                                    >
                                        Year
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-4 py-3.5 text-left align-middle text-xs font-extrabold tracking-wide text-slate-900 uppercase dark:text-zinc-50"
                                    >
                                        Title
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-4 py-3.5 text-left align-middle text-xs font-extrabold tracking-wide text-slate-900 uppercase dark:text-zinc-50"
                                    >
                                        Published
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-4 py-3.5 text-left align-middle text-xs font-extrabold tracking-wide text-slate-900 uppercase dark:text-zinc-50"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-4 py-3.5 text-left align-middle text-xs font-extrabold tracking-wide text-slate-900 uppercase dark:text-zinc-50"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-200 dark:divide-zinc-800">
                                <tr v-if="filteredYears.length === 0">
                                    <td colspan="5" class="px-4 py-10 text-center text-sm text-slate-600 dark:text-zinc-400">
                                        No matching report years.
                                        <button
                                            type="button"
                                            class="ml-1 cursor-pointer font-medium text-red-700 underline-offset-2 hover:underline dark:text-red-400"
                                            @click="resetFilters"
                                        >
                                            Clear filters
                                        </button>
                                    </td>
                                </tr>
                                <template v-else>
                                    <tr
                                        v-for="reportYear in paginatedYears"
                                        :key="reportYear.id"
                                        class="cursor-default bg-white transition-[background-color,box-shadow] duration-200 motion-reduce:transition-none hover:bg-slate-100 hover:shadow-[inset_3px_0_0_0_#4a5d96] motion-reduce:hover:shadow-none dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:shadow-[inset_3px_0_0_0_rgb(13,148,136)]"
                                    >
                                        <td class="px-4 py-4 align-middle">
                                            <span class="font-semibold text-slate-900 tabular-nums dark:text-zinc-50">{{ reportYear.year }}</span>
                                        </td>
                                        <td class="min-w-0 px-4 py-4 align-middle text-slate-800 dark:text-zinc-200">
                                            <span class="line-clamp-2 wrap-break-word">{{ reportYear.title ?? '—' }}</span>
                                        </td>
                                        <td class="whitespace-nowrap px-4 py-4 align-middle text-slate-600 tabular-nums dark:text-zinc-400">
                                            {{ reportYear.publishedAt ?? '—' }}
                                        </td>
                                        <td class="px-4 py-4 align-middle">
                                            <span
                                                v-if="reportYear.status === 'published'"
                                                class="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-900 uppercase dark:bg-emerald-950/55 dark:text-emerald-300"
                                            >
                                                Published
                                            </span>
                                            <span
                                                v-else
                                                class="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 dark:bg-amber-950/60 dark:text-amber-200"
                                            >
                                                Pending
                                            </span>
                                        </td>
                                        <td class="px-4 py-4 align-middle">
                                            <div class="flex flex-wrap items-center justify-start gap-2">
                                                <Tooltip>
                                                    <TooltipTrigger as-child>
                                                        <Button
                                                            as-child
                                                            variant="outline"
                                                            class="h-10 w-10 shrink-0 cursor-pointer border-amber-300/90 bg-amber-50 p-0 shadow-sm transition-colors duration-200 hover:border-amber-400 hover:bg-amber-100 dark:border-amber-700/60 dark:bg-amber-950/45 dark:hover:border-amber-600 dark:hover:bg-amber-950/70"
                                                        >
                                                            <Link
                                                                class="inline-flex size-full items-center justify-center text-amber-700 dark:text-amber-400"
                                                                :href="route('report-years.edit', reportYear.id)"
                                                                prefetch
                                                                :aria-label="`Edit report year ${reportYear.year}`"
                                                            >
                                                                <Pencil class="size-5" :stroke-width="2" aria-hidden="true" />
                                                            </Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">Edit</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger as-child>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            class="h-10 w-10 shrink-0 cursor-pointer border-red-300/90 bg-red-50 p-0 shadow-sm transition-colors duration-200 hover:border-red-400 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/50 dark:hover:border-red-800 dark:hover:bg-red-950/75"
                                                            :aria-label="`Delete report year ${reportYear.year}`"
                                                            @click="openDeleteDialog(reportYear)"
                                                        >
                                                            <Trash2 class="size-5 text-red-600 dark:text-red-400" :stroke-width="2" aria-hidden="true" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top">Delete</TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>

                    <div
                        class="flex flex-col gap-3 border-slate-100 border-t bg-slate-50/80 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950/40"
                    >
                        <p class="text-sm text-slate-600 dark:text-zinc-400">
                            <template v-if="filteredYears.length === 0">Showing 0 of 0 results</template>
                            <template v-else> Showing {{ showingFrom }}–{{ showingTo }} of {{ filteredYears.length }} results </template>
                        </p>
                        <div v-if="filteredYears.length > 0" class="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                class="size-9 cursor-pointer border-slate-200 bg-white shadow-sm transition-colors duration-200 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-950"
                                :disabled="currentPage <= 1"
                                aria-label="First page"
                                @click="goPage(1)"
                            >
                                <ChevronsLeft class="size-4" :stroke-width="2" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                class="size-9 cursor-pointer border-slate-200 bg-white shadow-sm transition-colors duration-200 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-950"
                                :disabled="currentPage <= 1"
                                aria-label="Previous page"
                                @click="goPage(currentPage - 1)"
                            >
                                <ChevronLeft class="size-4" :stroke-width="2" />
                            </Button>
                            <span
                                class="inline-flex min-w-10 items-center justify-center rounded-md bg-[#4a5d96] px-2 py-1.5 text-sm font-medium text-white tabular-nums dark:border dark:border-teal-700/45 dark:bg-teal-900 dark:text-teal-50"
                                >{{ currentPage }}</span
                            >
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                class="size-9 cursor-pointer border-slate-200 bg-white shadow-sm transition-colors duration-200 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-950"
                                :disabled="currentPage >= totalPages"
                                aria-label="Next page"
                                @click="goPage(currentPage + 1)"
                            >
                                <ChevronRight class="size-4" :stroke-width="2" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                class="size-9 cursor-pointer border-slate-200 bg-white shadow-sm transition-colors duration-200 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-950"
                                :disabled="currentPage >= totalPages"
                                aria-label="Last page"
                                @click="goPage(totalPages)"
                            >
                                <ChevronsRight class="size-4" :stroke-width="2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        <Dialog :open="deleteTarget !== null" @update:open="onDeleteDialogOpenChange">
            <DialogContent
                class="border-slate-200 sm:max-w-md dark:border-zinc-700"
                @pointer-down-outside="(e: Event) => deleteProcessing && e.preventDefault()"
            >
                <DialogHeader>
                    <DialogTitle>Delete report year?</DialogTitle>
                    <DialogDescription v-if="deleteTarget" class="text-left">
                        <span class="font-medium text-foreground"
                            >Year {{ deleteTarget.year }}<template v-if="deleteTarget.title"> — {{ deleteTarget.title }}</template></span
                        >
                        will be removed. Related section data goes with it. Cannot undo.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter class="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        class="cursor-pointer"
                        :disabled="deleteProcessing"
                        @click="onDeleteDialogOpenChange(false)"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        class="cursor-pointer"
                        :disabled="deleteProcessing"
                        @click="confirmDeleteReportYear"
                    >
                        {{ deleteProcessing ? 'Deleting…' : 'Delete' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>
