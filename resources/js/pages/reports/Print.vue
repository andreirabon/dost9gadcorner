<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { Head } from '@inertiajs/vue3';

const breadcrumbs = [
    {
        title: 'Print Report',
        href: '/print-report',
    },
];
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <Head title="Print Report" />
        <div class="flex h-full flex-1 flex-col rounded-xl bg-white p-4 dark:bg-sidebar">
            <div class="flex h-full flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-sidebar-border bg-white p-8 text-center dark:bg-sidebar">
                <p class="text-sm text-sidebar-foreground/50">Print layout view will be implemented here.</p>
            </div>
        </div>
    </AppLayout>
</template>
