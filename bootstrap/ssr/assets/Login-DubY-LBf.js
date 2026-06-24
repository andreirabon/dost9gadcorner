import { defineComponent, computed, ref, unref, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$3 } from "./InputError-CkRw5jBS.js";
import { _ as _sfc_main$2, a as _sfc_main$4 } from "./Input-DgH3elPy.js";
import { _ as _sfc_main$1 } from "./Label-BPBW_hyv.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { ShieldCheck, Lock, UserRound, EyeOff, Eye, ArrowLeft } from "@lucide/vue";
import "class-variance-authority";
import "reka-ui";
import "clsx";
import "tailwind-merge";
import "@vueuse/core";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "LoginPage"
  },
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    status: {}
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      username: "",
      password: ""
    });
    const statusMessage = computed(() => props.status ?? null);
    const showPassword = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Sign In" }, null, _parent));
      _push(`<div class="scheme-dark relative flex min-h-dvh flex-col bg-linear-to-b from-slate-950 via-blue-950/95 to-slate-950 text-slate-50 selection:bg-blue-500/30"><div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true"><div class="absolute left-[-10%] top-0 h-[520px] w-[520px] rounded-full bg-blue-500/14 blur-[130px] mix-blend-screen"></div><div class="absolute right-[-10%] bottom-0 h-[620px] w-[620px] rounded-full bg-cyan-500/12 blur-[150px] mix-blend-screen"></div><div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] opacity-50"></div></div><div class="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 px-safe pt-safe sm:px-6 lg:px-8"><div class="grid w-full gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10"><section class="hidden min-h-[560px] flex-col justify-between rounded-3xl border border-blue-200/15 bg-slate-900/55 p-8 text-left shadow-[0_18px_44px_-22px_rgba(2,6,23,0.75)] ring-1 ring-white/10 backdrop-blur-xl lg:flex"><div><div class="mb-6 flex items-center gap-3"><img src="/dostlogo.png" alt="DOST Region IX logo" class="h-14 w-auto drop-shadow-xl" loading="eager" decoding="async"><img src="/gadlogo.png" alt="Gender and Development logo" class="h-14 w-auto rounded-full bg-white/5 p-0.5 drop-shadow-xl" loading="eager" decoding="async"><img src="/Bagong_Pilipinas_logo.png" alt="Bagong Pilipinas logo" class="h-14 w-auto max-w-[170px] object-contain drop-shadow-xl" loading="eager" decoding="async"></div><p class="text-xs font-semibold tracking-[0.18em] text-blue-200/85 uppercase"> Regional GAD reporting workspace </p><h1 class="mt-4 text-3xl font-semibold tracking-tight text-slate-50"> Reliable gender-disaggregated reporting for DOST Region IX. </h1><p class="mt-4 max-w-[60ch] text-sm leading-relaxed text-slate-300/85"> Securely encode, validate, and publish annual data across GFPS membership, employees, scholarship, RSTL, and funding programs. </p></div><div class="space-y-3"><div class="rounded-2xl border border-blue-300/14 bg-slate-950/40 p-4"><div class="flex items-start gap-2.5">`);
      _push(ssrRenderComponent(unref(ShieldCheck), {
        class: "mt-0.5 size-4 shrink-0 text-blue-300/90",
        "stroke-width": "2",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<p class="text-sm leading-relaxed text-slate-300/85"> Access is restricted to authorized personnel. All sign-ins are recorded for accountability. </p></div></div><div class="rounded-2xl border border-blue-300/14 bg-slate-950/40 p-4"><div class="flex items-start gap-2.5">`);
      _push(ssrRenderComponent(unref(Lock), {
        class: "mt-0.5 size-4 shrink-0 text-blue-300/90",
        "stroke-width": "2",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`<p class="text-sm leading-relaxed text-slate-300/85"> Use your assigned account credentials to continue to the reporting dashboard. </p></div></div></div></section><section class="w-full lg:flex"><div class="flex w-full flex-col rounded-3xl border border-white/12 bg-slate-900/68 p-6 shadow-[0_18px_44px_-22px_rgba(2,6,23,0.72)] ring-1 ring-white/10 backdrop-blur-xl sm:p-8 lg:min-h-[560px]"><div class="mb-6 text-left lg:pt-20"><div class="mb-4 flex items-center gap-2.5 lg:hidden"><img src="/dostlogo.png" alt="DOST Region IX logo" class="h-10 w-auto drop-shadow-lg" loading="eager" decoding="async"><img src="/gadlogo.png" alt="Gender and Development logo" class="h-10 w-auto rounded-full bg-white/5 p-0.5 drop-shadow-lg" loading="eager" decoding="async"><img src="/Bagong_Pilipinas_logo.png" alt="Bagong Pilipinas logo" class="h-10 w-auto max-w-[118px] object-contain drop-shadow-lg" loading="eager" decoding="async"></div><p class="text-xs font-semibold tracking-[0.18em] text-blue-200/80 uppercase"> Authorized access </p><h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-100">Sign in to continue</h2><p class="mt-2 text-sm leading-relaxed text-slate-300/80"> Department of Science and Technology Region IX </p></div>`);
      if (statusMessage.value) {
        _push(`<div class="mb-6 rounded-xl border border-blue-300/30 bg-blue-500/12 px-4 py-3 text-sm text-blue-100" role="status" aria-live="polite">${ssrInterpolate(statusMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-5"><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        for: "username",
        class: "text-[13px] font-medium text-slate-100"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Username`);
          } else {
            return [
              createTextVNode("Username")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative">`);
      _push(ssrRenderComponent(unref(UserRound), {
        class: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400",
        "stroke-width": "2",
        "aria-hidden": "true"
      }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        id: "username",
        modelValue: unref(form).username,
        "onUpdate:modelValue": ($event) => unref(form).username = $event,
        type: "text",
        name: "username",
        required: "",
        autocomplete: "username",
        autocapitalize: "none",
        autocorrect: "off",
        spellcheck: "false",
        class: "h-11 border-white/15 bg-slate-950/65 pr-3 pl-10 text-sm text-slate-50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-slate-400/70 focus-visible:border-blue-400/60 focus-visible:bg-slate-950 focus-visible:ring-4 focus-visible:ring-blue-500/20",
        placeholder: "Enter your username"
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        message: unref(form).errors.username
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$1), {
        for: "password",
        class: "text-[13px] font-medium text-slate-100"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Password`);
          } else {
            return [
              createTextVNode("Password")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="relative">`);
      _push(ssrRenderComponent(unref(Lock), {
        class: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400",
        "stroke-width": "2",
        "aria-hidden": "true"
      }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$2), {
        id: "password",
        modelValue: unref(form).password,
        "onUpdate:modelValue": ($event) => unref(form).password = $event,
        type: showPassword.value ? "text" : "password",
        name: "password",
        required: "",
        autocomplete: "current-password",
        class: "h-11 border-white/15 bg-slate-950/65 pr-10 pl-10 text-sm text-slate-50 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] placeholder:text-slate-400/70 focus-visible:border-blue-400/60 focus-visible:bg-slate-950 focus-visible:ring-4 focus-visible:ring-blue-500/20",
        placeholder: "Enter your password"
      }, null, _parent));
      _push(`<button type="button" class="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-slate-800/70 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 active:scale-[0.97]"${ssrRenderAttr("aria-pressed", showPassword.value)}${ssrRenderAttr("aria-label", showPassword.value ? "Hide password" : "Show password")}>`);
      if (showPassword.value) {
        _push(ssrRenderComponent(unref(EyeOff), {
          class: "size-4",
          "stroke-width": "2"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Eye), {
          class: "size-4",
          "stroke-width": "2"
        }, null, _parent));
      }
      _push(`</button></div>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        message: unref(form).errors.password
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(_sfc_main$4), {
        type: "submit",
        class: "group h-11 w-full cursor-pointer rounded-xl border border-blue-300/35 bg-blue-600 text-[14px] font-semibold text-white shadow-lg shadow-blue-950/35 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-blue-200/50 hover:bg-blue-500 hover:shadow-blue-950/50 active:scale-[0.97] disabled:opacity-50",
        disabled: unref(form).processing
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign In `);
          } else {
            return [
              createTextVNode(" Sign In ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><div class="mt-6 border-t border-white/10 pt-5 text-center lg:mt-auto">`);
      _push(ssrRenderComponent(unref(Link), {
        href: _ctx.route("index"),
        class: "group inline-flex cursor-pointer items-center justify-center gap-1.5 text-[13px] font-medium text-slate-300/80 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-slate-100"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), {
              class: "size-3.5 shrink-0 text-current transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-1",
              "stroke-width": "2",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Return to public site `);
          } else {
            return [
              createVNode(unref(ArrowLeft), {
                class: "size-3.5 shrink-0 text-current transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-x-1",
                "stroke-width": "2",
                "aria-hidden": "true"
              }),
              createTextVNode(" Return to public site ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section></div></div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/auth/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
