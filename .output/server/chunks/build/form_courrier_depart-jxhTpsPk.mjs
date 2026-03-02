import { u as useHead, r as useToast, c as __nuxt_component_0$2, d as __nuxt_component_1, n as navigateTo } from './server.mjs';
import __nuxt_component_4 from './Select-C_BWMUVV.mjs';
import __nuxt_component_1$1 from './SelectMenu-DNGe_AeQ.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import __nuxt_component_0 from './Checkbox-DFEpnQRu.mjs';
import { _ as __nuxt_component_4$1 } from './DocumentPreview-D_2OLyBk.mjs';
import { ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useCourriersStore } from './courriers-89bZxt-C.mjs';
import { storeToRefs } from 'pinia';
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
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useFormGroup-BPckFnLf.mjs';
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
  __name: "form_courrier_depart",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Courrier D\xE9part - Sagar Revolution"
    });
    useToast();
    const courriersStore = useCourriersStore();
    const { isReplyMode, replyDocumentSummary, courrierToReply } = storeToRefs(courriersStore);
    const selectedFile = ref(null);
    ref(null);
    const loading = ref(false);
    const loadingTypes = ref(false);
    const loadingUsers = ref(false);
    ref("");
    const errorRequest = ref(null);
    const errors = ref([]);
    const documentTypes = ref([]);
    const utilisateurs = ref([]);
    const form = ref({
      type_depart: "externe",
      numero_enreg: "",
      date_enreg: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      reference: "",
      date_courier: "",
      objet: "",
      large_diffusion: false,
      url: null,
      type_document_id: null,
      date_depart: "",
      destinataire: "",
      confidentiel: false,
      service_emis: "",
      initiateurs: []
    });
    const filePreviewUrl = computed(() => {
      if (!selectedFile.value) return null;
      return URL.createObjectURL(selectedFile.value);
    });
    const isFormValid = computed(() => {
      const base = form.value.numero_enreg !== "" && form.value.date_enreg !== "" && form.value.reference !== "" && form.value.date_courier !== "" && form.value.objet !== "" && form.value.type_document_id !== null && form.value.url !== null && form.value.type_depart !== "" && form.value.date_depart !== "";
      if (isReplyMode.value) {
        return base && form.value.destinataire !== "";
      }
      return base && form.value.initiateurs.length > 0;
    });
    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
    };
    watch(filePreviewUrl, (newUrl, oldUrl) => {
      if (oldUrl) URL.revokeObjectURL(oldUrl);
    });
    const affectesOptionsEnrichis = computed(() => {
      var _a, _b;
      if (!((_b = (_a = courrierToReply.value) == null ? void 0 : _a.affectations) == null ? void 0 : _b.length)) return [];
      return courrierToReply.value.affectations.map((affectation) => {
        const u = affectation.user;
        const nomComplet = u ? `${u.nom || ""} ${u.prenom || ""}`.trim() : `Destinataire #${affectation.destinataire_id}`;
        return {
          id: affectation.destinataire_id,
          label: nomComplet,
          matricule: (u == null ? void 0 : u.matricule) || "",
          affectation
        };
      });
    });
    const handleCancel = () => {
      if (isReplyMode.value) {
        courriersStore.clearReply();
      }
      navigateTo("/documents");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
      const _component_Icon = __nuxt_component_0$2;
      const _component_USelect = __nuxt_component_4;
      const _component_UButton = __nuxt_component_1;
      const _component_USelectMenu = __nuxt_component_1$1;
      const _component_UInput = __nuxt_component_2;
      const _component_UCheckbox = __nuxt_component_0;
      const _component_DocumentPreview = __nuxt_component_4$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 p-6" }, _attrs))}><div class="max-w-7xl mx-auto">`);
      if (unref(isReplyMode)) {
        _push(`<div class="mb-6 flex items-start gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm"><div class="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-arrow-uturn-right",
          class: "w-5 h-5 text-emerald-600"
        }, null, _parent));
        _push(`</div><div class="flex-1 min-w-0"><p class="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">En r\xE9ponse au courrier</p><p class="text-sm font-semibold text-gray-900 truncate">${ssrInterpolate((_a = unref(replyDocumentSummary)) == null ? void 0 : _a.reference)}</p><p class="text-xs text-gray-600 mt-0.5 line-clamp-2">${ssrInterpolate((_b = unref(replyDocumentSummary)) == null ? void 0 : _b.objet)}</p><div class="flex flex-wrap gap-3 mt-2"><span class="text-xs text-gray-500"> N\xB0 ${ssrInterpolate((_c = unref(replyDocumentSummary)) == null ? void 0 : _c.numero_enreg)}</span><span class="text-xs text-gray-400">\u2022</span><span class="text-xs text-gray-500">${ssrInterpolate(formatDate((_d = unref(replyDocumentSummary)) == null ? void 0 : _d.date_enreg))}</span>`);
        if ((_e = unref(replyDocumentSummary)) == null ? void 0 : _e.type_document) {
          _push(`<span class="text-xs text-gray-400">\u2022</span>`);
        } else {
          _push(`<!---->`);
        }
        if ((_f = unref(replyDocumentSummary)) == null ? void 0 : _f.type_document) {
          _push(`<span class="text-xs text-indigo-600 font-medium">${ssrInterpolate(unref(replyDocumentSummary).type_document)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><button class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors" title="Annuler la r\xE9ponse">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-x-mark",
          class: "w-5 h-5"
        }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-5"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><div class="mb-6"><h1 class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(isReplyMode) ? "R\xE9pondre au courrier" : "Nouveau Courrier D\xE9part")}</h1><p class="text-gray-600 mt-1">${ssrInterpolate(unref(isReplyMode) ? "R\xE9diger et envoyer votre r\xE9ponse" : "Enregistrez un nouveau courrier d\xE9part")}</p></div><form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Type de d\xE9part *</label>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: form.value.type_depart,
        "onUpdate:modelValue": ($event) => form.value.type_depart = $event,
        options: [
          { label: "Interne", value: "interne" },
          { label: "Externe", value: "externe" }
        ],
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div><div class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100"><div><label class="block text-sm font-medium text-gray-700 mb-2">Pi\xE8ce jointe *</label><div class="relative"><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden"><div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: ($event) => _ctx.$refs.fileInput.click(),
        type: "button",
        color: "yellow",
        variant: "outline",
        icon: "heroicons:arrow-up-tray",
        class: "flex-shrink-0"
      }, null, _parent));
      _push(`<div class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center">${ssrInterpolate(selectedFile.value ? selectedFile.value.name : "Aucun fichier s\xE9lectionn\xE9")}</div></div></div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Type de document *</label>`);
      _push(ssrRenderComponent(_component_USelectMenu, {
        modelValue: form.value.type_document_id,
        "onUpdate:modelValue": ($event) => form.value.type_document_id = $event,
        options: documentTypes.value,
        "value-attribute": "id",
        "option-attribute": "libelle",
        placeholder: "S\xE9lectionner le type",
        class: "w-full",
        loading: loadingTypes.value,
        ui: { height: "h-[42px]" }
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Destinataire${ssrInterpolate(unref(isReplyMode) ? " *" : "")}</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: form.value.destinataire,
        "onUpdate:modelValue": ($event) => form.value.destinataire = $event,
        placeholder: unref(isReplyMode) ? "" : "Nom du destinataire",
        class: "w-full h-12"
      }, null, _parent));
      if (unref(isReplyMode)) {
        _push(`<p class="text-[11px] text-gray-400 mt-1"> Pr\xE9-rempli avec la structure \xE9mettrice du courrier original </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date de d\xE9part *</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: form.value.date_depart,
        "onUpdate:modelValue": ($event) => form.value.date_depart = $event,
        type: "date",
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div></div><div class="pt-4 border-t border-gray-100 space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">Num\xE9ro d&#39;enregistrement *</label>`);
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
      _push(`</div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2">R\xE9f\xE9rence *</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: form.value.reference,
        "onUpdate:modelValue": ($event) => form.value.reference = $event,
        placeholder: "R\xE9f\xE9rence du document",
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2">Date du courrier *</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: form.value.date_courier,
        "onUpdate:modelValue": ($event) => form.value.date_courier = $event,
        type: "date",
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Objet *</label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: form.value.objet,
        "onUpdate:modelValue": ($event) => form.value.objet = $event,
        placeholder: "Objet du courrier",
        class: "w-full h-12"
      }, null, _parent));
      _push(`</div><div class="flex items-center space-x-4">`);
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: form.value.large_diffusion,
        "onUpdate:modelValue": ($event) => form.value.large_diffusion = $event,
        label: "Large diffusion"
      }, null, _parent));
      _push(ssrRenderComponent(_component_UCheckbox, {
        modelValue: form.value.confidentiel,
        "onUpdate:modelValue": ($event) => form.value.confidentiel = $event,
        label: "Confidentiel"
      }, null, _parent));
      _push(`</div>`);
      if (!unref(isReplyMode)) {
        _push(`<div><label class="block text-sm font-medium text-gray-700 mb-2">Initiateurs *</label>`);
        _push(ssrRenderComponent(_component_USelectMenu, {
          modelValue: form.value.initiateurs,
          "onUpdate:modelValue": ($event) => form.value.initiateurs = $event,
          options: utilisateurs.value,
          "value-attribute": "id",
          "option-attribute": "display_name",
          placeholder: "S\xE9lectionner les initiateurs",
          class: "w-full",
          multiple: "",
          loading: loadingUsers.value,
          ui: { height: "h-[42px]" }
        }, null, _parent));
        if (form.value.initiateurs.length > 0) {
          _push(`<p class="text-xs text-green-600 mt-1">${ssrInterpolate(form.value.initiateurs.length)} initiateur(s) s\xE9lectionn\xE9(s) </p>`);
        } else {
          _push(`<p class="text-xs text-gray-500 mt-1"> S\xE9lectionnez un ou plusieurs initiateurs pour ce courrier </p>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(isReplyMode) && ((_h = (_g = unref(courrierToReply)) == null ? void 0 : _g.affectations) == null ? void 0 : _h.length)) {
        _push(`<div class="pt-4 border-t border-gray-100"><p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3"> Affectations du courrier original </p><div class="space-y-2"><!--[-->`);
        ssrRenderList(affectesOptionsEnrichis.value, (affectation) => {
          _push(`<div class="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-user",
            class: "w-3.5 h-3.5 text-indigo-600"
          }, null, _parent));
          _push(`</div><div><p class="text-xs font-medium text-gray-800">${ssrInterpolate(affectation.label)}</p>`);
          if (affectation.matricule) {
            _push(`<p class="text-[10px] text-gray-400">${ssrInterpolate(affectation.matricule)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex items-center gap-2"><span class="${ssrRenderClass([{
            "bg-amber-100 text-amber-700": affectation.affectation.statut === "en cours",
            "bg-green-100 text-green-700": affectation.affectation.statut === "clotur\xE9"
          }, "text-xs px-2 py-0.5 rounded-full font-medium"])}">${ssrInterpolate(affectation.affectation.statut)}</span><span class="text-[10px] text-gray-400 capitalize">${ssrInterpolate(affectation.affectation.type_affectation)}</span></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">`);
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
        type: "submit",
        disabled: !isFormValid.value || loading.value,
        loading: loading.value,
        class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(isReplyMode) ? "ENVOYER LA R\xC9PONSE" : "SAUVEGARDER")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(isReplyMode) ? "ENVOYER LA R\xC9PONSE" : "SAUVEGARDER"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (errors.value.length > 0) {
        _push(`<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"><ul class="list-disc list-inside text-sm text-red-600 space-y-1"><!--[-->`);
        ssrRenderList(errors.value, (error, index) => {
          _push(`<li>${ssrInterpolate(error)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      if (errorRequest.value) {
        _push(`<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"><p class="text-sm font-medium text-red-700">${ssrInterpolate(((_i = errorRequest.value.data) == null ? void 0 : _i.message) || errorRequest.value.message || "Erreur inconnue")}</p>`);
        if ((_j = errorRequest.value.data) == null ? void 0 : _j.errors) {
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
      _push(`</form></div></div><div class="lg:col-span-6">`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/courriers/form_courrier_depart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=form_courrier_depart-jxhTpsPk.mjs.map
