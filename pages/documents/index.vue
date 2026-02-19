<template>
  <div>
    <AllCourriers 
      v-if="isReady && (selectedFunction?.code === 'DGML' || selectedFunction?.code === 'SP')" 
    />
    <AffectationsListe 
      v-else-if="isReady && selectedFunction" 
    />
    <div v-else-if="!isReady" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <Icon name="i-heroicons-arrow-path" class="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
        <p class="text-sm text-gray-600">Chargement...</p>
      </div>
    </div>
    <div v-else class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <Icon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune fonction sélectionnée</h3>
        <p class="text-sm text-gray-600 mb-4">Veuillez vous reconnecter pour sélectionner une fonction.</p>
        <UButton 
          to="/connexion" 
          icon="i-heroicons-arrow-right-on-rectangle"
          class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white"
        >
          Se reconnecter
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Composants chargés de manière asynchrone pour éviter les timeouts
const AllCourriers = defineAsyncComponent(() => 
  import('~/components/documents/AllCourriers.vue')
)
const AffectationsListe = defineAsyncComponent(() => 
  import('~/components/documents/MyDocuments.vue')
)

// État
const selectedFunction = ref(null)
const isReady = ref(false)
const toast = useToast()

// Chargement de la fonction sélectionnée
onMounted(async () => {
  if (process.client) {
    try {
      // Vérifier le token d'authentification en premier
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) {
        console.error('❌ Aucun token d\'authentification')
        toast.add({
          title: 'Session expirée',
          description: 'Veuillez vous reconnecter.',
          color: 'red',
          timeout: 5000,
        })
        // Rediriger vers la page de login après 2 secondes
        setTimeout(() => {
          navigateTo('/connexion')
        }, 2000)
        return
      }

      // Charger la fonction sélectionnée
      const savedFunction = localStorage.getItem('selected_entite')
      
      if (savedFunction) {
        try {
          selectedFunction.value = JSON.parse(savedFunction)
          console.log('✅ Fonction chargée:', selectedFunction.value)
          
          // Petit délai pour s'assurer que tout est prêt
          await new Promise(resolve => setTimeout(resolve, 100))
          isReady.value = true
          
        } catch (error) {
          console.error('❌ Erreur lors du parsing de la fonction:', error)
          toast.add({
            title: 'Erreur',
            description: 'Impossible de charger la fonction sélectionnée.',
            color: 'red',
            timeout: 1500,
          })
          isReady.value = true // Afficher le message d'erreur
        }
      } else {
        console.warn('⚠️ Aucune fonction trouvée dans le localStorage')
        toast.add({
          title: 'Attention',
          description: 'Aucune fonction sélectionnée. Veuillez vous reconnecter.',
          color: 'amber',
          timeout: 5000,
        })
        isReady.value = true // Afficher le message d'erreur
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error)
      toast.add({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du chargement.',
        color: 'red',
        timeout: 1500,
      })
      isReady.value = true
    }
  }
})
</script>