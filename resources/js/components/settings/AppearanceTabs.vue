<script setup lang="ts">
import { useAppearance } from '@/composables/useAppearance';
import { Moon, Sun } from 'lucide-vue-next';

const { appearance, updateAppearance } = useAppearance();

interface Props {
    /** Narrow icon-led control for sidebar / dropdown */
    compact?: boolean;
}

withDefaults(defineProps<Props>(), {
    compact: false,
});

const tabs = [
    { value: 'light' as const, Icon: Sun, label: 'Light' },
    { value: 'dark' as const, Icon: Moon, label: 'Dark' },
];

function isSelected(value: 'light' | 'dark'): boolean {
    if (appearance.value === 'light' || appearance.value === 'dark') {
        return appearance.value === value;
    }

    if (appearance.value === 'system' && typeof document !== 'undefined') {
        const dark = document.documentElement.classList.contains('dark');
        return (value === 'dark') === dark;
    }

    return false;
}
</script>

<template>
    <div
        :class="
            compact
                ? 'flex w-full gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800'
                : 'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800'
        "
    >
        <button
            v-for="{ value, Icon, label } in tabs"
            :key="value"
            type="button"
            :aria-label="label"
            :aria-pressed="isSelected(value)"
            @click="updateAppearance(value)"
            :class="[
                'flex items-center justify-center rounded-md transition-colors',
                compact ? 'min-h-9 flex-1 px-2 py-1.5' : 'px-3.5 py-1.5',
                isSelected(value)
                    ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                    : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
            ]"
        >
            <component :is="Icon" class="h-4 w-4 shrink-0" :class="compact ? '' : '-ml-1'" />
            <span v-if="!compact" class="ml-1.5 text-sm">{{ label }}</span>
        </button>
    </div>
</template>
