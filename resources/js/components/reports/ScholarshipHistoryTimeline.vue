<script setup lang="ts">
import type { ScholarshipSummaryData } from '@/types/reports';
import { ref, watch } from 'vue';

interface Props {
    history: ScholarshipSummaryData[];
}

const props = defineProps<Props>();

const expandedIds = ref<Set<number>>(new Set());

/**
 * History rows always come from persisted snapshots, so `id` is present in practice; the index fallback only
 * guards the type's shared nullability with the single `scholarship` summary. Declared before the watch below
 * since {immediate:true} calls it during setup — a TDZ error here if the order is reversed.
 */
const historyRowId = (entry: ScholarshipSummaryData, idx: number): number => entry.id ?? idx;

watch(
    () => props.history,
    (rows) => {
        if (rows.length > 0) {
            expandedIds.value = new Set([historyRowId(rows[0], 0)]);
        }
    },
    { immediate: true },
);

const toggleExpand = (id: number): void => {
    if (expandedIds.value.has(id)) {
        expandedIds.value.delete(id);
    } else {
        expandedIds.value.add(id);
    }
};

const isExpanded = (id: number): boolean => expandedIds.value.has(id);
</script>

<template>
    <div v-if="history.length > 1" class="report-view-block">
        <div class="report-view-chart-head">
            <h3 class="report-view-block-title">Scholar Count History</h3>
            <p class="report-view-block-desc">Data progression across reporting periods</p>
        </div>
        <div class="space-y-2">
            <button
                v-for="(entry, idx) in history"
                :key="historyRowId(entry, idx)"
                type="button"
                class="w-full rounded-xl border px-4 py-3.5 text-left transition-[transform,background-color,border-color,color] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none active:scale-[0.985]"
                :class="
                    isExpanded(historyRowId(entry, idx))
                        ? 'border-brand-700 bg-brand-800 text-brand-50 report-light:border-brand-200 report-light:bg-brand-50 report-light:text-brand-950'
                        : 'border-transparent bg-brand-900/60 text-brand-200 hover:bg-brand-900 hover:text-brand-50 report-light:border-slate-200/60 report-light:bg-slate-50 report-light:text-slate-700 report-light:hover:bg-slate-100/80 report-light:hover:text-slate-900'
                "
                @click="toggleExpand(historyRowId(entry, idx))"
            >
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <svg
                            class="size-4 shrink-0 text-brand-300 transition-transform duration-200 report-light:text-brand-600"
                            :class="{ 'rotate-90': isExpanded(historyRowId(entry, idx)) }"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2.5"
                            aria-hidden="true"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span class="text-base tracking-tight" :class="isExpanded(historyRowId(entry, idx)) ? 'font-semibold' : 'font-medium'">
                            {{ entry.asOfDate ?? 'No date' }}
                        </span>
                        <span
                            v-if="idx === 0"
                            class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold tracking-wider text-emerald-400 uppercase report-light:bg-emerald-100/80 report-light:text-emerald-800"
                        >
                            Latest
                        </span>
                    </div>
                    <span
                        class="text-base font-medium tabular-nums"
                        :class="
                            isExpanded(historyRowId(entry, idx))
                                ? 'text-brand-200 report-light:text-brand-900'
                                : 'text-brand-300 report-light:text-slate-500'
                        "
                    >
                        <span class="font-mono">{{ entry.femaleCount + entry.maleCount }}</span> scholars
                    </span>
                </div>
                <Transition
                    enter-active-class="transition-[transform,opacity] duration-200 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition-[transform,opacity] duration-150 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                >
                    <div
                        v-if="isExpanded(historyRowId(entry, idx))"
                        class="mt-3.5 border-t border-brand-800/60 pt-3 text-base report-light:border-slate-200"
                    >
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs font-semibold tracking-wider text-brand-300 uppercase report-light:text-slate-500">School Year</p>
                                <p class="mt-1.5 text-base font-bold text-brand-50 report-light:text-slate-800">
                                    {{ entry.schoolYearLabel || 'No school year' }}
                                </p>
                            </div>
                            <div>
                                <p class="text-xs font-semibold tracking-wider text-brand-300 uppercase report-light:text-slate-500">
                                    Gender Breakdown
                                </p>
                                <div class="mt-1 flex items-baseline gap-3">
                                    <span class="text-base text-brand-300 report-light:text-slate-500">
                                        Female:
                                        <span class="ml-0.5 font-mono text-base font-bold text-brand-50 report-light:text-slate-900">{{
                                            entry.femaleCount
                                        }}</span>
                                    </span>
                                    <span class="text-brand-800 report-light:text-slate-300">|</span>
                                    <span class="text-base text-brand-300 report-light:text-slate-500">
                                        Male:
                                        <span class="ml-0.5 font-mono text-base font-bold text-brand-50 report-light:text-slate-900">{{
                                            entry.maleCount
                                        }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </button>
        </div>
    </div>
</template>
