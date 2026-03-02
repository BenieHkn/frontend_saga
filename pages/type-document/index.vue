<template>
    <!-- Liste des types de documents avec fonctionnalité CRUD -->
     <TypeDocumentDash/>
</template>

<script setup>
import TypeDocumentDash from '~/components/type_document/TypeDocumentDash.vue';

// Configuration du titre de la page
useHead({
  title: 'Type de document - Saga Revolution',
})
</script>

<style scoped>
</style>