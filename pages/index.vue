<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-900 overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

    <div class="flex flex-col items-center justify-center gap-10 z-10">
      <div class="relative flex items-center justify-center">
        <div class="absolute w-48 h-48 border-2 border-white/5 rounded-full"></div>
        <div class="absolute w-48 h-48 border-t-2 border-emerald-400 rounded-full animate-spin-slow"></div>
        <div class="absolute w-40 h-40 border-b-2 border-blue-400 rounded-full animate-spin-reverse"></div>

        <div class="relative p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl scale-110">
          <img src="/images/logo_saga.png" alt="Logo SAGA" class="w-20 h-20 object-contain"/>
        </div>
      </div>
      
      <div class="text-center">
        <h1 class="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-2 tracking-tighter">
          SAGA
        </h1>
        <p class="text-sm font-medium text-blue-200/60 tracking-[0.5em] uppercase">
          Revolution
        </p>
      </div>
      
      <div class="flex items-center gap-3 px-6 py-2 bg-black/20 rounded-full border border-white/5">
        <div class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]"></div>
        <p class="text-emerald-100/70 text-xs font-medium uppercase letter-spacing-wide">Chargement...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
const config = useRuntimeConfig()

console.log('LARAVEL API URL:', config.public.laravelApiUrl)

onMounted(async () => {
  if (process.client) {
    // Petit délai pour l'effet visuel avant redirection
    const token = localStorage.getItem('auth_token')
      if (token) {
        await navigateTo('/dashboard')
      } else {
        await navigateTo('/connexion')
      }
  }
  
})
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes spin-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

.bg-clip-text {
  -webkit-background-clip: text;
}
</style>