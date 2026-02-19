import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import __nuxt_component_2$1 from './Input-3IU7zE8e.mjs';
import __nuxt_component_1 from './SelectMenu-DFVs1VlK.mjs';
import { u as useHead, v as useRoute, n as navigateTo, c as useRuntimeConfig } from './server.mjs';
import { ref, computed, mergeProps, withCtx, createTextVNode, unref, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { u as useToast } from './useToast-VyEsrynn.mjs';
import './Link-SQZY3OU3.mjs';
import './nuxt-link-aS4hYwbM.mjs';
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
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './link-Bz3Wc5MF.mjs';
import 'pinia';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './Icon-BEWG_Jy9.mjs';
import './index-DJmPz9HS.mjs';
import './tooltip-lourJnw0.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './button-Bz5rwL6o.mjs';
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';
import './Avatar-BE6on_fb.mjs';
import './combobox-DW6kaaFu.mjs';
import './form-DsUILy5F.mjs';
import './active-element-history-Cer4cSOw.mjs';
import './micro-task-B6uncIso.mjs';
import './keyboard-BCt0ZeLv.mjs';
import './use-outside-click-BqFFeIfQ.mjs';
import './focus-management-CclPs0xY.mjs';
import './use-resolve-button-type-CCTzT7JK.mjs';
import './calculate-active-index-BN0T2bP2.mjs';
import './hidden-e5tlhUcy.mjs';
import './open-closed-DaveoKA1.mjs';
import './use-text-value-CScX7TKV.mjs';
import './index-D7xvw7QP.mjs';
import './usePopper-BrvKSG9Z.mjs';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Modification d'un Utilisateur" });
    const route = useRoute();
    const userId = route.params.id;
    const loading = ref(false);
    const loadingInitial = ref(true);
    ref(false);
    ref(false);
    const savingFonction = ref(false);
    const changePassword = ref(false);
    const authToken = ref("");
    const errorRequest = ref(null);
    const showSuccessModal = ref(false);
    const showFonctionModal = ref(false);
    const config = useRuntimeConfig();
    const fileInput = ref(null);
    const form = ref({
      id: null,
      matricule: "",
      nom: "",
      prenoms: "",
      email: "",
      telephone: "",
      password: "",
      password_confirmation: "",
      datePriseService: "",
      estAdministrateur: false,
      statut: true,
      points_critiques: [],
      estResponsable: false
    });
    const errors = ref([]);
    const fonctions = ref([]);
    const entites = ref([]);
    const currentFonctions = ref([]);
    const modal = ref({
      fonction_id: null,
      debut: "",
      fin: "",
      is_interim: false,
      piece_jointe_file: null,
      piece_jointe_nom: ""
    });
    const isFormValid = computed(() => {
      const baseValid = form.value.matricule.trim() !== "" && form.value.nom.trim() !== "" && form.value.prenoms.trim() !== "" && form.value.email.trim() !== "";
      if (changePassword.value) {
        return baseValid && form.value.password.trim() !== "" && form.value.password_confirmation.trim() !== "";
      }
      return baseValid;
    });
    const isResponsable = computed(
      () => currentFonctions.value.some((f) => !f.is_interim && f.actif)
    );
    computed(() => isResponsable.value ? "Responsable" : "Agent");
    const fonctionsOptions = computed(
      () => fonctions.value.map((f) => {
        var _a;
        return {
          id: f.id,
          libelle: f.libelle || f.code,
          code: f.code,
          entite_libelle: ((_a = f.entite) == null ? void 0 : _a.libelle) || f.entite_libelle || ""
        };
      })
    );
    const formatDateShort = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR");
    };
    const formatFileSize = (bytes) => {
      if (!bytes) return "";
      if (bytes < 1024) return bytes + " o";
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " Ko";
      return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
    };
    const removeFile = () => {
      modal.value.piece_jointe_file = null;
      modal.value.piece_jointe_nom = "";
      if (fileInput.value) fileInput.value.value = "";
    };
    const closeFonctionModal = () => {
      showFonctionModal.value = false;
      removeFile();
      modal.value = { fonction_id: null, debut: "", fin: "", is_interim: false, piece_jointe_file: null, piece_jointe_nom: "" };
    };
    const saveFonctionModal = async () => {
      var _a, _b;
      if (!modal.value.fonction_id) {
        useToast().add({ title: "Erreur", description: "Veuillez s\xE9lectionner une fonction", color: "red" });
        return;
      }
      const existe = currentFonctions.value.find((cf) => cf.id == modal.value.fonction_id);
      if (existe) {
        useToast().add({ title: "Attention", description: "Cette fonction est d\xE9j\xE0 attribu\xE9e", color: "orange" });
        return;
      }
      const f = fonctions.value.find((x) => x.id == modal.value.fonction_id);
      if (!f) return;
      savingFonction.value = true;
      try {
        const formData = new FormData();
        formData.append("fonction_id", modal.value.fonction_id);
        formData.append("user_id", userId);
        formData.append("actif", "1");
        formData.append("is_interim", modal.value.is_interim ? "1" : "0");
        if (modal.value.debut) formData.append("date_debut", modal.value.debut);
        if (modal.value.fin) formData.append("date_fin", modal.value.fin);
        if (modal.value.piece_jointe_file) {
          formData.append("piece_jointe", modal.value.piece_jointe_file);
        }
        const response = await $fetch(
          `${config.public.apiBase}/fonction-users`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken.value}`,
              Accept: "application/json"
            },
            body: formData
          }
        );
        if (!response.success) {
          throw new Error(response.message || "Erreur lors de l'enregistrement");
        }
        const saved = response.data;
        currentFonctions.value.push({
          fonction_user_id: saved.id,
          id: saved.fonction_id,
          libelle: f.libelle,
          actif: saved.actif,
          debut: saved.date_debut || "",
          fin: saved.date_fin || "",
          is_interim: saved.is_interim,
          piece_jointe: saved.piece_jointe || "",
          piece_jointe_nom: saved.piece_jointe ? saved.piece_jointe.split("/").pop() : modal.value.piece_jointe_nom || "",
          piece_jointe_url: saved.piece_jointe_url || null
        });
        useToast().add({
          title: "Fonction ajout\xE9e",
          description: `"${f.libelle}" a \xE9t\xE9 enregistr\xE9e avec succ\xE8s`,
          color: "green"
        });
        closeFonctionModal();
      } catch (error) {
        console.error("\u274C Erreur enregistrement fonction-user:", error);
        if ((_a = error.data) == null ? void 0 : _a.errors) {
          const msgs = Object.values(error.data.errors).flat();
          useToast().add({ title: "Erreur de validation", description: msgs[0], color: "red" });
        } else {
          useToast().add({
            title: "Erreur",
            description: ((_b = error.data) == null ? void 0 : _b.message) || error.message || "Erreur lors de l'enregistrement",
            color: "red"
          });
        }
      } finally {
        savingFonction.value = false;
      }
    };
    const removeFonction = async (idx, fn) => {
      if (fn.fonction_user_id) {
        fn.deleting = true;
        try {
          await $fetch(
            `${config.public.apiBase}/fonction-users/${fn.fonction_user_id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${authToken.value}`, Accept: "application/json" }
            }
          );
          currentFonctions.value.splice(idx, 1);
          useToast().add({ title: "Supprim\xE9", description: `Fonction "${fn.libelle}" retir\xE9e`, color: "green" });
        } catch (error) {
          fn.deleting = false;
          useToast().add({ title: "Erreur", description: "Impossible de supprimer la fonction", color: "red" });
        }
      } else {
        currentFonctions.value.splice(idx, 1);
      }
    };
    const handleCancel = () => navigateTo("/utilisateurs");
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_UButton = __nuxt_component_2;
      const _component_UInput = __nuxt_component_2$1;
      const _component_USelectMenu = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><div class="max-w-7xl mx-auto p-6"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-12"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><div class="flex justify-end">`);
      _push(ssrRenderComponent(_component_UButton, {
        to: "/utilisateurs",
        icon: "i-heroicons-arrow-left",
        color: "green",
        variant: "soft"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Retour \xE0 la liste `);
          } else {
            return [
              createTextVNode(" Retour \xE0 la liste ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loadingInitial)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-4 text-slate-500"><div class="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div><span class="text-sm font-medium">Chargement des donn\xE9es...</span></div>`);
      } else {
        _push(`<form class="space-y-6 mt-6 max-w-3xl mx-auto"><div class="flex items-center gap-6 pt-4 border-t"><label class="flex items-center gap-2 cursor-pointer"><input${ssrIncludeBooleanAttr(unref(form).estResponsable) ? " checked" : ""} type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).estResponsable) ? ssrLooseContain(unref(form).estResponsable, null) : unref(form).estResponsable) ? " checked" : ""} class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"><span class="text-sm font-medium text-gray-700">Est Responsable</span></label></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Entit\xE9s <span class="text-red-600">*</span></label><select class="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"><option value="" disabled${ssrIncludeBooleanAttr(Array.isArray(unref(form).entite_id) ? ssrLooseContain(unref(form).entite_id, "") : ssrLooseEqual(unref(form).entite_id, "")) ? " selected" : ""}>S\xE9lectionner une entit\xE9</option><!--[-->`);
        ssrRenderList(unref(entites), (entite) => {
          _push(`<option${ssrRenderAttr("value", entite.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).entite_id) ? ssrLooseContain(unref(form).entite_id, entite.id) : ssrLooseEqual(unref(form).entite_id, entite.id)) ? " selected" : ""}>${ssrInterpolate(entite.libelle)}</option>`);
        });
        _push(`<!--]--></select></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Matricule<span class="text-red-600">*</span></label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).matricule,
          "onUpdate:modelValue": ($event) => unref(form).matricule = $event,
          placeholder: "Ex: MAT001, EMP2024...",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Nom<span class="text-red-600">*</span></label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).nom,
          "onUpdate:modelValue": ($event) => unref(form).nom = $event,
          placeholder: "Ex: DUPONT",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Pr\xE9noms<span class="text-red-600">*</span></label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).prenoms,
          "onUpdate:modelValue": ($event) => unref(form).prenoms = $event,
          placeholder: "Ex: Jean Pierre",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Email<span class="text-red-600">*</span></label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).email,
          "onUpdate:modelValue": ($event) => unref(form).email = $event,
          type: "email",
          placeholder: "Ex: jean.dupont@example.com",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">T\xE9l\xE9phone</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).telephone,
          "onUpdate:modelValue": ($event) => unref(form).telephone = $event,
          placeholder: "Ex: +229 XX XX XX XX",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div></div><div class="bg-blue-50 border border-blue-200 rounded-lg p-4"><label class="flex items-center gap-2 cursor-pointer mb-3"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(changePassword)) ? ssrLooseContain(unref(changePassword), null) : unref(changePassword)) ? " checked" : ""} class="w-4 h-4 text-indigo-600 border-gray-300 rounded"><span class="text-sm font-medium text-blue-900">Modifier le mot de passe</span></label>`);
        if (unref(changePassword)) {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Nouveau mot de passe </label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(form).password,
            "onUpdate:modelValue": ($event) => unref(form).password = $event,
            type: "password",
            placeholder: "Minimum 8 caract\xE8res",
            class: "w-full h-12"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Confirmer le mot de passe </label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(form).password_confirmation,
            "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
            type: "password",
            placeholder: "Confirmer le mot de passe",
            class: "w-full h-12"
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date de prise de service</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).datePriseService,
          "onUpdate:modelValue": ($event) => unref(form).datePriseService = $event,
          type: "date",
          class: "w-full md:w-1/2 h-12"
        }, null, _parent));
        _push(`</div><div><div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(currentFonctions), (fn, idx) => {
          _push(`<div class="flex items-start justify-between gap-3 bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg"><div class="flex-1 space-y-1"><div class="flex items-center gap-3 flex-wrap"><label class="flex items-center gap-1.5 cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(fn.actif) ? ssrLooseContain(fn.actif, null) : fn.actif) ? " checked" : ""} class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"><span class="text-xs font-medium text-blue-800">Actif</span></label><span class="text-sm font-semibold text-blue-900">${ssrInterpolate(fn.libelle)}</span>`);
          if (fn.is_interim) {
            _push(`<span class="text-[11px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium"> Int\xE9rim </span>`);
          } else {
            _push(`<!---->`);
          }
          if (fn.piece_jointe_url) {
            _push(`<a${ssrRenderAttr("href", fn.piece_jointe_url)} target="_blank" class="text-[11px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1 hover:bg-green-200 transition-colors" title="Voir la pi\xE8ce jointe"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg> ${ssrInterpolate(fn.piece_jointe_nom || "Voir la pi\xE8ce jointe")}</a>`);
          } else if (fn.piece_jointe_file && !fn.piece_jointe_url) {
            _push(`<span class="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg> ${ssrInterpolate(fn.piece_jointe_nom || "Document")}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="text-xs text-slate-500">`);
          if (fn.debut) {
            _push(`<span>D\xE9but : ${ssrInterpolate(formatDateShort(fn.debut))}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (fn.debut && fn.fin) {
            _push(`<span> \u2022 </span>`);
          } else {
            _push(`<!---->`);
          }
          if (fn.fin) {
            _push(`<span>Fin : ${ssrInterpolate(formatDateShort(fn.fin))}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (!fn.debut && !fn.fin) {
            _push(`<span class="italic">Aucune date d\xE9finie</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex items-center gap-1 text-[10px]">`);
          if (fn.fonction_user_id) {
            _push(`<span class="flex items-center gap-1 text-green-600 font-medium"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Enregistr\xE9e en base </span>`);
          } else {
            _push(`<span class="flex items-center gap-1 text-orange-500 font-medium"><span class="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span> En attente de sauvegarde </span>`);
          }
          _push(`</div></div><div class="flex items-center gap-2 flex-shrink-0">`);
          _push(ssrRenderComponent(_component_UButton, {
            type: "button",
            color: "red",
            variant: "soft",
            size: "xs",
            onClick: ($event) => removeFonction(idx, fn),
            loading: fn.deleting
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Supprimer `);
              } else {
                return [
                  createTextVNode(" Supprimer ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div><div class="flex items-center gap-6 pt-4 border-t"><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).estAdministrateur) ? ssrLooseContain(unref(form).estAdministrateur, null) : unref(form).estAdministrateur) ? " checked" : ""} class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"><span class="text-sm font-medium text-gray-700">Est administrateur</span></label><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).statut) ? ssrLooseContain(unref(form).statut, null) : unref(form).statut) ? " checked" : ""} class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"><span class="text-sm font-medium text-gray-700">Compte actif</span></label></div><div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">`);
        _push(ssrRenderComponent(_component_UButton, {
          type: "button",
          onClick: handleCancel,
          color: "gray",
          variant: "outline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ANNULER `);
            } else {
              return [
                createTextVNode(" ANNULER ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          disabled: !unref(isFormValid) || unref(loading),
          type: "submit",
          class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white",
          loading: unref(loading)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` METTRE \xC0 JOUR `);
            } else {
              return [
                createTextVNode(" METTRE \xC0 JOUR ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(errors).length > 0) {
          _push(`<div class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"><h4 class="text-sm font-bold text-red-900 mb-2">Erreurs de validation :</h4><ul class="list-disc list-inside text-sm text-red-600"><!--[-->`);
          ssrRenderList(unref(errors), (error, index) => {
            _push(`<li>${ssrInterpolate(error)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(errorRequest)) {
          _push(`<div class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4"><p class="text-sm font-bold text-red-900">Erreur serveur :</p><p class="text-sm text-red-600 mt-1">${ssrInterpolate(unref(errorRequest).message || ((_a = unref(errorRequest).data) == null ? void 0 : _a.message) || "Une erreur est survenue")}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form>`);
      }
      _push(`</div></div></div>`);
      if (unref(showFonctionModal)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"><div class="bg-white rounded-xl shadow-xl w-full max-w-lg"><div class="flex items-center justify-between px-6 py-4 border-b border-gray-200"><h3 class="text-lg font-semibold text-gray-900">Ajouter une fonction</h3><button class="text-gray-400 hover:text-gray-600 transition-colors"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="px-6 py-5 space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Fonction <span class="text-red-600">*</span></label>`);
        _push(ssrRenderComponent(_component_USelectMenu, {
          modelValue: unref(modal).fonction_id,
          "onUpdate:modelValue": ($event) => unref(modal).fonction_id = $event,
          options: unref(fonctionsOptions),
          placeholder: "S\xE9lectionner une fonction",
          "value-attribute": "id",
          "option-attribute": "libelle",
          searchable: "",
          "searchable-placeholder": "Rechercher...",
          class: "w-full"
        }, {
          option: withCtx(({ option }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col py-0.5"${_scopeId}><span class="font-semibold text-sm"${_scopeId}>${ssrInterpolate(option.libelle)}</span>`);
              if (option.entite_libelle) {
                _push2(`<span class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(option.entite_libelle)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col py-0.5" }, [
                  createVNode("span", { class: "font-semibold text-sm" }, toDisplayString(option.libelle), 1),
                  option.entite_libelle ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "text-xs text-gray-400"
                  }, toDisplayString(option.entite_libelle), 1)) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Date d\xE9but</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(modal).debut,
          "onUpdate:modelValue": ($event) => unref(modal).debut = $event,
          type: "date",
          class: "w-full h-10"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date fin</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(modal).fin,
          "onUpdate:modelValue": ($event) => unref(modal).fin = $event,
          type: "date",
          class: "w-full h-10"
        }, null, _parent));
        _push(`</div></div><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(modal).is_interim) ? ssrLooseContain(unref(modal).is_interim, null) : unref(modal).is_interim) ? " checked" : ""} class="w-4 h-4 text-indigo-600 border-gray-300 rounded"><span class="text-sm font-medium text-gray-700">Fonction en int\xE9rim</span></label><div><label class="block text-sm font-medium text-gray-700 mb-2">Pi\xE8ce jointe</label><div class="${ssrRenderClass([unref(modal).piece_jointe_file ? "border-green-300 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50", "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors"])}"><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden">`);
        if (unref(modal).piece_jointe_file) {
          _push(`<div class="flex items-center justify-between gap-3"><div class="flex items-center gap-2 min-w-0"><svg class="w-8 h-8 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><div class="text-left min-w-0"><p class="text-sm font-medium text-gray-800 truncate">${ssrInterpolate(unref(modal).piece_jointe_file.name)}</p><p class="text-xs text-gray-500">${ssrInterpolate(formatFileSize(unref(modal).piece_jointe_file.size))}</p></div></div><button type="button" class="flex-shrink-0 p-1 rounded-full text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        } else {
          _push(`<div class="flex flex-col items-center gap-2 py-2"><svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg><p class="text-sm text-gray-500"><span class="font-medium text-indigo-600">Cliquez</span> ou glissez un fichier ici </p><p class="text-xs text-gray-400">PDF, Word, Images \u2014 max 5 Mo</p></div>`);
        }
        _push(`</div></div></div><div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">`);
        _push(ssrRenderComponent(_component_UButton, {
          type: "button",
          color: "gray",
          variant: "outline",
          onClick: closeFonctionModal
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Annuler `);
            } else {
              return [
                createTextVNode(" Annuler ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UButton, {
          type: "button",
          onClick: saveFonctionModal,
          loading: unref(savingFonction),
          disabled: !unref(modal).fonction_id
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!unref(savingFonction)) {
                _push2(`<svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` Enregistrer la fonction `);
            } else {
              return [
                !unref(savingFonction) ? (openBlock(), createBlock("svg", {
                  key: 0,
                  class: "w-4 h-4 mr-1.5",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M5 13l4 4L19 7"
                  })
                ])) : createCommentVNode("", true),
                createTextVNode(" Enregistrer la fonction ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showSuccessModal)) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div class="bg-white rounded-xl p-8 w-[500px] max-w-[90vw] mx-4 text-center"><div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4"><svg class="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div><h3 class="text-2xl font-semibold mb-2">Succ\xE8s !</h3><p class="text-gray-600 mb-6">L&#39;utilisateur a \xE9t\xE9 modifi\xE9 avec succ\xE8s.</p>`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => ("navigateTo" in _ctx ? _ctx.navigateTo : unref(navigateTo))("/utilisateurs"),
          class: "bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Retour \xE0 la liste `);
            } else {
              return [
                createTextVNode(" Retour \xE0 la liste ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/utilisateurs/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BZavVkJZ.mjs.map
