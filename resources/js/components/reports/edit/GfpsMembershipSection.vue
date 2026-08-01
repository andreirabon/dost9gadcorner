<script setup lang="ts">
import HeadingSmall from '@/components/shared/HeadingSmall.vue';
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useReportSectionSave } from '@/composables/useReportSectionSave';
import { REPORT_INPUT_CLASS } from '@/constants/reportFormClasses';
import { cloneSnapshot, diffObjectPatch, hasPatch } from '@/helpers/reportPatch';
import { toNumber } from '@/helpers/reportTotals';
import type { GfpsMembershipData } from '@/types/reports';
import { useForm } from '@inertiajs/vue3';
import { CheckCircle2, Loader2, Save } from '@lucide/vue';
import { computed, ref } from 'vue';

interface Props {
    reportYearId: number;
    membership: GfpsMembershipData;
    expectedUpdatedAt: string | null;
    isReadOnly: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ notice: [message: string] }>();

const inputClass = REPORT_INPUT_CLASS;

const form = useForm({
    female_count: props.membership.femaleCount,
    male_count: props.membership.maleCount,
});

const { patchOptions, handleConflictError, firstErrorMessage } = useReportSectionSave();

const snapshot = () => cloneSnapshot({ female_count: form.female_count, male_count: form.male_count });

// Baseline for the next diff, advanced only on a successful save.
const baseline = ref(snapshot());

function save(): void {
    const patch = diffObjectPatch(baseline.value, snapshot(), ['female_count', 'male_count'], {
        numeric: ['female_count', 'male_count'],
    });

    if (!hasPatch(patch)) {
        emit('notice', 'No changes to save.');
        return;
    }

    form.transform(() => ({ ...patch, expected_updated_at: props.expectedUpdatedAt })).patch(
        route('report-years.gfps-membership.update', props.reportYearId),
        {
            ...patchOptions,
            onSuccess: () => {
                baseline.value = snapshot();
            },
            onError: (errors) => {
                if (handleConflictError(errors)) {
                    return;
                }

                emit('notice', firstErrorMessage(errors) ?? 'Could not save GFPS membership.');
            },
        },
    );
}

const total = computed(() => toNumber(form.female_count) + toNumber(form.male_count));
</script>

<template>
    <section id="panel-gfps_membership" class="report-panel" role="tabpanel" aria-labelledby="tab-gfps_membership">
        <HeadingSmall variant="report" title="GFPS membership" />

        <form class="report-form report-form--edit w-full" @submit.prevent="save">
            <div class="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 shadow-sm">
                <div class="grid gap-4 sm:grid-cols-3">
                    <div class="grid gap-2">
                        <Label for="gfps_female_count">Female</Label>
                        <Input
                            id="gfps_female_count"
                            v-model="form.female_count"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="inputClass"
                        />
                        <InputError :message="form.errors.female_count" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="gfps_male_count">Male</Label>
                        <Input
                            id="gfps_male_count"
                            v-model="form.male_count"
                            type="number"
                            min="0"
                            inputmode="numeric"
                            :disabled="isReadOnly"
                            :class="inputClass"
                        />
                        <InputError :message="form.errors.male_count" />
                    </div>

                    <div class="report-derived-group grid gap-2">
                        <Label for="gfps_total_count">Total members</Label>
                        <Input
                            id="gfps_total_count"
                            :model-value="total"
                            type="text"
                            readonly
                            tabindex="-1"
                            aria-live="polite"
                            :class="[inputClass, 'report-derived-field']"
                        />
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-4 border-t border-zinc-200/80 pt-2">
                <Button
                    type="submit"
                    class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                    :disabled="form.processing || isReadOnly"
                >
                    <Loader2 v-if="form.processing" class="size-4 animate-spin" aria-hidden="true" />
                    <Save v-else class="size-4" :stroke-width="2.5" aria-hidden="true" />
                    Save GFPS membership
                </Button>
                <p v-show="form.recentlySuccessful" class="report-save-hint">
                    <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
                    Saved
                </p>
            </div>
        </form>
    </section>
</template>
