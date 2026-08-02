<script setup lang="ts">
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRowSection } from '@/composables/useRowSection';
import { REPORT_TABLE_AMOUNT_INPUT_CLASS, REPORT_TABLE_INPUT_CLASS } from '@/constants/reportFormClasses';
import type { EditableProgramFundingRow } from '@/types/reports';
import { CheckCircle2, Loader2, Save } from '@lucide/vue';
import { computed } from 'vue';

interface Props {
    reportYearId: number;
    rows: EditableProgramFundingRow[];
    /** Slugs this user may write, or null when unrestricted. */
    editableFundingSlugs: string[] | null;
    expectedUpdatedAt: string | null;
    isReadOnly: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ notice: [message: string] }>();

const tableInputClass = REPORT_TABLE_INPUT_CLASS;
const amountInputClass = REPORT_TABLE_AMOUNT_INPUT_CLASS;

const VALUE_FIELDS = ['female_projects', 'female_amount', 'male_projects', 'male_amount'] as const;

const { form, save, error } = useRowSection({
    rows: props.rows.map((row) => ({
        funding_program_id: row.fundingProgramId,
        female_projects: row.femaleProjects ?? 0,
        female_amount: row.femaleAmount ?? 0,
        male_projects: row.maleProjects ?? 0,
        male_amount: row.maleAmount ?? 0,
    })),
    key: 'funding_program_id',
    fields: VALUE_FIELDS,
    // Amounts are decimals: send them raw so 2500.75 keeps its scale.
    decimalFields: ['female_amount', 'male_amount'],
    payloadKey: 'summaries',
    url: () => route('report-years.program-funding.update', props.reportYearId),
    expectedUpdatedAt: () => props.expectedUpdatedAt,
    notify: (message) => emit('notice', message),
});

const isSetupFundingSlug = (slug: string): boolean => slug === 'setup' || slug.startsWith('setup-');
const isCestFundingSlug = (slug: string): boolean => slug === 'cest' || slug.startsWith('cest-');

/**
 * Rows the server will accept a write for. `editableFundingSlugs` is null when
 * the user is unrestricted; otherwise it is the exact allowlist the server
 * enforces, so hiding anything else here just avoids offering a doomed edit.
 */
const isFundingSlugEditable = (slug: string): boolean => props.editableFundingSlugs === null || props.editableFundingSlugs.includes(slug);

const fundingRows = computed(() =>
    form.rows.map((row, index) => ({
        row,
        label: props.rows[index]?.label ?? `Program ${index + 1}`,
        slug: props.rows[index]?.slug ?? '',
    })),
);

const setupFundingRows = computed(() => fundingRows.value.filter((item) => isSetupFundingSlug(item.slug) && isFundingSlugEditable(item.slug)));
const cestFundingRows = computed(() => fundingRows.value.filter((item) => isCestFundingSlug(item.slug) && isFundingSlugEditable(item.slug)));
</script>

<template>
    <section id="panel-program_funding" class="report-panel" role="tabpanel" aria-labelledby="tab-program_funding">
        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <div class="space-y-6">
                <!-- Cap on the scroll container; see RstlMonthlySection. 6xl clears
                     the funding table's 52rem min-width. -->
                <div
                    v-for="group in [
                        { key: 'setup', title: 'SETUP', rows: setupFundingRows },
                        { key: 'cest', title: 'CEST', rows: cestFundingRows },
                    ]"
                    :key="group.key"
                    class="report-years-data-table-scroll max-w-6xl"
                >
                    <div class="report-years-data-table report-years-data-table--wide report-years-data-table--funding">
                        <div class="report-years-data-head report-years-data-head--funding">
                            <!-- Group name lives in the column header rather than a
                                     separate heading above the table: one line instead of
                                     two, and it labels the column it actually describes. -->
                            <span class="report-years-data-head-label">{{ group.title }} Program</span>
                            <span class="report-years-data-head-label report-years-data-head-label--center">Female projects</span>
                            <span class="report-years-data-head-label report-years-data-head-label--center">Female amount</span>
                            <span class="report-years-data-head-label report-years-data-head-label--center">Male projects</span>
                            <span class="report-years-data-head-label report-years-data-head-label--center">Male amount</span>
                        </div>
                        <div
                            v-for="item in group.rows"
                            :key="item.row.funding_program_id"
                            class="report-years-data-row report-years-data-row--funding"
                        >
                            <div class="report-years-data-row-label">
                                {{ item.label }}
                            </div>

                            <div class="report-years-data-cell">
                                <Label :for="`funding_female_projects_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only"
                                    >Female projects</Label
                                >
                                <Input
                                    :id="`funding_female_projects_${item.row.funding_program_id}`"
                                    v-model="item.row.female_projects"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    :disabled="isReadOnly"
                                    :class="tableInputClass"
                                />
                            </div>

                            <div class="report-years-data-cell">
                                <Label :for="`funding_female_amount_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only"
                                    >Female amount</Label
                                >
                                <Input
                                    :id="`funding_female_amount_${item.row.funding_program_id}`"
                                    v-model="item.row.female_amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputmode="decimal"
                                    placeholder="0.00"
                                    :disabled="isReadOnly"
                                    :class="amountInputClass"
                                />
                            </div>

                            <div class="report-years-data-cell">
                                <Label :for="`funding_male_projects_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only"
                                    >Male projects</Label
                                >
                                <Input
                                    :id="`funding_male_projects_${item.row.funding_program_id}`"
                                    v-model="item.row.male_projects"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    :disabled="isReadOnly"
                                    :class="tableInputClass"
                                />
                            </div>

                            <div class="report-years-data-cell">
                                <Label :for="`funding_male_amount_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only"
                                    >Male amount</Label
                                >
                                <Input
                                    :id="`funding_male_amount_${item.row.funding_program_id}`"
                                    v-model="item.row.male_amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    inputmode="decimal"
                                    placeholder="0.00"
                                    :disabled="isReadOnly"
                                    :class="amountInputClass"
                                />
                            </div>
                        </div>
                    </div>
                </div>
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
                    Save program funding
                </Button>
                <p v-show="form.recentlySuccessful" class="report-save-hint">
                    <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
                    Saved
                </p>
            </div>
        </form>
    </section>
</template>
