import { defineStore } from 'pinia';

const useTransfertsStore = defineStore("transferts", {
  state: () => ({
    affectations: [],
    // Liste complète des affectations (type: transfert)
    selectedAffectations: [],
    // IDs des affectations sélectionnées pour transfert
    destinataires: [],
    // Destinataires disponibles pour le transfert
    selectedDestinataires: []
    // IDs des destinataires sélectionnés
  }),
  getters: {
    // Données complètes des affectations sélectionnées
    selectedAffectationsData(state) {
      return state.affectations.filter(
        (a) => state.selectedAffectations.includes(a.id)
      );
    },
    // Données complètes des destinataires sélectionnés
    selectedDestinatairesData(state) {
      return state.destinataires.filter(
        (d) => state.selectedDestinataires.includes(d.id)
      );
    },
    // Vérifier si on peut envoyer le transfert
    canSend(state) {
      return state.selectedAffectations.length > 0 && state.selectedDestinataires.length > 0;
    },
    hasSelections(state) {
      return state.selectedAffectations.length > 0 || state.selectedDestinataires.length > 0;
    },
    // Nombre total de courriers dans les affectations sélectionnées
    totalCourriers(state) {
      return this.selectedAffectationsData.reduce((total, affectation) => {
        return total + (affectation.nb_courriers || 0);
      }, 0);
    }
  },
  actions: {
    // Toggle affectation
    toggleAffectation(id) {
      const index = this.selectedAffectations.indexOf(id);
      if (index > -1) {
        this.selectedAffectations.splice(index, 1);
      } else {
        this.selectedAffectations.push(id);
      }
    },
    // Toggle destinataire
    toggleDestinataire(id) {
      const index = this.selectedDestinataires.indexOf(id);
      if (index > -1) {
        this.selectedDestinataires.splice(index, 1);
      } else {
        this.selectedDestinataires.push(id);
      }
    },
    // Définir les listes
    setAffectations(list) {
      this.affectations = list;
    },
    setDestinataires(list) {
      this.destinataires = list;
    },
    // Réinitialiser les sélections
    clearSelections() {
      this.selectedAffectations = [];
      this.selectedDestinataires = [];
    },
    // Réinitialiser tout le store
    resetStore() {
      this.$reset();
    }
  }
});

export { useTransfertsStore as u };
//# sourceMappingURL=transferts-8xZaXUA2.mjs.map
