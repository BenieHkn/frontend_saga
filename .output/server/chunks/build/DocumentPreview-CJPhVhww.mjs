import __nuxt_component_0 from './Modal-BXvFVpvj.mjs';
import __nuxt_component_0$1 from './Icon-BEWG_Jy9.mjs';
import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import { ref, computed, watch, mergeProps, withCtx, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  __name: "DocumentPreview",
  __ssrInlineRender: true,
  props: {
    selectedFile: { type: Object, default: null },
    filePreviewUrl: { type: String, default: null }
  },
  setup(__props) {
    const props = __props;
    const isOpen = ref(false);
    const zoomLevel = ref(1);
    const isPDF = computed(() => {
      var _a, _b;
      return (_b = (_a = props.selectedFile) == null ? void 0 : _a.name) == null ? void 0 : _b.toLowerCase().endsWith(".pdf");
    });
    const isImage = computed(() => {
      var _a, _b;
      const name = ((_b = (_a = props.selectedFile) == null ? void 0 : _a.name) == null ? void 0 : _b.toLowerCase()) || "";
      return ["jpg", "jpeg", "png", "webp"].some((ext) => name.endsWith(ext));
    });
    const changeZoom = (delta) => {
      const newZoom = zoomLevel.value + delta;
      if (newZoom >= 0.3 && newZoom <= 2) {
        zoomLevel.value = parseFloat(newZoom.toFixed(1));
      }
    };
    const downloadFile = () => {
      if (!props.filePreviewUrl) return;
      const link = (void 0).createElement("a");
      link.href = props.filePreviewUrl;
      link.download = props.selectedFile.name;
      link.click();
    };
    watch(() => props.selectedFile, () => {
      zoomLevel.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = __nuxt_component_0;
      const _component_UIcon = __nuxt_component_0$1;
      const _component_UButton = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full font-sans" }, _attrs))} data-v-48a555cc>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: isOpen.value,
        "onUpdate:modelValue": ($event) => isOpen.value = $event,
        ui: { width: "sm:max-w-6xl", height: "h-[95vh]" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="flex flex-col h-full bg-slate-100 dark:bg-zinc-950 overflow-hidden relative" data-v-48a555cc${_scopeId}><div class="flex justify-between items-center px-6 py-3 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shrink-0" data-v-48a555cc${_scopeId}><div class="flex items-center gap-3" data-v-48a555cc${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: isPDF.value ? "i-heroicons-document-text" : "i-heroicons-photo",
              class: "text-primary-600 w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm font-bold truncate max-w-[300px]" data-v-48a555cc${_scopeId}>${ssrInterpolate((_a = props.selectedFile) == null ? void 0 : _a.name)}</span></div><div class="flex items-center gap-2" data-v-48a555cc${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-arrow-down-tray",
              color: "gray",
              variant: "ghost",
              onClick: downloadFile
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-x-mark",
              color: "gray",
              variant: "ghost",
              onClick: ($event) => isOpen.value = false,
              class: "rounded-full"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex-1 overflow-auto p-4 md:p-10 flex justify-center bg-slate-200/50 dark:bg-zinc-900/50" data-v-48a555cc${_scopeId}><div class="transition-transform duration-200 ease-out origin-top shadow-2xl bg-white" style="${ssrRenderStyle({ transform: `scale(${zoomLevel.value})`, width: isPDF.value ? "100%" : "auto" })}" data-v-48a555cc${_scopeId}>`);
            if (isPDF.value && __props.filePreviewUrl) {
              _push2(`<iframe${ssrRenderAttr("src", `${__props.filePreviewUrl}#toolbar=0&navpanes=0`)} class="w-full min-h-[80vh]" frameborder="0" data-v-48a555cc${_scopeId}></iframe>`);
            } else if (isImage.value) {
              _push2(`<img${ssrRenderAttr("src", __props.filePreviewUrl)} class="max-w-full" data-v-48a555cc${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xl border border-slate-200 dark:border-zinc-700" data-v-48a555cc${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-minus",
              size: "xs",
              color: "gray",
              variant: "ghost",
              onClick: ($event) => changeZoom(-0.1)
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-[10px] font-mono font-black w-10 text-center" data-v-48a555cc${_scopeId}>${ssrInterpolate(Math.round(zoomLevel.value * 100))}%</span>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-plus",
              size: "xs",
              color: "gray",
              variant: "ghost",
              onClick: ($event) => changeZoom(0.1)
            }, null, _parent2, _scopeId));
            _push2(`<div class="w-[1px] h-3 bg-slate-300 mx-1" data-v-48a555cc${_scopeId}></div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-arrow-path",
              size: "xs",
              color: "gray",
              variant: "ghost",
              onClick: ($event) => zoomLevel.value = 1
            }, null, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col h-full bg-slate-100 dark:bg-zinc-950 overflow-hidden relative" }, [
                createVNode("div", { class: "flex justify-between items-center px-6 py-3 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shrink-0" }, [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode(_component_UIcon, {
                      name: isPDF.value ? "i-heroicons-document-text" : "i-heroicons-photo",
                      class: "text-primary-600 w-5 h-5"
                    }, null, 8, ["name"]),
                    createVNode("span", { class: "text-sm font-bold truncate max-w-[300px]" }, toDisplayString((_b = props.selectedFile) == null ? void 0 : _b.name), 1)
                  ]),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode(_component_UButton, {
                      icon: "i-heroicons-arrow-down-tray",
                      color: "gray",
                      variant: "ghost",
                      onClick: downloadFile
                    }),
                    createVNode(_component_UButton, {
                      icon: "i-heroicons-x-mark",
                      color: "gray",
                      variant: "ghost",
                      onClick: ($event) => isOpen.value = false,
                      class: "rounded-full"
                    }, null, 8, ["onClick"])
                  ])
                ]),
                createVNode("div", { class: "flex-1 overflow-auto p-4 md:p-10 flex justify-center bg-slate-200/50 dark:bg-zinc-900/50" }, [
                  createVNode("div", {
                    class: "transition-transform duration-200 ease-out origin-top shadow-2xl bg-white",
                    style: { transform: `scale(${zoomLevel.value})`, width: isPDF.value ? "100%" : "auto" }
                  }, [
                    isPDF.value && __props.filePreviewUrl ? (openBlock(), createBlock("iframe", {
                      key: 0,
                      src: `${__props.filePreviewUrl}#toolbar=0&navpanes=0`,
                      class: "w-full min-h-[80vh]",
                      frameborder: "0"
                    }, null, 8, ["src"])) : isImage.value ? (openBlock(), createBlock("img", {
                      key: 1,
                      src: __props.filePreviewUrl,
                      class: "max-w-full"
                    }, null, 8, ["src"])) : createCommentVNode("", true)
                  ], 4)
                ]),
                createVNode("div", { class: "absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xl border border-slate-200 dark:border-zinc-700" }, [
                  createVNode(_component_UButton, {
                    icon: "i-heroicons-minus",
                    size: "xs",
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => changeZoom(-0.1)
                  }, null, 8, ["onClick"]),
                  createVNode("span", { class: "text-[10px] font-mono font-black w-10 text-center" }, toDisplayString(Math.round(zoomLevel.value * 100)) + "%", 1),
                  createVNode(_component_UButton, {
                    icon: "i-heroicons-plus",
                    size: "xs",
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => changeZoom(0.1)
                  }, null, 8, ["onClick"]),
                  createVNode("div", { class: "w-[1px] h-3 bg-slate-300 mx-1" }),
                  createVNode(_component_UButton, {
                    icon: "i-heroicons-arrow-path",
                    size: "xs",
                    color: "gray",
                    variant: "ghost",
                    onClick: ($event) => zoomLevel.value = 1
                  }, null, 8, ["onClick"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden sticky top-6" data-v-48a555cc><div class="px-3 py-1.5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900" data-v-48a555cc><div class="flex items-center gap-2" data-v-48a555cc>`);
      if (props.selectedFile) {
        _push(`<div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" data-v-48a555cc></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest" data-v-48a555cc>Aper\xE7u</span></div>`);
      if (props.selectedFile) {
        _push(`<div class="flex items-center gap-1" data-v-48a555cc>`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-heroicons-minus",
          size: "xs",
          variant: "ghost",
          color: "gray",
          onClick: ($event) => changeZoom(-0.1)
        }, null, _parent));
        _push(`<span class="text-[9px] font-mono font-bold text-slate-500" data-v-48a555cc>${ssrInterpolate(Math.round(zoomLevel.value * 100))}%</span>`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-heroicons-plus",
          size: "xs",
          variant: "ghost",
          color: "gray",
          onClick: ($event) => changeZoom(0.1)
        }, null, _parent));
        _push(`<div class="w-[1px] h-3 bg-slate-200 mx-1" data-v-48a555cc></div>`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-heroicons-arrows-pointing-out",
          size: "xs",
          variant: "ghost",
          color: "primary",
          onClick: ($event) => isOpen.value = true
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="relative bg-slate-50 dark:bg-zinc-950 h-[500px] overflow-hidden flex flex-col" data-v-48a555cc>`);
      if (!props.selectedFile) {
        _push(`<div class="h-full flex flex-col items-center justify-center opacity-30" data-v-48a555cc>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-document",
          class: "w-8 h-8 mb-2"
        }, null, _parent));
        _push(`<span class="text-[10px] uppercase font-bold tracking-widest" data-v-48a555cc>Aucun document</span></div>`);
      } else {
        _push(`<div class="h-full overflow-auto scrollbar-hide" data-v-48a555cc><div class="transition-transform duration-200 origin-top p-2" style="${ssrRenderStyle({ transform: `scale(${zoomLevel.value})` })}" data-v-48a555cc>`);
        if (isPDF.value) {
          _push(`<iframe${ssrRenderAttr("src", `${__props.filePreviewUrl}#view=FitH&toolbar=0`)} class="w-full h-[480px] rounded border border-slate-200 dark:border-zinc-800 bg-white" data-v-48a555cc></iframe>`);
        } else if (isImage.value) {
          _push(`<img${ssrRenderAttr("src", __props.filePreviewUrl)} class="max-w-full mx-auto rounded shadow-sm" data-v-48a555cc>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div>`);
      if (props.selectedFile) {
        _push(`<div class="px-3 py-1.5 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center" data-v-48a555cc><span class="text-[10px] text-slate-500 truncate italic max-w-[70%]" data-v-48a555cc>${ssrInterpolate(props.selectedFile.name)}</span>`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-heroicons-arrow-down-tray",
          size: "xs",
          variant: "link",
          color: "gray",
          onClick: downloadFile
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DocumentPreview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-48a555cc"]]);

export { __nuxt_component_4 as _ };
//# sourceMappingURL=DocumentPreview-CJPhVhww.mjs.map
