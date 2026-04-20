<script setup lang="ts">
import { useAppearance } from '@/composables/useAppearance';
import { Moon, Sun } from 'lucide-vue-next';

const { appearance, updateAppearance } = useAppearance();

interface Props {
    /** Narrow icon-led control for sidebar / dropdown */
    compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
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

function buttonClass(selected: boolean): string {
    const base =
        'flex cursor-pointer items-center justify-center rounded-md transition-colors duration-200';
    const size = props.compact ? 'min-h-9 flex-1 px-2 py-1.5' : 'px-3.5 py-1.5';

    if (!selected) {
        return [base, size, 'text-[#4a5a7a] hover:bg-white/50 hover:text-[#2a3550]'].join(' ');
    }

    return [base, size, 'bg-white text-[#2f3a5c] shadow-sm'].join(' ');
}

function iconClass(value: 'light' | 'dark', selected: boolean): string {
    if (!selected) {
        return 'h-4 w-4 shrink-0 text-current';
    }
    if (value === 'light') {
        return 'h-4 w-4 shrink-0 text-black';
    }
    return 'h-4 w-4 shrink-0 text-zinc-600';
}
</script>

<template>
    <div
        :class="
            compact
                ? 'scheme-light flex w-full gap-1 rounded-lg bg-[#8a99c0]/40 p-1'
                : 'scheme-light inline-flex gap-1 rounded-lg bg-[#8a99c0]/40 p-1'
        "
    >
        <button
            v-for="{ value, Icon, label } in tabs"
            :key="value"
            type="button"
            :aria-label="label"
            :aria-pressed="isSelected(value)"
            :class="buttonClass(isSelected(value))"
            @click="updateAppearance(value)"
        >
            <component
                :is="Icon"
                :class="[iconClass(value, isSelected(value)), compact ? '' : '-ml-1']"
                :stroke-width="isSelected(value) ? 2.25 : 2"
            />
            <span v-if="!compact" class="ml-1.5 text-sm">{{ label }}</span>
        </button>
    </div>
</template>
