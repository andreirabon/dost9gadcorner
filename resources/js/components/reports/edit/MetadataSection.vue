<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReportSectionSave } from '@/composables/useReportSectionSave';
import { REPORT_INPUT_CLASS } from '@/constants/reportFormClasses';
import { REPORT_YEAR_FIELD_LIMITS } from '@/constants/reportYearFields';
import { cloneSnapshot, diffObjectPatch, hasPatch, normalizeNumeric } from '@/helpers/reportPatch';
import { router, useForm } from '@inertiajs/vue3';
import { CheckCircle2, Loader2, Save } from '@lucide/vue';
import { computed, ref } from 'vue';

interface Props {
    reportYearId: number;
    year: number;
    title: string | null;
    description: string | null;
    status: 'pending' | 'published';
    publishedAtLabel: string | null;
    /** Admins may also change status; everyone else patches metadata only. */
    canUpdateFullReport: boolean;
    expectedUpdatedAt: string | null;
    isReadOnly: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ notice: [message: string]; 'title-change': [title: string] }>();

const inputClass = REPORT_INPUT_CLASS;

const form = useForm({
    year: props.year,
    title: props.title ?? '',
    description: props.description ?? '',
    status: props.status,
});

const { patchOptions, handleConflictError, firstErrorMessage } = useReportSectionSave();

const snapshot = () =>
    cloneSnapshot({
        year: normalizeNumeric(form.year),
        title: form.title,
        description: form.description,
        status: form.status,
    });

const baseline = ref(snapshot());
const saving = ref(false);

function save(): void {
    const fields = props.canUpdateFullReport ? (['year', 'title', 'description', 'status'] as const) : (['year', 'title', 'description'] as const);

    const patch = diffObjectPatch(baseline.value, snapshot(), [...fields], { numeric: ['year'] });

    if (!hasPatch(patch)) {
        emit('notice', 'No changes to save.');
        return;
    }

    const url = props.canUpdateFullReport
        ? route('report-years.update', props.reportYearId)
        : route('report-years.metadata.update', props.reportYearId);

    saving.value = true;
    form.clearErrors();

    router.patch(url, { ...(patch ?? {}), expected_updated_at: props.expectedUpdatedAt } as Record<string, string | number | null>, {
        ...patchOptions,
        onSuccess: () => {
            baseline.value = snapshot();
        },
        onError: (errors) => {
            if (handleConflictError(errors)) {
                return;
            }
            // Metadata is the one section with per-field inputs, so errors are
            // bound to the form as well as surfaced in the notice line.
            form.setError(errors);
            const message = firstErrorMessage(errors);
            if (message !== null) {
                emit('notice', message);
            }
        },
        onFinish: () => {
            saving.value = false;
        },
    });
}

const descriptionLength = computed(() => String(form.description ?? '').length);

const patchError = computed(() => (form.errors as Record<string, string | undefined>).patch);
</script>

<template>
    <section id="panel-metadata" class="report-panel" role="tabpanel" aria-labelledby="tab-metadata">
        <HeadingSmall
            variant="report"
            title="Metadata"
            description="Calendar year, publication status, and the title and description readers see for this report."
        />

        <form class="report-form report-form--edit w-full" autocomplete="off" @submit.prevent="save">
            <div class="grid gap-4 sm:grid-cols-[10rem_14rem]">
                <div class="grid gap-2">
                    <Label for="year">Year</Label>
                    <Input
                        id="year"
                        v-model="form.year"
                        name="year"
                        type="number"
                        :min="REPORT_YEAR_FIELD_LIMITS.yearMin"
                        :max="REPORT_YEAR_FIELD_LIMITS.yearMax"
                        inputmode="numeric"
                        :disabled="isReadOnly"
                        :class="inputClass"
                    />
                    <InputError :message="form.errors.year" />
                </div>

                <div v-if="canUpdateFullReport" class="grid gap-2">
                    <Label for="status">Status</Label>
                    <select
                        id="status"
                        v-model="form.status"
                        name="status"
                        :disabled="isReadOnly"
                        class="report-select transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
                    >
                        <option value="pending">Pending</option>
                        <option value="published">Published</option>
                    </select>
                    <InputError :message="form.errors.status" />
                </div>
                <div v-else class="grid gap-2">
                    <span class="text-sm font-medium text-black">Status</span>
                    <p class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-black">
                        <span v-if="form.status === 'published'" class="font-medium text-emerald-800">
                            Published<template v-if="publishedAtLabel"> · {{ publishedAtLabel }}</template>
                        </span>
                        <span v-else class="font-medium text-amber-800">Pending</span>
                    </p>
                </div>
            </div>

            <div class="grid gap-2">
                <Label for="title">Title</Label>
                <Input
                    id="title"
                    v-model="form.title"
                    name="title"
                    type="text"
                    placeholder="Optional custom title"
                    :maxlength="REPORT_YEAR_FIELD_LIMITS.title"
                    :disabled="isReadOnly"
                    :class="inputClass"
                    @input="emit('title-change', String(form.title ?? '').trim())"
                />
                <p class="text-xs text-black">Up to {{ REPORT_YEAR_FIELD_LIMITS.title }} characters.</p>
                <InputError :message="form.errors.title" />
            </div>

            <div class="grid gap-2">
                <Label for="description">Description</Label>
                <textarea
                    id="description"
                    v-model="form.description"
                    name="description"
                    rows="4"
                    class="report-textarea transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:scale-[1.01]"
                    :maxlength="REPORT_YEAR_FIELD_LIMITS.description"
                    :disabled="isReadOnly"
                />
                <p class="text-xs text-black">{{ descriptionLength }} / {{ REPORT_YEAR_FIELD_LIMITS.description }}</p>
                <InputError :message="form.errors.description" />
            </div>

            <InputError :message="patchError" />

            <div class="flex flex-wrap items-center gap-4 border-t border-zinc-200/80 pt-2">
                <Button
                    type="submit"
                    :disabled="saving || isReadOnly"
                    class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                >
                    <Loader2 v-if="saving" class="size-4 animate-spin" aria-hidden="true" />
                    <Save v-else class="size-4" :stroke-width="2.5" aria-hidden="true" />
                    Save metadata
                </Button>
                <p v-show="form.recentlySuccessful" class="report-save-hint">
                    <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
                    Saved
                </p>
            </div>
        </form>
    </section>
</template>
