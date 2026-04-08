<script setup lang="ts">
import { useElementBounding, usePreferredReducedMotion } from '@vueuse/core';
import { computed, ref } from 'vue';

defineOptions({
    name: 'ScrollParallax',
});

const props = withDefaults(
    defineProps<{
        /** Y translation per pixel of offset from viewport center (try 0.06–0.16). */
        speed?: number;
    }>(),
    { speed: 0.12 },
);

const root = ref<HTMLElement | null>(null);
const reduceMotion = usePreferredReducedMotion();
const { top, height } = useElementBounding(root, { windowScroll: true, windowResize: true });

const translateY = computed(() => {
    if (reduceMotion.value) {
        return 0;
    }
    if (typeof window === 'undefined') {
        return 0;
    }
    // `top` / `height` come from getBoundingClientRect (viewport coordinates).
    const vh = window.innerHeight;
    const elMidViewport = top.value + height.value / 2;
    const viewMid = vh / 2;
    return (elMidViewport - viewMid) * props.speed;
});

const style = computed(() => ({
    transform: `translate3d(0, ${translateY.value.toFixed(2)}px, 0)`,
    willChange: reduceMotion.value ? 'auto' : ('transform' as const),
}));
</script>

<template>
    <div ref="root" class="min-w-0" :style="style">
        <slot />
    </div>
</template>
