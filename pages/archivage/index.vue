<template>
  <div class="min-h-screen bg-slate-50 p-10 font-sans">
    <div class="max-w-7xl mx-auto">
      <PageHeader title="Préarchivage" subtitle="Gestion des archives"/>

      <div class="mb-8">
        <ToggleButton
          v-model="currentFilter" 
          :options="filterOptions" 
        />
      </div>
       <UCard class="mt-8 text-center p-10">
        <p class="text-slate-500 font-medium">
          Affichage des résultats pour le filtre : 
          <span class="font-bold text-blue-600">{{ currentFilter }}</span>
        </p>
      </UCard>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 1. L'état réactif qui stocke la sélection actuelle
const currentFilter = ref('all')

// 2. La configuration des options du menu
const filterOptions = [
  { label: 'Toutes les Archives', value: 'all' },
  { label: 'En préarchivage', value: 'pending' },
  { label: 'Archived', value: 'archived' }
]
</script>