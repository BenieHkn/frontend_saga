# Documentation - Création de Courrier Arrivé

## Vue d'ensemble

Le formulaire de création de courrier arrivé se trouve dans `pages/courriers/create.vue` et permet d'enregistrer un nouveau courrier entrant dans le système.

## Champs du formulaire

### Champs obligatoires (pour courrier arrivé)

1. **Numéro d'enregistrement** (`numero_enreg`) - String, unique
2. **Date d'enregistrement** (`date_enreg`) - Date
3. **Référence** (`reference`) - String, max 255 caractères
4. **Date du courrier** (`date_courrier`) - Date
5. **Objet** (`objet`) - String
6. **Type de document** (`type_document_id`) - ID du type de document (sélection dans une liste)
7. **Fichier** (`fichier`) - PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG (max 10MB)
8. **Type d'arrivée** (`type_arrivee`) - String: 'directe', 'cab', 'sgm', ou 'autre'
9. **Priorité** (`priority`) - String: 'standard', 'urgent', ou 'important'
10. **Service d'enregistrement** (`service_enreg`) - String (automatiquement déduit de `selected_entite`)

### Champs optionnels

- **Large diffusion** (`large_diffusion`) - Boolean, défaut: false
- **Confidentiel** (`confidentiel`) - Boolean, défaut: false
- **Structure** (`structure`) - String, nullable (affiché si type_arrivee !== 'autre')
- **Autre structure** (`autre_structure`) - String, nullable (affiché si type_arrivee === 'autre')
- **Numéro CAB** (`num_cab`) - String, nullable (affiché si type_arrivee === 'cab')
- **Date CAB** (`date_cab`) - Date, nullable (affiché si type_arrivee === 'cab')
- **Numéro SGM** (`num_sgm`) - String, nullable (affiché si type_arrivee === 'cab' ou 'sgm')
- **Date SGM** (`date_sgm`) - Date, nullable (affiché si type_arrivee === 'cab' ou 'sgm')

## Logique métier

### Déduction du service d'enregistrement

Le champ `service_enreg` est automatiquement rempli à partir de la fonction sélectionnée (`selected_entite`) stockée dans le localStorage. La logique est la suivante :

```javascript
const serviceEnreg = selectedFunction.service?.nom || selectedFunction.nom || 'Service par défaut'
```

### Champs conditionnels

Les champs suivants s'affichent selon le type d'arrivée sélectionné :

- **type_arrivee === 'directe'** : Structure
- **type_arrivee === 'cab'** : Structure, Numéro CAB, Date CAB, Numéro SGM, Date SGM
- **type_arrivee === 'sgm'** : Structure, Numéro SGM, Date SGM
- **type_arrivee === 'autre'** : Autre structure

## Flow de soumission

1. L'utilisateur remplit le formulaire
2. Validation des champs obligatoires côté client
3. Création d'un objet `FormData` contenant tous les champs et le fichier
4. Envoi du FormData à `/api/courriers/create-arrivee` (endpoint Nuxt)
5. L'endpoint Nuxt transfère les données à l'API Laravel à `POST /courriers-arrives`
6. L'API Laravel :
   - Valide les données
   - Stocke le fichier dans `storage/app/public/documents`
   - Crée l'enregistrement dans la table `documents`
   - Crée l'enregistrement dans la table `courrier_arrives`
7. Affichage d'un message de succès ou d'erreur
8. Redirection vers `/courriers` en cas de succès

## Endpoints API

### Frontend (Nuxt)
- **POST** `/api/courriers/create-arrivee` - Crée un courrier arrivé

### Backend (Laravel)
- **POST** `/api/courriers-arrives` - Endpoint Laravel pour créer un courrier arrivé
- **GET** `/api/type_documents` - Récupère la liste des types de documents

## Structure des données

### Request (FormData)
```
numero_enreg: string
date_enreg: date
reference: string
date_courrier: date
objet: string
large_diffusion: '0' | '1'
type_document_id: number
fichier: File
type_arrivee: 'directe' | 'cab' | 'sgm' | 'autre'
confidentiel: '0' | '1'
service_enreg: string
priority: 'standard' | 'urgent' | 'important'
structure?: string
autre_structure?: string
num_cab?: string
date_cab?: date
num_sgm?: string
date_sgm?: date
```

### Response (Success)
```json
{
  "success": true,
  "message": "Courrier arrivé créé avec succès",
  "data": {
    "id": 1,
    "numero_enreg": "CA-2026-001",
    "reference": "REF-001",
    "objet": "...",
    ...
  }
}
```

### Response (Error)
```json
{
  "success": false,
  "message": "Erreur de validation",
  "errors": {
    "numero_enreg": ["Le numéro d'enregistrement est déjà utilisé"],
    ...
  }
}
```

## Tests

Pour tester la création d'un courrier arrivé :

1. Assurez-vous d'être connecté
2. Assurez-vous qu'une fonction est sélectionnée dans le header
3. Accédez à `/courriers/create`
4. Sélectionnez "Courrier Arrivée"
5. Remplissez tous les champs obligatoires
6. Sélectionnez un fichier
7. Cliquez sur "SAUVEGARDER"
8. Vérifiez la notification de succès
9. Vérifiez la redirection vers `/courriers`

## Notes importantes

- Le numéro d'enregistrement doit être unique dans la base de données
- Le fichier ne doit pas dépasser 10MB
- Les formats de fichier acceptés : PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG
- La fonction sélectionnée doit être présente dans le localStorage (gestion via Header.vue)
- Le token d'authentification est requis pour toutes les requêtes API
