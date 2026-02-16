<script setup lang="ts">

const meetingData = reactive({
  title: '',
  location: '',
  date: '',
  start: '',
  end: ''
});
</script>

<template>
  <div class="bg-slate-50 dark:bg-slate-950 transition-colors duration-200 p-6">
      <UCard :ui="{ body: { padding: 'p-8 md:p-12' }, ring: 'ring-0', shadow: 'shadow-xl', background: 'bg-white dark:bg-slate-900' }" class="rounded-3xl border border-gray-100 dark:border-gray-800">
        <div class="mb-10 text-center md:text-left">
          <h2 class="text-3xl font-extrabold mb-2 tracking-tight">Meeting Info & Attendance</h2>
          <p class="text-gray-500 dark:text-gray-400 font-medium">Étape 1 sur 3 : Détails de la réunion et participants</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="space-y-6">
            <div class="flex items-center gap-2 mb-4">
              <UIcon name="i-heroicons-document-text" class="text-primary-500 text-xl" />
              <h3 class="font-bold">Détails Logistiques</h3>
            </div>

            <div class="space-y-4">
              <UFormGroup label="TITRE DE LA RÉUNION" size="lg" :ui="{ label: { base: 'text-[10px] font-bold text-gray-500 tracking-widest' } }">
                <UInput v-model="meetingData.title" placeholder="Ex: Revue Trimestrielle Q4" />
              </UFormGroup>

              <UFormGroup label="LIEU (LOCATION)" size="lg" :ui="{ label: { base: 'text-[10px] font-bold text-gray-500 tracking-widest' } }">
                <UInput v-model="meetingData.location" icon="i-heroicons-map-pin" placeholder="Salle de conférence A ou Zoom" />
              </UFormGroup>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UFormGroup label="DATE" size="lg" :ui="{ label: { base: 'text-[10px] font-bold text-gray-500 tracking-widest' } }">
                  <UInput v-model="meetingData.date" type="date" />
                </UFormGroup>
                
                <div class="grid grid-cols-2 gap-2">
                  <UFormGroup label="DÉBUT" size="lg" :ui="{ label: { base: 'text-[10px] font-bold text-gray-500 tracking-widest' } }">
                    <UInput v-model="meetingData.start" type="time" />
                  </UFormGroup>
                  <UFormGroup label="FIN" size="lg" :ui="{ label: { base: 'text-[10px] font-bold text-gray-500 tracking-widest' } }">
                    <UInput v-model="meetingData.end" type="time" />
                  </UFormGroup>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-user-plus" class="text-primary-500 text-xl" />
                <h3 class="font-bold">Participants</h3>
              </div>
              <UButton variant="link" size="xs" color="primary" icon="i-heroicons-plus-circle" class="font-bold uppercase tracking-widest">
                Ajouter
              </UButton>
            </div>

            <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              <AttendanceCard name="Jean Dupont" role="Directeur Marketing" initials="JD" />
              <AttendanceCard name="Marie Lefebvre" role="Lead Design" initials="ML" />
            </div>
          </div>
        </div>
      </UCard>
  </div>
</template>

<style>
/* Optionnel : Custom scrollbar pour les participants */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark ::-webkit-scrollbar-thumb { background: #334155; }
</style>