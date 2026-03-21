# Plan v1 : Systeme de profils

> Date : 2026-03-21
> Statut : final
> Complexite : moyenne (5 stories)

## Contexte

Kyomu est utilise par une seule personne actuellement. Avec les profils, plusieurs personnes du foyer pourront avoir chacune leur progression de lecture et leurs preferences.

## Scope

### Inclus
- Table `profiles` en DB (nom, couleur, pin optionnel)
- Page de selection de profil style Netflix (/profiles)
- Progression de lecture liee au profil actif (colonne profile_id sur reading_progress)
- Preferences par profil (theme, accent) stockees en DB
- Indicateur du profil actif dans le header
- Max 6 profils
- Cookie pour persister le profil selectionne

### Exclus
- Authentification avec mot de passe/OAuth
- Roles et permissions (admin vs user)
- Profils distants / sync entre appareils

## Architecture

Le profil actif est identifie par un cookie `kyomu-profile` contenant l'ID du profil.
Chaque requete API qui touche la progression lit ce cookie.
Si aucun profil n'existe, le systeme cree un profil "Par defaut" automatiquement.

## Stories

### Story 1 : Schema DB et migration
- **Taille** : M
- **Description** : Creer la table profiles, ajouter profile_id sur reading_progress, migration
- **Fichiers** : `src/lib/db/schema.ts`, migration Drizzle
- **Details** :
  - Table `profiles` : id, name, color, pin (nullable), theme, accent, created_at
  - Ajouter `profile_id` (integer, nullable, FK) sur `reading_progress`
  - Migration : creer un profil "Par defaut" et lier les progressions existantes

### Story 2 : API profils et middleware
- **Taille** : M
- **Description** : CRUD profils + middleware pour identifier le profil actif
- **Fichiers** : API routes, helper de profil
- **Details** :
  - GET /api/profiles — liste des profils
  - POST /api/profiles — creer un profil
  - PUT /api/profiles/[id] — modifier
  - DELETE /api/profiles/[id] — supprimer (+ ses progressions)
  - POST /api/profiles/[id]/select — selectionner (set cookie)
  - Helper `getActiveProfileId(cookies)` pour lire le cookie

### Story 3 : Page de selection de profil
- **Taille** : M
- **Description** : Page /profiles style Netflix avec grille d'avatars
- **Fichiers** : `src/app/profiles/page.tsx`
- **Details** :
  - Grille de profils avec nom + avatar colore
  - Clic = selectionne et redirige vers /
  - Bouton + pour creer un profil (modale simple)
  - Bouton editer sur chaque profil (nom, couleur, PIN)
  - Si PIN defini, demander le PIN avant de selectionner

### Story 4 : Lier la progression au profil actif
- **Taille** : L
- **Description** : Toutes les requetes de progression lisent/ecrivent avec le profile_id du cookie
- **Fichiers** : routes progress, scanner, pages accueil/series
- **Details** :
  - Modifier les API progress (GET/PUT/PATCH) pour filtrer par profile_id
  - Modifier les pages accueil, reading, history pour filtrer par profil
  - La page series/[id] montre la progression du profil actif

### Story 5 : Indicateur de profil dans le header
- **Taille** : S
- **Description** : Afficher le nom/avatar du profil actif dans le header avec lien pour changer
- **Fichiers** : `src/components/layout/header.tsx`
- **Details** :
  - Avatar colore + nom du profil dans le header
  - Clic = redirige vers /profiles

## Ordre d'implementation
1. Story 1 (DB)
2. Story 2 (API)
3. Story 3 (Page profils)
4. Story 5 (Header)
5. Story 4 (Progression liee)
