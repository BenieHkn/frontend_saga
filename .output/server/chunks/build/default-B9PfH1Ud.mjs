import { _ as _sfc_main$1, a as __nuxt_component_1 } from './Sidebar-CRMV_daG.mjs';
import __nuxt_component_2 from './Notifications-LT-n87-T.mjs';
import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import './index-DJmPz9HS.mjs';
import './server.mjs';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './Button-D4Pv8nAk.mjs';
import './Link-SQZY3OU3.mjs';
import './nuxt-link-aS4hYwbM.mjs';
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import './Icon-BEWG_Jy9.mjs';
import './tooltip-lourJnw0.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './button-Bz5rwL6o.mjs';
import './Modal-BXvFVpvj.mjs';
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
import './interval-B7_Jhm6S.mjs';
import './Notification-DWuJzMBT.mjs';
import './Avatar-BE6on_fb.mjs';
import './index-D7xvw7QP.mjs';
import './index-BLXEZ1Ia.mjs';
import './useToast-VyEsrynn.mjs';

const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const isSidebarExpanded = ref(true);
    const handleSidebarToggle = (state) => {
      isSidebarExpanded.value = state;
    };
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
//# sourceMappingURL=default-B9PfH1Ud.mjs.map
