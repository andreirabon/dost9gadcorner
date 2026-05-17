<script setup lang="ts">
import InputError from '@/components/shared/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { REPORT_YEAR_FIELD_LIMITS } from '@/constants/reportYearFields';
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';

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
 content-class="flex w-full flex-col bg-white text-slate-900"
 >
 <Head title="New Report Year" />

 <!-- Background glows -->
 

 <div class="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 relative z-10">
 <!-- Header -->
 <div class="mb-8 flex items-center justify-between">
 <div class="flex items-center gap-4">
 <Button
 as-child
 variant="ghost"
 size="icon"
 class="size-10 rounded-full border border-slate-200 bg-white transition-all duration-300 hover:bg-slate-100 active:scale-[0.97]"
 >
 <Link :href="route('report-years.index')" aria-label="Back to all years" prefetch>
 <ArrowLeft class="size-4 text-slate-500" />
 </Link>
 </Button>
 <div>
 <h1 class="text-2xl font-semibold tracking-tighter text-slate-900">
 Create Report Year
 </h1>
 </div>
 </div>
 </div>

 <!-- Form Container -->
 <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
 <div class="mb-6">
 <h2 class="text-lg font-medium tracking-tight text-slate-900">Details</h2>
 <p class="mt-1 text-sm font-light text-slate-500">
 Set the reporting year, an optional custom title, and the initial status.
 </p>
 </div>

 <form autocomplete="off" @submit.prevent="submit" class="space-y-6">
 <!-- Grid Layout for Inputs -->
 <div class="grid gap-6 sm:grid-cols-2">
 <div class="space-y-2">
 <Label for="year" class="text-[13px] font-medium text-slate-800">Reporting Year</Label>
 <Input
 id="year"
 v-model="form.year"
 name="year"
 type="number"
 :min="REPORT_YEAR_FIELD_LIMITS.yearMin"
 :max="REPORT_YEAR_FIELD_LIMITS.yearMax"
 inputmode="numeric"
 class="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 transition-colors focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/20"
 />
 <InputError :message="form.errors.year" />
 </div>

 <div class="space-y-2">
 <Label for="status" class="text-[13px] font-medium text-slate-800">Initial Status</Label>
 <div class="relative">
 <select
 id="status"
 v-model="form.status"
 name="status"
 class="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 transition-colors focus-visible:border-blue-500 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
 >
 <option value="pending" class="bg-white text-slate-900">Pending (Draft)</option>
 <option value="published" class="bg-white text-slate-900">Published (Public)</option>
 </select>
 <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
 <svg class="size-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
 </div>
 </div>
 <InputError :message="form.errors.status" />
 </div>
 </div>

 <div class="space-y-2">
 <Label for="title" class="text-[13px] font-medium text-slate-800">Custom Title <span class="text-slate-400 font-normal">(Optional)</span></Label>
 <Input
 id="title"
 v-model="form.title"
 name="title"
 type="text"
 placeholder="e.g., Annual Regional Review"
 :maxlength="REPORT_YEAR_FIELD_LIMITS.title"
 class="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-500/20"
 />
 <div class="flex justify-between">
 <InputError :message="form.errors.title" />
 <span class="text-xs text-slate-400 ml-auto">
 {{ form.title?.length || 0 }} / {{ REPORT_YEAR_FIELD_LIMITS.title }}
 </span>
 </div>
 </div>

 <div class="space-y-2">
 <Label for="description" class="text-[13px] font-medium text-slate-800">Description <span class="text-slate-400 font-normal">(Optional)</span></Label>
 <textarea
 id="description"
 v-model="form.description"
 name="description"
 rows="3"
 placeholder="Brief summary of this reporting period..."
 :maxlength="REPORT_YEAR_FIELD_LIMITS.description"
 class="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
 />
 <div class="flex justify-between">
 <InputError :message="form.errors.description" />
 <span class="text-xs text-slate-400 ml-auto">
 {{ form.description?.length || 0 }} / {{ REPORT_YEAR_FIELD_LIMITS.description }}
 </span>
 </div>
 </div>

 <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
 <p v-show="form.recentlySuccessful" class="text-sm font-medium text-emerald-400">Saved successfully.</p>
 <Button
 type="button"
 variant="ghost"
 class="h-11 rounded-xl px-4 text-sm font-medium text-slate-500 hover:bg-white hover:text-slate-900 transition-all duration-300 active:scale-[0.97]"
 @click="() => form.reset()"
 >
 Reset
 </Button>
 <Button
 type="submit"
 class="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-[0.97] disabled:opacity-50"
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
