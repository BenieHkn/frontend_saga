import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../_/nitro.mjs';
import { _ as _export_sfc, c as useRuntimeConfig } from './server.mjs';
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

const _imports_0 = publicAssetsURL("/images/logo_saga.png");
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    console.log("LARAVEL API URL:", config.public.laravelApiUrl);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-900 overflow-hidden" }, _attrs))} data-v-a2f1d0b6><div class="absolute top-[-10%] left-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" data-v-a2f1d0b6></div><div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" data-v-a2f1d0b6></div><div class="flex flex-col items-center justify-center gap-10 z-10" data-v-a2f1d0b6><div class="relative flex items-center justify-center" data-v-a2f1d0b6><div class="absolute w-48 h-48 border-2 border-white/5 rounded-full" data-v-a2f1d0b6></div><div class="absolute w-48 h-48 border-t-2 border-emerald-400 rounded-full animate-spin-slow" data-v-a2f1d0b6></div><div class="absolute w-40 h-40 border-b-2 border-blue-400 rounded-full animate-spin-reverse" data-v-a2f1d0b6></div><div class="relative p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl scale-110" data-v-a2f1d0b6><img${ssrRenderAttr("src", _imports_0)} alt="Logo SAGA" class="w-20 h-20 object-contain" data-v-a2f1d0b6></div></div><div class="text-center" data-v-a2f1d0b6><h1 class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-2 tracking-tighter" data-v-a2f1d0b6> SAGA </h1><p class="text-sm font-medium text-blue-200/60 tracking-[0.5em] uppercase" data-v-a2f1d0b6> Revolution </p></div><div class="flex items-center gap-3 px-6 py-2 bg-black/20 rounded-full border border-white/5" data-v-a2f1d0b6><div class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" data-v-a2f1d0b6></div><p class="text-emerald-100/70 text-xs font-medium uppercase letter-spacing-wide" data-v-a2f1d0b6>Chargement...</p></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a2f1d0b6"]]);

export { index as default };
//# sourceMappingURL=index-BXcKAyVm.mjs.map
