import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const useCourriersStore = defineStore("courriers", () => {
  const courrierToReply = ref(null);
  const setCourrierToReply = (courrier) => {
    courrierToReply.value = courrier;
  };
  const clearReply = () => {
    courrierToReply.value = null;
  };
  const isReplyMode = computed(() => !!courrierToReply.value);
  const affectesOptions = computed(() => {
    var _a, _b;
    if (!((_b = (_a = courrierToReply.value) == null ? void 0 : _a.affectations) == null ? void 0 : _b.length)) return [];
    return courrierToReply.value.affectations.map((a) => ({
      id: a.destinataire_id,
      label: `Destinataire #${a.destinataire_id}`,
      affectation: a
    }));
  });
  const replyDocumentSummary = computed(() => {
    var _a;
    if (!courrierToReply.value) return null;
    const doc = courrierToReply.value.document;
    return {
      id: doc == null ? void 0 : doc.id,
      reference: (doc == null ? void 0 : doc.reference) || "N/A",
      objet: (doc == null ? void 0 : doc.objet) || "Non sp\xE9cifi\xE9",
      date_enreg: doc == null ? void 0 : doc.date_enreg,
      numero_enreg: doc == null ? void 0 : doc.numero_enreg,
      type_document: (_a = doc == null ? void 0 : doc.type_document) == null ? void 0 : _a.libelle
    };
  });
  return {
    courrierToReply,
    isReplyMode,
    affectesOptions,
    replyDocumentSummary,
    setCourrierToReply,
    clearReply
  };
});

export { useCourriersStore as u };
//# sourceMappingURL=courriers-89bZxt-C.mjs.map
