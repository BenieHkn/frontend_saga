<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-800 to-blue-900 relative overflow-hidden p-6">

    <div class="absolute top-[-20px] left-[-20px] w-64 h-64 border-[16px] border-white/10 rounded-full"></div>
    <div class="absolute bottom-10 right-10 w-32 h-32 border-8 border-white/5 rounded-full"></div>
    <div
      class="absolute top-1/4 right-1/4 w-0 h-0 border-l-[20px] border-l-transparent border-b-[40px] border-b-white/10 border-r-[20px] border-r-transparent rotate-12">
    </div>

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
          <h1 class="text-4xl text-center text-white">Modifier le mot de passe</h1>

          <UForm @submit="submit" class="space-y-6">
            <UFormGroup label="Nouveau mot de passe" name="newPassword"
              :ui="{ label: { base: 'text-white font-medium mb-2' } }">
              <UInput v-model="newPassword" :type="showNewPassword ? 'text' : 'password'"
                placeholder="Entrer le nouveau mot de passe" color="white" variant="outline" size="xl"
                :disabled="loading" :ui="{
                  rounded: 'rounded-2xl',
                  base: 'bg-white text-gray-900 focus:ring-emerald-400',
                  placeholder: 'placeholder-gray-400',
                  trailing: { padding: { xl: 'pr-12' } }
                }">
                <template #trailing>
                  <button type="button" @click.stop="showNewPassword = !showNewPassword"
                    class="pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none"
                    tabindex="-1">
                    <svg v-if="showNewPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clip-rule="evenodd" />
                      <path
                        d="M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z" />
                    </svg>
                  </button>
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup label="Confirmer le mot de passe" name="confirmPassword"
              :ui="{ label: { base: 'text-white font-medium mb-2' } }">
              <UInput v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirmer" color="white" variant="outline" size="xl" :disabled="loading" :ui="{
                  rounded: 'rounded-2xl',
                  base: 'bg-white text-gray-900 focus:ring-emerald-400',
                  placeholder: 'placeholder-gray-400',
                  trailing: { padding: { xl: 'pr-12' } }
                }">
                <template #trailing>
                  <button type="button" @click.stop="showConfirmPassword = !showConfirmPassword"
                    class="pointer-events-auto text-gray-400 hover:text-emerald-500 transition-colors p-1 focus:outline-none"
                    tabindex="-1">
                    <svg v-if="showConfirmPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clip-rule="evenodd" />
                      <path
                        d="M15.171 13.576l1.414 1.414a1 1 0 11-1.414 1.414l-14-14a1 1 0 111.414-1.414l.757.757A10 10 0 0110 18c4.478 0 8.268-2.943 9.542-7a9.971 9.971 0 00-1.371-2.424l.757-.757z" />
                    </svg>
                  </button>
                </template>
              </UInput>
            </UFormGroup>

            <!-- Message de succès -->
            <Transition enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-2">
              <div v-if="message" class="p-4 bg-emerald-500/20 border border-emerald-400 rounded-lg">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 mt-0.5">
                    <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-white text-sm font-medium">{{ message }}</span>
                </div>
              </div>
            </Transition>

            <!-- Message d'erreur -->
            <Transition enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform opacity-0 -translate-y-2" enter-to-class="transform opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="transform opacity-100 translate-y-0"
              leave-to-class="transform opacity-0 -translate-y-2">
              <div v-if="error" class="p-4 bg-red-500/20 border border-red-400 rounded-lg">
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 mt-0.5">
                    <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <span class="text-white text-sm font-medium">{{ error }}</span>
                </div>
              </div>
            </Transition>

            <UButton type="submit" block size="xl" :loading="loading" :disabled="loading"
              class="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed font-bold tracking-widest py-4 mt-4 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
              :ui="{ rounded: 'rounded-full' }">
              <span v-if="!loading">Modifier</span>
              <span v-else>Modification...</span>
            </UButton>
          </UForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

definePageMeta({ layout: false })

const route = useRoute()
const { resetPassword } = useAuth()

const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const message = ref('')
const error = ref('')

const submit = async () => {
  message.value = ''
  error.value = ''

  if (!newPassword.value || newPassword.value.length < 6) {
    error.value = 'Le mot de passe doit contenir au moins 6 caractères.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  const token = route.query.token
  const email = route.query.email

  if (!token || !email) {
    error.value = "Token ou email manquant. Vérifiez l'URL du lien reçu par email."
    return
  }

  loading.value = true
  const res = await resetPassword({
    token,
    email,
    password: newPassword.value,
    password_confirmation: confirmPassword.value,
  })
  loading.value = false

  if (res.success) {
    message.value = 'Mot de passe modifié avec succès.'
    setTimeout(() => navigateTo('/'), 2000)
  } else {
    error.value = res.message || 'Erreur lors de la modification.'
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap');

body {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
}

.backdrop-blur-2xl {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}
</style>