import __nuxt_component_0 from './Modal-BXvFVpvj.mjs';
import __nuxt_component_0$1 from './Icon-BEWG_Jy9.mjs';
import __nuxt_component_2$1 from './Button-D4Pv8nAk.mjs';
import { ref, computed, watch, mergeProps, withCtx, createVNode, toDisplayString, createBlock, createCommentVNode, openBlock, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  __name: "DocumentRpreview",
  __ssrInlineRender: true,
  props: {
    filePreviewUrl: {
      type: String,
      default: null,
      required: false
    },
    selectedFile: {
      type: Object,
      default: null,
      required: false
    },
    height: {
      type: String,
      default: "500px"
    }
  },
  setup(__props) {
    const props = __props;
    const isOpen = ref(false);
    const zoomLevel = ref(1);
    const loading = ref(false);
    const error = ref(null);
    let loadingTimeout = null;
    const previewHeight = computed(() => props.height);
    const changeZoom = (delta) => {
      const newZoom = zoomLevel.value + delta;
      if (newZoom >= 0.3 && newZoom <= 2) {
        zoomLevel.value = parseFloat(newZoom.toFixed(1));
      }
    };
    const startLoading = () => {
      console.log("\u{1F504} D\xE9but du chargement du document:", props.filePreviewUrl);
      loading.value = true;
      error.value = null;
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      loadingTimeout = setTimeout(() => {
        console.log("\u2705 Timeout atteint - affichage du document");
        loading.value = false;
      }, 2e3);
    };
    watch(() => props.filePreviewUrl, (newUrl, oldUrl) => {
      console.log("\u{1F504} URL chang\xE9e:", { oldUrl, newUrl });
      if (newUrl) {
        startLoading();
        zoomLevel.value = 1;
      } else {
        loading.value = false;
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UModal = __nuxt_component_0;
      const _component_UIcon = __nuxt_component_0$1;
      const _component_UButton = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full font-sans" }, _attrs))} data-v-2e0c7331>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: isOpen.value,
        "onUpdate:modelValue": ($event) => isOpen.value = $event,
        ui: { width: "sm:max-w-6xl", height: "h-[95vh]" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="flex flex-col h-full bg-slate-100 dark:bg-zinc-950 overflow-hidden relative" data-v-2e0c7331${_scopeId}><div class="flex justify-between items-center px-6 py-3 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shrink-0" data-v-2e0c7331${_scopeId}><div class="flex items-center gap-3" data-v-2e0c7331${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-document-text",
              class: "text-primary-600 w-5 h-5"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-sm font-bold truncate max-w-[300px]" data-v-2e0c7331${_scopeId}>${ssrInterpolate(((_a = props.selectedFile) == null ? void 0 : _a.name) || "Document PDF")}</span></div><div class="flex items-center gap-2" data-v-2e0c7331${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-x-mark",
              color: "gray",
              variant: "ghost",
              onClick: ($event) => isOpen.value = false,
              class: "rounded-full"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div class="flex-1 overflow-auto p-4 md:p-10 flex justify-center bg-slate-200/50 dark:bg-zinc-900/50" data-v-2e0c7331${_scopeId}><div class="transition-transform duration-200 ease-out origin-top shadow-2xl bg-white w-full" style="${ssrRenderStyle({ transform: `scale(${zoomLevel.value})` })}" data-v-2e0c7331${_scopeId}>`);
            if (__props.filePreviewUrl && !loading.value) {
              _push2(`<object${ssrRenderAttr("data", `${__props.filePreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`)} type="application/pdf" class="w-full min-h-[80vh]" data-v-2e0c7331${_scopeId}><div class="flex flex-col items-center justify-center h-full p-8" data-v-2e0c7331${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-document-text",
                class: "w-16 h-16 text-slate-400 mb-4"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-sm text-slate-600 dark:text-slate-400 mb-4" data-v-2e0c7331${_scopeId}>Impossible d&#39;afficher le PDF dans cette fen\xEAtre.</p><a${ssrRenderAttr("href", __props.filePreviewUrl)} target="_blank" class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2" data-v-2e0c7331${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-arrow-top-right-on-square",
                class: "w-4 h-4"
              }, null, _parent2, _scopeId));
              _push2(` Ouvrir dans un nouvel onglet </a></div></object>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xl border border-slate-200 dark:border-zinc-700" data-v-2e0c7331${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-minus",
              size: "xs",
              color: "gray",
              variant: "ghost",
              onClick: ($event) => changeZoom(-0.1)
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-[10px] font-mono font-black w-10 text-center" data-v-2e0c7331${_scopeId}>${ssrInterpolate(Math.round(zoomLevel.value * 100))}%</span>`);
            _push2(ssrRenderComponent(_component_UButton, {
              icon: "i-heroicons-plus",
              size: "xs",
              color: "gray",
              variant: "ghost",
              onClick: ($event) => changeZoom(0.1)
            }, null, _parent2, _scopeId));
            _push2(`<div class="w-[1px] h-3 bg-slate-300 mx-1" data-v-2e0c7331${_scopeId}></div>`);
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
                      name: "i-heroicons-document-text",
                      class: "text-primary-600 w-5 h-5"
                    }),
                    createVNode("span", { class: "text-sm font-bold truncate max-w-[300px]" }, toDisplayString(((_b = props.selectedFile) == null ? void 0 : _b.name) || "Document PDF"), 1)
                  ]),
                  createVNode("div", { class: "flex items-center gap-2" }, [
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
                    class: "transition-transform duration-200 ease-out origin-top shadow-2xl bg-white w-full",
                    style: { transform: `scale(${zoomLevel.value})` }
                  }, [
                    __props.filePreviewUrl && !loading.value ? (openBlock(), createBlock("object", {
                      key: 0,
                      data: `${__props.filePreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`,
                      type: "application/pdf",
                      class: "w-full min-h-[80vh]"
                    }, [
                      createVNode("div", { class: "flex flex-col items-center justify-center h-full p-8" }, [
                        createVNode(_component_UIcon, {
                          name: "i-heroicons-document-text",
                          class: "w-16 h-16 text-slate-400 mb-4"
                        }),
                        createVNode("p", { class: "text-sm text-slate-600 dark:text-slate-400 mb-4" }, "Impossible d'afficher le PDF dans cette fen\xEAtre."),
                        createVNode("a", {
                          href: __props.filePreviewUrl,
                          target: "_blank",
                          class: "bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2"
                        }, [
                          createVNode(_component_UIcon, {
                            name: "i-heroicons-arrow-top-right-on-square",
                            class: "w-4 h-4"
                          }),
                          createTextVNode(" Ouvrir dans un nouvel onglet ")
                        ], 8, ["href"])
                      ])
                    ], 8, ["data"])) : createCommentVNode("", true)
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
      _push(`<div class="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden sticky top-6" data-v-2e0c7331><div class="px-3 py-1.5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900" data-v-2e0c7331><div class="flex items-center gap-2" data-v-2e0c7331>`);
      if (__props.filePreviewUrl && !loading.value) {
        _push(`<div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" data-v-2e0c7331></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest" data-v-2e0c7331>Aper\xE7u</span></div>`);
      if (__props.filePreviewUrl && !loading.value) {
        _push(`<div class="flex items-center gap-1" data-v-2e0c7331>`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-heroicons-minus",
          size: "xs",
          variant: "ghost",
          color: "gray",
          onClick: ($event) => changeZoom(-0.1)
        }, null, _parent));
        _push(`<span class="text-[9px] font-mono font-bold text-slate-500" data-v-2e0c7331>${ssrInterpolate(Math.round(zoomLevel.value * 100))}%</span>`);
        _push(ssrRenderComponent(_component_UButton, {
          icon: "i-heroicons-plus",
          size: "xs",
          variant: "ghost",
          color: "gray",
          onClick: ($event) => changeZoom(0.1)
        }, null, _parent));
        _push(`<div class="w-[1px] h-3 bg-slate-200 mx-1" data-v-2e0c7331></div>`);
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
      _push(`</div><div class="relative bg-slate-50 dark:bg-zinc-950 overflow-hidden flex flex-col" style="${ssrRenderStyle({ height: previewHeight.value })}" data-v-2e0c7331>`);
      if (loading.value) {
        _push(`<div class="h-full flex flex-col items-center justify-center opacity-50" data-v-2e0c7331>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-8 h-8 mb-2 animate-spin text-primary-500"
        }, null, _parent));
        _push(`<span class="text-[10px] uppercase font-bold tracking-widest" data-v-2e0c7331>Chargement...</span><span class="text-xs text-slate-400 mt-1" data-v-2e0c7331>Le document devrait appara\xEEtre dans 2 secondes</span></div>`);
      } else if (error.value) {
        _push(`<div class="h-full flex flex-col items-center justify-center p-4" data-v-2e0c7331>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-exclamation-triangle",
          class: "w-8 h-8 mb-2 text-red-500"
        }, null, _parent));
        _push(`<span class="text-[10px] uppercase font-bold tracking-widest text-red-500 mb-1" data-v-2e0c7331>Erreur de chargement</span><span class="text-xs text-slate-500 text-center" data-v-2e0c7331>${ssrInterpolate(error.value)}</span></div>`);
      } else if (!__props.filePreviewUrl) {
        _push(`<div class="h-full flex flex-col items-center justify-center opacity-30" data-v-2e0c7331>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-document",
          class: "w-8 h-8 mb-2"
        }, null, _parent));
        _push(`<span class="text-[10px] uppercase font-bold tracking-widest" data-v-2e0c7331>Aucun document</span></div>`);
      } else {
        _push(`<div class="h-full overflow-auto scrollbar-hide" data-v-2e0c7331><div class="transition-transform duration-200 origin-top p-2" style="${ssrRenderStyle({ transform: `scale(${zoomLevel.value})` })}" data-v-2e0c7331><object${ssrRenderAttr("data", `${__props.filePreviewUrl}#toolbar=0&navpanes=0&scrollbar=0`)} type="application/pdf" class="w-full rounded border border-slate-200 dark:border-zinc-800 bg-white" style="${ssrRenderStyle({ height: "calc(" + previewHeight.value + " - 1rem)" })}" data-v-2e0c7331><div class="flex flex-col items-center justify-center h-full p-8" data-v-2e0c7331>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-document-text",
          class: "w-12 h-12 text-slate-400 mb-4"
        }, null, _parent));
        _push(`<p class="text-xs text-slate-600 dark:text-slate-400 mb-4 text-center" data-v-2e0c7331>Impossible d&#39;afficher le PDF dans cette fen\xEAtre.</p><a${ssrRenderAttr("href", __props.filePreviewUrl)} target="_blank" class="bg-primary-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-700 flex items-center gap-2" data-v-2e0c7331>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-top-right-on-square",
          class: "w-3 h-3"
        }, null, _parent));
        _push(` Ouvrir dans un nouvel onglet </a></div></object></div></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DocumentRpreview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2e0c7331"]]);

export { __nuxt_component_2 as _ };
//# sourceMappingURL=DocumentRpreview-B3POm1pQ.mjs.map
