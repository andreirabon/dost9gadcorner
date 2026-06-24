import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { u as useReportChartMotion, r as reportDisaggPalette, a as reportChartUi, R as REPORT_CHART_FONT_FAMILY, d as reportChartPieTooltip, c as reportChartCspNonce, _ as _sfc_main$1 } from "./reportChartUi-80U4r-OL.js";
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
  __name: "GenderPieChart",
  __ssrInlineRender: true,
  props: {
    femaleCount: {},
    maleCount: {}
  },
  setup(__props) {
    const props = __props;
    const appearance = useReportChartAppearance();
    const chartAnimations = useReportChartMotion();
    const totalCount = computed(() => props.femaleCount + props.maleCount);
    const series = computed(() => [props.femaleCount, props.maleCount]);
    const palette = computed(() => reportDisaggPalette(appearance.value));
    const chartOptions = computed(() => {
      const ui = reportChartUi(appearance.value);
      const colors = palette.value;
      return {
        theme: {
          mode: ui.themeMode
        },
        chart: {
          type: "pie",
          fontFamily: REPORT_CHART_FONT_FAMILY,
          foreColor: ui.foreColor,
          background: ui.chartBackground,
          nonce: reportChartCspNonce(),
          animations: chartAnimations.value
        },
        labels: ["Female", "Male"],
        colors: [colors.female, colors.male],
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontSize: "12px",
          fontFamily: REPORT_CHART_FONT_FAMILY,
          offsetY: 4,
          labels: {
            colors: ui.legendColor
          },
          markers: {
            size: 7,
            strokeWidth: 0
          },
          itemMargin: {
            horizontal: 14,
            vertical: 4
          }
        },
        tooltip: reportChartPieTooltip(["Female", "Male"]),
        dataLabels: {
          enabled: totalCount.value > 0,
          formatter: (value) => `${Math.round(value)}%`,
          style: {
            fontFamily: REPORT_CHART_FONT_FAMILY,
            fontSize: "13px",
            fontWeight: 600
          },
          dropShadow: {
            enabled: false
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: [ui.chartBackground]
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "0%"
            }
          }
        },
        states: {
          hover: {
            filter: {
              type: "lighten",
              value: 0.04
            }
          }
        },
        noData: {
          text: "No data available",
          align: "center",
          verticalAlign: "middle",
          style: {
            fontFamily: REPORT_CHART_FONT_FAMILY,
            color: ui.foreColor
          }
        }
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ variant: "pie" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(VueApexCharts), {
              type: "pie",
              width: "100%",
              height: "100%",
              options: chartOptions.value,
              series: series.value
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(VueApexCharts), {
                type: "pie",
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/charts/GenderPieChart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
