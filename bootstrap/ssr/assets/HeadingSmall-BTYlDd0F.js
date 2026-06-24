import { defineComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HeadingSmall",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    variant: { default: "default" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(_attrs)}><h3 class="${ssrRenderClass(
        __props.variant === "report" ? "mb-1 text-[13px] font-semibold tracking-[0.14em] text-black uppercase" : "mb-0.5 text-base font-medium"
      )}">${ssrInterpolate(__props.title)}</h3>`);
      if (__props.description) {
        _push(`<p class="${ssrRenderClass(
          __props.variant === "report" ? "mt-0.5 text-sm leading-snug text-black" : "text-sm text-muted-foreground"
        )}">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/shared/HeadingSmall.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
