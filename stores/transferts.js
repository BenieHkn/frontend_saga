// stores/transferts.js
import { defineStore } from 'pinia'

export const useTransfertsStore = defineStore('transferts', {
  state: () => ({
    courriers: [],                 // Courriers reçus disponibles pour transfert
    selectedCourriers: [],         // IDs des courriers sélectionnés
    destinataires: [],             // Destinataires disponibles pour le transfert
    selectedDestinataires: []      // IDs des destinataires sélectionnés
  }),

  getters: {
    selectedCourriersData(state) {
      return state.courriers.filter(c =>
        state.selectedCourriers.includes(c.id)
      )
    },

    selectedDestinatairesData(state) {
      return state.destinataires.filter(d =>
        state.selectedDestinataires.includes(d.id)
      )
    },

    canSend(state) {
      return state.selectedCourriers.length > 0 &&
        state.selectedDestinataires.length > 0
    },

    hasSelections(state) {
      return state.selectedCourriers.length > 0 ||
        state.selectedDestinataires.length > 0
    },

    totalCourriers(state) {
      return state.selectedCourriers.length
    }
  },

  actions: {
    toggleCourrier(id) {
      const index = this.selectedCourriers.indexOf(id)
      if (index > -1) {
        this.selectedCourriers.splice(index, 1)
      } else {
        this.selectedCourriers.push(id)
      }
    },

    toggleDestinataire(id) {
      const index = this.selectedDestinataires.indexOf(id)
      if (index > -1) {
        this.selectedDestinataires.splice(index, 1)
      } else {
        this.selectedDestinataires.push(id)
      }
    },

    setCourriers(list) {
      this.courriers = list
    },

    setDestinataires(list) {
      this.destinataires = list
    },

    clearSelections() {
      this.selectedCourriers = []
      this.selectedDestinataires = []
    },

    resetStore() {
      this.$reset()
    }
  }
})