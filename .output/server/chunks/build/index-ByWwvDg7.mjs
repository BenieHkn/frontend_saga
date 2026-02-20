import __nuxt_component_0 from './Form-DHWxOx1a.mjs';
import __nuxt_component_1 from './FormGroup-BEdl0hCn.mjs';
import __nuxt_component_2 from './Input-3IU7zE8e.mjs';
import __nuxt_component_0$1 from './Checkbox-Nzn56Oau.mjs';
import __nuxt_component_2$1 from './Button-D4Pv8nAk.mjs';
import { _ as __nuxt_component_0$2 } from './nuxt-link-aS4hYwbM.mjs';
import { ref, mergeProps, unref, withCtx, createVNode, withModifiers, createBlock, openBlock, isRef, Transition, createCommentVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-Cv4D9cxh.mjs';
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
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import './button-Bz5rwL6o.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const showPassword = ref(false);
    const {
      form,
      rememberMe,
      loading,
      authError,
      successMessage,
      login
    } = useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UForm = __nuxt_component_0;
      const _component_UFormGroup = __nuxt_component_1;
      const _component_UInput = __nuxt_component_2;
      const _component_UCheckbox = __nuxt_component_0$1;
      const _component_UButton = __nuxt_component_2$1;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-800 to-blue-900 relative overflow-hidden p-6" }, _attrs))}><div class="absolute top-[-20px] left-[-20px] w-64 h-64 border-[16px] border-white/10 rounded-full"></div><div class="absolute bottom-10 right-10 w-32 h-32 border-8 border-white/5 rounded-full"></div><div class="absolute top-1/4 right-1/4 w-0 h-0 border-l-[20px] border-l-transparent border-b-[40px] border-b-white/10 border-r-[20px] border-r-transparent rotate-12"></div><div class="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10"><div class="text-white md:text-left text-center flex-1"><h1 class="text-9xl lg:ms-7 font-bold tracking-tight mb-2 drop-shadow-xl"> SAGA </h1><p class="text-xl tracking-[0.2em] font-light text-white/80"> Bienvenue sur notre plateforme... </p></div><div class="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl"><div class="space-y-6"><h1 class="text-5xl text-center text-white">Connexion</h1>`);
      _push(ssrRenderComponent(_component_UForm, {
        onSubmit: unref(login),
        state: unref(form),
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
                    placeholder: "Votre email",
                    color: "white",
                    variant: "outline",
                    size: "xl",
                    modelValue: unref(form).email,
                    "onUpdate:modelValue": ($event) => unref(form).email = $event,
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
                      placeholder: "Votre email",
                      color: "white",
                      variant: "outline",
                      size: "xl",
                      modelValue: unref(form).email,
                      "onUpdate:modelValue": ($event) => unref(form).email = $event,
                      class: "shadow-sm",
                      ui: {
                        rounded: "rounded-2xl",
                        base: "bg-white text-gray-900 focus:ring-emerald-400",
                        placeholder: "placeholder-gray-400"
                      }
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UFormGroup, {
              label: "Mot de passe",
              name: "password",
              ui: { label: { base: "text-white font-medium mb-2" } }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_UInput, {
                    type: unref(showPassword) ? "text" : "password",
                    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                    color: "white",
                    variant: "outline",
                    modelValue: unref(form).password,
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    size: "xl",
                    disabled: unref(loading),
                    ui: {
                      rounded: "rounded-2xl",
                      base: "bg-white text-gray-900 focus:ring-emerald-400",
                      placeholder: "placeholder-gray-400",
                      trailing: {
                        wrapper: "pointer-events-none",
                        padding: { xl: "pr-12" }
                      }
                    }
                  }, {
                    trailing: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<button type="button" class="pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none z-10" tabindex="-1"${_scopeId3}>`);
                        if (unref(showPassword)) {
                          _push4(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"${_scopeId3}><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"${_scopeId3}></path><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"${_scopeId3}></path></svg>`);
                        } else {
                          _push4(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"${_scopeId3}><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"${_scopeId3}></path><path d="M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z"${_scopeId3}></path></svg>`);
                        }
                        _push4(`</button>`);
                      } else {
                        return [
                          createVNode("button", {
                            type: "button",
                            onClick: withModifiers(($event) => showPassword.value = !unref(showPassword), ["stop"]),
                            class: "pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none z-10",
                            tabindex: "-1"
                          }, [
                            unref(showPassword) ? (openBlock(), createBlock("svg", {
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
                      type: unref(showPassword) ? "text" : "password",
                      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                      color: "white",
                      variant: "outline",
                      modelValue: unref(form).password,
                      "onUpdate:modelValue": ($event) => unref(form).password = $event,
                      size: "xl",
                      disabled: unref(loading),
                      ui: {
                        rounded: "rounded-2xl",
                        base: "bg-white text-gray-900 focus:ring-emerald-400",
                        placeholder: "placeholder-gray-400",
                        trailing: {
                          wrapper: "pointer-events-none",
                          padding: { xl: "pr-12" }
                        }
                      }
                    }, {
                      trailing: withCtx(() => [
                        createVNode("button", {
                          type: "button",
                          onClick: withModifiers(($event) => showPassword.value = !unref(showPassword), ["stop"]),
                          class: "pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none z-10",
                          tabindex: "-1"
                        }, [
                          unref(showPassword) ? (openBlock(), createBlock("svg", {
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
                    }, 8, ["type", "modelValue", "onUpdate:modelValue", "disabled"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(``);
            if (unref(authError)) {
              _push2(`<div class="p-4 bg-red-500/20 border border-red-400 rounded-lg"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="flex-shrink-0 mt-0.5"${_scopeId}><svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"${_scopeId}></path></svg></div><span class="text-white text-sm font-medium"${_scopeId}>${ssrInterpolate(unref(authError))}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(``);
            if (unref(successMessage)) {
              _push2(`<div class="p-4 bg-emerald-500/20 border border-emerald-400 rounded-lg"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><div class="flex-shrink-0 mt-0.5"${_scopeId}><svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId}></path></svg></div><span class="text-white text-sm font-medium"${_scopeId}>${ssrInterpolate(unref(successMessage))}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UCheckbox, {
              modelValue: unref(rememberMe),
              "onUpdate:modelValue": ($event) => isRef(rememberMe) ? rememberMe.value = $event : null,
              label: "Se souvenir de moi",
              name: "remember",
              disabled: unref(loading),
              ui: {
                label: "text-white text-sm",
                base: "h-5 w-5 border-white/30 checked:bg-emerald-500"
              }
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_component_UButton, {
              type: "submit",
              block: "",
              size: "xl",
              loading: unref(loading),
              disabled: unref(loading),
              class: "bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed font-bold tracking-widest py-4 mt-4 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100",
              ui: { rounded: "rounded-full" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (!unref(loading)) {
                    _push3(`<span${_scopeId2}>Se connecter</span>`);
                  } else {
                    _push3(`<span class="flex items-center gap-2"${_scopeId2}> Connexion en cours... </span>`);
                  }
                } else {
                  return [
                    !unref(loading) ? (openBlock(), createBlock("span", { key: 0 }, "Se connecter")) : (openBlock(), createBlock("span", {
                      key: 1,
                      class: "flex items-center gap-2"
                    }, " Connexion en cours... "))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UFormGroup, {
                label: "Email",
                name: "email",
                ui: { label: { base: "text-white font-medium mb-2" } }
              }, {
                default: withCtx(() => [
                  createVNode(_component_UInput, {
                    placeholder: "Votre email",
                    color: "white",
                    variant: "outline",
                    size: "xl",
                    modelValue: unref(form).email,
                    "onUpdate:modelValue": ($event) => unref(form).email = $event,
                    class: "shadow-sm",
                    ui: {
                      rounded: "rounded-2xl",
                      base: "bg-white text-gray-900 focus:ring-emerald-400",
                      placeholder: "placeholder-gray-400"
                    }
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                _: 1
              }),
              createVNode(_component_UFormGroup, {
                label: "Mot de passe",
                name: "password",
                ui: { label: { base: "text-white font-medium mb-2" } }
              }, {
                default: withCtx(() => [
                  createVNode(_component_UInput, {
                    type: unref(showPassword) ? "text" : "password",
                    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                    color: "white",
                    variant: "outline",
                    modelValue: unref(form).password,
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    size: "xl",
                    disabled: unref(loading),
                    ui: {
                      rounded: "rounded-2xl",
                      base: "bg-white text-gray-900 focus:ring-emerald-400",
                      placeholder: "placeholder-gray-400",
                      trailing: {
                        wrapper: "pointer-events-none",
                        padding: { xl: "pr-12" }
                      }
                    }
                  }, {
                    trailing: withCtx(() => [
                      createVNode("button", {
                        type: "button",
                        onClick: withModifiers(($event) => showPassword.value = !unref(showPassword), ["stop"]),
                        class: "pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none z-10",
                        tabindex: "-1"
                      }, [
                        unref(showPassword) ? (openBlock(), createBlock("svg", {
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
                  }, 8, ["type", "modelValue", "onUpdate:modelValue", "disabled"])
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
                  unref(authError) ? (openBlock(), createBlock("div", {
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
                      createVNode("span", { class: "text-white text-sm font-medium" }, toDisplayString(unref(authError)), 1)
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
                  unref(successMessage) ? (openBlock(), createBlock("div", {
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
                      createVNode("span", { class: "text-white text-sm font-medium" }, toDisplayString(unref(successMessage)), 1)
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode("div", { class: "flex items-center" }, [
                createVNode(_component_UCheckbox, {
                  modelValue: unref(rememberMe),
                  "onUpdate:modelValue": ($event) => isRef(rememberMe) ? rememberMe.value = $event : null,
                  label: "Se souvenir de moi",
                  name: "remember",
                  disabled: unref(loading),
                  ui: {
                    label: "text-white text-sm",
                    base: "h-5 w-5 border-white/30 checked:bg-emerald-500"
                  }
                }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled"])
              ]),
              createVNode(_component_UButton, {
                type: "submit",
                block: "",
                size: "xl",
                loading: unref(loading),
                disabled: unref(loading),
                class: "bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed font-bold tracking-widest py-4 mt-4 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100",
                ui: { rounded: "rounded-full" }
              }, {
                default: withCtx(() => [
                  !unref(loading) ? (openBlock(), createBlock("span", { key: 0 }, "Se connecter")) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "flex items-center gap-2"
                  }, " Connexion en cours... "))
                ]),
                _: 1
              }, 8, ["loading", "disabled"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="text-center space-y-4"><p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/connexion/mot_de_passe_oublie",
        class: "text-sm text-white hover:text-white transition-colors underline-offset-4 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Mot de passe oubli\xE9 ? Cliquez ici. `);
          } else {
            return [
              createTextVNode(" Mot de passe oubli\xE9 ? Cliquez ici. ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/connexion/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ByWwvDg7.mjs.map
