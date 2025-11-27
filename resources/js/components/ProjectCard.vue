<script setup lang="ts">
import { computed } from 'vue';
import type { ProjectItem } from '../types';

const props = defineProps<{
    project: ProjectItem;
}>();

defineEmits<{
    click: [project: ProjectItem];
}>();

const colors = computed(() => {
    const colorMap = {
        emerald: {
            border: 'border-emerald-400/60',
            bg: 'bg-emerald-500/80',
            hover: 'from-emerald-400/40 to-emerald-600/30',
            text: 'text-white',
            focus: 'focus-visible:ring-emerald-400',
        },
        blue: {
            border: 'border-blue-400/60',
            bg: 'bg-blue-500/80',
            hover: 'from-blue-400/40 to-blue-600/30',
            text: 'text-white',
            focus: 'focus-visible:ring-blue-400',
        },
        orange: {
            border: 'border-orange-400/60',
            bg: 'bg-orange-400/80',
            hover: 'from-orange-400/40 to-orange-500/30',
            text: 'text-white',
            focus: 'focus-visible:ring-orange-400',
        },
        rose: {
            border: 'border-rose-400/60',
            bg: 'bg-rose-400/80',
            hover: 'from-rose-400/40 to-rose-500/30',
            text: 'text-white',
            focus: 'focus-visible:ring-rose-400',
        },
        teal: {
            border: 'border-teal-400/60',
            bg: 'bg-teal-500/80',
            hover: 'from-teal-400/40 to-teal-600/30',
            text: 'text-white',
            focus: 'focus-visible:ring-teal-400',
        },
        purple: {
            border: 'border-purple-400/60',
            bg: 'bg-purple-500/80',
            hover: 'from-purple-400/40 to-purple-600/30',
            text: 'text-white',
            focus: 'focus-visible:ring-purple-400',
        },
    };

    const theme = props.project.colorTheme || 'purple';
    // Fallback to purple if theme is not in map (e.g. cyan/amber)
    return colorMap[theme as keyof typeof colorMap] || colorMap.purple;
});
</script>

<template>
    <button
        type="button"
        @click="$emit('click', project)"
        :class="[
            'project-card group touch-target tap-highlight-none relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-xl p-3 text-center shadow-lg backdrop-blur transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            colors.border,
            colors.bg,
            colors.focus,
        ]"
    >
        <!-- Background Image (visible on hover) -->
        <div
            v-if="project.backgroundImage"
            class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-300 group-hover:opacity-20"
            :style="{ backgroundImage: `url(${project.backgroundImage})` }"
            aria-hidden="true"
        ></div>

        <!-- Default View (visible when not hovering) -->
        <div class="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
            <!-- Project Title -->
            <h3 :class="['mb-2 text-sm leading-tight font-semibold select-none', colors.text]">
                {{ project.name }}
            </h3>
        </div>

        <!-- Hover View (visible on hover) -->
        <div class="absolute inset-0 z-10 flex flex-col justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <!-- Semi-transparent overlay for better text readability -->
            <div class="absolute inset-0 rounded-xl bg-black/40"></div>

            <div class="relative z-10 text-center">
                <!-- Project Title on hover -->
                <h3 class="mb-3 text-sm leading-tight font-semibold text-white">
                    {{ project.name }}
                </h3>

                <!-- Project Description -->
                <p v-if="project.description" class="line-clamp-4 text-xs leading-relaxed text-white/90">
                    {{ project.description }}
                </p>
            </div>
        </div>

        <!-- Hover Effect Background -->
        <span class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true">
            <span :class="['absolute inset-0 bg-gradient-to-br', colors.hover]" />
        </span>
    </button>
</template>
