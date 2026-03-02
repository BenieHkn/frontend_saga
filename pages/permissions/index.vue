<template>
    <!-- Liste des types de documents avec fonctionnalité CRUD -->
     <Permissions/>
</template>

<script setup>
import Permissions from '~/components/permissions/Permissions.vue';

// Configuration du titre de la page
useHead({
  title: 'Permissions - Saga Revolution',
})
</script>

<style scoped>
</style>