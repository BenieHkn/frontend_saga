import { _ as _sfc_main$1 } from './PageHeader-NxcDUFJW.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import { u as useHead, r as useToast, d as __nuxt_component_1, n as navigateTo } from './server.mjs';
import __nuxt_component_1$1 from './SelectMenu-DNGe_AeQ.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import __nuxt_component_0 from './Checkbox-DFEpnQRu.mjs';
import { _ as __nuxt_component_4$1 } from './DocumentPreview-D_2OLyBk.mjs';
import { ref, computed, watch, mergeProps, unref, isRef, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import './useFormGroup-BPckFnLf.mjs';
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
import './usePopper-BrvKSG9Z.mjs';
import './Modal-EvFvX6Ng.mjs';
import './transition-CRUjHQk-.mjs';
import './portal-Bh2KnJSN.mjs';
import './description-BSAkQQqZ.mjs';

const _sfc_main = {
  __name: "form_courier_arrive",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Nouveau Courrier Arriv\xE9e - Sagar Revolution"
    });
    useToast();
    const selectedFile = ref(null);
    ref(null);
    const loading = ref(false);
    const loadingTypes = ref(false);
    ref("");
    const errorRequest = ref(null);
    const sansReference = ref(false);
    const documentTypes = ref([]);
    const errors = ref([]);
    const form = ref({
      type_arrivee: "directe",
      priorite: "standard",
      numero_enreg: "",
      date_enreg: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      reference: "",
      date_courier: "",
      objet: "",
      large_diffusion: false,
      fichier: null,
      type_document_id: null,
      structure: "",
      num_cab: "",
      date_cab: "",
      num_sgm: "",
      date_sgm: "",
      autre_structure: "",
      confidentiel: false,
      service_enreg: "",
      statut: "en_attente",
      observation: ""
    });
    const filePreviewUrl = computed(() => {
      if (!selectedFile.value) return null;
      return URL.createObjectURL(selectedFile.value);
    });
    const isFormValid = computed(() => {
      return form.value.numero_enreg !== "" && form.value.date_enreg !== "" && form.value.date_courier !== "" && form.value.objet !== "" && form.value.type_document_id !== null && form.value.fichier !== null && form.value.type_arrivee !== "" && form.value.priorite !== "";
    });
    watch(filePreviewUrl, (newUrl, oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
    });
    watch(sansReference, (val) => {
      if (val) form.value.reference = "";
    });
    const handleCancel = () => {
      navigateTo("/courriers");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_PageHeader = _sfc_main$1;
      const _component_USelect = __nuxt_component_4;
      const _component_UButton = __nuxt_component_1;
      const _component_USelectMenu = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_2;
      const _component_UCheckbox = __nuxt_component_0;
      const _component_DocumentPreview = __nuxt_component_4$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}><div class="max-w-7xl mx-auto p-6"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">`);
      _push(ssrRenderComponent(_component_PageHeader, {
        title: "Formulaire de Courriers Arriv\xE9s",
        subtitle: "Gestion et suivi des courriers sortants",
        to: "/courriers/form_courrier_depart",
        "btn-text": "Nouveau courrier"
      }, null, _parent));
      _push(`<form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Type d&#39;arriv\xE9e * </label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(form).type_arrivee,
        "onUpdate:modelValue": ($event) => unref(form).type_arrivee = $event,
        options: [
          { label: "Directe", value: "directe" },
          { label: "Par CAB", value: "cab" },
          { label: "Par SGM", value: "sgm" },
          { label: "Par Autres", value: "autre" }
        ],
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Priorit\xE9 * </label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(form).priorite,
        "onUpdate:modelValue": ($event) => unref(form).priorite = $event,
        options: [
          { label: "Standard", value: "standard" },
          { label: "Urgent", value: "urgent" },
          { label: "Important", value: "important" }
        ],
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Pi\xE8ce jointe * </label><div class="relative"><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden"><div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => _ctx.$refs.fileInput.click(),
        type: "button",
        color: "yellow",
        variant: "outline",
        icon: "heroicons:arrow-up-tray",
        class: "flex-shrink-0"
      }, null, _parent));
      _push(`<div class="flex-1 text-xs px-3 py-1 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center">${ssrInterpolate(unref(selectedFile) ? unref(selectedFile).name : "Aucun fichier s\xE9lectionn\xE9")}</div></div></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Type de document * </label>`);
      _push(ssrRenderComponent(_component_USelectMenu, {
        modelValue: unref(form).type_document_id,
        "onUpdate:modelValue": ($event) => unref(form).type_document_id = $event,
        options: unref(documentTypes),
        "value-attribute": "id",
        "option-attribute": "libelle",
        placeholder: "S\xE9lectionner le type",
        class: "w-full",
        ui: { height: "h-[42px]" },
        loading: unref(loadingTypes)
      }, null, _parent));
      if (unref(documentTypes).length === 0 && !unref(loadingTypes)) {
        _push(`<p class="text-xs text-amber-600 mt-1"> Aucun type de document disponible </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (unref(form).type_arrivee !== "autre") {
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> Structure </label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).structure,
          "onUpdate:modelValue": ($event) => unref(form).structure = $event,
          placeholder: "Nom de la structure",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).type_arrivee === "autre") {
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2"> Autre Structure </label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).autre_structure,
          "onUpdate:modelValue": ($event) => unref(form).autre_structure = $event,
          placeholder: "Pr\xE9cisez la structure",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).type_arrivee === "cab") {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Num\xE9ro CAB</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).num_cab,
          "onUpdate:modelValue": ($event) => unref(form).num_cab = $event,
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date CAB</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).date_cab,
          "onUpdate:modelValue": ($event) => unref(form).date_cab = $event,
          type: "date",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(form).type_arrivee === "cab" || unref(form).type_arrivee === "sgm") {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Num\xE9ro d&#39;Enregistrement SGM</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).num_sgm,
          "onUpdate:modelValue": ($event) => unref(form).num_sgm = $event,
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date SGM</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).date_sgm,
          "onUpdate:modelValue": ($event) => unref(form).date_sgm = $event,
          type: "date",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="pt-4 border-t border-gray-100 space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">N\xB0 d&#39;enregistrement *</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).numero_enreg,
        "onUpdate:modelValue": ($event) => unref(form).numero_enreg = $event,
        placeholder: "Num\xE9ro d'enregistrement",
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date d&#39;enregistrement *</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).date_enreg,
        "onUpdate:modelValue": ($event) => unref(form).date_enreg = $event,
        type: "date",
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: unref(sansReference),
        "onUpdate:modelValue": ($event) => isRef(sansReference) ? sansReference.value = $event : null,
        label: "Sans r\xE9f\xE9rence"
      }, null, _parent));
      _push(`</div>`);
      if (!unref(sansReference)) {
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2">R\xE9f\xE9rence</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(form).reference,
          "onUpdate:modelValue": ($event) => unref(form).reference = $event,
          placeholder: "R\xE9f\xE9rence du document",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date du courrier *</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).date_courier,
        "onUpdate:modelValue": ($event) => unref(form).date_courier = $event,
        type: "date",
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Objet *</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).objet,
        "onUpdate:modelValue": ($event) => unref(form).objet = $event,
        placeholder: "Objet du courrier",
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: unref(form).large_diffusion,
        "onUpdate:modelValue": ($event) => unref(form).large_diffusion = $event,
        label: "Large diffusion"
      }, null, _parent));
      _push(`</div></div><div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">`);
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
            _push2(` SAUVEGARDER `);
          } else {
            return [
              createTextVNode(" SAUVEGARDER ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(errors).length > 0) {
        _push(`<div class="mt-4"><ul class="list-disc list-inside text-sm text-red-600"><!--[-->`);
        ssrRenderList(unref(errors), (error, index) => {
          _push(`<li>${ssrInterpolate(error)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(errorRequest)) {
        _push(`<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"><p class="text-sm text-red-600"> Une erreur est survenue : ${ssrInterpolate(((_a = unref(errorRequest).data) == null ? void 0 : _a.message) || unref(errorRequest).message || "Erreur inconnue")}</p>`);
        if ((_b = unref(errorRequest).data) == null ? void 0 : _b.errors) {
          _push(`<ul class="mt-2 list-disc list-inside text-xs text-red-500"><!--[-->`);
          ssrRenderList(unref(errorRequest).data.errors, (msgs, field) => {
            _push(`<li><span class="font-medium">${ssrInterpolate(field)}</span> : ${ssrInterpolate(Array.isArray(msgs) ? msgs.join(", ") : msgs)}</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></div><div class="lg:col-span-6">`);
      _push(ssrRenderComponent(_component_DocumentPreview, {
        "selected-file": unref(selectedFile),
        "file-preview-url": unref(filePreviewUrl)
      }, null, _parent));
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/courriers/form_courier_arrive.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=form_courier_arrive-B3PYAV6x.mjs.map
