<script setup lang="ts">
import { useReportChartAppearance } from '@/composables/useReportPageTheme';
import { reportChartUi } from '@/lib/reportChartUi';
import type { ApexOptions } from 'apexcharts';
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

interface SetupFundingData {
    maleProjects: number;
    maleAmount: number;
    femaleProjects: number;
    femaleAmount: number;
}

interface Props {
    data: SetupFundingData;
    title?: string;
}

const props = withDefaults(defineProps<Props>(), {
    title: '',
});
const chartFontFamily = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const appearance = useReportChartAppearance();

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const formatCompactCurrency = (value: number): string => {
    if (value >= 1000000) {
        return `₱${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
        return `₱${(value / 1000).toFixed(2)}K`;
    }
    return `₱${value.toFixed(2)}`;
};

const series = computed(() => [
    {
        name: 'No. of Projects',
        data: [props.data.maleProjects, props.data.femaleProjects],
    },
    {
        name: 'Amount Funded',
        data: [props.data.maleAmount, props.data.femaleAmount],
    },
]);

const chartOptions = computed<ApexOptions>(() => {
    const ui = reportChartUi(appearance.value);

    return {
        theme: {
            mode: ui.themeMode,
        },
        chart: {
            type: 'bar',
            fontFamily: chartFontFamily,
            foreColor: ui.foreColor,
            nonce: document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content') || undefined,
            toolbar: { show: false },
            offsetY: 0,
            parentHeightOffset: 0,
            animations: {
                enabled: true,
                speed: 500,
                easing: 'easeout',
            },
        },
        ...(props.title
            ? {
                  title: {
                      text: props.title,
                      style: {
                          fontFamily: chartFontFamily,
                          fontSize: '14px',
                          fontWeight: '600',
                          color: ui.titleColor,
                      },
                  },
              }
            : {}),
        colors: ['#F87171', '#60A5FA'],
        xaxis: {
            categories: ['Male', 'Female'],
            labels: {
                style: {
                    fontFamily: chartFontFamily,
                    fontSize: '14px',
                    fontWeight: 700,
                    colors: ui.legendColor,
                },
            },
        },
        yaxis: [
            {
                min: 0,
                title: {
                    text: 'Number of Projects',
                    style: {
                        fontFamily: chartFontFamily,
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#EF4444',
                    },
                },
                labels: {
                    style: {
                        fontFamily: chartFontFamily,
                        fontSize: '12px',
                        colors: [ui.labelMuted],
                    },
                },
            },
            {
                opposite: true,
                min: 0,
                title: {
                    text: 'Amount (PHP)',
                    style: {
                        fontFamily: chartFontFamily,
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#3B82F6',
                    },
                },
                labels: {
                    formatter: (value: number) => formatCompactCurrency(value),
                    style: {
                        fontFamily: chartFontFamily,
                        fontSize: '11px',
                        colors: [ui.labelMuted],
                    },
                },
            },
        ],
        dataLabels: {
            enabled: true,
            formatter: (value: number, options?: { seriesIndex?: number }) => {
                if (options?.seriesIndex === 1) {
                    return formatCompactCurrency(value);
                }

                return `${value}`;
            },
            offsetY: -4,
            style: {
                fontFamily: chartFontFamily,
                fontSize: '13px',
                fontWeight: 700,
                colors: [ui.dataLabelColor],
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetY: -4,
            fontSize: '11px',
            fontFamily: chartFontFamily,
            itemMargin: {
                horizontal: 10,
                vertical: 0,
            },
            labels: {
                colors: ui.legendColor,
            },
            markers: {
                size: 8,
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            theme: ui.tooltipTheme,
            y: {
                formatter: (value: number, options?: { seriesIndex?: number }) => {
                    if (options?.seriesIndex === 1) {
                        return formatCurrency(value);
                    }

                    return `${value}`;
                },
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: '55%',
            },
        },
        stroke: {
            width: 1,
        },
        grid: {
            borderColor: ui.gridBorder,
            xaxis: { lines: { show: false } },
            padding: {
                top: -8,
                right: 4,
                bottom: 0,
                left: 4,
            },
        },
    };
});
</script>

<template>
    <div class="relative h-72 w-full sm:h-80">
        <VueApexCharts type="bar" width="100%" height="100%" :options="chartOptions" :series="series" />
    </div>
</template>
