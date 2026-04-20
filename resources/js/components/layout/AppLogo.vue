<script setup lang="ts">
defineOptions({
    name: 'AppLogo',
});
</script>

<template>
    <div class="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
        <div class="relative flex size-10 shrink-0 items-center justify-center" aria-hidden="true">
            <img
                src="/svg/dost.svg"
                alt=""
                class="h-10 w-auto max-w-11 object-contain object-left group-data-[collapsible=icon]:object-center"
                loading="eager"
                decoding="async"
                width="44"
                height="40"
            />
        </div>
        <div class="group-data-[collapsible=icon]:hidden min-w-0 flex-1 text-left leading-tight">
            <span class="block text-base font-bold tracking-wide text-white uppercase">Admin Panel</span>
        </div>
    </div>
</template>
