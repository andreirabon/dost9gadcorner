<script setup lang="ts">
import type { YearItem } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
    year: YearItem;
}>();

defineEmits<{
    click: [year: YearItem];
}>();

const yearTheme = computed(() => {
    // Theme based on year - 2025 gets a special purple/violet theme
    const themes: Record<string, { border: string; bg: string; text: string; focus: string; hover: string }> = {
        '2025': {
            border: 'border-violet-400/40',
            bg: 'bg-gradient-to-br from-violet-600/30 to-purple-700/30',
            text: 'text-violet-100',
            focus: 'focus-visible:ring-violet-400',
            hover: 'from-violet-500/40 to-purple-600/40',
        },
        '2026': {
            border: 'border-indigo-400/40',
            bg: 'bg-gradient-to-br from-indigo-600/30 to-blue-800/30',
            text: 'text-indigo-100',
            focus: 'focus-visible:ring-indigo-400',
            hover: 'from-indigo-500/40 to-blue-700/40',
        },
        default: {
            border: 'border-purple-400/40',
            bg: 'bg-gradient-to-br from-purple-600/30 to-indigo-700/30',
            text: 'text-purple-100',
            focus: 'focus-visible:ring-purple-400',
            hover: 'from-purple-500/40 to-indigo-600/40',
        },
    };
    return themes[props.year.year] ?? themes.default;
});
</script>

<template>
    <button
        type="button"
        @click="$emit('click', year)"
        :class="[
            'year-card group touch-target tap-highlight-none relative flex h-28 flex-col items-center justify-center overflow-hidden rounded-lg p-3 text-center shadow-md contain-[paint] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:h-32 sm:rounded-xl sm:p-4',
            yearTheme.border,
            yearTheme.bg,
            yearTheme.focus,
        ]"
        :aria-label="`View ${year.year} yearly report details`"
    >
        <!-- Background Image (visible on hover) -->
        <div
            v-if="year.backgroundImage"
            class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-300 group-hover:opacity-20"
            :style="{ backgroundImage: `url(${year.backgroundImage})` }"
            aria-hidden="true"
        />

        <!-- Default View (visible when not hovering) -->
        <div class="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
            <!-- Year Title -->
            <h3 :class="['mb-1 text-2xl leading-snug font-bold select-none sm:mb-2 sm:text-3xl', yearTheme.text]">
                {{ year.year }}
            </h3>
        </div>

        <!-- Hover View (visible on hover) -->
        <div class="absolute inset-0 z-10 flex flex-col justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <!-- Semi-transparent overlay for better text readability -->
            <div class="absolute inset-0 rounded-xl bg-black/40"></div>

            <div class="relative z-10 text-center">
                <!-- Year Title on hover -->
                <h3 class="mb-3 text-2xl leading-tight font-bold text-white">
                    {{ year.year }}
                </h3>

                <!-- Year Description -->
                <p v-if="year.description" class="line-clamp-4 text-xs leading-relaxed text-white/90">
                    {{ year.description }}
                </p>
            </div>
        </div>

        <!-- Hover Effect Background -->
        <span class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true">
            <span :class="['absolute inset-0 bg-linear-to-br', yearTheme.hover]" />
        </span>
    </button>
</template>
