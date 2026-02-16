<script setup lang="ts">
// 1. Interface TypeScript pour un point focal
interface PointFocal {
  id: number
  title: string
  date: string
  time: string
  status: 'En attente' | 'En cours' | 'Terminé'
  isNew?: boolean
  description?: string
  responsable?: string
  priorite?: 'Haute' | 'Moyenne' | 'Basse'
}

// 2. Props typées
const props = defineProps<{
  point: PointFocal
}>()

// 3. Émits pour les actions
const emit = defineEmits<{
  edit: [point: PointFocal]
  delete: [point: PointFocal]
}>()

// 4. Styles dynamiques basés sur le statut
const statusStyle = computed(() => {
  switch (props.point.status) {
    case 'Terminé': 
      return { 
        iconBox: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20', 
        badge: 'emerald',
        dot: 'bg-emerald-500',
        icon: 'i-heroicons-check-circle' 
      }
    case 'En cours': 
      return { 
        iconBox: 'bg-blue-50 text-blue-500 dark:bg-blue-900/20', 
        badge: 'blue',
        dot: 'bg-blue-500',
        icon: 'i-heroicons-arrow-path' 
      }
    case 'En attente': 
      return { 
        iconBox: 'bg-amber-50 text-amber-500 dark:bg-amber-900/20', 
        badge: 'amber',
        dot: 'bg-amber-500',
        icon: 'i-heroicons-clock' 
      }
    default: 
      return { 
        iconBox: 'bg-gray-50 text-gray-500 dark:bg-gray-900/20', 
        badge: 'gray',
        dot: 'bg-gray-500',
        icon: 'i-heroicons-document' 
      }
  }
})

// 5. Style pour les nouveaux points focaux
const isNewBadge = computed(() => props.point.isNew)

// 6. Formater la date
const formattedDate = computed(() => {
  const date = new Date(props.point.date)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
})

// 7. Handlers pour les actions
const handleEdit = () => {
  emit('edit', props.point)
}

const handleDelete = () => {
  emit('delete', props.point)
}
</script>

<template>
  <UCard 
    class="group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ring-gray-200 dark:ring-gray-800"
    :ui="{ body: { padding: 'p-6 sm:p-6' }, rounded: 'rounded-2xl' }"
  >
    <div class="flex flex-col md:flex-row gap-6">
      
      <!-- Icône de statut -->
      <div 
        class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-colors"
        :class="statusStyle.iconBox"
      >
        <UIcon :name="statusStyle.icon" class="h-8 w-8" />
      </div>

      <!-- Contenu principal -->
      <div class="flex-1 flex flex-col gap-2">
        <!-- Badges et métadonnées -->
        <div class="flex items-center gap-3 flex-wrap">
          <UBadge 
            :color="statusStyle.badge" 
            variant="subtle" 
            size="xs" 
            :label="point.status" 
            class="uppercase font-bold tracking-wider px-2" 
          />
          
          <UBadge 
            v-if="isNewBadge"
            color="indigo" 
            variant="solid" 
            size="xs" 
            label="Nouveau" 
            class="uppercase font-bold tracking-wider px-2" 
          />
          
          <span class="flex items-center gap-1 text-xs font-medium text-gray-500">
            <UIcon name="i-heroicons-calendar" class="h-3 w-3" />
            {{ formattedDate }}
          </span>
          
          <span class="flex items-center gap-1 text-xs font-medium text-gray-500">
            <UIcon name="i-heroicons-clock" class="h-3 w-3" />
            {{ point.time }}
          </span>
        </div>

        <!-- Titre -->
        <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
          {{ point.title }}
        </h3>
        
        <!-- Description (si elle existe) -->
        <p v-if="point.description" class="text-sm text-gray-500 line-clamp-2">
          {{ point.description }}
        </p>

        <!-- Informations supplémentaires -->
        <div class="mt-2 flex items-center gap-4 flex-wrap">
          <!-- Indicateur de statut -->
          <div class="flex items-center gap-2">
            <span 
              class="h-2 w-2 rounded-full" 
              :class="statusStyle.dot"
            ></span>
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300">
              Point focal {{ point.isNew ? 'créé' : 'existant' }}
            </span>
          </div>

          <!-- Responsable (si défini) -->
           <div v-if="point.responsables && point.responsables.length > 0">
            <div v-for="responsable in point.responsables" :key="responsable.id" class="flex items-center gap-2">
              <UIcon name="i-heroicons-user" class="h-4 w-4 text-gray-400" />
              <span class="text-xs text-gray-600 dark:text-gray-400">
                {{ responsable.name }}
              </span>
            </div>
           </div>

          <!-- Priorité (si définie) -->
          <UBadge 
            v-if="point.priorite"
            :color="point.priorite === 'Haute' ? 'red' : point.priorite === 'Moyenne' ? 'amber' : 'gray'" 
            variant="soft" 
            size="xs" 
            :label="point.priorite" 
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex md:flex-col items-center justify-center gap-2 border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-gray-100 dark:border-gray-800">
        <UButton 
          icon="i-heroicons-pencil-square" 
          variant="ghost" 
          color="gray" 
          label="Modifier" 
          class="flex-1 md:flex-none w-full justify-center"
          @click="handleEdit"
        />
        <UButton 
          icon="i-heroicons-trash" 
          variant="ghost" 
          color="red" 
          label="Supprimer" 
          class="flex-1 md:flex-none w-full justify-center hover:bg-red-50 dark:hover:bg-red-900/20" 
          @click="handleDelete"
        />
      </div>
    </div>
  </UCard>
</template>