import __nuxt_component_0 from './Form-DHWxOx1a.mjs';
import __nuxt_component_1 from './FormGroup-BEdl0hCn.mjs';
import __nuxt_component_2 from './Input-3IU7zE8e.mjs';
import __nuxt_component_2$1 from './Button-D4Pv8nAk.mjs';
import { ref, mergeProps, withCtx, createVNode, createBlock, openBlock, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import './index-D7xvw7QP.mjs';
import './index-BLXEZ1Ia.mjs';
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
import './index-DJmPz9HS.mjs';
import './useFormGroup-2eEELX00.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './Link-SQZY3OU3.mjs';
import './nuxt-link-aS4hYwbM.mjs';
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import './button-Bz5rwL6o.mjs';

const _sfc_main = {
  __name: "mot_de_passe_oublie",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const loading = ref(false);
    const message = ref("");
    const error = ref("");
    const submit = async () => {
      var _a;
      message.value = "";
      error.value = "";
      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        error.value = "Veuillez entrer une adresse email valide.";
        return;
      }
      loading.value = true;
      try {
        const res = await $fetch("api/auth/forgot", {
          method: "POST",
          body: { email: email.value }
        });
        if (res.success) {
          message.value = "Un email de r\xE9initialisation a \xE9t\xE9 envoy\xE9.";
        } else {
          error.value = res.message || "Erreur lors de la demande.";
        }
      } catch (e) {
        error.value = ((_a = e.data) == null ? void 0 : _a.message) || "Erreur r\xE9seau.";
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UForm = __nuxt_component_0;
      const _component_UFormGroup = __nuxt_component_1;
      const _component_UInput = __nuxt_component_2;
      const _component_UButton = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-800 to-blue-900 relative overflow-hidden p-6" }, _attrs))}><div class="absolute top-[-20px] left-[-20px] w-64 h-64 border-[16px] border-white/10 rounded-full"></div><div class="absolute bottom-10 right-10 w-32 h-32 border-8 border-white/5 rounded-full"></div><div class="absolute top-1/4 right-1/4 w-0 h-0 border-l-[20px] border-l-transparent border-b-[40px] border-b-white/10 border-r-[20px] border-r-transparent rotate-12"></div><div class="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10"><div class="text-white md:text-left text-center flex-1"><h1 class="text-9xl lg:ms-7 font-bold tracking-tight mb-2 drop-shadow-xl"> SAGA </h1><p class="text-xl tracking-[0.2em] font-light text-white/80"> Bienvenue sur notre plateforme... </p></div><div class="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl"><div class="space-y-6"><h1 class="text-xl text-center text-white">Mot de passe oubli\xE9 ?</h1>`);
      _push(ssrRenderComponent(_component_UForm, {
        onSubmit: submit,
        class: "space-y-6"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Email",
              name: "email",
              ui: { label: { base: "text-white font-medium mb-2" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: email.value,
                    "onUpdate:modelValue": ($event) => email.value = $event,
                    placeholder: "Votre email",
                    color: "white",
                    variant: "outline",
                    size: "xl",
                    disabled: loading.value,
                    class: "shadow-sm",
                    ui: {
                      rounded: "rounded-2xl",
                      base: "bg-white text-gray-900 focus:ring-emerald-400",
                      placeholder: "placeholder-gray-400"
                    }
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: email.value,
                      "onUpdate:modelValue": ($event) => email.value = $event,
                      placeholder: "Votre email",
                      color: "white",
                      variant: "outline",
                      size: "xl",
                      disabled: loading.value,
                      class: "shadow-sm",
                      ui: {
                        rounded: "rounded-2xl",
                        base: "bg-white text-gray-900 focus:ring-emerald-400",
                        placeholder: "placeholder-gray-400"
                      }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              block: "",
              size: "xl",
              loading: loading.value,
              disabled: loading.value,
              class: "bg-white/10 backdrop-blur-md hover:bg-white/20 font-bold tracking-widest py-4 mt-4 transition-all duration-300 transform hover:scale-[1.02] border border-white/10",
              ui: { rounded: "rounded-full" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!loading.value) {
                    _push3(`<span${_scopeId2}>Envoyer</span>`);
                  } else {
                    _push3(`<span${_scopeId2}>Envoi en cours...</span>`);
                  }
                } else {
                  return [
                    !loading.value ? (openBlock(), createBlock("span", { key: 0 }, "Envoyer")) : (openBlock(), createBlock("span", { key: 1 }, "Envoi en cours..."))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (message.value) {
              _push2(`<div class="p-3 mt-2 bg-emerald-500/20 border border-emerald-400 rounded-lg text-white text-sm"${_scopeId}>${ssrInterpolate(message.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (error.value) {
              _push2(`<div class="p-3 mt-2 bg-red-500/20 border border-red-400 rounded-lg text-white text-sm"${_scopeId}>${ssrInterpolate(error.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(_component_UFormGroup, {
                label: "Email",
                name: "email",
                ui: { label: { base: "text-white font-medium mb-2" } }
              }, {
                default: withCtx(() => [
                  createVNode(_component_UInput, {
                    modelValue: email.value,
                    "onUpdate:modelValue": ($event) => email.value = $event,
                    placeholder: "Votre email",
                    color: "white",
                    variant: "outline",
                    size: "xl",
                    disabled: loading.value,
                    class: "shadow-sm",
                    ui: {
                      rounded: "rounded-2xl",
                      base: "bg-white text-gray-900 focus:ring-emerald-400",
                      placeholder: "placeholder-gray-400"
                    }
                  }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
                ]),
                _: 1
              }),
              createVNode(_component_UButton, {
                type: "submit",
                block: "",
                size: "xl",
                loading: loading.value,
                disabled: loading.value,
                class: "bg-white/10 backdrop-blur-md hover:bg-white/20 font-bold tracking-widest py-4 mt-4 transition-all duration-300 transform hover:scale-[1.02] border border-white/10",
                ui: { rounded: "rounded-full" }
              }, {
                default: withCtx(() => [
                  !loading.value ? (openBlock(), createBlock("span", { key: 0 }, "Envoyer")) : (openBlock(), createBlock("span", { key: 1 }, "Envoi en cours..."))
                ]),
                _: 1
              }, 8, ["loading", "disabled"]),
              message.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "p-3 mt-2 bg-emerald-500/20 border border-emerald-400 rounded-lg text-white text-sm"
              }, toDisplayString(message.value), 1)) : createCommentVNode("", true),
              error.value ? (openBlock(), createBlock("div", {
                key: 1,
                class: "p-3 mt-2 bg-red-500/20 border border-red-400 rounded-lg text-white text-sm"
              }, toDisplayString(error.value), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/connexion/mot_de_passe_oublie.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=mot_de_passe_oublie-CPDp54dp.mjs.map
