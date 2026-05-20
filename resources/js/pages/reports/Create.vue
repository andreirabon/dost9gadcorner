<script setup lang="ts">
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { REPORT_YEAR_FIELD_LIMITS } from '@/constants/reportYearFields';
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Loader2 } from '@lucide/vue';

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
 <AppLayout
 :show-footer="false"
 compact-main-column
 content-class="flex min-h-0 flex-1 flex-col bg-linear-to-b from-purple-950 via-fuchsia-950/28 to-purple-950 text-purple-50 selection:bg-purple-500/30"
 >
 <Head title="New Report Year" />

 <!-- Background glows -->
 <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
 <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(192,38,211,0.12),transparent_55%)]" />
 <div
 class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] opacity-50"
 />
 </div>

 <div class="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 relative z-10">
 <!-- Header -->
 <div class="mb-8 flex items-center justify-between">
 <div class="flex items-center gap-4">
 <Button
 as-child
 variant="ghost"
 size="icon"
 class="size-10 rounded-full border border-purple-400/35 bg-purple-900/55 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out hover:bg-purple-950/5 active:scale-[0.97]"
 >
 <Link :href="route('report-years.index')" aria-label="Back to all years" prefetch>
 <ArrowLeft class="size-4 text-purple-200/70" />
 </Link>
 </Button>
 <div>
 <h1 class="text-2xl font-semibold tracking-tight text-purple-100">
 Create Report Year
 </h1>
 </div>
 </div>
 </div>

 <!-- Form Container -->
 <div class="rounded-2xl border border-purple-400/35 bg-purple-900/55 p-6 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:p-8">
 <div class="mb-6">
 <h2 class="text-lg font-medium tracking-tight text-purple-100">Details</h2>
 <p class="mt-1 text-sm font-light text-purple-200/70">
 Set the reporting year, an optional custom title, and the initial status.
 </p>
 </div>

 <form autocomplete="off" @submit.prevent="submit" class="space-y-6">
 <!-- Grid Layout for Inputs -->
 <div class="grid gap-6 sm:grid-cols-2">
 <div class="space-y-2">
 <Label for="year" class="text-[13px] font-medium text-purple-100">Reporting Year</Label>
 <Input
 id="year"
 v-model="form.year"
 name="year"
 type="number"
 :min="REPORT_YEAR_FIELD_LIMITS.yearMin"
 :max="REPORT_YEAR_FIELD_LIMITS.yearMax"
 inputmode="numeric"
 class="h-11 rounded-xl border border-purple-400/35 bg-purple-950/60 px-3 text-sm text-purple-50 transition-colors focus-visible:border-purple-400 focus-visible:bg-purple-950 focus-visible:ring-4 focus-visible:ring-purple-500/20"
 />
 <InputError :message="form.errors.year" />
 </div>

 <div class="space-y-2">
 <Label for="status" class="text-[13px] font-medium text-purple-100">Initial Status</Label>
 <div class="relative">
 <select
 id="status"
 v-model="form.status"
 name="status"
 class="h-11 w-full appearance-none rounded-xl border border-purple-400/35 bg-purple-950/60 px-3 text-sm text-purple-50 transition-colors focus-visible:border-purple-400 focus-visible:bg-purple-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/20"
 >
 <option value="pending" class="bg-purple-950 text-purple-50">Pending (Draft)</option>
 <option value="published" class="bg-purple-950 text-purple-50">Published (Public)</option>
 </select>
 <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
 <svg class="size-4 text-purple-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
 </div>
 </div>
 <InputError :message="form.errors.status" />
 </div>
 </div>

 <div class="space-y-2">
 <Label for="title" class="text-[13px] font-medium text-purple-100">Custom Title <span class="text-purple-300/50 font-normal">(Optional)</span></Label>
 <Input
 id="title"
 v-model="form.title"
 name="title"
 type="text"
 placeholder="e.g., Annual Regional Review"
 :maxlength="REPORT_YEAR_FIELD_LIMITS.title"
 class="h-11 rounded-xl border border-purple-400/35 bg-purple-950/60 px-3 text-sm text-purple-50 transition-colors placeholder:text-purple-300/50 focus-visible:border-purple-400 focus-visible:bg-purple-950 focus-visible:ring-4 focus-visible:ring-purple-500/20"
 />
 <div class="flex justify-between">
 <InputError :message="form.errors.title" />
 <span class="text-xs text-purple-300/50 ml-auto">
 {{ form.title?.length || 0 }} / {{ REPORT_YEAR_FIELD_LIMITS.title }}
 </span>
 </div>
 </div>

 <div class="space-y-2">
 <Label for="description" class="text-[13px] font-medium text-purple-100">Description <span class="text-purple-300/50 font-normal">(Optional)</span></Label>
 <textarea
 id="description"
 v-model="form.description"
 name="description"
 rows="3"
 placeholder="Brief summary of this reporting period..."
 :maxlength="REPORT_YEAR_FIELD_LIMITS.description"
 class="w-full resize-y rounded-xl border border-purple-400/35 bg-purple-950/60 p-3 text-sm text-purple-50 transition-colors placeholder:text-purple-300/50 focus-visible:border-purple-400 focus-visible:bg-purple-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/20"
 />
 <div class="flex justify-between">
 <InputError :message="form.errors.description" />
 <span class="text-xs text-purple-300/50 ml-auto">
 {{ form.description?.length || 0 }} / {{ REPORT_YEAR_FIELD_LIMITS.description }}
 </span>
 </div>
 </div>

 <div class="flex items-center justify-end gap-3 pt-6 border-t border-purple-400/35 mt-6">
 <p v-show="form.recentlySuccessful" class="text-sm font-medium text-emerald-400">Saved successfully.</p>
 <Button
 type="button"
 variant="ghost"
 class="h-11 rounded-xl px-4 text-sm font-medium text-purple-200/70 hover:bg-purple-950 hover:text-purple-50 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out active:scale-[0.97]"
 @click="() => form.reset()"
 >
 Reset
 </Button>
 <Button
 type="submit"
 class="h-11 rounded-xl bg-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition-[transform,background-color,border-color,box-shadow,opacity,color] duration-200 ease-out hover:bg-purple-500 hover:shadow-purple-950/40 active:scale-[0.97] disabled:opacity-50"
 :disabled="form.processing"
 >
 <Loader2 v-if="form.processing" class="mr-2 size-4 animate-spin" />
 Create Year
 </Button>
 </div>
 </form>
 </div>
 </div>
 </AppLayout>
</template>
