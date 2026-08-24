<script setup lang="ts">
import ReportSectionSaveActions from '@/components/reports/edit/ReportSectionSaveActions.vue';
import InputError from '@/components/shared/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRowSection } from '@/composables/useRowSection';
import { REPORT_TABLE_INPUT_CLASS } from '@/constants/reportFormClasses';
import type { EditableRstlMonthlyRow } from '@/types/reports';

interface Props {
    reportYearId: number;
    rows: EditableRstlMonthlyRow[];
    expectedUpdatedAt: string | null;
    isReadOnly: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ notice: [message: string] }>();

const tableInputClass = REPORT_TABLE_INPUT_CLASS;

const VALUE_FIELDS = ['female_count', 'female_led_count', 'male_count', 'male_led_count'] as const;

const { form, save, error } = useRowSection({
    rows: props.rows.map((row) => ({
        report_month_id: row.reportMonthId,
        female_count: row.femaleCount,
        female_led_count: row.femaleLedCount,
        male_count: row.maleCount,
        male_led_count: row.maleLedCount,
    })),
    key: 'report_month_id',
    fields: VALUE_FIELDS,
    payloadKey: 'breakdowns',
    url: () => route('report-years.rstl-monthly.update', props.reportYearId),
    expectedUpdatedAt: () => props.expectedUpdatedAt,
    notify: (message) => emit('notice', message),
});
</script>

<template>
    <section id="panel-rstl_monthly" class="report-panel" role="tabpanel" aria-labelledby="tab-rstl_monthly">
        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <!-- Capped on the scroll container, not the table: the table carries
                 min-w-full, which would win against a max-width set on itself.
                 5xl still clears the 44rem min-width, so no scrollbar appears
                 on desktop that was not there before. -->
            <div class="report-years-data-table-scroll max-w-5xl">
                <div class="report-years-data-table report-years-data-table--wide report-years-data-table--rstl">
                    <div class="report-years-data-head report-years-data-head--5col">
                        <span class="report-years-data-head-label">Month</span>
                        <span class="report-years-data-head-label report-years-data-head-label--center">Female</span>
                        <span class="report-years-data-head-label report-years-data-head-label--center">Female-led</span>
                        <span class="report-years-data-head-label report-years-data-head-label--center">Male</span>
                        <span class="report-years-data-head-label report-years-data-head-label--center">Male-led</span>
                    </div>
                    <div
                        v-for="(row, index) in form.rows"
                        :key="row.report_month_id"
                        class="report-years-data-row report-years-data-row--5col"
                        :class="{ 'is-striped': index % 2 === 1 }"
                    >
                        <div class="report-years-data-row-label">
                            {{ rows[index]?.label }}
                        </div>

                        <div class="report-years-data-cell">
                            <Label :for="`rstl_female_${row.report_month_id}`" class="report-years-data-cell-label md:sr-only">Female</Label>
                            <Input
                                :id="`rstl_female_${row.report_month_id}`"
                                v-model="row.female_count"
                                type="number"
                                min="0"
                                inputmode="numeric"
                                :disabled="isReadOnly"
                                :class="tableInputClass"
                            />
                        </div>

                        <div class="report-years-data-cell">
                            <Label :for="`rstl_female_led_${row.report_month_id}`" class="report-years-data-cell-label md:sr-only">Female-led</Label>
                            <Input
                                :id="`rstl_female_led_${row.report_month_id}`"
                                v-model="row.female_led_count"
                                type="number"
                                min="0"
                                inputmode="numeric"
                                :disabled="isReadOnly"
                                :class="tableInputClass"
                            />
                        </div>

                        <div class="report-years-data-cell">
                            <Label :for="`rstl_male_${row.report_month_id}`" class="report-years-data-cell-label md:sr-only">Male</Label>
                            <Input
                                :id="`rstl_male_${row.report_month_id}`"
                                v-model="row.male_count"
                                type="number"
                                min="0"
                                inputmode="numeric"
                                :disabled="isReadOnly"
                                :class="tableInputClass"
                            />
                        </div>

                        <div class="report-years-data-cell">
                            <Label :for="`rstl_male_led_${row.report_month_id}`" class="report-years-data-cell-label md:sr-only">Male-led</Label>
                            <Input
                                :id="`rstl_male_led_${row.report_month_id}`"
                                v-model="row.male_led_count"
                                type="number"
                                min="0"
                                inputmode="numeric"
                                :disabled="isReadOnly"
                                :class="tableInputClass"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <InputError :message="error" />

            <ReportSectionSaveActions :processing="form.processing" :recently-successful="form.recentlySuccessful" :is-read-only="isReadOnly">
                Save RSTL
            </ReportSectionSaveActions>
        </form>
    </section>
</template>
