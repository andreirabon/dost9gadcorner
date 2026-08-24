<script setup lang="ts">
import ReportSectionSaveActions from '@/components/reports/edit/ReportSectionSaveActions.vue';
import InputError from '@/components/shared/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRowSection } from '@/composables/useRowSection';
import { REPORT_TABLE_AMOUNT_INPUT_CLASS, REPORT_TABLE_INPUT_CLASS } from '@/constants/reportFormClasses';
import { JOBS_BREAKDOWN_LABELS } from '@/constants/reportLabels';
import { formatNumberInput, parseNumberInput } from '@/helpers/formatNumber';
import type { EditableProgramFundingRow, FundingGroupPrefix } from '@/types/reports';
import { computed, ref } from 'vue';

interface Props {
    reportYearId: number;
    /**
     * Which funding program family this instance edits. SETUP, CEST and GIA
     * each get their own tab so one program's rows never crowd another's. Used
     * for labelling and element ids only — the shell decides which rows belong
     * here.
     */
    group: FundingGroupPrefix;
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
    columns: ColumnDef[];
}

/**
 * Every section renders on one grid, padded to the widest.
 *
 * Sized per section instead, the label column ended at 666px in one table and
 * 1116px in another, so reading a programme's figures down the tab meant
 * re-finding the column in every block. Filler cells are hidden from assistive
 * tech: they hold the grid and carry nothing.
 */
const DATA_COLUMNS = 4;

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
            title: 'Program Metrics',
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
            columns: [count('jobs_total', 'Total'), count('jobs_male', 'Male'), count('jobs_female', 'Female')],
        },
        {
            title: 'Jobs breakdown',
            columns: [
                count('jobs_pwd', JOBS_BREAKDOWN_LABELS.pwd),
                count('jobs_senior_citizen', JOBS_BREAKDOWN_LABELS.seniorCitizen),
                count('jobs_ip', JOBS_BREAKDOWN_LABELS.ip),
                count('jobs_4ps', JOBS_BREAKDOWN_LABELS.fourPs),
            ],
        },
    ],
    [
        {
            title: 'Special projects research',
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
const jobsMismatch = (row: Record<string, number>): boolean => Number(row.jobs_male) + Number(row.jobs_female) !== Number(row.jobs_total);

/**
 * Amount fields are grouped for reading — 2177208.91 is a wall of digits, while
 * 2,177,208.91 is a figure.
 *
 * `<input type="number">` cannot show separators: browsers treat a comma as
 * invalid and blank the field. So amounts render as text with a decimal
 * inputmode, and the grouping is applied only while the field is unfocused —
 * reformatting under the caret would move it mid-typing and swallow a separator
 * the moment it is typed. The model always holds the raw numeric string, so the
 * submitted payload is unchanged.
 */
/**
 * Text the user is currently typing, keyed by field. While a field is being
 * edited its box shows exactly these keystrokes; once it is left, the box goes
 * back to deriving its text from the model.
 *
 * Focusing deliberately does NOT rewrite the box. An earlier version swapped the
 * grouped text for the raw number on focus, which moved the caret out from under
 * the user mid-click and made a select-all-then-type replace nothing.
 */
const amountDrafts = ref<Record<string, string>>({});

const amountFieldKey = (programId: number, field: string): string => `${programId}:${field}`;

const amountDisplayValue = (programId: number, field: ValueField, raw: unknown): string => {
    const key = amountFieldKey(programId, field);

    if (key in amountDrafts.value) {
        return amountDrafts.value[key];
    }

    return formatNumberInput(raw === null || raw === undefined ? '' : String(raw));
};

/*
 * Bound to `update:modelValue`, not the native `input` event: the shared Input
 * wraps `useVModel` in passive mode, so it keeps its own copy of the value and
 * publishes it only through that emit. Listening for `input` left the two copies
 * drifting apart and the field accumulated digits.
 */
const onAmountInput = (programId: number, row: Record<string, unknown>, field: ValueField, value: string | number): void => {
    const typed = String(value);

    amountDrafts.value[amountFieldKey(programId, field)] = typed;
    row[field] = parseNumberInput(typed);
};

/** Dropping the draft hands the box back to the formatter. */
const onAmountBlur = (programId: number, field: ValueField): void => {
    const { [amountFieldKey(programId, field)]: _discarded, ...rest } = amountDrafts.value;

    amountDrafts.value = rest;
};
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
                            <div class="report-years-data-head report-years-data-head--program">
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
                                <span
                                    v-for="index in DATA_COLUMNS - section.columns.length"
                                    :key="`head-filler-${index}`"
                                    aria-hidden="true"
                                    class="report-years-data-head-label"
                                />
                            </div>

                            <div
                                v-for="(item, rowIndex) in fundingRows"
                                :key="`${section.title}-${item.row.funding_program_id}`"
                                class="report-years-data-row report-years-data-row--program"
                                :class="{ 'is-striped': rowIndex % 2 === 1 }"
                            >
                                <div class="report-years-data-row-label">
                                    {{ item.label }}
                                </div>

                                <div v-for="column in section.columns" :key="column.field" class="report-years-data-cell">
                                    <Label :for="`${column.idStem}_${item.row.funding_program_id}`" class="report-years-data-cell-label md:sr-only">
                                        {{ column.label }}
                                    </Label>
                                    <!--
                                        Amounts are text, not number, because a
                                        number input rejects the separators; the
                                        model still holds a plain numeric string.

                                        The peso sign is a decoration on the
                                        field, not part of the value: the input
                                        parser rejects a string containing one
                                        (see formatNumber.spec.ts), so putting it
                                        in the model would blank the field. It is
                                        aria-hidden because the label already
                                        names the column, and the currency is
                                        read out by the field's own unit text
                                        rather than a stray glyph in the middle
                                        of the accessible name.
                                    -->
                                    <div v-if="column.kind === 'amount'" class="report-years-amount-field">
                                        <span class="report-years-amount-prefix" aria-hidden="true">&#8369;</span>
                                        <Input
                                            :id="`${column.idStem}_${item.row.funding_program_id}`"
                                            :model-value="amountDisplayValue(item.row.funding_program_id, column.field, item.row[column.field])"
                                            type="text"
                                            inputmode="decimal"
                                            placeholder="0.00"
                                            :disabled="isReadOnly"
                                            :class="amountInputClass"
                                            @update:model-value="onAmountInput(item.row.funding_program_id, item.row, column.field, $event)"
                                            @blur="onAmountBlur(item.row.funding_program_id, column.field)"
                                        />
                                    </div>
                                    <Input
                                        v-else
                                        :id="`${column.idStem}_${item.row.funding_program_id}`"
                                        v-model="item.row[column.field]"
                                        type="number"
                                        min="0"
                                        inputmode="numeric"
                                        :disabled="isReadOnly"
                                        :aria-invalid="column.field === 'jobs_total' ? jobsMismatch(item.row) : undefined"
                                        :class="tableInputClass"
                                    />
                                    <!-- Catches the mismatch before submit rather than after the
                                         server round trip rejects it (error prevention). -->
                                    <p v-if="column.field === 'jobs_total' && jobsMismatch(item.row)" class="report-years-data-cell-error">
                                        Male + female ≠ total
                                    </p>
                                </div>

                                <div
                                    v-for="index in DATA_COLUMNS - section.columns.length"
                                    :key="`${section.title}-${item.row.funding_program_id}-filler-${index}`"
                                    aria-hidden="true"
                                    class="report-years-data-cell"
                                />
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <InputError :message="error" />

            <ReportSectionSaveActions :processing="form.processing" :recently-successful="form.recentlySuccessful" :is-read-only="isReadOnly">
                Save {{ groupLabel }} program funding
            </ReportSectionSaveActions>
        </form>
    </section>
</template>
