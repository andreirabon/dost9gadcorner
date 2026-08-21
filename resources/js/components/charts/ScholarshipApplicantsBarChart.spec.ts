import type { ScholarshipApplicantDataRow } from '@/types/reports';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

/**
 * ApexCharts draws into a real element, which happy-dom cannot provide. The
 * renderer is replaced with an inert component so the chart's configuration —
 * the part this component actually decides — can be asserted directly.
 *
 * Declared inside the factory because `vi.mock` is hoisted above any top-level
 * const it would otherwise close over.
 */
vi.mock('vue3-apexcharts', () => ({
    default: {
        name: 'ChartStub',
        props: {
            options: { type: Object, default: () => ({}) },
            series: { type: Array, default: () => [] },
        },
        template: '<div class="chart-stub" />',
    },
}));

import ScholarshipApplicantsBarChart from './ScholarshipApplicantsBarChart.vue';

const row = (label: string, female: number, male: number): ScholarshipApplicantDataRow => ({
    label,
    fullName: `${label} full name`,
    slug: label.toLowerCase(),
    level: 'graduate',
    female,
    male,
});

const mountChart = (rows: ScholarshipApplicantDataRow[], axisCeiling?: number) =>
    mount(ScholarshipApplicantsBarChart, { props: { rows, axisCeiling } });

const chartProps = (wrapper: ReturnType<typeof mountChart>) => wrapper.findComponent({ name: 'ChartStub' }).props();

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Stands in for the rendered chart: the y-axis ticks are all the annotator touches. */
const axisRoot = (labels: string[]): Element => {
    const root = document.createElementNS(SVG_NS, 'svg');

    labels.forEach((label) => {
        const text = document.createElementNS(SVG_NS, 'text');
        text.setAttribute('class', 'apexcharts-yaxis-label');
        text.textContent = label;
        root.appendChild(text);
    });

    return root;
};

const addTitle = (label: Element, text: string): void => {
    const title = document.createElementNS(SVG_NS, 'title');
    title.textContent = text;
    label.appendChild(title);
};

const titlesIn = (root: Element): string[] => Array.from(root.querySelectorAll('title')).map((title) => title.textContent ?? '');

describe('ScholarshipApplicantsBarChart', () => {
    it('sends one female series and one male series in program order', () => {
        const wrapper = mountChart([row('ERDT', 0, 76), row('STRAND', 65, 13)]);
        const series = chartProps(wrapper).series as Array<{ name: string; data: number[] }>;

        expect(series.map((entry) => entry.name)).toEqual(['Female', 'Male']);
        expect(series[0].data).toEqual([0, 65]);
        expect(series[1].data).toEqual([76, 13]);
    });

    it('labels the axis with the program names', () => {
        const wrapper = mountChart([row('ERDT', 1, 2), row('STRAND', 3, 4)]);
        const options = chartProps(wrapper).options as { xaxis: { categories: string[] } };

        expect(options.xaxis.categories).toEqual(['ERDT', 'STRAND']);
    });

    it('runs the bars horizontally so long program names stay readable', () => {
        const wrapper = mountChart([row('ERDT', 1, 2)]);
        const options = chartProps(wrapper).options as { plotOptions: { bar: { horizontal: boolean } } };

        expect(options.plotOptions.bar.horizontal).toBe(true);
    });

    it('honours a set-wide axis ceiling so small multiples share one scale', () => {
        // This chart tops out at 30, but its sibling reaches 250; sized to its own
        // data the two would draw equal-length bars for very different totals.
        const wrapper = mountChart([row('ERDT', 10, 20)], 250);
        const options = chartProps(wrapper).options as { xaxis: { max: number } };

        expect(options.xaxis.max).toBeGreaterThanOrEqual(250);
    });

    it('falls back to its own data when no ceiling is given', () => {
        const wrapper = mountChart([row('ERDT', 10, 20)]);
        const options = chartProps(wrapper).options as { xaxis: { max: number } };

        expect(options.xaxis.max).toBeGreaterThanOrEqual(30);
        expect(options.xaxis.max).toBeLessThan(250);
    });

    it('titles each axis acronym with the spelled-out program, for the hover tooltip', () => {
        const wrapper = mountChart([row('ERDT', 1, 2), row('STRAND', 3, 4)]);
        const options = chartProps(wrapper).options as {
            chart: { events: { mounted: (context: { el: Element }) => void; updated: (context: { el: Element }) => void } };
        };
        const root = axisRoot(['ERDT', 'STRAND']);

        options.chart.events.mounted({ el: root });

        expect(titlesIn(root)).toEqual(['ERDT full name', 'STRAND full name']);
    });

    it('does not stack a second title onto an axis label it has already annotated', () => {
        // Apex fires `updated` on every re-render, over the same nodes.
        const wrapper = mountChart([row('ERDT', 1, 2)]);
        const options = chartProps(wrapper).options as {
            chart: { events: { updated: (context: { el: Element }) => void } };
        };
        const root = axisRoot(['ERDT']);

        options.chart.events.updated({ el: root });
        options.chart.events.updated({ el: root });

        expect(titlesIn(root)).toEqual(['ERDT full name']);
    });

    it('leaves an axis label alone when no program matches it', () => {
        // Apex writes its own title onto a label it had to truncate; a tick this
        // chart cannot name is left exactly as Apex rendered it.
        const wrapper = mountChart([row('ERDT', 1, 2)]);
        const options = chartProps(wrapper).options as {
            chart: { events: { mounted: (context: { el: Element }) => void } };
        };
        const root = axisRoot(['Something else']);
        addTitle(root.querySelector('.apexcharts-yaxis-label')!, 'Apex own title');

        options.chart.events.mounted({ el: root });

        expect(titlesIn(root)).toEqual(['Apex own title']);
    });

    it('hides the zero label rather than printing 0 inside an absent segment', () => {
        const wrapper = mountChart([row('ERDT', 0, 76)]);
        const options = chartProps(wrapper).options as { dataLabels: { formatter: (value: number) => string } };

        expect(options.dataLabels.formatter(0)).toBe('');
        expect(options.dataLabels.formatter(76)).toBe('76');
    });
});
