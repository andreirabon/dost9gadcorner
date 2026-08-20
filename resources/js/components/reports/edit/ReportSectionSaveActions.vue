<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Save } from '@lucide/vue';

interface Props {
    processing: boolean;
    recentlySuccessful: boolean;
    isReadOnly: boolean;
}

defineProps<Props>();
</script>

<template>
    <div class="report-years-form-actions">
        <Button
            type="submit"
            class="report-save-btn transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
            :disabled="processing || isReadOnly"
        >
            <Loader2 v-if="processing" class="size-4 animate-spin" aria-hidden="true" />
            <Save v-else class="size-4" :stroke-width="2.5" aria-hidden="true" />
            <slot />
        </Button>
        <p v-show="recentlySuccessful" class="report-save-hint">
            <CheckCircle2 class="size-4 shrink-0" :stroke-width="2" aria-hidden="true" />
            Saved
        </p>
    </div>
</template>
