<script setup lang="ts">
import ReportChartBlock from '@/components/reports/ReportChartBlock.vue';
import ReportMetricsGrid from '@/components/reports/ReportMetricsGrid.vue';
import { specialResearchRows } from '@/composables/useFundingGroup';
import type { FundingCategorySummaryData } from '@/types/reports';
import { computed, defineAsyncComponent } from 'vue';

const StackedBarBySexChart = defineAsyncComponent(() => import('@/components/charts/StackedBarBySexChart.vue'));

interface Props {
    /**
     * The four provincial `research-*` rows. Special projects research is a
     * provincial figure, not a SETUP/CEST/GIA metric, so it is read here in one
     * place rather than as a trailing table on each of their tabs.
     */
    categories: FundingCategorySummaryData[];
    /** Report year, shown in the block descriptions. */
    year: string;
}

const props = defineProps<Props>();

const rows = computed(() => specialResearchRows(props.categories));

const totals = computed(() => ({
    male: rows.value.reduce((sum, row) => sum + row.male, 0),
    female: rows.value.reduce((sum, row) => sum + row.female, 0),
    total: rows.value.reduce((sum, row) => sum + row.total, 0),
    provinces: rows.value.length,
}));

const chartRows = computed(() => rows.value.map((row) => ({ label: row.label, female: row.female, male: row.male })));

const formatCount = (value: number): string => new Intl.NumberFormat('en-PH').format(value);
</script>

<template>
    <div class="space-y-3 md:space-y-4">
        <div v-if="rows.length === 0" class="report-view-block">
            <p class="report-view-block-desc">No special projects research recorded for {{ year }}.</p>
        </div>

        <template v-else>
            <ReportMetricsGrid
                :metrics="[
                    { label: 'Provinces with Research', value: totals.provinces },
                    { label: 'Total Researchers', value: formatCount(totals.total) },
                    { label: 'Female', value: formatCount(totals.female) },
                    { label: 'Male', value: formatCount(totals.male) },
                ]"
            />

            <ReportChartBlock title="Special Projects Research by Sex" :description="`Researchers per funding category • ${year}`">
                <StackedBarBySexChart :data="chartRows" axis-title="Researchers" />
            </ReportChartBlock>

            <div class="report-view-block">
                <div class="report-view-chart-head">
                    <h3 class="report-view-block-title">Special Projects Research</h3>
                </div>

                <div class="report-view-table-scroll">
                    <table class="report-view-table">
                        <colgroup>
                            <col class="report-view-col-category" />
                            <col v-for="index in 3" :key="`col-${index}`" class="report-view-col-data" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col" class="report-view-table-head">Category</th>
                                <th scope="col" class="report-view-table-head report-view-table-num">Female</th>
                                <th scope="col" class="report-view-table-head report-view-table-num">Male</th>
                                <th scope="col" class="report-view-table-head report-view-table-num">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in rows" :key="row.slug" class="report-view-table-row">
                                <th scope="row" class="report-view-table-rowhead">{{ row.label }}</th>
                                <td class="report-view-table-cell report-view-table-num">{{ formatCount(row.female) }}</td>
                                <td class="report-view-table-cell report-view-table-num">{{ formatCount(row.male) }}</td>
                                <td class="report-view-table-cell report-view-table-num">{{ formatCount(row.total) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </div>
</template>
