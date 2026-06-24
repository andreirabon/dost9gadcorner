import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { u as useReportChartMotion, r as reportDisaggPalette, a as reportChartUi, R as REPORT_CHART_FONT_FAMILY, b as reportChartTooltip, c as reportChartCspNonce, _ as _sfc_main$1 } from "./reportChartUi-80U4r-OL.js";
import { u as useReportChartAppearance } from "./Show-Bo57wN29.js";
import VueApexCharts from "vue3-apexcharts";
import "@vueuse/core";
import "./IndexSectionDecor-B6eML_EX.js";
import "./AppFooter-ClQxMSzB.js";
import "./ReportBackArrowIcon-DMMIaSWx.js";
import "@lucide/vue";
import "@inertiajs/vue3";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AssemblyStackedBarChart",
  __ssrInlineRender: true,
  props: {
    data: {},
    title: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const appearance = useReportChartAppearance();
    const chartAnimations = useReportChartMotion();
    const series = computed(() => [
      {
        name: "Female",
        data: props.data.map((entry) => entry.female)
      },
      {
        name: "Male",
        data: props.data.map((entry) => entry.male)
      }
    ]);
    const palette = computed(() => reportDisaggPalette(appearance.value));
    const chartOptions = computed(() => {
      const ui = reportChartUi(appearance.value);
      const colors = palette.value;
      const maxValue = Math.max(
        5,
        ...props.data.flatMap((entry) => [entry.female + entry.male])
      );
      const yMax = Math.ceil(maxValue / 5) * 5;
      return {
        theme: {
          mode: ui.themeMode
        },
        chart: {
          type: "bar",
          stacked: true,
          fontFamily: REPORT_CHART_FONT_FAMILY,
          foreColor: ui.foreColor,
          background: ui.chartBackground,
          nonce: reportChartCspNonce(),
          toolbar: { show: false },
          offsetY: 0,
          parentHeightOffset: 0,
          animations: chartAnimations.value
        },
        ...props.title ? {
          title: {
            text: props.title,
            style: {
              fontFamily: REPORT_CHART_FONT_FAMILY,
              fontSize: "14px",
              fontWeight: "600",
              color: ui.titleColor
            }
          }
        } : {},
        colors: [colors.female, colors.male],
        xaxis: {
          categories: props.data.map((entry) => entry.label),
          labels: {
            rotate: props.data.length > 4 ? -35 : 0,
            rotateAlways: props.data.length > 4,
            style: {
              fontFamily: REPORT_CHART_FONT_FAMILY,
              fontSize: "12px",
              colors: ui.labelMuted
            }
          }
        },
        yaxis: {
          min: 0,
          max: yMax,
          tickAmount: Math.min(6, yMax),
          title: {
            text: "Number of Participants",
            style: {
              fontFamily: REPORT_CHART_FONT_FAMILY,
              fontSize: "12px",
              color: ui.labelMuted
            }
          },
          labels: {
            style: {
              fontFamily: REPORT_CHART_FONT_FAMILY,
              fontSize: "12px",
              colors: [ui.labelMuted]
            }
          }
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          offsetY: 4,
          fontSize: "12px",
          fontFamily: REPORT_CHART_FONT_FAMILY,
          itemMargin: {
            horizontal: 12,
            vertical: 0
          },
          labels: {
            colors: ui.legendColor
          },
          markers: {
            size: 7,
            strokeWidth: 0
          }
        },
        dataLabels: {
          enabled: true,
          formatter: (value) => value === 0 ? "" : `${value}`,
          style: {
            fontFamily: REPORT_CHART_FONT_FAMILY,
            fontSize: "12px",
            fontWeight: 600
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: [ui.chartBackground]
        },
        tooltip: reportChartTooltip({
          y: {
            formatter: (value) => `${value}`
          }
        }),
        grid: {
          borderColor: ui.gridBorder,
          strokeDashArray: 4,
          xaxis: { lines: { show: false } },
          padding: {
            top: 0,
            right: 8,
            bottom: 0,
            left: 8
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 3,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            columnWidth: "62%"
          }
        }
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        variant: "bar",
        "row-count": __props.data.length
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(VueApexCharts), {
              type: "bar",
              width: "100%",
              height: "100%",
              options: chartOptions.value,
              series: series.value
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(VueApexCharts), {
                type: "bar",
                width: "100%",
                height: "100%",
                options: chartOptions.value,
                series: series.value
              }, null, 8, ["options", "series"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/charts/AssemblyStackedBarChart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
