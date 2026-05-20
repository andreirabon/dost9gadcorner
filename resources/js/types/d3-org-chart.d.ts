declare module 'd3-org-chart' {
    export interface OrgChartHierarchyNodeDatum {
        id?: string | number;
        name?: string;
        title?: string;
        _highlighted?: boolean;
        _upToTheRootHighlighted?: boolean;
        [key: string]: unknown;
    }

    export interface OrgChartHierarchyNode {
        data: OrgChartHierarchyNodeDatum;
        depth?: number;
        [key: string]: unknown;
    }

    export class OrgChart {
        constructor();

        container(selector: HTMLElement | string): OrgChart;

        data(data: unknown[]): OrgChart;

        svgWidth(width: number): OrgChart;

        svgHeight(height: number): OrgChart;

        nodeWidth(fn: (d: unknown) => number): OrgChart;

        nodeHeight(fn: (d: unknown) => number): OrgChart;

        childrenMargin(fn: (d: unknown) => number): OrgChart;

        siblingsMargin(fn: (d: unknown) => number): OrgChart;

        compact(value: boolean): OrgChart;

        initialExpandLevel(level: number): OrgChart;

        duration(ms: number): OrgChart;

        nodeContent(fn: (d: OrgChartHierarchyNode) => string): OrgChart;

        buttonContent(fn: (args: { node: OrgChartHierarchyNode; state: unknown }) => string): OrgChart;

        nodeButtonWidth(fn: (d: unknown) => number): OrgChart;

        nodeButtonHeight(fn: (d: unknown) => number): OrgChart;

        nodeButtonX(fn: (d: unknown) => number): OrgChart;

        nodeButtonY(fn: (d: unknown) => number): OrgChart;

        linkUpdate(fn: (this: SVGPathElement, linkDatum: unknown, index: number, nodes: unknown[]) => void): OrgChart;

        defaultFont(fontStack: string): OrgChart;

        layout(value: 'top' | 'bottom' | 'left' | 'right'): OrgChart;

        render(): OrgChart;

        fit(options?: { animate?: boolean; nodes?: unknown[]; scale?: boolean; onCompleted?: () => void }): OrgChart;

        /* Removes resize listener and SVG content; call before destroying the container. */
        clear(): void;

        getChartState(): {
            svg?: {
                on: (typenames: string, listener?: null) => unknown;
            };
        };

        zoomBehavior?(): unknown;
    }
}
