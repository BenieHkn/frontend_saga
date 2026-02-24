import { a as __nuxt_component_0$4 } from './server.mjs';
import { mergeProps, withCtx, createBlock, createTextVNode, openBlock, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = {
  __name: "PageHeader",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    to: { type: String, default: null },
    btnText: { type: String, default: "Nouveau" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-green-900 tracking-tight">${ssrInterpolate(__props.title)}</h1>`);
      if (__props.subtitle) {
        _push(`<p class="text-sm text-slate-500">${ssrInterpolate(__props.subtitle)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.to) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.to,
          class: "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-md shadow-indigo-200 hover:translate-y-[-1px] hover:shadow-lg transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"${_scopeId}><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z" clip-rule="evenodd"${_scopeId}></path></svg> ${ssrInterpolate(__props.btnText)}`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5",
                  viewBox: "0 0 20 20",
                  fill: "currentColor"
                }, [
                  createVNode("path", {
                    "fill-rule": "evenodd",
                    d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z",
                    "clip-rule": "evenodd"
                  })
                ])),
                createTextVNode(" " + toDisplayString(__props.btnText), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PageHeader.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=PageHeader-NxcDUFJW.mjs.map
