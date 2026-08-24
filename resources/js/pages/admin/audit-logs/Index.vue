<script setup lang="ts">
import Heading from '@/components/shared/Heading.vue';
import { humanizeLabel } from '@/helpers/humanizeLabel';
import AppLayout from '@/layouts/AppLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { ChevronDown } from '@lucide/vue';
import { ref } from 'vue';
import AuditChangeDiff from './AuditChangeDiff.vue';

interface AuditLogItem {
    id: number;
    actor_username: string;
    actor_role: string | null;
    action: string;
    section: string | null;
    column: string | null;
    row: string | null;
    item_label: string;
    changes: Record<string, unknown> | null;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

defineProps<{
    logs: Paginated<AuditLogItem>;
}>();

const expandedId = ref<number | null>(null);

function toggle(id: number): void {
    expandedId.value = expandedId.value === id ? null : id;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

const formatAction = humanizeLabel;
</script>

<template>
    <AppLayout>
        <Head title="Audit Log" />

        <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <div class="mb-6">
                <Heading title="Audit Log" description="Every action taken by every account." />
            </div>

            <div class="app-surface-card max-h-[calc(100vh-14rem)] overflow-auto rounded-2xl">
                <table class="w-full text-left text-sm">
                    <thead
                        class="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs font-semibold tracking-wide text-slate-500 uppercase"
                    >
                        <tr>
                            <th class="px-4 py-3">Name</th>
                            <th class="px-4 py-3">Action</th>
                            <th class="px-4 py-3">Date</th>
                            <th class="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <template v-for="(log, index) in logs.data" :key="log.id">
                            <tr class="transition-colors duration-150 hover:bg-slate-200" :class="{ 'bg-slate-100': index % 2 === 1 }">
                                <td class="px-4 py-3 font-medium text-slate-900">{{ log.actor_username }}</td>
                                <td class="px-4 py-3 text-slate-700">{{ formatAction(log.action) }}</td>
                                <td class="px-4 py-3 whitespace-nowrap text-slate-600">{{ formatDate(log.created_at) }}</td>
                                <td class="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        class="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none"
                                        :aria-expanded="expandedId === log.id"
                                        @click="toggle(log.id)"
                                    >
                                        Details
                                        <ChevronDown
                                            class="size-3.5 transition-transform duration-200 motion-reduce:transition-none"
                                            :class="{ 'rotate-180': expandedId === log.id }"
                                        />
                                    </button>
                                </td>
                            </tr>
                            <tr :class="{ 'bg-slate-100': index % 2 === 1 }">
                                <td colspan="4" class="p-0">
                                    <Transition
                                        enter-active-class="transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
                                        leave-active-class="transition-[grid-template-rows] duration-150 ease-out motion-reduce:transition-none"
                                        enter-from-class="grid-rows-[0fr]"
                                        leave-to-class="grid-rows-[0fr]"
                                    >
                                        <div v-if="expandedId === log.id" class="grid grid-rows-[1fr] bg-slate-50/70">
                                            <div class="overflow-hidden">
                                                <div class="p-3">
                                                    <AuditChangeDiff
                                                        :changes="log.changes ?? {}"
                                                        :item="log.item_label"
                                                        :section="log.section"
                                                        :column="log.column"
                                                        :row="log.row"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Transition>
                                </td>
                            </tr>
                        </template>
                        <tr v-if="logs.data.length === 0">
                            <td colspan="4" class="px-4 py-10 text-center text-slate-500">No activity recorded yet.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p v-if="logs.total > 0" class="text-xs text-slate-500">
                    Showing <span class="font-medium text-slate-700">{{ logs.from }}–{{ logs.to }}</span> of
                    <span class="font-medium text-slate-700">{{ logs.total }}</span>
                </p>
                <span v-else />

                <nav v-if="logs.links.length > 3" class="flex flex-wrap items-center gap-1" aria-label="Pagination">
                    <template v-for="(link, index) in logs.links" :key="index">
                        <span v-if="!link.url" class="rounded-lg px-3 py-1.5 text-sm text-slate-400" v-html="link.label" />
                        <Link
                            v-else
                            :href="link.url"
                            preserve-scroll
                            class="rounded-lg px-3 py-1.5 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none"
                            :class="link.active ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'"
                        >
                            <span v-html="link.label" />
                        </Link>
                    </template>
                </nav>
            </div>
        </div>
    </AppLayout>
</template>
