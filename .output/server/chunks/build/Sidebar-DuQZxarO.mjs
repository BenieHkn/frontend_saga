import { _ as _export_sfc, c as __nuxt_component_0$2, d as __nuxt_component_1$1, a as __nuxt_component_0$4, b as useRuntimeConfig } from './server.mjs';
import __nuxt_component_3 from './Modal-EvFvX6Ng.mjs';
import { ref, computed, unref, withCtx, createTextVNode, isRef, createVNode, createBlock, openBlock, Fragment, renderList, createCommentVNode, toDisplayString, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttrs } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../_/nitro.mjs';
import { s as setInterval } from './interval-B7_Jhm6S.mjs';
import { useRoute } from 'vue-router';
import { u as useAuth } from './useAuth-D9Skuklz.mjs';

const _imports_0 = publicAssetsURL("/images/logo2.png");
const useNotifications = () => {
  const notifications = ref([]);
  const nonLues = ref(0);
  const config = useRuntimeConfig();
  let pollingInterval = null;
  const charger = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const data = await $fetch(`${config.public.apiBase}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      notifications.value = data.notifications;
      nonLues.value = data.non_lues;
    } catch (e) {
      console.error("Erreur notifications:", e);
    }
  };
  const marquerLu = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");
      await $fetch(`${config.public.apiBase}/notifications/${id}/lire`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const notif = notifications.value.find((n) => n.id === id);
      if (notif) {
        notif.lu = true;
        nonLues.value = Math.max(0, nonLues.value - 1);
      }
    } catch (e) {
      console.error("Erreur marquerLu:", e);
    }
  };
  const toutLire = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      await $fetch(`${config.public.apiBase}/notifications/tout-lire`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      notifications.value.forEach((n) => n.lu = true);
      nonLues.value = 0;
    } catch (e) {
      console.error("Erreur toutLire:", e);
    }
  };
  const demarrerPolling = () => {
    charger();
    pollingInterval = setInterval();
  };
  const arreterPolling = () => {
    if (pollingInterval) clearInterval(pollingInterval);
  };
  return {
    notifications,
    nonLues,
    charger,
    marquerLu,
    toutLire,
    demarrerPolling,
    arreterPolling
  };
};
const _sfc_main$1 = {
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const user = ref(null);
    const selected_entite = ref(null);
    ref(null);
    const entites = ref([]);
    const showModal = ref(false);
    const { notifications, nonLues } = useNotifications();
    const currentEntiteUser = computed(() => {
      if (!selected_entite.value || !entites.value) return null;
      const found = entites.value.find((e) => e.id === selected_entite.value.id);
      return found || null;
    });
    const otherEntites = computed(() => {
      var _a;
      if (!selected_entite.value || !entites.value) {
        return ((_a = entites.value) == null ? void 0 : _a.filter((e) => e.actif)) || [];
      }
      return entites.value.filter((e) => e.id !== selected_entite.value.id && e.actif);
    });
    const getInitials = (nom, prenom) => {
      const name = `${prenom || ""} ${nom || ""}`.trim() || "User";
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffffff&color=065f46`;
    };
    const switchEntite = (entite) => {
      selected_entite.value = entite;
      showModal.value = false;
      showUserMenu.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const _component_Icon = __nuxt_component_0$2;
      const _component_UButton = __nuxt_component_1$1;
      const _component_UModal = __nuxt_component_3;
      _push(`<!--[--><header class="fixed w-full top-0 z-[100] bg-white"><div class="px-4 sm:px-6 lg:px-5"><div class="flex justify-between items-center h-20"><div class="flex items-left space-x-2"><div class="flex items-center group cursor-pointer"><div class="relative p-0.5 bg-white/20 rounded-xl mr-2 backdrop-blur-sm border border-white/30 transform group-hover:scale-105 transition-transform"><div class="bg-white rounded-lg p-0"><img${ssrRenderAttr("src", _imports_0)} alt="Logo SAGA" class="h-20 w-20 object-contain"></div></div><div class="flex flex-col leading-tight"><h1 class="text-sm tracking-tighter text-blue-800"><span class="font-black">SAGA</span><span class="text-emerald-400 font-light mx-1">|</span> REVOLUTION </h1></div></div></div><div class="flex items-center space-x-5"><div class="relative"><button type="button" class="p-2.5 rounded-xl bg-gradient-to-br from-emerald-700 to-blue-700 text-white transition-all border focus:outline-none">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:bell",
        class: "h-5 w-5"
      }, null, _parent));
      if (unref(nonLues) > 0) {
        _push(`<span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-white">${ssrInterpolate(unref(nonLues) > 9 ? "9+" : unref(nonLues))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (unref(showNotifications)) {
        _push(`<div class="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[110] overflow-hidden"><div class="p-4 bg-slate-900 text-white flex justify-between items-center"><span class="font-bold text-xs uppercase tracking-widest">Notifications</span>`);
        if (unref(nonLues) > 0) {
          _push(`<button class="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"> Tout marquer comme lu </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="max-h-80 overflow-y-auto divide-y divide-slate-50">`);
        if (unref(notifications).length === 0) {
          _push(`<div class="p-8 text-center text-slate-400 text-sm"> Aucune notification </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(notifications), (n) => {
          _push(`<div class="${ssrRenderClass([n.lu ? "opacity-60" : "bg-emerald-50/40", "p-4 hover:bg-slate-50 cursor-pointer transition-all flex gap-3"])}"><div class="shrink-0 mt-0.5"><div class="${ssrRenderClass([n.type === "affectation" ? "bg-emerald-600" : "bg-blue-600", "h-8 w-8 rounded-full flex items-center justify-center text-white"])}">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: n.type === "affectation" ? "heroicons:clipboard-document" : "heroicons:arrows-right-left",
            class: "h-4 w-4"
          }, null, _parent));
          _push(`</div></div><div class="flex-1 min-w-0"><div class="flex justify-between items-start gap-2"><p class="text-xs font-bold text-slate-700">${ssrInterpolate(n.titre)}</p><span class="text-[10px] text-slate-400 shrink-0">${ssrInterpolate(n.time)}</span></div><p class="text-xs text-slate-500 mt-0.5 leading-relaxed">${ssrInterpolate(n.message)}</p><span class="${ssrRenderClass([n.type === "affectation" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700", "inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"])}">${ssrInterpolate(n.type === "affectation" ? "Affectation" : "Transfert")}</span></div>`);
          if (!n.lu) {
            _push(`<div class="shrink-0 mt-2"><span class="h-2 w-2 rounded-full bg-amber-400 block"></span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="relative"><button type="button" class="flex items-center pl-1 pr-3 py-1 bg-gradient-to-br from-emerald-700 to-blue-700 rounded-2xl hover:bg-white/15 transition-all focus:outline-none"><div class="p-0.5 rounded-xl"><img class="h-9 w-9 rounded-[10px] object-cover bg-white"${ssrRenderAttr("src", getInitials((_a = unref(user)) == null ? void 0 : _a.nom, (_b = unref(user)) == null ? void 0 : _b.prenom))} alt="User"></div><div class="hidden md:block ml-3 text-left mr-2"><p class="text-xs font-bold text-white leading-none uppercase">${ssrInterpolate((_c = unref(user)) == null ? void 0 : _c.prenom)}</p><p class="text-[10px] text-emerald-300 font-bold mt-1 uppercase tracking-tighter">`);
      if ((_d = unref(user)) == null ? void 0 : _d.is_superadmin) {
        _push(`<span>Administrateur</span>`);
      } else {
        _push(`<span>${ssrInterpolate((_e = unref(selected_entite)) == null ? void 0 : _e.code)}</span>`);
      }
      _push(`</p></div>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "heroicons:chevron-down-20-solid",
        class: "h-4 w-4 text-white/50"
      }, null, _parent));
      _push(`</button>`);
      if (unref(showUserMenu)) {
        _push(`<div class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[110] p-2">`);
        if (unref(selected_entite)) {
          _push(`<div class="px-4 py-2 border-b border-slate-50 mb-1 bg-emerald-50 rounded-lg"><p class="text-sm font-bold text-emerald-700">${ssrInterpolate((_f = unref(selected_entite)) == null ? void 0 : _f.libelle)}</p>`);
          if ((_g = unref(currentEntiteUser)) == null ? void 0 : _g.is_responsable) {
            _push(`<p class="text-xs text-emerald-600 mt-1">${ssrInterpolate((_h = unref(selected_entite)) == null ? void 0 : _h.fonction)}</p>`);
          } else {
            _push(`<p class="text-xs text-emerald-500 mt-1"> Agent </p>`);
          }
          _push(`<div class="flex gap-1 mt-2">`);
          if ((_i = unref(currentEntiteUser)) == null ? void 0 : _i.is_interim) {
            _push(`<span class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full"> Int\xE9rim </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(otherEntites).length > 0) {
          _push(`<div>`);
          _push(ssrRenderComponent(_component_UButton, {
            onClick: ($event) => showModal.value = true,
            class: "flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-emerald-50 text-emerald-700 transition-all font-bold text-sm mb-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Changer d&#39;entit\xE9 `);
              } else {
                return [
                  createTextVNode(" Changer d'entit\xE9 ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_UModal, {
            modelValue: unref(showModal),
            "onUpdate:modelValue": ($event) => isRef(showModal) ? showModal.value = $event : null,
            title: "Changer d'entit\xE9"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="p-6"${_scopeId}><h2 class="text-lg font-semibold mb-4"${_scopeId}> Changer d&#39;entit\xE9 </h2><div class="space-y-3 grid grid-cols-1 md:grid-cols-2"${_scopeId}><!--[-->`);
                ssrRenderList(unref(otherEntites), (entite) => {
                  _push2(`<div class="p-3 border border-slate-200 rounded-lg hover:bg-emerald-50 cursor-pointer"${_scopeId}><p class="font-bold text-emerald-700"${_scopeId}>${ssrInterpolate(entite.libelle)}</p><p class="text-xs text-emerald-600"${_scopeId}>${ssrInterpolate(entite.code)}</p>`);
                  if (entite.fonction) {
                    _push2(`<p class="text-[10px] text-emerald-500 mt-1"${_scopeId}>${ssrInterpolate(entite.fonction)}</p>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div class="flex gap-1 mt-2"${_scopeId}>`);
                  if (entite.is_responsable) {
                    _push2(`<span class="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full"${_scopeId}> Responsable </span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (entite.is_interim) {
                    _push2(`<span class="text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full"${_scopeId}> Int\xE9rim </span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                });
                _push2(`<!--]--></div><div class="mt-6 flex justify-end"${_scopeId}>`);
                _push2(ssrRenderComponent(_component_UButton, {
                  label: "Fermer",
                  color: "gray",
                  onClick: ($event) => showModal.value = false
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "p-6" }, [
                    createVNode("h2", { class: "text-lg font-semibold mb-4" }, " Changer d'entit\xE9 "),
                    createVNode("div", { class: "space-y-3 grid grid-cols-1 md:grid-cols-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(otherEntites), (entite) => {
                        return openBlock(), createBlock("div", {
                          key: entite.id,
                          class: "p-3 border border-slate-200 rounded-lg hover:bg-emerald-50 cursor-pointer",
                          onClick: ($event) => switchEntite(entite)
                        }, [
                          createVNode("p", { class: "font-bold text-emerald-700" }, toDisplayString(entite.libelle), 1),
                          createVNode("p", { class: "text-xs text-emerald-600" }, toDisplayString(entite.code), 1),
                          entite.fonction ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-[10px] text-emerald-500 mt-1"
                          }, toDisplayString(entite.fonction), 1)) : createCommentVNode("", true),
                          createVNode("div", { class: "flex gap-1 mt-2" }, [
                            entite.is_responsable ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full"
                            }, " Responsable ")) : createCommentVNode("", true),
                            entite.is_interim ? (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-[10px] bg-amber-600 text-white px-2 py-0.5 rounded-full"
                            }, " Int\xE9rim ")) : createCommentVNode("", true)
                          ])
                        ], 8, ["onClick"]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "mt-6 flex justify-end" }, [
                      createVNode(_component_UButton, {
                        label: "Fermer",
                        color: "gray",
                        onClick: ($event) => showModal.value = false
                      }, null, 8, ["onClick"])
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-500 transition-all font-bold text-sm mt-2">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:power",
          class: "h-5 w-5"
        }, null, _parent));
        _push(`<span>D\xE9connexion</span></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></header><div class="h-20"></div><!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  emits: ["sidebar-toggle"],
  setup(__props, { emit: __emit }) {
    const route = useRoute();
    const {
      peutVoirConfig,
      peutRattacher,
      peutVoirCodir,
      voitStats} = useAuth();
    const isExpanded = ref(true);
    const settingsMenuOpen = ref(false);
    const peutVoirPreArchivage = computed(() => peutVoirConfig());
    const peutVoirAffectations = computed(() => false);
    const allMenuItems = computed(() => [
      {
        name: "Tableau de bord",
        path: "/dashboard",
        icon: "heroicons:home-20-solid",
        visible: true
      },
      {
        name: "Documents",
        path: "/documents",
        icon: "heroicons:folder-open-20-solid",
        visible: true
      },
      {
        name: "Affectations & Transferts",
        path: "/affectations-transferts",
        icon: "heroicons:clipboard-document-check-20-solid",
        visible: peutVoirAffectations.value
      },
      {
        name: "Rattachement",
        path: "/rattachements",
        icon: "heroicons:paper-clip-20-solid",
        visible: peutRattacher()
      },
      {
        name: "CODIR",
        path: "/codir",
        icon: "heroicons:user-group-20-solid",
        visible: peutVoirCodir()
      },
      {
        name: "Statistiques",
        path: "/stats",
        icon: "heroicons:chart-bar-20-solid",
        visible: voitStats()
      },
      {
        name: "Pr\xE9-Archivage",
        path: "/archivage",
        icon: "heroicons:archive-box-20-solid",
        visible: peutVoirPreArchivage.value
      }
    ]);
    const menuItems = computed(
      () => allMenuItems.value.filter((item) => item.visible)
    );
    const isSettingsRouteActive = computed(
      () => ["/entites", "/utilisateurs", "/point-critique", "/interim"].some(
        (path) => route.path === path
      )
    );
    watch(isSettingsRouteActive, (isActive) => {
      if (isActive && !settingsMenuOpen.value) {
        settingsMenuOpen.value = true;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$4;
      const _component_Icon = __nuxt_component_0$2;
      _push(`<aside${ssrRenderAttrs(mergeProps({
        class: [
          "fixed left-0 top-20 h-[calc(100vh-80px)] transition-all duration-300 z-[40] shadow-xl flex flex-col",
          "bg-white border-white/5",
          isExpanded.value ? "w-64" : "w-20"
        ]
      }, _attrs))} data-v-85e1ba8b><nav class="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar" data-v-85e1ba8b><!--[-->`);
      ssrRenderList(menuItems.value, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.path,
          to: item.path,
          class: ["flex items-center group relative px-4 py-3.5 rounded-xl transition-all duration-200", [
            unref(route).path === item.path ? "bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg" : "text-gray-700 hover:bg-emerald-800 hover:text-white"
          ]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: item.icon,
                class: "h-6 w-6 shrink-0"
              }, null, _parent2, _scopeId));
              if (isExpanded.value) {
                _push2(`<span class="ml-4 font-bold overflow-hidden tracking-wide" data-v-85e1ba8b${_scopeId}>${ssrInterpolate(item.name)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (!isExpanded.value) {
                _push2(`<div class="absolute left-16 bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl" data-v-85e1ba8b${_scopeId}>${ssrInterpolate(item.name)}</div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(_component_Icon, {
                  name: item.icon,
                  class: "h-6 w-6 shrink-0"
                }, null, 8, ["name"]),
                isExpanded.value ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "ml-4 font-bold overflow-hidden tracking-wide"
                }, toDisplayString(item.name), 1)) : createCommentVNode("", true),
                !isExpanded.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "absolute left-16 bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl"
                }, toDisplayString(item.name), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      if (unref(peutVoirConfig)()) {
        _push(`<div class="pt-4 mt-4 border-t border-gray-200" data-v-85e1ba8b><button class="flex items-center justify-between w-full px-4 py-3.5 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all" data-v-85e1ba8b><div class="flex items-center" data-v-85e1ba8b>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "heroicons:cog-6-tooth",
          class: "h-6 w-6 shrink-0"
        }, null, _parent));
        if (isExpanded.value) {
          _push(`<span class="ml-4 font-bold text-gray-900" data-v-85e1ba8b>Configuration</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (isExpanded.value) {
          _push(ssrRenderComponent(_component_Icon, {
            name: settingsMenuOpen.value ? "heroicons:chevron-up" : "heroicons:chevron-down",
            class: "h-4 w-4 opacity-60"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
        if (settingsMenuOpen.value && isExpanded.value) {
          _push(`<div class="ml-10 space-y-2 mt-2 animate-slide-down" data-v-85e1ba8b>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/entites",
            class: ["block text-sm px-3 py-2 rounded-lg font-bold transition-colors", unref(route).path === "/entites" ? "bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg" : "text-gray-700 hover:text-emerald-600 hover:bg-gray-100"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Entit\xE9s `);
              } else {
                return [
                  createTextVNode(" Entit\xE9s ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/utilisateurs",
            class: ["block text-sm px-3 py-2 rounded-lg font-bold transition-colors", unref(route).path === "/utilisateurs" ? "bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg" : "text-gray-700 hover:text-emerald-600 hover:bg-gray-100"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Utilisateurs `);
              } else {
                return [
                  createTextVNode(" Utilisateurs ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/point-critique",
            class: ["block text-sm px-3 py-2 rounded-lg font-bold transition-colors", unref(route).path === "/point-critique" ? "bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg" : "text-gray-700 hover:text-emerald-600 hover:bg-gray-100"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Point Critique `);
              } else {
                return [
                  createTextVNode(" Point Critique ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/interim",
            class: ["block text-sm px-3 py-2 rounded-lg font-bold transition-colors", unref(route).path === "/interim" ? "bg-gradient-to-br from-emerald-700 to-blue-800 text-white shadow-lg" : "text-gray-700 hover:text-emerald-600 hover:bg-gray-100"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Int\xE9rim `);
              } else {
                return [
                  createTextVNode(" Int\xE9rim ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav><button class="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center z-[50] transition-all duration-500 group" data-v-85e1ba8b><div class="absolute inset-0 rounded-full transition-all duration-300 bg-gradient-to-br from-emerald-700 to-blue-800 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:bg-emerald-500/80" data-v-85e1ba8b><div class="absolute inset-[2px] rounded-full bg-gradient-to-tr from-emerald-400/20 to-white/30 opacity-60" data-v-85e1ba8b></div></div>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: isExpanded.value ? "heroicons:chevron-left-20-solid" : "heroicons:chevron-right-20-solid",
        class: "h-6 w-6 text-white relative z-10 drop-shadow-sm"
      }, null, _parent));
      _push(`</button></aside>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-85e1ba8b"]]);

export { _sfc_main$1 as _, __nuxt_component_1 as a };
//# sourceMappingURL=Sidebar-DuQZxarO.mjs.map
