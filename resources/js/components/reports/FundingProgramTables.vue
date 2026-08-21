<script setup lang="ts">
import { formatCurrency } from '@/helpers/formatCurrency';
import type { FundingCategorySummaryData } from '@/types/reports';

interface Props {
    /** SETUP or CEST, used to label each table. */
    groupLabel: string;
    categories: FundingCategorySummaryData[];
    emptyLabel: string;
}

const props = defineProps<Props>();

type Cell = { text: string; muted?: boolean };

interface TableDef {
    title: string;
    columns: string[];
    row: (category: FundingCategorySummaryData) => Cell[];
    /** Table is skipped entirely when no category has anything to show. */
    hasData: (category: FundingCategorySummaryData) => boolean;
}

const num = (value: number | undefined): Cell => ({ text: new Intl.NumberFormat('en-PH').format(Number(value ?? 0)) });

/**
 * Money that was never recorded reads as absent, not as a confirmed nil
 * balance — same rule the category cards use.
 */
const money = (value: number | undefined): Cell =>
    Number(value ?? 0) > 0 ? { text: formatCurrency(Number(value)) } : { text: 'No data yet', muted: true };

const positive = (...values: (number | undefined)[]): boolean => values.some((value) => Number(value ?? 0) > 0);

/**
 * Only the entered figures that no chart above already plots. Jobs Generated
 * and Jobs Breakdown are omitted here because StackedBarBySexChart and
 * JobsBreakdownHeatmap already show them for every category.
 */
const TABLES: TableDef[] = [
    {
        title: 'Program',
        columns: ['Female projects', 'Female amount', 'Male projects', 'Male amount'],
        row: (c) => [num(c.femaleProjects), money(c.femaleAmount), num(c.maleProjects), money(c.maleAmount)],
        hasData: (c) => positive(c.femaleProjects, c.femaleAmount, c.maleProjects, c.maleAmount),
    },
    {
        title: 'Program Metrics',
        columns: ['Funded projects', 'Value of funded projects', 'Training participants'],
        row: (c) => [num(c.fundedProjectsCount), money(c.fundedProjectsValue), num(c.trainingParticipants)],
        hasData: (c) => positive(c.fundedProjectsCount, c.fundedProjectsValue, c.trainingParticipants),
    },
    {
        title: 'Special Projects Research',
        columns: ['Male', 'Female'],
        row: (c) => [num(c.specialProjectsResearchMale), num(c.specialProjectsResearchFemale)],
        hasData: (c) => positive(c.specialProjectsResearchMale, c.specialProjectsResearchFemale),
    },
];

/**
 * A table with nothing entered anywhere is dropped rather than rendered as a
 * grid of zeros: these columns default to zero in the schema, so an all-zero
 * table means "never entered", not "measured as none".
 */
const visibleTables = (): TableDef[] => TABLES.filter((table) => props.categories.some(table.hasData));

/**
 * Every table renders on the same column grid, padded to the widest one.
 *
 * Without this each table sized its own columns, so the same reading position
 * landed at a different x in every block — even the Category column drifted by
 * 250px — and comparing a figure against the block above meant re-finding the
 * column each time. Filler cells are hidden from assistive tech: they carry no
 * data and exist purely to hold the grid.
 */
const DATA_COLUMNS = Math.max(...TABLES.map((table) => table.columns.length));

const fillerCount = (used: number): number => DATA_COLUMNS - used;
</script>

<template>
    <div v-if="categories.length === 0" class="report-view-block">
        <p class="report-view-block-desc">{{ emptyLabel }}</p>
    </div>

    <div v-else class="space-y-3 md:space-y-4">
        <div v-for="table in visibleTables()" :key="table.title" class="report-view-block">
            <div class="report-view-chart-head">
                <h3 class="report-view-block-title">{{ groupLabel }} {{ table.title }}</h3>
            </div>

            <div class="report-view-table-scroll">
                <table class="report-view-table">
                    <colgroup>
                        <col class="report-view-col-category" />
                        <col v-for="index in DATA_COLUMNS" :key="`col-${index}`" class="report-view-col-data" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col" class="report-view-table-head">Category</th>
                            <th v-for="column in table.columns" :key="column" scope="col" class="report-view-table-head report-view-table-num">
                                {{ column }}
                            </th>
                            <td
                                v-for="index in fillerCount(table.columns.length)"
                                :key="`head-filler-${index}`"
                                aria-hidden="true"
                                class="report-view-table-head"
                            ></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="category in categories" :key="category.slug" class="report-view-table-row">
                            <th scope="row" class="report-view-table-rowhead">{{ category.label }}</th>
                            <td
                                v-for="(cell, cellIndex) in table.row(category)"
                                :key="`${category.slug}-${cellIndex}`"
                                class="report-view-table-cell report-view-table-num"
                                :class="{ 'report-view-table-cell--muted': cell.muted }"
                            >
                                {{ cell.text }}
                            </td>
                            <td
                                v-for="index in fillerCount(table.columns.length)"
                                :key="`${category.slug}-filler-${index}`"
                                aria-hidden="true"
                                class="report-view-table-cell"
                            ></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
