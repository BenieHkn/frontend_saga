<template>
    <UContainer>
        <PageHeader title="CODIR" subtitle="Gestion des réunions du CODIR" />
        <StepIndicator :currentStep="store.currentStep" :steps="store.steps" />
        <CodirPointsFocauxListe v-if="store.currentStep === 1" />
        <CodirGeneralInformation v-else-if="store.currentStep === 2" />
        <CodirReview v-else-if="store.currentStep === 3" />

        <div class="mt-2 flex items-center justify-between">
            <UButton v-if="store.currentStep!==1" @click="handlePrevious" size="lg" variant="ghost" icon="i-heroicons-arrow-left"
                class="rounded-2xl px-10 py-4 shadow-sm font-bold">
                Précédent
            </UButton>
            <UButton v-else @click="handleCancel" size="lg" variant="ghost" icon="i-heroicons-arrow-left"
                class="rounded-2xl px-10 py-4 shadow-sm font-bold">  
                Annuler
            </UButton>
            <UButton @click="handleNext" size="lg" trailing icon="i-heroicons-arrow-right"
                class="rounded-2xl px-12 py-4 font-bold bg-gradient-to-r from-blue-500 to-emerald-500">
                Suivant
            </UButton>
        </div>
    </UContainer>
</template>

<script setup>
const store = useCodirsStore()


const handleNext = () => {
    if (store.currentStep < store.steps.length) {
        store.currentStep++
    }
}

const handlePrevious = () => {
    if (store.currentStep > 1) {
        store.currentStep--
    }
}

const handleCancel = () => {
    navigateTo('/codir')
}

console.log("le step actuel", store.currentStep)
console.log("le nombre de steps", store.steps.length)
console.log("les steps", store.steps)
</script>