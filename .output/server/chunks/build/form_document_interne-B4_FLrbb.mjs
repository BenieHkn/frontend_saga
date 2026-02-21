import __nuxt_component_1 from './SelectMenu-DFVs1VlK.mjs';
import __nuxt_component_2 from './Button-D4Pv8nAk.mjs';
import __nuxt_component_2$1 from './Input-3IU7zE8e.mjs';
import __nuxt_component_3 from './Textarea-CjN8za1H.mjs';
import { _ as __nuxt_component_4 } from './DocumentPreview-CJPhVhww.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useHead, _ as _export_sfc, n as navigateTo, c as useRuntimeConfig } from './server.mjs';
import { u as useToast$1 } from './useToast-VyEsrynn.mjs';
import './Icon-BEWG_Jy9.mjs';
import './index-DJmPz9HS.mjs';
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
import './Avatar-BE6on_fb.mjs';
import './tooltip-lourJnw0.mjs';
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
import './index-BLXEZ1Ia.mjs';
import './usePopper-BrvKSG9Z.mjs';
import './useFormGroup-2eEELX00.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './Link-SQZY3OU3.mjs';
import './nuxt-link-aS4hYwbM.mjs';
import './link-Bz3Wc5MF.mjs';
import './button-Bz5rwL6o.mjs';
import './Modal-BXvFVpvj.mjs';
import './transition-CRUjHQk-.mjs';
import './portal-Bh2KnJSN.mjs';
import './description-BSAkQQqZ.mjs';

function useTypeDocuments() {
  const config = useRuntimeConfig();
  const typeDocuments = ref([]);
  const errorMessage = ref(null);
  const loading = ref(false);
  const hasBeenFetched = ref(false);
  const getTypeDocuments = async (forceRefresh = false) => {
    var _a;
    if (hasBeenFetched.value && !forceRefresh && typeDocuments.value.length > 0) {
      console.log("\u{1F4E6} Types de documents depuis cache");
      return typeDocuments.value;
    }
    loading.value = true;
    errorMessage.value = null;
    try {
      const authToken = false ? localStorage.getItem("auth_token") || "" : "";
      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }
      console.log("\u{1F504} Chargement des types de documents...");
      const response = await $fetch(
        `${config.public.laravelApiUrl}/type_documents`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      );
      if (!response || !response.data) {
        throw new Error("Format de r\xE9ponse invalide");
      }
      if (!Array.isArray(response.data)) {
        throw new Error("Les donn\xE9es re\xE7ues ne sont pas un tableau");
      }
      typeDocuments.value = response.data;
      hasBeenFetched.value = true;
      console.log(`\u2705 ${response.data.length} types de documents charg\xE9s`);
      return response.data;
    } catch (error) {
      console.error("\u274C Erreur getTypeDocuments:", error);
      if ((_a = error.data) == null ? void 0 : _a.message) {
        errorMessage.value = error.data.message;
      } else if (error.message) {
        errorMessage.value = error.message;
      } else if (error.statusCode === 401) {
        errorMessage.value = "Authentification requise - Veuillez vous reconnecter";
      } else if (error.statusCode === 403) {
        errorMessage.value = "Acc\xE8s refus\xE9 - Vous n'avez pas les permissions requises";
      } else if (error.statusCode === 404) {
        errorMessage.value = "Endpoint non trouv\xE9";
      } else if (error.statusCode >= 500) {
        errorMessage.value = "Erreur serveur - Veuillez r\xE9essayer plus tard";
      } else {
        errorMessage.value = "Erreur lors de la r\xE9cup\xE9ration des types de documents";
      }
      typeDocuments.value = [];
      return [];
    } finally {
      loading.value = false;
    }
  };
  const reset = () => {
    typeDocuments.value = [];
    errorMessage.value = null;
    loading.value = false;
    hasBeenFetched.value = false;
  };
  const getTypeDocumentById = (id) => {
    return typeDocuments.value.find((doc) => doc.id === id);
  };
  const getTypeDocumentByLibelle = (libelle) => {
    return typeDocuments.value.find((doc) => doc.libelle === libelle);
  };
  return {
    // États
    typeDocuments,
    errorMessage,
    loading,
    hasBeenFetched,
    // Méthodes
    getTypeDocuments,
    reset,
    getTypeDocumentById,
    getTypeDocumentByLibelle
  };
}
function useFormDocumentInterne() {
  const config = useRuntimeConfig();
  const form = ref({
    numero_enreg: "",
    date_enreg: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    reference: "",
    date_courrier: "",
    objet: "",
    large_diffusion: false,
    fonction_id: 0,
    type_document_id: 0,
    description: ""
  });
  const loading = ref(false);
  const error = ref(null);
  const errors = ref([]);
  const fichier = ref(null);
  const resetForm = () => {
    form.value = {
      numero_enreg: "",
      date_enreg: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      reference: "",
      date_courrier: "",
      objet: "",
      large_diffusion: false,
      fonction_id: 0,
      type_document_id: 0,
      description: ""
    };
    fichier.value = null;
    errors.value = [];
    error.value = null;
  };
  const handleSubmit = async () => {
    var _a, _b, _c, _d;
    loading.value = true;
    error.value = null;
    errors.value = [];
    try {
      console.log("\u{1F504} Validation du formulaire...");
      if (!((_a = form.value.numero_enreg) == null ? void 0 : _a.trim())) {
        errors.value.push("Le num\xE9ro d'enregistrement est obligatoire");
      }
      if (!form.value.date_enreg) {
        errors.value.push("La date d'enregistrement est obligatoire");
      }
      if (!((_b = form.value.objet) == null ? void 0 : _b.trim())) {
        errors.value.push("L'objet est obligatoire");
      }
      if (!form.value.type_document_id || form.value.type_document_id === 0) {
        errors.value.push("Veuillez s\xE9lectionner un type de document");
      }
      if (!fichier.value) {
        errors.value.push("Veuillez s\xE9lectionner une pi\xE8ce jointe");
      }
      if (errors.value.length > 0) {
        console.warn("\u26A0\uFE0F Erreurs de validation:", errors.value);
        return { successSubmitForm: false, errors: errors.value };
      }
      console.log("\u2705 Validation r\xE9ussie");
      console.log("\u{1F4E6} Pr\xE9paration des donn\xE9es...");
      const formData = new FormData();
      formData.append("numero_enreg", form.value.numero_enreg);
      formData.append("date_enreg", form.value.date_enreg);
      formData.append("reference", form.value.reference || "");
      formData.append("date_courrier", form.value.date_courrier || "");
      formData.append("objet", form.value.objet);
      formData.append("type_document_id", String(form.value.type_document_id));
      formData.append("large_diffusion", form.value.large_diffusion ? "1" : "0");
      formData.append("fonction_id", String(form.value.fonction_id));
      formData.append("description", form.value.description || "");
      if (fichier.value) {
        formData.append("fichier", fichier.value);
        console.log(`\u{1F4C4} Fichier ajout\xE9: ${fichier.value.name}`);
      }
      let authToken = "";
      if (false) ;
      if (!authToken) {
        throw new Error("Token d'authentification manquant - Veuillez vous reconnecter");
      }
      if (false) ;
      console.log("\u{1F4E4} Envoi de la requ\xEAte API...");
      const data = await $fetch(
        `${config.public.laravelApiUrl}/documents-internes`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        }
      );
      console.log("\u2705 R\xE9ponse API re\xE7ue:", data);
      resetForm();
      return { successSubmitForm: true, data };
    } catch (err) {
      console.error("\u274C Erreur compl\xE8te:", err);
      let errorMessage = "Une erreur est survenue lors de la soumission";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null) {
        const errorObj = err;
        if ((_c = errorObj.data) == null ? void 0 : _c.message) {
          errorMessage = errorObj.data.message;
        } else if (errorObj.statusMessage) {
          errorMessage = errorObj.statusMessage;
        } else if (errorObj.status) {
          const statusCode = errorObj.status;
          if (statusCode === 401) {
            errorMessage = "Authentification requise - Veuillez vous reconnecter";
          } else if (statusCode === 403) {
            errorMessage = "Acc\xE8s refus\xE9 - Vous n'avez pas les permissions";
          } else if (statusCode === 404) {
            errorMessage = "Endpoint non trouv\xE9 - V\xE9rifiez l'URL API";
          } else if (statusCode === 422) {
            errorMessage = "Les donn\xE9es envoy\xE9es sont invalides";
            if ((_d = errorObj.data) == null ? void 0 : _d.errors) {
              const validationErrors = Object.values(errorObj.data.errors).flat();
              errors.value = validationErrors;
              errorMessage = "Erreurs de validation";
            }
          } else if (statusCode >= 500) {
            errorMessage = "Erreur serveur - Veuillez r\xE9essayer plus tard";
          } else {
            errorMessage = `Erreur ${statusCode}: ${errorObj.statusMessage || "Erreur inconnue"}`;
          }
        } else if (errorObj.message && typeof errorObj.message === "string") {
          errorMessage = errorObj.message;
        }
      }
      if (!errors.value.includes(errorMessage)) {
        errors.value.push(errorMessage);
      }
      error.value = errorMessage;
      const toast = useToast$1();
      toast.add({
        title: "Erreur",
        description: errorMessage,
        color: "red",
        timeout: 5e3
      });
      return { successSubmitForm: false, errors: errors.value };
    } finally {
      loading.value = false;
    }
  };
  return {
    // États
    form,
    fichier,
    loading,
    error,
    errors,
    // Méthodes
    resetForm,
    handleSubmit
  };
}
const toasts = ref([]);
let nextId = 0;
const useToast = () => {
  const add = (message, type = "info", duration = 1500) => {
    const id = `toast-${nextId++}`;
    const toast = { id, message, type, duration };
    toasts.value.push(toast);
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
    return id;
  };
  const remove = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };
  return { toasts: readonly(toasts), add, remove };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ToastComponent",
  __ssrInlineRender: true,
  setup(__props) {
    const { toasts: toasts2 } = useToast();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "toast-container" }, _attrs))} data-v-e19b9f17><div${ssrRenderAttrs({ name: "toast" })} data-v-e19b9f17>`);
      ssrRenderList(unref(toasts2), (toast) => {
        _push(`<div class="${ssrRenderClass(["toast", `toast--${toast.type}`])}" data-v-e19b9f17>${ssrInterpolate(toast.message)} <button class="toast-close" data-v-e19b9f17>\xD7</button></div>`);
      });
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ToastComponent.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ToastComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-e19b9f17"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "form_document_interne",
  __ssrInlineRender: true,
  setup(__props) {
    useToast();
    useHead({
      title: "Nouveau Document Interne - Sagar Revolution"
    });
    const {
      form,
      resetForm,
      loading,
      errors
    } = useFormDocumentInterne();
    const {
      typeDocuments,
      errorMessage: typeDocumentsError,
      loading: typeDocumentsLoading
    } = useTypeDocuments();
    const selectedFile = ref(null);
    const fileInput = ref(null);
    const filePreviewUrl = computed(() => {
      if (!selectedFile.value) return null;
      return URL.createObjectURL(selectedFile.value);
    });
    const isFormValid = computed(() => {
      return form.value.numero_enreg.trim() !== "" && form.value.date_enreg !== "" && form.value.objet.trim() !== "" && form.value.type_document_id !== 0 && selectedFile.value !== null;
    });
    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };
    const openFileDialog = () => {
      try {
        if (fileInput.value && typeof fileInput.value.click === "function") {
          fileInput.value.click();
        } else {
          console.error("\u274C fileInput ref non initialis\xE9e");
          errors.value.push("Erreur: Impossible d'ouvrir le dialogue de fichier");
        }
      } catch (err) {
        console.error("\u274C Erreur openFileDialog:", err);
        errors.value.push("Erreur lors de l'ouverture du dialogue");
      }
    };
    const handleCancel = () => {
      resetForm();
      navigateTo("/courriers");
    };
    watch(
      filePreviewUrl,
      (newUrl, oldUrl) => {
        if (oldUrl) {
          URL.revokeObjectURL(oldUrl);
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelectMenu = __nuxt_component_1;
      const _component_UButton = __nuxt_component_2;
      const _component_UInput = __nuxt_component_2$1;
      const _component_UTextarea = __nuxt_component_3;
      const _component_DocumentPreview = __nuxt_component_4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 p-6" }, _attrs))}>`);
      _push(ssrRenderComponent(ToastComponent, null, null, _parent));
      _push(`<div class="max-w-7xl mx-auto"><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-6"><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"><div class="mb-6"><h1 class="text-2xl font-bold text-gray-900"> Formulaire Document Interne </h1></div>`);
      if (unref(typeDocumentsLoading)) {
        _push(`<div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"><p class="text-sm text-blue-700">\u23F3 Chargement des types de documents...</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(typeDocumentsError)) {
        _push(`<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"><p class="text-sm text-red-700">\u26A0\uFE0F ${ssrInterpolate(unref(typeDocumentsError))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Type de document * </label>`);
      _push(ssrRenderComponent(_component_USelectMenu, {
        modelValue: unref(form).type_document_id,
        "onUpdate:modelValue": ($event) => unref(form).type_document_id = $event,
        options: unref(typeDocuments),
        "value-attribute": "id",
        "option-attribute": "libelle",
        placeholder: "S\xE9lectionner le type",
        class: "w-full",
        ui: { height: "h-[42px]" },
        disabled: unref(typeDocumentsLoading) || unref(loading),
        searchable: ""
      }, null, _parent));
      _push(`</div><div class="pt-4 border-t border-gray-100"><div><label class="block text-sm font-medium text-gray-700 mb-2"> Pi\xE8ce jointe * </label><div class="relative"><input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden"><div class="flex gap-2">`);
      _push(ssrRenderComponent(_component_UButton, {
        onClick: openFileDialog,
        type: "button",
        color: "yellow",
        variant: "outline",
        icon: "heroicons:arrow-up-tray",
        class: "flex-shrink-0",
        disabled: unref(loading)
      }, null, _parent));
      _push(`<div class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center">${ssrInterpolate(unref(selectedFile) ? `${unref(selectedFile).name} (${formatFileSize(unref(selectedFile).size)})` : "Aucun fichier s\xE9lectionn\xE9")}</div></div></div></div></div><div class="pt-4 border-t border-gray-100 space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-medium text-gray-700 mb-2"> N\xB0 d&#39;enregistrement * </label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).numero_enreg,
        "onUpdate:modelValue": ($event) => unref(form).numero_enreg = $event,
        placeholder: "Num\xE9ro d'enregistrement",
        class: "w-full h-12",
        disabled: unref(loading)
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Date d&#39;enregistrement * </label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).date_enreg,
        "onUpdate:modelValue": ($event) => unref(form).date_enreg = $event,
        type: "date",
        class: "w-full h-12",
        disabled: unref(loading)
      }, null, _parent));
      _push(`</div></div><div><label class="block text-sm font-medium text-gray-700 mb-2"> R\xE9f\xE9rence </label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).reference,
        "onUpdate:modelValue": ($event) => unref(form).reference = $event,
        placeholder: "R\xE9f\xE9rence du document",
        class: "w-full h-12",
        disabled: unref(loading)
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Date du courrier </label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).date_courrier,
        "onUpdate:modelValue": ($event) => unref(form).date_courrier = $event,
        type: "date",
        class: "w-full h-12",
        disabled: unref(loading)
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Objet * </label>`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(form).objet,
        "onUpdate:modelValue": ($event) => unref(form).objet = $event,
        placeholder: "Objet du document",
        class: "w-full h-12",
        disabled: unref(loading)
      }, null, _parent));
      _push(`</div><div><label class="block text-sm font-medium text-gray-700 mb-2"> Description </label>`);
      _push(ssrRenderComponent(_component_UTextarea, {
        modelValue: unref(form).description,
        "onUpdate:modelValue": ($event) => unref(form).description = $event,
        placeholder: "Description du document",
        class: "w-full",
        rows: 4,
        disabled: unref(loading)
      }, null, _parent));
      _push(`</div></div>`);
      if (unref(errors).length > 0) {
        _push(`<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"><p class="text-sm font-medium text-red-800 mb-2">\u274C Erreurs d\xE9tect\xE9es :</p><ul class="list-disc list-inside text-sm text-red-700 space-y-1"><!--[-->`);
        ssrRenderList(unref(errors), (error, index) => {
          _push(`<li>${ssrInterpolate(error)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">`);
      _push(ssrRenderComponent(_component_UButton, {
        type: "button",
        onClick: handleCancel,
        color: "gray",
        variant: "outline",
        disabled: unref(loading)
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
            _push2(`${ssrInterpolate(unref(loading) ? "SAUVEGARDE..." : "SAUVEGARDER")}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(loading) ? "SAUVEGARDE..." : "SAUVEGARDER"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div></div><div class="lg:col-span-6">`);
      if (unref(selectedFile) && unref(filePreviewUrl)) {
        _push(ssrRenderComponent(_component_DocumentPreview, {
          "selected-file": unref(selectedFile),
          "file-preview-url": unref(filePreviewUrl)
        }, null, _parent));
      } else {
        _push(`<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center"><p class="text-gray-400 text-center"> \u{1F4C4} S\xE9lectionnez un fichier pour voir l&#39;aper\xE7u </p></div>`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/courriers/form_document_interne.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=form_document_interne-B4_FLrbb.mjs.map
