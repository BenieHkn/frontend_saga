import __nuxt_component_0 from './Container-ufb7lVrW.mjs';
import { _ as _sfc_main$1 } from './PageHeader-NxcDUFJW.mjs';
import __nuxt_component_1 from './Badge-DIEXPf_r.mjs';
import { c as __nuxt_component_0$2 } from './server.mjs';
import { defineAsyncComponent, ref, shallowRef, withCtx, createVNode, toDisplayString, resolveDynamicComponent, createBlock, openBlock, Fragment, renderList, KeepAlive, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderVNode } from 'vue/server-renderer';
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
  __name: "AllCourriers",
  __ssrInlineRender: true,
  props: {
    entiteId: {
      type: Number,
      default: null
    }
  },
  setup(__props) {
    const CourriersArrivesListe = defineAsyncComponent({
      loader: () => import('./CourriersArrivesListe-BVTEn-sH.mjs'),
      delay: 200,
      timeout: 15e3,
      loadingComponent: () => null,
      errorComponent: () => null
    });
    const CourriersDepartsListe = defineAsyncComponent({
      loader: () => import('./CourriersDepartsListe-CzHPzjR4.mjs'),
      delay: 200,
      timeout: 15e3
    });
    const CourriersDocumentsInternes = defineAsyncComponent({
      loader: () => import('./CourriersDocumentsInternes-Dco2iasW.mjs'),
      delay: 200,
      timeout: 15e3
    });
    const documentTypes = [
      {
        id: 0,
        title: "Tous les documents",
        icon: "i-heroicons-document-text",
        color: "green",
        description: "Rapports, PV, notes etc.",
        component: "CourriersArrivesListe"
      },
      {
        id: 1,
        title: "Courriers Arriv\xE9s",
        icon: "i-heroicons-inbox-arrow-down",
        color: "blue",
        description: "Gestion des courriers arriv\xE9s",
        component: "CourriersArrivesListe"
      },
      {
        id: 2,
        title: "Courriers D\xE9parts",
        icon: "i-heroicons-paper-airplane",
        color: "orange",
        description: "Gestion des courriers d\xE9parts",
        component: "CourriersDepartsListe"
      },
      {
        id: 3,
        title: "Documents Internes",
        icon: "i-heroicons-document-text",
        color: "green",
        description: "Rapports, PV, notes etc.",
        component: "CourriersDocumentsInternes"
      }
    ];
    const selectedType = ref(documentTypes[0]);
    const isLoading = ref(false);
    const currentComponent = shallowRef(null);
    const componentMap = {
      CourriersArrivesListe,
      CourriersDepartsListe,
      CourriersDocumentsInternes
    };
    const loadComponent = async (componentName) => {
      isLoading.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        currentComponent.value = componentMap[componentName];
      } catch (error) {
        console.error("Erreur lors du chargement du composant:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const handleClick = async (data) => {
      if (selectedType.value.id === data.id) return;
      selectedType.value = data;
      await loadComponent(data.component);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UContainer = __nuxt_component_0;
      const _component_PageHeader = _sfc_main$1;
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$2;
      _push(ssrRenderComponent(_component_UContainer, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_PageHeader, {
              title: "Documents",
              subtitle: "Gestion et suivi des documents"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-wrap gap-4 justify-between"${_scopeId}><!--[-->`);
            ssrRenderList(documentTypes, (data) => {
              _push2(`<div class="cursor-pointer transition-all"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                variant: "soft",
                color: "blue",
                size: "lg",
                class: ["p-4 hover:ring-2 hover:ring-secondary-500", selectedType.value.id === data.id ? "ring-2 ring-secondary-500" : ""]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: data.icon,
                      class: "h-8 w-8 mr-2"
                    }, null, _parent3, _scopeId2));
                    _push3(`<div${_scopeId2}><h3 class="font-bold text-base"${_scopeId2}>${ssrInterpolate(data.title)}</h3><p class="text-xs text-gray-500"${_scopeId2}>${ssrInterpolate(data.description)}</p></div>`);
                  } else {
                    return [
                      createVNode(_component_Icon, {
                        name: data.icon,
                        class: "h-8 w-8 mr-2"
                      }, null, 8, ["name"]),
                      createVNode("div", null, [
                        createVNode("h3", { class: "font-bold text-base" }, toDisplayString(data.title), 1),
                        createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(data.description), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div><div class="mt-10 space-y-4 border-t pt-8"${_scopeId}>`);
            if (isLoading.value) {
              _push2(`<div class="flex items-center justify-center py-12"${_scopeId}><div class="text-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_Icon, {
                name: "i-heroicons-arrow-path",
                class: "w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin"
              }, null, _parent2, _scopeId));
              _push2(`<p class="text-sm text-gray-600"${_scopeId}>Chargement...</p></div></div>`);
            } else {
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(currentComponent.value), { "entite-id": __props.entiteId }, null), _parent2, _scopeId);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode(_component_PageHeader, {
                title: "Documents",
                subtitle: "Gestion et suivi des documents"
              }),
              createVNode("div", { class: "flex flex-wrap gap-4 justify-between" }, [
                (openBlock(), createBlock(Fragment, null, renderList(documentTypes, (data) => {
                  return createVNode("div", {
                    key: data.id,
                    onClick: ($event) => handleClick(data),
                    class: "cursor-pointer transition-all"
                  }, [
                    createVNode(_component_UBadge, {
                      variant: "soft",
                      color: "blue",
                      size: "lg",
                      class: ["p-4 hover:ring-2 hover:ring-secondary-500", selectedType.value.id === data.id ? "ring-2 ring-secondary-500" : ""]
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_Icon, {
                          name: data.icon,
                          class: "h-8 w-8 mr-2"
                        }, null, 8, ["name"]),
                        createVNode("div", null, [
                          createVNode("h3", { class: "font-bold text-base" }, toDisplayString(data.title), 1),
                          createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(data.description), 1)
                        ])
                      ]),
                      _: 2
                    }, 1032, ["class"])
                  ], 8, ["onClick"]);
                }), 64))
              ]),
              createVNode("div", { class: "mt-10 space-y-4 border-t pt-8" }, [
                isLoading.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex items-center justify-center py-12"
                }, [
                  createVNode("div", { class: "text-center" }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-arrow-path",
                      class: "w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin"
                    }),
                    createVNode("p", { class: "text-sm text-gray-600" }, "Chargement...")
                  ])
                ])) : (openBlock(), createBlock(KeepAlive, { key: 1 }, [
                  (openBlock(), createBlock(resolveDynamicComponent(currentComponent.value), { "entite-id": __props.entiteId }, null, 8, ["entite-id"]))
                ], 1024))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/documents/AllCourriers.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=AllCourriers-DXCMR-Li.mjs.map
