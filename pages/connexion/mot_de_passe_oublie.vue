<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-800 to-blue-900 relative overflow-hidden p-6">
    
    <div class="absolute top-[-20px] left-[-20px] w-64 h-64 border-[16px] border-white/10 rounded-full"></div>
    <div class="absolute bottom-10 right-10 w-32 h-32 border-8 border-white/5 rounded-full"></div>
    <div class="absolute top-1/4 right-1/4 w-0 h-0 border-l-[20px] border-l-transparent border-b-[40px] border-b-white/10 border-r-[20px] border-r-transparent rotate-12"></div>

    <div class="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10">
      
      <div class="text-white md:text-left text-center flex-1">
        <h1 class="text-9xl lg:ms-7 font-bold tracking-tight mb-2 drop-shadow-xl">
          SAGA
        </h1>
        <p class="text-xl tracking-[0.2em] font-light text-white/80">
          Bienvenue sur notre plateforme...
        </p>
      </div>

      <div class="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
        <div class="space-y-6">
          <h1 class="text-xl text-center text-white">Mot de passe oublié ?</h1>
        
          <UForm @submit="submit" class="space-y-6">
            <UFormGroup label="Email" name="email" :ui="{ label: { base: 'text-white font-medium mb-2' } }">
              <UInput 
                v-model="email"
                placeholder="Votre email" 
                color="white"
                variant="outline"
                size="xl"
                :disabled="loading"
                class="shadow-sm"
                :ui="{ 
                  rounded: 'rounded-2xl',
                  base: 'bg-white text-gray-900 focus:ring-emerald-400',
                  placeholder: 'placeholder-gray-400'
                }"
              />
            </UFormGroup>

            <UButton 
              type="submit"
              block 
              size="xl" 
              :loading="loading"
              :disabled="loading"
              class="bg-white/10 backdrop-blur-md hover:bg-white/20 font-bold tracking-widest py-4 mt-4 transition-all duration-300 transform hover:scale-[1.02] border border-white/10"
              :ui="{ rounded: 'rounded-full' }"
            >
              <span v-if="!loading">Envoyer</span>
              <span v-else>Envoi en cours...</span>
            </UButton>

            <div v-if="message" class="p-3 mt-2 bg-emerald-500/20 border border-emerald-400 rounded-lg text-white text-sm">{{ message }}</div>
            <div v-if="error" class="p-3 mt-2 bg-red-500/20 border border-red-400 rounded-lg text-white text-sm">{{ error }}</div>
          </UForm>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: false })

const { forgotPassword } = useAuth()

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const submit = async () => {
  message.value = ''
  error.value = ''

  if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Veuillez entrer une adresse email valide.'
    return
  }

  loading.value = true
  const res = await forgotPassword(email.value)
  loading.value = false

  if (res.success) {
    message.value = 'Un email de réinitialisation a été envoyé.'
  } else {
    error.value = res.message || 'Erreur lors de la demande.'
  }
}
</script>
<style>
/* Importation de la police Montserrat */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap');

body {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
}

/* Optimisation du flou */
.backdrop-blur-2xl {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}
</style>