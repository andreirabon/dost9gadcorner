<script setup lang="ts">
import { type OrgChartNode, toD3OrgChartFlat } from '@/data/organizationalChartData';
import type { OrgChartHierarchyNode } from 'd3-org-chart';
import { OrgChart } from 'd3-org-chart';
import { select } from 'd3-selection';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

defineOptions({
    name: 'D3OrgChartPanel',
});

const props = withDefaults(
    defineProps<{
        nodes: OrgChartNode[];
        /** SVG viewport height passed to d3-org-chart. Width follows container. */
        chartHeight?: number;
        /** Long initial expansion for deep trees (GFPS). */
        initialExpandLevel?: number;
        /** Accessible label for the figure. */
        ariaLabel: string;
    }>(),
    {
        chartHeight: 560,
        initialExpandLevel: 3,
    },
);

const rootEl = ref<HTMLElement | null>(null);
let chart: OrgChart | null = null;
let resizeObserver: ResizeObserver | null = null;

/** Viewport width for responsive SVG height (phones / tablets / desktop). */
const windowWidth = ref(typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth : 1280);

function syncWindowWidth(): void {
    if (typeof globalThis.window === 'undefined') {
        return;
    }
    windowWidth.value = globalThis.window.innerWidth;
}

/**
 * Cap chart height on small viewports so org charts fit without excessive vertical scroll,
 * while staying usable on desktop (ui-ux-pro-max: test 375 / 768 / 1024 / 1440).
 */
const effectiveChartHeight = computed((): number => {
    const base = props.chartHeight;
    const w = windowWidth.value;
    const vh = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight : 900;
    if (w < 480) {
        return Math.max(280, Math.min(base, Math.round(vh * 0.42)));
    }
    if (w < 768) {
        return Math.max(320, Math.min(base, Math.round(vh * 0.5)));
    }
    if (w < 1024) {
        return Math.min(base, 640);
    }
    return base;
});

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/** U+2011 NON-BREAKING HYPHEN — avoids "Co-" | "Chairperson" line breaks. */
const NB_HYPHEN = '\u2011';

/** U+00A0 NO-BREAK SPACE — keeps "Technical Working Group" on one line when possible. */
const NBSP = '\u00a0';

/**
 * Tune line breaks for org chart titles: compound roles stay intact; long lines still wrap at spaces/em dashes.
 */
function preserveOrgChartTitleLineBreaks(text: string): string {
    let t = text;
    t = t.replace(/\b(Co|co|Vice|vice)-(Chair[a-z]*)\b/gi, (_m, prefix: string, chair: string) => `${prefix}${NB_HYPHEN}${chair}`);
    t = t.replace(/\bExecutive Committee\b/g, `Executive${NBSP}Committee`);
    /* Full phrase: avoid "Technical | Working Group" and "Technical Working | Group" splits. */
    t = t.replace(/\bTechnical Working Group\b/g, `Technical${NBSP}Working${NBSP}Group`);
    return t;
}

const FONT_STACK = 'Inter, ui-sans-serif, system-ui, sans-serif';

type OrgChartHierarchyBundle = OrgChartHierarchyNode & {
    children?: OrgChartHierarchyNode[] | null;
    _children?: OrgChartHierarchyNode[] | null;
};

/**
 * d3-org-chart default buttonContent uses chevrons + counts; we use +/− to match page copy.
 * Visibility: use hierarchy children/_children (same rule as the library’s button opacity), not only
 * data._directSubordinates. Style: foreignObject xhtml divs often default to white — light text was invisible.
 */
function orgChartExpandButtonContent({ node }: { node: OrgChartHierarchyNode }): string {
    const n = node as OrgChartHierarchyBundle;
    const openCount = Array.isArray(n.children) ? n.children.length : 0;
    const hiddenCount = Array.isArray(n._children) ? n._children.length : 0;
    if (openCount === 0 && hiddenCount === 0) {
        return '';
    }
    const expanded = openCount > 0;
    const glyph = expanded ? '\u2212' : '+';
    return `<div class="org-chart-expand-btn" aria-hidden="true">${glyph}</div>`;
}

function buildChartInstance(): OrgChart {
    return new OrgChart()
        .svgHeight(effectiveChartHeight.value)
        .layout('top')
        .compact(true)
        .initialExpandLevel(props.initialExpandLevel)
        .duration(320)
        .defaultFont(FONT_STACK)
        .nodeWidth(() => 264)
        .nodeHeight(() => 120)
        .siblingsMargin(() => 20)
        .childrenMargin(() => 52)
        .nodeButtonWidth(() => 44)
        .nodeButtonHeight(() => 44)
        .nodeButtonX(() => -22)
        .nodeButtonY(() => -22)
        .buttonContent(orgChartExpandButtonContent)
        .linkUpdate(function (this: SVGPathElement, linkDatum: unknown) {
            const d = linkDatum as OrgChartHierarchyNode;
            const hi = Boolean(d.data?._upToTheRootHighlighted);
            const path = select(this);
            path
                .attr('stroke', hi ? '#f0abfc' : 'rgba(196, 181, 253, 0.45)')
                .attr('stroke-width', hi ? 2.5 : 1.35)
                .attr('stroke-linecap', 'round')
                .attr('stroke-linejoin', 'round');
            if (hi) {
                path.raise();
            }
        })
        .nodeContent((d: OrgChartHierarchyNode) => {
            const name = escapeHtml(String(d.data.name ?? ''));
            const title = escapeHtml(preserveOrgChartTitleLineBreaks(String(d.data.title ?? '')));
            const depth = typeof d.depth === 'number' ? d.depth : 0;
            const tier = Math.min(Math.max(depth, 0), 3);
            return `<div class="org-chart-node org-chart-node--tier-${tier}" style="font-family:${FONT_STACK}">
                <span class="org-chart-node__accent" aria-hidden="true"></span>
                <div class="org-chart-node__body">
                    <p class="org-chart-node__name">${name}</p>
                    <p class="org-chart-node__title">${title}</p>
                </div>
            </div>`;
        });
}

function mountChart(): void {
    if (!rootEl.value) {
        return;
    }

    chart?.clear();
    chart = null;

    const instance = buildChartInstance();
    instance.container(rootEl.value).data(toD3OrgChartFlat(props.nodes)).render();
    instance.fit({ animate: false, scale: true });
    chart = instance;
}

function scheduleResizeRender(): void {
    if (!chart || !rootEl.value) {
        return;
    }
    chart.render();
    chart.fit({ animate: false, scale: true });
}

onMounted(() => {
    void nextTick(() => {
        mountChart();
        if (typeof ResizeObserver !== 'undefined' && rootEl.value) {
            resizeObserver = new ResizeObserver(() => {
                scheduleResizeRender();
            });
            resizeObserver.observe(rootEl.value);
        }
    });
});

watch(
    () => props.nodes,
    () => {
        void nextTick(() => mountChart());
    },
);

watch(
    () => [props.chartHeight, props.initialExpandLevel] as const,
    () => {
        void nextTick(() => mountChart());
    },
);

watch(effectiveChartHeight, () => {
    void nextTick(() => mountChart());
});

onBeforeUnmount(() => {
    if (typeof globalThis.window !== 'undefined') {
        globalThis.window.removeEventListener('resize', syncWindowWidth);
    }
    resizeObserver?.disconnect();
    resizeObserver = null;
    chart?.clear();
    chart = null;
});
</script>

<template>
    <figure class="d3-org-chart-figure m-0 min-w-0 p-0">
        <div
            ref="rootEl"
            class="d3-org-chart-panel min-h-[280px] w-full min-w-0 touch-pan-x touch-pan-y sm:min-h-[320px]"
            role="img"
            :aria-label="ariaLabel"
        />
    </figure>
</template>

<style>
/* Unscoped: node markup renders inside SVG foreignObject and must match these rules. */
.d3-org-chart-panel .org-chart-node {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    gap: 0;
    padding: 0;
    margin: 0;
    border-radius: 14px;
    background: linear-gradient(145deg, rgba(30, 16, 51, 0.98) 0%, rgba(24, 12, 42, 0.99) 100%);
    border: 1px solid rgba(167, 139, 250, 0.38);
    box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.06) inset,
        0 8px 24px rgba(0, 0, 0, 0.35);
    color: #f5f3ff;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
}

.d3-org-chart-panel .org-chart-node__accent {
    flex-shrink: 0;
    width: 5px;
    background: linear-gradient(180deg, #e9d5ff 0%, #a78bfa 50%, #7c3aed 100%);
    opacity: 0.95;
}

.d3-org-chart-panel .org-chart-node--tier-0 .org-chart-node__accent {
    width: 6px;
    background: linear-gradient(180deg, #faf5ff 0%, #d8b4fe 40%, #a855f7 100%);
}

.d3-org-chart-panel .org-chart-node--tier-1 .org-chart-node__accent {
    opacity: 0.9;
}

.d3-org-chart-panel .org-chart-node--tier-2 .org-chart-node__accent,
.d3-org-chart-panel .org-chart-node--tier-3 .org-chart-node__accent {
    width: 4px;
    opacity: 0.72;
    background: linear-gradient(180deg, #ddd6fe 0%, #8b5cf6 100%);
}

.d3-org-chart-panel .org-chart-node__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    padding: 12px 14px;
    text-align: center;
}

.d3-org-chart-panel .org-chart-node__name {
    margin: 0;
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.02em;
    line-height: 1.28;
    color: #faf5ff;
}

.d3-org-chart-panel .org-chart-node--tier-0 .org-chart-node__name {
    font-size: 16px;
    font-weight: 680;
    letter-spacing: -0.025em;
}

.d3-org-chart-panel .org-chart-node--tier-2 .org-chart-node__name,
.d3-org-chart-panel .org-chart-node--tier-3 .org-chart-node__name {
    font-size: 13px;
    font-weight: 600;
}

/*foreignObject body often defaults to white; give the control its own fill so +/− stay readable */
.d3-org-chart-panel .node-button-div {
    box-sizing: border-box;
    border-radius: 10px;
    border: 1px solid rgba(233, 213, 255, 0.55);
    background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
    box-shadow:
        0 1px 0 rgba(255, 255, 255, 0.12) inset,
        0 3px 10px rgba(0, 0, 0, 0.35);
}

.d3-org-chart-panel .node-button-div .org-chart-expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-weight: 700;
    font-size: 22px;
    line-height: 1;
    color: #faf5ff;
}

.d3-org-chart-panel .org-chart-node__title {
    margin: 0;
    font-size: 10.5px;
    font-weight: 450;
    line-height: 1.42;
    letter-spacing: 0.01em;
    color: rgba(237, 233, 254, 0.88);
}

.d3-org-chart-panel .org-chart-node--tier-2 .org-chart-node__title,
.d3-org-chart-panel .org-chart-node--tier-3 .org-chart-node__title {
    font-size: 10px;
    color: rgba(221, 214, 254, 0.78);
}
</style>
