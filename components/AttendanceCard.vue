<script setup lang="ts">
const props = defineProps<{
    name: string;
    role: string;
    initials: string;
}>();

const status = ref<'present' | 'absent'>('present');
const reason = ref('');
</script>

<template>
    <UCard
        :ui="{ body: { padding: 'p-4' }, ring: 'ring-1 ring-gray-200 dark:ring-gray-800', background: 'bg-white/40 dark:bg-slate-800/40' }"
        class="rounded-2xl">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
                <UAvatar :alt="name" size="sm" :ui="{ background: 'bg-gray-200 dark:bg-gray-700' }" />
                <div>
                    <p class="text-sm font-semibold">{{ name }}</p>
                    <p class="text-[10px] text-gray-400">{{ role }}</p>
                </div>
            </div>

            <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-full p-1">
                <UButton size="xs" :variant="status === 'present' ? 'white' : 'ghost'"
                    :class="status === 'present' ? 'text-green-600 shadow-sm' : 'text-gray-400'"
                    class="rounded-full px-4" @click="status = 'present'">
                    Présent
                </UButton>
                <UButton size="xs" :variant="status === 'absent' ? 'solid' : 'ghost'"
                    :color="status === 'absent' ? 'red' : 'gray'" :class="status === 'absent' ? '' : 'text-gray-400'"
                    class="rounded-full px-4 transition-all" @click="status = 'absent'">
                    Absent
                </UButton>
            </div>
        </div>

        <div v-if="status === 'absent'" class="space-y-1.5 mt-4">
            <label class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Motif de l'absence</label>
            <UTextarea v-model="reason" placeholder="Ex: Déplacement client..." variant="outline" :rows="2"
                autoresize />
        </div>
    </UCard>
</template>