<script setup lang="ts">
import IndexSectionDecor from '@/components/home/IndexSectionDecor.vue';
import OrgTreeBranch from '@/components/home/OrgTreeBranch.vue';
import { buildOrgTree, getGfpsNodes, getMoveNodes } from '@/data/organizationalChartData';
import { ListTree } from '@lucide/vue';
import { computed } from 'vue';

defineOptions({
    name: 'OrganizationalChartSection',
});

const gfpsTree = computed(() => buildOrgTree(getGfpsNodes()));
const moveTree = computed(() => buildOrgTree(getMoveNodes()));

const headerIntroCardClass =
    'relative overflow-hidden rounded-[2.5rem] border border-purple-400/35 bg-purple-900/55 p-8 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] sm:p-10';

const chartPanelClass =
    'relative overflow-hidden rounded-[2.5rem] border border-purple-400/35 bg-purple-900/55 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10';
</script>

<template>
    <section
        id="org-chart"
        class="relative isolate scroll-mt-24 overflow-x-clip border-t border-purple-500/45 bg-linear-to-b from-purple-950/95 via-fuchsia-950/38 to-purple-950 px-page-gutter pt-12 pb-12 sm:scroll-mt-28 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20 lg:pt-24"
        aria-labelledby="org-chart-heading"
    >
        <IndexSectionDecor variant="org" />

        <div class="relative z-10 mx-auto w-full max-w-7xl">
            <article :class="headerIntroCardClass">
                <div
                    class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/35 to-transparent"
                    aria-hidden="true"
                />
                <div class="relative z-10 flex flex-col gap-5 text-center lg:items-start lg:text-left">
                    <p
                        class="mx-auto inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-950/50 px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-fuchsia-100/90 uppercase ring-1 ring-white/10 lg:mx-0"
                    >
                        <span class="size-1.5 shrink-0 rounded-full bg-fuchsia-300/85" aria-hidden="true" />
                        Governance structure
                    </p>

                    <div class="space-y-4">
                        <h2
                            id="org-chart-heading"
                            data-focus-anchor="true"
                            tabindex="-1"
                            class="text-2xl font-semibold tracking-tight text-purple-100 sm:text-3xl md:text-4xl"
                        >
                            Organizational <span class="text-fuchsia-300/90">Chart</span>
                        </h2>
                        <p class="mx-auto max-w-2xl text-base leading-relaxed text-purple-200/85 sm:text-lg lg:mx-0">
                            DOST Region IX leadership for gender mainstreaming and MOVE advocacy. Use the tree below to
                            browse roles and names.
                        </p>
                    </div>

                    <p
                        class="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-950/40 px-3 py-1.5 text-xs font-medium text-purple-100/85 ring-1 ring-white/5 lg:mx-0"
                    >
                        <ListTree class="size-3.5 shrink-0 text-fuchsia-300/80" stroke-width="2" aria-hidden="true" />
                        Collapsed: role only. Expanded: name and role.
                    </p>
                </div>
            </article>

            <div class="mt-6 flex flex-col gap-6 sm:mt-8 lg:gap-8">
                <article aria-labelledby="gfps-org-heading" class="flex flex-col gap-4 sm:gap-5">
                    <header class="flex flex-col gap-3 text-center lg:items-start lg:text-left">
                        <p
                            class="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-950/45 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-purple-100/90 uppercase ring-1 ring-white/10 lg:mx-0"
                        >
                            GFPS
                        </p>
                        <h3
                            id="gfps-org-heading"
                            class="max-w-3xl text-lg font-semibold tracking-tight text-purple-100 sm:text-xl md:text-2xl"
                        >
                            Gender and Development Focal Point System
                        </h3>
                    </header>
                    <div :class="[chartPanelClass, 'px-4 py-5 sm:px-6 sm:py-6']">
                        <ul class="org-tree__root m-0 w-full list-none space-y-6 p-0 lg:space-y-8">
                            <li v-for="root in gfpsTree" :key="root.id" class="list-none">
                                <OrgTreeBranch :node="root" :depth="0" />
                            </li>
                        </ul>
                    </div>
                </article>

                <article aria-labelledby="move-org-heading" class="flex flex-col gap-4 sm:gap-5">
                    <header class="flex flex-col gap-3 text-center lg:items-start lg:text-left">
                        <p
                            class="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-950/45 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-purple-100/90 uppercase ring-1 ring-white/10 lg:mx-0"
                        >
                            MOVE
                        </p>
                        <h3
                            id="move-org-heading"
                            class="max-w-3xl text-lg font-semibold tracking-tight text-purple-100 sm:text-xl md:text-2xl"
                        >
                            Men Opposed to Violence Against Women Everywhere
                        </h3>
                    </header>
                    <div :class="[chartPanelClass, 'px-4 py-5 sm:px-6 sm:py-6']">
                        <ul class="org-tree__root m-0 w-full max-w-3xl list-none space-y-6 p-0 lg:space-y-8">
                            <li v-for="root in moveTree" :key="root.id" class="list-none">
                                <OrgTreeBranch :node="root" :depth="0" />
                            </li>
                        </ul>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
