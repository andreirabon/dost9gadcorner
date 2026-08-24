<script setup lang="ts">
import ReportSectionSaveActions from '@/components/reports/edit/ReportSectionSaveActions.vue';
import InputError from '@/components/shared/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRowSection } from '@/composables/useRowSection';
import { REPORT_TABLE_INPUT_CLASS } from '@/constants/reportFormClasses';
import { formatNumber } from '@/helpers/formatNumber';
import { sumRowFields } from '@/helpers/reportTotals';
import type { EditableEmployeeStatusRow } from '@/types/reports';
import { computed } from 'vue';

interface Props {
    reportYearId: number;
    /** Already narrowed by the server to the reportable statuses. */
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
    url: () => route('report-years.gfps-member-statuses.update', props.reportYearId),
    expectedUpdatedAt: () => props.expectedUpdatedAt,
    notify: (message) => emit('notice', message),
});

const totals = computed(() => sumRowFields(form.rows, ['female_count', 'male_count']));
</script>

<template>
    <section id="panel-gfps_member_status" class="report-panel" role="tabpanel" aria-labelledby="tab-gfps_member_status">
        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <p class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-black">
                GFPS members only, not all DOST IX employees. Entered separately from GFPS Membership, so the two totals are recorded independently.
            </p>

            <div class="report-years-data-table report-years-data-table--narrow">
                <div class="report-years-data-head report-years-data-head--3col">
                    <span class="report-years-data-head-label">Employment status</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Female</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Male</span>
                </div>
                <div
                    v-for="(row, index) in form.rows"
                    :key="row.employment_status_id"
                    class="report-years-data-row report-years-data-row--3col"
                    :class="{ 'is-striped': index % 2 === 1 }"
                >
                    <div class="report-years-data-row-label">
                        {{ rows[index]?.label }}
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`gfps_member_female_${row.employment_status_id}`" class="report-years-data-cell-label md:sr-only"
                            >Female count</Label
                        >
                        <Input
                            :id="`gfps_member_female_${row.employment_status_id}`"
                            v-model="row.female_count"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="tableInputClass"
                        />
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`gfps_member_male_${row.employment_status_id}`" class="report-years-data-cell-label md:sr-only"
                            >Male count</Label
                        >
                        <Input
                            :id="`gfps_member_male_${row.employment_status_id}`"
                            v-model="row.male_count"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="tableInputClass"
                        />
                    </div>
                </div>

                <!-- Derived footer row: sums every status above it. -->
                <div class="report-years-data-row report-years-data-row--3col report-years-data-row--total">
                    <div class="report-years-data-row-label">Total</div>

                    <div class="report-years-data-cell">
                        <Label for="gfps_member_total_female" class="report-years-data-cell-label md:sr-only">Total female</Label>
                        <Input
                            id="gfps_member_total_female"
                            :model-value="formatNumber(totals.female_count)"
                            type="text"
                            readonly
                            tabindex="-1"
                            aria-live="polite"
                            :class="[tableInputClass, 'report-derived-field']"
                        />
                    </div>

                    <div class="report-years-data-cell">
                        <Label for="gfps_member_total_male" class="report-years-data-cell-label md:sr-only">Total male</Label>
                        <Input
                            id="gfps_member_total_male"
                            :model-value="formatNumber(totals.male_count)"
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
                Save GFPS member status
            </ReportSectionSaveActions>
        </form>
    </section>
</template>
