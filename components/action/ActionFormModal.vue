<script setup>
    const props = defineProps({
        openActionModal: { type: Boolean, default: false }, // v-model ouverture
        loading: { type: Boolean, default: false },
    })

    const emit = defineEmits(['update:openActionModal', 'createAction'])
    const actionForm = reactive({
        libelle: '',
    })

    const isOpen = computed({
        get: () => props.openActionModal,
        set: (val) => emit('update:openActionModal', val)
    })

    const handleCreateAction = () => {
        // Logique de création d'action ici
        console.log("Action à créer :", actionForm.libelle)
        isOpen.value = false
        emit('createAction', actionForm.libelle) // Émettre un événement pour informer le parent
    }
</script>


<template>
  <UModal v-model="isOpen" title="Nouvelle action">
    <UCard class="rounded-2xl max-h-[80vh] flex flex-col">
      <template #header>
        <h3 class="font-semibold">Nouvelle action</h3>
      </template>
      <div class="p-2 flex flex-col gap-4 overflow-y-auto">
        <UFormGroup label="Libellé" required>
          <UTextarea
            v-model="actionForm.libelle"
            placeholder="Ex: Formation du personnel"
            size="md"
          />
        </UFormGroup>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="ghost" @click="isOpen = false"
            >Annuler</UButton
          >
          <UButton
            color="blue"
            :loading="props.loading"
            @click="handleCreateAction"
            >Créer</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<style>

</style>