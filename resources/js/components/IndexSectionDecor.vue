<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
    name: 'IndexSectionDecor',
});

const props = defineProps<{
    variant: 'framework' | 'org' | 'yearly';
}>();

/** SVG fractal noise tile — single small layer, very low opacity in template. */
const noiseStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='128' height='128' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
} as const;

const blobTopClass = computed((): string => {
    if (props.variant === 'org') {
        return 'absolute -top-28 right-[-18%] h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/18 blur-3xl sm:right-[-10%]';
    }
    if (props.variant === 'yearly') {
        return 'absolute -top-24 left-[-12%] h-[20rem] w-[20rem] rounded-full bg-cyan-400/14 blur-3xl sm:left-[-6%]';
    }
    return 'absolute -top-32 right-[-15%] h-[24rem] w-[24rem] rounded-full bg-violet-400/16 blur-3xl sm:right-[-8%]';
});

const blobBottomClass = computed((): string => {
    if (props.variant === 'org') {
        return 'absolute bottom-[-18%] left-[-14%] h-[19rem] w-[19rem] rounded-full bg-indigo-500/14 blur-3xl sm:left-[-8%]';
    }
    if (props.variant === 'yearly') {
        return 'absolute bottom-[-16%] right-[-12%] h-[21rem] w-[21rem] rounded-full bg-fuchsia-500/15 blur-3xl sm:right-[-6%]';
    }
    return 'absolute bottom-[-20%] left-[-12%] h-[22rem] w-[22rem] rounded-full bg-fuchsia-500/12 blur-3xl sm:left-[-6%]';
});
</script>

<template>
    <div class="pointer-events-none absolute inset-0 isolate overflow-hidden" aria-hidden="true">
        <div
            class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-size-[44px_44px] opacity-90"
        />
        <div
            class="absolute inset-0 mix-blend-soft-light opacity-[0.05] sm:opacity-[0.055]"
            :style="noiseStyle"
        />
        <div :class="blobTopClass" />
        <div :class="blobBottomClass" />
    </div>
</template>
