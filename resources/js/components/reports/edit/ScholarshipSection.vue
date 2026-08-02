<script setup lang="ts">
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReportSectionSave } from '@/composables/useReportSectionSave';
import { REPORT_INPUT_CLASS } from '@/constants/reportFormClasses';
import type { EditableReportYear, LookupSchoolYear, ScholarshipSnapshot } from '@/types/reports';
import { router, useForm } from '@inertiajs/vue3';
import { Calendar, CheckCircle2, Loader2, Pencil, Plus, Save, Trash2, X } from '@lucide/vue';
import { computed, ref } from 'vue';

interface Props {
    reportYear: EditableReportYear;
    schoolYears: LookupSchoolYear[];
    canUpdate: boolean;
    canDelete: boolean;
    isReadOnly: boolean;
}

const props = defineProps<Props>();

/** The page shell owns the shared notice line, so messages are reported upward. */
const emit = defineEmits<{ notice: [message: string] }>();

const { patchOptions, handleConflictError, firstErrorMessage } = useReportSectionSave();

const inputClass = REPORT_INPUT_CLASS;

// The relation is ordered newest-first by the server, so index 0 is the latest.
const latestSnapshot = computed(() => props.reportYear.scholarshipSnapshots[0] ?? null);

// Must match the server, which validates as_of_date with before_or_equal against
// now('Asia/Manila'). Using the browser's own date hands a client east of Manila a
// default that its very first save rejects. 'en-CA' formats as YYYY-MM-DD.
const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' });

const showAddForm = ref(false);

const newSnapshotForm = useForm({
    school_year_id: latestSnapshot.value?.schoolYearId ?? '',
    as_of_date: todayDate,
    female_count: 0,
    male_count: 0,
});

const editingSnapshotId = ref<number | null>(null);

const editSnapshotForm = useForm({
    school_year_id: '' as string | number,
    as_of_date: '',
    female_count: 0,
    male_count: 0,
});

function reportError(errors: Record<string, string>, fallback: string): void {
    if (handleConflictError(errors)) {
        return;
    }

    emit('notice', firstErrorMessage(errors) ?? fallback);
}

function startEditSnapshot(snap: ScholarshipSnapshot): void {
    editingSnapshotId.value = snap.id;
    editSnapshotForm.school_year_id = snap.schoolYearId ?? '';
    editSnapshotForm.as_of_date = snap.asOfDate ?? '';
    editSnapshotForm.female_count = snap.femaleCount;
    editSnapshotForm.male_count = snap.maleCount;
}

function cancelEditSnapshot(): void {
    editingSnapshotId.value = null;
    editSnapshotForm.reset();
}

function storeScholarshipSnapshot(): void {
    newSnapshotForm.post(route('report-years.scholarship.store', props.reportYear.id), {
        ...patchOptions,
        onSuccess: () => {
            newSnapshotForm.reset('female_count', 'male_count');
            newSnapshotForm.as_of_date = todayDate;
            showAddForm.value = false;
        },
        onError: (errors) => reportError(errors, 'Could not add that snapshot.'),
    });
}

function saveEditSnapshot(snapshotId: number): void {
    const snap = props.reportYear.scholarshipSnapshots.find((s) => s.id === snapshotId);

    if (!snap) {
        return;
    }

    editSnapshotForm
        .transform((data) => ({ ...data, expected_updated_at: snap.updatedAt }))
        .patch(route('report-years.scholarship.update', [props.reportYear.id, snapshotId]), {
            ...patchOptions,
            onSuccess: () => {
                editingSnapshotId.value = null;
            },
            onError: (errors) => reportError(errors, 'Could not save that snapshot.'),
        });
}

const pendingDeleteSnapshotId = ref<number | null>(null);

const deleteSnapshotDialogOpen = computed({
    get: () => pendingDeleteSnapshotId.value !== null,
    set: (open: boolean) => {
        if (!open) {
            pendingDeleteSnapshotId.value = null;
        }
    },
});

function confirmDeleteScholarshipSnapshot(snapshotId: number): void {
    pendingDeleteSnapshotId.value = snapshotId;
}

function deleteScholarshipSnapshot(): void {
    if (pendingDeleteSnapshotId.value === null) {
        return;
    }

    router.delete(route('report-years.scholarship.destroy', [props.reportYear.id, pendingDeleteSnapshotId.value]), {
        ...patchOptions,
        // The button is disabled while the report is locked, so this covers the
        // races: someone else locked the year or removed the row first. Without
        // it the dialog just closes and the row is still sitting there.
        onError: (errors) => reportError(errors, 'Could not delete that snapshot. Refresh and try again.'),
        onFinish: () => {
            pendingDeleteSnapshotId.value = null;
        },
    });
}

const toNum = (v: unknown): number => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const newSnapshotTotal = computed(() => toNum(newSnapshotForm.female_count) + toNum(newSnapshotForm.male_count));
const editSnapshotTotal = computed(() => toNum(editSnapshotForm.female_count) + toNum(editSnapshotForm.male_count));
</script>

<template>
    <div>
        <section id="panel-scholarship" class="report-panel" role="tabpanel" aria-labelledby="tab-scholarship">
            <Transition name="fade-slide" mode="out-in">
                <div v-if="!showAddForm" key="btn" class="mb-6">
                    <Button
                        type="button"
                        variant="outline"
                        :disabled="isReadOnly"
                        class="flex items-center gap-2 border-emerald-200 bg-emerald-50/20 text-emerald-700 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-emerald-50 hover:text-emerald-800 active:scale-[0.97]"
                        @click="showAddForm = true"
                    >
                        <Plus class="size-4 animate-pulse text-emerald-600" aria-hidden="true" />
                        <span>Add New Snapshot</span>
                    </Button>
                </div>

                <form
                    v-else
                    key="form"
                    class="report-form report-form--edit mb-6 w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-[transform,background-color,border-color,color] duration-200 ease-out"
                    @submit.prevent="storeScholarshipSnapshot"
                >
                    <div class="mb-4 flex items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                        <div class="flex items-center gap-2">
                            <Plus class="size-4 text-emerald-600" aria-hidden="true" />
                            <span class="text-sm font-semibold text-zinc-900">Add New Snapshot</span>
                        </div>
                        <button
                            type="button"
                            class="text-sm text-zinc-400 underline transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-zinc-700 active:scale-[0.95]"
                            @click="showAddForm = false"
                        >
                            Cancel
                        </button>
                    </div>

                    <div class="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
                        <div class="grid gap-2">
                            <Label for="new_school_year_id">School year</Label>
                            <select
                                id="new_school_year_id"
                                v-model="newSnapshotForm.school_year_id"
                                :disabled="isReadOnly"
                                class="report-select transition-all hover:border-zinc-300 focus:border-zinc-400"
                            >
                                <option value="" disabled>Select school year…</option>
                                <option v-for="sy in schoolYears" :key="sy.id" :value="sy.id">
                                    {{ sy.label }}
                                </option>
                            </select>
                            <InputError :message="newSnapshotForm.errors.school_year_id" />
                        </div>

                        <div class="grid gap-2">
                            <Label for="new_as_of_date">As of date</Label>
                            <Input
                                id="new_as_of_date"
                                v-model="newSnapshotForm.as_of_date"
                                type="date"
                                :max="todayDate"
                                :disabled="isReadOnly"
                                :class="inputClass"
                            />
                            <InputError :message="newSnapshotForm.errors.as_of_date" />
                        </div>
                    </div>

                    <div class="mt-6 rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 shadow-sm">
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div class="grid gap-2">
                                <Label for="new_female_count">Female</Label>
                                <Input
                                    id="new_female_count"
                                    v-model="newSnapshotForm.female_count"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    :disabled="isReadOnly"
                                    :class="inputClass"
                                />
                                <InputError :message="newSnapshotForm.errors.female_count" />
                            </div>

                            <div class="grid gap-2">
                                <Label for="new_male_count">Male</Label>
                                <Input
                                    id="new_male_count"
                                    v-model="newSnapshotForm.male_count"
                                    type="number"
                                    min="0"
                                    inputmode="numeric"
                                    :disabled="isReadOnly"
                                    :class="inputClass"
                                />
                                <InputError :message="newSnapshotForm.errors.male_count" />
                            </div>
                        </div>

                        <div class="mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm">
                            <span class="font-medium text-zinc-500">Total Scholars</span>
                            <span class="rounded-lg bg-zinc-950 px-3 py-1 font-mono text-sm font-semibold text-white tabular-nums">
                                {{ newSnapshotTotal }}
                            </span>
                        </div>
                    </div>

                    <div class="report-years-form-actions mt-6">
                        <Button
                            type="submit"
                            class="report-save-btn flex items-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                            :disabled="newSnapshotForm.processing || reportYear.isLocked"
                        >
                            <Loader2 v-if="newSnapshotForm.processing" class="size-4 animate-spin" aria-hidden="true" />
                            <Plus v-else class="size-4" :stroke-width="2.5" aria-hidden="true" />
                            Save new snapshot
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            class="text-zinc-500 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-zinc-800 active:scale-[0.97]"
                            @click="showAddForm = false"
                        >
                            Cancel
                        </Button>
                        <p v-show="newSnapshotForm.recentlySuccessful" class="report-save-hint">
                            <CheckCircle2 class="size-4 shrink-0 text-emerald-600" :stroke-width="2" aria-hidden="true" />
                            Saved
                        </p>
                    </div>
                </form>
            </Transition>

            <!-- Snapshot History -->
            <div v-if="reportYear.scholarshipSnapshots.length > 0" class="mt-8">
                <div class="mb-4 flex items-center gap-2">
                    <span class="text-sm font-semibold text-zinc-900">Snapshot History</span>
                    <span class="rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-sm font-bold text-zinc-700">{{
                        reportYear.scholarshipSnapshots.length
                    }}</span>
                </div>

                <!--
                    Rows on a timeline rail, not cards: the panel is already a card and
                    nesting a second one around every snapshot added a border with no
                    information in it. The rail carries the chronology instead.
                -->
                <ol class="report-snapshot-list">
                    <li
                        v-for="(snap, index) in reportYear.scholarshipSnapshots"
                        :key="snap.id"
                        class="report-snapshot"
                        :class="{ 'is-latest': index === 0 }"
                    >
                        <!-- Timeline node. Centred on the rail from the row's own padding,
                             so it no longer depends on hand-computed pixel offsets. -->
                        <span class="report-snapshot-node" aria-hidden="true" />

                        <!-- View mode -->
                        <template v-if="editingSnapshotId !== snap.id">
                            <!-- Actions sit on the header baseline rather than floating
                                 mid-row against nothing. -->
                            <div class="report-snapshot-head">
                                <span class="report-snapshot-date">As of {{ snap.asOfDate ?? 'No date' }}</span>
                                <span v-if="index === 0" class="report-snapshot-badge">Latest Snapshot</span>
                                <div class="report-snapshot-actions">
                                    <button
                                        v-if="canUpdate"
                                        type="button"
                                        :disabled="isReadOnly"
                                        class="report-snapshot-action"
                                        @click="startEditSnapshot(snap)"
                                    >
                                        <Pencil class="size-3.5" aria-hidden="true" />
                                        Edit
                                    </button>
                                    <button
                                        v-if="canDelete"
                                        type="button"
                                        :disabled="isReadOnly"
                                        class="report-snapshot-action report-snapshot-action--danger"
                                        @click="confirmDeleteScholarshipSnapshot(snap.id)"
                                    >
                                        <Trash2 class="size-3.5" aria-hidden="true" />
                                        Delete
                                    </button>
                                </div>
                            </div>

                            <!-- The counts are why the row exists, so they read as figures
                                 in a row rather than four lines of "Label: value" prose. -->
                            <dl class="report-snapshot-stats">
                                <div class="report-snapshot-stat">
                                    <dt>School Year</dt>
                                    <dd class="report-snapshot-stat-text">{{ snap.schoolYearLabel || 'No school year' }}</dd>
                                </div>
                                <div class="report-snapshot-stat">
                                    <dt>Female</dt>
                                    <dd>{{ snap.femaleCount ?? 0 }}</dd>
                                </div>
                                <div class="report-snapshot-stat">
                                    <dt>Male</dt>
                                    <dd>{{ snap.maleCount ?? 0 }}</dd>
                                </div>
                                <div class="report-snapshot-stat is-total">
                                    <dt>Total</dt>
                                    <dd>{{ Number(snap.femaleCount ?? 0) + Number(snap.maleCount ?? 0) }}</dd>
                                </div>
                            </dl>

                            <p class="report-snapshot-meta">
                                <Calendar class="size-3 shrink-0 text-slate-400" aria-hidden="true" />
                                <span>
                                    Added
                                    {{
                                        snap.createdAt
                                            ? new Date(snap.createdAt).toLocaleDateString('en-PH', {
                                                  month: 'short',
                                                  day: 'numeric',
                                                  year: 'numeric',
                                              })
                                            : 'unknown'
                                    }}
                                </span>
                                <template v-if="snap.lastEditedBy">
                                    <span aria-hidden="true">·</span>
                                    <span>
                                        Last edited by <span class="font-medium text-slate-700">{{ snap.lastEditedBy }}</span>
                                        <template v-if="snap.lastEditedAt">
                                            on
                                            {{ new Date(snap.lastEditedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) }}
                                        </template>
                                    </span>
                                </template>
                            </p>
                        </template>

                        <!-- Edit mode -->
                        <template v-else>
                            <form class="space-y-4" @submit.prevent="saveEditSnapshot(snap.id)">
                                <div class="mb-2 flex items-center justify-between gap-2 border-b border-zinc-200/80 pb-2">
                                    <span class="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                                        <Pencil class="size-4 text-zinc-500" aria-hidden="true" />
                                        Editing Snapshot
                                    </span>
                                    <button
                                        type="button"
                                        class="text-zinc-400 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-zinc-700 active:scale-[0.95]"
                                        @click="cancelEditSnapshot"
                                    >
                                        <X class="size-4" />
                                    </button>
                                </div>

                                <div class="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
                                    <div class="grid gap-2">
                                        <Label :for="`edit_school_year_${snap.id}`">School year</Label>
                                        <select
                                            :id="`edit_school_year_${snap.id}`"
                                            v-model="editSnapshotForm.school_year_id"
                                            :disabled="isReadOnly"
                                            class="report-select transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
                                        >
                                            <option value="" disabled>Select school year…</option>
                                            <option v-for="sy in schoolYears" :key="sy.id" :value="sy.id">
                                                {{ sy.label }}
                                            </option>
                                        </select>
                                        <InputError :message="editSnapshotForm.errors.school_year_id" />
                                    </div>

                                    <div class="grid gap-2">
                                        <Label :for="`edit_as_of_date_${snap.id}`">As of date</Label>
                                        <Input
                                            :id="`edit_as_of_date_${snap.id}`"
                                            v-model="editSnapshotForm.as_of_date"
                                            type="date"
                                            :max="todayDate"
                                            :disabled="isReadOnly"
                                            :class="inputClass"
                                        />
                                        <InputError :message="editSnapshotForm.errors.as_of_date" />
                                    </div>
                                </div>

                                <div class="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
                                    <div class="grid gap-4 sm:grid-cols-2">
                                        <div class="grid gap-2">
                                            <Label :for="`edit_female_${snap.id}`">Female</Label>
                                            <Input
                                                :id="`edit_female_${snap.id}`"
                                                v-model="editSnapshotForm.female_count"
                                                type="number"
                                                min="0"
                                                inputmode="numeric"
                                                :disabled="isReadOnly"
                                                :class="inputClass"
                                            />
                                            <InputError :message="editSnapshotForm.errors.female_count" />
                                        </div>
                                        <div class="grid gap-2">
                                            <Label :for="`edit_male_${snap.id}`">Male</Label>
                                            <Input
                                                :id="`edit_male_${snap.id}`"
                                                v-model="editSnapshotForm.male_count"
                                                type="number"
                                                min="0"
                                                inputmode="numeric"
                                                :disabled="isReadOnly"
                                                :class="inputClass"
                                            />
                                            <InputError :message="editSnapshotForm.errors.male_count" />
                                        </div>
                                    </div>

                                    <div class="mt-4 flex items-center justify-between border-t border-zinc-200/60 pt-3 text-sm">
                                        <span class="font-medium text-zinc-500">Total Scholars</span>
                                        <span class="rounded-lg bg-zinc-950 px-3 py-1 font-mono text-sm font-semibold text-white tabular-nums">
                                            {{ editSnapshotTotal }}
                                        </span>
                                    </div>
                                </div>

                                <div class="report-years-form-actions mt-6">
                                    <Button
                                        type="submit"
                                        class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                                        :disabled="editSnapshotForm.processing || reportYear.isLocked"
                                    >
                                        <Loader2 v-if="editSnapshotForm.processing" class="size-4 animate-spin" aria-hidden="true" />
                                        <Save v-else class="size-4" :stroke-width="2.5" aria-hidden="true" />
                                        Save changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        class="text-zinc-500 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-zinc-800 active:scale-[0.97]"
                                        @click="cancelEditSnapshot"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </template>
                    </li>
                </ol>
            </div>

            <div v-else class="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/20 p-8 text-center">
                <Calendar class="mx-auto mb-3 size-8 text-zinc-400" />
                <h4 class="text-sm font-semibold text-zinc-900">No snapshots recorded</h4>
                <p class="mx-auto mt-1 max-w-sm text-sm text-zinc-600">
                    No scholarship data snapshots have been added for this year yet. Click "Add New Snapshot" above to create the first record.
                </p>
            </div>
        </section>

        <Dialog v-model:open="deleteSnapshotDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete snapshot</DialogTitle>
                    <DialogDescription>This snapshot will be permanently removed. This cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="outline" @click="deleteSnapshotDialogOpen = false"> Cancel </Button>
                    <Button type="button" variant="destructive" @click="deleteScholarshipSnapshot"> Delete snapshot </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
