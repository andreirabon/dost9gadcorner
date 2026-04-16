<script setup lang="ts">
import type { AppPageProps } from '@/types';
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const page = usePage<AppPageProps>();

const appName = computed(() => {
    const raw = page.props.name?.trim();
    return raw || 'GAD Corner';
});

const monogram = computed(() => appName.value.charAt(0).toUpperCase());
</script>

<template>
    <div class="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
        <div
            class="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-700 text-sm font-bold text-white shadow-sm"
            aria-hidden="true"
        >
            {{ monogram }}
        </div>
        <div class="group-data-[collapsible=icon]:hidden grid min-w-0 flex-1 text-left leading-tight">
            <span class="truncate font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{{ appName }}</span>
            <span class="truncate text-[11px] text-zinc-500 dark:text-zinc-400">Admin</span>
        </div>
    </div>
</template>
