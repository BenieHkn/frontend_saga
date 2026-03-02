import { _ as _sfc_main$1, a as __nuxt_component_1 } from './Sidebar-DuQZxarO.mjs';
import { W as __nuxt_component_2, n as navigateTo } from './server.mjs';
import { ref, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useAuth } from './useAuth-D9Skuklz.mjs';
import './Modal-EvFvX6Ng.mjs';
import './transition-CRUjHQk-.mjs';
import './portal-Bh2KnJSN.mjs';
import './focus-management-CclPs0xY.mjs';
import './keyboard-BCt0ZeLv.mjs';
import './use-outside-click-BqFFeIfQ.mjs';
import './hidden-e5tlhUcy.mjs';
import './active-element-history-Cer4cSOw.mjs';
import './micro-task-B6uncIso.mjs';
import './open-closed-DaveoKA1.mjs';
import './description-BSAkQQqZ.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'ipx';
import 'node:path';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './interval-B7_Jhm6S.mjs';

const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const isSidebarExpanded = ref(true);
    const handleSidebarToggle = (state) => {
      isSidebarExpanded.value = state;
    };
    const route = useRoute();
    useAuth();
    const adminOnlyRoutes = ["/entites", "/utilisateurs", "/point-critique", "/interim"];
    const checkAdminAccess = () => {
      const isAdminRoute = adminOnlyRoutes.some((r) => route.path === r || route.path.startsWith(r + "/"));
      if (isAdminRoute && true) {
        return navigateTo("/");
      }
    };
    watch(() => route.path, () => {
      checkAdminAccess();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = _sfc_main$1;
      const _component_Sidebar = __nuxt_component_1;
      const _component_UNotifications = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Header, { class: "z-[50]" }, null, _parent));
      _push(ssrRenderComponent(_component_Sidebar, { onSidebarToggle: handleSidebarToggle }, null, _parent));
      _push(`<div class=""><main class="${ssrRenderClass([
        "transition-all duration-300 ease-in-out",
        isSidebarExpanded.value ? "lg:ml-64" : "lg:ml-20",
        "ml-20"
      ])}"><div class="p-2 lg:p-2">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(_component_UNotifications, null, null, _parent));
      _push(`</div></main></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-qtNPBAJB.mjs.map
