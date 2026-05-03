<template>
  <div>
    <!-- DG et SP : tous les courriers -->
    <AllCourriers v-if="isReady && voitTousCourriers()" />

    <div v-else class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <Icon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune fonction sélectionnée</h3>
        <p class="text-sm text-gray-600 mb-4">Veuillez vous reconnecter pour sélectionner une fonction.</p>
        <UButton to="/connexion" icon="i-heroicons-arrow-right-on-rectangle"
          class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white">
          Se reconnecter
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/auth/useAuth'

useHead({ title: "Courriers - SAGA" })

const AllCourriers = defineAsyncComponent(() =>
  import('~/components/documents/AllCourriers.vue')
)

const { voitTousCourriers, isAdmin } = useAuth()

const selectedFunction = ref(null)
const isReady = ref(false)
const toast = useToast()

onMounted(async () => {
  if (process.client) {
    try {
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) {
        toast.add({ title: 'Session expirée', description: 'Veuillez vous reconnecter.', color: 'red', timeout: 5000 })
        setTimeout(() => navigateTo('/connexion'), 2000)
        return
      }

      const savedFunction = localStorage.getItem('selected_entite')

      if (savedFunction) {
        try {
          selectedFunction.value = JSON.parse(savedFunction)
          await new Promise(resolve => setTimeout(resolve, 100))
          isReady.value = true
        } catch (error) {
          toast.add({ title: 'Erreur', description: 'Impossible de charger la fonction sélectionnée.', color: 'red', timeout: 1500 })
          isReady.value = true
        }
      } else if (isAdmin()) {
        // Admin can see all documents
        isReady.value = true
      } else {
        toast.add({ title: 'Attention', description: 'Aucune fonction sélectionnée. Veuillez vous reconnecter.', color: 'amber', timeout: 5000 })
        isReady.value = true
      }
    } catch (error) {
      toast.add({ title: 'Erreur', description: 'Une erreur est survenue lors du chargement.', color: 'red', timeout: 1500 })
      isReady.value = true
    }
  }
})
</script>