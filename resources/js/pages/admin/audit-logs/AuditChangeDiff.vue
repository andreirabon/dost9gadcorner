<script setup lang="ts">
import { humanizeLabel } from '@/helpers/humanizeLabel';
import { computed } from 'vue';

interface FieldDiff {
    old: unknown;
    new: unknown;
}

const props = withDefaults(
    defineProps<{
        changes: Record<string, unknown>;
        item?: string | null;
        section?: string | null;
        column?: string | null;
        row?: string | null;
    }>(),
    {
        item: null,
        section: null,
        column: null,
        row: null,
    },
);

const meta = computed(() =>
    [
        { label: 'Item', value: props.item },
        { label: 'Section', value: props.section },
        { label: 'Row', value: props.row },
        { label: 'Column', value: props.column },
    ].filter((entry) => entry.value),
);

function isFieldDiff(value: unknown): value is FieldDiff {
    return typeof value === 'object' && value !== null && !Array.isArray(value) && 'old' in value && 'new' in value;
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    return String(value);
}
</script>

<template>
    <div class="space-y-3">
        <dl v-if="meta.length" class="flex flex-wrap gap-x-5 gap-y-1.5">
            <div v-for="entry in meta" :key="entry.label" class="flex items-baseline gap-1.5 text-xs">
                <dt class="font-medium text-slate-500">{{ entry.label }}:</dt>
                <dd class="font-semibold text-slate-900">{{ entry.value }}</dd>
            </div>
        </dl>

        <div v-if="Object.keys(changes).length" class="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div
                v-for="(value, field) in changes"
                :key="field"
                class="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-slate-100 px-3 py-2 text-xs last:border-b-0"
            >
                <span class="w-32 shrink-0 font-medium text-slate-500">{{ humanizeLabel(String(field)) }}</span>

                <template v-if="isFieldDiff(value)">
                    <span class="rounded-md bg-rose-50 px-2 py-0.5 font-medium text-rose-700">{{ formatValue(value.old) }}</span>
                    <span class="text-slate-400" aria-hidden="true">→</span>
                    <span class="rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800">{{ formatValue(value.new) }}</span>
                </template>
                <span v-else class="font-medium text-slate-900">{{ formatValue(value) }}</span>
            </div>
        </div>
    </div>
</template>
