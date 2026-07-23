<script setup lang="ts">
import { shouldOmitChildTitle, type OrgTreeNode } from '@/data/organizationalChartData';
import { ChevronRight } from '@lucide/vue';
import { computed, ref } from 'vue';

defineOptions({
    name: 'OrgTreeBranch',
});

const props = withDefaults(
    defineProps<{
        node: OrgTreeNode;
        depth?: number;
        /** Parent group name — hides redundant titles for TWG / secretariat members. */
        parentName?: string;
        /** When omitted, root (depth 0) and large branches start collapsed; other shallow nodes start expanded. */
        defaultOpen?: boolean;
    }>(),
    {
        depth: 0,
    },
);

const hasChildren = computed(() => props.node.children.length > 0);

const isOpen = ref(props.defaultOpen ?? (props.depth === 0 ? false : props.node.children.length > 6 ? false : props.depth < 2));

const level = computed(() => Math.min(props.depth, 3));

const levelClass = computed(() => {
    switch (level.value) {
        case 0:
            return {
                card: 'border border-purple-400/40 bg-purple-800/45 ring-1 ring-white/10',
                name: 'text-sm font-semibold tracking-tight text-purple-50 sm:text-base',
                title: 'text-xs leading-snug text-purple-200/85 sm:text-sm',
                roleOnly: 'text-sm font-medium leading-snug text-purple-100 sm:text-base',
            };
        case 1:
            return {
                card: 'border border-purple-400/32 bg-purple-900/40 ring-1 ring-white/8',
                name: 'text-sm font-semibold tracking-tight text-purple-50 sm:text-base',
                title: 'text-xs leading-snug text-purple-200/75 sm:text-sm',
                roleOnly: 'text-sm font-medium leading-snug text-purple-100/90 sm:text-base',
            };
        case 2:
            return {
                card: 'border border-purple-400/28 bg-purple-950/45 ring-1 ring-white/6',
                name: 'text-xs font-semibold text-purple-50 sm:text-sm',
                title: 'text-[11px] leading-snug text-purple-200/70 sm:text-xs',
                roleOnly: 'text-xs font-medium leading-snug text-purple-100/85 sm:text-sm',
            };
        default:
            return {
                card: 'border border-purple-500/25 bg-purple-950/40 ring-1 ring-white/5',
                name: 'text-xs font-medium text-purple-100 sm:text-sm',
                title: 'text-[11px] leading-snug text-purple-200/65 sm:text-xs',
                roleOnly: 'text-xs font-medium leading-snug text-purple-200/80 sm:text-sm',
            };
    }
});

const wideChildLayout = computed(() => props.node.children.length > 8);

const childrenPanelId = computed(() => `org-branch-children-${props.node.id}`);

const positionLabel = computed(() => props.node.title.trim());

/** Branches: detail when expanded; leaves: always full detail. */
const showDetail = computed(() => !hasChildren.value || isOpen.value);

const showNodeTitle = computed(() => {
    if (!positionLabel.value) {
        return false;
    }

    if (shouldOmitChildTitle(props.parentName)) {
        return false;
    }

    return positionLabel.value.toLowerCase() !== props.node.name.trim().toLowerCase();
});

const toggleLabel = computed(() => {
    if (!hasChildren.value) {
        return '';
    }

    return isOpen.value ? `Collapse ${positionLabel.value || props.node.name}` : `Expand ${positionLabel.value || props.node.name}`;
});

function toggleOpen(): void {
    if (!hasChildren.value) {
        return;
    }

    isOpen.value = !isOpen.value;
}
</script>

<template>
    <div class="org-branch w-full text-left">
        <div
            :class="[
                'org-node-card rounded-xl transition-[border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
                levelClass.card,
                hasChildren ? 'p-0' : 'px-4 py-3 sm:px-5 sm:py-3.5',
            ]"
        >
            <div v-if="hasChildren" class="flex w-full items-stretch gap-0">
                <button
                    type="button"
                    class="touch-target flex shrink-0 items-center justify-center self-stretch rounded-l-xl border-r border-purple-400/25 px-3 text-purple-100 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-purple-800/50 focus-visible:ring-2 focus-visible:ring-fuchsia-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 focus-visible:outline-none active:scale-[0.97]"
                    :aria-expanded="isOpen"
                    :aria-controls="childrenPanelId"
                    :aria-label="toggleLabel"
                    @click="toggleOpen"
                >
                    <ChevronRight
                        class="size-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                        :class="{ 'rotate-90': isOpen }"
                        stroke-width="2"
                        aria-hidden="true"
                    />
                </button>

                <div class="min-w-0 flex-1 px-4 py-3 sm:px-5 sm:py-3.5">
                    <p v-if="!showDetail" :class="levelClass.roleOnly">
                        {{ positionLabel }}
                    </p>
                    <template v-else>
                        <p :class="levelClass.name">
                            {{ node.name }}
                        </p>
                        <p v-if="showNodeTitle" :class="[levelClass.title, 'mt-1']">
                            {{ positionLabel }}
                        </p>
                    </template>
                </div>
            </div>

            <template v-else>
                <p :class="levelClass.name">
                    {{ node.name }}
                </p>
                <p v-if="showNodeTitle" :class="[levelClass.title, 'mt-1']">
                    {{ positionLabel }}
                </p>
            </template>
        </div>

        <div v-if="hasChildren" :id="childrenPanelId" v-show="isOpen" class="org-branch-children">
            <ul
                v-if="wideChildLayout"
                class="m-0 mt-4 grid list-none grid-cols-1 gap-2.5 border-l-2 border-dotted border-purple-400/45 pl-4 sm:grid-cols-2 sm:pl-5 lg:grid-cols-3 xl:grid-cols-4"
            >
                <li v-for="child in node.children" :key="child.id" class="min-w-0 list-none">
                    <OrgTreeBranch :node="child" :depth="depth + 1" :parent-name="node.name" />
                </li>
            </ul>

            <ul v-else class="m-0 mt-3 list-none space-y-3 border-l-2 border-purple-400/40 pl-3 sm:mt-4 sm:space-y-4 sm:pl-5">
                <li v-for="child in node.children" :key="child.id" class="min-w-0 list-none">
                    <OrgTreeBranch :node="child" :depth="depth + 1" :parent-name="node.name" />
                </li>
            </ul>
        </div>
    </div>
</template>
