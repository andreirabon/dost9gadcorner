<script setup lang="ts">
import type { ScholarshipApplicantDataRow } from '@/types/reports';
import { computed } from 'vue';

interface Props {
    rows: ScholarshipApplicantDataRow[];
    emptyLabel: string;
}

const props = defineProps<Props>();

const LEVELS = [
    { key: 'undergraduate', title: 'Undergraduate Applicants' },
    { key: 'graduate', title: 'Graduate Applicants' },
] as const;

/**
 * Same column grid as the funding tables: one category track plus four data
 * tracks, padded with hidden fillers. Keeping every table on the page to one
 * grid is what lets the eye read straight down instead of re-finding the column
 * in each block.
 */
const DATA_COLUMNS = 4;
const COLUMNS = ['Female', 'Male', 'Total'] as const;
const FILLERS = DATA_COLUMNS - COLUMNS.length;

const numberFormat = new Intl.NumberFormat('en-PH');

const rowsForLevel = (level: string) => props.rows.filter((row) => row.level === level);

/** A level with nothing recorded is dropped rather than shown as a grid of zeros. */
const visibleLevels = computed(() => LEVELS.filter((level) => rowsForLevel(level.key).some((row) => row.female + row.male > 0)));

const levelTotals = (level: string) => {
    const rows = rowsForLevel(level);

    return {
        female: rows.reduce((sum, row) => sum + row.female, 0),
        male: rows.reduce((sum, row) => sum + row.male, 0),
    };
};

const format = (value: number): string => numberFormat.format(value);
</script>

<template>
    <div v-if="visibleLevels.length === 0" class="report-view-block">
        <p class="report-view-block-desc">{{ emptyLabel }}</p>
    </div>

    <div v-else class="space-y-3 md:space-y-4">
        <div v-for="level in visibleLevels" :key="level.key" class="report-view-block">
            <div class="report-view-chart-head">
                <h3 class="report-view-block-title">{{ level.title }}</h3>
                <p class="report-view-block-desc">Applicants by sex, per scholarship program</p>
            </div>

            <div class="report-view-table-scroll">
                <table class="report-view-table">
                    <colgroup>
                        <col class="report-view-col-category" />
                        <col v-for="index in DATA_COLUMNS" :key="`col-${index}`" class="report-view-col-data" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col" class="report-view-table-head">Program</th>
                            <th v-for="column in COLUMNS" :key="column" scope="col" class="report-view-table-head report-view-table-num">
                                {{ column }}
                            </th>
                            <td v-for="index in FILLERS" :key="`head-filler-${index}`" aria-hidden="true" class="report-view-table-head"></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in rowsForLevel(level.key)" :key="row.slug" class="report-view-table-row">
                            <th scope="row" class="report-view-table-rowhead">{{ row.fullName }}</th>
                            <td class="report-view-table-cell report-view-table-num">{{ format(row.female) }}</td>
                            <td class="report-view-table-cell report-view-table-num">{{ format(row.male) }}</td>
                            <td class="report-view-table-cell report-view-table-num">{{ format(row.female + row.male) }}</td>
                            <td v-for="index in FILLERS" :key="`${row.slug}-filler-${index}`" aria-hidden="true" class="report-view-table-cell"></td>
                        </tr>
                        <tr class="report-view-table-row report-view-table-row--total">
                            <th scope="row" class="report-view-table-rowhead">All {{ level.key }}</th>
                            <td class="report-view-table-cell report-view-table-num">{{ format(levelTotals(level.key).female) }}</td>
                            <td class="report-view-table-cell report-view-table-num">{{ format(levelTotals(level.key).male) }}</td>
                            <td class="report-view-table-cell report-view-table-num">
                                {{ format(levelTotals(level.key).female + levelTotals(level.key).male) }}
                            </td>
                            <td v-for="index in FILLERS" :key="`total-filler-${index}`" aria-hidden="true" class="report-view-table-cell"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
