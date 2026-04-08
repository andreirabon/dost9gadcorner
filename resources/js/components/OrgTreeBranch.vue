<script setup lang="ts">
import { shouldOmitChildTitle, type OrgTreeNode } from '@/data/organizationalChartData';
import { computed } from 'vue';

defineOptions({
    name: 'OrgTreeBranch',
});

const props = withDefaults(
    defineProps<{
        node: OrgTreeNode;
        depth?: number;
        /** Set on recursive renders so children under e.g. TWG Members show name only. */
        parentName?: string;
    }>(),
    {
        depth: 0,
    },
);

const showTitle = computed(() => !shouldOmitChildTitle(props.parentName));

const level = computed(() => Math.min(props.depth, 3));

const levelClass = computed(() => {
    switch (level.value) {
        case 0:
            return {
                card: 'border-l-4 border-l-fuchsia-300/95 bg-purple-800/40 border-y border-r border-purple-300/35',
                name: 'text-sm font-semibold tracking-tight text-purple-50 sm:text-base',
                title: 'mt-1 text-xs leading-snug text-purple-200/85 sm:text-sm',
            };
        case 1:
            return {
                card: 'border-l-2 border-l-violet-400/90 bg-purple-900/35 border border-purple-300/28',
                name: 'text-xs font-semibold tracking-tight text-purple-50 sm:text-sm',
                title: 'mt-0.5 text-[11px] leading-snug text-purple-200/75 sm:text-xs',
            };
        case 2:
            return {
                card: 'border-l-2 border-l-purple-400/85 bg-purple-950/40 border border-purple-400/22',
                name: 'text-[11px] font-semibold text-purple-50 sm:text-xs',
                title: 'mt-0.5 text-[10px] leading-snug text-purple-200/70 sm:text-[11px]',
            };
        default:
            return {
                card: 'border-l border-l-purple-500/70 bg-purple-950/35 border border-purple-500/25',
                name: 'text-[10px] font-medium text-purple-100 sm:text-[11px]',
                title: 'mt-0.5 text-[9px] leading-snug text-purple-200/65 sm:text-[10px]',
            };
    }
});

const wideChildLayout = computed(() => props.node.children.length > 8);
</script>

<template>
    <div class="org-branch w-full text-left">
        <div
            :class="[
                'org-node-card rounded-r-lg py-3 pr-4 pl-4 transition-opacity duration-200 sm:py-3.5 sm:pr-5 sm:pl-5 motion-safe:hover:opacity-[0.96]',
                levelClass.card,
            ]"
        >
            <p :class="levelClass.name">
                {{ node.name }}
            </p>
            <p v-if="showTitle" :class="levelClass.title">
                {{ node.title }}
            </p>
        </div>

        <template v-if="node.children.length > 0">
            <!-- Many siblings: compact grid (e.g. TWG members) -->
            <ul
                v-if="wideChildLayout"
                class="m-0 mt-4 grid list-none grid-cols-1 gap-2.5 border-l-2 border-dotted border-purple-400/50 pl-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:pl-5"
            >
                <li v-for="child in node.children" :key="child.id" class="list-none min-w-0">
                    <OrgTreeBranch :node="child" :depth="depth + 1" :parent-name="node.name" />
                </li>
            </ul>

            <!-- Fewer children: vertical stack with rail -->
            <ul
                v-else
                class="m-0 mt-3 list-none space-y-3 border-l-2 border-purple-400/45 pl-3 sm:mt-4 sm:space-y-4 sm:pl-5"
            >
                <li v-for="child in node.children" :key="child.id" class="list-none min-w-0">
                    <OrgTreeBranch :node="child" :depth="depth + 1" :parent-name="node.name" />
                </li>
            </ul>
        </template>
    </div>
</template>
