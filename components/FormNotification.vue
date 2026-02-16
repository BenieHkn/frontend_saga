<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="show"
      class="fixed bottom-6 right-6 z-50 max-w-md w-full"
      :class="containerClass"
    >
      <div
        class="rounded-xl shadow-2xl border-2 overflow-hidden"
        :class="notificationClass"
      >
        <!-- Header avec icône et titre -->
        <div class="flex items-start gap-4 p-4">
          <!-- Icône -->
          <div class="flex-shrink-0">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="iconBgClass"
            >
              <Icon :name="icon" class="w-6 h-6" :class="iconClass" />
            </div>
          </div>

          <!-- Contenu -->
          <div class="flex-1 min-w-0">
            <!-- Titre -->
            <h4 class="font-bold text-sm mb-1" :class="titleClass">
              {{ title }}
            </h4>

            <!-- Message principal -->
            <p class="text-sm" :class="messageClass">
              {{ message }}
            </p>

            <!-- Détails optionnels -->
            <div v-if="details && details.length > 0" class="mt-3 space-y-1">
              <div
                v-for="(detail, index) in details"
                :key="index"
                class="text-xs flex items-start gap-2"
                :class="detailClass"
              >
                <Icon
                  :name="detail.type === 'success' ? 'heroicons:check-circle' : 'heroicons:x-circle'"
                  class="w-4 h-4 flex-shrink-0 mt-0.5"
                  :class="detail.type === 'success' ? 'text-emerald-500' : 'text-red-500'"
                />
                <span>{{ detail.message }}</span>
              </div>
            </div>

            <!-- Statistiques (pour les opérations multiples) -->
            <div
              v-if="stats"
              class="mt-3 flex items-center gap-4 text-xs font-bold"
            >
              <div v-if="stats.success > 0" class="flex items-center gap-1 text-emerald-600">
                <Icon name="heroicons:check-circle" class="w-4 h-4" />
                <span>{{ stats.success }} réussi{{ stats.success > 1 ? 's' : '' }}</span>
              </div>
              <div v-if="stats.error > 0" class="flex items-center gap-1 text-red-600">
                <Icon name="heroicons:x-circle" class="w-4 h-4" />
                <span>{{ stats.error }} échec{{ stats.error > 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>

          <!-- Bouton de fermeture -->
          <button
            @click="close"
            class="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
            :class="closeButtonClass"
          >
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>

        <!-- Barre de progression (pour auto-close) -->
        <div
          v-if="autoClose && progress > 0"
          class="h-1 transition-all duration-100 ease-linear"
          :class="progressBarClass"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // 'success', 'error', 'warning', 'info'
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: Array,
    default: () => []
    // Format: [{ type: 'success' | 'error', message: 'text' }]
  },
  stats: {
    type: Object,
    default: null
    // Format: { success: 5, error: 2 }
  },
  autoClose: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 5000 // 5 secondes
  }
})

const emit = defineEmits(['close'])

const progress = ref(100)
let timer = null
let progressInterval = null

// Classes computed basées sur le type
const notificationClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-emerald-50 border-emerald-300'
    case 'error':
      return 'bg-red-50 border-red-300'
    case 'warning':
      return 'bg-amber-50 border-amber-300'
    case 'info':
      return 'bg-blue-50 border-blue-300'
    default:
      return 'bg-slate-50 border-slate-300'
  }
})

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return 'heroicons:check-circle'
    case 'error':
      return 'heroicons:x-circle'
    case 'warning':
      return 'heroicons:exclamation-triangle'
    case 'info':
      return 'heroicons:information-circle'
    default:
      return 'heroicons:bell'
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-emerald-100'
    case 'error':
      return 'bg-red-100'
    case 'warning':
      return 'bg-amber-100'
    case 'info':
      return 'bg-blue-100'
    default:
      return 'bg-slate-100'
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-emerald-600'
    case 'error':
      return 'text-red-600'
    case 'warning':
      return 'text-amber-600'
    case 'info':
      return 'text-blue-600'
    default:
      return 'text-slate-600'
  }
})

const titleClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-emerald-900'
    case 'error':
      return 'text-red-900'
    case 'warning':
      return 'text-amber-900'
    case 'info':
      return 'text-blue-900'
    default:
      return 'text-slate-900'
  }
})

const messageClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-emerald-700'
    case 'error':
      return 'text-red-700'
    case 'warning':
      return 'text-amber-700'
    case 'info':
      return 'text-blue-700'
    default:
      return 'text-slate-700'
  }
})

const detailClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-emerald-600'
    case 'error':
      return 'text-red-600'
    case 'warning':
      return 'text-amber-600'
    case 'info':
      return 'text-blue-600'
    default:
      return 'text-slate-600'
  }
})

const closeButtonClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-emerald-600'
    case 'error':
      return 'text-red-600'
    case 'warning':
      return 'text-amber-600'
    case 'info':
      return 'text-blue-600'
    default:
      return 'text-slate-600'
  }
})

const progressBarClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-emerald-500'
    case 'error':
      return 'bg-red-500'
    case 'warning':
      return 'bg-amber-500'
    case 'info':
      return 'bg-blue-500'
    default:
      return 'bg-slate-500'
  }
})

const containerClass = computed(() => {
  return props.show ? 'animate-bounce-in' : ''
})

const close = () => {
  clearTimers()
  emit('close')
}

const clearTimers = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

const startAutoClose = () => {
  if (!props.autoClose || !props.show) return

  clearTimers()
  progress.value = 100

  const step = 100 / (props.duration / 100)

  progressInterval = setInterval(() => {
    progress.value -= step
    if (progress.value <= 0) {
      progress.value = 0
      clearInterval(progressInterval)
    }
  }, 100)

  timer = setTimeout(() => {
    close()
  }, props.duration)
}

// Watcher pour démarrer l'auto-close quand show devient true
watch(() => props.show, (newValue) => {
  if (newValue) {
    startAutoClose()
  } else {
    clearTimers()
  }
}, { immediate: true })

onUnmounted(() => {
  clearTimers()
})
</script>

<style scoped>
@keyframes bounce-in {
  0% {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  50% {
    transform: scale(1.02) translateY(-5px);
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.animate-bounce-in {
  animation: bounce-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>