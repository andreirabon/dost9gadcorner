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
import { Head, Link, router, usePage } from '@inertiajs/vue3';
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
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';

interface Props {
 reportYears: ManagedReportYearListItem[];
}

const props = defineProps<Props>();

const page = usePage();
const canCreate = computed(() => page.props.auth.user?.can?.createReportYears === true);
const canDelete = computed(() => page.props.auth.user?.can?.deleteReportYears === true);

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
 content-class="flex min-h-0 flex-1 flex-col bg-linear-to-b from-purple-950 via-fuchsia-950/28 to-purple-950 text-purple-50 selection:bg-purple-500/30"
 >
 <Head title="GAD Database" />

 <div class="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
 <div
 aria-hidden="true"
 class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(192,38,211,0.12),transparent_55%)]"
 />

 <div class="relative z-10 mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
 <div>
 <h1 class="text-2xl font-semibold tracking-tight text-purple-100 sm:text-3xl md:text-4xl">
 Sex Disaggregated Data Reports
 </h1>
 <p class="mt-2 text-sm text-purple-200/80 font-light max-w-2xl">
 Track, analyze, and manage region-wide gender-disaggregated datasets, human resource demographics, and institutional GAD program statistics.
 </p>
 </div>
 <div v-if="canCreate">
 <Button
 as-child
 class="inline-flex h-11 items-center gap-2 rounded-xl bg-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out hover:bg-purple-500 hover:shadow-purple-950/40 active:scale-[0.97]"
 >
 <Link :href="route('report-years.create')">
 <Plus class="size-4" :stroke-width="2.5" aria-hidden="true" />
 Create new year
 </Link>
 </Button>
 </div>
 </div>

 <!-- Empty State -->
 <div
 v-if="reportYears.length === 0"
 class="flex flex-col items-center justify-center rounded-[2rem] border border-purple-400/35 bg-purple-900/55 ring-1 ring-white/10 px-4 py-20 text-center shadow-sm"
 >
 <FileChartColumnIncreasing class="mb-4 size-10 text-purple-300/50" :stroke-width="1.5" aria-hidden="true" />
 <h3 class="text-lg font-medium text-purple-50">No reports found</h3>
 <p class="mt-2 max-w-sm text-sm font-light text-purple-200/70">
 <template v-if="canCreate">
 Get started by creating a new year to track GAD metrics.
 </template>
 <template v-else>
 No reports have been created yet. Please check back later or contact an administrator.
 </template>
 </p>
 <div v-if="canCreate" class="mt-6">
 <Button
 as-child
 variant="outline"
 class="h-11 rounded-xl border border-purple-500/45 bg-purple-950 text-purple-100 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out hover:border-white/20 hover:bg-purple-950/5 hover:text-purple-50 active:scale-[0.97]"
 >
 <Link :href="route('report-years.create')">
 <Plus class="size-4 mr-2" :stroke-width="2" />
 Create Report Year
 </Link>
 </Button>
 </div>
 </div>

 <!-- Main Data Shell -->
 <div
 v-else
 class="flex flex-col rounded-[2rem] border border-purple-400/35 bg-purple-900/55 ring-1 ring-white/10 shadow-sm overflow-hidden"
 >
 <!-- Controls -->
 <div class="flex flex-col gap-4 border-b border-purple-500/45 p-4 sm:flex-row sm:items-center sm:justify-between">
 <div class="flex items-center gap-1 rounded-xl bg-black/20 p-1">
 <button
 v-for="tab in tabs"
 :key="tab.id"
 type="button"
 role="tab"
 :aria-selected="statusTab === tab.id"
 class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out"
 :class="
 statusTab === tab.id
 ? 'bg-purple-600 text-white shadow-md shadow-purple-950/30'
 : 'text-purple-200/70 hover:text-purple-100 hover:bg-purple-950'
 "
 @click="statusTab = tab.id"
 >
 {{ tab.label }}
 <span
 class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
 :class="
 statusTab === tab.id
 ? 'bg-purple-950/20 text-white'
 : 'bg-purple-950 text-purple-200/70'
 "
 >
 {{ tab.count }}
 </span>
 </button>
 </div>

 <div class="flex items-center gap-3 w-full sm:w-auto">
 <div class="relative w-full sm:w-64">
 <Search
 class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-purple-300/50"
 aria-hidden="true"
 />
 <Input
 v-model="searchQuery"
 type="search"
 placeholder="Search reports..."
 class="h-10 w-full rounded-xl border border-purple-500/45 bg-black/20 pl-9 text-sm text-purple-50 transition-colors duration-300 placeholder:text-purple-300/50 focus-visible:border-purple-400 focus-visible:bg-purple-950/5 focus-visible:ring-4 focus-visible:ring-purple-500/20"
 />
 </div>
 <Button
 type="button"
 variant="outline"
 size="icon"
 class="size-10 shrink-0 rounded-xl border border-purple-500/45 bg-purple-950 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out hover:border-white/20 hover:bg-purple-950/5 active:scale-[0.97]"
 aria-label="Reset filters"
 @click="resetFilters"
 >
 <RefreshCw class="size-4 text-purple-200/70" :stroke-width="2" />
 </Button>
 </div>
 </div>

 <!-- Table -->
 <div class="overflow-x-auto">
 <table class="w-full min-w-[720px] text-left text-sm">
 <thead>
 <tr class="border-b border-purple-500/45 bg-purple-950/[0.02]">
 <th scope="col" class="px-6 py-4 text-xs font-semibold tracking-widest text-fuchsia-300/90 uppercase w-24">Year</th>
 <th scope="col" class="px-6 py-4 text-xs font-semibold tracking-widest text-fuchsia-300/90 uppercase">Title</th>
 <th scope="col" class="px-6 py-4 text-xs font-semibold tracking-widest text-fuchsia-300/90 uppercase w-40">Published</th>
 <th scope="col" class="px-6 py-4 text-xs font-semibold tracking-widest text-fuchsia-300/90 uppercase w-32">Status</th>
 <th scope="col" class="px-6 py-4 text-xs font-semibold tracking-widest text-fuchsia-300/90 uppercase w-32">Actions</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-white/5">
 <tr v-if="filteredYears.length === 0">
 <td colspan="5" class="px-6 py-12 text-center text-sm font-light text-purple-200/70">
 No reports found matching your criteria.
 <button
 type="button"
 class="ml-1 font-medium text-fuchsia-300/90 underline underline-offset-4 hover:text-fuchsia-200"
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
 class="group transition-colors duration-300 hover:bg-black/20"
 >
 <td class="px-6 py-5 align-middle">
 <span class="font-medium text-purple-50 tabular-nums">{{ reportYear.year }}</span>
 </td>
 <td class="px-6 py-5 align-middle text-purple-200/70/80 font-light">
 <span class="line-clamp-1">{{ reportYear.title ?? '—' }}</span>
 </td>
 <td class="px-6 py-5 align-middle text-purple-200/70 tabular-nums font-light">
 {{ reportYear.publishedAt ?? '—' }}
 </td>
 <td class="px-6 py-5 align-middle">
 <div class="flex items-center gap-2">
 <div
 class="size-1.5 rounded-full"
 :class="reportYear.status === 'published' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'"
 />
 <span class="text-[13px] font-medium capitalize text-purple-200/70">
 {{ reportYear.status }}
 </span>
 </div>
 </td>
 <td class="px-6 py-5 align-middle">
 <div class="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
 <Tooltip>
 <TooltipTrigger as-child>
 <Button
 as-child
 variant="ghost"
 size="icon"
 class="size-9 rounded-lg text-purple-200/70 hover:bg-purple-950/5 hover:text-purple-50 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out"
 >
 <Link
 :href="route('report-years.edit', reportYear.id)"
 prefetch
 :aria-label="`Edit report year ${reportYear.year}`"
 >
 <Pencil class="size-4" :stroke-width="2" aria-hidden="true" />
 </Link>
 </Button>
 </TooltipTrigger>
 <TooltipContent side="top" hide-arrow class="bg-purple-950 text-purple-50 border-purple-500/45">Edit</TooltipContent>
 </Tooltip>
 <Tooltip v-if="canDelete">
 <TooltipTrigger as-child>
 <Button
 type="button"
 variant="ghost"
 size="icon"
 class="size-9 rounded-lg text-purple-200/70 hover:bg-red-500/20 hover:text-red-400 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out"
 :aria-label="`Delete report year ${reportYear.year}`"
 @click="openDeleteDialog(reportYear)"
 >
 <Trash2 class="size-4" :stroke-width="2" aria-hidden="true" />
 </Button>
 </TooltipTrigger>
 <TooltipContent side="top" hide-arrow class="bg-purple-950 text-purple-50 border-purple-500/45">Delete</TooltipContent>
 </Tooltip>
 </div>
 </td>
 </tr>
 </template>
 </tbody>
 </table>
 </div>

 <!-- Pagination -->
 <div class="flex items-center justify-between border-t border-purple-500/45 p-4">
 <p class="text-sm font-light text-purple-200/70 tabular-nums">
 <template v-if="filteredYears.length === 0">0 of 0</template>
 <template v-else>Showing {{ showingFrom }}–{{ showingTo }} of {{ filteredYears.length }}</template>
 </p>
 <div v-if="filteredYears.length > 0" class="flex items-center gap-1">
 <Button
 type="button"
 variant="outline"
 size="icon"
 class="size-9 rounded-lg border border-purple-500/45 bg-transparent text-purple-200/70 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out hover:bg-purple-950/5 disabled:opacity-30 disabled:hover:bg-transparent"
 :disabled="currentPage <= 1"
 @click="goPage(1)"
 >
 <ChevronsLeft class="size-4" :stroke-width="2" />
 </Button>
 <Button
 type="button"
 variant="outline"
 size="icon"
 class="size-9 rounded-lg border border-purple-500/45 bg-transparent text-purple-200/70 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out hover:bg-purple-950/5 disabled:opacity-30 disabled:hover:bg-transparent"
 :disabled="currentPage <= 1"
 @click="goPage(currentPage - 1)"
 >
 <ChevronLeft class="size-4" :stroke-width="2" />
 </Button>
 <span class="inline-flex min-w-9 items-center justify-center text-sm font-medium tabular-nums text-purple-50">
 {{ currentPage }}
 </span>
 <Button
 type="button"
 variant="outline"
 size="icon"
 class="size-9 rounded-lg border border-purple-500/45 bg-transparent text-purple-200/70 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out hover:bg-purple-950/5 disabled:opacity-30 disabled:hover:bg-transparent"
 :disabled="currentPage >= totalPages"
 @click="goPage(currentPage + 1)"
 >
 <ChevronRight class="size-4" :stroke-width="2" />
 </Button>
 <Button
 type="button"
 variant="outline"
 size="icon"
 class="size-9 rounded-lg border border-purple-500/45 bg-transparent text-purple-200/70 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out hover:bg-purple-950/5 disabled:opacity-30 disabled:hover:bg-transparent"
 :disabled="currentPage >= totalPages"
 @click="goPage(totalPages)"
 >
 <ChevronsRight class="size-4" :stroke-width="2" />
 </Button>
 </div>
 </div>
 </div>
 </div>

 <!-- Delete Dialog -->
 <Dialog :open="deleteTarget !== null" @update:open="onDeleteDialogOpenChange">
 <DialogContent
 class="sm:max-w-md border border-purple-400/35 bg-purple-900/55 text-purple-100 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
 @pointer-down-outside="(e: Event) => deleteProcessing && e.preventDefault()"
 >
 <DialogHeader>
 <DialogTitle class="text-purple-50">Delete report year</DialogTitle>
 <DialogDescription v-if="deleteTarget" class="text-purple-200/70/70">
 This will permanently delete the report for
 <span class="font-medium text-fuchsia-300/90">{{ deleteTarget.year }}</span>.
 All associated data will be removed. This action cannot be undone.
 </DialogDescription>
 </DialogHeader>
 <DialogFooter class="gap-2 sm:gap-0 mt-6">
 <Button
 type="button"
 variant="outline"
 class="rounded-xl border border-purple-500/45 bg-transparent text-purple-200/70 hover:bg-purple-950 active:scale-[0.97]"
 :disabled="deleteProcessing"
 @click="onDeleteDialogOpenChange(false)"
 >
 Cancel
 </Button>
 <Button
 type="button"
 variant="destructive"
 class="rounded-xl bg-red-600/90 text-white hover:bg-red-500 active:scale-[0.97] border border-red-500/50"
 :disabled="deleteProcessing"
 @click="confirmDeleteReportYear"
 >
 {{ deleteProcessing ? 'Deleting...' : 'Delete report' }}
 </Button>
 </DialogFooter>
 </DialogContent>
 </Dialog>
 </AppLayout>
</template>
