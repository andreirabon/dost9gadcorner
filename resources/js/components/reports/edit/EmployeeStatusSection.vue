<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRowSection } from '@/composables/useRowSection';
import { REPORT_TABLE_INPUT_CLASS } from '@/constants/reportFormClasses';
import { sumRowFields } from '@/helpers/reportTotals';
import type { EditableEmployeeStatusRow } from '@/types/reports';
import { CheckCircle2, Loader2, Save } from '@lucide/vue';
import { computed } from 'vue';

interface Props {
    reportYearId: number;
    rows: EditableEmployeeStatusRow[];
    expectedUpdatedAt: string | null;
    isReadOnly: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ notice: [message: string] }>();

const tableInputClass = REPORT_TABLE_INPUT_CLASS;

const { form, save, error } = useRowSection({
    rows: props.rows.map((row) => ({
        employment_status_id: row.employmentStatusId,
        female_count: row.femaleCount,
        male_count: row.maleCount,
    })),
    key: 'employment_status_id',
    fields: ['female_count', 'male_count'],
    payloadKey: 'breakdowns',
    url: () => route('report-years.employee-statuses.update', props.reportYearId),
    expectedUpdatedAt: () => props.expectedUpdatedAt,
    notify: (message) => emit('notice', message),
});

const totals = computed(() => sumRowFields(form.rows, ['female_count', 'male_count']));
</script>

<template>
    <section id="panel-employee_status" class="report-panel" role="tabpanel" aria-labelledby="tab-employee_status">
        <HeadingSmall
            variant="report"
            title="Employee status"
            description="Workforce headcounts by employment status and sex. Use the same definitions as HR records."
        />

        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <div class="report-years-data-table">
                <div class="report-years-data-head report-years-data-head--3col">
                    <span class="report-years-data-head-label">Employment status</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Female</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Male</span>
                </div>
                <div v-for="(row, index) in form.rows" :key="row.employment_status_id" class="report-years-data-row report-years-data-row--3col">
                    <div class="report-years-data-row-label">
                        {{ rows[index]?.label }}
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`employee_female_${row.employment_status_id}`" class="report-years-data-cell-label md:sr-only"
                            >Female count</Label
                        >
                        <Input
                            :id="`employee_female_${row.employment_status_id}`"
                            v-model="row.female_count"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="tableInputClass"
                        />
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`employee_male_${row.employment_status_id}`" class="report-years-data-cell-label md:sr-only">Male count</Label>
                        <Input
                            :id="`employee_male_${row.employment_status_id}`"
                            v-model="row.male_count"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="tableInputClass"
                        />
                    </div>
                </div>
            </div>

            <div class="mt-3 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm">
                <span class="font-medium text-zinc-500">Totals</span>
                <span class="flex gap-2 font-mono text-sm font-semibold text-zinc-900 tabular-nums">
                    <span class="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1">F: {{ totals.female_count }}</span>
                    <span class="rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1">M: {{ totals.male_count }}</span>
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
                    Save employee status
                </Button>
                <p v-show="form.recentlySuccessful" class="report-save-hint">
                    <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
                    Saved
                </p>
            </div>
        </form>
    </section>
</template>
