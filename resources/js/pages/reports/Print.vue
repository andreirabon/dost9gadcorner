<script setup lang="ts">
import { Head, useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '@/layouts/AppLayout.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Printer, FileText } from '@lucide/vue';
import { ref } from 'vue';

interface ReportYear {
    id: number;
    year: string;
    title: string;
}

const page = usePage<{ years: ReportYear[] }>();

const form = useForm({
    report_year_id: '',
    with_charts: true,
});

const breadcrumbs = [
    {
        title: 'Print Report',
        href: '/print-report',
    },
];

const isGenerating = ref(false);

const submit = () => {
    isGenerating.value = true;
    
    // Simulate slight delay for UX polish before submitting
    setTimeout(() => {
        // Use a simple GET navigation to avoid CSRF issues for downloads
        const url = route('print-report.generate', {
            report_year_id: form.report_year_id,
            with_charts: form.with_charts ? 1 : 0
        });
        
        window.location.href = url;
        
        // Reset state after triggering download
        setTimeout(() => {
            isGenerating.value = false;
        }, 1000);
    }, 150);
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Print Report" />
        <div class="flex h-full flex-1 flex-col items-center p-4 pt-12 sm:pt-24">
            <div class="w-full max-w-md rounded-2xl bg-white p-8 sm:p-10 shadow-lg border border-slate-200">
                <div class="mb-8 flex flex-col items-center text-center">
                    <div class="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                        <Printer class="h-7 w-7 transition-transform duration-500 ease-out" :class="{ 'scale-110': isGenerating }" />
                    </div>
                    <h2 class="text-2xl font-semibold tracking-tight text-slate-900">Generate Report</h2>
                    <p class="mt-2 text-sm leading-relaxed text-slate-500">Configure your print settings and download the sex-disaggregated data report as a high-quality PDF.</p>
                </div>

                <form @submit.prevent="submit" class="space-y-7">
                    <div class="space-y-3">
                        <Label for="report_year_id" class="text-xs font-medium uppercase tracking-wider text-slate-500">Target Year</Label>
                        <div class="relative group">
                            <select
                                id="report_year_id"
                                v-model="form.report_year_id"
                                class="flex h-12 w-full appearance-none items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled class="text-slate-500">Select a reporting year</option>
                                <option v-for="year in page.props.years" :key="year.id" :value="year.id">
                                    {{ year.year }} &mdash; {{ year.title }}
                                </option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 transition-transform group-hover:translate-y-[1px]">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-slate-100/50">
                        <div class="flex items-start space-x-3">
                            <Checkbox id="with_charts" :checked="form.with_charts" @update:checked="(v) => form.with_charts = !!v" class="mt-0.5 border-slate-300" />
                            <div class="grid gap-1.5">
                                <Label for="with_charts" class="cursor-pointer font-medium leading-none text-slate-900">Include Visual Charts</Label>
                                <p class="text-xs text-slate-500">Embed ApexCharts visualizations directly into the generated PDF.</p>
                            </div>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        class="w-full h-12 rounded-xl font-medium transition-all duration-300 ease-out hover:scale-[1.01] active:scale-[0.98] active:duration-150" 
                        :disabled="!form.report_year_id || isGenerating"
                    >
                        <span v-if="!isGenerating" class="flex items-center justify-center gap-2">
                            <FileText class="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-[1px] group-active:translate-y-[1px]" />
                            Download PDF
                        </span>
                        
                        <span v-else class="flex items-center justify-center gap-2">
                            <svg class="h-5 w-5 animate-spin text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Compiling...
                        </span>
                    </Button>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
