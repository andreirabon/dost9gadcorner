<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
    name: 'IndexSectionDecor',
});

const props = defineProps<{
    variant: 'framework' | 'org' | 'yearly';
}>();

const blobTopClass = computed((): string => {
    if (props.variant === 'org') {
        return 'absolute -top-28 right-[-18%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.14)_0%,transparent_68%)] sm:right-[-10%]';
    }
    if (props.variant === 'yearly') {
        return 'absolute -top-24 left-[-12%] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.12)_0%,transparent_68%)] sm:left-[-6%]';
    }
    return 'absolute -top-32 right-[-15%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.12)_0%,transparent_68%)] sm:right-[-8%]';
});

const blobBottomClass = computed((): string => {
    if (props.variant === 'org') {
        return 'absolute bottom-[-18%] left-[-14%] h-[19rem] w-[19rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_68%)] sm:left-[-8%]';
    }
    if (props.variant === 'yearly') {
        return 'absolute bottom-[-16%] right-[-12%] h-[21rem] w-[21rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.1)_0%,transparent_68%)] sm:right-[-6%]';
    }
    return 'absolute bottom-[-20%] left-[-12%] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.09)_0%,transparent_68%)] sm:left-[-6%]';
});
</script>

<template>
    <div
        class="pointer-events-none absolute inset-0 isolate overflow-hidden contain-[paint]"
        aria-hidden="true"
    >
        <div
            class="absolute inset-0 bg-[linear-gradient(to_right,rgba(250,250,250,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,250,250,0.04)_1px,transparent_1px)] bg-size-[44px_44px] opacity-80"
        />
        <div :class="blobTopClass" />
        <div :class="blobBottomClass" />
    </div>
</template>
