import __nuxt_component_0 from './Container-CEVYLYbh.mjs';
import { _ as _sfc_main$1 } from './PageHeader-OIWZwZf2.mjs';
import __nuxt_component_1 from './Badge-C_KHizXa.mjs';
import __nuxt_component_0$1 from './index-DJmPz9HS.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link-aS4hYwbM.mjs';
import __nuxt_component_5 from './CourriersArrivesListe-rply_gxW.mjs';
import __nuxt_component_6 from './CourriersDepartsListe-Bxaw3EiB.mjs';
import _sfc_main$2 from './CourriersDocumentsInternes--73scjAW.mjs';
import { ref, mergeProps, withCtx, createVNode, toDisplayString, unref, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import './tooltip-lourJnw0.mjs';
import './Icon-BEWG_Jy9.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
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
import './Button-D4Pv8nAk.mjs';
import './Link-SQZY3OU3.mjs';
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import './button-Bz5rwL6o.mjs';
import './DataTable-87jejf7-.mjs';
import './Input-3IU7zE8e.mjs';
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';
import './Select-BY_Jn5yn.mjs';
import './Checkbox-Nzn56Oau.mjs';
import './Card-CAWDi9lB.mjs';
import './DocumentRpreview-B3POm1pQ.mjs';
import './useApi-D6gLxNl8.mjs';
import './affectations-Bp-zzr69.mjs';
import './courriers-89bZxt-C.mjs';
import 'sweetalert2';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const documentTypes = [
      {
        id: 0,
        title: "Tous les documents",
        icon: "i-heroicons-document-text",
        color: "green",
        route: "/courriers/form_document_interne",
        description: "Rapports, PV, notes etc."
      },
      {
        id: 1,
        title: "Courriers Arriv\xE9s",
        icon: "i-heroicons-inbox-arrow-down",
        color: "blue",
        route: "/formulaires/courrier-arrive",
        description: "Gestion des courriers arriv\xE9s"
      },
      {
        id: 2,
        title: "Courriers D\xE9parts",
        icon: "i-heroicons-paper-airplane",
        color: "orange",
        route: "/formulaires/courrier-depart",
        description: "Gestion des courriers d\xE9parts"
      },
      {
        id: 3,
        title: "Documents Internes",
        icon: "i-heroicons-document-text",
        color: "green",
        route: "/courriers/form_document_interne",
        description: "Rapports, PV, notes etc."
      }
    ];
    const selectedType = ref(documentTypes[0]);
    const handleClick = (data) => {
      selectedType.value = data;
      console.log(selectedType.value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UContainer = __nuxt_component_0;
      const _component_PageHeader = _sfc_main$1;
      const _component_UBadge = __nuxt_component_1;
      const _component_Icon = __nuxt_component_0$1;
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_CourriersArrivesListe = __nuxt_component_5;
      const _component_CourriersDepartsListe = __nuxt_component_6;
      const _component_CourriersDocumentsInternes = _sfc_main$2;
      _push(ssrRenderComponent(_component_UContainer, mergeProps({ class: "" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_PageHeader, {
              title: "Documents",
              subtitle: "Gestion et suivi des documents"
            }, null, _parent2, _scopeId));
            _push2(`<div class="flex flex-wrap justify-between"${_scopeId}><!--[-->`);
            ssrRenderList(documentTypes, (data) => {
              _push2(`<div class="bg-transparent transition-all"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UBadge, {
                color: "blue",
                variant: "soft",
                size: "lg",
                class: "ml-auto p-4 cursor-pointer hover:ring-2 hover:ring-primary-500"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_Icon, {
                      name: data.icon,
                      class: "h-8 w-8 mr-1"
                    }, null, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_NuxtLink, {
                      to: data.route
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="bg-transparent"${_scopeId3}><h3 class="font-bold text-sm text-base"${_scopeId3}>${ssrInterpolate(data.title)}</h3><p class="text-xs text-gray-500"${_scopeId3}>${ssrInterpolate(data.description)}</p></div>`);
                        } else {
                          return [
                            createVNode("div", { class: "bg-transparent" }, [
                              createVNode("h3", { class: "font-bold text-sm text-base" }, toDisplayString(data.title), 1),
                              createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(data.description), 1)
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_Icon, {
                        name: data.icon,
                        class: "h-8 w-8 mr-1"
                      }, null, 8, ["name"]),
                      createVNode(_component_NuxtLink, {
                        to: data.route
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "bg-transparent" }, [
                            createVNode("h3", { class: "font-bold text-sm text-base" }, toDisplayString(data.title), 1),
                            createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(data.description), 1)
                          ])
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]--></div>`);
            if (unref(selectedType).id === 0) {
              _push2(`<div class="mt-10 space-y-4 border-t pt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_CourriersArrivesListe, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (unref(selectedType).id === 1) {
              _push2(`<div class="mt-10 space-y-4 border-t pt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_CourriersArrivesListe, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (unref(selectedType).id === 2) {
              _push2(`<div class="mt-10 space-y-4 border-t pt-8"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_CourriersDepartsListe, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (unref(selectedType).id === 3) {
              _push2(`<div class="text-center py-20 text-gray-400 italic"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_CourriersDocumentsInternes, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_PageHeader, {
                title: "Documents",
                subtitle: "Gestion et suivi des documents"
              }),
              createVNode("div", { class: "flex flex-wrap justify-between" }, [
                (openBlock(), createBlock(Fragment, null, renderList(documentTypes, (data) => {
                  return createVNode("div", {
                    key: _ctx.key,
                    onClick: ($event) => handleClick(data),
                    class: "bg-transparent transition-all"
                  }, [
                    createVNode(_component_UBadge, {
                      color: "blue",
                      variant: "soft",
                      size: "lg",
                      class: "ml-auto p-4 cursor-pointer hover:ring-2 hover:ring-primary-500"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_Icon, {
                          name: data.icon,
                          class: "h-8 w-8 mr-1"
                        }, null, 8, ["name"]),
                        createVNode(_component_NuxtLink, {
                          to: data.route
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "bg-transparent" }, [
                              createVNode("h3", { class: "font-bold text-sm text-base" }, toDisplayString(data.title), 1),
                              createVNode("p", { class: "text-xs text-gray-500" }, toDisplayString(data.description), 1)
                            ])
                          ]),
                          _: 2
                        }, 1032, ["to"])
                      ]),
                      _: 2
                    }, 1024)
                  ], 8, ["onClick"]);
                }), 64))
              ]),
              unref(selectedType).id === 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-10 space-y-4 border-t pt-8"
              }, [
                createVNode(_component_CourriersArrivesListe)
              ])) : unref(selectedType).id === 1 ? (openBlock(), createBlock("div", {
                key: 1,
                class: "mt-10 space-y-4 border-t pt-8"
              }, [
                createVNode(_component_CourriersArrivesListe)
              ])) : unref(selectedType).id === 2 ? (openBlock(), createBlock("div", {
                key: 2,
                class: "mt-10 space-y-4 border-t pt-8"
              }, [
                createVNode(_component_CourriersDepartsListe)
              ])) : unref(selectedType).id === 3 ? (openBlock(), createBlock("div", {
                key: 3,
                class: "text-center py-20 text-gray-400 italic"
              }, [
                createVNode(_component_CourriersDocumentsInternes)
              ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/courriers/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DgLjvXYc.mjs.map
