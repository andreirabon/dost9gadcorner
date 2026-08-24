<script setup lang="ts">
defineOptions({
    name: 'AppLogo',
});
</script>

<template>
    <div class="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
        <div class="relative flex size-10 shrink-0 items-center justify-center" aria-hidden="true">
            <img
                src="/dostlogo.png"
                alt="DOST"
                class="h-10 w-auto max-w-11 object-contain object-left drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] group-data-[collapsible=icon]:object-center"
                loading="eager"
                decoding="async"
            />
        </div>
        <div class="min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span class="block text-sm font-semibold tracking-[-0.02em] text-brand-50">GAD Database</span>
            <span class="block text-[0.65rem] font-medium tracking-[0.04em] text-brand-200/70 uppercase">DOST Region IX</span>
        </div>
    </div>
</template>
