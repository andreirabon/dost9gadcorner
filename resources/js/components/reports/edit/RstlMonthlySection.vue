<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRowSection } from '@/composables/useRowSection';
import { REPORT_TABLE_INPUT_CLASS } from '@/constants/reportFormClasses';
import { sumRowFields } from '@/helpers/reportTotals';
import type { EditableRstlMonthlyRow } from '@/types/reports';
import { CheckCircle2, Loader2, Save } from '@lucide/vue';
import { computed } from 'vue';

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

const totals = computed(() => sumRowFields(form.rows, VALUE_FIELDS));
</script>

<template>
    <section id="panel-rstl_monthly" class="report-panel" role="tabpanel" aria-labelledby="tab-rstl_monthly">
        <HeadingSmall
            variant="report"
            title="RSTL by month"
            description="Monthly RSTL activity: clients or visits by sex, plus female-led and male-led counts. Scroll horizontally on small screens if the column labels do not fit."
        />

        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <div class="report-years-data-table-scroll">
                <div class="report-years-data-table report-years-data-table--wide report-years-data-table--rstl">
                    <div class="report-years-data-head report-years-data-head--5col">
                        <span class="report-years-data-head-label">Month</span>
                        <span class="report-years-data-head-label report-years-data-head-label--center">Female</span>
                        <span class="report-years-data-head-label report-years-data-head-label--center">Female-led</span>
                        <span class="report-years-data-head-label report-years-data-head-label--center">Male</span>
                        <span class="report-years-data-head-label report-years-data-head-label--center">Male-led</span>
                    </div>
                    <div v-for="(row, index) in form.rows" :key="row.report_month_id" class="report-years-data-row report-years-data-row--5col">
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

            <div class="mt-3 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm">
                <span class="font-medium text-zinc-500">Totals</span>
                <span class="flex flex-wrap gap-2 font-mono text-sm font-semibold text-zinc-900 tabular-nums">
                    <span class="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1">F: {{ totals.female_count }}</span>
                    <span class="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1">F-led: {{ totals.female_led_count }}</span>
                    <span class="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1">M: {{ totals.male_count }}</span>
                    <span class="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1">M-led: {{ totals.male_led_count }}</span>
                </span>
            </div>

            <InputError :message="error" />

            <div class="report-years-form-actions">
                <Button
                    type="submit"
                    class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                    :disabled="form.processing || isReadOnly"
                >
                    <Loader2 v-if="form.processing" class="size-4 animate-spin" aria-hidden="true" />
                    <Save v-else class="size-4" :stroke-width="2.5" aria-hidden="true" />
                    Save RSTL
                </Button>
                <p v-show="form.recentlySuccessful" class="report-save-hint">
                    <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
                    Saved
                </p>
            </div>
        </form>
    </section>
</template>
