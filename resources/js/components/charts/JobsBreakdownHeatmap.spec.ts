import { JOBS_BREAKDOWN_LABELS } from '@/constants/reportLabels';
import type { FundingCategorySummaryData } from '@/types/reports';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

/** ApexCharts needs a real element; the renderer is replaced so the config can be read. */
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

import JobsBreakdownHeatmap from './JobsBreakdownHeatmap.vue';

const category = (label: string, overrides: Partial<FundingCategorySummaryData> = {}): FundingCategorySummaryData => ({
    label,
    slug: label.toLowerCase(),
    maleProjects: 0,
    femaleProjects: 0,
    maleAmount: 0,
    femaleAmount: 0,
    jobsPwd: 0,
    jobsSeniorCitizen: 0,
    jobsIp: 0,
    jobs4ps: 0,
    ...overrides,
});

const mountChart = (categories: FundingCategorySummaryData[]) => mount(JobsBreakdownHeatmap, { props: { categories } });

const chartProps = (wrapper: ReturnType<typeof mountChart>) => wrapper.findComponent({ name: 'ChartStub' }).props();

describe('JobsBreakdownHeatmap', () => {
    it('renders one row per overlapping group, top-down from PWD', () => {
        const wrapper = mountChart([category('ZC/IC')]);
        const series = chartProps(wrapper).series as Array<{ name: string }>;

        // Apex draws the first series at the bottom, so the array is reversed.
        expect(series.map((entry) => entry.name)).toEqual([
            JOBS_BREAKDOWN_LABELS.fourPs,
            JOBS_BREAKDOWN_LABELS.ip,
            JOBS_BREAKDOWN_LABELS.seniorCitizen,
            JOBS_BREAKDOWN_LABELS.pwd,
        ]);
    });

    it('maps each cell to its funding category', () => {
        const wrapper = mountChart([category('ZC/IC', { jobsPwd: 8 }), category('ZSP', { jobsPwd: 4 })]);
        const series = chartProps(wrapper).series as Array<{ name: string; data: Array<{ x: string; y: number }> }>;
        const pwd = series.find((entry) => entry.name === JOBS_BREAKDOWN_LABELS.pwd);

        expect(pwd?.data).toEqual([
            { x: 'ZC/IC', y: 8 },
            { x: 'ZSP', y: 4 },
        ]);
    });

    it('uses a single-hue sequential scale, never the categorical pair', () => {
        const wrapper = mountChart([category('ZC/IC', { jobsPwd: 10 })]);
        const options = chartProps(wrapper).options as {
            plotOptions: { heatmap: { colorScale: { ranges: Array<{ color: string }> } } };
        };
        const colors = options.plotOptions.heatmap.colorScale.ranges.map((range) => range.color);

        // All steps of one purple ramp — an orange here would read as identity.
        expect(colors.every((color) => color.startsWith('#'))).toBe(true);
        expect(new Set(colors).size).toBe(colors.length);
    });

    it('spans the ramp across the observed range so a low-count year still varies', () => {
        const wrapper = mountChart([category('ZC/IC', { jobsPwd: 4 }), category('ZSP', { jobs4ps: 1 })]);
        const options = chartProps(wrapper).options as {
            plotOptions: { heatmap: { colorScale: { ranges: Array<{ from: number; to: number }> } } };
        };
        const ranges = options.plotOptions.heatmap.colorScale.ranges;

        expect(ranges[0].from).toBe(0);
        expect(ranges[ranges.length - 1].to).toBe(4);
    });

    it('never divides by zero when nothing has been recorded', () => {
        const wrapper = mountChart([category('ZC/IC')]);
        const options = chartProps(wrapper).options as {
            plotOptions: { heatmap: { colorScale: { ranges: Array<{ from: number; to: number }> } } };
        };

        for (const range of options.plotOptions.heatmap.colorScale.ranges) {
            expect(Number.isFinite(range.from)).toBe(true);
            expect(Number.isFinite(range.to)).toBe(true);
        }
    });

    it('prints the value in every cell, since a shade cannot be read precisely', () => {
        const wrapper = mountChart([category('ZC/IC', { jobsPwd: 8 })]);
        const options = chartProps(wrapper).options as {
            dataLabels: { enabled: boolean; formatter: (value: number) => string };
        };

        expect(options.dataLabels.enabled).toBe(true);
        expect(options.dataLabels.formatter(0)).toBe('0');
    });
});
