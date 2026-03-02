import { _ as _sfc_main$1 } from './PageHeader-NxcDUFJW.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import { u as useHead, r as useToast, d as __nuxt_component_1, n as navigateTo } from './server.mjs';
import __nuxt_component_1$1 from './SelectMenu-DNGe_AeQ.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import __nuxt_component_0 from './Checkbox-DFEpnQRu.mjs';
import { _ as __nuxt_component_4$1 } from './DocumentPreview-D_2OLyBk.mjs';
import { ref, computed, watch, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
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
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Modifier un Courrier Arriv\xE9 - Sagar Revolution" });
    useToast();
    const route = useRoute();
    route.params.id;
    const selectedFile = ref(null);
    ref(null);
    const loading = ref(false);
    const loadingCourrier = ref(false);
    const loadingTypes = ref(false);
    ref("");
    const errorRequest = ref(null);
    const sansReference = ref(false);
    const documentTypes = ref([]);
    const errors = ref([]);
    const fichierActuel = ref(null);
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
      if (selectedFile.value) return URL.createObjectURL(selectedFile.value);
      return fichierActuel.value || null;
    });
    const isFormValid = computed(() => {
      return form.value.numero_enreg !== "" && form.value.date_enreg !== "" && form.value.date_courier !== "" && form.value.objet !== "" && form.value.type_document_id !== null && form.value.type_arrivee !== "" && form.value.priorite !== "";
    });
    watch(sansReference, (val) => {
      if (val) form.value.reference = "";
    });
    const handleCancel = () => navigateTo("/courriers");
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
        title: "Modifier un Courrier Arriv\xE9",
        subtitle: "Modification du courrier enregistr\xE9"
      }, null, _parent));
      if (loadingCourrier.value) {
        _push(`<div class="flex items-center justify-center py-16"><div class="text-center"><div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div><p class="text-sm text-slate-500">Chargement du courrier...</p></div></div>`);
      } else {
        _push(`<form class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Type d&#39;arriv\xE9e *</label>`);
        _push(ssrRenderComponent(_component_USelect, {
          modelValue: form.value.type_arrivee,
          "onUpdate:modelValue": ($event) => form.value.type_arrivee = $event,
          options: [
            { label: "Directe", value: "directe" },
            { label: "Par CAB", value: "cab" },
            { label: "Par SGM", value: "sgm" },
            { label: "Par Autres", value: "autre" }
          ],
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Priorit\xE9 *</label>`);
        _push(ssrRenderComponent(_component_USelect, {
          modelValue: form.value.priorite,
          "onUpdate:modelValue": ($event) => form.value.priorite = $event,
          options: [
            { label: "Standard", value: "standard" },
            { label: "Urgent", value: "urgent" },
            { label: "Important", value: "important" }
          ],
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Pi\xE8ce jointe <span class="text-gray-400 text-xs">(laisser vide pour conserver l&#39;actuelle)</span></label><div class="relative"><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden"><div class="flex gap-2">`);
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => _ctx.$refs.fileInput.click(),
          type: "button",
          color: "yellow",
          variant: "outline",
          icon: "heroicons:arrow-up-tray",
          class: "flex-shrink-0"
        }, null, _parent));
        _push(`<div class="flex-1 text-xs px-3 py-1 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center">${ssrInterpolate(selectedFile.value ? selectedFile.value.name : fichierActuel.value ? "\u{1F4CE} Fichier existant" : "Aucun fichier")}</div></div></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Type de document *</label>`);
        _push(ssrRenderComponent(_component_USelectMenu, {
          modelValue: form.value.type_document_id,
          "onUpdate:modelValue": ($event) => form.value.type_document_id = $event,
          options: documentTypes.value,
          "value-attribute": "id",
          "option-attribute": "libelle",
          placeholder: "S\xE9lectionner le type",
          class: "w-full",
          ui: { height: "h-[42px]" },
          loading: loadingTypes.value
        }, null, _parent));
        _push(`</div></div>`);
        if (form.value.type_arrivee !== "autre") {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2">Structure</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: form.value.structure,
            "onUpdate:modelValue": ($event) => form.value.structure = $event,
            placeholder: "Nom de la structure",
            class: "w-full h-12"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (form.value.type_arrivee === "autre") {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2">Autre Structure</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: form.value.autre_structure,
            "onUpdate:modelValue": ($event) => form.value.autre_structure = $event,
            placeholder: "Pr\xE9cisez la structure",
            class: "w-full h-12"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (form.value.type_arrivee === "cab") {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Num\xE9ro CAB</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: form.value.num_cab,
            "onUpdate:modelValue": ($event) => form.value.num_cab = $event,
            class: "w-full h-12"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date CAB</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: form.value.date_cab,
            "onUpdate:modelValue": ($event) => form.value.date_cab = $event,
            type: "date",
            class: "w-full h-12"
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (form.value.type_arrivee === "cab" || form.value.type_arrivee === "sgm") {
          _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Num\xE9ro d&#39;Enregistrement SGM</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: form.value.num_sgm,
            "onUpdate:modelValue": ($event) => form.value.num_sgm = $event,
            class: "w-full h-12"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date SGM</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: form.value.date_sgm,
            "onUpdate:modelValue": ($event) => form.value.date_sgm = $event,
            type: "date",
            class: "w-full h-12"
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pt-4 border-t border-gray-100 space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">N\xB0 d&#39;enregistrement *</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: form.value.numero_enreg,
          "onUpdate:modelValue": ($event) => form.value.numero_enreg = $event,
          placeholder: "Num\xE9ro d'enregistrement",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date d&#39;enregistrement *</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: form.value.date_enreg,
          "onUpdate:modelValue": ($event) => form.value.date_enreg = $event,
          type: "date",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="flex items-center space-x-2">`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          modelValue: sansReference.value,
          "onUpdate:modelValue": ($event) => sansReference.value = $event,
          label: "Sans r\xE9f\xE9rence"
        }, null, _parent));
        _push(`</div>`);
        if (!sansReference.value) {
          _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2">R\xE9f\xE9rence</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: form.value.reference,
            "onUpdate:modelValue": ($event) => form.value.reference = $event,
            placeholder: "R\xE9f\xE9rence du document",
            class: "w-full h-12"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date du courrier *</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: form.value.date_courier,
          "onUpdate:modelValue": ($event) => form.value.date_courier = $event,
          type: "date",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Objet *</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: form.value.objet,
          "onUpdate:modelValue": ($event) => form.value.objet = $event,
          placeholder: "Objet du courrier",
          class: "w-full h-12"
        }, null, _parent));
        _push(`</div><div class="flex items-center space-x-2">`);
        _push(ssrRenderComponent(_component_UCheckbox, {
          modelValue: form.value.large_diffusion,
          "onUpdate:modelValue": ($event) => form.value.large_diffusion = $event,
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
          disabled: !isFormValid.value || loading.value,
          type: "submit",
          class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white",
          loading: loading.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ENREGISTRER LES MODIFICATIONS `);
            } else {
              return [
                createTextVNode(" ENREGISTRER LES MODIFICATIONS ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (errors.value.length > 0) {
          _push(`<div class="mt-4"><ul class="list-disc list-inside text-sm text-red-600"><!--[-->`);
          ssrRenderList(errors.value, (err, index) => {
            _push(`<li>${ssrInterpolate(err)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (errorRequest.value) {
          _push(`<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"><p class="text-sm text-red-600"> Une erreur est survenue : ${ssrInterpolate(((_a = errorRequest.value.data) == null ? void 0 : _a.message) || errorRequest.value.message || "Erreur inconnue")}</p>`);
          if ((_b = errorRequest.value.data) == null ? void 0 : _b.errors) {
            _push(`<ul class="mt-2 list-disc list-inside text-xs text-red-500"><!--[-->`);
            ssrRenderList(errorRequest.value.data.errors, (msgs, field) => {
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
        _push(`</form>`);
      }
      _push(`</div></div><div class="lg:col-span-6">`);
      _push(ssrRenderComponent(_component_DocumentPreview, {
        "selected-file": selectedFile.value,
        "file-preview-url": filePreviewUrl.value
      }, null, _parent));
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/courriers/edit/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BxDufp3W.mjs.map
