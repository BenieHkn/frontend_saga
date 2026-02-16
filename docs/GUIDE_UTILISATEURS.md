# Guide d'utilisation - Gestion des Utilisateurs

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Utilisation](#utilisation)
5. [API Reference](#api-reference)
6. [Exemples](#exemples)
7. [Dépannage](#dépannage)

## 🎯 Vue d'ensemble

Le système de gestion des utilisateurs permet de :
- ✅ Créer, modifier et supprimer des utilisateurs
- ✅ Gérer les fonctions des utilisateurs
- ✅ Activer/désactiver des comptes
- ✅ Rechercher et filtrer les utilisateurs
- ✅ Gérer les permissions (super admin)

## 📦 Installation

Le système est déjà intégré dans le projet. Aucune installation supplémentaire n'est requise.

### Dépendances
- Nuxt 3
- Nuxt UI
- Tailwind CSS

## ⚙️ Configuration

### 1. URL de l'API

L'URL de l'API est définie dans `composables/users/useUsers.js` :

```javascript
const baseURL = 'http://10.1.14.145:8000/api'
```

Pour modifier l'URL, éditez cette ligne ou créez une variable d'environnement.

### 2. Authentification

Le système utilise un token Bearer stocké dans localStorage :

```javascript
// Stocker le token après connexion
localStorage.setItem('token', 'votre_token_ici')

// Le token est automatiquement ajouté à chaque requête
```

## 📖 Utilisation

### Navigation

- **Liste des utilisateurs** : `/utilisateurs`
- **Créer un utilisateur** : `/utilisateurs/create`
- **Modifier un utilisateur** : `/utilisateurs/[id]`
- **Gérer les fonctions** : `/utilisateurs/[id]/fonctions`

### Liste des utilisateurs

![Liste des utilisateurs](screenshot-liste.png)

**Fonctionnalités :**
- Recherche globale dans tous les champs
- Tri par colonne (cliquer sur les flèches)
- Filtrage par colonne
- Pagination (10, 15, 25, 50, 100 par page)
- Actions rapides :
  - 🟡 Modifier
  - 🔵 Gérer les fonctions
  - 🟠 Activer/Désactiver
  - 🔴 Supprimer

### Créer un utilisateur

**Champs requis :**
- Matricule (unique)
- Nom
- Prénom
- Email (unique)

**Champs optionnels :**
- Téléphone
- Mot de passe (généré automatiquement si vide)
- Date de prise de service
- Compte actif (par défaut : oui)
- Super administrateur (par défaut : non)

**Processus :**
1. Remplir le formulaire
2. Cliquer sur "SAUVEGARDER"
3. Le système valide les données
4. En cas de succès, un modal s'affiche
5. Cliquer sur "OK" pour retourner à la liste

### Modifier un utilisateur

**Processus :**
1. Cliquer sur le bouton 🟡 dans la liste
2. Les données sont chargées automatiquement
3. Modifier les champs souhaités
4. Le mot de passe peut être changé (laisser vide pour conserver l'ancien)
5. Cliquer sur "METTRE À JOUR"

### Gérer les fonctions

**Ajouter une fonction :**
1. Cliquer sur le bouton 🔵 dans la liste
2. Sélectionner une fonction dans la liste déroulante
3. Définir les dates (début obligatoire, fin optionnelle)
4. Cocher "Fonction intérimaire" si nécessaire
5. Cocher "Fonction active" (par défaut : oui)
6. Cliquer sur "AJOUTER LA FONCTION"

**Retirer une fonction :**
1. Cliquer sur le bouton 🔴 à côté de la fonction
2. Confirmer la suppression

## 🔌 API Reference

### Composable `useUsers`

```javascript
import { useUsers } from '~/composables/users/useUsers'

const {
  // États
  users,           // Liste des utilisateurs
  user,            // Utilisateur courant
  loading,         // État de chargement
  error,           // Message d'erreur
  pagination,      // Infos de pagination
  
  // Méthodes
  fetchUsers,      // Récupérer la liste
  fetchUser,       // Récupérer un utilisateur
  createUser,      // Créer un utilisateur
  updateUser,      // Mettre à jour
  deleteUser,      // Supprimer
  toggleUserStatus, // Activer/Désactiver
  fetchSubordinates, // Récupérer les subordonnés
  fetchMainFonction, // Récupérer la fonction principale
  reset            // Réinitialiser les états
} = useUsers()
```

### Méthodes détaillées

#### `fetchUsers(params)`

Récupère la liste des utilisateurs avec filtres et pagination.

**Paramètres :**
```javascript
{
  search: 'dupont',      // Recherche dans nom, prénom, email, matricule
  statut: true,          // Filtrer par statut (true/false)
  per_page: 15,          // Nombre par page
  page: 1                // Numéro de page
}
```

**Exemple :**
```javascript
await fetchUsers({ search: 'jean', per_page: 25 })
console.log(users.value) // Liste des utilisateurs
console.log(pagination.value) // Infos de pagination
```

#### `fetchUser(id)`

Récupère un utilisateur spécifique.

**Exemple :**
```javascript
await fetchUser(1)
console.log(user.value) // Données de l'utilisateur
```

#### `createUser(userData)`

Crée un nouvel utilisateur.

**Exemple :**
```javascript
const userData = {
  matricule: 'EMP001',
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@example.com',
  telephone: '0123456789',
  prise_service: '2024-01-15',
  statut: true,
  is_superadmin: false
}

try {
  const result = await createUser(userData)
  console.log('Utilisateur créé:', result)
} catch (err) {
  if (err.errors) {
    // Erreurs de validation
    console.log(err.errors)
  }
}
```

#### `updateUser(id, userData)`

Met à jour un utilisateur.

**Exemple :**
```javascript
const updates = {
  nom: 'Martin',
  telephone: '0987654321'
}

await updateUser(1, updates)
```

#### `deleteUser(id)`

Supprime un utilisateur.

**Exemple :**
```javascript
await deleteUser(1)
```

#### `toggleUserStatus(id)`

Bascule le statut actif/inactif.

**Exemple :**
```javascript
await toggleUserStatus(1)
```

## 💡 Exemples

### Exemple 1 : Rechercher des utilisateurs

```vue
<script setup>
import { useUsers } from '~/composables/users/useUsers'

const { users, fetchUsers, loading } = useUsers()
const searchTerm = ref('')

const search = async () => {
  await fetchUsers({ search: searchTerm.value })
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div>
    <input v-model="searchTerm" @input="search" placeholder="Rechercher..." />
    <div v-if="loading">Chargement...</div>
    <div v-else>
      <div v-for="user in users" :key="user.id">
        {{ user.nom }} {{ user.prenom }}
      </div>
    </div>
  </div>
</template>
```

### Exemple 2 : Créer un utilisateur avec validation

```vue
<script setup>
import { useUsers } from '~/composables/users/useUsers'

const { createUser, loading } = useUsers()
const form = ref({
  matricule: '',
  nom: '',
  prenom: '',
  email: ''
})
const errors = ref({})

const submit = async () => {
  errors.value = {}
  
  try {
    await createUser(form.value)
    alert('Utilisateur créé avec succès !')
    // Réinitialiser le formulaire
    form.value = { matricule: '', nom: '', prenom: '', email: '' }
  } catch (err) {
    if (err.errors) {
      errors.value = err.errors
    } else {
      alert(err.message)
    }
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <div>
      <input v-model="form.matricule" placeholder="Matricule" />
      <span v-if="errors.matricule">{{ errors.matricule[0] }}</span>
    </div>
    <!-- Autres champs... -->
    <button type="submit" :disabled="loading">
      {{ loading ? 'Création...' : 'Créer' }}
    </button>
  </form>
</template>
```

## 🔧 Dépannage

### Problème : "Token d'authentification manquant"

**Solution :**
Vérifiez que le token est bien stocké dans localStorage :
```javascript
console.log(localStorage.getItem('token'))
```

Si le token est absent, reconnectez-vous.

### Problème : Erreur 403 (Accès refusé)

**Cause :** Vous n'avez pas les privilèges nécessaires.

**Solution :**
- Seuls les super administrateurs peuvent créer des utilisateurs
- Vérifiez que votre compte a les bonnes permissions

### Problème : Erreur 422 (Validation)

**Cause :** Les données envoyées ne sont pas valides.

**Solution :**
- Vérifiez que tous les champs requis sont remplis
- Vérifiez l'unicité du matricule et de l'email
- Consultez les messages d'erreur sous chaque champ

### Problème : La liste ne se charge pas

**Solution :**
1. Vérifiez la connexion réseau
2. Vérifiez l'URL de l'API dans le code
3. Ouvrez la console du navigateur pour voir les erreurs
4. Vérifiez que le serveur backend est démarré

### Problème : Les modifications ne sont pas sauvegardées

**Solution :**
1. Vérifiez qu'il n'y a pas d'erreurs de validation
2. Vérifiez la console du navigateur
3. Vérifiez que le token est valide
4. Essayez de rafraîchir la page

## 📝 Notes importantes

- **Mot de passe** : Si laissé vide lors de la création, un mot de passe est généré automatiquement et envoyé par email
- **Suppression** : Un utilisateur ne peut pas supprimer son propre compte
- **Statut** : Un compte inactif ne peut pas se connecter
- **Super admin** : Seuls les super admins peuvent créer/modifier des utilisateurs

## 🆘 Support

Pour toute question ou problème :
1. Consultez la documentation complète dans `docs/GESTION_UTILISATEURS.md`
2. Vérifiez les logs du navigateur (F12 → Console)
3. Contactez l'équipe de développement

---

**Dernière mise à jour :** 2026-02-09  
**Version :** 2.0.0
