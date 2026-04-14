<script setup lang="ts">
interface Props {
    title: string;
    description?: string;
    /** Tighter editorial style for report admin (zinc + uppercase label) */
    variant?: 'default' | 'report';
}

withDefaults(defineProps<Props>(), {
    variant: 'default',
});
</script>

<template>
    <header>
        <h3
            :class="
                variant === 'report'
                    ? 'mb-1 text-[13px] font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400'
                    : 'mb-0.5 text-base font-medium'
            "
        >
            {{ title }}
        </h3>
        <p
            v-if="description"
            :class="
                variant === 'report' ? 'mt-0.5 text-sm leading-snug text-zinc-600 dark:text-zinc-400' : 'text-sm text-muted-foreground'
            "
        >
            {{ description }}
        </p>
    </header>
</template>
