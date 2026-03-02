<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <ToastComponent />
        <div class="max-w-7xl mx-auto">
            <!-- Main Content -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Left Column: Form (col-5) -->
                <div class="lg:col-span-6">
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div class="mb-6">
                            <h1 class="text-2xl font-bold text-gray-900">
                                Formulaire Document Interne
                            </h1>
                        </div>

                        <!-- ✅ Affichage du chargement des types -->
                        <div v-if="typeDocumentsLoading" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p class="text-sm text-blue-700">⏳ Chargement des types de documents...</p>
                        </div>

                        <!-- ✅ Affichage des erreurs de chargement des types -->
                        <div v-if="typeDocumentsError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p class="text-sm text-red-700">⚠️ {{ typeDocumentsError }}</p>
                        </div>

                        <form @submit.prevent="onSubmit" class="space-y-4">
                            <!-- Type de document -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Type de document *
                                </label>
                                <USelectMenu 
                                    v-model="form.type_document_id" 
                                    :options="typeDocuments"
                                    value-attribute="id"
                                    option-attribute="libelle" 
                                    placeholder="Sélectionner le type"
                                    class="w-full" 
                                    :ui="{ height: 'h-[42px]' }"
                                    :disabled="typeDocumentsLoading || loading"
                                    searchable
                                />
                            </div>

                            <!-- Upload -->
                            <div class="pt-4 border-t border-gray-100">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Pièce jointe *
                                    </label>
                                    <div class="relative">
                                        <!-- ✅ Référence correcte au fileInput -->
                                        <input 
                                            ref="fileInput" 
                                            type="file" 
                                            @change="handleFileChange"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                                            class="hidden" 
                                        />
                                        <div class="flex gap-2">
                                            <!-- ✅ Appel à une fonction au lieu de $refs directement -->
                                            <UButton 
                                                @click="openFileDialog" 
                                                type="button" 
                                                color="yellow"
                                                variant="outline" 
                                                icon="heroicons:arrow-up-tray" 
                                                class="flex-shrink-0"
                                                :disabled="loading"
                                            >
                                            </UButton>
                                            <div
                                                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 truncate flex items-center"
                                            >
                                                {{
                                                    selectedFile
                                                        ? `${selectedFile.name} (${formatFileSize(selectedFile.size)})`
                                                        : "Aucun fichier sélectionné"
                                                }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Champs communs -->
                            <div class="pt-4 border-t border-gray-100 space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            N° d'enregistrement *
                                        </label>
                                        <UInput 
                                            v-model="form.numero_enreg" 
                                            placeholder="Numéro d'enregistrement"
                                            class="w-full h-12"
                                            :disabled="loading"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                            Date d'enregistrement *
                                        </label>
                                        <UInput 
                                            v-model="form.date_enreg" 
                                            type="date" 
                                            class="w-full h-12"
                                            :disabled="loading"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Référence
                                    </label>
                                    <UInput 
                                        v-model="form.reference" 
                                        placeholder="Référence du document"
                                        class="w-full h-12"
                                        :disabled="loading"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Date du courrier
                                    </label>
                                    <UInput 
                                        v-model="form.date_courrier" 
                                        type="date" 
                                        class="w-full h-12"
                                        :disabled="loading"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Objet *
                                    </label>
                                    <UInput 
                                        v-model="form.objet" 
                                        placeholder="Objet du document" 
                                        class="w-full h-12"
                                        :disabled="loading"
                                    />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <UTextarea 
                                        v-model="form.description" 
                                        placeholder="Description du document"
                                        class="w-full" 
                                        :rows="4"
                                        :disabled="loading"
                                    />
                                </div>
                            </div>

                            <!-- Error Messages -->
                            <div v-if="errors.length > 0" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p class="text-sm font-medium text-red-800 mb-2">❌ Erreurs détectées :</p>
                                <ul class="list-disc list-inside text-sm text-red-700 space-y-1">
                                    <li v-for="(error, index) in errors" :key="index">
                                        {{ error }}
                                    </li>
                                </ul>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                                <UButton 
                                    type="button" 
                                    @click="handleCancel"
                                    color="gray" 
                                    variant="outline"
                                    :disabled="loading"
                                >
                                    ANNULER
                                </UButton>
                                <UButton 
                                    :disabled="!isFormValid || loading" 
                                    type="submit"
                                    class="bg-gradient-to-br from-emerald-800 to-blue-800 text-white dark:text-white"
                                    :loading="loading"
                                >
                                    {{ loading ? 'SAUVEGARDE...' : 'SAUVEGARDER' }}
                                </UButton>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Right Column: Document Preview (col-7) -->
                <div class="lg:col-span-6">
                    <DocumentPreview 
                        v-if="selectedFile && filePreviewUrl"
                        :selected-file="selectedFile" 
                        :file-preview-url="filePreviewUrl" 
                    />
                    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
                        <p class="text-gray-400 text-center">
                            📄 Sélectionnez un fichier pour voir l'aperçu
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTypeDocuments } from "../../composables/courriers/useTypeDocuments";
import { useFormDocumentInterne } from "../../composables/courriers/useFormDocumentInterne";
import ToastComponent from "../../components/ToastComponent.vue"

useHead({
    title: "Nouveau Document Interne - Sagar Revolution",
});

// ✅ Import des composables
const { 
    form, 
    fichier, 
    handleSubmit,
    resetForm, 
    loading, 
    errors 
} = useFormDocumentInterne();

const { 
    typeDocuments, 
    errorMessage: typeDocumentsError,
    loading: typeDocumentsLoading,
    getTypeDocuments 
} = useTypeDocuments();

// ✅ États locaux correctement typés
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

/**
 * ✅ Computed pour l'aperçu
 */
const filePreviewUrl = computed(() => {
    if (!selectedFile.value) return null;
    return URL.createObjectURL(selectedFile.value);
});

/**
 * ✅ Validation du formulaire
 */
const isFormValid = computed(() => {
    return (
        form.value.numero_enreg.trim() !== "" &&
        form.value.date_enreg !== "" &&
        form.value.objet.trim() !== "" &&
        form.value.type_document_id !== 0 &&
        selectedFile.value !== null
    );
});

/**
 * ✅ Formate la taille d'un fichier
 */
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

/**
 * ✅ Ouvre le dialogue de sélection de fichier
 */
const openFileDialog = () => {
    try {
        if (fileInput.value && typeof fileInput.value.click === 'function') {
            fileInput.value.click()
        } else {
            console.error('❌ fileInput ref non initialisée')
            errors.value.push('Erreur: Impossible d\'ouvrir le dialogue de fichier')
        }
    } catch (err) {
        console.error('❌ Erreur openFileDialog:', err)
        errors.value.push('Erreur lors de l\'ouverture du dialogue')
    }
}

/**
 * ✅ Gestion du changement de fichier
 */
const handleFileChange = (event: Event) => {
    try {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        
        if (file) {
            selectedFile.value = file;
            fichier.value = file;
            console.log("✅ Fichier sélectionné:", file.name, `(${formatFileSize(file.size)})`);
        }
    } catch (err) {
        console.error('❌ Erreur handleFileChange:', err)
        errors.value.push('Erreur lors de la sélection du fichier')
    }
};

/**
 * ✅ Gestion de la soumission du formulaire
 */
const onSubmit = async () => {
    try {
        console.log("📝 Soumission du formulaire...")
        errors.value = []

        // Vérifier que handleSubmit existe
        if (!handleSubmit || typeof handleSubmit !== 'function') {
            console.error('❌ handleSubmit n\'est pas une fonction')
            errors.value.push('Erreur interne: handleSubmit non disponible')
            return
        }

        const result = await handleSubmit()
        
        if (result && result.successSubmitForm) {
            console.log("✅ Formulaire soumis avec succès")
            
            // Attendre un peu avant de rediriger
           useToast().add({
                title: 'Document interne créé avec succès',
                color: 'green'
            })
            selectedFile.value = null; // vide l'aperçu
            resetForm()
        } else {
            console.warn("⚠️ Erreurs de validation:", result?.errors)
        }
        
    } catch (err) {
        console.error("❌ Erreur dans onSubmit:", err)
        errors.value.push('Une erreur inattendue est survenue')
    }
};

/**
 * ✅ Gestion de l'annulation
 */
const handleCancel = () => {
    resetForm()
    navigateTo("/documents");
};

/**
 * ✅ Charger les types de documents au montage
 */
onMounted(async () => {
    try {
        console.log("🔄 Montage du composant...")
        
        // Vérifier que getTypeDocuments existe
        if (!getTypeDocuments || typeof getTypeDocuments !== 'function') {
            console.error('❌ getTypeDocuments n\'est pas une fonction')
            return
        }

        console.log("📥 Chargement des types de documents...")
        await getTypeDocuments()
        console.log("✅ Types de documents chargés")
        
    } catch (err) {
        console.error("❌ Erreur lors du montage:", err)
    }
});

/**
 * ✅ Nettoyer les URLs pour éviter les fuites de mémoire
 */
watch(
    filePreviewUrl,
    (newUrl, oldUrl) => {
        if (oldUrl) {
            URL.revokeObjectURL(oldUrl);
        }
    }
);

onUnmounted(() => {
    if (filePreviewUrl.value) {
        URL.revokeObjectURL(filePreviewUrl.value);
    }
});
</script>