import { defineComponent, unref, mergeProps, withCtx, createVNode, renderSlot, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./ReportBackArrowIcon-DMMIaSWx.js";
import { Link } from "@inertiajs/vue3";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ReportBackNavLink",
  __ssrInlineRender: true,
  props: {
    href: {},
    inline: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: __props.href,
        class: [
          "report-years-btn-primary shrink-0",
          props.inline ? "w-auto" : "w-full sm:w-auto"
        ],
        prefetch: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, null, null, _parent2, _scopeId));
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode(_sfc_main$1),
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/reports/ReportBackNavLink.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const REPORT_YEAR_FIELD_LIMITS = {
  title: 255,
  description: 4e3,
  yearMin: 2e3,
  yearMax: 2100
};
export {
  REPORT_YEAR_FIELD_LIMITS as R,
  _sfc_main as _
};
