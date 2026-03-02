import { u as useHead, r as useToast, q as useRouter, c as __nuxt_component_0$2, b as useRuntimeConfig } from './server.mjs';
import { ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { u as useAffectationsStore } from './affectations-Bp-zzr69.mjs';
import { useRoute } from 'vue-router';
import { A as AffectationsCourrierSelectionPanel, _ as _sfc_main$3, a as AffectationsFormPanel, b as AffectationsSummaryBar } from './AffectationsSummaryBar-Dn4hOs1J.mjs';
import { _ as _sfc_main$1 } from './PageHeader-NxcDUFJW.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './Badge-DIEXPf_r.mjs';
import './Input-50cchghJ.mjs';
import './useFormGroup-BPckFnLf.mjs';
import './SelectMenu-DNGe_AeQ.mjs';
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
import './Textarea-B6iki0ql.mjs';

const _sfc_main = {
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    useHead({
      title: "Nouvelle Affectation"
    });
    const store = useAffectationsStore();
    const toast = useToast();
    const router = useRouter();
    useRoute();
    const authToken = ref("");
    const { getEmetteurId } = useAuth();
    const courrierLoading = ref(false);
    const destinataireLoading = ref(false);
    const submitting = ref(false);
    ref(null);
    const handleSubmit = async () => {
      var _a, _b, _c, _d;
      if (!store.canSend) {
        toast.add({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          color: "red",
          timeout: 1500
        });
        return;
      }
      if (store.selectedCourriers.length === 0) {
        toast.add({
          title: "Erreur",
          description: "Veuillez s\xE9lectionner au moins un courrier",
          color: "red",
          timeout: 1500
        });
        return;
      }
      if (store.selectedDestinataires.length === 0) {
        toast.add({
          title: "Erreur",
          description: "Veuillez s\xE9lectionner au moins un destinataire",
          color: "red",
          timeout: 1500
        });
        return;
      }
      submitting.value = true;
      try {
        let entite_user = null;
        if (false) ;
        if (!entite_user || !entite_user.id) {
          throw new Error("Aucune fonction s\xE9lectionn\xE9e. Veuillez vous reconnecter.");
        }
        const emetteurId = (_a = getEmetteurId()) != null ? _a : entite_user.id;
        console.log(`\u{1F4DD} Cr\xE9ation d'affectations avec emetteur_id: ${emetteurId}`);
        console.log("\u{1F4E4} IDs des destinataires s\xE9lectionn\xE9s:", store.selectedDestinataires);
        console.log(
          "\u{1F4E4} D\xE9tails des destinataires:",
          store.selectedDestinataires.map((id) => {
            var _a2, _b2, _c2, _d2;
            const dest = store.destinataires.find((d) => d.id === id);
            return {
              entite_user_id: dest == null ? void 0 : dest.id,
              nom: (_a2 = dest == null ? void 0 : dest.user) == null ? void 0 : _a2.nom,
              prenom: (_b2 = dest == null ? void 0 : dest.user) == null ? void 0 : _b2.prenom,
              fonction: (_c2 = dest == null ? void 0 : dest.entite) == null ? void 0 : _c2.fonction,
              entite: (_d2 = dest == null ? void 0 : dest.entite) == null ? void 0 : _d2.libelle,
              is_responsable: dest == null ? void 0 : dest.is_responsable
            };
          })
        );
        const affectations = [];
        const isMultiCourrier = store.selectedCourriers.length > 1;
        for (const courrierId of store.selectedCourriers) {
          for (const destinataireId of store.selectedDestinataires) {
            affectations.push({
              courrier_arrive_id: courrierId,
              destinataire_id: destinataireId,
              // ✅ C'est bien le entite_user.id
              emetteur_id: emetteurId,
              date_affect: store.formData.date_affect,
              instructions: store.formData.instructions,
              statut: store.formData.statut,
              delai_traitement: store.formData.delai_traitement,
              date_cloture: store.showDateCloture && store.formData.date_cloture ? store.formData.date_cloture : null,
              dossier: isMultiCourrier && store.folderName ? store.folderName : null
            });
          }
        }
        console.log(`\u{1F4E4} Envoi de ${affectations.length} affectation(s)`);
        console.log("\u{1F4CB} Donn\xE9es \xE0 envoyer:", affectations);
        const responses = await Promise.all(
          affectations.map(
            (payload) => $fetch(`${config.public.apiBase}/affectations`, {
              method: "POST",
              body: payload,
              headers: {
                Authorization: `Bearer ${authToken.value}`,
                "Content-Type": "application/json"
              }
            })
          )
        );
        const successCount = responses.filter((r) => r.success).length;
        const failureCount = responses.length - successCount;
        if (failureCount === 0) {
          toast.add({
            title: "Succ\xE8s ! \u{1F389}",
            description: `${affectations.length} affectation(s) cr\xE9\xE9e(s) avec succ\xE8s`,
            color: "green",
            timeout: 2e3
          });
          store.resetForm();
          setTimeout(() => {
            router.push("/affectations-transferts");
          }, 1500);
        } else {
          toast.add({
            title: "Avertissement",
            description: `${successCount} affectation(s) cr\xE9\xE9e(s), ${failureCount} \xE9chec(s)`,
            color: "orange",
            timeout: 1500
          });
          submitting.value = false;
        }
      } catch (error) {
        console.error("\u274C Erreur lors de la cr\xE9ation des affectations:", error);
        console.error("\u274C Message d'erreur:", (_b = error.data) == null ? void 0 : _b.message);
        console.error("\u274C Erreurs de validation:", (_c = error.data) == null ? void 0 : _c.errors);
        let errorMessage = "Impossible de cr\xE9er les affectations";
        if ((_d = error.data) == null ? void 0 : _d.message) {
          errorMessage = error.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        toast.add({
          title: "Erreur",
          description: errorMessage,
          color: "red",
          timeout: 1500
        });
        submitting.value = false;
      }
    };
    const handleCancel = () => {
      const confirmCancel = confirm("\xCAtes-vous s\xFBr de vouloir annuler ? Les donn\xE9es saisies seront perdues.");
      if (confirmCancel) {
        store.resetForm();
        router.push("/affectations-transferts");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/40" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        title: "Nouvelle Affectation",
        description: "Affecter un ou plusieurs courrier(s) \xE0 un ou plusieurs destinataire(s)"
      }, null, _parent));
      _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 px-6">`);
      _push(ssrRenderComponent(AffectationsCourrierSelectionPanel, { loading: courrierLoading.value }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, { loading: destinataireLoading.value }, null, _parent));
      _push(`</div><div class="mb-8 px-6">`);
      _push(ssrRenderComponent(AffectationsFormPanel, null, null, _parent));
      _push(`</div><div class="px-6 mb-8">`);
      _push(ssrRenderComponent(AffectationsSummaryBar, {
        onCancel: handleCancel,
        onSubmit: handleSubmit
      }, null, _parent));
      _push(`</div>`);
      if (submitting.value) {
        _push(`<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"><div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4"><div class="flex flex-col items-center gap-4">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "svg-spinners:ring-resize",
          class: "w-12 h-12 text-purple-600"
        }, null, _parent));
        _push(`<h3 class="text-lg font-bold text-slate-900">Cr\xE9ation en cours...</h3><p class="text-sm text-slate-600 text-center"> Cr\xE9ation de ${ssrInterpolate(unref(store).selectedDestinataires.length)} affectation(s) pour ${ssrInterpolate(unref(store).selectedCourriers.length)} courrier(s) </p><div class="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden"><div class="bg-purple-600 h-full animate-pulse" style="${ssrRenderStyle({ "width": "100%" })}"></div></div></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/affectations/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=create-MNfoAuhu.mjs.map
