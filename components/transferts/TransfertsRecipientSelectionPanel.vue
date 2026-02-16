<template>
  <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden transition-all hover:shadow-xl hover:shadow-slate-200/80">
    <!-- Panel Header -->
    <div class="px-6 py-5 border-b border-slate-100">
      <h3 class="text-xl font-bold text-slate-900 mb-4">2. Destinataires</h3>
      
      <!-- Search Bar -->
      <div class="relative">
        <Icon name="heroicons:user-group" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or email..."
          class="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-slate-700 placeholder:text-slate-400"
        />
      </div>
    </div>

    <!-- Recipients List -->
    <div class="overflow-auto max-h-[400px] p-4 space-y-3">
      <TransfertsRecipientCard
        v-for="recipient in filteredRecipients"
        :key="recipient.id"
        :recipient="recipient"
        :selected="store.selectedRecipients.includes(recipient.id)"
        @toggle="toggleRecipient(recipient.id)"
      />

      <!-- Empty State -->
      <div v-if="loading" class="py-12 text-center">
        <div class="flex flex-col items-center justify-center gap-3">
          <Icon name="svg-spinners:ring-resize" class="w-8 h-8 text-emerald-600" />
          <p class="text-slate-500">Loading recipients...</p>
        </div>
      </div>

      <div v-else-if="filteredRecipients.length === 0" class="py-12 text-center">
        <div class="flex flex-col items-center justify-center gap-3">
          <Icon name="heroicons:user-group" class="w-12 h-12 text-slate-300" />
          <p class="text-slate-500">Aucun destinataire trouvé</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTransfertsStore } from '@/stores/transferts'
const store = useTransfertsStore()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const searchQuery = ref('')

const filteredRecipients = computed(() => {
  if (!searchQuery.value) return store.recipients

  const query = searchQuery.value.toLowerCase()
  return store.recipients.filter(r =>
    r.name.toLowerCase().includes(query) ||
    r.email.toLowerCase().includes(query)
  )
})

const toggleRecipient = (id) => {
  store.toggleRecipient(id)
}
</script>