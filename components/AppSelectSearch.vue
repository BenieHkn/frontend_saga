<!-- components/AppSelectSearch.vue -->
<script setup>
const props = defineProps({
  options:      { type: Array,   default: () => [] }, // [{ label, value }]
  modelValue:   { type: Array,   default: () => [] }, // toujours un tableau en multiple
  placeholder:  { type: String,  default: 'Rechercher...' },
  loading:      { type: Boolean, default: false },
  multiple:     { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const search = ref('')
const open   = ref(false)

const filtered = computed(() =>
  props.options.filter(o =>
    o.label.toLowerCase().includes(search.value.toLowerCase())
  )
)

// ── Sélection simple ──────────────────────────────────────────────────────────
const selectedSingle = computed(() =>
  props.options.find(o => o.value === props.modelValue) ?? null
)

// ── Sélection multiple ────────────────────────────────────────────────────────
const selectedMultiple = computed(() =>
  props.options.filter(o => props.modelValue.includes(o.value))
)

const isSelected = (option) =>
  props.multiple
    ? props.modelValue.includes(option.value)
    : props.modelValue === option.value

const select = (option) => {
  if (props.multiple) {
    const current = [...props.modelValue]
    const idx = current.indexOf(option.value)
    idx === -1 ? current.push(option.value) : current.splice(idx, 1)
    emit('update:modelValue', current)
    // Ne pas fermer en mode multiple
  } else {
    emit('update:modelValue', option.value)
    open.value = false
  }
  search.value = ''
}

const removeTag = (value) => {
  emit('update:modelValue', props.modelValue.filter(v => v !== value))
}

const clear = () => {
  emit('update:modelValue', props.multiple ? [] : null)
  search.value = ''
}

// ── Fermer si clic extérieur ──────────────────────────────────────────────────
const container = ref(null)
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (container.value && !container.value.contains(e.target)) {
      open.value = false
      search.value = ''
    }
  })
})
</script>

<template>
  <div ref="container" class="relative">

    <!-- Trigger -->
    <div
      @click="open = !open"
      class="flex items-center justify-between gap-2 w-full min-h-[38px] px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 cursor-pointer hover:border-blue-400 transition-colors"
      :class="open ? 'border-blue-500 ring-1 ring-blue-500' : ''"
    >
      <!-- Tags (multiple) -->
      <div v-if="multiple" class="flex flex-wrap gap-1 flex-1">
        <span
          v-for="item in selectedMultiple"
          :key="item.value"
          class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-full"
        >
          {{ item.label }}
          <button @click.stop="removeTag(item.value)" class="hover:text-blue-900">
            <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
          </button>
        </span>
        <span v-if="!selectedMultiple.length" class="text-gray-400 py-0.5">
          {{ placeholder }}
        </span>
      </div>

      <!-- Valeur simple -->
      <span v-else-if="selectedSingle" class="text-gray-900 dark:text-white truncate flex-1">
        {{ selectedSingle.label }}
      </span>
      <span v-else class="text-gray-400 flex-1">{{ placeholder }}</span>

      <!-- Actions -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          v-if="multiple ? modelValue.length : modelValue"
          @click.stop="clear"
          class="text-gray-400 hover:text-gray-600"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
        <UIcon
          name="i-heroicons-chevron-down"
          class="w-4 h-4 text-gray-400 transition-transform"
          :class="open ? 'rotate-180' : ''"
        />
      </div>
    </div>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="open"
        class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
      >
        <!-- Search -->
        <div class="p-2 border-b border-gray-100 dark:border-gray-800">
          <input
            v-model="search"
            type="text"
            :placeholder="placeholder"
            class="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md outline-none focus:border-blue-400"
            @click.stop
            autofocus
          />
        </div>

        <!-- Compteur (multiple) -->
        <div v-if="multiple && modelValue.length" class="px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-800">
          {{ modelValue.length }} sélectionné(s)
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-4">
          <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-blue-500" />
        </div>

        <!-- Options -->
        <ul v-else class="max-h-52 overflow-y-auto">
          <li v-if="!filtered.length" class="px-3 py-4 text-sm text-center text-gray-400">
            Aucun résultat
          </li>
          <li
            v-for="option in filtered"
            :key="option.value"
            @click="select(option)"
            class="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
            :class="isSelected(option) ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 font-medium' : 'text-gray-700 dark:text-gray-300'"
          >
            <div class="flex items-center gap-2">
              <!-- Checkbox visuelle en mode multiple -->
              <div
                v-if="multiple"
                class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors"
                :class="isSelected(option) ? 'bg-blue-500 border-blue-500' : 'border-gray-300 dark:border-gray-600'"
              >
                <UIcon v-if="isSelected(option)" name="i-heroicons-check" class="w-3 h-3 text-white" />
              </div>
              {{ option.label }}
            </div>
            <UIcon v-if="!multiple && isSelected(option)" name="i-heroicons-check" class="w-4 h-4 text-blue-500" />
          </li>
        </ul>

        <!-- Footer multiple -->
        <div v-if="multiple" class="p-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <UButton size="xs" color="blue" variant="soft" @click="open = false">
            Confirmer
          </UButton>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: all 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-4px); }
</style>