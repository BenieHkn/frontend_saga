# Gestion des Utilisateurs - Documentation

## Vue d'ensemble

Ce document décrit l'implémentation complète du système de gestion des utilisateurs dans l'application frontend Nuxt.js, communiquant avec une API Laravel backend.

## Architecture

### 1. Composable `useUsers.js`

**Emplacement:** `composables/users/useUsers.js`

Ce composable centralise toute la logique de gestion des utilisateurs :

#### Fonctionnalités :
- ✅ **fetchUsers(params)** - Récupère la liste des utilisateurs avec pagination et filtres
- ✅ **fetchUser(id)** - Récupère un utilisateur spécifique
- ✅ **createUser(userData)** - Crée un nouvel utilisateur
- ✅ **updateUser(id, userData)** - Met à jour un utilisateur
- ✅ **deleteUser(id)** - Supprime un utilisateur
- ✅ **toggleUserStatus(id)** - Bascule le statut actif/inactif
- ✅ **fetchSubordinates(id)** - Récupère les subordonnés d'un utilisateur
- ✅ **fetchMainFonction(id)** - Récupère la fonction principale

#### États réactifs :
- `users` - Liste des utilisateurs
- `user` - Utilisateur courant
- `loading` - État de chargement
- `error` - Messages d'erreur
- `pagination` - Informations de pagination

### 2. Pages

#### a) Liste des utilisateurs (`pages/utilisateurs/index.vue`)

**Fonctionnalités :**
- ✅ Affichage des utilisateurs dans un DataTable réutilisable
- ✅ Tri et filtrage des colonnes
- ✅ Pagination
- ✅ Recherche globale
- ✅ Actions par utilisateur :
  - Modifier
  - Gérer les fonctions
  - Activer/Désactiver
  - Supprimer
- ✅ Modal de confirmation de suppression
- ✅ Notifications toast

**Colonnes affichées :**
- Numéro de ligne
- Matricule
- Nom
- Prénom
- Email
- Téléphone
- Date de prise de service
- Statut (Actif/Inactif)
- Admin (Oui/Non)
- Actions

#### b) Création d'utilisateur (`pages/utilisateurs/create.vue`)

**Fonctionnalités :**
- ✅ Formulaire de création avec validation
- ✅ Champs :
  - Matricule (requis)
  - Nom (requis)
  - Prénom (requis)
  - Email (requis)
  - Téléphone
  - Mot de passe (optionnel - généré automatiquement si vide)
  - Date de prise de service
  - Statut actif (checkbox)
  - Super administrateur (checkbox)
- ✅ Gestion des erreurs de validation du backend
- ✅ Modal de succès
- ✅ Redirection après création

#### c) Modification d'utilisateur (`pages/utilisateurs/[id].vue`)

**Fonctionnalités :**
- ✅ Chargement des données existantes
- ✅ Formulaire de modification avec validation
- ✅ Même structure que la création
- ✅ Mot de passe optionnel (ne change que si rempli)
- ✅ Gestion des erreurs de validation
- ✅ Modal de succès

#### d) Gestion des fonctions (`pages/utilisateurs/[id]/fonctions.vue`)

**Fonctionnalités :**
- ✅ Affichage des informations de l'utilisateur
- ✅ Formulaire d'ajout de fonction :
  - Sélection de la fonction
  - Date de début
  - Date de fin (optionnelle)
  - Fonction intérimaire (checkbox)
  - Fonction active (checkbox)
- ✅ Liste des fonctions actuelles avec :
  - Nom et code de la fonction
  - Entité associée
  - Badges de statut (Active/Inactive, Intérim, Permanente)
  - Dates de début et fin
  - Bouton de suppression
- ✅ Modal de confirmation de suppression
- ✅ Notifications toast

## Intégration avec l'API Laravel

### Endpoints utilisés :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/users` | Liste des utilisateurs (avec pagination et filtres) |
| GET | `/users/{id}` | Détails d'un utilisateur |
| POST | `/users` | Créer un utilisateur |
| PUT | `/users/{id}` | Mettre à jour un utilisateur |
| DELETE | `/users/{id}` | Supprimer un utilisateur |
| POST | `/users/{id}/toggle-status` | Basculer le statut |
| GET | `/users/{id}/subordinates` | Récupérer les subordonnés |
| GET | `/users/{id}/main-fonction` | Récupérer la fonction principale |
| POST | `/users/{id}/fonctions` | Ajouter une fonction à un utilisateur |
| DELETE | `/fonction-users/{id}` | Retirer une fonction |

### Paramètres de requête supportés :

**GET /users :**
- `search` - Recherche sur nom, prénom, email, matricule
- `statut` - Filtrer par statut
- `per_page` - Nombre d'éléments par page
- `page` - Numéro de page

## Composants réutilisés

### DataTable
Le composant `DataTable.vue` est utilisé pour afficher la liste des utilisateurs avec :
- Tri sur toutes les colonnes
- Filtrage par colonne
- Pagination
- Recherche globale
- Actions personnalisées
- Slots pour personnaliser l'affichage des cellules

## Validation

### Frontend :
- Validation de base des champs requis
- Validation du format email

### Backend (Laravel) :
- Validation complète avec règles Laravel
- Messages d'erreur retournés et affichés dans le formulaire
- Gestion des erreurs 422 (Validation Error)

## Gestion des erreurs

### Types d'erreurs gérés :
- **403** - Accès refusé (privilèges insuffisants)
- **404** - Utilisateur non trouvé
- **422** - Erreurs de validation
- **500** - Erreur serveur
- **Network Error** - Problème de connexion

### Affichage :
- Erreurs de validation : sous chaque champ concerné
- Erreurs générales : toast de notification
- Erreurs critiques : alert

## Fonctionnalités avancées

### 1. Génération automatique de mot de passe
Si le champ mot de passe est laissé vide lors de la création, le backend génère automatiquement un mot de passe sécurisé et l'envoie par email à l'utilisateur.

### 2. Gestion des statuts
Les utilisateurs peuvent être activés ou désactivés rapidement via un bouton dans la liste.

### 3. Gestion des fonctions
Chaque utilisateur peut avoir plusieurs fonctions avec :
- Dates de début et fin
- Statut actif/inactif
- Indicateur d'intérim
- Association à une entité

### 4. Hiérarchie organisationnelle
Le système supporte la récupération des subordonnés basée sur la structure des entités.

## Utilisation

### Créer un utilisateur :
```javascript
import { useUsers } from '~/composables/users/useUsers'

const { createUser, loading, error } = useUsers()

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
  console.error('Erreur:', err)
}
```

### Récupérer la liste des utilisateurs :
```javascript
const { users, fetchUsers, pagination } = useUsers()

await fetchUsers({
  search: 'dupont',
  per_page: 15,
  page: 1
})

console.log('Utilisateurs:', users.value)
console.log('Pagination:', pagination.value)
```

## Améliorations futures possibles

1. **Export des données** - Ajouter la possibilité d'exporter la liste en CSV/Excel
2. **Import en masse** - Permettre l'import de plusieurs utilisateurs via fichier
3. **Historique des modifications** - Tracer les changements sur les utilisateurs
4. **Permissions granulaires** - Gérer les permissions au niveau des fonctions
5. **Notifications en temps réel** - WebSocket pour les mises à jour en direct
6. **Recherche avancée** - Filtres multiples et sauvegarde de recherches
7. **Profil utilisateur complet** - Page de profil avec plus de détails
8. **Gestion des documents** - Associer des documents aux utilisateurs

## Notes techniques

- **Framework Frontend:** Nuxt.js 3
- **UI Components:** Nuxt UI
- **HTTP Client:** Axios (via composable useApi)
- **State Management:** Composition API (ref, computed)
- **Styling:** Tailwind CSS
- **Icons:** Heroicons

## Sécurité

- ✅ Authentification par token Bearer
- ✅ Validation côté serveur
- ✅ Protection contre la suppression de son propre compte
- ✅ Vérification des privilèges administrateur pour certaines actions
- ✅ Sanitization des entrées utilisateur

## Performance

- ✅ Pagination côté serveur
- ✅ Chargement lazy des données
- ✅ Mise en cache des données utilisateur
- ✅ Debouncing sur la recherche (via DataTable)

---

**Date de création:** 2026-02-09
**Auteur:** Assistant AI
**Version:** 1.0.0
