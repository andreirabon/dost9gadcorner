<script setup lang="ts">
import D3OrgChartPanel from '@/components/home/D3OrgChartPanel.vue';
import IndexSectionDecor from '@/components/home/IndexSectionDecor.vue';
import { getGfpsNodes, getMoveNodes } from '@/data/organizationalChartData';

defineOptions({
    name: 'OrganizationalChartSection',
});

/** Flat rows from `organizationalChartData` — shared source for d3-org-chart below. */
const gfpsOrgNodes = getGfpsNodes();
const moveOrgNodes = getMoveNodes();

/*
 * To restore the previous `<OrgTreeBranch />` layout, add:
 *   import OrgTreeBranch from '@/components/home/OrgTreeBranch.vue';
 *   import { buildOrgTree, type OrgTreeNode } from '@/data/organizationalChartData';
 *   import { computed } from 'vue';
 *   const gfpsTree = computed((): OrgTreeNode[] => buildOrgTree(gfpsOrgNodes));
 *   const moveTree = computed((): OrgTreeNode[] => buildOrgTree(moveOrgNodes));
 * …then uncomment the marked blocks in the template and remove or comment the D3OrgChartPanel nodes.
 */
</script>

<template>
    <section
        id="org-chart"
        class="relative isolate border-t border-purple-500/45 bg-linear-to-b from-purple-950/95 via-fuchsia-950/38 to-purple-950 px-page-gutter pt-20 pb-12 sm:pt-24 md:pt-28 md:pb-16 lg:pt-32"
        aria-labelledby="org-chart-heading"
    >
        <IndexSectionDecor variant="org" />
        <div class="relative z-10 mx-auto w-full max-w-7xl">
            <div class="mb-8 flex flex-col items-center gap-2 text-center sm:mb-10">
                <h2
                    id="org-chart-heading"
                    data-focus-anchor="true"
                    tabindex="-1"
                    class="px-4 text-2xl font-semibold tracking-tight text-purple-100 sm:text-3xl md:text-4xl"
                >
                    Organizational Chart
                </h2>
                <p class="text-responsive mx-auto max-w-2xl px-4 text-pretty text-purple-100 sm:px-6">
                    Gender and Development Focal Point System (GFPS) and Men Opposed to Violence Against Women Everywhere (MOVE) structure and membership.
                </p>
            </div>

            <div class="flex flex-col gap-14 lg:gap-16">
                <article aria-labelledby="gfps-org-heading" class="space-y-4">
                    <div class="text-center lg:text-left">
                        <h3
                            id="gfps-org-heading"
                            class="text-lg font-semibold tracking-tight text-purple-100 sm:text-xl"
                        >
                            GFPS
                        </h3>
                        <p class="mt-1 text-sm text-purple-200/80">
                            Scroll up or down with your mouse to zoom; drag to pan. On mobile, pinch to zoom in or out, then drag to move.
                        </p>
                    </div>
                    <div
                        class="relative overflow-x-auto rounded-2xl border border-purple-400/35 bg-purple-900/55 px-4 py-6 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:px-8 sm:py-8"
                    >
                        <!--
                        Previous node-tree layout (OrgTreeBranch + buildOrgTree). See script block comment for imports/computed to restore.
                        <ul class="org-tree__root relative m-0 w-full max-w-6xl list-none space-y-6 p-0 lg:space-y-8">
                            <li v-for="root in gfpsTree" :key="root.id" class="list-none">
                                <OrgTreeBranch :node="root" :depth="0" />
                            </li>
                        </ul>
                        -->
                        <D3OrgChartPanel
                            :nodes="gfpsOrgNodes"
                            :chart-height="720"
                            :initial-expand-level="3"
                            ariaLabel="GFPS organizational chart: interactive hierarchy of chairperson, executive committee, technical working group, and members."
                        />
                    </div>
                </article>

                <article aria-labelledby="move-org-heading" class="space-y-4">
                    <div class="text-center lg:text-left">
                        <h3 id="move-org-heading" class="text-lg font-semibold tracking-tight text-purple-100 sm:text-xl">
                            MOVE
                        </h3>
                        <p class="mt-1 text-sm text-purple-200/80">
                            Scroll up or down with your mouse to zoom; drag to pan. On mobile, pinch to zoom in or out, then drag to move.
                        </p>
                    </div>
                    <div
                        class="relative overflow-x-auto rounded-2xl border border-purple-400/35 bg-purple-900/55 px-4 py-6 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:px-8 sm:py-8"
                    >
                        <!--
                        Previous node-tree layout (OrgTreeBranch + buildOrgTree). See script block comment for imports/computed to restore.
                        <ul class="org-tree__root relative m-0 w-full max-w-3xl list-none space-y-6 p-0 lg:space-y-8">
                            <li v-for="root in moveTree" :key="root.id" class="list-none">
                                <OrgTreeBranch :node="root" :depth="0" />
                            </li>
                        </ul>
                        -->
                        <D3OrgChartPanel
                            :nodes="moveOrgNodes"
                            :chart-height="480"
                            :initial-expand-level="4"
                            ariaLabel="MOVE organizational chart: interactive hierarchy of chairperson, co-chair, secretariat, and focal persons."
                        />
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>
