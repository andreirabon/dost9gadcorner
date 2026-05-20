<script setup lang="ts">
import ReportBackNavLink from '@/components/reports/ReportBackNavLink.vue';
import InputError from '@/components/shared/InputError.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { REPORT_YEAR_FIELD_LIMITS } from '@/constants/reportYearFields';
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { Loader2 } from '@lucide/vue';

const currentYear = new Date().getFullYear();

const form = useForm({
    year: currentYear,
    title: '',
    description: '',
    status: 'pending',
});

const submit = () => {
    form.post(route('report-years.store'));
};
</script>

<template>
    <AppLayout :show-footer="false" content-class="report-years-page">
        <Head title="New Report Year" />

        <div class="report-years-inner report-years-inner--create">
            <header class="report-years-create-header">
                <div class="report-years-create-hero">
                    <div class="report-years-create-hero-top">
                        <div>
                            <p class="report-years-kicker">New record</p>
                            <h1 class="report-years-title">Create report year</h1>
                        </div>
                        <ReportBackNavLink :href="route('report-years.index')" inline>
                            Back to all years
                        </ReportBackNavLink>
                    </div>
                    <p class="report-years-lede text-xs">
                        Set the reporting year, an optional custom title, and the initial status.
                    </p>
                </div>
            </header>

            <div class="report-years-form-card w-full min-w-0">
                <form autocomplete="off" class="report-years-create-form" @submit.prevent="submit">
                    <div class="report-years-create-form-grid">
                        <div class="space-y-2">
                            <Label for="year" class="text-[13px] font-medium text-black">Reporting year</Label>
                            <Input
                                id="year"
                                v-model="form.year"
                                name="year"
                                type="number"
                                :min="REPORT_YEAR_FIELD_LIMITS.yearMin"
                                :max="REPORT_YEAR_FIELD_LIMITS.yearMax"
                                inputmode="numeric"
                                class="report-field h-11 w-full"
                            />
                            <InputError :message="form.errors.year" />
                        </div>

                        <div class="space-y-2">
                            <Label for="status" class="text-[13px] font-medium text-black">Initial status</Label>
                            <div class="relative">
                                <select
                                    id="status"
                                    v-model="form.status"
                                    name="status"
                                    class="report-select h-11 w-full appearance-none pr-10"
                                >
                                    <option value="pending">Pending (draft)</option>
                                    <option value="published">Published (public)</option>
                                </select>
                                <div
                                    class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                                    aria-hidden="true"
                                >
                                    <svg class="size-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <InputError :message="form.errors.status" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="title" class="text-[13px] font-medium text-black">
                            Custom title
                            <span class="font-normal text-black">(optional)</span>
                        </Label>
                        <Input
                            id="title"
                            v-model="form.title"
                            name="title"
                            type="text"
                            placeholder="e.g., Annual regional review"
                            :maxlength="REPORT_YEAR_FIELD_LIMITS.title"
                            class="report-field h-11 w-full"
                        />
                        <div class="flex justify-between gap-2">
                            <InputError :message="form.errors.title" />
                            <span class="ml-auto text-xs text-black tabular-nums">
                                {{ form.title?.length || 0 }} / {{ REPORT_YEAR_FIELD_LIMITS.title }}
                            </span>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <Label for="description" class="text-[13px] font-medium text-black">
                            Description
                            <span class="font-normal text-black">(optional)</span>
                        </Label>
                        <textarea
                            id="description"
                            v-model="form.description"
                            name="description"
                            rows="3"
                            placeholder="Brief summary of this reporting period..."
                            :maxlength="REPORT_YEAR_FIELD_LIMITS.description"
                            class="report-textarea w-full resize-y"
                        />
                        <div class="flex justify-between gap-2">
                            <InputError :message="form.errors.description" />
                            <span class="ml-auto text-xs text-black tabular-nums">
                                {{ form.description?.length || 0 }} / {{ REPORT_YEAR_FIELD_LIMITS.description }}
                            </span>
                        </div>
                    </div>

                    <div class="report-years-create-actions">
                        <p v-show="form.recentlySuccessful" class="mr-auto text-sm font-medium text-emerald-700">
                            Saved successfully.
                        </p>
                        <button
                            type="button"
                            class="report-years-btn-secondary"
                            @click="() => form.reset()"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            class="report-years-btn-primary disabled:opacity-50"
                            :disabled="form.processing"
                        >
                            <Loader2 v-if="form.processing" class="mr-2 size-4 animate-spin" />
                            Create year
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
