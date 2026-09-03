<script setup lang="ts">
import ReportSectionSaveActions from '@/components/reports/edit/ReportSectionSaveActions.vue';
import InputError from '@/components/shared/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { provinceLabel } from '@/composables/useFundingGroup';
import { useRowSection } from '@/composables/useRowSection';
import { REPORT_TABLE_INPUT_CLASS } from '@/constants/reportFormClasses';
import { formatNumber } from '@/helpers/formatNumber';
import { sumFields } from '@/helpers/reportTotals';
import type { EditableProgramFundingRow } from '@/types/reports';

interface Props {
    reportYearId: number;
    /**
     * The `research-*` funding programs the user may write — one per province.
     * Special projects research is a provincial figure, not a SETUP/CEST/GIA
     * metric, so it is entered once here rather than three times over on their
     * tabs.
     */
    rows: EditableProgramFundingRow[];
    expectedUpdatedAt: string | null;
    isReadOnly: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ notice: [message: string] }>();

const tableInputClass = REPORT_TABLE_INPUT_CLASS;

const { form, save, error } = useRowSection({
    rows: props.rows.map((row) => ({
        funding_program_id: row.fundingProgramId,
        special_projects_research_female: row.specialProjectsResearchFemale ?? 0,
        special_projects_research_male: row.specialProjectsResearchMale ?? 0,
    })),
    key: 'funding_program_id',
    fields: ['special_projects_research_female', 'special_projects_research_male'],
    payloadKey: 'summaries',
    url: () => route('report-years.program-funding.update', props.reportYearId),
    expectedUpdatedAt: () => props.expectedUpdatedAt,
    notify: (message) => emit('notice', message),
});

/** Derived researcher count for one category; the cell is read-only. */
function rowTotal(row: Record<string, unknown>): number {
    return sumFields(row, ['special_projects_research_female', 'special_projects_research_male']);
}
</script>

<template>
    <section id="panel-special_projects_research" class="report-panel" role="tabpanel" aria-labelledby="tab-special_projects_research">
        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <div class="report-years-data-table report-years-data-table--narrow">
                <div class="report-years-data-head report-years-data-head--4col">
                    <span class="report-years-data-head-label">Category</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Female</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Male</span>
                    <span class="report-years-data-head-label report-years-data-head-label--center">Total researchers</span>
                </div>
                <div
                    v-for="(row, index) in form.rows"
                    :key="row.funding_program_id"
                    class="report-years-data-row report-years-data-row--4col"
                    :class="{ 'is-striped': index % 2 === 1 }"
                >
                    <div class="report-years-data-row-label">
                        {{ provinceLabel(rows[index]?.label ?? '') }}
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`special_projects_research_female_${row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">
                            Female
                        </Label>
                        <Input
                            :id="`special_projects_research_female_${row.funding_program_id}`"
                            v-model="row.special_projects_research_female"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="tableInputClass"
                        />
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`special_projects_research_male_${row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">
                            Male
                        </Label>
                        <Input
                            :id="`special_projects_research_male_${row.funding_program_id}`"
                            v-model="row.special_projects_research_male"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="tableInputClass"
                        />
                    </div>

                    <div class="report-years-data-cell">
                        <Label :for="`special_projects_research_total_${row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">
                            Total researchers
                        </Label>
                        <Input
                            :id="`special_projects_research_total_${row.funding_program_id}`"
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
                Save special projects research
            </ReportSectionSaveActions>
        </form>
    </section>
</template>
