import { defineComponent, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderSlot } from "vue/server-renderer";
import { usePreferredReducedMotion } from "@vueuse/core";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ReportChartFrame",
  __ssrInlineRender: true,
  props: {
    variant: { default: "bar" },
    rowCount: { default: void 0 }
  },
  setup(__props) {
    const props = __props;
    const frameClass = computed(() => {
      const classes = [`report-chart-frame--${props.variant}`];
      const rows = props.rowCount ?? 0;
      if (props.variant !== "pie") {
        if (rows >= 10) {
          classes.push("report-chart-frame--rows-xl");
        } else if (rows >= 7) {
          classes.push("report-chart-frame--rows-lg");
        } else if (rows >= 5) {
          classes.push("report-chart-frame--rows-md");
        }
      }
      return classes;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["report-chart-frame relative w-full min-w-0", frameClass.value]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/charts/ReportChartFrame.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SLATE_LIGHT = "#94a3b8";
const SLATE_GRAY = "#334155";
const SLATE_HINT = "#cbd5e1";
const SLATE_MID = "#64748b";
const DISAGG_LIGHT = {
  female: SLATE_LIGHT,
  male: SLATE_GRAY,
  femaleSoft: SLATE_HINT,
  maleSoft: SLATE_MID,
  stroke: ["#64748b", "#1e293b"]
};
function reportDisaggPalette(_appearance) {
  return DISAGG_LIGHT;
}
({
  female: DISAGG_LIGHT.female,
  male: DISAGG_LIGHT.male,
  femaleSoft: DISAGG_LIGHT.femaleSoft,
  maleSoft: DISAGG_LIGHT.maleSoft
});
DISAGG_LIGHT.stroke;
const REPORT_CHART_FONT_FAMILY = 'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
function useReportChartMotion() {
  const prefersReducedMotion = usePreferredReducedMotion();
  return computed(() => {
    if (prefersReducedMotion.value === "reduce") {
      return { enabled: false };
    }
    return {
      enabled: true,
      speed: 400,
      easing: "easeout"
    };
  });
}
function reportChartCspNonce() {
  if (typeof document === "undefined") {
    return void 0;
  }
  return document.querySelector('meta[property="csp-nonce"]')?.getAttribute("content") ?? void 0;
}
const REPORT_CHART_SURFACE_BACKGROUND = "#ffffff";
const REPORT_CHART_TOOLTIP_CLASS = "report-chart-tooltip";
function reportChartUi(_appearance) {
  return {
    themeMode: "light",
    chartBackground: REPORT_CHART_SURFACE_BACKGROUND,
    foreColor: "#475569",
    labelMuted: "#64748b",
    legendColor: "#334155",
    gridBorder: "#e2e8f0",
    titleColor: "#0f172a",
    tooltipTheme: "light",
    dataLabelColor: "#ffffff"
  };
}
const REPORT_CHART_TOOLTIP_TEXT_COLOR = "#334155";
function escapeTooltipHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function renderReportChartTooltipCard(heading, rows) {
  const safeHeading = escapeTooltipHtml(heading);
  const headingHtml = safeHeading ? `<p class="report-chart-tooltip-card__heading">${safeHeading}</p>` : "";
  const rowsHtml = rows.map((row) => {
    const marker = row.color ? `<span class="report-chart-tooltip-card__marker" style="background-color:${escapeTooltipHtml(row.color)}"></span>` : "";
    const labelHtml = row.label ? `<span class="report-chart-tooltip-card__label">${escapeTooltipHtml(row.label)}</span>` : "";
    return '<div class="report-chart-tooltip-card__row">' + marker + labelHtml + `<span class="report-chart-tooltip-card__value">${escapeTooltipHtml(row.value)}</span></div>`;
  }).join("");
  return '<div class="report-chart-tooltip-card">' + headingHtml + rowsHtml + "</div>";
}
function readCategoryLabel(w, dataPointIndex) {
  const fromCategory = w.globals.categoryLabels?.[dataPointIndex];
  if (typeof fromCategory === "string" && fromCategory.length > 0) {
    return fromCategory;
  }
  const fromLabels = w.globals.labels?.[dataPointIndex];
  if (typeof fromLabels === "string" && fromLabels.length > 0) {
    return fromLabels;
  }
  return "";
}
function buildCartesianTooltipHtml({
  series,
  seriesIndex,
  dataPointIndex,
  w
}, options) {
  const pointIndex = dataPointIndex ?? 0;
  const colors = w.globals.colors ?? [];
  const seriesNames = w.globals.seriesNames ?? [];
  const category = readCategoryLabel(w, pointIndex);
  if (options.shared) {
    const rows = seriesNames.map((name, index) => {
      const raw2 = Array.isArray(series[index]) ? series[index][pointIndex] : 0;
      const value2 = Number(raw2) || 0;
      return {
        label: name,
        value: options.formatValue(value2, {
          seriesIndex: index,
          dataPointIndex: pointIndex,
          seriesName: name
        }),
        color: colors[index]
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
        seriesName
      }),
      color: colors[activeSeriesIndex]
    }
  ]);
}
function reportChartTooltip(overrides = {}) {
  const { custom: customOverride, y, ...rest } = overrides;
  const shared = Boolean(rest.shared);
  const yFormatter = y?.formatter;
  const formatValue = (value, context) => {
    if (typeof yFormatter === "function") {
      return String(
        yFormatter(value, {
          seriesIndex: context.seriesIndex,
          dataPointIndex: context.dataPointIndex
        })
      );
    }
    return Number.isFinite(value) ? value.toLocaleString() : String(value);
  };
  return {
    ...rest,
    theme: "light",
    cssClass: REPORT_CHART_TOOLTIP_CLASS,
    fillSeriesColor: false,
    marker: { show: false },
    style: {
      fontSize: "12px",
      fontFamily: REPORT_CHART_FONT_FAMILY,
      ...rest.style ?? {},
      color: REPORT_CHART_TOOLTIP_TEXT_COLOR
    },
    custom: customOverride ?? ((context) => buildCartesianTooltipHtml(
      {
        series: context.series,
        seriesIndex: context.seriesIndex,
        dataPointIndex: context.dataPointIndex,
        w: context.w
      },
      { shared, formatValue }
    ))
  };
}
function reportChartPieTooltip(labels, options = {}) {
  return reportChartTooltip({
    fillSeriesColor: false,
    custom: ({ series, seriesIndex, w }) => {
      const index = seriesIndex ?? 0;
      const label = labels[index] ?? (typeof w.globals.labels?.[index] === "string" ? w.globals.labels[index] : `Series ${index + 1}`);
      const numericSeries = Array.isArray(series) ? series.map((value2) => Number(value2) || 0) : [];
      const value = numericSeries[index] ?? 0;
      const totalFromGlobals = w.globals.seriesTotals?.reduce((sum, part) => sum + (Number(part) || 0), 0);
      const total = (typeof totalFromGlobals === "number" && totalFromGlobals > 0 ? totalFromGlobals : numericSeries.reduce((sum, part) => sum + part, 0)) || 0;
      const percent = total > 0 ? value / total * 100 : 0;
      const valueText = options.formatValue?.(value, label, index) ?? `${value.toLocaleString()} (${percent.toFixed(1)}%)`;
      const colors = w.globals.colors ?? [];
      return renderReportChartTooltipCard(label, [
        {
          label: "",
          value: valueText,
          color: colors[index]
        }
      ]);
    }
  });
}
export {
  REPORT_CHART_FONT_FAMILY as R,
  _sfc_main as _,
  reportChartUi as a,
  reportChartTooltip as b,
  reportChartCspNonce as c,
  reportChartPieTooltip as d,
  reportDisaggPalette as r,
  useReportChartMotion as u
};
