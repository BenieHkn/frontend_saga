<script setup>
import { useAuth } from '~/composables/auth/useAuth'

definePageMeta({
  layout: false,
})

const showPassword = ref(false)

const {
  form,
  rememberMe,
  loading,
  authError,
  successMessage,
  login,
  loadRememberedEmail
} = useAuth()

onMounted(async () => {
  loadRememberedEmail()
  if (process.client) {
    const token = localStorage.getItem('auth_token')

    // 2. On effectue la redirection
    if (token) {
      await navigateTo('/dashboard')
    } 
  }
})
</script>

<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-800 to-blue-900 relative overflow-hidden p-6 font-['Montserrat']">

    <div class="absolute top-[-20px] left-[-20px] w-64 h-64 border-[16px] border-white/10 rounded-full"></div>
    <div class="absolute bottom-10 right-10 w-32 h-32 border-8 border-white/5 rounded-full"></div>
    <div
      class="absolute top-1/4 right-1/4 w-0 h-0 border-l-[20px] border-l-transparent border-b-[40px] border-b-white/10 border-r-[20px] border-r-transparent rotate-12">
    </div>

    <div class="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10">

      <div class="text-white text-center flex-1 select-none">
        <h1 class="text-8xl font-bold tracking-tight mb-0 drop-shadow-2xl">
          SAGA
        </h1>
        <h2
          class="text-2xl font-bold tracking-[0.5em] animate-gold-sweep bg-clip-text text-transparent bg-[length:200%_auto] mb-2">
          REVOLUTION
        </h2>
        <p class="text-xl tracking-[0.2em] font-light text-white/70">
          Bienvenue sur notre plateforme...
        </p>
      </div>

      <div class="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 shadow-2xl">
        <div class="space-y-6">
          <h1 class="text-5xl text-center text-white font-bold">Connexion</h1>

          <UForm @submit="login" :state="form" class="space-y-6">

            <UFormGroup label="Email" name="email" :ui="{ label: { base: 'text-white font-medium mb-2' } }">
              <UInput v-model="form.email"   @blur="form.email = form.email.trim()" placeholder="Votre email" color="white" variant="outline" size="xl" :ui="{
                rounded: 'rounded-2xl',
                base: 'bg-white text-gray-900 focus:ring-emerald-400',
                placeholder: 'placeholder-gray-400'
              }" />
            </UFormGroup>

            <UFormGroup label="Mot de passe" name="password" :ui="{ label: { base: 'text-white font-medium mb-2' } }">
              <div class="relative w-full">
                <UInput v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••"
                  color="white" variant="outline" size="xl" :disabled="loading" :ui="{
                    rounded: 'rounded-2xl',
                    base: 'bg-white text-gray-900 focus:ring-emerald-400 pr-12',
                    placeholder: 'placeholder-gray-400',
                    wrapper: 'w-full',
                  }" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-emerald-500 transition-colors focus:outline-none cursor-pointer z-20"
                  tabindex="-1">
                  <svg v-if="showPassword" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
              </div>
            </UFormGroup>

            <div v-if="authError" class="p-4 bg-red-500/20 border border-red-400 rounded-xl flex items-center gap-3">
              <span class="text-white text-sm font-medium">{{ authError }}</span>
            </div>

            <div v-if="successMessage"
              class="p-4 bg-emerald-500/20 border border-emerald-400 rounded-xl flex items-center gap-3">
              <span class="text-white text-sm font-medium">{{ successMessage }}</span>
            </div>

            <div class="flex items-center">
              <UCheckbox v-model="rememberMe" label="Se souvenir de moi" :disabled="loading" :ui="{
                label: 'text-white text-sm',
                background: 'bg-white/10',
                border: 'border-white/30',
                ring: 'focus-visible:ring-2 focus-visible:ring-emerald-400',
                color: 'text-emerald-500',
                base: 'h-5 w-5 rounded-md'
              }" />
            </div>

            <UButton type="submit" block size="xl" :loading="loading"
              class="border border-white/30 text-white font-bold tracking-widest py-4 mt-4 transition-all duration-300 transform hover:scale-[1.02] hover:bg-white/20 hover:border-white/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              :ui="{ rounded: 'rounded-full' }">
              {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
            </UButton>
          </UForm>

          <div class="text-center">
            <NuxtLink to="/connexion/mot_de_passe_oublie"
              class="text-sm text-white/80 hover:text-white transition-colors underline-offset-4 hover:underline">
              Mot de passe oublié ? Cliquez ici.
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap');

body {
  font-family: 'Montserrat', sans-serif;
}

/* Animation de balayage Gold & Emerald */
.animate-gold-sweep {
  background-image: linear-gradient(90deg,
      #10b981 0%,
      #10b981 15%,      /* ← vert tenu plus longtemps */
      #f59e0b 35%,
      #fef3c7 50%,      /* ← blanc doré au centre */
      #f59e0b 65%,
      #10b981 85%,      /* ← retour vert tenu */
      #10b981 100%);
  background-size: 300% auto;   /* ← plus large = transition plus douce */
  animation: sweep 10s ease-in-out infinite;  /* ← ease-in-out au lieu de linear */
  filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.5));
}

@keyframes sweep {
  0%   { background-position: 0% center; }
  50%  { background-position: 150% center; }
  100% { background-position: 0% center; }
}

.backdrop-blur-2xl {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}
</style>