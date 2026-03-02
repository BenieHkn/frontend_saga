<script setup>
defineProps({
  tache: { type: Object, required: true },
});

const prioriteClass = (p) =>
  ({
    Haute: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    Moyenne:
      "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    Basse:
      "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400",
  })[p] ?? "bg-gray-100 text-gray-500";
</script>

<template>
  <div
    :data-id="tache.id"
    class="flex items-center gap-3 rounded-xl px-4 py-3 bg-white dark:bg-gray-900 border border-transparent outline outline-1 outline-gray-100 dark:outline-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all duration-200 select-none cursor-grab active:cursor-grabbing"
  >
    <div
      class="shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
    >
      <UIcon name="i-heroicons-bars-3" class="w-3 h-3 text-gray-400" />
    </div>

    <div class="flex-1 min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
        {{ tache.intitule }}
      </p>
      <p class="text-xs text-gray-400 mt-0.5">
        {{ new Date(tache.date_debut).toLocaleDateString("fr-FR") }}
        → {{ new Date(tache.date_fin).toLocaleDateString("fr-FR") }}
      </p>
    </div>

    <span
      :class="`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${prioriteClass(tache.priorite)}`"
    >
      {{ tache.priorite }}
    </span>
  </div>
</template>
