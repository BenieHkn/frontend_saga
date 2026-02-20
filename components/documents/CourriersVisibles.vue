<template>
    <div class="p-6 max-w-[1400px] mx-auto">
        <div class="flex items-center justify-between mb-6">
            <h1 class="flex items-center gap-3 text-2xl font-bold text-slate-800">
                <Icon name="i-heroicons-eye" class="w-7 h-7 text-blue-600" />
                Initiés/Paraphés
            </h1>
            <div class="flex items-center gap-3">
                <button @click="loadData"
                    class="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all hover:shadow-md">
                    <Icon name="i-heroicons-arrow-path" class="w-4 h-4" />
                    Actualiser
                </button>
                <UBadge color="blue" variant="soft" size="lg">
                    <Icon name="i-heroicons-document-text" class="h-4 w-4 mr-1" />
                    <span class="text-sm">{{ courrierData.length }} courrier{{ courrierData.length > 1 ? 's' : ''
                        }}</span>
                </UBadge>
            </div>
        </div>

        <div v-if="error"
            class="flex items-center gap-3 p-4 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <Icon name="i-heroicons-exclamation-triangle" class="w-5 h-5 flex-shrink-0" />
            <span class="flex-1">{{ error }}</span>
            <button @click="error = null" class="text-lg opacity-60 hover:opacity-100">✕</button>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center py-16 gap-4">
            <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p class="text-sm text-slate-500">Chargement des courriers...</p>
        </div>

        <DataTable v-else :data="courrierData" :columns="columns" :selectable="false" :show-row-numbers="true"
            :default-items-per-page="10" :items-per-page-options="[10, 25, 50, 100]"
            :left-aligned-columns="['objet', 'destinataire', 'service_emis']">
            <!-- Référence cliquable -->
            <template #cell-reference="{ value, item }">
                <button v-if="item.url" @click="handleOpenDocument(item.url)"
                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-all group">
                    <Icon name="i-heroicons-document-text" class="w-3.5 h-3.5" />
                    <span>{{ value }}</span>
                    <Icon name="i-heroicons-arrow-top-right-on-square"
                        class="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </button>
                <span v-else
                    class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md">
                    {{ value }}
                </span>
            </template>

            <!-- Confidentiel -->
            <template #cell-confidentiel="{ value }">
                <span v-if="value"
                    class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-50 rounded-full">
                    <Icon name="i-heroicons-lock-closed" class="w-3 h-3" />
                    Confidentiel
                </span>
                <span v-else
                    class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                    <Icon name="i-heroicons-lock-open" class="w-3 h-3" />
                    Standard
                </span>
            </template>

            <!-- Actions -->
            <template #actions="{ item }">
                <div class="flex gap-1.5 justify-end">
                    <button @click="handleViewDetails(item)" title="Voir les détails"
                        class="inline-flex items-center justify-center w-8 h-8 bg-amber-50 text-amber-700 rounded-md hover:bg-amber-200 transition-all group">
                        <Icon name="i-heroicons-eye" class="w-4 h-4" />
                    </button>
                </div>
            </template>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const toast = useToast()

const courrierData = ref([])
const loading = ref(false)
const error = ref(null)
const authToken = ref('')

const columns = [
    { key: 'reference', label: 'Référence', visible: true, width: 'min-w-[180px]', showLabel: false },
    { key: 'objet', label: 'Objet', visible: true, width: 'min-w-[250px]', showLabel: false },
    { key: 'type_document', label: 'Type document', visible: true, width: 'min-w-[180px]', showLabel: false },
    { key: 'date_depart', label: 'Date départ', visible: true, width: 'min-w-[120px]', showLabel: false },
    { key: 'service_emis', label: 'Service émetteur', visible: true, width: 'min-w-[150px]', showLabel: false },
    { key: 'destinataire', label: 'Destinataire', visible: true, width: 'min-w-[150px]', showLabel: false },
    { key: 'initiateurs', label: 'Initiateur(s)', visible: false, width: 'min-w-[200px]' },
    { key: 'type_depart', label: 'Type', visible: false, width: 'min-w-[100px]' },
    { key: 'confidentiel', label: 'Confidentialité', visible: false, width: 'min-w-[130px]' },
]

const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'long', year: 'numeric'
    })
}

const transformerDonnees = (reponseAPI) => {
    if (!reponseAPI?.data) throw new Error('Format de réponse API invalide')

    return reponseAPI.data.map(courrier => {
        // Formatage des initiateurs
        const initiateurFormate = courrier.initiateurs?.map(init => {
            const nomComplet = `${init.user?.nom} ${init.user?.prenom || ''}`.trim()
            const role = init.is_responsable ? init.entite?.fonction : 'Agent'
            return `${nomComplet} (${init.entite?.code} - ${role})`
        }).join(', ') || ''

        return {
            id: courrier.id,
            reference: courrier.document?.reference || '',
            objet: courrier.document?.objet || '',
            numero_enreg: courrier.document?.numero_enreg || '',
            url: courrier.document?.url
                ? `${config.public.apiBase}${courrier.document.url}`
                : null,
            date_enreg: formatDate(courrier.document?.date_enreg),
            date_depart: formatDate(courrier.date_depart),
            type_document: courrier.document?.type_document?.libelle || '',
            service_emis: courrier.service_emis || '',
            destinataire: courrier.destinataire || '',
            type_depart: courrier.type_depart || '',
            confidentiel: courrier.confidentiel || false,
            initiateurs: initiateurFormate,
            _complete: courrier,
        }
    })
}

const loadData = async () => {
    if (!authToken.value) return

    loading.value = true
    error.value = null

    try {
        let entiteUser = null
        if (process.client) {
            const saved = localStorage.getItem('entite_user')
            if (saved) entiteUser = JSON.parse(saved)
        }

        if (!entiteUser?.id) {
            error.value = 'Aucune fonction user sélectionnée'
            return
        }

        const reponse = await $fetch(
            `${config.public.apiBase}/courriers-departs/visibles/${entiteUser.id}`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${authToken.value}` },
                timeout: 15000,
            }
        )

        courrierData.value = transformerDonnees(reponse)
        console.log(`✅ ${courrierData.value.length} courriers visibles chargés`)

    } catch (err) {
        error.value = err.message || 'Erreur lors du chargement'
        toast.add({ title: 'Erreur', description: 'Impossible de charger les courriers', color: 'red', timeout: 1500 })
    } finally {
        loading.value = false
    }
}

const handleOpenDocument = (url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
}

const handleViewDetails = (item) => {
    // Même logique que dans la page affectations si besoin
    console.log('Détails:', item)
}

onMounted(async () => {
    if (process.client) {
        authToken.value = localStorage.getItem('auth_token') || ''
    }
    await loadData()
})
</script>