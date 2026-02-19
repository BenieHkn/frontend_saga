import __nuxt_component_0 from './index-DJmPz9HS.mjs';
import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAffectationsStore } from './affectations-Bp-zzr69.mjs';
import { A as AffectationsCourrierSelectionPanel, _ as _sfc_main$3, a as AffectationsFormPanel, b as AffectationsSummaryBar } from './AffectationsSummaryBar-Clgj9ALi.mjs';
import { _ as _sfc_main$1 } from './PageHeader-OIWZwZf2.mjs';
import { u as useHead, c as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { u as useToast } from './useToast-VyEsrynn.mjs';
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
import './Badge-C_KHizXa.mjs';
import './Icon-BEWG_Jy9.mjs';
import './tooltip-lourJnw0.mjs';
import './useButtonGroup-DPIFBtCe.mjs';
import './Input-3IU7zE8e.mjs';
import './useFormGroup-2eEELX00.mjs';
import './index-BLXEZ1Ia.mjs';
import './SelectMenu-DFVs1VlK.mjs';
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
import './ohash.D__AXeF1-DqcdtjQw.mjs';
import './Textarea-CjN8za1H.mjs';
import './nuxt-link-aS4hYwbM.mjs';

const _sfc_main = {
  __name: "form-affectation",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Nouvelle Affectation - Sagar Revolution"
    });
    const store = useAffectationsStore();
    const toast = useToast();
    const authToken = ref("");
    const config = useRuntimeConfig();
    const courrierLoading = ref(false);
    const destinataireLoading = ref(false);
    const submitting = ref(false);
    const handleSubmit = async () => {
      var _a, _b, _c;
      if (!store.canSend) {
        toast.add({
          title: "Erreur",
          description: "Veuillez s\xE9lectionner au moins un courrier et un destinataire",
          color: "red",
          timeout: 1500
        });
        return;
      }
      submitting.value = true;
      try {
        let selectedFunction = null;
        if (false) ;
        if (!selectedFunction || !selectedFunction.id) {
          console.error("\u274C Aucune fonction s\xE9lectionn\xE9e");
          toast.add({
            title: "Erreur",
            description: "Aucune fonction s\xE9lectionn\xE9e. Veuillez vous reconnecter.",
            color: "red",
            timeout: 1500
          });
          submitting.value = false;
          return;
        }
        console.log(`\u{1F4DD} Cr\xE9ation de l'affectation avec emetteur_id: ${selectedFunction.id}`);
        const payload = {
          emetteur_id: selectedFunction.id,
          instructions: store.formData.instructions || null,
          priority: store.formData.priority,
          date_affect: store.formData.date_affect,
          delai_traitement: store.formData.delai_traitement || null,
          courriers: store.selectedCourriers,
          // Array d'IDs
          destinataires: store.selectedDestinataires
          // Array d'IDs
        };
        console.log("\u{1F4E4} Envoi du payload:", payload);
        const response = await $fetch(`${config.public.apiBase}/affectations`, {
          method: "POST",
          body: payload,
          headers: {
            Authorization: `Bearer ${authToken.value}`,
            "Content-Type": "application/json"
          }
        });
        if (response.success) {
          toast.add({
            title: "Succ\xE8s",
            description: "Affectation cr\xE9\xE9e avec succ\xE8s",
            color: "green",
            timeout: 2e3
          });
          store.resetForm();
          setTimeout(() => {
            navigateTo("/affectations");
          }, 1500);
        } else {
          toast.add({
            title: "Erreur",
            description: response.message || "Impossible de cr\xE9er l'affectation",
            color: "red",
            timeout: 1500
          });
        }
      } catch (error) {
        console.error("\u274C Erreur lors de la cr\xE9ation de l'affectation:", (_a = error.data) == null ? void 0 : _a.message);
        if ((_b = error.data) == null ? void 0 : _b.errors) {
          const errorMessages = Object.values(error.data.errors).flat().join(", ");
          toast.add({
            title: "Erreur de validation",
            description: errorMessages,
            color: "red",
            timeout: 5e3
          });
        } else {
          toast.add({
            title: "Erreur",
            description: ((_c = error.data) == null ? void 0 : _c.message) || "Impossible de cr\xE9er l'affectation",
            color: "red",
            timeout: 1500
          });
        }
      } finally {
        submitting.value = false;
      }
    };
    const handleCancel = () => {
      store.resetForm();
      navigateTo("/affectations");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/40" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Nouvelle Affectation",
        description: "Affecter des courriers \xE0 des destinataires"
      }, null, _parent));
      _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">`);
      _push(ssrRenderComponent(AffectationsCourrierSelectionPanel, { loading: courrierLoading.value }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, { loading: destinataireLoading.value }, null, _parent));
      _push(`</div><div class="mb-8">`);
      _push(ssrRenderComponent(AffectationsFormPanel, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(AffectationsSummaryBar, {
        onCancel: handleCancel,
        onSubmit: handleSubmit
      }, null, _parent));
      if (submitting.value) {
        _push(`<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"><div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4"><div class="flex flex-col items-center gap-4">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "svg-spinners:ring-resize",
          class: "w-12 h-12 text-purple-600"
        }, null, _parent));
        _push(`<h3 class="text-lg font-bold text-slate-900">Cr\xE9ation en cours...</h3><p class="text-sm text-slate-600 text-center"> Cr\xE9ation de l&#39;affectation pour ${ssrInterpolate(unref(store).selectedDestinataires.length)} destinataire(s) </p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/affectations-transferts/form-affectation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=form-affectation-ClUHCO_D.mjs.map
