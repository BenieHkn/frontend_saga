import __nuxt_component_0 from './Form-DHWxOx1a.mjs';
import __nuxt_component_1 from './FormGroup-BEdl0hCn.mjs';
import __nuxt_component_2 from './Input-3IU7zE8e.mjs';
import __nuxt_component_2$1 from './Button-D4Pv8nAk.mjs';
import { ref, mergeProps, withCtx, createVNode, withModifiers, createBlock, openBlock, Transition, createCommentVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { n as navigateTo } from './server.mjs';
import './index-D7xvw7QP.mjs';
import './index-BLXEZ1Ia.mjs';
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
  __name: "modifier_mot_de_passe",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const newPassword = ref("");
    const confirmPassword = ref("");
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);
    const loading = ref(false);
    const message = ref("");
    const error = ref("");
    const submit = async () => {
      var _a;
      message.value = "";
      error.value = "";
      if (!newPassword.value || newPassword.value.length < 6) {
        error.value = "Le mot de passe doit contenir au moins 6 caract\xE8res.";
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        error.value = "Les mots de passe ne correspondent pas.";
        return;
      }
      loading.value = true;
      try {
        const token = route.query.token;
        const email = route.query.email;
        if (!token || !email) {
          error.value = "Token ou email manquant. V\xE9rifiez l'URL du lien re\xE7u par email.";
          loading.value = false;
          return;
        }
        const res = await $fetch("api/auth/change-password", {
          method: "POST",
          body: {
            password: newPassword.value,
            password_confirmation: confirmPassword.value,
            token,
            email
          }
        });
        if (res.success) {
          message.value = "Mot de passe modifi\xE9 avec succ\xE8s.";
          setTimeout(() => {
            navigateTo("/");
          }, 2e3);
        } else {
          error.value = res.message || "Erreur lors de la modification.";
        }
      } catch (e) {
        console.error("Erreur:", e);
        error.value = ((_a = e.data) == null ? void 0 : _a.message) || e.message || "Erreur r\xE9seau.";
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UForm = __nuxt_component_0;
      const _component_UFormGroup = __nuxt_component_1;
      const _component_UInput = __nuxt_component_2;
      const _component_UButton = __nuxt_component_2$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-800 to-blue-900 relative overflow-hidden p-6" }, _attrs))}><div class="absolute top-[-20px] left-[-20px] w-64 h-64 border-[16px] border-white/10 rounded-full"></div><div class="absolute bottom-10 right-10 w-32 h-32 border-8 border-white/5 rounded-full"></div><div class="absolute top-1/4 right-1/4 w-0 h-0 border-l-[20px] border-l-transparent border-b-[40px] border-b-white/10 border-r-[20px] border-r-transparent rotate-12"></div><div class="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10"><div class="text-white md:text-left text-center flex-1"><h1 class="text-9xl lg:ms-7 font-bold tracking-tight mb-2 drop-shadow-xl"> SAGA </h1><p class="text-xl tracking-[0.2em] font-light text-white/80"> Bienvenue sur notre plateforme... </p></div><div class="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl"><div class="space-y-6"><h1 class="text-4xl text-center text-white">Modifier le mot de passe</h1>`);
      _push(ssrRenderComponent(_component_UForm, {
        onSubmit: submit,
        class: "space-y-6"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Nouveau mot de passe",
              name: "newPassword",
              ui: { label: { base: "text-white font-medium mb-2" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: newPassword.value,
                    "onUpdate:modelValue": ($event) => newPassword.value = $event,
                    type: showNewPassword.value ? "text" : "password",
                    placeholder: "Entrer le nouveau mot de passe",
                    color: "white",
                    variant: "outline",
                    size: "xl",
                    disabled: loading.value,
                    ui: {
                      rounded: "rounded-2xl",
                      base: "bg-white text-gray-900 focus:ring-emerald-400",
                      placeholder: "placeholder-gray-400",
                      trailing: { padding: { xl: "pr-12" } }
                    }
                  }, {
                    trailing: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<button type="button" class="pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none" tabindex="-1"${_scopeId3}>`);
                        if (showNewPassword.value) {
                          _push4(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"${_scopeId3}><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"${_scopeId3}></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"${_scopeId3}></path></svg>`);
                        } else {
                          _push4(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"${_scopeId3}><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"${_scopeId3}></path><path d="M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z"${_scopeId3}></path></svg>`);
                        }
                        _push4(`</button>`);
                      } else {
                        return [
                          createVNode("button", {
                            type: "button",
                            onClick: withModifiers(($event) => showNewPassword.value = !showNewPassword.value, ["stop"]),
                            class: "pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none",
                            tabindex: "-1"
                          }, [
                            showNewPassword.value ? (openBlock(), createBlock("svg", {
                              key: 0,
                              class: "w-5 h-5",
                              fill: "currentColor",
                              viewBox: "0 0 20 20"
                            }, [
                              createVNode("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }),
                              createVNode("path", {
                                "fill-rule": "evenodd",
                                d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                                "clip-rule": "evenodd"
                              })
                            ])) : (openBlock(), createBlock("svg", {
                              key: 1,
                              class: "w-5 h-5",
                              fill: "currentColor",
                              viewBox: "0 0 20 20"
                            }, [
                              createVNode("path", {
                                "fill-rule": "evenodd",
                                d: "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z",
                                "clip-rule": "evenodd"
                              }),
                              createVNode("path", { d: "M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z" })
                            ]))
                          ], 8, ["onClick"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: newPassword.value,
                      "onUpdate:modelValue": ($event) => newPassword.value = $event,
                      type: showNewPassword.value ? "text" : "password",
                      placeholder: "Entrer le nouveau mot de passe",
                      color: "white",
                      variant: "outline",
                      size: "xl",
                      disabled: loading.value,
                      ui: {
                        rounded: "rounded-2xl",
                        base: "bg-white text-gray-900 focus:ring-emerald-400",
                        placeholder: "placeholder-gray-400",
                        trailing: { padding: { xl: "pr-12" } }
                      }
                    }, {
                      trailing: withCtx(() => [
                        createVNode("button", {
                          type: "button",
                          onClick: withModifiers(($event) => showNewPassword.value = !showNewPassword.value, ["stop"]),
                          class: "pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none",
                          tabindex: "-1"
                        }, [
                          showNewPassword.value ? (openBlock(), createBlock("svg", {
                            key: 0,
                            class: "w-5 h-5",
                            fill: "currentColor",
                            viewBox: "0 0 20 20"
                          }, [
                            createVNode("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }),
                            createVNode("path", {
                              "fill-rule": "evenodd",
                              d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                              "clip-rule": "evenodd"
                            })
                          ])) : (openBlock(), createBlock("svg", {
                            key: 1,
                            class: "w-5 h-5",
                            fill: "currentColor",
                            viewBox: "0 0 20 20"
                          }, [
                            createVNode("path", {
                              "fill-rule": "evenodd",
                              d: "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z",
                              "clip-rule": "evenodd"
                            }),
                            createVNode("path", { d: "M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z" })
                          ]))
                        ], 8, ["onClick"])
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue", "type", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Confirmer le mot de passe",
              name: "confirmPassword",
              ui: { label: { base: "text-white font-medium mb-2" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: confirmPassword.value,
                    "onUpdate:modelValue": ($event) => confirmPassword.value = $event,
                    type: showConfirmPassword.value ? "text" : "password",
                    placeholder: "Confirmer",
                    color: "white",
                    variant: "outline",
                    size: "xl",
                    disabled: loading.value,
                    ui: {
                      rounded: "rounded-2xl",
                      base: "bg-white text-gray-900 focus:ring-emerald-400",
                      placeholder: "placeholder-gray-400",
                      trailing: { padding: { xl: "pr-12" } }
                    }
                  }, {
                    trailing: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<button type="button" class="pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none" tabindex="-1"${_scopeId3}>`);
                        if (showConfirmPassword.value) {
                          _push4(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"${_scopeId3}><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"${_scopeId3}></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"${_scopeId3}></path></svg>`);
                        } else {
                          _push4(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"${_scopeId3}><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"${_scopeId3}></path><path d="M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z"${_scopeId3}></path></svg>`);
                        }
                        _push4(`</button>`);
                      } else {
                        return [
                          createVNode("button", {
                            type: "button",
                            onClick: withModifiers(($event) => showConfirmPassword.value = !showConfirmPassword.value, ["stop"]),
                            class: "pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none",
                            tabindex: "-1"
                          }, [
                            showConfirmPassword.value ? (openBlock(), createBlock("svg", {
                              key: 0,
                              class: "w-5 h-5",
                              fill: "currentColor",
                              viewBox: "0 0 20 20"
                            }, [
                              createVNode("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }),
                              createVNode("path", {
                                "fill-rule": "evenodd",
                                d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                                "clip-rule": "evenodd"
                              })
                            ])) : (openBlock(), createBlock("svg", {
                              key: 1,
                              class: "w-5 h-5",
                              fill: "currentColor",
                              viewBox: "0 0 20 20"
                            }, [
                              createVNode("path", {
                                "fill-rule": "evenodd",
                                d: "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z",
                                "clip-rule": "evenodd"
                              }),
                              createVNode("path", { d: "M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z" })
                            ]))
                          ], 8, ["onClick"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_UInput, {
                      modelValue: confirmPassword.value,
                      "onUpdate:modelValue": ($event) => confirmPassword.value = $event,
                      type: showConfirmPassword.value ? "text" : "password",
                      placeholder: "Confirmer",
                      color: "white",
                      variant: "outline",
                      size: "xl",
                      disabled: loading.value,
                      ui: {
                        rounded: "rounded-2xl",
                        base: "bg-white text-gray-900 focus:ring-emerald-400",
                        placeholder: "placeholder-gray-400",
                        trailing: { padding: { xl: "pr-12" } }
                      }
                    }, {
                      trailing: withCtx(() => [
                        createVNode("button", {
                          type: "button",
                          onClick: withModifiers(($event) => showConfirmPassword.value = !showConfirmPassword.value, ["stop"]),
                          class: "pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none",
                          tabindex: "-1"
                        }, [
                          showConfirmPassword.value ? (openBlock(), createBlock("svg", {
                            key: 0,
                            class: "w-5 h-5",
                            fill: "currentColor",
                            viewBox: "0 0 20 20"
                          }, [
                            createVNode("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }),
                            createVNode("path", {
                              "fill-rule": "evenodd",
                              d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                              "clip-rule": "evenodd"
                            })
                          ])) : (openBlock(), createBlock("svg", {
                            key: 1,
                            class: "w-5 h-5",
                            fill: "currentColor",
                            viewBox: "0 0 20 20"
                          }, [
                            createVNode("path", {
                              "fill-rule": "evenodd",
                              d: "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z",
                              "clip-rule": "evenodd"
                            }),
                            createVNode("path", { d: "M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z" })
                          ]))
                        ], 8, ["onClick"])
                      ]),
                      _: 1
                    }, 8, ["modelValue", "onUpdate:modelValue", "type", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(``);
            if (message.value) {
              _push2(`<div class="p-4 bg-emerald-500/20 border border-emerald-400 rounded-lg"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="flex-shrink-0 mt-0.5"${_scopeId}><svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId}></path></svg></div><span class="text-white text-sm font-medium"${_scopeId}>${ssrInterpolate(message.value)}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(``);
            if (error.value) {
              _push2(`<div class="p-4 bg-red-500/20 border border-red-400 rounded-lg"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="flex-shrink-0 mt-0.5"${_scopeId}><svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"${_scopeId}></path></svg></div><span class="text-white text-sm font-medium"${_scopeId}>${ssrInterpolate(error.value)}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              block: "",
              size: "xl",
              loading: loading.value,
              disabled: loading.value,
              class: "bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed font-bold tracking-widest py-4 mt-4 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100",
              ui: { rounded: "rounded-full" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!loading.value) {
                    _push3(`<span${_scopeId2}>Modifier</span>`);
                  } else {
                    _push3(`<span${_scopeId2}>Modification...</span>`);
                  }
                } else {
                  return [
                    !loading.value ? (openBlock(), createBlock("span", { key: 0 }, "Modifier")) : (openBlock(), createBlock("span", { key: 1 }, "Modification..."))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UFormGroup, {
                label: "Nouveau mot de passe",
                name: "newPassword",
                ui: { label: { base: "text-white font-medium mb-2" } }
              }, {
                default: withCtx(() => [
                  createVNode(_component_UInput, {
                    modelValue: newPassword.value,
                    "onUpdate:modelValue": ($event) => newPassword.value = $event,
                    type: showNewPassword.value ? "text" : "password",
                    placeholder: "Entrer le nouveau mot de passe",
                    color: "white",
                    variant: "outline",
                    size: "xl",
                    disabled: loading.value,
                    ui: {
                      rounded: "rounded-2xl",
                      base: "bg-white text-gray-900 focus:ring-emerald-400",
                      placeholder: "placeholder-gray-400",
                      trailing: { padding: { xl: "pr-12" } }
                    }
                  }, {
                    trailing: withCtx(() => [
                      createVNode("button", {
                        type: "button",
                        onClick: withModifiers(($event) => showNewPassword.value = !showNewPassword.value, ["stop"]),
                        class: "pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none",
                        tabindex: "-1"
                      }, [
                        showNewPassword.value ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "w-5 h-5",
                          fill: "currentColor",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }),
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                            "clip-rule": "evenodd"
                          })
                        ])) : (openBlock(), createBlock("svg", {
                          key: 1,
                          class: "w-5 h-5",
                          fill: "currentColor",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z",
                            "clip-rule": "evenodd"
                          }),
                          createVNode("path", { d: "M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z" })
                        ]))
                      ], 8, ["onClick"])
                    ]),
                    _: 1
                  }, 8, ["modelValue", "onUpdate:modelValue", "type", "disabled"])
                ]),
                _: 1
              }),
              createVNode(_component_UFormGroup, {
                label: "Confirmer le mot de passe",
                name: "confirmPassword",
                ui: { label: { base: "text-white font-medium mb-2" } }
              }, {
                default: withCtx(() => [
                  createVNode(_component_UInput, {
                    modelValue: confirmPassword.value,
                    "onUpdate:modelValue": ($event) => confirmPassword.value = $event,
                    type: showConfirmPassword.value ? "text" : "password",
                    placeholder: "Confirmer",
                    color: "white",
                    variant: "outline",
                    size: "xl",
                    disabled: loading.value,
                    ui: {
                      rounded: "rounded-2xl",
                      base: "bg-white text-gray-900 focus:ring-emerald-400",
                      placeholder: "placeholder-gray-400",
                      trailing: { padding: { xl: "pr-12" } }
                    }
                  }, {
                    trailing: withCtx(() => [
                      createVNode("button", {
                        type: "button",
                        onClick: withModifiers(($event) => showConfirmPassword.value = !showConfirmPassword.value, ["stop"]),
                        class: "pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none",
                        tabindex: "-1"
                      }, [
                        showConfirmPassword.value ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "w-5 h-5",
                          fill: "currentColor",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", { d: "M10 12a2 2 0 100-4 2 2 0 000 4z" }),
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
                            "clip-rule": "evenodd"
                          })
                        ])) : (openBlock(), createBlock("svg", {
                          key: 1,
                          class: "w-5 h-5",
                          fill: "currentColor",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z",
                            "clip-rule": "evenodd"
                          }),
                          createVNode("path", { d: "M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z" })
                        ]))
                      ], 8, ["onClick"])
                    ]),
                    _: 1
                  }, 8, ["modelValue", "onUpdate:modelValue", "type", "disabled"])
                ]),
                _: 1
              }),
              createVNode(Transition, {
                "enter-active-class": "transition duration-300 ease-out",
                "enter-from-class": "transform opacity-0 -translate-y-2",
                "enter-to-class": "transform opacity-100 translate-y-0",
                "leave-active-class": "transition duration-200 ease-in",
                "leave-from-class": "transform opacity-100 translate-y-0",
                "leave-to-class": "transform opacity-0 -translate-y-2"
              }, {
                default: withCtx(() => [
                  message.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "p-4 bg-emerald-500/20 border border-emerald-400 rounded-lg"
                  }, [
                    createVNode("div", { class: "flex items-start gap-3" }, [
                      createVNode("div", { class: "flex-shrink-0 mt-0.5" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 text-emerald-400",
                          fill: "currentColor",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                            "clip-rule": "evenodd"
                          })
                        ]))
                      ]),
                      createVNode("span", { class: "text-white text-sm font-medium" }, toDisplayString(message.value), 1)
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(Transition, {
                "enter-active-class": "transition duration-300 ease-out",
                "enter-from-class": "transform opacity-0 -translate-y-2",
                "enter-to-class": "transform opacity-100 translate-y-0",
                "leave-active-class": "transition duration-200 ease-in",
                "leave-from-class": "transform opacity-100 translate-y-0",
                "leave-to-class": "transform opacity-0 -translate-y-2"
              }, {
                default: withCtx(() => [
                  error.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "p-4 bg-red-500/20 border border-red-400 rounded-lg"
                  }, [
                    createVNode("div", { class: "flex items-start gap-3" }, [
                      createVNode("div", { class: "flex-shrink-0 mt-0.5" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5 text-red-400",
                          fill: "currentColor",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", {
                            "fill-rule": "evenodd",
                            d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                            "clip-rule": "evenodd"
                          })
                        ]))
                      ]),
                      createVNode("span", { class: "text-white text-sm font-medium" }, toDisplayString(error.value), 1)
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(_component_UButton, {
                type: "submit",
                block: "",
                size: "xl",
                loading: loading.value,
                disabled: loading.value,
                class: "bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed font-bold tracking-widest py-4 mt-4 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100",
                ui: { rounded: "rounded-full" }
              }, {
                default: withCtx(() => [
                  !loading.value ? (openBlock(), createBlock("span", { key: 0 }, "Modifier")) : (openBlock(), createBlock("span", { key: 1 }, "Modification..."))
                ]),
                _: 1
              }, 8, ["loading", "disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/connexion/modifier_mot_de_passe.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=modifier_mot_de_passe-DqzDlBav.mjs.map
