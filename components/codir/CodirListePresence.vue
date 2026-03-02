<!-- components/CodirAttendanceCard.vue -->
<script setup lang="ts">
const props = defineProps<{
  name: string
  role: string
  initials: string
  initialStatus?: 'present' | 'absent'
  initialReason?: string
}>()

const emit = defineEmits<{
  change: [payload: { status: 'present' | 'absent'; reason: string }]
}>()

const status = ref<'present' | 'absent'>(props.initialStatus ?? 'present')
const reason = ref(props.initialReason ?? '')

// Émettre à chaque changement
watch([status, reason], () => {
  emit('change', { status: status.value, reason: reason.value })
})

// Couleur du badge de rôle
const roleColor = computed(() => ({
  'Président': 'text-blue-600 bg-blue-50 dark:bg-blue-950/40',
  'Secrétaire': 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
  'Rapporteur': 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
  'Suppléant': 'text-gray-500 bg-gray-100 dark:bg-gray-800/60',
  'Membre': 'text-slate-600 bg-slate-100 dark:bg-slate-800/60',
}[props.role] ?? 'text-gray-500 bg-gray-100'))
</script>

<template>
  <UCard
    :ui="{
      body: { padding: 'p-4' },
      ring: status === 'absent'
        ? 'ring-1 ring-red-200 dark:ring-red-900/50'
        : 'ring-1 ring-gray-200 dark:ring-gray-800',
      background: status === 'absent'
        ? 'bg-red-50/30 dark:bg-red-950/10'
        : 'bg-white/40 dark:bg-slate-800/40',
    }"
    class="rounded-2xl transition-all duration-200"
  >
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Avatar avec initiales -->
        <div
          :class="[
            'w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold',
            status === 'absent'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
          ]"
        >
          {{ initials }}
        </div>

        <!-- Nom + rôle -->
        <div class="min-w-0">
          <p class="text-sm font-semibold truncate">{{ name }}</p>
          <span :class="`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${roleColor}`">
            {{ role }}
          </span>
        </div>
      </div>

      <!-- Toggle Présent / Absent -->
      <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-full p-1 shrink-0">
        <UButton
          size="xs"
          :variant="status === 'present' ? 'white' : 'ghost'"
          :class="[
            'rounded-full px-3 transition-all',
            status === 'present' ? 'text-green-600 shadow-sm' : 'text-gray-400',
          ]"
          @click="status = 'present'; reason = ''"
        >
          Présent
        </UButton>
        <UButton
          size="xs"
          :variant="status === 'absent' ? 'solid' : 'ghost'"
          :color="status === 'absent' ? 'red' : 'gray'"
          :class="['rounded-full px-3 transition-all', status !== 'absent' && 'text-gray-400']"
          @click="status = 'absent'"
        >
          Absent
        </UButton>
      </div>
    </div>

    <!-- Motif d'absence -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-all duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="status === 'absent'" class="mt-3 space-y-1">
        <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Motif de l'absence
        </label>
        <UTextarea
          v-model="reason"
          placeholder="Ex : Déplacement, congé, maladie…"
          variant="outline"
          :rows="2"
          autoresize
          size="sm"
        />
      </div>
    </Transition>
  </UCard>
</template>