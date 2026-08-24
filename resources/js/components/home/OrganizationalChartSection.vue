<script setup lang="ts">
import OrgTreeBranch from '@/components/home/OrgTreeBranch.vue';
import { buildOrgTree, getGfpsNodes, getMoveNodes } from '@/data/organizationalChartData';
import { computed } from 'vue';

defineOptions({
    name: 'OrganizationalChartSection',
});

const gfpsTree = computed(() => buildOrgTree(getGfpsNodes()));
const moveTree = computed(() => buildOrgTree(getMoveNodes()));
</script>

<template>
    <section id="org-chart" class="home-index-section px-page-gutter" aria-labelledby="org-chart-heading">
        <div class="home-index-section__inner max-w-7xl">
            <header class="home-section-header">
                <p class="home-eyebrow">Governance structure</p>
                <h2 id="org-chart-heading" data-focus-anchor="true" tabindex="-1" class="home-section-title">Organizational chart</h2>
                <p class="home-section-lead">
                    DOST Region IX leadership for gender mainstreaming and MOVE advocacy. Collapsed branches show the role; expand one to see the
                    name.
                </p>
            </header>

            <div class="flex flex-col gap-8">
                <article aria-labelledby="gfps-org-heading" class="flex flex-col gap-3">
                    <header>
                        <p class="home-eyebrow">GFPS</p>
                        <h3 id="gfps-org-heading" class="mt-1 text-xl font-semibold tracking-tight text-brand-50 sm:text-2xl">
                            Gender and Development Focal Point System
                        </h3>
                    </header>
                    <div class="home-panel">
                        <ul class="org-tree__root m-0 w-full list-none space-y-6 p-0 lg:space-y-8">
                            <li v-for="root in gfpsTree" :key="root.id" class="list-none">
                                <OrgTreeBranch :node="root" :depth="0" />
                            </li>
                        </ul>
                    </div>
                </article>

                <article aria-labelledby="move-org-heading" class="flex flex-col gap-3">
                    <header>
                        <p class="home-eyebrow">MOVE</p>
                        <h3 id="move-org-heading" class="mt-1 text-xl font-semibold tracking-tight text-brand-50 sm:text-2xl">
                            Men Opposed to Violence Against Women Everywhere
                        </h3>
                    </header>
                    <div class="home-panel">
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
