<script setup lang="ts">
import ReportSectionSaveActions from '@/components/reports/edit/ReportSectionSaveActions.vue';
import InputError from '@/components/shared/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRowSection } from '@/composables/useRowSection';
import { REPORT_TABLE_INPUT_CLASS } from '@/constants/reportFormClasses';
import { formatNumber } from '@/helpers/formatNumber';
import type { EditableScholarshipApplicantRow } from '@/types/reports';
import { computed } from 'vue';

interface Props {
    reportYearId: number;
    rows: EditableScholarshipApplicantRow[];
    expectedUpdatedAt: string | null;
    isReadOnly: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ notice: [message: string] }>();

const tableInputClass = REPORT_TABLE_INPUT_CLASS;

const VALUE_FIELDS = ['female_count', 'male_count'] as const;

const { form, save, error } = useRowSection({
    rows: props.rows.map((row) => ({
        scholarship_program_id: row.scholarshipProgramId,
        female_count: row.femaleCount ?? 0,
        male_count: row.maleCount ?? 0,
    })),
    key: 'scholarship_program_id',
    fields: VALUE_FIELDS,
    payloadKey: 'applicants',
    url: () => route('report-years.scholarship-applicants.update', props.reportYearId),
    expectedUpdatedAt: () => props.expectedUpdatedAt,
    notify: (message) => emit('notice', message),
});

/**
 * Undergraduate and graduate programs get their own table. Grouping comes from
 * the `level` column rather than the name so a renamed program stays put.
 */
const LEVELS = [
    { key: 'undergraduate', title: 'Undergraduate' },
    { key: 'graduate', title: 'Graduate' },
] as const;

const applicantRows = computed(() =>
    form.rows.map((row, index) => ({
        row,
        label: props.rows[index]?.label ?? `Program ${index + 1}`,
        fullName: props.rows[index]?.fullName ?? '',
        level: props.rows[index]?.level,
    })),
);

const rowsForLevel = (level: string) => applicantRows.value.filter((item) => item.level === level);

/** Running totals so an entry mistake shows up while typing, not after saving. */
const levelTotal = (level: string, field: 'female_count' | 'male_count'): number =>
    rowsForLevel(level).reduce((sum, item) => sum + Number(item.row[field] ?? 0), 0);
</script>

<template>
    <section id="panel-scholarship_applicants" class="report-panel" role="tabpanel" aria-labelledby="tab-scholarship_applicants">
        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <div class="space-y-6">
                <div v-for="level in LEVELS" :key="level.key" class="report-years-data-table-scroll max-w-6xl">
                    <div class="report-years-data-table report-years-data-table--wide report-years-data-table--funding">
                        <div class="report-years-data-head report-years-data-head--4col">
                            <span class="report-years-data-head-label">{{ level.title }} program</span>
                            <span class="report-years-data-head-label report-years-data-head-label--center">Female applicants</span>
                            <span class="report-years-data-head-label report-years-data-head-label--center">Male applicants</span>
                            <span class="report-years-data-head-label report-years-data-head-label--center">Total</span>
                        </div>

                        <div
                            v-for="item in rowsForLevel(level.key)"
                            :key="item.row.scholarship_program_id"
                            class="report-years-data-row report-years-data-row--4col"
                        >
                            <div class="report-years-data-row-label">
                                {{ item.label }}
                            </div>

                            <div class="report-years-data-cell">
                                <Label
                                    :for="`scholarship_applicants_female_${item.row.scholarship_program_id}`"
                                    class="report-years-data-cell-label md:sr-only"
                                    >Female applicants</Label
                                >
                                <Input
                                    :id="`scholarship_applicants_female_${item.row.scholarship_program_id}`"
                                    v-model="item.row.female_count"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    :disabled="isReadOnly"
                                    :class="tableInputClass"
                                />
                            </div>

                            <div class="report-years-data-cell">
                                <Label
                                    :for="`scholarship_applicants_male_${item.row.scholarship_program_id}`"
                                    class="report-years-data-cell-label md:sr-only"
                                    >Male applicants</Label
                                >
                                <Input
                                    :id="`scholarship_applicants_male_${item.row.scholarship_program_id}`"
                                    v-model="item.row.male_count"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    :disabled="isReadOnly"
                                    :class="tableInputClass"
                                />
                            </div>

                            <div class="report-years-data-cell">
                                <Label
                                    :for="`scholarship_applicants_total_${item.row.scholarship_program_id}`"
                                    class="report-years-data-cell-label md:sr-only"
                                    >Total applicants</Label
                                >
                                <Input
                                    :id="`scholarship_applicants_total_${item.row.scholarship_program_id}`"
                                    :model-value="formatNumber(Number(item.row.female_count ?? 0) + Number(item.row.male_count ?? 0))"
                                    type="text"
                                    readonly
                                    tabindex="-1"
                                    aria-live="polite"
                                    :class="[tableInputClass, 'report-derived-field']"
                                />
                            </div>
                        </div>

                        <div class="report-years-data-row report-years-data-row--4col report-years-data-row--total">
                            <div class="report-years-data-row-label">{{ level.title }} totals</div>
                            <div class="report-years-data-cell">
                                <span class="sr-only">Total female applicants</span>
                                <Input
                                    :model-value="formatNumber(levelTotal(level.key, 'female_count'))"
                                    type="text"
                                    readonly
                                    tabindex="-1"
                                    aria-live="polite"
                                    :class="[tableInputClass, 'report-derived-field']"
                                />
                            </div>
                            <div class="report-years-data-cell">
                                <span class="sr-only">Total male applicants</span>
                                <Input
                                    :model-value="formatNumber(levelTotal(level.key, 'male_count'))"
                                    type="text"
                                    readonly
                                    tabindex="-1"
                                    aria-live="polite"
                                    :class="[tableInputClass, 'report-derived-field']"
                                />
                            </div>
                            <div class="report-years-data-cell">
                                <span class="sr-only">Total applicants</span>
                                <Input
                                    :model-value="formatNumber(levelTotal(level.key, 'female_count') + levelTotal(level.key, 'male_count'))"
                                    type="text"
                                    readonly
                                    tabindex="-1"
                                    aria-live="polite"
                                    :class="[tableInputClass, 'report-derived-field']"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <InputError :message="error" />

            <ReportSectionSaveActions :processing="form.processing" :recently-successful="form.recentlySuccessful" :is-read-only="isReadOnly">
                Save scholarship applicants
            </ReportSectionSaveActions>
        </form>
    </section>
</template>
