import { REPORT_CHART_FONT_FAMILY } from '@/lib/reportChartConstants';
import type { ApexOptions } from 'apexcharts';

/** Chart plot area is always white, independent of report page theme. */
export const REPORT_CHART_SURFACE_BACKGROUND = '#ffffff';

/** ApexCharts appends tooltips to `body`; style via this class in app.css. */
export const REPORT_CHART_TOOLTIP_CLASS = 'report-chart-tooltip';

export type ReportChartUi = {
    themeMode: 'light';
    chartBackground: string;
    foreColor: string;
    labelMuted: string;
    legendColor: string;
    gridBorder: string;
    titleColor: string;
    tooltipTheme: 'light';
    dataLabelColor: string;
};

export function reportChartUi(_appearance?: 'light'): ReportChartUi {
    return {
        themeMode: 'light',
        chartBackground: REPORT_CHART_SURFACE_BACKGROUND,
        foreColor: '#475569',
        labelMuted: '#64748b',
        legendColor: '#334155',
        gridBorder: '#e2e8f0',
        titleColor: '#0f172a',
        tooltipTheme: 'light',
        dataLabelColor: '#ffffff',
    };
}

const REPORT_CHART_TOOLTIP_TEXT_COLOR = '#334155';
const REPORT_CHART_TOOLTIP_TITLE_COLOR = '#0f172a';

export type ReportChartTooltipRow = {
    label: string;
    value: string;
    color?: string;
};

type TooltipFormatContext = {
    seriesIndex: number;
    dataPointIndex: number;
    seriesName: string;
};

function escapeTooltipHtml(text: string): string {
    return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

/** Shared HTML shell for every report chart tooltip (pie, bar, stacked, combo). */
export function renderReportChartTooltipCard(heading: string, rows: ReportChartTooltipRow[]): string {
    const safeHeading = escapeTooltipHtml(heading);
    const headingHtml = safeHeading ? `<p class="report-chart-tooltip-card__heading">${safeHeading}</p>` : '';

    const rowsHtml = rows
        .map((row) => {
            const marker = row.color
                ? `<span class="report-chart-tooltip-card__marker" style="background-color:${escapeTooltipHtml(row.color)}"></span>`
                : '';
            const labelHtml = row.label ? `<span class="report-chart-tooltip-card__label">${escapeTooltipHtml(row.label)}</span>` : '';

            return (
                '<div class="report-chart-tooltip-card__row">' +
                marker +
                labelHtml +
                `<span class="report-chart-tooltip-card__value">${escapeTooltipHtml(row.value)}</span>` +
                '</div>'
            );
        })
        .join('');

    return '<div class="report-chart-tooltip-card">' + headingHtml + rowsHtml + '</div>';
}

type ApexTooltipGlobals = {
    categoryLabels?: string[];
    labels?: string[];
    colors?: string[];
    seriesNames?: string[];
    seriesTotals?: number[];
};

function readCategoryLabel(w: { globals: ApexTooltipGlobals }, dataPointIndex: number): string {
    const fromCategory = w.globals.categoryLabels?.[dataPointIndex];
    if (typeof fromCategory === 'string' && fromCategory.length > 0) {
        return fromCategory;
    }

    const fromLabels = w.globals.labels?.[dataPointIndex];
    if (typeof fromLabels === 'string' && fromLabels.length > 0) {
        return fromLabels;
    }

    return '';
}

function buildCartesianTooltipHtml(
    {
        series,
        seriesIndex,
        dataPointIndex,
        w,
    }: {
        series: number[][];
        seriesIndex?: number;
        dataPointIndex?: number;
        w: { globals: ApexTooltipGlobals };
    },
    options: {
        shared: boolean;
        formatValue: (value: number, context: TooltipFormatContext) => string;
    },
): string {
    const pointIndex = dataPointIndex ?? 0;
    const colors = (w.globals.colors ?? []) as string[];
    const seriesNames = (w.globals.seriesNames ?? []) as string[];
    const category = readCategoryLabel(w, pointIndex);

    if (options.shared) {
        const rows: ReportChartTooltipRow[] = seriesNames.map((name, index) => {
            const raw = Array.isArray(series[index]) ? series[index][pointIndex] : 0;
            const value = Number(raw) || 0;

            return {
                label: name,
                value: options.formatValue(value, {
                    seriesIndex: index,
                    dataPointIndex: pointIndex,
                    seriesName: name,
                }),
                color: colors[index],
            };
        });

        return renderReportChartTooltipCard(category, rows);
    }

    const activeSeriesIndex = seriesIndex ?? 0;
    const seriesName = seriesNames[activeSeriesIndex] ?? `Series ${activeSeriesIndex + 1}`;
    const raw = Array.isArray(series[activeSeriesIndex]) ? series[activeSeriesIndex][pointIndex] : 0;
    const value = Number(raw) || 0;

    return renderReportChartTooltipCard(category, [
        {
            label: seriesName,
            value: options.formatValue(value, {
                seriesIndex: activeSeriesIndex,
                dataPointIndex: pointIndex,
                seriesName,
            }),
            color: colors[activeSeriesIndex],
        },
    ]);
}

/** Uniform light tooltip for bar, line, and combo charts. */
export function reportChartTooltip(overrides: ApexOptions['tooltip'] = {}): ApexOptions['tooltip'] {
    const { custom: customOverride, y, ...rest } = overrides;
    const shared = Boolean(rest.shared);
    const yFormatter = y?.formatter;

    const formatValue = (value: number, context: TooltipFormatContext): string => {
        if (typeof yFormatter === 'function') {
            return String(
                yFormatter(value, {
                    seriesIndex: context.seriesIndex,
                    dataPointIndex: context.dataPointIndex,
                } as Parameters<NonNullable<typeof yFormatter>>[1]),
            );
        }

        return Number.isFinite(value) ? value.toLocaleString() : String(value);
    };

    return {
        ...rest,
        theme: 'light',
        cssClass: REPORT_CHART_TOOLTIP_CLASS,
        fillSeriesColor: false,
        marker: { show: false },
        style: {
            fontSize: '12px',
            fontFamily: REPORT_CHART_FONT_FAMILY,
            ...(rest.style ?? {}),
            color: REPORT_CHART_TOOLTIP_TEXT_COLOR,
        },
        custom:
            customOverride ??
            ((context) =>
                buildCartesianTooltipHtml(
                    {
                        series: context.series as number[][],
                        seriesIndex: context.seriesIndex,
                        dataPointIndex: context.dataPointIndex,
                        w: context.w,
                    },
                    { shared, formatValue },
                )),
    };
}

export type ReportChartPieTooltipOptions = {
    formatValue?: (value: number, label: string, seriesIndex: number) => string;
};

/** Uniform pie tooltips (same card shell; avoids slice-colored tooltip backgrounds). */
export function reportChartPieTooltip(labels: readonly string[], options: ReportChartPieTooltipOptions = {}): ApexOptions['tooltip'] {
    return reportChartTooltip({
        fillSeriesColor: false,
        custom: ({ series, seriesIndex, w }) => {
            const index = seriesIndex ?? 0;
            const label = labels[index] ?? (typeof w.globals.labels?.[index] === 'string' ? w.globals.labels[index] : `Series ${index + 1}`);
            const numericSeries = Array.isArray(series) ? series.map((value) => Number(value) || 0) : [];
            const value = numericSeries[index] ?? 0;
            const totalFromGlobals = w.globals.seriesTotals?.reduce((sum: number, part: number) => sum + (Number(part) || 0), 0);
            const total =
                (typeof totalFromGlobals === 'number' && totalFromGlobals > 0
                    ? totalFromGlobals
                    : numericSeries.reduce((sum, part) => sum + part, 0)) || 0;
            const percent = total > 0 ? (value / total) * 100 : 0;
            const valueText = options.formatValue?.(value, label, index) ?? `${value.toLocaleString()} (${percent.toFixed(1)}%)`;
            const colors = (w.globals.colors ?? []) as string[];

            return renderReportChartTooltipCard(label, [
                {
                    label: '',
                    value: valueText,
                    color: colors[index],
                },
            ]);
        },
    });
}

export { REPORT_CHART_TOOLTIP_TEXT_COLOR, REPORT_CHART_TOOLTIP_TITLE_COLOR };
