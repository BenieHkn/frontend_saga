import { _ as _export_sfc, u as useHead, r as useToast, c as __nuxt_component_0$2, d as __nuxt_component_1, n as navigateTo, b as useRuntimeConfig } from './server.mjs';
import __nuxt_component_2 from './Input-50cchghJ.mjs';
import { _ as __nuxt_component_2$1 } from './DocumentRpreview-jsQ82SAI.mjs';
import __nuxt_component_3 from './Modal-EvFvX6Ng.mjs';
import { ref, computed, mergeProps, unref, isRef, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
import './useFormGroup-BPckFnLf.mjs';
import './transition-CRUjHQk-.mjs';
import './portal-Bh2KnJSN.mjs';
import './focus-management-CclPs0xY.mjs';
import './keyboard-BCt0ZeLv.mjs';
import './use-outside-click-BqFFeIfQ.mjs';
import './hidden-e5tlhUcy.mjs';
import './active-element-history-Cer4cSOw.mjs';
import './micro-task-B6uncIso.mjs';
import './open-closed-DaveoKA1.mjs';
import './description-BSAkQQqZ.mjs';

const _sfc_main = {
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "Rattachement de Courriers - Sagar Revolution"
    });
    const authToken = ref("");
    const toast = useToast();
    const loading = ref(false);
    const config = useRuntimeConfig();
    const currentStep = ref(1);
    const showConfirmModal = ref(false);
    const searchArrivee = ref("");
    const searchDepart = ref("");
    const selectedArrivee = ref(null);
    const selectedDepart = ref(null);
    const courriersArrivee = ref([]);
    const courriersDepart = ref([]);
    const filteredCourriersArrivee = computed(() => {
      if (!searchArrivee.value) return courriersArrivee.value;
      const query = searchArrivee.value.toLowerCase();
      return courriersArrivee.value.filter(
        (courrier) => courrier.reference.toLowerCase().includes(query) || courrier.objet.toLowerCase().includes(query) || courrier.structure.toLowerCase().includes(query)
      );
    });
    const filteredCourriersDepart = computed(() => {
      if (!searchDepart.value) return courriersDepart.value;
      const query = searchDepart.value.toLowerCase();
      return courriersDepart.value.filter(
        (courrier) => courrier.reference.toLowerCase().includes(query) || courrier.objet.toLowerCase().includes(query) || courrier.destinataire.toLowerCase().includes(query)
      );
    });
    const goToPreview = () => {
      if (!selectedArrivee.value || !selectedDepart.value) {
        toast.add({
          title: "S\xE9lection incompl\xE8te",
          description: "Veuillez s\xE9lectionner un courrier arriv\xE9e et un courrier d\xE9part",
          color: "amber",
          timeout: 1500
        });
        return;
      }
      currentStep.value = 2;
    };
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    };
    const handleSave = async () => {
      var _a, _b;
      if (!selectedArrivee.value || !selectedDepart.value) {
        toast.add({
          title: "Erreur",
          description: "Veuillez s\xE9lectionner un courrier arriv\xE9e et un courrier d\xE9part",
          color: "red",
          timeout: 1500
        });
        return;
      }
      loading.value = true;
      try {
        const response = await $fetch(`${config.public.apiBase}/reponses`, {
          method: "POST",
          body: {
            document_id: selectedArrivee.value.id,
            reponse_id: selectedDepart.value.id
          },
          headers: {
            Authorization: `Bearer ${authToken.value}`,
            "Content-Type": "application/json"
          }
        });
        if (response.success) {
          showConfirmModal.value = false;
          toast.add({
            title: "Succ\xE8s",
            description: `Rattachement effectu\xE9 entre ${selectedArrivee.value.reference} et ${selectedDepart.value.reference}`,
            color: "green",
            timeout: 2e3
          });
          setTimeout(() => {
            selectedArrivee.value = null;
            selectedDepart.value = null;
            searchArrivee.value = "";
            searchDepart.value = "";
            currentStep.value = 1;
            navigateTo("/rattachements");
          }, 1500);
        } else {
          console.log(response.data);
          toast.add({
            title: "Erreur",
            description: response.message || "Une erreur est survenue lors du rattachement",
            color: "red",
            timeout: 1500
          });
        }
      } catch (error) {
        console.error("Erreur lors du rattachement:", (_a = error.data) == null ? void 0 : _a.errors);
        toast.add({
          title: "Erreur",
          description: ((_b = error.data) == null ? void 0 : _b.message) || "Impossible de cr\xE9er le rattachement",
          color: "red",
          timeout: 1500
        });
      } finally {
        loading.value = false;
      }
    };
    const handleCancel = () => {
      selectedArrivee.value = null;
      selectedDepart.value = null;
      searchArrivee.value = "";
      searchDepart.value = "";
      currentStep.value = 1;
      navigateTo("/courriers");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_0$2;
      const _component_UInput = __nuxt_component_2;
      const _component_DocumentRpreview = __nuxt_component_2$1;
      const _component_UButton = __nuxt_component_1;
      const _component_UModal = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 p-6" }, _attrs))} data-v-5593fe95><div class="max-w-7xl mx-auto" data-v-5593fe95><div class="mb-8" data-v-5593fe95><h1 class="text-2xl font-bold text-gray-900" data-v-5593fe95>Rattachement de Courriers</h1><p class="text-gray-600 mt-1" data-v-5593fe95> Associez un courrier d\xE9part (r\xE9ponse) \xE0 un courrier arriv\xE9e </p><div class="mt-6 flex items-center justify-center" data-v-5593fe95><div class="flex items-center w-full max-w-md" data-v-5593fe95><div class="flex items-center flex-1" data-v-5593fe95><div class="${ssrRenderClass([
        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
        unref(currentStep) >= 1 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-400"
      ])}" data-v-5593fe95>`);
      if (unref(currentStep) > 1) {
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-check",
          class: "h-5 w-5"
        }, null, _parent));
      } else {
        _push(`<span class="font-semibold" data-v-5593fe95>1</span>`);
      }
      _push(`</div><div class="ml-3 text-left" data-v-5593fe95><p class="${ssrRenderClass([
        "text-sm font-medium",
        unref(currentStep) >= 1 ? "text-gray-900" : "text-gray-500"
      ])}" data-v-5593fe95> S\xE9lection </p></div></div><div class="${ssrRenderClass([
        "flex-1 h-0.5 mx-4 transition-all",
        unref(currentStep) >= 2 ? "bg-blue-600" : "bg-gray-300"
      ])}" data-v-5593fe95></div><div class="flex items-center flex-1" data-v-5593fe95><div class="${ssrRenderClass([
        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
        unref(currentStep) >= 2 ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-gray-300 text-gray-400"
      ])}" data-v-5593fe95><span class="font-semibold" data-v-5593fe95>2</span></div><div class="ml-3 text-left" data-v-5593fe95><p class="${ssrRenderClass([
        "text-sm font-medium",
        unref(currentStep) >= 2 ? "text-gray-900" : "text-gray-500"
      ])}" data-v-5593fe95> Pr\xE9visualisation </p></div></div></div></div></div>`);
      if (unref(currentStep) === 1) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6" data-v-5593fe95><div class="space-y-4" data-v-5593fe95><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-v-5593fe95><label class="block text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" data-v-5593fe95>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-inbox-arrow-down",
          class: "h-6 w-6 text-blue-600"
        }, null, _parent));
        _push(` Courrier Arriv\xE9e </label><div class="mb-4" data-v-5593fe95>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(searchArrivee),
          "onUpdate:modelValue": ($event) => isRef(searchArrivee) ? searchArrivee.value = $event : null,
          placeholder: "Rechercher par r\xE9f\xE9rence ou objet...",
          icon: "i-heroicons-magnifying-glass",
          size: "lg",
          class: "w-full"
        }, null, _parent));
        _push(`</div><div class="border border-gray-200 rounded-lg max-h-96 overflow-y-auto bg-gray-50" data-v-5593fe95><!--[-->`);
        ssrRenderList(unref(filteredCourriersArrivee), (courrier) => {
          var _a, _b;
          _push(`<div class="${ssrRenderClass([
            "p-4 cursor-pointer transition-all border-b border-gray-200 last:border-b-0",
            ((_a = unref(selectedArrivee)) == null ? void 0 : _a.id) === courrier.id ? "bg-blue-100 border-l-4 border-l-blue-600" : "hover:bg-white hover:shadow-sm"
          ])}" data-v-5593fe95><div class="flex items-start justify-between" data-v-5593fe95><div class="flex-1" data-v-5593fe95><p class="font-bold text-blue-900 text-base" data-v-5593fe95>${ssrInterpolate(courrier.reference)}</p><p class="text-sm text-gray-700 mt-1 line-clamp-2" data-v-5593fe95>${ssrInterpolate(courrier.objet)}</p><div class="flex items-center gap-3 mt-2 text-xs text-gray-500" data-v-5593fe95><span class="flex items-center gap-1" data-v-5593fe95>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-building-office-2",
            class: "h-3 w-3"
          }, null, _parent));
          _push(` ${ssrInterpolate(courrier.structure)}</span><span class="flex items-center gap-1" data-v-5593fe95>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-calendar",
            class: "h-3 w-3"
          }, null, _parent));
          _push(` ${ssrInterpolate(formatDate(courrier.date_courrier))}</span></div></div>`);
          if (((_b = unref(selectedArrivee)) == null ? void 0 : _b.id) === courrier.id) {
            _push(`<div class="ml-3" data-v-5593fe95>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-check-circle-solid",
              class: "h-6 w-6 text-blue-600"
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredCourriersArrivee).length === 0) {
          _push(`<div class="p-8 text-center text-gray-500" data-v-5593fe95>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-inbox",
            class: "h-12 w-12 mx-auto mb-2 text-gray-400"
          }, null, _parent));
          _push(`<p class="text-sm" data-v-5593fe95>Aucun courrier arriv\xE9e trouv\xE9</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(selectedArrivee)) {
          _push(`<div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200" data-v-5593fe95><div class="flex items-center justify-between" data-v-5593fe95><div class="flex items-center gap-2" data-v-5593fe95>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-check-circle-solid",
            class: "h-5 w-5 text-blue-600"
          }, null, _parent));
          _push(`<span class="text-sm font-semibold text-blue-900" data-v-5593fe95>S\xE9lectionn\xE9</span></div><span class="text-sm font-bold text-blue-900" data-v-5593fe95>${ssrInterpolate(unref(selectedArrivee).reference)}</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="space-y-4" data-v-5593fe95><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-v-5593fe95><label class="block text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" data-v-5593fe95>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-paper-airplane",
          class: "h-6 w-6 text-green-600"
        }, null, _parent));
        _push(` Courrier D\xE9part (R\xE9ponse) </label><div class="mb-4" data-v-5593fe95>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(searchDepart),
          "onUpdate:modelValue": ($event) => isRef(searchDepart) ? searchDepart.value = $event : null,
          placeholder: "Rechercher par r\xE9f\xE9rence ou objet...",
          icon: "i-heroicons-magnifying-glass",
          size: "lg",
          class: "w-full"
        }, null, _parent));
        _push(`</div><div class="border border-gray-200 rounded-lg max-h-96 overflow-y-auto bg-gray-50" data-v-5593fe95><!--[-->`);
        ssrRenderList(unref(filteredCourriersDepart), (courrier) => {
          var _a, _b;
          _push(`<div class="${ssrRenderClass([
            "p-4 cursor-pointer transition-all border-b border-gray-200 last:border-b-0",
            ((_a = unref(selectedDepart)) == null ? void 0 : _a.id) === courrier.id ? "bg-green-100 border-l-4 border-l-green-600" : "hover:bg-white hover:shadow-sm"
          ])}" data-v-5593fe95><div class="flex items-start justify-between" data-v-5593fe95><div class="flex-1" data-v-5593fe95><p class="font-bold text-green-900 text-base" data-v-5593fe95>${ssrInterpolate(courrier.reference)}</p><p class="text-sm text-gray-700 mt-1 line-clamp-2" data-v-5593fe95>${ssrInterpolate(courrier.objet)}</p><div class="flex items-center gap-3 mt-2 text-xs text-gray-500" data-v-5593fe95><span class="flex items-center gap-1" data-v-5593fe95>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-user",
            class: "h-3 w-3"
          }, null, _parent));
          _push(` ${ssrInterpolate(courrier.destinataire)}</span><span class="flex items-center gap-1" data-v-5593fe95>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-calendar",
            class: "h-3 w-3"
          }, null, _parent));
          _push(` ${ssrInterpolate(formatDate(courrier.date_depart))}</span></div></div>`);
          if (((_b = unref(selectedDepart)) == null ? void 0 : _b.id) === courrier.id) {
            _push(`<div class="ml-3" data-v-5593fe95>`);
            _push(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-check-circle-solid",
              class: "h-6 w-6 text-green-600"
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]-->`);
        if (unref(filteredCourriersDepart).length === 0) {
          _push(`<div class="p-8 text-center text-gray-500" data-v-5593fe95>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-inbox",
            class: "h-12 w-12 mx-auto mb-2 text-gray-400"
          }, null, _parent));
          _push(`<p class="text-sm" data-v-5593fe95>Aucun courrier d\xE9part trouv\xE9</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(selectedDepart)) {
          _push(`<div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200" data-v-5593fe95><div class="flex items-center justify-between" data-v-5593fe95><div class="flex items-center gap-2" data-v-5593fe95>`);
          _push(ssrRenderComponent(_component_Icon, {
            name: "i-heroicons-check-circle-solid",
            class: "h-5 w-5 text-green-600"
          }, null, _parent));
          _push(`<span class="text-sm font-semibold text-green-900" data-v-5593fe95>S\xE9lectionn\xE9</span></div><span class="text-sm font-bold text-green-900" data-v-5593fe95>${ssrInterpolate(unref(selectedDepart).reference)}</span></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 2) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6" data-v-5593fe95><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-v-5593fe95><h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" data-v-5593fe95>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-inbox-arrow-down",
          class: "h-6 w-6 text-blue-600"
        }, null, _parent));
        _push(` Courrier Arriv\xE9e </h3><div class="bg-blue-50 rounded-lg p-4 mb-4 space-y-2 text-sm" data-v-5593fe95><div class="flex justify-between" data-v-5593fe95><span class="text-gray-700 font-medium" data-v-5593fe95>R\xE9f\xE9rence:</span><span class="font-bold text-blue-900" data-v-5593fe95>${ssrInterpolate(unref(selectedArrivee).reference)}</span></div><div class="flex justify-between" data-v-5593fe95><span class="text-gray-700 font-medium" data-v-5593fe95>Structure:</span><span class="text-gray-900" data-v-5593fe95>${ssrInterpolate(unref(selectedArrivee).structure)}</span></div><div class="flex justify-between" data-v-5593fe95><span class="text-gray-700 font-medium" data-v-5593fe95>Date:</span><span class="text-gray-900" data-v-5593fe95>${ssrInterpolate(formatDate(unref(selectedArrivee).date_courrier))}</span></div><div class="pt-2 border-t border-blue-200" data-v-5593fe95><span class="text-gray-700 font-medium" data-v-5593fe95>Objet:</span><p class="text-gray-900 mt-1" data-v-5593fe95>${ssrInterpolate(unref(selectedArrivee).objet)}</p></div></div>`);
        _push(ssrRenderComponent(_component_DocumentRpreview, {
          "file-preview-url": unref(selectedArrivee).url
        }, null, _parent));
        _push(`</div><div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-v-5593fe95><h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2" data-v-5593fe95>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "i-heroicons-paper-airplane",
          class: "h-6 w-6 text-green-600"
        }, null, _parent));
        _push(` Courrier D\xE9part </h3><div class="bg-green-50 rounded-lg p-4 mb-4 space-y-2 text-sm" data-v-5593fe95><div class="flex justify-between" data-v-5593fe95><span class="text-gray-700 font-medium" data-v-5593fe95>R\xE9f\xE9rence:</span><span class="font-bold text-green-900" data-v-5593fe95>${ssrInterpolate(unref(selectedDepart).reference)}</span></div><div class="flex justify-between" data-v-5593fe95><span class="text-gray-700 font-medium" data-v-5593fe95>Destinataire:</span><span class="text-gray-900" data-v-5593fe95>${ssrInterpolate(unref(selectedDepart).destinataire)}</span></div><div class="flex justify-between" data-v-5593fe95><span class="text-gray-700 font-medium" data-v-5593fe95>Date:</span><span class="text-gray-900" data-v-5593fe95>${ssrInterpolate(formatDate(unref(selectedDepart).date_depart))}</span></div><div class="pt-2 border-t border-green-200" data-v-5593fe95><span class="text-gray-700 font-medium" data-v-5593fe95>Objet:</span><p class="text-gray-900 mt-1" data-v-5593fe95>${ssrInterpolate(unref(selectedDepart).objet)}</p></div></div>`);
        _push(ssrRenderComponent(_component_DocumentRpreview, {
          "file-preview-url": unref(selectedDepart).url
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-8 flex justify-between" data-v-5593fe95>`);
      if (unref(currentStep) === 1) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: handleCancel,
          color: "gray",
          variant: "outline",
          size: "lg",
          icon: "i-heroicons-x-mark"
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
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 2) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => currentStep.value = 1,
          color: "gray",
          variant: "outline",
          size: "lg",
          icon: "i-heroicons-arrow-left"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Retour `);
            } else {
              return [
                createTextVNode(" Retour ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 1) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: goToPreview,
          disabled: !unref(selectedArrivee) || !unref(selectedDepart),
          size: "lg",
          icon: "i-heroicons-arrow-right",
          trailing: "",
          class: "bg-gradient-to-br from-emerald-700 to-blue-800 text-white dark:text-white ml-auto"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Suivant `);
            } else {
              return [
                createTextVNode(" Suivant ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(currentStep) === 2) {
        _push(ssrRenderComponent(_component_UButton, {
          onClick: ($event) => showConfirmModal.value = true,
          size: "lg",
          icon: "i-heroicons-link",
          class: "ml-auto bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Rattacher `);
            } else {
              return [
                createTextVNode(" Rattacher ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showConfirmModal),
        "onUpdate:modelValue": ($event) => isRef(showConfirmModal) ? showConfirmModal.value = $event : null,
        ui: { width: "sm:max-w-4xl" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
          if (_push2) {
            _push2(`<div class="p-6" data-v-5593fe95${_scopeId}><div class="flex items-center justify-between mb-6" data-v-5593fe95${_scopeId}><h3 class="text-xl font-bold text-gray-900 flex items-center gap-2" data-v-5593fe95${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-link",
              class: "h-6 w-6 text-purple-600"
            }, null, _parent2, _scopeId));
            _push2(` Confirmation du rattachement </h3>`);
            _push2(ssrRenderComponent(_component_UButton, {
              color: "gray",
              variant: "ghost",
              icon: "i-heroicons-x-mark",
              onClick: ($event) => showConfirmModal.value = false,
              square: ""
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="mb-6" data-v-5593fe95${_scopeId}><p class="text-sm text-gray-600 mb-4" data-v-5593fe95${_scopeId}> Vous \xEAtes sur le point de rattacher ces deux courriers : </p><div class="flex flex-col lg:flex-row items-stretch gap-4" data-v-5593fe95${_scopeId}><div class="flex-1 bg-blue-50 rounded-lg p-4 border-2 border-blue-200 min-w-0" data-v-5593fe95${_scopeId}><div class="flex items-start gap-3 mb-3" data-v-5593fe95${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-inbox-arrow-down",
              class: "h-8 w-8 text-blue-600 flex-shrink-0 mt-1"
            }, null, _parent2, _scopeId));
            _push2(`<div class="min-w-0 flex-1" data-v-5593fe95${_scopeId}><p class="text-xs text-gray-600 uppercase font-semibold mb-1" data-v-5593fe95${_scopeId}>Courrier Arriv\xE9e</p><p class="font-bold text-blue-900 text-sm break-words" data-v-5593fe95${_scopeId}>${ssrInterpolate((_a = unref(selectedArrivee)) == null ? void 0 : _a.reference)}</p></div></div><div class="space-y-2" data-v-5593fe95${_scopeId}><div class="bg-white bg-opacity-50 rounded p-2" data-v-5593fe95${_scopeId}><p class="text-xs text-gray-600 font-medium mb-1" data-v-5593fe95${_scopeId}>Objet:</p><p class="text-xs text-gray-800 break-words" data-v-5593fe95${_scopeId}>${ssrInterpolate((_b = unref(selectedArrivee)) == null ? void 0 : _b.objet)}</p></div><div class="grid grid-cols-1 gap-2" data-v-5593fe95${_scopeId}><div class="bg-white bg-opacity-50 rounded p-2" data-v-5593fe95${_scopeId}><p class="text-xs text-gray-600 font-medium" data-v-5593fe95${_scopeId}>Structure:</p><p class="text-xs text-gray-800 break-words" data-v-5593fe95${_scopeId}>${ssrInterpolate((_c = unref(selectedArrivee)) == null ? void 0 : _c.structure)}</p></div><div class="bg-white bg-opacity-50 rounded p-2" data-v-5593fe95${_scopeId}><p class="text-xs text-gray-600 font-medium" data-v-5593fe95${_scopeId}>Date:</p><p class="text-xs text-gray-800" data-v-5593fe95${_scopeId}>${ssrInterpolate(formatDate((_d = unref(selectedArrivee)) == null ? void 0 : _d.date_courrier))}</p></div></div></div></div><div class="flex-shrink-0 flex items-center justify-center lg:py-0 py-2" data-v-5593fe95${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-arrow-right-circle",
              class: "h-10 w-10 text-purple-600 lg:rotate-0 rotate-90"
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="flex-1 bg-green-50 rounded-lg p-4 border-2 border-green-200 min-w-0" data-v-5593fe95${_scopeId}><div class="flex items-start gap-3 mb-3" data-v-5593fe95${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-paper-airplane",
              class: "h-8 w-8 text-green-600 flex-shrink-0 mt-1"
            }, null, _parent2, _scopeId));
            _push2(`<div class="min-w-0 flex-1" data-v-5593fe95${_scopeId}><p class="text-xs text-gray-600 uppercase font-semibold mb-1" data-v-5593fe95${_scopeId}>Courrier D\xE9part</p><p class="font-bold text-green-900 text-sm break-words" data-v-5593fe95${_scopeId}>${ssrInterpolate((_e = unref(selectedDepart)) == null ? void 0 : _e.reference)}</p></div></div><div class="space-y-2" data-v-5593fe95${_scopeId}><div class="bg-white bg-opacity-50 rounded p-2" data-v-5593fe95${_scopeId}><p class="text-xs text-gray-600 font-medium mb-1" data-v-5593fe95${_scopeId}>Objet:</p><p class="text-xs text-gray-800 break-words" data-v-5593fe95${_scopeId}>${ssrInterpolate((_f = unref(selectedDepart)) == null ? void 0 : _f.objet)}</p></div><div class="grid grid-cols-1 gap-2" data-v-5593fe95${_scopeId}><div class="bg-white bg-opacity-50 rounded p-2" data-v-5593fe95${_scopeId}><p class="text-xs text-gray-600 font-medium" data-v-5593fe95${_scopeId}>Destinataire:</p><p class="text-xs text-gray-800 break-words" data-v-5593fe95${_scopeId}>${ssrInterpolate((_g = unref(selectedDepart)) == null ? void 0 : _g.destinataire)}</p></div><div class="bg-white bg-opacity-50 rounded p-2" data-v-5593fe95${_scopeId}><p class="text-xs text-gray-600 font-medium" data-v-5593fe95${_scopeId}>Date:</p><p class="text-xs text-gray-800" data-v-5593fe95${_scopeId}>${ssrInterpolate(formatDate((_h = unref(selectedDepart)) == null ? void 0 : _h.date_depart))}</p></div></div></div></div></div></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6" data-v-5593fe95${_scopeId}><div class="flex gap-3" data-v-5593fe95${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "i-heroicons-exclamation-triangle",
              class: "h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"
            }, null, _parent2, _scopeId));
            _push2(`<div class="text-sm text-amber-800" data-v-5593fe95${_scopeId}><p class="font-medium mb-1" data-v-5593fe95${_scopeId}>Attention</p><p data-v-5593fe95${_scopeId}>Cette action cr\xE9era un lien permanent entre ces deux courriers. Assurez-vous que le courrier d\xE9part est bien la r\xE9ponse au courrier arriv\xE9e s\xE9lectionn\xE9.</p></div></div></div><div class="flex justify-end gap-3" data-v-5593fe95${_scopeId}>`);
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: ($event) => showConfirmModal.value = false,
              color: "gray",
              variant: "outline",
              size: "lg"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Annuler `);
                } else {
                  return [
                    createTextVNode(" Annuler ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_UButton, {
              onClick: handleSave,
              loading: unref(loading),
              size: "lg",
              icon: "i-heroicons-check",
              class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(loading) ? "Rattachement en cours..." : "Confirmer le rattachement")}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(loading) ? "Rattachement en cours..." : "Confirmer le rattachement"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "p-6" }, [
                createVNode("div", { class: "flex items-center justify-between mb-6" }, [
                  createVNode("h3", { class: "text-xl font-bold text-gray-900 flex items-center gap-2" }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-link",
                      class: "h-6 w-6 text-purple-600"
                    }),
                    createTextVNode(" Confirmation du rattachement ")
                  ]),
                  createVNode(_component_UButton, {
                    color: "gray",
                    variant: "ghost",
                    icon: "i-heroicons-x-mark",
                    onClick: ($event) => showConfirmModal.value = false,
                    square: ""
                  }, null, 8, ["onClick"])
                ]),
                createVNode("div", { class: "mb-6" }, [
                  createVNode("p", { class: "text-sm text-gray-600 mb-4" }, " Vous \xEAtes sur le point de rattacher ces deux courriers : "),
                  createVNode("div", { class: "flex flex-col lg:flex-row items-stretch gap-4" }, [
                    createVNode("div", { class: "flex-1 bg-blue-50 rounded-lg p-4 border-2 border-blue-200 min-w-0" }, [
                      createVNode("div", { class: "flex items-start gap-3 mb-3" }, [
                        createVNode(_component_Icon, {
                          name: "i-heroicons-inbox-arrow-down",
                          class: "h-8 w-8 text-blue-600 flex-shrink-0 mt-1"
                        }),
                        createVNode("div", { class: "min-w-0 flex-1" }, [
                          createVNode("p", { class: "text-xs text-gray-600 uppercase font-semibold mb-1" }, "Courrier Arriv\xE9e"),
                          createVNode("p", { class: "font-bold text-blue-900 text-sm break-words" }, toDisplayString((_i = unref(selectedArrivee)) == null ? void 0 : _i.reference), 1)
                        ])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("div", { class: "bg-white bg-opacity-50 rounded p-2" }, [
                          createVNode("p", { class: "text-xs text-gray-600 font-medium mb-1" }, "Objet:"),
                          createVNode("p", { class: "text-xs text-gray-800 break-words" }, toDisplayString((_j = unref(selectedArrivee)) == null ? void 0 : _j.objet), 1)
                        ]),
                        createVNode("div", { class: "grid grid-cols-1 gap-2" }, [
                          createVNode("div", { class: "bg-white bg-opacity-50 rounded p-2" }, [
                            createVNode("p", { class: "text-xs text-gray-600 font-medium" }, "Structure:"),
                            createVNode("p", { class: "text-xs text-gray-800 break-words" }, toDisplayString((_k = unref(selectedArrivee)) == null ? void 0 : _k.structure), 1)
                          ]),
                          createVNode("div", { class: "bg-white bg-opacity-50 rounded p-2" }, [
                            createVNode("p", { class: "text-xs text-gray-600 font-medium" }, "Date:"),
                            createVNode("p", { class: "text-xs text-gray-800" }, toDisplayString(formatDate((_l = unref(selectedArrivee)) == null ? void 0 : _l.date_courrier)), 1)
                          ])
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "flex-shrink-0 flex items-center justify-center lg:py-0 py-2" }, [
                      createVNode(_component_Icon, {
                        name: "i-heroicons-arrow-right-circle",
                        class: "h-10 w-10 text-purple-600 lg:rotate-0 rotate-90"
                      })
                    ]),
                    createVNode("div", { class: "flex-1 bg-green-50 rounded-lg p-4 border-2 border-green-200 min-w-0" }, [
                      createVNode("div", { class: "flex items-start gap-3 mb-3" }, [
                        createVNode(_component_Icon, {
                          name: "i-heroicons-paper-airplane",
                          class: "h-8 w-8 text-green-600 flex-shrink-0 mt-1"
                        }),
                        createVNode("div", { class: "min-w-0 flex-1" }, [
                          createVNode("p", { class: "text-xs text-gray-600 uppercase font-semibold mb-1" }, "Courrier D\xE9part"),
                          createVNode("p", { class: "font-bold text-green-900 text-sm break-words" }, toDisplayString((_m = unref(selectedDepart)) == null ? void 0 : _m.reference), 1)
                        ])
                      ]),
                      createVNode("div", { class: "space-y-2" }, [
                        createVNode("div", { class: "bg-white bg-opacity-50 rounded p-2" }, [
                          createVNode("p", { class: "text-xs text-gray-600 font-medium mb-1" }, "Objet:"),
                          createVNode("p", { class: "text-xs text-gray-800 break-words" }, toDisplayString((_n = unref(selectedDepart)) == null ? void 0 : _n.objet), 1)
                        ]),
                        createVNode("div", { class: "grid grid-cols-1 gap-2" }, [
                          createVNode("div", { class: "bg-white bg-opacity-50 rounded p-2" }, [
                            createVNode("p", { class: "text-xs text-gray-600 font-medium" }, "Destinataire:"),
                            createVNode("p", { class: "text-xs text-gray-800 break-words" }, toDisplayString((_o = unref(selectedDepart)) == null ? void 0 : _o.destinataire), 1)
                          ]),
                          createVNode("div", { class: "bg-white bg-opacity-50 rounded p-2" }, [
                            createVNode("p", { class: "text-xs text-gray-600 font-medium" }, "Date:"),
                            createVNode("p", { class: "text-xs text-gray-800" }, toDisplayString(formatDate((_p = unref(selectedDepart)) == null ? void 0 : _p.date_depart)), 1)
                          ])
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6" }, [
                  createVNode("div", { class: "flex gap-3" }, [
                    createVNode(_component_Icon, {
                      name: "i-heroicons-exclamation-triangle",
                      class: "h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5"
                    }),
                    createVNode("div", { class: "text-sm text-amber-800" }, [
                      createVNode("p", { class: "font-medium mb-1" }, "Attention"),
                      createVNode("p", null, "Cette action cr\xE9era un lien permanent entre ces deux courriers. Assurez-vous que le courrier d\xE9part est bien la r\xE9ponse au courrier arriv\xE9e s\xE9lectionn\xE9.")
                    ])
                  ])
                ]),
                createVNode("div", { class: "flex justify-end gap-3" }, [
                  createVNode(_component_UButton, {
                    onClick: ($event) => showConfirmModal.value = false,
                    color: "gray",
                    variant: "outline",
                    size: "lg"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Annuler ")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  createVNode(_component_UButton, {
                    onClick: handleSave,
                    loading: unref(loading),
                    size: "lg",
                    icon: "i-heroicons-check",
                    class: "bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(loading) ? "Rattachement en cours..." : "Confirmer le rattachement"), 1)
                    ]),
                    _: 1
                  }, 8, ["loading"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/rattachements/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const create = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5593fe95"]]);

export { create as default };
//# sourceMappingURL=create-U8eV-0Gf.mjs.map
