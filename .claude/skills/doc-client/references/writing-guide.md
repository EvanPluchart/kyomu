# Guide de redaction — Doc Client

## Glossaire technique → metier

Ce glossaire aide a traduire les termes techniques en langage client. Il n'est pas exhaustif — l'objectif est d'illustrer le reflexe de traduction.

| Terme technique | Formulation client |
|---|---|
| API / endpoint | Service, fonctionnalite, acces |
| Base de donnees | Donnees, informations enregistrees |
| Composant / module | Ecran, section, bloc |
| CRUD (Create/Read/Update/Delete) | Creer, consulter, modifier, supprimer |
| Dashboard | Tableau de bord |
| Entite | Fiche, element, enregistrement |
| Filtre / query parameter | Critere de recherche, filtre |
| Formulaire (form component) | Formulaire de saisie |
| Migration | Evolution, mise a jour |
| Notification (push/email) | Alerte, notification |
| Pagination | Navigation entre les pages de resultats |
| Permission / role / guard | Droit d'acces, habilitation |
| State / store | (ne pas mentionner — decrire le comportement) |
| Validation | Verification, controle de saisie |
| Workflow technique | Parcours, processus, etapes |

## Regles de reformulation

### Les noms propres techniques disparaissent

- "Le StateProcessor persiste l'entite" → "Le systeme enregistre les informations"
- "Le composant UserTable affiche..." → "Le tableau des utilisateurs affiche..."
- "L'endpoint POST /api/users cree..." → "La creation d'un utilisateur..."

### Les acronymes techniques sont interdits

- API, REST, GraphQL, JWT, RBAC, ORM, DTO, CRUD
- Exception : les acronymes metier du client sont autorises (ex: CRM, ERP, KPI)

### Les mecanismes internes deviennent des resultats

- "Le cron job synchronise les donnees toutes les heures" → "Les donnees sont mises a jour automatiquement toutes les heures"
- "Le websocket pousse les notifications en temps reel" → "Vous recevez les notifications instantanement"
- "Le cache Redis ameliore les performances" → "Les pages s'affichent rapidement"

### Les contraintes techniques deviennent des regles metier

- "Le champ email a une contrainte unique" → "Chaque adresse email ne peut etre utilisee qu'une seule fois"
- "La relation ManyToMany entre User et Structure..." → "Un utilisateur peut etre rattache a plusieurs structures"
- "Le voter verifie le role ADMIN" → "Cette action est reservee aux administrateurs"

## Structure du document genere

### En-tete obligatoire

```
Projet : {nom du projet}
Document : Documentation fonctionnelle — {nom du domaine}
Date : {dd/mm/yyyy}
Version : {numero si connu, sinon 1.0}
```

### Regles de mise en forme

- **Phrases courtes.** Maximum 2 lignes par phrase. Si une phrase est trop longue, la decouper.
- **Un paragraphe = une idee.** Ne pas melanger plusieurs concepts dans un meme paragraphe.
- **Listes a puces pour les enumerations.** Des qu'il y a 3 elements ou plus, utiliser une liste.
- **Tableaux pour les comparaisons.** Avant/apres, fonctionnalites par profil, statuts possibles.
- **Gras pour les termes cles.** Le nom d'une fonctionnalite, un concept important, un element d'interface.

### Adaptation selon le ton

**Ton formel :**
- Phrases impersonnelles : "Il est possible de...", "Le systeme permet de...", "La fonctionnalite offre..."
- Pas de tutoiement ni de vouvoiement direct
- Registre soutenu

**Ton accessible :**
- Vouvoiement direct : "Vous pouvez...", "Retrouvez...", "Creez facilement..."
- Ton chaleureux mais professionnel
- Registre courant

### Adaptation selon la longueur

**Courte (1-2 pages) :**
- Une phrase de contexte par section
- Liste a puces des fonctionnalites sans detail
- Pas d'exemples

**Standard (3-5 pages) :**
- Paragraphe d'introduction par section
- Fonctionnalites expliquees avec un minimum de contexte
- 1-2 exemples concrets

**Detaillee (5-10 pages) :**
- Introduction complete avec contexte metier
- Chaque fonctionnalite detaillee avec explication, exemple, et cas limites
- Section FAQ ou points d'attention
- Captures d'ecran si disponibles (mentionner l'emplacement prevu)
