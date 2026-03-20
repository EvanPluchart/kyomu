# Plan v1 : Kyomu — Lecteur de comics self-hosted

> Date : 2026-03-19
> Statut : draft

## Contexte

Remplacer Komga par un lecteur de comics self-hosted leger (< 100 Mo RAM), moderne et visuellement soigne. Les comics sont telecharges par Kapowarr dans `/mnt/media/comics`. Un seul utilisateur, pas de gestion de comptes. Deploiement via Coolify sur Oracle Cloud Free Tier.

## Scope

### Inclus
- Setup du projet Next.js + Tailwind + shadcn/ui + Drizzle/SQLite
- Scan de la bibliotheque (fichiers CBZ, CBR, PDF, dossiers d'images)
- Extraction et affichage des metadonnees (ComicInfo.xml)
- Lecteur de comics tactile-first (swipe, pinch-to-zoom, double-tap)
- Suivi de progression de lecture
- Generation et cache de thumbnails
- Interface bibliotheque (grille, recherche, filtres)
- Flux OPDS pour clients externes
- PWA installable (manifest, service worker, mode offline)
- Docker + deploiement Coolify

### Exclus
- Gestion multi-utilisateurs / authentification
- Edition de metadonnees (lecture seule)
- Telechargement de comics (fait par Kapowarr)
- Conversion de formats

---

## Epics

### Epic 1 : Fondations

#### Story 1.1 : Initialiser le projet Next.js avec Tailwind et shadcn/ui
- **Taille** : M
- **Description** : Creer le projet Next.js avec App Router, configurer Tailwind CSS, installer shadcn/ui, configurer les path aliases (@/), TypeScript strict, ESLint/Prettier.
- **Criteres d'acceptation** :
  - [ ] `pnpm dev` lance le serveur sans erreur
  - [ ] Tailwind fonctionne (classe utilitaire visible)
  - [ ] Un composant shadcn/ui (Button) s'affiche correctement
  - [ ] TypeScript strict active, path alias `@/` configure
  - [ ] ESLint + Prettier configures
- **Fichiers cibles** :
  - `package.json` - creer
  - `next.config.ts` - creer
  - `tailwind.config.ts` - creer
  - `tsconfig.json` - creer
  - `src/app/layout.tsx` - creer
  - `src/app/page.tsx` - creer
  - `src/lib/utils.ts` - creer (utilitaire cn() pour shadcn)
  - `components.json` - creer (config shadcn)
- **Patterns** : `~/evan-workflow/technos/nextjs/code-style.md`
- **Dependances** : aucune

#### Story 1.2 : Configurer Drizzle ORM avec SQLite
- **Taille** : M
- **Description** : Installer Drizzle ORM avec better-sqlite3, definir le schema initial (tables series, comics, reading_progress, library_config), generer la premiere migration, configurer la connexion DB.
- **Criteres d'acceptation** :
  - [ ] Schema Drizzle compile sans erreur
  - [ ] Migration generee dans `drizzle/`
  - [ ] Connexion DB fonctionne (fichier SQLite cree dans `data/`)
  - [ ] Script de migration executable
- **Fichiers cibles** :
  - `src/lib/db/schema.ts` - creer
  - `src/lib/db/index.ts` - creer (connexion)
  - `drizzle.config.ts` - creer
  - `drizzle/0000_init.sql` - generer
- **Patterns** : aucun (drizzle placeholder dans evan-workflow)
- **Dependances** : Story 1.1

#### Story 1.3 : Configurer Docker et le deploiement
- **Taille** : M
- **Description** : Creer le Dockerfile multi-stage optimise pour Next.js standalone, docker-compose pour le developpement local, configurer le volume `/app/data` pour la persistance.
- **Criteres d'acceptation** :
  - [ ] `docker build` reussit
  - [ ] `docker compose up` lance l'app accessible sur le port 3000
  - [ ] Le volume `data/` est persiste entre les redemarrages
  - [ ] Le dossier `/mnt/media/comics` est monte en lecture seule
  - [ ] Image finale < 200 Mo
- **Fichiers cibles** :
  - `Dockerfile` - creer
  - `docker-compose.yml` - creer
  - `.dockerignore` - creer
- **Dependances** : Story 1.1

---

### Epic 2 : Scan de la bibliotheque

#### Story 2.1 : Implementer le service de scan du systeme de fichiers
- **Taille** : L
- **Description** : Scanner recursivement `/mnt/media/comics` pour detecter les fichiers supportes (CBZ, CBR, PDF) et les dossiers d'images. Organiser par series (dossier parent) et volumes (fichiers). Inserer/mettre a jour en base.
- **Criteres d'acceptation** :
  - [ ] Detecte les fichiers CBZ, CBR, PDF et les dossiers d'images (jpg/png/webp)
  - [ ] Identifie les series a partir de la structure de dossiers
  - [ ] Detecte les nouveaux fichiers et les fichiers supprimes (scan differentiel)
  - [ ] Insert/update en base sans doublons
  - [ ] Gere les caracteres speciaux dans les noms de fichiers
- **Fichiers cibles** :
  - `src/lib/services/scanner.ts` - creer
  - `src/lib/services/file-utils.ts` - creer
- **Dependances** : Story 1.2

#### Story 2.2 : Implementer l'extraction de metadonnees ComicInfo.xml
- **Taille** : M
- **Description** : Extraire et parser le fichier ComicInfo.xml des archives CBZ/CBR. Mapper les champs (titre, serie, numero, auteurs, resume, date) vers le schema DB.
- **Criteres d'acceptation** :
  - [ ] Parse correctement ComicInfo.xml depuis un CBZ
  - [ ] Parse correctement ComicInfo.xml depuis un CBR
  - [ ] Gere l'absence de ComicInfo.xml (fallback sur le nom de fichier)
  - [ ] Mappe tous les champs pertinents vers la DB
- **Fichiers cibles** :
  - `src/lib/services/metadata.ts` - creer
  - `src/types/comic-info.ts` - creer
- **Dependances** : Story 2.1

#### Story 2.3 : Creer l'API Route de scan et le declenchement
- **Taille** : S
- **Description** : Exposer une API Route POST pour declencher un scan. Ajouter un scan automatique au demarrage de l'app.
- **Criteres d'acceptation** :
  - [ ] `POST /api/library/scan` declenche un scan et retourne le statut
  - [ ] Le scan s'execute en arriere-plan (pas de timeout HTTP)
  - [ ] Scan automatique au premier demarrage
  - [ ] Retourne le nombre de series/comics detectes
- **Fichiers cibles** :
  - `src/app/api/library/scan/route.ts` - creer
- **Dependances** : Story 2.1, Story 2.2

---

### Epic 3 : Extraction de comics

#### Story 3.1 : Implementer l'extraction des pages CBZ
- **Taille** : M
- **Description** : Extraire les images d'un fichier CBZ (archive ZIP) en streaming. Trier les pages par ordre naturel (numerique). Retourner les images sans tout charger en memoire.
- **Criteres d'acceptation** :
  - [ ] Extrait les images d'un CBZ sans decompresser tout en memoire
  - [ ] Tri naturel des noms de fichiers (page1, page2... page10, pas page1, page10, page2)
  - [ ] Supporte jpg, png, webp dans l'archive
  - [ ] Ignore les fichiers non-image (thumbs.db, .DS_Store, xml)
- **Fichiers cibles** :
  - `src/lib/services/extractors/cbz.ts` - creer
  - `src/lib/services/extractors/types.ts` - creer (interface commune)
- **Dependances** : Story 1.1

#### Story 3.2 : Implementer l'extraction des pages CBR
- **Taille** : M
- **Description** : Extraire les images d'un fichier CBR (archive RAR). Utiliser une lib compatible Node.js (unrar.js ou node-unrar-js). Meme interface que l'extracteur CBZ.
- **Criteres d'acceptation** :
  - [ ] Extrait les images d'un CBR
  - [ ] Meme interface que l'extracteur CBZ
  - [ ] Gere les archives RAR4 et RAR5
  - [ ] Extraction en streaming si possible
- **Fichiers cibles** :
  - `src/lib/services/extractors/cbr.ts` - creer
- **Dependances** : Story 3.1 (interface commune)

#### Story 3.3 : Implementer l'extraction des pages PDF
- **Taille** : L
- **Description** : Convertir les pages d'un PDF en images pour le lecteur. Utiliser pdf.js ou une lib de rendu PDF cote serveur. Extraire page par page.
- **Criteres d'acceptation** :
  - [ ] Convertit chaque page PDF en image (jpg/png)
  - [ ] Meme interface que les autres extracteurs
  - [ ] Resolution configurable (defaut 1500px de large)
  - [ ] Ne charge pas tout le PDF en memoire
- **Fichiers cibles** :
  - `src/lib/services/extractors/pdf.ts` - creer
- **Dependances** : Story 3.1 (interface commune)

#### Story 3.4 : Implementer le support des dossiers d'images
- **Taille** : S
- **Description** : Lire les images directement depuis un dossier (pas d'extraction necessaire). Tri naturel des fichiers.
- **Criteres d'acceptation** :
  - [ ] Liste les images d'un dossier (jpg, png, webp)
  - [ ] Tri naturel des noms de fichiers
  - [ ] Meme interface que les autres extracteurs
- **Fichiers cibles** :
  - `src/lib/services/extractors/folder.ts` - creer
- **Dependances** : Story 3.1 (interface commune)

#### Story 3.5 : Creer les API Routes de lecture des pages
- **Taille** : M
- **Description** : Exposer des API Routes pour servir les pages d'un comic : liste des pages et image individuelle. L'API Route de page doit streamer l'image avec les bons headers de cache.
- **Criteres d'acceptation** :
  - [ ] `GET /api/comics/[id]/pages` retourne la liste des pages avec dimensions
  - [ ] `GET /api/comics/[id]/pages/[page]` retourne l'image de la page
  - [ ] Headers Cache-Control configures (images immutables)
  - [ ] Content-Type correct selon le format de l'image
  - [ ] Gestion d'erreur si comic ou page introuvable
- **Fichiers cibles** :
  - `src/app/api/comics/[id]/pages/route.ts` - creer
  - `src/app/api/comics/[id]/pages/[page]/route.ts` - creer
- **Dependances** : Story 3.1, Story 3.2, Story 3.3, Story 3.4

---

### Epic 4 : Thumbnails

#### Story 4.1 : Implementer la generation et le cache de thumbnails
- **Taille** : M
- **Description** : Generer des thumbnails a partir de la premiere page de chaque comic. Stocker dans `data/thumbnails/`. Utiliser sharp pour le redimensionnement. Generer en arriere-plan apres le scan.
- **Criteres d'acceptation** :
  - [ ] Genere un thumbnail (300px de large, webp) depuis la premiere page
  - [ ] Stocke dans `data/thumbnails/{comic-id}.webp`
  - [ ] Ne regenere pas si le thumbnail existe deja et le fichier source n'a pas change
  - [ ] Generation en batch apres le scan (pas de blocage)
- **Fichiers cibles** :
  - `src/lib/services/thumbnails.ts` - creer
- **Dependances** : Story 3.1, Story 3.2, Story 3.3, Story 3.4

#### Story 4.2 : Creer l'API Route des thumbnails
- **Taille** : S
- **Description** : Servir les thumbnails via une API Route avec fallback de generation a la volee si le thumbnail n'existe pas encore.
- **Criteres d'acceptation** :
  - [ ] `GET /api/comics/[id]/thumbnail` retourne le thumbnail
  - [ ] Genere a la volee si le thumbnail n'existe pas (puis le cache)
  - [ ] Headers Cache-Control longue duree
  - [ ] Retourne un placeholder si le comic n'existe pas
- **Fichiers cibles** :
  - `src/app/api/comics/[id]/thumbnail/route.ts` - creer
- **Dependances** : Story 4.1

---

### Epic 5 : Interface bibliotheque

#### Story 5.1 : Creer le layout principal et la navigation
- **Taille** : M
- **Description** : Layout racine avec header, navigation, et structure responsive. Theme sombre par defaut. Integrer les polices et les couleurs du design system.
- **Criteres d'acceptation** :
  - [ ] Layout responsive avec header
  - [ ] Navigation : Accueil, Series, "En cours de lecture"
  - [ ] Theme sombre par defaut
  - [ ] Textes en francais avec accents corrects
  - [ ] Meta tags PWA dans le layout
- **Fichiers cibles** :
  - `src/app/layout.tsx` - modifier
  - `src/app/globals.css` - creer
  - `src/components/layout/header.tsx` - creer
  - `src/components/layout/nav.tsx` - creer
- **Patterns** : `~/evan-workflow/technos/nextjs/patterns/component.md`
- **Dependances** : Story 1.1

#### Story 5.2 : Implementer la grille de series
- **Taille** : M
- **Description** : Page listant toutes les series avec une grille responsive de cartes. Chaque carte affiche le thumbnail de la serie, son nom et le nombre de volumes.
- **Criteres d'acceptation** :
  - [ ] Grille responsive (2 colonnes mobile, 4-6 desktop)
  - [ ] Carte avec thumbnail, titre, nombre de volumes
  - [ ] Indicateur de progression de lecture par serie
  - [ ] Chargement lazy des thumbnails
  - [ ] Etat vide si aucune serie
- **Fichiers cibles** :
  - `src/app/(library)/series/page.tsx` - creer
  - `src/components/library/series-grid.tsx` - creer
  - `src/components/library/series-card.tsx` - creer
- **Dependances** : Story 5.1, Story 4.2, Story 2.3

#### Story 5.3 : Implementer la page de detail d'une serie
- **Taille** : M
- **Description** : Page affichant les details d'une serie : metadonnees, liste des volumes avec thumbnails, progression de lecture par volume.
- **Criteres d'acceptation** :
  - [ ] Affiche le titre, l'auteur, le resume de la serie
  - [ ] Liste des volumes avec thumbnails en grille
  - [ ] Indicateur de progression par volume (non lu / en cours / lu)
  - [ ] Bouton "Continuer la lecture" (reprend au dernier volume en cours)
  - [ ] Tri par numero de volume
- **Fichiers cibles** :
  - `src/app/(library)/series/[id]/page.tsx` - creer
  - `src/components/library/volume-grid.tsx` - creer
  - `src/components/library/volume-card.tsx` - creer
- **Dependances** : Story 5.2

#### Story 5.4 : Implementer la recherche et les filtres
- **Taille** : M
- **Description** : Barre de recherche globale (titre, auteur) et filtres (statut de lecture, format). Recherche cote serveur pour la performance.
- **Criteres d'acceptation** :
  - [ ] Recherche par titre et auteur
  - [ ] Filtre par statut : tous / non lus / en cours / lus
  - [ ] Resultats mis a jour en temps reel (debounce 300ms)
  - [ ] Etat vide avec message si aucun resultat
- **Fichiers cibles** :
  - `src/components/library/search-bar.tsx` - creer
  - `src/components/library/filters.tsx` - creer
  - `src/app/api/library/search/route.ts` - creer
- **Dependances** : Story 5.2

#### Story 5.5 : Implementer la page d'accueil
- **Taille** : M
- **Description** : Page d'accueil avec sections : "Continuer la lecture" (comics en cours), "Recemment ajoutes", "Series". Vue d'ensemble rapide de la bibliotheque.
- **Criteres d'acceptation** :
  - [ ] Section "Continuer la lecture" avec les derniers comics en cours
  - [ ] Section "Recemment ajoutes" avec les derniers comics scannes
  - [ ] Section "Toutes les series" (raccourci vers /series)
  - [ ] Carrousel horizontal scrollable sur mobile
  - [ ] Stats de la bibliotheque (nombre de series, volumes, progression)
- **Fichiers cibles** :
  - `src/app/page.tsx` - modifier
  - `src/components/library/continue-reading.tsx` - creer
  - `src/components/library/recent-additions.tsx` - creer
  - `src/components/library/horizontal-scroll.tsx` - creer
- **Dependances** : Story 5.2, Story 6.3

---

### Epic 6 : Lecteur de comics

#### Story 6.1 : Implementer le lecteur de base (affichage page par page)
- **Taille** : L
- **Description** : Page de lecture affichant une page a la fois. Navigation par fleches/clavier/tap sur les bords. Preloading de la page suivante. Barre de progression en bas.
- **Criteres d'acceptation** :
  - [ ] Affiche une page a la fois, centree, adaptee a l'ecran
  - [ ] Navigation : fleches gauche/droite, touches clavier, tap sur les bords
  - [ ] Preloading de la page N+1 et N+2
  - [ ] Barre de progression indiquant la page courante / total
  - [ ] Bouton retour vers la page de la serie
- **Fichiers cibles** :
  - `src/app/(reader)/read/[id]/page.tsx` - creer
  - `src/components/reader/page-viewer.tsx` - creer
  - `src/components/reader/reader-controls.tsx` - creer
  - `src/components/reader/progress-bar.tsx` - creer
- **Dependances** : Story 3.5

#### Story 6.2 : Implementer les gestes tactiles (swipe, pinch-to-zoom)
- **Taille** : L
- **Description** : Ajouter le support des gestes tactiles au lecteur : swipe gauche/droite pour naviguer, pinch-to-zoom pour zoomer, double-tap pour zoom rapide, pan quand zoome.
- **Criteres d'acceptation** :
  - [ ] Swipe gauche/droite pour changer de page
  - [ ] Pinch-to-zoom fluide (min 1x, max 4x)
  - [ ] Double-tap pour alterner entre zoom 1x et 2x
  - [ ] Pan (glisser) quand zoome
  - [ ] Reset du zoom au changement de page
  - [ ] Animations fluides (60fps)
- **Fichiers cibles** :
  - `src/components/reader/touch-handler.tsx` - creer
  - `src/lib/utils/gestures.ts` - creer
- **Dependances** : Story 6.1

#### Story 6.3 : Implementer le suivi de progression de lecture
- **Taille** : M
- **Description** : Sauvegarder automatiquement la page courante lors de la lecture. Reprendre la lecture a la derniere page lue. Marquer un comic comme "lu" a la derniere page.
- **Criteres d'acceptation** :
  - [ ] Sauvegarde automatique de la page courante (debounce 2s)
  - [ ] Reprise a la derniere page lue a l'ouverture
  - [ ] Marquage automatique "lu" a la derniere page
  - [ ] Possibilite de marquer manuellement comme lu/non lu
  - [ ] API Route pour la progression
- **Fichiers cibles** :
  - `src/lib/services/progress.ts` - creer
  - `src/app/api/comics/[id]/progress/route.ts` - creer
- **Dependances** : Story 1.2, Story 6.1

#### Story 6.4 : Implementer les modes de lecture
- **Taille** : M
- **Description** : Ajouter les options de mode de lecture : page simple, double page (desktop), defilement vertical continu (webtoon). Persistance du choix par serie.
- **Criteres d'acceptation** :
  - [ ] Mode page simple (defaut)
  - [ ] Mode double page (desktop uniquement, desactive sur mobile)
  - [ ] Mode defilement vertical (webtoon/manga long)
  - [ ] Persistance du mode choisi par serie
  - [ ] Sens de lecture configurable (gauche-a-droite / droite-a-gauche pour les manga)
- **Fichiers cibles** :
  - `src/components/reader/reading-modes.tsx` - creer
  - `src/components/reader/vertical-reader.tsx` - creer
  - `src/components/reader/double-page-reader.tsx` - creer
- **Dependances** : Story 6.1, Story 6.2

---

### Epic 7 : API bibliotheque

#### Story 7.1 : Implementer les API Routes de la bibliotheque
- **Taille** : M
- **Description** : API Routes pour lister les series, les volumes d'une serie, les details d'un comic. Pagination, tri et filtrage.
- **Criteres d'acceptation** :
  - [ ] `GET /api/library/series` — liste paginee des series
  - [ ] `GET /api/library/series/[id]` — details d'une serie avec ses volumes
  - [ ] `GET /api/comics/[id]` — details d'un comic
  - [ ] Support pagination (page, limit)
  - [ ] Support tri (titre, date d'ajout, date de derniere lecture)
  - [ ] Support filtre (statut de lecture)
- **Fichiers cibles** :
  - `src/app/api/library/series/route.ts` - creer
  - `src/app/api/library/series/[id]/route.ts` - creer
  - `src/app/api/comics/[id]/route.ts` - creer
- **Dependances** : Story 1.2

---

### Epic 8 : OPDS

#### Story 8.1 : Implementer le flux OPDS
- **Taille** : L
- **Description** : Generer un flux OPDS (Open Publication Distribution System) compatible avec les clients de lecture (Panels, Chunky Reader, etc.). Catalogues de navigation et d'acquisition.
- **Criteres d'acceptation** :
  - [ ] `GET /api/opds` — catalogue racine (navigation)
  - [ ] `GET /api/opds/series` — liste des series
  - [ ] `GET /api/opds/series/[id]` — volumes d'une serie (acquisition)
  - [ ] Format Atom/XML valide OPDS 1.2
  - [ ] Liens de telechargement des fichiers originaux
  - [ ] Liens vers les thumbnails
  - [ ] Pagination OPDS
- **Fichiers cibles** :
  - `src/app/api/opds/route.ts` - creer
  - `src/app/api/opds/series/route.ts` - creer
  - `src/app/api/opds/series/[id]/route.ts` - creer
  - `src/lib/services/opds.ts` - creer
  - `src/types/opds.ts` - creer
- **Dependances** : Story 7.1, Story 4.2

---

### Epic 9 : PWA et mode offline

#### Story 9.1 : Configurer le manifest PWA et le service worker
- **Taille** : M
- **Description** : Configurer le manifest.json pour l'installation PWA (icones, theme, display standalone). Mettre en place un service worker avec next-pwa ou serwist pour le cache des assets.
- **Criteres d'acceptation** :
  - [ ] Manifest PWA avec icones, couleurs, display standalone
  - [ ] Installable sur iPhone (Add to Home Screen)
  - [ ] Splash screen configure
  - [ ] Service worker enregistre, cache les assets statiques
  - [ ] Fonctionne en mode standalone (pas de barre de navigateur)
- **Fichiers cibles** :
  - `public/manifest.json` - modifier
  - `public/icons/` - ajouter icones (192, 512, maskable)
  - `src/app/layout.tsx` - modifier (meta tags PWA)
  - `next.config.ts` - modifier (config PWA)
- **Dependances** : Story 5.1

#### Story 9.2 : Implementer le telechargement offline de comics
- **Taille** : L
- **Description** : Permettre de telecharger un comic pour lecture offline. Stocker les pages dans le cache du service worker ou IndexedDB. Indicateur de disponibilite offline dans l'UI.
- **Criteres d'acceptation** :
  - [ ] Bouton "Telecharger pour offline" sur la page d'un comic
  - [ ] Stocke toutes les pages dans IndexedDB
  - [ ] Indicateur visuel de l'etat du telechargement (progression)
  - [ ] Badge "Disponible offline" sur les comics telecharges
  - [ ] Lecteur fonctionne sans connexion pour les comics telecharges
  - [ ] Gestion de l'espace de stockage (afficher l'espace utilise, pouvoir supprimer)
- **Fichiers cibles** :
  - `src/lib/services/offline-storage.ts` - creer
  - `src/components/library/offline-button.tsx` - creer
  - `src/components/library/offline-badge.tsx` - creer
- **Dependances** : Story 9.1, Story 6.1

---

### Epic 10 : Tests

#### Story 10.1 : Configurer Vitest et ecrire les tests des services
- **Taille** : M
- **Description** : Configurer Vitest, ecrire les tests unitaires pour les services critiques : scanner, extracteurs, metadonnees, progression.
- **Criteres d'acceptation** :
  - [ ] Vitest configure avec support TypeScript et path aliases
  - [ ] Tests du scanner (detection de fichiers, scan differentiel)
  - [ ] Tests des extracteurs (CBZ, CBR, dossier)
  - [ ] Tests du service de metadonnees (parsing ComicInfo.xml)
  - [ ] Tests du service de progression
  - [ ] Couverture > 80% sur les services
- **Fichiers cibles** :
  - `vitest.config.ts` - creer
  - `tests/services/scanner.test.ts` - creer
  - `tests/services/extractors.test.ts` - creer
  - `tests/services/metadata.test.ts` - creer
  - `tests/services/progress.test.ts` - creer
  - `tests/fixtures/` - creer (CBZ/CBR de test)
- **Patterns** : `~/evan-workflow/technos/nextjs/patterns/testing.md`
- **Dependances** : Story 2.1, Story 3.1, Story 3.2, Story 6.3

---

## Ordre d'implementation

1. Story 1.1 - Initialiser le projet Next.js
2. Story 1.2 - Configurer Drizzle ORM avec SQLite
3. Story 1.3 - Configurer Docker
4. Story 3.1 - Extraction CBZ
5. Story 3.2 - Extraction CBR
6. Story 3.3 - Extraction PDF
7. Story 3.4 - Extraction dossiers d'images
8. Story 2.1 - Scan de la bibliotheque
9. Story 2.2 - Extraction metadonnees
10. Story 2.3 - API Route scan
11. Story 3.5 - API Routes pages
12. Story 4.1 - Generation thumbnails
13. Story 4.2 - API Route thumbnails
14. Story 7.1 - API Routes bibliotheque
15. Story 5.1 - Layout et navigation
16. Story 5.2 - Grille de series
17. Story 5.3 - Detail serie
18. Story 5.4 - Recherche et filtres
19. Story 6.1 - Lecteur de base
20. Story 6.2 - Gestes tactiles
21. Story 6.3 - Suivi de progression
22. Story 6.4 - Modes de lecture
23. Story 5.5 - Page d'accueil
24. Story 8.1 - Flux OPDS
25. Story 9.1 - PWA manifest + service worker
26. Story 9.2 - Telechargement offline
27. Story 10.1 - Tests

## Risques identifies

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Extraction CBR lente (pas de lib native RAR en Node) | Moyen | Evaluer node-unrar-js vs binary unrar, benchmark |
| Rendu PDF en images cote serveur (CPU intensif) | Eleve | Utiliser pdf.js avec canvas, cache agressif, resolution limitee |
| Memoire > 100 Mo avec gros fichiers | Eleve | Streaming obligatoire, pas de buffer complet, limiter concurrence |
| Service worker + Next.js App Router (compatibilite) | Moyen | Utiliser serwist (successeur de next-pwa), tester tot |
| IndexedDB limite sur iOS Safari | Moyen | Limiter la taille du cache offline, informer l'utilisateur |
| Oracle Cloud Free Tier CPU faible | Moyen | Optimiser la generation de thumbnails (batch, priorite basse) |
| OPDS spec complexe (pagination, search, facets) | Faible | Implementer OPDS 1.2 minimal, ajouter des features iterativement |

## Estimations

| Epic | Stories | Effort estime |
|------|---------|---------------|
| Epic 1 : Fondations | 3 | S:0, M:3, L:0 |
| Epic 2 : Scan bibliotheque | 3 | S:1, M:1, L:1 |
| Epic 3 : Extraction comics | 5 | S:1, M:3, L:1 |
| Epic 4 : Thumbnails | 2 | S:1, M:1, L:0 |
| Epic 5 : Interface bibliotheque | 5 | S:0, M:5, L:0 |
| Epic 6 : Lecteur de comics | 4 | S:0, M:2, L:2 |
| Epic 7 : API bibliotheque | 1 | S:0, M:1, L:0 |
| Epic 8 : OPDS | 1 | S:0, M:0, L:1 |
| Epic 9 : PWA et offline | 2 | S:0, M:1, L:1 |
| Epic 10 : Tests | 1 | S:0, M:1, L:0 |
| **Total** | **27** | **S:3, M:18, L:6** |
