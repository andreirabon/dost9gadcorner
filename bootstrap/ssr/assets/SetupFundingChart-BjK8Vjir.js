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
  __name: "SetupFundingChart",
  __ssrInlineRender: true,
  props: {
    data: {},
    title: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const appearance = useReportChartAppearance();
    const chartAnimations = useReportChartMotion();
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    };
    const formatCompactCurrency = (value) => {
      if (value >= 1e6) {
        return `₱${(value / 1e6).toFixed(2)}M`;
      }
      if (value >= 1e3) {
        return `₱${(value / 1e3).toFixed(2)}K`;
      }
      return `₱${value.toFixed(2)}`;
    };
    const series = computed(() => [
      {
        name: "No. of Projects",
        data: [props.data.femaleProjects, props.data.maleProjects]
      },
      {
        name: "Amount Funded",
        data: [props.data.femaleAmount, props.data.maleAmount]
      }
    ]);
    const palette = computed(() => reportDisaggPalette(appearance.value));
    const chartOptions = computed(() => {
      const ui = reportChartUi(appearance.value);
      const colors = palette.value;
      return {
        theme: {
          mode: ui.themeMode
        },
        chart: {
          type: "bar",
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
          categories: ["Female", "Male"],
          labels: {
            style: {
              fontFamily: REPORT_CHART_FONT_FAMILY,
              fontSize: "13px",
              fontWeight: 600,
              colors: ui.legendColor
            }
          }
        },
        yaxis: [
          {
            min: 0,
            title: {
              text: "Number of Projects",
              style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: "12px",
                fontWeight: 600,
                color: ui.titleColor
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
          {
            opposite: true,
            min: 0,
            title: {
              text: "Amount (PHP)",
              style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: "12px",
                fontWeight: 600,
                color: ui.titleColor
              }
            },
            labels: {
              formatter: (value) => formatCompactCurrency(value),
              style: {
                fontFamily: REPORT_CHART_FONT_FAMILY,
                fontSize: "11px",
                colors: [ui.labelMuted]
              }
            }
          }
        ],
        dataLabels: {
          enabled: true,
          formatter: (value, options) => {
            if (options?.seriesIndex === 1) {
              return formatCompactCurrency(value);
            }
            return `${value}`;
          },
          offsetY: 0,
          style: {
            fontFamily: REPORT_CHART_FONT_FAMILY,
            fontSize: "12px",
            fontWeight: 600
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
        tooltip: reportChartTooltip({
          shared: true,
          intersect: false,
          y: {
            formatter: (value, options) => {
              if (options?.seriesIndex === 1) {
                return formatCurrency(value);
              }
              return `${value}`;
            }
          }
        }),
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            columnWidth: "52%",
            dataLabels: {
              position: "center"
            }
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: [ui.chartBackground]
        },
        grid: {
          borderColor: ui.gridBorder,
          strokeDashArray: 4,
          xaxis: { lines: { show: false } },
          padding: {
            top: 20,
            right: 8,
            bottom: 0,
            left: 8
          }
        }
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ variant: "tall" }, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/charts/SetupFundingChart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
