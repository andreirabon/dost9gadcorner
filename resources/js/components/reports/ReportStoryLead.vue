<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    /**
     * The year's computed opening lines. Empty when the year carries no
     * figures at all, which is not the same as an unpublished year.
     */
    sentences: string[];
    /**
     * The admin-written note for this year, verbatim. Optional: a year with no
     * note renders the computed lines alone.
     */
    description?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
    description: null,
});

/** A note of only whitespace is treated as absent, not as an empty paragraph. */
const hasNote = computed<boolean>(() => props.description !== null && props.description.trim() !== '');
</script>

<template>
    <div v-if="sentences.length > 0 || hasNote" class="report-view-block">
        <p v-for="sentence in sentences" :key="sentence" class="report-view-story-lead">
            {{ sentence }}
        </p>
        <p v-if="hasNote" class="report-view-story-note">{{ description }}</p>
    </div>
</template>
