<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
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
            <HeadingSmall
                variant="report"
                title="Scholarship"
                description="Track scholar counts across the year. Each update is saved as a separate snapshot — previous data is always preserved."
            />

            <Transition name="fade-slide" mode="out-in">
                <div v-if="!showAddForm" key="btn" class="mt-6 mb-6">
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
                    class="report-form report-form--edit mt-6 mb-6 w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-[transform,background-color,border-color,color] duration-200 ease-out"
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

                    <div class="mt-6 flex flex-wrap items-center gap-4 border-t border-zinc-200/80 pt-4">
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

                <!-- Vertical Timeline line -->
                <div class="relative ml-3 space-y-6 border-l border-zinc-200 pl-6">
                    <div
                        v-for="(snap, index) in reportYear.scholarshipSnapshots"
                        :key="snap.id"
                        class="relative rounded-2xl border p-5 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm"
                        :class="index === 0 ? 'border-emerald-200 bg-emerald-50/30 shadow-[0_8px_30px_rgb(0,0,0,0.01)]' : 'border-zinc-200 bg-white'"
                    >
                        <!-- Timeline node indicator dot -->
                        <div
                            class="absolute top-[26px] -left-[33px] flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white"
                            :class="index === 0 ? 'border-emerald-500' : 'border-zinc-300'"
                        >
                            <div class="h-1.5 w-1.5 rounded-full" :class="index === 0 ? 'animate-pulse bg-emerald-500' : 'bg-zinc-300'" />
                        </div>

                        <!-- View mode -->
                        <template v-if="editingSnapshotId !== snap.id">
                            <div class="flex items-start justify-between gap-4">
                                <div class="min-w-0 flex-1">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span class="text-sm font-semibold text-zinc-900"> As of {{ snap.asOfDate ?? 'No date' }} </span>
                                        <span
                                            v-if="index === 0"
                                            class="inline-flex items-center rounded-full bg-emerald-100/80 px-2 py-0.5 text-sm font-bold text-emerald-800"
                                        >
                                            Latest Snapshot
                                        </span>
                                    </div>
                                    <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
                                        <span
                                            >School Year:
                                            <span class="font-medium text-zinc-900">{{ snap.schoolYearLabel || 'No school year' }}</span></span
                                        >
                                        <span
                                            >F:
                                            <span class="font-mono font-semibold text-zinc-950 tabular-nums">{{ snap.femaleCount ?? 0 }}</span></span
                                        >
                                        <span
                                            >M:
                                            <span class="font-mono font-semibold text-zinc-950 tabular-nums">{{ snap.maleCount ?? 0 }}</span></span
                                        >
                                        <span class="font-medium text-zinc-900"
                                            >Total:
                                            <span class="font-mono font-bold text-zinc-950 tabular-nums">{{
                                                Number(snap.femaleCount ?? 0) + Number(snap.maleCount ?? 0)
                                            }}</span></span
                                        >
                                    </div>
                                    <p class="mt-2 flex items-center gap-1.5 text-sm text-zinc-600">
                                        <Calendar class="size-3 text-zinc-400" />
                                        <span
                                            >Added
                                            {{
                                                snap.createdAt
                                                    ? new Date(snap.createdAt).toLocaleDateString('en-PH', {
                                                          month: 'short',
                                                          day: 'numeric',
                                                          year: 'numeric',
                                                      })
                                                    : 'unknown'
                                            }}</span
                                        >
                                        <template v-if="snap.lastEditedBy">
                                            <span>·</span>
                                            <span
                                                >Last edited by <span class="font-medium text-zinc-600">{{ snap.lastEditedBy }}</span></span
                                            >
                                            <template v-if="snap.lastEditedAt">
                                                <span
                                                    >on
                                                    {{
                                                        new Date(snap.lastEditedAt).toLocaleDateString('en-PH', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })
                                                    }}</span
                                                >
                                            </template>
                                        </template>
                                    </p>
                                </div>
                                <div class="flex shrink-0 items-center gap-1.5">
                                    <button
                                        v-if="canUpdate"
                                        type="button"
                                        :disabled="isReadOnly"
                                        class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-zinc-600 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-zinc-100 hover:text-zinc-900 active:scale-[0.95] disabled:pointer-events-none disabled:opacity-50"
                                        @click="startEditSnapshot(snap)"
                                    >
                                        <Pencil class="size-3.5" aria-hidden="true" />
                                        Edit
                                    </button>
                                    <button
                                        v-if="canDelete"
                                        type="button"
                                        :disabled="isReadOnly"
                                        class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-red-600 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-red-50 hover:text-red-700 active:scale-[0.95] disabled:pointer-events-none disabled:opacity-50"
                                        @click="confirmDeleteScholarshipSnapshot(snap.id)"
                                    >
                                        <Trash2 class="size-3.5" aria-hidden="true" />
                                        Delete
                                    </button>
                                </div>
                            </div>
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

                                <div class="mt-6 flex flex-wrap items-center gap-3 border-t border-zinc-200/80 pt-4">
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
                    </div>
                </div>
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
