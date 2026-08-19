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
    /**
     * Which funding program family this instance edits. SETUP and CEST get
     * their own tab so one program's rows never crowd the other's. Used for
     * labelling and element ids only — the shell decides which rows belong here.
     */
    group: 'setup' | 'cest';
    /** Already narrowed by the shell to this group, and to what the user may write. */
    rows: EditableProgramFundingRow[];
    expectedUpdatedAt: string | null;
    isReadOnly: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ notice: [message: string] }>();

const tableInputClass = REPORT_TABLE_INPUT_CLASS;
const amountInputClass = REPORT_TABLE_AMOUNT_INPUT_CLASS;

const groupLabel = computed(() => props.group.toUpperCase());
const panelId = computed(() => `panel-${props.group}_funding`);
const tabId = computed(() => `tab-${props.group}_funding`);

const VALUE_FIELDS = [
    'female_projects',
    'female_amount',
    'male_projects',
    'male_amount',
    'funded_projects_count',
    'funded_projects_value',
    'training_participants',
    'jobs_total',
    'jobs_male',
    'jobs_female',
    'jobs_pwd',
    'jobs_senior_citizen',
    'jobs_ip',
    'jobs_4ps',
    'special_projects_research_male',
    'special_projects_research_female',
] as const;

type ValueField = (typeof VALUE_FIELDS)[number];

interface ColumnDef {
    field: ValueField;
    /**
     * Input id stem. Kept separate from `field` because the original funding
     * columns ship ids prefixed with `funding_` while the rest do not, and
     * those ids are referenced by tests and by every `<Label for>`.
     */
    idStem: string;
    label: string;
    kind: 'count' | 'amount';
}

interface SectionDef {
    /** Rendered after the group name in the first header cell. */
    title: string;
    /** Grid modifier shared by this section's header row and its data rows. */
    grid: string;
    columns: ColumnDef[];
}

const count = (field: ValueField, label: string, idStem: string = field): ColumnDef => ({ field, idStem, label, kind: 'count' });
const amount = (field: ValueField, label: string, idStem: string = field): ColumnDef => ({ field, idStem, label, kind: 'amount' });

/**
 * Each table is a list of sections; a section is one header band plus its rows.
 * The jobs table carries two sections (generated, then the disaggregation)
 * because they describe the same figure and read better under one border.
 */
const TABLES: SectionDef[][] = [
    [
        {
            title: 'Program',
            grid: 'funding',
            columns: [
                count('female_projects', 'Female projects', 'funding_female_projects'),
                amount('female_amount', 'Female amount', 'funding_female_amount'),
                count('male_projects', 'Male projects', 'funding_male_projects'),
                amount('male_amount', 'Male amount', 'funding_male_amount'),
            ],
        },
    ],
    [
        {
            title: 'Program metrics',
            grid: '4col',
            columns: [
                count('funded_projects_count', 'Funded projects'),
                amount('funded_projects_value', 'Value of funded projects'),
                count('training_participants', 'Training participants'),
            ],
        },
    ],
    [
        {
            title: 'Jobs generated',
            grid: '4col',
            columns: [count('jobs_total', 'Total'), count('jobs_male', 'Male'), count('jobs_female', 'Female')],
        },
        {
            title: 'Jobs breakdown',
            grid: '5col',
            columns: [
                count('jobs_pwd', 'PWD'),
                count('jobs_senior_citizen', 'Senior citizen'),
                count('jobs_ip', 'IP'),
                count('jobs_4ps', '4Ps'),
            ],
        },
    ],
    [
        {
            title: 'Special projects research',
            grid: '3col',
            columns: [count('special_projects_research_male', 'Male'), count('special_projects_research_female', 'Female')],
        },
    ],
];

const { form, save, error } = useRowSection({
    rows: props.rows.map((row) => ({
        funding_program_id: row.fundingProgramId,
        female_projects: row.femaleProjects ?? 0,
        female_amount: row.femaleAmount ?? 0,
        male_projects: row.maleProjects ?? 0,
        male_amount: row.maleAmount ?? 0,
        funded_projects_count: row.fundedProjectsCount ?? 0,
        funded_projects_value: row.fundedProjectsValue ?? 0,
        training_participants: row.trainingParticipants ?? 0,
        jobs_total: row.jobsTotal ?? 0,
        jobs_male: row.jobsMale ?? 0,
        jobs_female: row.jobsFemale ?? 0,
        jobs_pwd: row.jobsPwd ?? 0,
        jobs_senior_citizen: row.jobsSeniorCitizen ?? 0,
        jobs_ip: row.jobsIp ?? 0,
        jobs_4ps: row.jobs4ps ?? 0,
        special_projects_research_male: row.specialProjectsResearchMale ?? 0,
        special_projects_research_female: row.specialProjectsResearchFemale ?? 0,
    })),
    key: 'funding_program_id',
    fields: VALUE_FIELDS,
    // Amounts are decimals: send them raw so 2500.75 keeps its scale.
    decimalFields: ['female_amount', 'male_amount', 'funded_projects_value'],
    payloadKey: 'summaries',
    url: () => route('report-years.program-funding.update', props.reportYearId),
    expectedUpdatedAt: () => props.expectedUpdatedAt,
    notify: (message) => emit('notice', message),
});

const fundingRows = computed(() =>
    form.rows.map((row, index) => ({
        row,
        label: props.rows[index]?.label ?? `Program ${index + 1}`,
    })),
);

/**
 * Catches the jobs_male + jobs_female != jobs_total mismatch client-side,
 * before the round trip to the server rejects it — error prevention beats
 * error recovery.
 */
const jobsMismatch = (row: Record<string, number>): boolean =>
    Number(row.jobs_male) + Number(row.jobs_female) !== Number(row.jobs_total);
</script>

<template>
    <section :id="panelId" class="report-panel" role="tabpanel" :aria-labelledby="tabId">
        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <div class="space-y-6">
                <!-- Cap on the scroll container; see RstlMonthlySection. 6xl clears
                     the funding table's 52rem min-width. -->
                <div class="report-years-data-table-scroll max-w-6xl">
                    <div
                        v-for="(sections, tableIndex) in TABLES"
                        :key="`table-${tableIndex}`"
                        class="report-years-data-table report-years-data-table--wide report-years-data-table--funding"
                        :class="{ 'mt-4': tableIndex > 0 }"
                    >
                        <template v-for="section in sections" :key="section.title">
                            <div class="report-years-data-head" :class="`report-years-data-head--${section.grid}`">
                                <!-- Group name lives in the column header rather than a
                                     separate heading above the table: one line instead of
                                     two, and it labels the column it actually describes. -->
                                <span class="report-years-data-head-label">{{ groupLabel }} {{ section.title }}</span>
                                <span
                                    v-for="column in section.columns"
                                    :key="column.field"
                                    class="report-years-data-head-label report-years-data-head-label--center"
                                >
                                    {{ column.label }}
                                </span>
                            </div>

                            <div
                                v-for="item in fundingRows"
                                :key="`${section.title}-${item.row.funding_program_id}`"
                                class="report-years-data-row"
                                :class="`report-years-data-row--${section.grid}`"
                            >
                                <div class="report-years-data-row-label">
                                    {{ item.label }}
                                </div>

                                <div v-for="column in section.columns" :key="column.field" class="report-years-data-cell">
                                    <Label :for="`${column.idStem}_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">
                                        {{ column.label }}
                                    </Label>
                                    <Input
                                        :id="`${column.idStem}_${item.row.funding_program_id}`"
                                        v-model="item.row[column.field]"
                                        type="number"
                                        min="0"
                                        :step="column.kind === 'amount' ? '0.01' : undefined"
                                        :inputmode="column.kind === 'amount' ? 'decimal' : 'numeric'"
                                        :placeholder="column.kind === 'amount' ? '0.00' : undefined"
                                        :disabled="isReadOnly"
                                        :aria-invalid="column.field === 'jobs_total' ? jobsMismatch(item.row) : undefined"
                                        :class="column.kind === 'amount' ? amountInputClass : tableInputClass"
                                    />
                                    <!-- Catches the mismatch before submit rather than after the
                                         server round trip rejects it (error prevention). -->
                                    <p v-if="column.field === 'jobs_total' && jobsMismatch(item.row)" class="report-years-data-cell-error">
                                        Male + female ≠ total
                                    </p>
                                </div>
                            </div>
                        </template>
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
                    Save {{ groupLabel }} program funding
                </Button>
                <p v-show="form.recentlySuccessful" class="report-save-hint">
                    <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
                    Saved
                </p>
            </div>
        </form>
    </section>
</template>
