import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { ZiggyVue } from "ziggy-js";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "DOST IX GAD CORNER";
createServer(
  (page) => createInertiaApp({
    page,
    render: renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: resolvePage,
    setup: ({ App, props, plugin }) => createSSRApp({ render: () => h(App, props) }).use(plugin).use(ZiggyVue, {
      ...page.props.ziggy,
      location: new URL(page.props.ziggy.location)
    })
  }),
  { cluster: true }
);
function resolvePage(name) {
  const pages = /* @__PURE__ */ Object.assign({ "./pages/Index.vue": () => import("./assets/Index-C7J-Xc-v.js"), "./pages/auth/Login.vue": () => import("./assets/Login-DubY-LBf.js"), "./pages/reports/Create.vue": () => import("./assets/Create-BITV9bkD.js"), "./pages/reports/Edit.vue": () => import("./assets/Edit-7G3b6V0Q.js"), "./pages/reports/Index.vue": () => import("./assets/Index-BF_whE94.js"), "./pages/reports/Print.vue": () => import("./assets/Print-IGzyqDfb.js"), "./pages/reports/Show.vue": () => import("./assets/Show-Bo57wN29.js").then((n) => n.S), "./pages/settings/Password.vue": () => import("./assets/Password-B8kGrz8_.js"), "./pages/settings/Profile.vue": () => import("./assets/Profile-ClLsYQkb.js") });
  return resolvePageComponent(`./pages/${name}.vue`, pages);
}
