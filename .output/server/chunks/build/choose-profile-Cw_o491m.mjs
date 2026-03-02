import { _ as _export_sfc, B as useSeoMeta, d as __nuxt_component_1, g as __nuxt_component_2$1, A as useState } from './server.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-D9Skuklz.mjs';
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

const useColorMode = () => {
  return useState("color-mode").value;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "choose-profile",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Choix du poste" });
    const colorMode = useColorMode();
    const isDark = computed({
      get: () => colorMode.value === "dark",
      set: () => colorMode.preference = colorMode.value === "dark" ? "light" : "dark"
    });
    const {
      getActiveEntiteUsers,
      logout
    } = useAuth();
    const activePostes = computed(() => getActiveEntiteUsers());
    const fullName = computed(() => "");
    const selectedId = ref(null);
    const confirming = ref(false);
    async function handleLogout() {
      await logout();
    }
    function getInitials(libelle) {
      if (!libelle) return "?";
      return libelle.split(" ").filter((w) => w.length > 2).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
    }
    function formatDate(iso) {
      if (!iso) return "N/A";
      try {
        return new Date(iso).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
      } catch {
        return "N/A";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = __nuxt_component_1;
      const _component_UIcon = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-dark-900 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300" }, _attrs))} data-v-37e10e11><div class="fixed top-6 right-6 z-50" data-v-37e10e11>`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: unref(isDark) ? "i-heroicons-moon" : "i-heroicons-sun",
        color: "white",
        variant: "solid",
        class: "rounded-full shadow-sm glass-panel",
        onClick: ($event) => isDark.value = !unref(isDark)
      }, null, _parent));
      _push(`</div><div class="max-w-4xl w-full mx-auto space-y-8 animate-fade-in" data-v-37e10e11><div class="text-center space-y-2" data-v-37e10e11><h1 class="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white" data-v-37e10e11> Choisissez votre poste de travail </h1><p class="text-slate-500 dark:text-slate-400 text-sm font-medium" data-v-37e10e11> Bonjour M. /Mme <span class="font-semibold text-slate-700 dark:text-slate-200" data-v-37e10e11>${ssrInterpolate(unref(fullName))}</span>, s\xE9lectionnez le poste que vous souhaitez occuper pour cette session. </p></div><div class="${ssrRenderClass([{
        "max-w-xs mx-auto": unref(activePostes).length === 1,
        "sm:grid-cols-2": unref(activePostes).length === 2,
        "sm:grid-cols-2 lg:grid-cols-3": unref(activePostes).length >= 3
      }, "grid grid-cols-1 gap-4 items-stretch"])}" data-v-37e10e11><!--[-->`);
      ssrRenderList(unref(activePostes), (entiteUser) => {
        var _a;
        _push(`<div class="group relative cursor-pointer" data-v-37e10e11><div class="${ssrRenderClass([[
          unref(confirming) && unref(selectedId) === entiteUser.entite_user_id ? "border-brand-400/50 ring-4 ring-brand-400/20 -translate-y-1" : "border-transparent hover:-translate-y-1 hover:shadow-lg"
        ], "glass-panel h-full p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border-2"])}" data-v-37e10e11><div class="${ssrRenderClass([unref(confirming) && unref(selectedId) === entiteUser.entite_user_id ? "opacity-100" : "opacity-0", "absolute top-4 right-4 transition-all duration-300"])}" data-v-37e10e11>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "text-xl text-brand-400 animate-spin"
        }, null, _parent));
        _push(`</div><div class="relative mb-4" data-v-37e10e11><div class="w-16 h-16 rounded-full circle-badge flex items-center justify-center" data-v-37e10e11><span class="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-sky-600" data-v-37e10e11>${ssrInterpolate(getInitials(entiteUser.libelle))}</span></div><div class="${ssrRenderClass([entiteUser.is_interim ? "bg-orange-500" : "bg-emerald-500", "absolute -top-2 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md whitespace-nowrap"])}" data-v-37e10e11>${ssrInterpolate(entiteUser.is_interim ? "Int\xE9rim" : "Responsable")}</div></div><div class="space-y-2 flex-grow" data-v-37e10e11><div class="space-y-0.5" data-v-37e10e11><p class="text-xs font-bold text-emerald-500 uppercase tracking-wide" data-v-37e10e11>${ssrInterpolate((_a = entiteUser.fonction) != null ? _a : "\u2014")}</p><p class="text-[11px] font-semibold text-slate-400 dark:text-slate-500" data-v-37e10e11>${ssrInterpolate(entiteUser.code)}</p></div>`);
        if (entiteUser.parent_libelle && entiteUser.parent_libelle !== "-") {
          _push(`<div class="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700/50 w-full" data-v-37e10e11>`);
          _push(ssrRenderComponent(_component_UIcon, {
            name: "i-heroicons-building-office",
            class: "text-sm shrink-0"
          }, null, _parent));
          _push(`<span class="font-medium leading-tight" data-v-37e10e11>${ssrInterpolate(entiteUser.parent_libelle)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-4 flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs" data-v-37e10e11>`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-calendar",
          class: "text-sm"
        }, null, _parent));
        _push(`<span data-v-37e10e11>Depuis le ${ssrInterpolate(formatDate(entiteUser.date_debut))}</span></div></div></div>`);
      });
      _push(`<!--]--></div><p class="text-center text-slate-400 dark:text-slate-500 text-xs font-medium" data-v-37e10e11> Vous pourrez changer de poste depuis votre espace personnel </p></div><div class="fixed bottom-6 left-1/2 -translate-x-1/2" data-v-37e10e11><div class="glass-panel px-4 py-2 rounded-full flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500" data-v-37e10e11><div class="flex items-center gap-1" data-v-37e10e11>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-chart-bar",
        class: "text-sm"
      }, null, _parent));
      _push(`<span data-v-37e10e11>Syst\xE8me OK</span></div><div class="w-px h-3 bg-slate-200 dark:bg-slate-700" data-v-37e10e11></div>`);
      _push(ssrRenderComponent(_component_UIcon, {
        name: "i-heroicons-globe-alt",
        class: "text-sm"
      }, null, _parent));
      _push(`</div></div><div class="fixed bottom-6 left-6" data-v-37e10e11>`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        color: "gray",
        icon: "i-heroicons-arrow-left",
        class: "text-slate-400 hover:text-primary transition-colors font-medium text-sm",
        onClick: handleLogout
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Se d\xE9connecter `);
          } else {
            return [
              createTextVNode(" Se d\xE9connecter ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/choose-profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const chooseProfile = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-37e10e11"]]);

export { chooseProfile as default };
//# sourceMappingURL=choose-profile-Cw_o491m.mjs.map
