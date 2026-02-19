import __nuxt_component_0 from './Link-SQZY3OU3.mjs';
import { ref, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { v as useRoute, a as useRouter } from './server.mjs';
import './nuxt-link-aS4hYwbM.mjs';
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
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = {
  __name: "update",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    ref([]);
    const loading = ref(false);
    const showSuccessModal = ref(false);
    const form = ref({
      sigle: "",
      libelle: ""
    });
    const errors = ref({
      sigle: "",
      libelle: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ULink = __nuxt_component_0;
      _push(`<!--[--><div class="space-y-6"><div><h1 class="text-2xl font-bold text-gray-900">MODIFICATION D&#39;UNE FONCTION</h1><p class="text-gray-600 mt-1"></p></div><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pb-16"><form class="space-y-4 max-w-4xl mx-auto"><div class="grid grid-cols-12 gap-4"><div class="col-start-1 col-span-10"><label class="block text-md font-bold text-gray-700 mb-2">Sigle <b class="text-red-700">*</b></label><input${ssrRenderAttr("value", unref(form).sigle)} placeholder="Sigle" class="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12">`);
      if (unref(errors).sigle && unref(form).sigle == "") {
        _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(errors).sigle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="grid grid-cols-12 gap-4"><div class="col-start-1 col-span-10"><label class="block text-md font-bold text-gray-700 mb-2">Libell\xE9 <b class="text-red-700">*</b></label><input${ssrRenderAttr("value", unref(form).libelle)} placeholder="Libell\xE9" class="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12">`);
      if (unref(errors).libelle && unref(form).libelle == "") {
        _push(`<p class="text-red-600 text-sm font-bold mt-1">${ssrInterpolate(unref(errors).libelle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex items-center gap-4 mt-8">`);
      _push(ssrRenderComponent(_component_ULink, {
        to: "/fonctions",
        class: "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ANNULER `);
          } else {
            return [
              createTextVNode(" ANNULER ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded disabled:opacity-50">`);
      if (unref(loading)) {
        _push(`<span>MISE \xC0 JOUR...</span>`);
      } else {
        _push(`<span>MODIFIER</span>`);
      }
      _push(`</button></div></form></div></div>`);
      if (unref(showSuccessModal)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-lg p-12 w-[500px] max-w-[90vw] mx-4"><div class="text-center"><div class="mx-auto w-96 h-16 bg-green-100 rounded-full flex items-center justify-center mb-8"><svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div><h3 class="text-2xl font-semibold text-gray-900 mb-4">Succ\xE8s !</h3><p class="text-xl text-gray-600 mb-8">La fonction a \xE9t\xE9 modifi\xE9e avec succ\xE8s</p>`);
        _push(ssrRenderComponent(_component_ULink, {
          to: "/fonctions",
          class: "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-lg max-w-2xl mx-auto"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` OK `);
            } else {
              return [
                createTextVNode(" OK ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/fonctions/update.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=update-C5G7ajBQ.mjs.map
