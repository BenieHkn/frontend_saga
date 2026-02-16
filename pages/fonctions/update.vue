<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">MODIFICATION D'UNE FONCTION</h1>
      <p class="text-gray-600 mt-1"></p>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pb-16">
        <form @submit.prevent="update" class="space-y-4 max-w-4xl mx-auto">

            <div class="grid grid-cols-12 gap-4">
                <div class="col-start-1 col-span-10">
                    <label class="block text-md font-bold text-gray-700 mb-2">Sigle <b class="text-red-700">*</b></label>
                    <input v-model="form.sigle" placeholder="Sigle"
                        class="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                    />
                    <p v-if="errors.sigle && form.sigle==''" class="text-red-600 text-sm font-bold mt-1">{{ errors.sigle }}</p>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-4">
                <div class="col-start-1 col-span-10">
                    <label class="block text-md font-bold text-gray-700 mb-2">Libellé <b class="text-red-700">*</b> </label>
                    <input v-model="form.libelle" placeholder="Libellé"
                        class="w-full pl-3 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12"
                    />
                    <p v-if="errors.libelle && form.libelle==''" class="text-red-600 text-sm font-bold mt-1">{{ errors.libelle }}</p>
                </div>
            </div>
            
            <div class="flex items-center gap-4 mt-8">
            <!-- Action Buttons -->
                <ULink to="/fonctions" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded">
                        ANNULER 
                </ULink>
                <button 
                    type="submit"
                    :disabled="loading"
                    class="bg-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded disabled:opacity-50"
                >
                        <span v-if="loading">MISE À JOUR...</span>
                        <span v-else>MODIFIER</span>
                </button>
            </div>
        </form>
    </div>
  </div>

    <!-- Success Modal -->
 <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-12 w-[500px] max-w-[90vw] mx-4">
    <div class="text-center">
      <div class="mx-auto w-96 h-16 bg-green-100 rounded-full flex items-center justify-center mb-8">
        <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h3 class="text-2xl font-semibold text-gray-900 mb-4">Succès !</h3>
      <p class="text-xl text-gray-600 mb-8">La fonction a été modifiée avec succès</p>
      <ULink
        to="/fonctions"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-lg  max-w-2xl mx-auto"
      >
        OK
      </ULink>
    </div>
  </div>
</div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

const tabErrors = ref([])
const loading = ref(false)
const showSuccessModal = ref(false)

// Form data
const form = ref({
  sigle: '',
  libelle: ''
})

// Form errors
const errors = ref({
  sigle: '',
  libelle: ''
})

// Load fonction data
const loadFonction = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await $fetch(`http://localhost:8080/api/fonctions/${route.params.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    form.value = {
      sigle: response.sigle,
      libelle: response.libelle
    }
  } catch (error) {
    console.error('Error loading fonction:', error)
    alert('Erreur lors du chargement de la fonction')
    router.push('/fonctions')
  }
}

// Load data on mount
onMounted(() => {
  loadFonction()
})

// Handle form submission
const update = async () => {
  // Reset errors and tabErrors
  errors.value = {
    sigle: '',
    libelle: ''
  }
  tabErrors.value = []
  
  // Validate form
  if (!form.value.sigle.trim()) {
    errors.value.sigle = 'Le sigle est obligatoire'
    tabErrors.value.push('sigle')
  }

  if (!form.value.libelle.trim()) {
    errors.value.libelle = 'Le libellé est obligatoire'
    tabErrors.value.push('libelle')
  }

  if (tabErrors.value.length > 0) {
    return
  }
  
  loading.value = true
  
  try {
    // API call
    const token = localStorage.getItem('token')
    const response = await $fetch(`http://localhost:8080/api/fonctions/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: form.value
    })
    
    // Show success modal
    showSuccessModal.value = true
    
  } catch (error) {
    // Handle different error codes
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 500:
          alert('Erreur serveur : Une erreur interne est survenue. Veuillez réessayer plus tard.')
          break
        case 404:
          alert('Erreur 404 : La fonction n\'a pas été trouvée.')
          break
        case 403:
          alert('Erreur 403 : Accès refusé. Vous n\'avez pas les permissions nécessaires.')
          break
        case 422:
          // Validation errors from API
          if (error.response._data && error.response._data.errors) {
            const apiErrors = error.response._data.errors
            Object.keys(apiErrors).forEach(field => {
              if (errors.value[field] !== undefined) {
                errors.value[field] = apiErrors[field][0]
              }
            })
          } else {
            alert('Erreur 422 : Les données envoyées ne sont pas valides.')
          }
          break
        default:
          alert(`Erreur ${status} : Une erreur est survenue lors de la modification de la fonction`)
      }
    } else if (error.request) {
      alert('Erreur réseau : Impossible de contacter le serveur. Vérifiez votre connexion.')
    } else {
      alert('Erreur : Une erreur inattendue est survenue.')
    }
  } finally {
    loading.value = false
  }
}
</script>
