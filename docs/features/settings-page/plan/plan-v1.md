# Plan v1 : Page de parametres

> Date : 2026-03-20
> Statut : final
> Complexite : petite (3 stories, pas d'epic)

## Contexte

Kyomu n'a aucune page de configuration/monitoring dans l'UI. Le scan ne peut etre declenche que via l'API, et l'utilisateur n'a aucune visibilite sur l'etat du systeme.

## Scope

### Inclus
- Page /settings accessible depuis la navigation
- Section Scan : bouton manuel, statut, indicateur de progression
- Section Bibliotheque : chemin comics, intervalle scan, stats
- Section A propos : version, lien GitHub
- API config pour exposer les infos serveur au client

### Exclus
- Modification de la configuration (lecture seule, la config se fait via env vars)
- Gestion des utilisateurs
- Logs detailles

## Stories

### Story 1 : Creer l'API Route de configuration
- **Taille** : S
- **Description** : Exposer les informations de configuration et stats via une API Route
- **Criteres d'acceptation** :
  - [ ] GET /api/settings retourne { config: { comicsPath, scanIntervalMinutes }, stats: { series, comics, read }, version }
  - [ ] Les informations sensibles (databasePath) ne sont pas exposees
- **Fichiers cibles** :
  - `src/app/api/settings/route.ts` - creer
- **Dependances** : aucune

### Story 2 : Creer la page /settings
- **Taille** : M
- **Description** : Page de parametres avec 3 sections : Scan, Bibliotheque, A propos. Le scan est declenchable avec un bouton et le statut est affiche en temps reel (polling).
- **Criteres d'acceptation** :
  - [ ] Section Scan : bouton "Scanner", indicateur en cours (spinner), dernier scan (date relative), resultat (series/comics ajoutes/supprimes)
  - [ ] Section Bibliotheque : chemin comics, intervalle de scan, nombre de series/comics/lus
  - [ ] Section A propos : version "0.1.0", lien GitHub EvanPluchart/kyomu
  - [ ] Le bouton scan est desactive pendant un scan en cours
  - [ ] Polling du statut toutes les 2 secondes pendant un scan
  - [ ] Design coherent avec le reste de l'app (utiliser frontend-design)
- **Fichiers cibles** :
  - `src/app/(library)/settings/page.tsx` - creer
- **Dependances** : Story 1

### Story 3 : Ajouter la navigation vers /settings
- **Taille** : S
- **Description** : Ajouter un lien Parametres dans la navigation desktop et mobile
- **Criteres d'acceptation** :
  - [ ] Lien "Parametres" dans la nav desktop (header) avec icone Settings
  - [ ] Lien "Parametres" dans la bottom nav mobile
  - [ ] L'item actif est mis en surbrillance quand on est sur /settings
- **Fichiers cibles** :
  - `src/components/layout/nav.tsx` - modifier
- **Dependances** : Story 2

## Ordre d'implementation

1. Story 1 - API settings (S)
2. Story 2 - Page settings (M)
3. Story 3 - Navigation (S)

## Estimations

| Story | Taille | Effort |
|-------|--------|--------|
| API settings | S | ~5 min |
| Page settings | M | ~15 min |
| Navigation | S | ~3 min |
| **Total** | **3 stories** | **~23 min** |
