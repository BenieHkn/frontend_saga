<!-- components/OrdreDuJourList.vue -->
<script setup>
import Sortable from "sortablejs";
import { useCommentaire } from "~/composables/commentaire/useCommentaire";
import { useAuth } from "~/composables/auth/useAuth";
import { useOrdreDuJour } from "~/composables/ordres-du-jour/useOrdreDuJour";
const toast = useToast()

const {peutGererCodir, peutVoirCodir} = useAuth()

const props = defineProps({
  ordres: { type: Array, default: () => [] },
  peutSupprimer: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
});

const emit = defineEmits(["attach", "detach", "commenterListe", "ordre-created", "ordre-updated"]);

const currentOrdre = ref(null)
const loading = ref(false)

const {updateOrdre, createOrdre} = useOrdreDuJour()



const {creerCommentaire, openCommentaireModal, fetchCommentaires, commentaires, openListeCommentairesModal} = useCommentaire()
const internalLoading = ref(false)

const entiteUser = ref()

// ── Ordre local (géré en interne) ─────────────────────────────────────────────
const STORAGE_KEY = computed(() => `ordres-positions-${props.ordres[0]?.codir_id ?? "default"}`);

// const ordresLocaux = ref([]);

// Initialise depuis localStorage ou depuis les props
// const initOrdres = () => {
//   const saved = localStorage.getItem(STORAGE_KEY.value);
//   if (saved) {
//     const savedIds = JSON.parse(saved);
//     const map = Object.fromEntries(props.ordres.map((o) => [o.id, o]));
//     // Réordonne selon l'ordre sauvegardé, ajoute les nouveaux à la fin
//     const reordered = savedIds.map((id) => map[id]).filter(Boolean);
//     const newOnes = props.ordres.filter((o) => !savedIds.includes(o.id));
//     ordresLocaux.value = [...reordered, ...newOnes];
//   } else {
//     ordresLocaux.value = [...props.ordres];
//   }
// };

watch(() => props.ordres, { immediate: true });

// const saveOrder = () => {
//   localStorage.setItem(
//     STORAGE_KEY.value,
//     JSON.stringify(ordres.value.map((o) => o.id))
//   );
// };

// ── Drag & drop ───────────────────────────────────────────────────────────────
// const listRef = ref(null);

onMounted(() => {
  // if (!listRef.value) return;
  // Sortable.create(listRef.value, {
  //   animation: 150,
  //   handle: ".drag-handle",
  //   ghostClass: "sortable-ghost",
  //   chosenClass: "sortable-chosen",
  //   onEnd({ oldIndex, newIndex }) {
  //     const items = [...ordresLocaux.value];
  //     const [moved] = items.splice(oldIndex, 1);
  //     items.splice(newIndex, 0, moved);
  //     ordresLocaux.value = items;
  //     saveOrder();
  //   },
  // });
});

// ── Navigation ────────────────────────────────────────────────────────────────
const goTo = (ordre) => {
  if (process.client) {
    localStorage.setItem("currentOrdreDuJour", JSON.stringify(ordre));
  }
  navigateTo(`/ordres-du-jour/${ordre.id}`);
};


const handleAfficherModalPourCommenter = async (ordre) => {
  currentOrdre.value = ordre
  openCommentaireModal.value = true
  console.log("Commenter ordre", ordre)
}

const handleRecupererCommentaire = async (contenu) => {
  if (!currentOrdre.value) return
  internalLoading.value = true

  try {
    await creerCommentaire({
      commentable_id:   currentOrdre.value.id,
      commentable_type: 'ordre_du_jour',
      contenu,
      codir_id:         currentOrdre.value.codir_id ?? props.ordres[0]?.codir_id,
    })
    await fetchCommentaires('ordre_du_jour', currentOrdre.value.id)
    currentOrdre.value.commentaires = commentaires.value
  } catch (error) {
    console.error("Erreur lors de la création du commentaire", error)
  } finally {
    internalLoading.value = false
  }
}

const voirLesCommentaires = async (ordre) => {
  currentOrdre.value = ordre;
  console.log("Voir les commentaires pour ordre", ordre)
  console.log("Id de l'ordre du jour: ", ordre.id)
  try {
    await fetchCommentaires('ordre_du_jour', ordre.id)
    console.log("Commentaires récupérés :", commentaires.value)
    openListeCommentairesModal.value = true
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires", error)
    toast.add({
        title: "Erreur lors du chargement des commentaires",
        color: "error",
        icon: "i-heroicons-exclamation-circle"
      })
  }
}

const detachOrdre = async (ordre) =>{
  emit('detach', ordre.id);
}

const ordreModal = ref(false)
const selectedOrdre = ref(null)

const handleEditOrdre = async (ordre) => {
  selectedOrdre.value = ordre;
  console.log("l'ordre sélectionné", selectedOrdre.value)
  ordreModal.value = true;
}



const handleUpdateOrdre = async (form) => {
  internalLoading.value = true
  try{
    await updateOrdre(selectedOrdre.value.id, form)
    toast.add({
      title: 'Ordre du jour mis à jour',
      description: `"${form.libelle}" a été mis à jour`,
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
    ordreModal.value = false
    selectedOrdre.value = null
    emit('ordre-updated')
  } catch {
    toast.add({
      title: 'Erreur',
      description: "Impossible de mettre à jour l'ordre du jour",
      color: 'red',
      icon: 'i-heroicons-exclamation-circle',
    })
  }finally{
    internalLoading.value = false
  }
}

const handleCreateOrdre = async (form) => {
  try{
    await createOrdre(form)
    toast.add({
      title: 'Ordre du jour créé',
      description: `"${form.libelle}" a été ajouté`,
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
    ordreModal.value = false
    emit('ordre-created')
  } catch {
    
  }

}

onMounted(() => {
  entiteUser.value = JSON.parse(localStorage.getItem("entite_user"));
  console.log(entiteUser.value);
})
</script>

<template>
  <section>
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-base font-semibold flex items-center gap-2">
        <UIcon name="i-heroicons-clipboard-document-list" class="text-blue-500" />
        Points à l'ordre du jour
        <UBadge color="blue" variant="soft" size="xs">{{ ordres.length }}</UBadge>
      </h2>
      <UButton v-if="peutGererCodir()" icon="i-heroicons-plus" color="blue" variant="soft" size="xs" @click="emit('attach')">
        Ajouter
      </UButton>
    </div>

    <div v-if="loading" class="flex flex-col gap-2">
      <USkeleton class="h-16 w-full rounded-2xl" />
      <USkeleton class="h-16 w-full rounded-2xl" />
      <USkeleton class="h-16 w-full rounded-2xl" />
    </div>

    <div
      v-else-if="!ordres.length"
      class="text-center py-6 text-gray-400 text-sm bg-gray-50 dark:bg-slate-800/50 rounded-xl"
    >
      Aucun ordre du jour
    </div>

    <!-- Liste sortable -->
    <div v-else class="flex flex-col gap-2">
      <OrdreDuJourCard
        v-for="(ordre, index) in ordres"
        :key="ordre.id"
        :ordre="ordre"
        :index="index"
        :peutGererCodir="peutGererCodir()"
        @voir-detail-ordre="goTo(ordre)"
        @commenter="handleAfficherModalPourCommenter(ordre)"
        @voir-commentaires="voirLesCommentaires(ordre)"
        @detach="detachOrdre(ordre)"
        @edit="handleEditOrdre"
      />
    </div>

    <CommentaireFormModal
      v-model:open="openCommentaireModal"
      :loading="internalLoading"
      @create="handleRecupererCommentaire($event.contenu)"
    />

    <CommentaireListeModal
      v-model:openListeCommentairesModal="openListeCommentairesModal"
      :commentaires="commentaires"
      :entiteUser="entiteUser"
    />

    <OrdreDuJourFormModal
      v-model:open="ordreModal"
      :ordre="selectedOrdre"
      :loading="internalLoading"
      @createOrdre="handleCreateOrdre"
      @updateOrdre="handleUpdateOrdre"
    />  
  </section>
</template>

<style scoped>
.sortable-ghost {
  @apply opacity-40 bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700;
}
.sortable-chosen {
  @apply shadow-lg;
}
</style>