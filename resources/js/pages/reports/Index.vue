<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatPublishedAt } from '@/helpers/formatPublishedAt';
import AppLayout from '@/layouts/AppLayout.vue';
import type { ManagedReportYearListItem } from '@/types/reports';
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    FileChartColumnIncreasing,
    Lock,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    Unlock,
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';

interface Props {
    reportYears: ManagedReportYearListItem[];
    canToggleLock: boolean;
}

const props = defineProps<Props>();

const page = usePage();
const canCreate = computed(() => page.props.auth.user?.can?.createReportYears === true);
const canDelete = computed(() => page.props.auth.user?.can?.deleteReportYears === true);

const localReportYears = ref<ManagedReportYearListItem[]>([...props.reportYears]);

watch(
    () => props.reportYears,
    (newVal) => {
        localReportYears.value = [...newVal];
    },
    { deep: true },
);

const searchQuery = ref('');
const statusTab = ref<'all' | 'published' | 'pending'>('all');
const currentPage = ref(1);
const perPage = 10;

const counts = computed(() => ({
    all: localReportYears.value.length,
    published: localReportYears.value.filter((r) => r.status === 'published').length,
    pending: localReportYears.value.filter((r) => r.status === 'pending').length,
}));

const filteredYears = computed((): ManagedReportYearListItem[] => {
    let rows = [...localReportYears.value];
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
    <AppLayout :show-footer="false" content-class="report-years-page">
        <Head title="GAD Database" />

        <div class="report-years-inner">
            <header class="report-years-header">
                <h1 class="report-years-title">Sex Disaggregated Data Reports</h1>
                <Link v-if="canCreate" :href="route('report-years.create')" class="report-years-btn-primary">
                    <Plus class="size-4" :stroke-width="2.5" aria-hidden="true" />
                    Create new year
                </Link>
            </header>

            <div v-if="reportYears.length === 0" class="report-years-empty">
                <FileChartColumnIncreasing class="mb-4 size-10 text-slate-300" :stroke-width="1.5" aria-hidden="true" />
                <h3 class="text-lg font-medium text-black">No reports found</h3>
                <p class="mt-2 max-w-sm text-sm text-black">
                    <template v-if="canCreate"> Get started by creating a new year to track GAD metrics. </template>
                    <template v-else> No reports have been created yet. Please check back later or contact an administrator. </template>
                </p>
                <Link v-if="canCreate" :href="route('report-years.create')" class="report-years-btn-primary mt-6">
                    <Plus class="size-4" :stroke-width="2" aria-hidden="true" />
                    Create report year
                </Link>
            </div>

            <div v-else class="report-years-shell">
                <div class="report-years-toolbar">
                    <div class="report-years-filter-tabs" role="group" aria-label="Filter by status">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            type="button"
                            :aria-pressed="statusTab === tab.id"
                            class="report-years-filter-tab"
                            :class="{ 'is-active': statusTab === tab.id }"
                            @click="statusTab = tab.id"
                        >
                            {{ tab.label }}
                            <span class="report-years-filter-count">{{ tab.count }}</span>
                        </button>
                    </div>

                    <div class="flex w-full items-center gap-2 sm:w-auto">
                        <div class="report-years-search-wrap">
                            <Search class="report-years-search-icon" aria-hidden="true" />
                            <Input
                                v-model="searchQuery"
                                type="search"
                                class="report-years-search"
                                placeholder="Search year or title"
                                aria-label="Search report years"
                            />
                        </div>
                        <button type="button" class="report-years-btn-icon" aria-label="Reset filters" @click="resetFilters">
                            <RefreshCw class="size-4" :stroke-width="2" />
                        </button>
                    </div>
                </div>

                <div class="report-years-table-wrap">
                    <table class="report-years-table">
                        <caption class="sr-only">
                            Report years, newest first. Use the status filters and search above to narrow the list.
                        </caption>
                        <thead>
                            <tr>
                                <th scope="col" class="w-20">Year</th>
                                <th scope="col">Title</th>
                                <th scope="col" class="w-32">Status</th>
                                <th scope="col" class="w-56">Published</th>
                                <th scope="col" class="w-28 text-right">Actions</th>
                            </tr>
                        </thead>
                        <transition-group name="list" tag="tbody">
                            <tr v-if="filteredYears.length === 0" key="empty">
                                <td colspan="5" class="report-years-no-match">
                                    No report years match your filters.
                                    <button type="button" class="report-years-inline-link" @click="resetFilters">Clear filters</button>
                                </td>
                            </tr>
                            <tr
                                v-for="reportYear in paginatedYears"
                                :key="reportYear.id"
                                :class="{ 'is-highlighted': (reportYear as any)._justUpdated }"
                            >
                                <td>
                                    <span class="report-years-table-year">
                                        {{ reportYear.year }}
                                        <Lock v-if="reportYear.isLocked" class="report-years-table-lock" aria-hidden="true" />
                                        <span v-if="reportYear.isLocked" class="sr-only">Locked</span>
                                    </span>
                                </td>
                                <td>
                                    <Link :href="route('report-years.edit', reportYear.id)" prefetch class="report-years-table-title">
                                        {{ reportYear.title ?? `Report year ${reportYear.year}` }}
                                    </Link>
                                </td>
                                <td>
                                    <span class="report-years-status">
                                        <span
                                            class="report-years-status-dot"
                                            :class="
                                                reportYear.status === 'published'
                                                    ? 'report-years-status-dot--published'
                                                    : 'report-years-status-dot--pending'
                                            "
                                            aria-hidden="true"
                                        />
                                        {{ reportYear.status }}
                                    </span>
                                </td>
                                <td class="report-years-table-meta">
                                    {{ formatPublishedAt(reportYear.publishedAt) ?? '—' }}
                                </td>
                                <td>
                                    <div class="report-years-row-actions">
                                        <Tooltip v-if="canToggleLock">
                                            <TooltipTrigger as-child>
                                                <button
                                                    type="button"
                                                    class="report-years-row-action"
                                                    :class="{ 'report-years-row-action--locked': reportYear.isLocked }"
                                                    :aria-label="`${reportYear.isLocked ? 'Unlock' : 'Lock'} Report Year ${reportYear.year}`"
                                                    @click="
                                                        router.patch(route('report-years.toggle-lock', reportYear.id), {}, { preserveScroll: true })
                                                    "
                                                >
                                                    <Lock v-if="reportYear.isLocked" class="size-4" aria-hidden="true" />
                                                    <Unlock v-else class="size-4" aria-hidden="true" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">{{ reportYear.isLocked ? 'Unlock' : 'Lock' }}</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger as-child>
                                                <Link
                                                    :href="route('report-years.edit', reportYear.id)"
                                                    prefetch
                                                    class="report-years-row-action"
                                                    :aria-label="`Edit report year ${reportYear.year}`"
                                                >
                                                    <Pencil class="size-4" :stroke-width="2" aria-hidden="true" />
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">Edit</TooltipContent>
                                        </Tooltip>
                                        <Tooltip v-if="canDelete && !reportYear.isLocked">
                                            <TooltipTrigger as-child>
                                                <button
                                                    type="button"
                                                    class="report-years-row-action report-years-row-action--danger"
                                                    :aria-label="`Delete Report Year ${reportYear.year}`"
                                                    @click="openDeleteDialog(reportYear)"
                                                >
                                                    <Trash2 class="size-4" :stroke-width="2" aria-hidden="true" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">Delete</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        </transition-group>
                    </table>
                </div>

                <footer class="report-years-footer">
                    <p class="report-years-footer-meta" aria-live="polite">
                        <template v-if="filteredYears.length === 0">0 of 0</template>
                        <template v-else>Showing {{ showingFrom }}–{{ showingTo }} of {{ filteredYears.length }}</template>
                    </p>
                    <nav v-if="filteredYears.length > 0" class="report-years-pagination" aria-label="Pagination">
                        <button type="button" class="report-years-page-btn" :disabled="currentPage <= 1" aria-label="First page" @click="goPage(1)">
                            <ChevronsLeft class="size-4" :stroke-width="2" />
                        </button>
                        <button
                            type="button"
                            class="report-years-page-btn"
                            :disabled="currentPage <= 1"
                            aria-label="Previous page"
                            @click="goPage(currentPage - 1)"
                        >
                            <ChevronLeft class="size-4" :stroke-width="2" />
                        </button>
                        <span class="report-years-page-indicator" aria-current="page">{{ currentPage }}</span>
                        <button
                            type="button"
                            class="report-years-page-btn"
                            :disabled="currentPage >= totalPages"
                            aria-label="Next page"
                            @click="goPage(currentPage + 1)"
                        >
                            <ChevronRight class="size-4" :stroke-width="2" />
                        </button>
                        <button
                            type="button"
                            class="report-years-page-btn"
                            :disabled="currentPage >= totalPages"
                            aria-label="Last page"
                            @click="goPage(totalPages)"
                        >
                            <ChevronsRight class="size-4" :stroke-width="2" />
                        </button>
                    </nav>
                </footer>
            </div>
        </div>

        <Dialog :open="deleteTarget !== null" @update:open="onDeleteDialogOpenChange">
            <DialogContent
                class="border-slate-200 bg-white text-black sm:max-w-md"
                @pointer-down-outside="(e: Event) => deleteProcessing && e.preventDefault()"
            >
                <DialogHeader>
                    <DialogTitle class="text-black">Delete Report Year</DialogTitle>
                    <DialogDescription v-if="deleteTarget" class="text-black">
                        This will permanently delete the report for
                        <span class="font-medium text-black">{{ deleteTarget.year }}</span
                        >. All associated data will be removed. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter class="report-years-dialog-footer mt-6 gap-3">
                    <button type="button" class="report-years-btn-secondary" :disabled="deleteProcessing" @click="onDeleteDialogOpenChange(false)">
                        Cancel
                    </button>
                    <button type="button" class="report-years-btn-danger" :disabled="deleteProcessing" @click="confirmDeleteReportYear">
                        {{ deleteProcessing ? 'Deleting...' : 'Delete Report' }}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AppLayout>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition-property: opacity, transform;
    transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}
/* Exit faster than enter — the system responding should outpace it revealing */
.list-enter-active {
    transition-duration: 200ms;
}
.list-leave-active {
    position: absolute;
    transition-duration: 140ms;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
    .list-enter-active,
    .list-leave-active {
        transition-property: opacity;
        transition-duration: 120ms;
    }
    .list-enter-from,
    .list-leave-to {
        transform: none;
    }
}
</style>
