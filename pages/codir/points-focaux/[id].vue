<template>
    <div>
        <div class="flex items-center gap-2">
            <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" @click="$router.back()" />
            <PageHeader title="Dossier" description="Détails du dossier" />
        </div>

        <div>
            <CodirDossier v-for="dossier in store.dossiers" :key="dossier.id" :dossier="dossier"/>
        </div>

        <div>
            <UButton color="gray" loading-icon="i-" label="Ajouter un nouveau dossier" variant="ghost" icon="i-heroicons-plus" @click="addDossier" />
        </div>
    </div>
</template>

<script setup>
const route = useRoute()

const store = useCodirsStore()
const currentPointsFocaux = computed(() => store.pointsFocaux.find(pf => pf.id === Number(route.params.id)))
console.log(currentPointsFocaux.value)

</script>