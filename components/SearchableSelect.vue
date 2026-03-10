<template>
  <div class="relative" ref="containerRef">

    <!-- Trigger -->
    <button
      type="button"
      class="w-full flex items-center justify-between gap-2 px-3 py-2 text-xs bg-white border rounded-lg outline-none transition-all"
      :class="isOpen
        ? 'border-indigo-400 ring-2 ring-indigo-500/20 text-slate-900'
        : 'border-slate-300 hover:border-slate-400 text-slate-900'"
      @mousedown.prevent
      @click="toggle">
      <span :class="hasValue ? 'text-slate-900 font-medium' : 'text-slate-400'">
        {{ selectedLabel }}
      </span>
      <Icon
        :name="isOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
        class="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform" />
    </button>

    <!-- Dropdown via Teleport sur body — position: fixed viewport -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95">

        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="fixed z-[9999] bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden"
          :style="dropdownStyle"
          @mousedown.prevent>

          <!-- Input recherche -->
          <div class="px-3 py-2 border-b border-slate-100">
            <div class="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-lg border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Icon name="i-heroicons-magnifying-glass" class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                ref="searchInputRef"
                v-model="search"
                type="text"
                placeholder="Rechercher..."
                class="flex-1 text-xs bg-transparent outline-none text-slate-700 placeholder:text-slate-400 min-w-0"
                @keydown.escape.stop="close"
                @keydown.enter.prevent="selectFirst" />
              <button
                v-if="search"
                type="button"
                class="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                @click.stop="search = ''">
                <Icon name="i-heroicons-x-mark" class="w-3 h-3" />
              </button>
            </div>
          </div>

          <!-- Liste options -->
          <div class="overflow-y-auto py-1" :style="{ maxHeight: '224px' }">

            <!-- Option "Tous" / vide -->
            <button
              type="button"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left"
              :class="!hasValue
                ? 'text-indigo-600 font-semibold bg-indigo-50'
                : 'text-slate-500 hover:bg-slate-50'"
              @click="select('')">
              <Icon v-if="!hasValue" name="i-heroicons-check" class="w-3.5 h-3.5 shrink-0 text-indigo-500" />
              <span :class="!hasValue ? '' : 'ml-5'">{{ placeholder }}</span>
            </button>

            <div v-if="filteredOptions.length > 0" class="border-t border-slate-100 mx-3 my-1" />

            <!-- Options -->
            <button
              v-for="opt in filteredOptions"
              :key="opt.value"
              type="button"
              class="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors text-left"
              :class="isSelected(opt.value)
                ? 'text-indigo-600 font-semibold bg-indigo-50'
                : 'text-slate-700 hover:bg-slate-50'"
              @click="select(opt.value)">
              <Icon
                v-if="isSelected(opt.value)"
                name="i-heroicons-check"
                class="w-3.5 h-3.5 shrink-0 text-indigo-500" />
              <span :class="isSelected(opt.value) ? '' : 'ml-5'" class="truncate">{{ opt.label }}</span>
            </button>

            <!-- Aucun résultat -->
            <div
              v-if="filteredOptions.length === 0"
              class="flex flex-col items-center justify-center py-6 gap-2 text-slate-400">
              <Icon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-slate-300" />
              <span class="text-xs">Aucun résultat<template v-if="search"> pour « {{ search }} »</template></span>
            </div>
          </div>

          <!-- Footer compteur -->
          <div
            v-if="options.length > 5"
            class="px-3 py-1.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span class="text-[10px] text-slate-400">
              {{ filteredOptions.length }} / {{ options.length }} option{{ options.length > 1 ? 's' : '' }}
            </span>
            <button
              v-if="hasValue"
              type="button"
              class="text-[10px] text-red-500 hover:text-red-700 font-semibold transition-colors"
              @click="select('')">
              Effacer
            </button>
          </div>

        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  options:     { type: Array,            default: () => [] }, // [{ value, label }]
  placeholder: { type: String,           default: 'Tous' },
})

const emit = defineEmits(['update:modelValue', 'change'])

// ── Refs ──────────────────────────────────────────────────────────────────
const isOpen         = ref(false)
const search         = ref('')
const containerRef   = ref(null)
const dropdownRef    = ref(null)
const searchInputRef = ref(null)
const dropdownStyle  = ref({})

// ── Computed ──────────────────────────────────────────────────────────────
const hasValue = computed(() =>
  props.modelValue !== '' && props.modelValue !== null && props.modelValue !== undefined
)

const selectedLabel = computed(() => {
  if (!hasValue.value) return props.placeholder
  return props.options.find(o => String(o.value) === String(props.modelValue))?.label ?? props.placeholder
})

const filteredOptions = computed(() => {
  if (!search.value.trim()) return props.options
  const q = search.value.trim().toLowerCase()
  return props.options.filter(o => String(o.label).toLowerCase().includes(q))
})

const isSelected = (val) => String(props.modelValue) === String(val)

// ── Position dropdown — coordonnées viewport (position: fixed) ────────────
const computePosition = () => {
  if (!containerRef.value) return
  const rect       = containerRef.value.getBoundingClientRect()
  const width      = Math.max(rect.width, 240)
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const openUp     = spaceBelow < 260 && spaceAbove > spaceBelow

  // position: fixed → coordonnées viewport, PAS de scroll à ajouter
  dropdownStyle.value = {
    width:          `${width}px`,
    left:           `${rect.left}px`,
    transformOrigin: openUp ? 'bottom left' : 'top left',
    ...(openUp
      ? { bottom: `${window.innerHeight - rect.top}px`, top: 'auto' }
      : { top:    `${rect.bottom + 4}px`,               bottom: 'auto' }),
  }
}

// ── Actions ───────────────────────────────────────────────────────────────
const toggle = () => {
  if (isOpen.value) {
    close()
  } else {
    open()
  }
}

const open = () => {
  computePosition()
  isOpen.value = true
  nextTick(() => searchInputRef.value?.focus())
}

const close = () => {
  isOpen.value = false
  search.value = ''
}

const select = (val) => {
  emit('update:modelValue', val)
  emit('change', val)
  close()
}

const selectFirst = () => {
  if (filteredOptions.value.length > 0) {
    select(filteredOptions.value[0].value)
  }
}

// ── Fermeture au clic extérieur ───────────────────────────────────────────
// Utiliser "mousedown" sur document pour détecter clic hors composant
// IMPORTANT : le trigger et le dropdown ont @mousedown.prevent
// donc le document ne reçoit le mousedown QUE si c'est vraiment hors composant
const onDocumentMousedown = (e) => {
  if (!isOpen.value) return
  const clickedInsideContainer = containerRef.value?.contains(e.target)
  const clickedInsideDropdown  = dropdownRef.value?.contains(e.target)
  if (!clickedInsideContainer && !clickedInsideDropdown) {
    close()
  }
}

// Recalculer position au scroll/resize pour que le dropdown suive
const onScrollOrResize = () => {
  if (isOpen.value) computePosition()
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMousedown)
  window.addEventListener('scroll',      onScrollOrResize, true)
  window.addEventListener('resize',      onScrollOrResize)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMousedown)
  window.removeEventListener('scroll',      onScrollOrResize, true)
  window.removeEventListener('resize',      onScrollOrResize)
})
</script>