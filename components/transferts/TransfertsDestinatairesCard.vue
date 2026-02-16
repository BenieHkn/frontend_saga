<template>
  <div
    class="relative group flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden"
    :class="selected 
      ? 'border-emerald-500 shadow-lg shadow-emerald-100' 
      : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'"
    @click="$emit('toggle')"
  >
    <div
      v-if="selected"
      class="absolute inset-0 pointer-events-none z-0"
      style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);"
    ></div>

    <div class="flex items-center gap-4 flex-1 min-w-0 z-10">
      <div
        class="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm transition-transform group-hover:scale-105"
        :class="getAvatarColor(recipient.initials)"
      >
        {{ recipient.initials }}
      </div>

      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-slate-900 truncate">{{ recipient.name }}</h4>
        <p class="text-sm text-slate-600 truncate font-medium">{{ recipient.fonction }}</p>
        <p class="text-xs text-slate-400 truncate">{{ recipient.email }}</p>
      </div>
    </div>

    <div
      class="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300 z-10"
      :class="selected 
        ? 'bg-emerald-500 scale-110 shadow-md shadow-emerald-200' 
        : 'bg-slate-100 scale-100 group-hover:bg-emerald-100'"
    >
      <Icon
        v-if="selected"
        key="selected-icon"
        name="heroicons:check-16-solid" 
        class="w-5 h-5 text-white"
      />
      <Icon
        v-else
        key="unselected-icon"
        name="heroicons:plus-small-20-solid"
        class="w-5 h-5 text-slate-400 group-hover:text-emerald-500"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  recipient: { type: Object, required: true },
  selected: { type: Boolean, default: false }
})
defineEmits(['toggle'])

const getAvatarColor = (initials) => {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-cyan-500 to-cyan-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-slate-500 to-slate-600',
  ]
  const charCode = (initials?.charCodeAt(0) || 0) + (initials?.charCodeAt(1) || 0)
  return colors[charCode % colors.length]
}
</script>