import { _ as _sfc_main$2 } from './PageHeader-NxcDUFJW.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import __nuxt_component_2 from './Card-DtmGMnBU.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ToggleButton",
  __ssrInlineRender: true,
  props: {
    options: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "inline-flex bg-slate-100 p-1.5 rounded-full gap-1" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.options, (option) => {
        _push(`<button type="button" class="${ssrRenderClass([
          "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ease-in-out whitespace-nowrap",
          __props.modelValue === option.value ? "bg-gradient-to-br from-emerald-800 to-blue-800 text-white shadow-sm shadow-blue-500/20" : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
        ])}">${ssrInterpolate(option.label)}</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ToggleButton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const currentFilter = ref("all");
    const filterOptions = [
      { label: "Toutes les Archives", value: "all" },
      { label: "En pr\xE9archivage", value: "pending" },
      { label: "Archived", value: "archived" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageHeader = _sfc_main$2;
      const _component_ToggleButton = _sfc_main$1;
      const _component_UCard = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 p-10 font-sans" }, _attrs))}><div class="max-w-7xl mx-auto">`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "Pr\xE9archivage",
        subtitle: "Gestion des archives"
      }, null, _parent));
      _push(`<div class="mb-8">`);
      _push(ssrRenderComponent(_component_ToggleButton, {
        modelValue: currentFilter.value,
        "onUpdate:modelValue": ($event) => currentFilter.value = $event,
        options: filterOptions
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_UCard, { class: "mt-8 text-center p-10" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<p class="text-slate-500 font-medium"${_scopeId}> Affichage des r\xE9sultats pour le filtre : <span class="font-bold text-blue-600"${_scopeId}>${ssrInterpolate(currentFilter.value)}</span></p>`);
          } else {
            return [
              createVNode("p", { class: "text-slate-500 font-medium" }, [
                createTextVNode(" Affichage des r\xE9sultats pour le filtre : "),
                createVNode("span", { class: "font-bold text-blue-600" }, toDisplayString(currentFilter.value), 1)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/archivage/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BXMVOiEB.mjs.map
