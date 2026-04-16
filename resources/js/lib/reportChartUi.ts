export type ReportChartUi = {
    themeMode: 'light' | 'dark';
    foreColor: string;
    labelMuted: string;
    legendColor: string;
    gridBorder: string;
    titleColor: string;
    tooltipTheme: 'light' | 'dark';
    dataLabelColor: string;
};

export function reportChartUi(appearance: 'light' | 'dark'): ReportChartUi {
    if (appearance === 'light') {
        return {
            themeMode: 'light',
            foreColor: '#475569',
            labelMuted: '#64748b',
            legendColor: '#334155',
            gridBorder: '#e2e8f0',
            titleColor: '#0f172a',
            tooltipTheme: 'light',
            dataLabelColor: '#000000',
        };
    }

    return {
        themeMode: 'dark',
        foreColor: '#a1a1aa',
        labelMuted: '#a1a1aa',
        legendColor: '#e4e4e7',
        gridBorder: '#3f3f46',
        titleColor: '#f4f4f5',
        tooltipTheme: 'dark',
        dataLabelColor: '#FAFAFA',
    };
}
