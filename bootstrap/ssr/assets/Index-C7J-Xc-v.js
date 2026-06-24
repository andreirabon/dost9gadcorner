import { defineComponent, mergeProps, useSSRContext, ref, onMounted, onBeforeUnmount, computed, unref, withCtx, createVNode, createTextVNode, resolveComponent, toDisplayString, openBlock, createBlock } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$8 } from "./IndexSectionDecor-B6eML_EX.js";
import { usePage, Link, router, Head } from "@inertiajs/vue3";
import { LogIn, LogOut, ChevronRight, ListTree, ArrowUpRight, FileBarChart2 } from "@lucide/vue";
import { _ as _sfc_main$9 } from "./AppFooter-ClQxMSzB.js";
const MANDATE_TEXT = "The Department of Science and Technology - Region IX is mandated to mainstream Gender and Development (GAD) in all regional policies, programs, and activities in accordance with the Constitution, the Magna Carta of Women (RA 9710), and PCW guidelines, ensuring that science, technology, and innovation initiatives are gender-responsive, inclusive, and equitable. DOST IX shall promote equal access and participation of women and men in science, research, innovation, and technology transfer; address region-specific gender issues, particularly among marginalized sectors; ensure a safe and respectful workplace; and institutionalize GAD mechanisms.";
const bentoCardClass = "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-400/35 bg-purple-900/55 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint] transition-[border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none lg:p-5 [@media(hover:hover)_and_(pointer:fine)]:hover:border-purple-400/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-purple-900/65";
const headerIntroCardClass$2 = "relative overflow-hidden rounded-2xl border border-purple-400/35 bg-purple-900/55 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint] sm:p-5";
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  ...{
    name: "GadStrategicFrameworkSection"
  },
  __name: "GadStrategicFrameworkSection",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "gad-strategic-framework",
        class: "home-index-section bg-linear-to-b from-purple-950/98 via-fuchsia-950/28 to-purple-950 px-page-gutter",
        "aria-labelledby": "gad-strategic-framework-heading"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$8, { variant: "framework" }, null, _parent));
      _push(`<div class="home-index-section__inner max-w-7xl"><div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6"><article class="${ssrRenderClass([headerIntroCardClass$2, "md:col-span-2"])}"><div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/35 to-transparent" aria-hidden="true"></div><div class="relative z-10 flex flex-col gap-2 sm:gap-3 text-center lg:items-start lg:text-left"><p class="mx-auto inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-950/50 px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-fuchsia-100/90 uppercase ring-1 ring-white/10 lg:mx-0"><span class="size-1.5 shrink-0 rounded-full bg-fuchsia-300/85" aria-hidden="true"></span> Institutional foundation </p><div class="space-y-4"><h2 id="gad-strategic-framework-heading" data-focus-anchor="true" tabindex="-1" class="text-2xl font-semibold tracking-tight text-purple-100 sm:text-3xl md:text-4xl"> Strategic <span class="text-fuchsia-300/90">Framework</span></h2><p class="mx-auto max-w-2xl text-base leading-relaxed text-purple-200/85 sm:text-lg lg:mx-0"> The foundation of our commitment to gender-responsive science, technology, and innovation. </p></div></div></article><article class="${ssrRenderClass([bentoCardClass, "md:col-span-2"])}"><div class="relative z-10 mb-3 md:mb-4"><h3 class="font-sans text-4xl font-bold tracking-tighter text-purple-100 sm:text-5xl lg:text-6xl"> Mandate. </h3></div><div class="relative z-10 lg:max-w-[85%]"><p class="text-base font-light leading-relaxed tracking-tight text-purple-100/90 sm:text-lg">${ssrInterpolate(MANDATE_TEXT)}</p></div></article><article class="${ssrRenderClass(bentoCardClass)}"><div class="relative z-10 mb-3 flex flex-col items-start gap-4 md:mb-4"><h3 class="font-sans text-4xl font-bold tracking-tighter text-purple-100 sm:text-5xl">Vision.</h3></div><div class="relative z-10"><p class="text-base font-light leading-relaxed tracking-tight text-purple-100/90 sm:text-lg"> Gender-responsive science, technology, and Innovation (STI) for inclusive development. </p></div></article><article class="${ssrRenderClass(bentoCardClass)}"><div class="relative z-10 mb-3 flex flex-col items-start gap-4 md:mb-4"><h3 class="font-sans text-4xl font-bold tracking-tighter text-purple-100 sm:text-5xl">Mission.</h3></div><div class="relative z-10"><p class="text-base font-light leading-relaxed tracking-tight text-purple-100/90 sm:text-lg"> Advances gender-responsive science, technology and innovation that empowers people and drives inclusive, sustainable development. </p></div></article><article class="${ssrRenderClass([bentoCardClass, "md:col-span-2"])}"><div class="relative z-10 mb-3 md:mb-4"><h3 class="font-sans text-4xl font-bold tracking-tighter text-purple-100 sm:text-5xl lg:text-6xl">Goals.</h3></div><div class="relative z-10"><ol class="list-decimal space-y-3 pl-4 text-base font-light leading-relaxed text-purple-100/90 marker:text-fuchsia-300/70 sm:text-lg"><li>To build robust gender-responsive institutional policies.</li><li>To capacitate all DOST-IX employees on Gender and Development through continuous training and learning initiatives.</li><li>Establish and maintain strategic partnerships with LGUs, academe, private sector, and civil society.</li><li>To mainstream gender and development in all programs, activities, and projects, ensuring equitable outcomes.</li></ol></div></article></div></div></section>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/home/GadStrategicFrameworkSection.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const heroVideoActiveOpacityClass = "opacity-50";
const heroVideoClass = "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:opacity-0! motion-reduce:transition-none";
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  ...{
    name: "HeroSection"
  },
  __name: "HeroSection",
  __ssrInlineRender: true,
  emits: ["scrollToYears", "scrollToOrgChart"],
  setup(__props) {
    const heroVideoSources = ["/video/video1.mp4", "/video/video2.mp4"];
    const heroVideoOneRef = ref(null);
    const heroVideoTwoRef = ref(null);
    const activeVideoIndex = ref(0);
    const isPageVisible = ref(true);
    const isHeroInView = ref(true);
    let reducedMotionQuery = null;
    let heroVisibilityObserver = null;
    const prefersReducedMotion = () => reducedMotionQuery?.matches ?? false;
    const shouldPlayHeroVideos = () => {
      return !prefersReducedMotion() && isPageVisible.value && isHeroInView.value;
    };
    const getHeroVideos = () => {
      return [heroVideoOneRef.value, heroVideoTwoRef.value].filter(
        (video) => video !== null
      );
    };
    const pauseAndResetVideo = (video) => {
      video.pause();
      video.currentTime = 0;
    };
    const playVideo = (video) => {
      void video.play().catch(() => {
      });
    };
    const syncHeroVideoPlayback = () => {
      const videos = getHeroVideos();
      if (!shouldPlayHeroVideos()) {
        videos.forEach(pauseAndResetVideo);
        return;
      }
      videos.forEach((video, index) => {
        if (index === activeVideoIndex.value) {
          playVideo(video);
          return;
        }
        pauseAndResetVideo(video);
      });
    };
    const onVisibilityChange = () => {
      isPageVisible.value = document.visibilityState === "visible";
      syncHeroVideoPlayback();
    };
    const onReducedMotionChange = () => {
      if (prefersReducedMotion()) {
        activeVideoIndex.value = 0;
      }
      syncHeroVideoPlayback();
    };
    onMounted(() => {
      reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedMotionQuery.addEventListener("change", onReducedMotionChange);
      document.addEventListener("visibilitychange", onVisibilityChange);
      const heroSection = heroVideoOneRef.value?.closest("section");
      if (heroSection) {
        heroVisibilityObserver = new IntersectionObserver(
          (entries) => {
            isHeroInView.value = entries[0]?.isIntersecting ?? false;
            syncHeroVideoPlayback();
          },
          { threshold: 0.12 }
        );
        heroVisibilityObserver.observe(heroSection);
      }
      syncHeroVideoPlayback();
    });
    onBeforeUnmount(() => {
      reducedMotionQuery?.removeEventListener("change", onReducedMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      heroVisibilityObserver?.disconnect();
      heroVisibilityObserver = null;
      getHeroVideos().forEach(pauseAndResetVideo);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        "aria-labelledby": "hero-heading",
        class: "home-index-section--hero relative isolate bg-linear-to-b from-purple-950 via-purple-950/98 to-fuchsia-950/35"
      }, _attrs))}><div class="absolute inset-0 -z-10 overflow-hidden contain-[paint]" aria-hidden="true"><div class="absolute inset-0"><video${ssrRenderAttr("src", heroVideoSources[0])} class="${ssrRenderClass([
        heroVideoClass,
        activeVideoIndex.value === 0 ? ["z-1", heroVideoActiveOpacityClass] : "z-0 opacity-0"
      ])}" muted playsinline autoplay preload="metadata" disablepictureinpicture disableremoteplayback tabindex="-1"></video><video${ssrRenderAttr("src", heroVideoSources[1])} class="${ssrRenderClass([
        heroVideoClass,
        activeVideoIndex.value === 1 ? ["z-1", heroVideoActiveOpacityClass] : "z-0 opacity-0"
      ])}" muted playsinline preload="none" disablepictureinpicture disableremoteplayback tabindex="-1"></video></div><div class="absolute inset-0 bg-linear-to-b from-purple-950/88 via-purple-950/72 to-fuchsia-950/55"></div><div aria-hidden="true" class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,38,211,0.16),transparent_72%)]"></div><div aria-hidden="true" class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[64px_64px] opacity-50"></div></div><div class="px-page-gutter relative z-10 mx-auto w-full max-w-5xl text-center"><div class="flex flex-col items-center gap-4 py-8"><div class="flex flex-col items-center"><p class="mb-1.5 text-sm font-semibold tracking-widest text-fuchsia-300/90 uppercase md:mb-2"> Department of Science and Technology Region IX </p><h1 id="hero-heading" class="m-0 text-[clamp(1.5rem,4.5vw+0.5rem,4.5rem)] font-semibold leading-tight tracking-tighter text-balance text-purple-100"> Gender and Development Corner </h1><p class="mt-3 max-w-[55ch] text-lg leading-relaxed text-purple-200/80 sm:mt-4 sm:text-xl md:mt-5"> Discover how our projects drive gender equality, women&#39;s empowerment, and inclusive development through science and technology. </p></div><div class="mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row"></div></div></div></section>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/home/HeroSection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  ...{
    name: "HomeTopNav"
  },
  __name: "HomeTopNav",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const user = computed(() => page.props.auth?.user);
    const reportYearsIndexUrl = computed(() => route("report-years.index"));
    const flushLogout = () => {
      router.flushAll();
    };
    const scrolled = ref(false);
    let observer = null;
    onMounted(() => {
      const sentinel = document.createElement("div");
      sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px;pointer-events:none";
      sentinel.setAttribute("aria-hidden", "true");
      document.body.prepend(sentinel);
      observer = new IntersectionObserver(
        ([entry]) => {
          scrolled.value = !entry.isIntersecting;
        },
        { threshold: 0 }
      );
      observer.observe(sentinel);
    });
    onBeforeUnmount(() => {
      observer?.disconnect();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({
        class: ["home-topnav", { "home-topnav--scrolled": scrolled.value }],
        role: "banner"
      }, _attrs))}><div class="px-safe mx-auto grid w-full max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4"><div class="flex items-center justify-start gap-2.5 sm:gap-3"><img src="/dostlogo.png" alt="DOST Logo" class="h-8 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-9" loading="eager" decoding="async"><img src="/gadlogo.png" alt="GAD Logo" class="h-8 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-9" loading="eager" decoding="async"><img src="/Bagong_Pilipinas_logo.png" alt="Bagong Pilipinas Logo" class="h-8 w-auto max-w-[100px] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-9 sm:max-w-[120px]" loading="eager" decoding="async"></div><nav class="hidden items-center justify-center lg:flex"><div class="home-topnav-pills"><a href="/#gad-strategic-framework" class="home-topnav-pill"> Strategic Framework </a><a href="/#org-chart" class="home-topnav-pill"> Organizational Chart </a><a href="/#yearly" class="home-topnav-pill"> Data Reports </a></div></nav><nav class="flex items-center justify-end gap-2 sm:gap-2.5" aria-label="Site">`);
      if (!user.value) {
        _push(ssrRenderComponent(unref(Link), {
          href: _ctx.route("login"),
          class: "home-topnav-login"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(LogIn), {
                class: "size-4 shrink-0",
                "stroke-width": 1.8,
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>Log in</span>`);
            } else {
              return [
                createVNode(unref(LogIn), {
                  class: "size-4 shrink-0",
                  "stroke-width": 1.8,
                  "aria-hidden": "true"
                }),
                createVNode("span", null, "Log in")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!--[-->`);
        if (user.value?.can?.accessReportYears) {
          _push(ssrRenderComponent(unref(Link), {
            href: reportYearsIndexUrl.value,
            class: "home-topnav-reports-btn inline-flex items-center justify-center"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Reports `);
              } else {
                return [
                  createTextVNode(" Reports ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(unref(Link), {
          class: "home-topnav-logout",
          method: "post",
          href: _ctx.route("logout"),
          onClick: flushLogout,
          as: "button"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(LogOut), {
                class: "size-4 shrink-0",
                "stroke-width": 1.8,
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>Log out</span>`);
            } else {
              return [
                createVNode(unref(LogOut), {
                  class: "size-4 shrink-0",
                  "stroke-width": 1.8,
                  "aria-hidden": "true"
                }),
                createVNode("span", null, "Log out")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</nav></div></header>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/home/HomeTopNav.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const PARENT_NAMES_CHILD_TITLE_HIDDEN = /* @__PURE__ */ new Set(["TWG Members", "Secretariat"]);
function shouldOmitChildTitle(parentName) {
  return parentName !== void 0 && PARENT_NAMES_CHILD_TITLE_HIDDEN.has(parentName);
}
function buildOrgTree(flat) {
  const map = /* @__PURE__ */ new Map();
  for (const row of flat) {
    map.set(row.id, { ...row, children: [] });
  }
  const roots = [];
  for (const row of flat) {
    const node = map.get(row.id);
    if (row.pid === void 0) {
      roots.push(node);
      continue;
    }
    const parent = map.get(row.pid);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
function getGfpsNodes() {
  return [
    { id: 1, name: "ROSEMARIE S. SALAZAR", title: "Chairperson" },
    { id: 2, pid: 1, name: "RICARDO J. APOLINARIO III", title: "Executive Committee — Chairperson" },
    {
      id: 3,
      pid: 1,
      name: "JALI J. BADIOLA",
      title: "Executive Committee — Co-Chairperson; Technical Working Group — Chairperson "
    },
    { id: 4, pid: 3, name: "JENNIFER A. PIDOR", title: "Technical Working Group — Co-Chairperson " },
    { id: 8, pid: 3, name: "TWG Members", title: "Technical Working Group — Members " },
    { id: 9, pid: 8, name: "THELMA E. DIEGO", title: "Member — Technical Working Group " },
    { id: 10, pid: 8, name: "GERARDO F. PAROT", title: "Member — Technical Working Group " },
    { id: 11, pid: 8, name: "NUHMAN M. ALJANI", title: "Member — Technical Working Group " },
    { id: 12, pid: 8, name: "INGRID T. ABELLA-COLCOL", title: "Member — Technical Working Group " },
    { id: 13, pid: 8, name: "TEFFANIE MAE C. REYES", title: "Member — Technical Working Group " },
    { id: 14, pid: 8, name: "RONNEL B. GUNDOY", title: "Member — Technical Working Group " },
    { id: 15, pid: 8, name: "JOSEPHINE B. NOHAY", title: "Member — Technical Working Group " },
    { id: 16, pid: 8, name: "JULIUS T. FOJAS", title: "Member — Technical Working Group " },
    { id: 17, pid: 8, name: "JEYZEL P. APARRI-PAQUIT", title: "Member — Technical Working Group " },
    { id: 18, pid: 8, name: "DORES C. GABO", title: "Member — Technical Working Group " },
    { id: 19, pid: 8, name: "JELYN O. BAYONAS", title: "Member — Technical Working Group " },
    { id: 20, pid: 8, name: "HERMA JOYCE T. ALBURO", title: "Member — Technical Working Group " },
    { id: 21, pid: 8, name: "SHERYL F. JOVENAL", title: "Member — Technical Working Group " },
    { id: 22, pid: 8, name: "KRISTINE MAE R. SARITA", title: "Member — Technical Working Group " },
    { id: 23, pid: 8, name: "MARY GRACE ANTONIO-TORRES", title: "Member — Technical Working Group " },
    { id: 24, pid: 8, name: "IAN C. AVENIDO", title: "Member — Technical Working Group " },
    { id: 25, pid: 8, name: "CHRISTIAN CARL R. RESENTE", title: "Member — Technical Working Group " },
    { id: 26, pid: 8, name: "MARC G. CACHIN", title: "Member — Technical Working Group " },
    { id: 27, pid: 8, name: "KIM R. CARUMBA", title: "Member — Technical Working Group " },
    { id: 28, pid: 8, name: "SHARMAINE V. MORALES", title: "Member — Technical Working Group " },
    { id: 29, pid: 8, name: "CHARISA MAE M. BAIT-IT", title: "Member — Technical Working Group " },
    { id: 30, pid: 8, name: "GRETCHEN D. MANANGAN", title: "Member — Technical Working Group " },
    { id: 31, pid: 8, name: "ELLYSSA MAE A. PENDERGAT-BALUCANAG", title: "Member — Technical Working Group " },
    { id: 32, pid: 8, name: "STENEL RIZZA A. GUILLERMO", title: "Member — Technical Working Group " },
    { id: 33, pid: 8, name: "SHEILA S. BERNARDO", title: "Member — Technical Working Group " },
    { id: 34, pid: 8, name: "MA. ELLAINE M. RAYMAN", title: "Member — Technical Working Group " },
    { id: 35, pid: 8, name: "HERSON SANTIAGO S. FERNANDO Jr.", title: "Member — Technical Working Group " },
    { id: 5, pid: 3, name: "Secretariat", title: "Technical Working Group — Secretariat" },
    { id: 6, pid: 5, name: "MARIEFER T. UTAL", title: "Secretariat " },
    { id: 7, pid: 5, name: "AUBREY A. AMPARO", title: "Secretariat " }
  ];
}
function getMoveNodes() {
  return [
    { id: 1, name: "RONNEL B. GUNDOY", title: "Chairperson" },
    { id: 2, pid: 1, name: "JULIUS T. FOJAS", title: "Co-Chairperson" },
    /* Under Co-Chair: Focal Persons first, then Secretariat (array order defines child order in tree). */
    { id: 3, pid: 2, name: "IAN C. AVENIDO", title: "Focal Person " },
    { id: 4, pid: 2, name: "ROGER DAVE F. GRAMATICA", title: "Focal Person " },
    { id: 5, pid: 2, name: "CHRISTIAN CARL R. RESENTE", title: "Focal Person " },
    { id: 6, pid: 2, name: "MARC G. CACHIN", title: "Focal Person " },
    { id: 7, pid: 2, name: "KIM R. CARUMBA", title: "Focal Person " },
    { id: 8, pid: 2, name: "Secretariat", title: "Secretariat" },
    { id: 9, pid: 8, name: "HERSON SANTIAGO S. FERNANDO Jr.", title: "Secretariat" },
    { id: 10, pid: 8, name: "CRIS-ANGELO B. PRIETO", title: "Secretariat" },
    { id: 11, pid: 8, name: "KYLE ANGELO G. ADAS", title: "Secretariat" }
  ];
}
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  ...{
    name: "OrgTreeBranch"
  },
  __name: "OrgTreeBranch",
  __ssrInlineRender: true,
  props: {
    node: {},
    depth: { default: 0 },
    parentName: {},
    defaultOpen: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const hasChildren = computed(() => props.node.children.length > 0);
    const isOpen = ref(
      props.defaultOpen ?? (props.depth === 0 ? false : props.node.children.length > 6 ? false : props.depth < 2)
    );
    const level = computed(() => Math.min(props.depth, 3));
    const levelClass = computed(() => {
      switch (level.value) {
        case 0:
          return {
            card: "border border-purple-400/40 bg-purple-800/45 ring-1 ring-white/10",
            name: "text-sm font-semibold tracking-tight text-purple-50 sm:text-base",
            title: "text-xs leading-snug text-purple-200/85 sm:text-sm",
            roleOnly: "text-sm font-medium leading-snug text-purple-100 sm:text-base"
          };
        case 1:
          return {
            card: "border border-purple-400/32 bg-purple-900/40 ring-1 ring-white/8",
            name: "text-xs font-semibold tracking-tight text-purple-50 sm:text-sm",
            title: "text-[11px] leading-snug text-purple-200/75 sm:text-xs",
            roleOnly: "text-xs font-medium leading-snug text-purple-100/90 sm:text-sm"
          };
        case 2:
          return {
            card: "border border-purple-400/28 bg-purple-950/45 ring-1 ring-white/6",
            name: "text-[11px] font-semibold text-purple-50 sm:text-xs",
            title: "text-[10px] leading-snug text-purple-200/70 sm:text-[11px]",
            roleOnly: "text-[11px] font-medium leading-snug text-purple-100/85 sm:text-xs"
          };
        default:
          return {
            card: "border border-purple-500/25 bg-purple-950/40 ring-1 ring-white/5",
            name: "text-[10px] font-medium text-purple-100 sm:text-[11px]",
            title: "text-[9px] leading-snug text-purple-200/65 sm:text-[10px]",
            roleOnly: "text-[10px] font-medium leading-snug text-purple-200/80 sm:text-[11px]"
          };
      }
    });
    const wideChildLayout = computed(() => props.node.children.length > 8);
    const childrenPanelId = computed(() => `org-branch-children-${props.node.id}`);
    const positionLabel = computed(() => props.node.title.trim());
    const showDetail = computed(() => !hasChildren.value || isOpen.value);
    const showNodeTitle = computed(() => {
      if (!positionLabel.value) {
        return false;
      }
      if (shouldOmitChildTitle(props.parentName)) {
        return false;
      }
      return positionLabel.value.toLowerCase() !== props.node.name.trim().toLowerCase();
    });
    const toggleLabel = computed(() => {
      if (!hasChildren.value) {
        return "";
      }
      return isOpen.value ? `Collapse ${positionLabel.value || props.node.name}` : `Expand ${positionLabel.value || props.node.name}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_OrgTreeBranch = resolveComponent("OrgTreeBranch", true);
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "org-branch w-full text-left" }, _attrs))}><div class="${ssrRenderClass([
        "org-node-card rounded-xl transition-[border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
        levelClass.value.card,
        hasChildren.value ? "p-0" : "px-4 py-3 sm:px-5 sm:py-3.5"
      ])}">`);
      if (hasChildren.value) {
        _push(`<div class="flex w-full items-stretch gap-0"><button type="button" class="touch-target flex shrink-0 items-center justify-center self-stretch rounded-l-xl border-r border-purple-400/25 px-3 text-purple-100 transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-purple-800/50 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950"${ssrRenderAttr("aria-expanded", isOpen.value)}${ssrRenderAttr("aria-controls", childrenPanelId.value)}${ssrRenderAttr("aria-label", toggleLabel.value)}>`);
        _push(ssrRenderComponent(unref(ChevronRight), {
          class: ["size-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none", { "rotate-90": isOpen.value }],
          "stroke-width": "2",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button><div class="min-w-0 flex-1 px-4 py-3 sm:px-5 sm:py-3.5">`);
        if (!showDetail.value) {
          _push(`<p class="${ssrRenderClass(levelClass.value.roleOnly)}">${ssrInterpolate(positionLabel.value)}</p>`);
        } else {
          _push(`<!--[--><p class="${ssrRenderClass(levelClass.value.name)}">${ssrInterpolate(__props.node.name)}</p>`);
          if (showNodeTitle.value) {
            _push(`<p class="${ssrRenderClass([levelClass.value.title, "mt-1"])}">${ssrInterpolate(positionLabel.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!--[--><p class="${ssrRenderClass(levelClass.value.name)}">${ssrInterpolate(__props.node.name)}</p>`);
        if (showNodeTitle.value) {
          _push(`<p class="${ssrRenderClass([levelClass.value.title, "mt-1"])}">${ssrInterpolate(positionLabel.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div>`);
      if (hasChildren.value) {
        _push(`<div${ssrRenderAttr("id", childrenPanelId.value)} class="org-branch-children" style="${ssrRenderStyle(isOpen.value ? null : { display: "none" })}">`);
        if (wideChildLayout.value) {
          _push(`<ul class="m-0 mt-4 grid list-none grid-cols-1 gap-2.5 border-l-2 border-dotted border-purple-400/45 pl-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:pl-5"><!--[-->`);
          ssrRenderList(__props.node.children, (child) => {
            _push(`<li class="list-none min-w-0">`);
            _push(ssrRenderComponent(_component_OrgTreeBranch, {
              node: child,
              depth: __props.depth + 1,
              "parent-name": __props.node.name
            }, null, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<ul class="m-0 mt-3 list-none space-y-3 border-l-2 border-purple-400/40 pl-3 sm:mt-4 sm:space-y-4 sm:pl-5"><!--[-->`);
          ssrRenderList(__props.node.children, (child) => {
            _push(`<li class="list-none min-w-0">`);
            _push(ssrRenderComponent(_component_OrgTreeBranch, {
              node: child,
              depth: __props.depth + 1,
              "parent-name": __props.node.name
            }, null, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/home/OrgTreeBranch.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const headerIntroCardClass$1 = "relative overflow-hidden rounded-2xl border border-purple-400/35 bg-purple-900/55 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint] sm:p-5";
const chartPanelClass = "relative overflow-hidden rounded-2xl border border-purple-400/35 bg-purple-900/55 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint]";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  ...{
    name: "OrganizationalChartSection"
  },
  __name: "OrganizationalChartSection",
  __ssrInlineRender: true,
  setup(__props) {
    const gfpsTree = computed(() => buildOrgTree(getGfpsNodes()));
    const moveTree = computed(() => buildOrgTree(getMoveNodes()));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "org-chart",
        class: "home-index-section bg-linear-to-b from-purple-950/95 via-fuchsia-950/38 to-purple-950 px-page-gutter",
        "aria-labelledby": "org-chart-heading"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$8, { variant: "org" }, null, _parent));
      _push(`<div class="home-index-section__inner max-w-7xl"><article class="${ssrRenderClass(headerIntroCardClass$1)}"><div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/35 to-transparent" aria-hidden="true"></div><div class="relative z-10 flex flex-col gap-2 sm:gap-3 text-center lg:items-start lg:text-left"><p class="mx-auto inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-950/50 px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-fuchsia-100/90 uppercase ring-1 ring-white/10 lg:mx-0"><span class="size-1.5 shrink-0 rounded-full bg-fuchsia-300/85" aria-hidden="true"></span> Governance structure </p><div class="space-y-4"><h2 id="org-chart-heading" data-focus-anchor="true" tabindex="-1" class="text-2xl font-semibold tracking-tight text-purple-100 sm:text-3xl md:text-4xl"> Organizational <span class="text-fuchsia-300/90">Chart</span></h2><p class="mx-auto max-w-2xl text-base leading-relaxed text-purple-200/85 sm:text-lg lg:mx-0"> DOST Region IX leadership for gender mainstreaming and MOVE advocacy. Use the tree below to browse roles and names. </p></div><p class="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-950/40 px-3 py-1.5 text-xs font-medium text-purple-100/85 ring-1 ring-white/5 lg:mx-0">`);
      _push(ssrRenderComponent(unref(ListTree), {
        class: "size-3.5 shrink-0 text-fuchsia-300/80",
        "stroke-width": "2",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` Collapsed: role only. Expanded: name and role. </p></div></article><div class="mt-4 flex flex-col gap-4 sm:mt-6 lg:gap-6"><article aria-labelledby="gfps-org-heading" class="flex flex-col gap-2 sm:gap-3"><header class="flex flex-col gap-3 text-center lg:items-start lg:text-left"><p class="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-950/45 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-purple-100/90 uppercase ring-1 ring-white/10 lg:mx-0"> GFPS </p><h3 id="gfps-org-heading" class="max-w-3xl text-lg font-semibold tracking-tight text-purple-100 sm:text-xl md:text-2xl"> Gender and Development Focal Point System </h3></header><div class="${ssrRenderClass([chartPanelClass, "p-4 sm:p-5"])}"><ul class="org-tree__root m-0 w-full list-none space-y-6 p-0 lg:space-y-8"><!--[-->`);
      ssrRenderList(gfpsTree.value, (root) => {
        _push(`<li class="list-none">`);
        _push(ssrRenderComponent(_sfc_main$4, {
          node: root,
          depth: 0
        }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></article><article aria-labelledby="move-org-heading" class="flex flex-col gap-2 sm:gap-3"><header class="flex flex-col gap-3 text-center lg:items-start lg:text-left"><p class="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-950/45 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-purple-100/90 uppercase ring-1 ring-white/10 lg:mx-0"> MOVE </p><h3 id="move-org-heading" class="max-w-3xl text-lg font-semibold tracking-tight text-purple-100 sm:text-xl md:text-2xl"> Men Opposed to Violence Against Women Everywhere </h3></header><div class="${ssrRenderClass([chartPanelClass, "p-4 sm:p-5"])}"><ul class="org-tree__root m-0 w-full max-w-3xl list-none space-y-6 p-0 lg:space-y-8"><!--[-->`);
      ssrRenderList(moveTree.value, (root) => {
        _push(`<li class="list-none">`);
        _push(ssrRenderComponent(_sfc_main$4, {
          node: root,
          depth: 0
        }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></article></div></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/home/OrganizationalChartSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  ...{
    name: "YearCard"
  },
  __name: "YearCard",
  __ssrInlineRender: true,
  props: {
    year: {}
  },
  setup(__props) {
    const props = __props;
    const yearTheme = computed(() => {
      const themes = {
        "2025": {
          border: "border-fuchsia-400/35",
          bg: "bg-linear-to-br from-fuchsia-900/40 via-purple-900/50 to-purple-950/60",
          accent: "text-fuchsia-200/90"
        },
        "2026": {
          border: "border-purple-400/35",
          bg: "bg-linear-to-br from-purple-900/45 via-fuchsia-950/35 to-purple-950/60",
          accent: "text-purple-200/90"
        },
        default: {
          border: "border-purple-400/30",
          bg: "bg-linear-to-br from-purple-900/40 via-fuchsia-950/30 to-purple-950/55",
          accent: "text-purple-200/85"
        }
      };
      return themes[props.year.year] ?? themes.default;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: __props.year.href,
        prefetch: "",
        class: [
          "year-card group touch-target tap-highlight-none relative flex min-h-36 flex-col overflow-hidden rounded-xl border p-4 text-left shadow-[0_8px_28px_-12px_rgba(0,0,0,0.45)] ring-1 ring-white/10 contain-[paint] transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 focus-visible:outline-none active:scale-[0.98] sm:min-h-40 sm:p-5",
          yearTheme.value.border,
          yearTheme.value.bg,
          "[@media(hover:hover)_and_(pointer:fine)]:hover:border-purple-400/50"
        ],
        "aria-label": `View ${__props.year.year} sex-disaggregated data report`
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="${ssrRenderClass([
              "text-[0.6875rem] font-semibold tracking-[0.14em] uppercase",
              yearTheme.value.accent
            ])}"${_scopeId}> Annual report </p><h3 class="mt-2 font-sans text-3xl font-bold tracking-tighter text-purple-50 sm:text-4xl"${_scopeId}>${ssrInterpolate(__props.year.year)}</h3>`);
            if (__props.year.description) {
              _push2(`<p class="mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-purple-200/80"${_scopeId}>${ssrInterpolate(__props.year.description)}</p>`);
            } else {
              _push2(`<p class="mt-1.5 flex-1 text-sm text-purple-200/60"${_scopeId}> Open the full report for indicators, activities, and outcomes. </p>`);
            }
            _push2(`<span class="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-fuchsia-200/90 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:gap-2 motion-reduce:transition-none"${_scopeId}> View report `);
            _push2(ssrRenderComponent(unref(ArrowUpRight), {
              class: "size-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none",
              "stroke-width": "2",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(`</span>`);
          } else {
            return [
              createVNode("p", {
                class: [
                  "text-[0.6875rem] font-semibold tracking-[0.14em] uppercase",
                  yearTheme.value.accent
                ]
              }, " Annual report ", 2),
              createVNode("h3", { class: "mt-2 font-sans text-3xl font-bold tracking-tighter text-purple-50 sm:text-4xl" }, toDisplayString(__props.year.year), 1),
              __props.year.description ? (openBlock(), createBlock("p", {
                key: 0,
                class: "mt-1.5 line-clamp-3 flex-1 text-sm leading-relaxed text-purple-200/80"
              }, toDisplayString(__props.year.description), 1)) : (openBlock(), createBlock("p", {
                key: 1,
                class: "mt-1.5 flex-1 text-sm text-purple-200/60"
              }, " Open the full report for indicators, activities, and outcomes. ")),
              createVNode("span", { class: "mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-fuchsia-200/90 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:gap-2 motion-reduce:transition-none" }, [
                createTextVNode(" View report "),
                createVNode(unref(ArrowUpRight), {
                  class: "size-3.5 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none",
                  "stroke-width": "2",
                  "aria-hidden": "true"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/home/YearCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const headerIntroCardClass = "relative overflow-hidden rounded-2xl border border-purple-400/35 bg-purple-900/55 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint] sm:p-5";
const reportsPanelClass = "relative overflow-hidden rounded-2xl border border-purple-400/35 bg-purple-900/40 p-4 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/10 contain-[paint] sm:p-5 md:p-6";
const emptyStateClass = "relative overflow-hidden rounded-2xl border border-dashed border-purple-400/30 bg-purple-950/50 px-6 py-8 text-center shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)] ring-1 ring-white/5 sm:py-10";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  ...{
    name: "YearlySection"
  },
  __name: "YearlySection",
  __ssrInlineRender: true,
  props: {
    years: {}
  },
  setup(__props) {
    const props = __props;
    const sortedYears = computed(() => [...props.years].sort((a, b) => Number(b.year) - Number(a.year)));
    const reportCount = computed(() => props.years.length);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "yearly",
        class: "home-index-section bg-linear-to-b from-purple-950/98 via-fuchsia-950/28 to-purple-950 px-page-gutter",
        "aria-labelledby": "yearly-heading"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$8, { variant: "yearly" }, null, _parent));
      _push(`<div class="home-index-section__inner max-w-7xl"><article class="${ssrRenderClass(headerIntroCardClass)}"><div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/35 to-transparent" aria-hidden="true"></div><div class="relative z-10 flex flex-col gap-2 sm:gap-3 text-center lg:items-start lg:text-left"><p class="mx-auto inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-950/50 px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-fuchsia-100/90 uppercase ring-1 ring-white/10 lg:mx-0"><span class="size-1.5 shrink-0 rounded-full bg-fuchsia-300/85" aria-hidden="true"></span> Annual reporting </p><div class="space-y-4"><h2 id="yearly-heading" data-focus-anchor="true" tabindex="-1" class="text-2xl font-semibold tracking-tight text-purple-100 sm:text-3xl md:text-4xl"> Sex-Disaggregated Data <span class="text-fuchsia-300/90">Reports</span></h2><p class="mx-auto max-w-2xl text-base leading-relaxed text-purple-200/85 sm:text-lg lg:mx-0"> Browse yearly GAD reports documenting programs, outcomes, and progress toward gender equality across DOST Region IX. </p></div>`);
      if (reportCount.value > 0) {
        _push(`<p class="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-950/40 px-3 py-1.5 text-xs font-medium text-purple-100/85 ring-1 ring-white/5 lg:mx-0">`);
        _push(ssrRenderComponent(unref(FileBarChart2), {
          class: "size-3.5 shrink-0 text-fuchsia-300/80",
          "stroke-width": "2",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` ${ssrInterpolate(reportCount.value)} ${ssrInterpolate(reportCount.value === 1 ? "report" : "reports")} available </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></article><div class="mt-6 sm:mt-8">`);
      if (reportCount.value === 0) {
        _push(`<div class="${ssrRenderClass(emptyStateClass)}"><p class="text-base font-medium text-purple-100">No reports published yet</p><p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-purple-200/75"> Yearly sex-disaggregated data reports will appear here once they are added. </p></div>`);
      } else {
        _push(`<article class="${ssrRenderClass(reportsPanelClass)}" aria-label="Yearly report archive"><div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fuchsia-300/20 to-transparent" aria-hidden="true"></div><ul class="relative z-10 m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"><!--[-->`);
        ssrRenderList(sortedYears.value, (year) => {
          _push(`<li class="list-none min-w-0">`);
          _push(ssrRenderComponent(_sfc_main$2, { year }, null, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></article>`);
      }
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/home/YearlySection.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "IndexPage"
  },
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    years: {}
  },
  setup(__props) {
    const scrollToYears = () => {
      const section = document.getElementById("yearly");
      if (!section) return;
      window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
      setTimeout(() => {
        const focusable = section.querySelector('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
      }, 600);
    };
    const scrollToOrgChart = () => {
      const section = document.getElementById("org-chart");
      if (!section) return;
      window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
      setTimeout(() => {
        const focusable = section.querySelector('[data-focus-anchor="true"]');
        focusable?.focus({ preventScroll: true });
      }, 600);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Home" }, null, _parent));
      _push(`<div class="flex min-h-dvh min-w-0 flex-col"><div class="pb-safe min-w-0 flex-1 bg-purple-950 text-purple-50 [color-scheme:dark]">`);
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$6, {
        onScrollToYears: scrollToYears,
        onScrollToOrgChart: scrollToOrgChart
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$7, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { years: __props.years }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$9, null, null, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
