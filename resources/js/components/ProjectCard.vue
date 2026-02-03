<script setup lang="ts">
import { getProjectThemeClasses } from '@/lib/projectThemes';
import type { ProjectItem } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
    project: ProjectItem;
}>();

defineEmits<{
    click: [project: ProjectItem];
}>();

const colors = computed(() => getProjectThemeClasses(props.project));
</script>

<template>
    <button
        type="button"
        @click="$emit('click', project)"
        :class="[
            'project-card group touch-target tap-highlight-none relative flex h-28 flex-col items-center justify-center overflow-hidden rounded-lg p-3 text-center shadow-md [contain:paint] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:h-32 sm:rounded-xl sm:p-4',
            colors.border,
            colors.bg,
            colors.focus,
        ]"
        :aria-label="`View ${project.name} project details`"
    >
        <!-- Background Image (visible on hover) -->
        <div
            v-if="project.backgroundImage"
            class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 transition-opacity duration-300 group-hover:opacity-20"
            :style="{ backgroundImage: `url(${project.backgroundImage})` }"
            aria-hidden="true"
        />

        <!-- Default View (visible when not hovering) -->
        <div class="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
            <!-- Project Title -->
            <h3 :class="['mb-1 text-xs leading-snug font-semibold select-none sm:mb-2 sm:text-sm sm:leading-tight', colors.text]">
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
