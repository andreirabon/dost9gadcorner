<script setup lang="ts">
import ReportSectionSaveActions from '@/components/reports/edit/ReportSectionSaveActions.vue';
import InputError from '@/components/shared/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRowSection } from '@/composables/useRowSection';
import { REPORT_TABLE_INPUT_CLASS } from '@/constants/reportFormClasses';
import { formatNumber } from '@/helpers/formatNumber';
import { sumFields } from '@/helpers/reportTotals';
import type { EditableGfpsAssemblyRow } from '@/types/reports';

interface Props {
    reportYearId: number;
    rows: EditableGfpsAssemblyRow[];
    expectedUpdatedAt: string | null;
    isReadOnly: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ notice: [message: string] }>();

const tableInputClass = REPORT_TABLE_INPUT_CLASS;

const { form, save, error } = useRowSection({
    rows: props.rows.map((row) => ({
        period_id: row.periodId,
        female_count: row.femaleCount,
        male_count: row.maleCount,
    })),
    key: 'period_id',
    fields: ['female_count', 'male_count'],
    payloadKey: 'attendances',
    url: () => route('report-years.gfps-assemblies.update', props.reportYearId),
    expectedUpdatedAt: () => props.expectedUpdatedAt,
    notify: (message) => emit('notice', message),
});

/** Derived attendance for one assembly period; the cell is read-only. */
function rowTotal(row: Record<string, unknown>): number {
    return sumFields(row, ['female_count', 'male_count']);
}
</script>

<template>
    <section id="panel-gfps_assemblies" class="report-panel" role="tabpanel" aria-labelledby="tab-gfps_assemblies">
        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <div class="report-years-data-table report-years-data-table--narrow">
                <div class="report-years-data-head report-years-data-head--4col">
                    <span class="report-years-data-head-label">Period</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Female</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Male</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Total per assembly</span>
                </div>
                <div v-for="(row, index) in form.rows" :key="row.period_id" class="report-years-data-row report-years-data-row--4col">
                    <div class="report-years-data-row-label">
                        {{ rows[index]?.label }}
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`gfps_assembly_female_${row.period_id}`" class="report-years-data-cell-label md:sr-only">Female count</Label>
                        <Input
                            :id="`gfps_assembly_female_${row.period_id}`"
                            v-model="row.female_count"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="tableInputClass"
                        />
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`gfps_assembly_male_${row.period_id}`" class="report-years-data-cell-label md:sr-only">Male count</Label>
                        <Input
                            :id="`gfps_assembly_male_${row.period_id}`"
                            v-model="row.male_count"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="tableInputClass"
                        />
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`gfps_assembly_total_${row.period_id}`" class="report-years-data-cell-label md:sr-only">
                            Total per assembly
                        </Label>
                        <Input
                            :id="`gfps_assembly_total_${row.period_id}`"
                            :model-value="formatNumber(rowTotal(row))"
                            type="text"
                            readonly
                            tabindex="-1"
                            aria-live="polite"
                            :class="[tableInputClass, 'report-derived-field']"
                        />
                    </div>
                </div>
            </div>

            <InputError :message="error" />

            <ReportSectionSaveActions :processing="form.processing" :recently-successful="form.recentlySuccessful" :is-read-only="isReadOnly">
                Save assemblies
            </ReportSectionSaveActions>
        </form>
    </section>
</template>
