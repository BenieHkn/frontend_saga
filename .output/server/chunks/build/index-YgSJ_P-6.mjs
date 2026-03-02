import { r as useToast, c as __nuxt_component_0$2, d as __nuxt_component_1 } from './server.mjs';
import { defineAsyncComponent, ref, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-D9Skuklz.mjs';
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

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const AllCourriers = defineAsyncComponent(
      () => import('./AllCourriers-DXCMR-Li.mjs')
    );
    const AffectationsListe = defineAsyncComponent(
      () => import('./MyDocuments-C_QfQrXS.mjs')
    );
    const { voitTousCourriers, isSA } = useAuth();
    const selectedFunction = ref(null);
    const isReady = ref(false);
    useToast();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (isReady.value && unref(voitTousCourriers)()) {
        _push(ssrRenderComponent(unref(AllCourriers), null, null, _parent));
      } else if (isReady.value && unref(isSA)()) {
        _push(ssrRenderComponent(unref(AllCourriers), {
          "entite-id": (_a = selectedFunction.value) == null ? void 0 : _a.id
        }, null, _parent));
      } else if (isReady.value && selectedFunction.value) {
        _push(ssrRenderComponent(unref(AffectationsListe), null, null, _parent));
      } else if (!isReady.value) {
        _push(`<div class="flex items-center justify-center min-h-[400px]"><div class="text-center">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-arrow-path",
          class: "w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin"
        }, null, _parent));
        _push(`<p class="text-sm text-gray-600">Chargement...</p></div></div>`);
      } else {
        _push(`<div class="flex items-center justify-center min-h-[400px]"><div class="text-center">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-exclamation-triangle",
          class: "w-12 h-12 text-amber-500 mx-auto mb-4"
        }, null, _parent));
        _push(`<h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune fonction s\xE9lectionn\xE9e</h3><p class="text-sm text-gray-600 mb-4">Veuillez vous reconnecter pour s\xE9lectionner une fonction.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          to: "/connexion",
          icon: "i-heroicons-arrow-right-on-rectangle",
          class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Se reconnecter `);
            } else {
              return [
                createTextVNode(" Se reconnecter ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/documents/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-YgSJ_P-6.mjs.map
