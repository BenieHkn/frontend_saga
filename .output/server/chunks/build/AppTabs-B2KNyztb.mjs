import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { ref, useSSRContext } from 'vue';

const _sfc_main = {
  __name: "AppTabs",
  __ssrInlineRender: true,
  props: {
    tabs: Array,
    default: []
  },
  setup(__props) {
    const props = __props;
    const activeTab = ref(props.tabs[0].id);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="border-b border-slate-200 mb-6"><nav class="flex gap-8" aria-label="Tabs"><!--[-->`);
      ssrRenderList(__props.tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([[
          activeTab.value === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
        ], "pb-4 pt-2 text-sm font-medium transition-all border-b-2"])}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></nav></div><div class="animate-in fade-in duration-300">`);
      ssrRenderSlot(_ctx.$slots, activeTab.value, {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppTabs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AppTabs-B2KNyztb.mjs.map
