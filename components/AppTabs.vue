<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  defaultTab: {
    type: String,
    default: null,
  },
  currentTab: {
    type: String,
    default: null,
  }
})

const emit = defineEmits(['update:currentTab'])

// Priorité : modelValue (v-model) > defaultTab > premier onglet
const activeTab = ref(props.currentTab ?? props.defaultTab ?? props.tabs?.[0]?.id)

// Sync depuis le parent (quand le parent change la valeur du v-model)
watch(() => props.currentTab, (val) => {
  if (val && val !== activeTab.value) activeTab.value = val
})

// Notify le parent quand l'onglet change
const setTab = (id) => {
  activeTab.value = id
  emit('update:currentTab', id)
}
</script>

<template>
  <div>
    <div class="border-b border-slate-200 mb-6">
      <nav class="flex gap-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="setTab(tab.id)"
          class="pb-4 pt-2 text-sm font-medium transition-all border-b-2"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div class="animate-in fade-in duration-300">
      <slot :name="activeTab" />
    </div>
  </div>
</template>