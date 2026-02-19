<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col p-5">

    <PageHeader
      title="Mes Documents"
      subtitle="Documents reçus et courriers en visibilité"
    />

    <AppTabs :tabs="tabList">

      <!-- ==============================
           AFFECTATIONS REÇUES
      ============================== -->
      <template #affectations>
        <div class="space-y-4">
          <AffectationsListe />
        </div>
      </template>

      <!-- ==============================
           COURRIERS EN VISIBILITÉ
      ============================== -->
      <template #visibilite>
        <div class="space-y-4">
          <CourriersVisibles />
        </div>
      </template>

    </AppTabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AffectationsListe from '~/components/documents/AffectationsListe.vue'
import CourriersVisibles from '~/components/documents/CourriersVisibles.vue'
import PageHeader from '~/components/PageHeader.vue'
import AppTabs from '~/components/AppTabs.vue'

useHead({
  title: 'Mes Documents - Sagar Revolution',
})

const tabList = ref([
  {
    id: 'affectations',
    label: 'Documents reçus',
    icon: 'i-heroicons-inbox',
    count: null,
  },
  {
    id: 'visibilite',
    label: 'Initiés/Paraphés',
    icon: 'i-heroicons-eye',
    count: null,
  },
])
</script>