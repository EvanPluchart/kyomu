# Plan v2 : Kyomu — Lecteur de comics self-hosted

> Date : 2026-03-19
> Statut : final
> Changements depuis v1 : voir section "Changelog v1 → v2" en fin de document

## Contexte

Remplacer Komga par un lecteur de comics self-hosted leger (< 100 Mo RAM), moderne et visuellement soigne. Les comics sont telecharges par Kapowarr dans un dossier configurable (defaut `/mnt/media/comics`). Un seul utilisateur, pas de gestion de comptes. Deploiement via Coolify sur Oracle Cloud Free Tier (ARM Ampere).

## Scope

### Inclus
- Setup du projet Next.js + Tailwind + shadcn/ui + Drizzle/SQLite
- Scan de la bibliotheque avec detection automatique des nouveaux fichiers
- Formats : CBZ, CBR (via binaire unrar), dossiers d'images
- Extraction et affichage des metadonnees (ComicInfo.xml)
- Lecteur de comics tactile-first (swipe, pinch-to-zoom, double-tap)
- Navigation inter-volumes automatique
- Suivi de progression de lecture
- Generation et cache de thumbnails
- Interface bibliotheque (grille, recherche, filtres)
- Flux OPDS pour clients externes
- PWA installable (manifest, service worker, mode offline)
- Docker multi-arch (AMD64 + ARM64) + deploiement Coolify

### Exclus
- Gestion multi-utilisateurs / authentification
- Edition de metadonnees (lecture seule)
- Telechargement de comics (fait par Kapowarr)
- Conversion de formats
- **Support PDF reporte en v2** (complexite rendu serveur sur ARM, voir Decision D7)

---

## Epics

### Epic 1 : Fondations

#### Story 1.1 : Initialiser le projet Next.js avec Tailwind et shadcn/ui
- **Taille** : M
- **Description** : Creer le projet Next.js avec App Router, configurer Tailwind CSS, installer shadcn/ui, configurer les path aliases (@/), TypeScript strict, ESLint/Prettier. Utiliser pnpm.
- **Criteres d'acceptation** :
  - [ ] `pnpm dev` lance le serveur sans erreur
  - [ ] Tailwind fonctionne (classe utilitaire visible)
  - [ ] Un composant shadcn/ui (Button) s'affiche correctement
  - [ ] TypeScript strict active, path alias `@/` configure
  - [ ] ESLint + Prettier configures
- **Fichiers cibles** :
  - `package.json` - creer
  - `pnpm-lock.yaml` - generer
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
- **Description** : Installer Drizzle ORM avec better-sqlite3, definir le schema initial, generer la premiere migration, configurer la connexion DB. Le schema inclut les champs `file_mtime` et `file_size` pour le scan differentiel.
- **Criteres d'acceptation** :
  - [ ] Schema Drizzle compile sans erreur
  - [ ] Tables : `series`, `comics`, `reading_progress`, `app_settings`
  - [ ] Champs `file_path`, `file_size`, `file_mtime` sur la table `comics`
  - [ ] Migration generee dans `drizzle/`
  - [ ] Connexion DB fonctionne (fichier SQLite cree dans `data/`)
  - [ ] Script de migration executable (`pnpm db:migrate`)
  - [ ] Verification : `better-sqlite3` compile sur ARM64 (tester dans Docker)
- **Fichiers cibles** :
  - `src/lib/db/schema.ts` - creer
  - `src/lib/db/index.ts` - creer (connexion singleton)
  - `drizzle.config.ts` - creer
  - `drizzle/0000_init.sql` - generer
- **Dependances** : Story 1.1

#### Story 1.3 : Configurer Docker multi-arch avec healthcheck
- **Taille** : M
- **Description** : Creer le Dockerfile multi-stage optimise pour Next.js standalone. Installer les dependances systeme (`unrar` pour CBR). Build multi-arch AMD64 + ARM64. Healthcheck pour Coolify.
- **Criteres d'acceptation** :
  - [ ] `docker build` reussit sur AMD64 et ARM64
  - [ ] `docker compose up` lance l'app accessible sur le port 3000
  - [ ] Le volume `data/` est persiste entre les redemarrages
  - [ ] Le dossier comics est monte en lecture seule (chemin configurable via env)
  - [ ] `unrar` installe et fonctionnel dans le container
  - [ ] `sharp` compile correctement sur ARM64
  - [ ] Healthcheck sur `/api/health` (status 200)
  - [ ] Image finale < 250 Mo (ajuste pour les binaires natifs ARM)
  - [ ] Variable d'env `COMICS_PATH` pour le chemin de la bibliotheque
- **Fichiers cibles** :
  - `Dockerfile` - creer
  - `docker-compose.yml` - creer
  - `.dockerignore` - creer
  - `src/app/api/health/route.ts` - creer
- **Dependances** : Story 1.1

#### Story 1.4 : Implementer la configuration de l'application
- **Taille** : S
- **Description** : Gerer la configuration via variables d'environnement avec valeurs par defaut. Validation au demarrage.
- **Criteres d'acceptation** :
  - [ ] `COMICS_PATH` configurable (defaut `/mnt/media/comics`)
  - [ ] `SCAN_INTERVAL_MINUTES` configurable (defaut 60)
  - [ ] `DATABASE_PATH` configurable (defaut `./data/kyomu.db`)
  - [ ] Validation au demarrage avec messages d'erreur explicites si le dossier comics n'existe pas
  - [ ] Type-safe avec un schema de config centralise
- **Fichiers cibles** :
  - `src/lib/config.ts` - creer
- **Dependances** : Story 1.1

---

### Epic 2 : Scan de la bibliotheque

#### Story 2.1 : Implementer le service de scan du systeme de fichiers
- **Taille** : L
- **Description** : Scanner recursivement le dossier comics pour detecter les fichiers CBZ, CBR et les dossiers d'images. Scan differentiel base sur le mtime/taille. Mutex pour empecher les scans simultanes.
- **Criteres d'acceptation** :
  - [ ] Detecte les fichiers CBZ, CBR et les dossiers d'images (jpg/png/webp)
  - [ ] Identifie les series a partir de la structure de dossiers
  - [ ] Scan differentiel : ignore les fichiers deja connus avec meme mtime/taille
  - [ ] Supprime de la DB les comics dont le fichier source n'existe plus
  - [ ] Mutex : un seul scan a la fois, retourne un message si deja en cours
  - [ ] Gere les caracteres speciaux/unicode dans les noms de fichiers
  - [ ] Gere les archives corrompues ou vides (log warning, skip)
  - [ ] Tests unitaires inclus
- **Fichiers cibles** :
  - `src/lib/services/scanner.ts` - creer
  - `src/lib/services/file-utils.ts` - creer
  - `tests/services/scanner.test.ts` - creer
- **Dependances** : Story 1.2, Story 1.4

#### Story 2.2 : Implementer l'extraction de metadonnees ComicInfo.xml
- **Taille** : M
- **Description** : Extraire et parser le fichier ComicInfo.xml des archives CBZ/CBR. Fallback sur le nom de fichier si absent.
- **Criteres d'acceptation** :
  - [ ] Parse correctement ComicInfo.xml depuis un CBZ (extraction selective du XML uniquement via yauzl)
  - [ ] Parse correctement ComicInfo.xml depuis un CBR (extraction selective via binaire unrar)
  - [ ] Gere l'absence de ComicInfo.xml (fallback : titre = nom du fichier sans extension)
  - [ ] Mappe les champs : Title, Series, Number, Writer, Penciller, Summary, Year, Publisher
  - [ ] Gere les ComicInfo.xml malformes (log warning, fallback)
  - [ ] Tests unitaires inclus
- **Fichiers cibles** :
  - `src/lib/services/metadata.ts` - creer
  - `src/types/comic-info.ts` - creer
  - `tests/services/metadata.test.ts` - creer
  - `tests/fixtures/sample-comicinfo.xml` - creer
- **Dependances** : Story 3.1, Story 3.2

#### Story 2.3 : Creer l'API Route de scan et le scan periodique
- **Taille** : M
- **Description** : API Route POST pour declencher un scan. Scan periodique via setInterval decouple. Scan au premier demarrage.
- **Criteres d'acceptation** :
  - [ ] `POST /api/library/scan` declenche un scan et retourne immediatement `{ status: "started" }` ou `{ status: "already_running" }`
  - [ ] `GET /api/library/scan/status` retourne l'etat du scan (idle/running + stats)
  - [ ] Scan automatique au premier demarrage de l'app
  - [ ] Scan periodique configurable via `SCAN_INTERVAL_MINUTES`
  - [ ] Le scan s'execute de maniere decouplee (pas de timeout HTTP)
  - [ ] Log du resultat du scan (series/comics ajoutes/supprimes)
- **Fichiers cibles** :
  - `src/app/api/library/scan/route.ts` - creer
  - `src/app/api/library/scan/status/route.ts` - creer
  - `src/lib/services/scan-scheduler.ts` - creer
- **Dependances** : Story 2.1, Story 2.2

---

### Epic 3 : Extraction de comics

#### Story 3.1 : Implementer l'extraction des pages CBZ
- **Taille** : M
- **Description** : Extraire les images d'un fichier CBZ (archive ZIP) en streaming via `yauzl`. Interface commune `ComicExtractor` pour tous les extracteurs.
- **Criteres d'acceptation** :
  - [ ] Interface `ComicExtractor` definie : `getPageCount()`, `getPage(n)`, `getPageList()`, `close()`
  - [ ] Extrait les images d'un CBZ sans decompresser tout en memoire (streaming yauzl)
  - [ ] Tri naturel des noms de fichiers (page1, page2... page10)
  - [ ] Supporte jpg, png, webp dans l'archive
  - [ ] Ignore les fichiers non-image (thumbs.db, .DS_Store, xml, __MACOSX)
  - [ ] Tests unitaires inclus
- **Fichiers cibles** :
  - `src/lib/services/extractors/types.ts` - creer (interface ComicExtractor)
  - `src/lib/services/extractors/cbz.ts` - creer
  - `src/lib/services/extractors/utils.ts` - creer (tri naturel, filtrage)
  - `tests/services/extractors/cbz.test.ts` - creer
  - `tests/fixtures/test.cbz` - creer
- **Dependances** : Story 1.1

#### Story 3.2 : Implementer l'extraction des pages CBR via binaire unrar
- **Taille** : M
- **Description** : Extraire les images d'un fichier CBR en appelant le binaire `unrar` en subprocess. Extraction page par page dans un dossier temporaire. Meme interface `ComicExtractor`.
- **Criteres d'acceptation** :
  - [ ] Utilise le binaire `unrar` (installe dans le Dockerfile) en subprocess securise
  - [ ] Extrait une page a la fois dans un dossier temp (pas tout en memoire)
  - [ ] Gere les archives RAR4 et RAR5
  - [ ] Nettoie le dossier temp apres usage
  - [ ] Retourne une erreur claire si `unrar` n'est pas installe
  - [ ] Meme interface `ComicExtractor` que CBZ
  - [ ] Tests unitaires inclus (avec mock du binaire pour CI)
- **Fichiers cibles** :
  - `src/lib/services/extractors/cbr.ts` - creer
  - `tests/services/extractors/cbr.test.ts` - creer
- **Dependances** : Story 3.1 (interface commune)

#### Story 3.3 : Implementer le support des dossiers d'images
- **Taille** : S
- **Description** : Lire les images directement depuis un dossier. Tri naturel. Meme interface `ComicExtractor`.
- **Criteres d'acceptation** :
  - [ ] Liste les images d'un dossier (jpg, png, webp)
  - [ ] Tri naturel des noms de fichiers
  - [ ] Ignore les sous-dossiers
  - [ ] Meme interface `ComicExtractor`
  - [ ] Tests unitaires inclus
- **Fichiers cibles** :
  - `src/lib/services/extractors/folder.ts` - creer
  - `tests/services/extractors/folder.test.ts` - creer
- **Dependances** : Story 3.1 (interface commune)

#### Story 3.4 : Creer la factory d'extracteurs et les API Routes de pages
- **Taille** : M
- **Description** : Factory qui choisit le bon extracteur selon le type de comic. API Routes pour servir les pages avec streaming et cache.
- **Criteres d'acceptation** :
  - [ ] Factory `getExtractor(comic)` retourne le bon extracteur selon le format
  - [ ] `GET /api/comics/[id]/pages` retourne la liste des pages (nombre)
  - [ ] `GET /api/comics/[id]/pages/[page]` retourne l'image streamee
  - [ ] Headers `Cache-Control: public, max-age=31536000, immutable` sur les pages
  - [ ] Content-Type correct selon le format de l'image
  - [ ] 404 si comic ou page introuvable, 500 si erreur d'extraction
- **Fichiers cibles** :
  - `src/lib/services/extractors/factory.ts` - creer
  - `src/app/api/comics/[id]/pages/route.ts` - creer
  - `src/app/api/comics/[id]/pages/[page]/route.ts` - creer
- **Dependances** : Story 3.1, Story 3.2, Story 3.3, Story 1.2

---

### Epic 4 : Thumbnails

#### Story 4.1 : Implementer la generation et le cache de thumbnails
- **Taille** : M
- **Description** : Generer des thumbnails via sharp depuis la premiere page de chaque comic. Thumbnail de serie = couverture du premier volume. Concurrence limitee.
- **Criteres d'acceptation** :
  - [ ] Genere un thumbnail (300px de large, webp, qualite 80) depuis la premiere page
  - [ ] Stocke dans `data/thumbnails/{comic-id}.webp`
  - [ ] Thumbnail de serie = thumbnail du premier volume (par numero)
  - [ ] Ne regenere pas si le thumbnail existe et le fichier source n'a pas change
  - [ ] Generation en batch avec concurrence limitee (2 thumbnails simultanes max)
  - [ ] Gere les erreurs d'extraction gracieusement (placeholder generique)
  - [ ] Verification : `sharp` fonctionne sur ARM64
  - [ ] Tests unitaires inclus
- **Fichiers cibles** :
  - `src/lib/services/thumbnails.ts` - creer
  - `tests/services/thumbnails.test.ts` - creer
- **Dependances** : Story 3.1, Story 3.2, Story 3.3

#### Story 4.2 : Creer l'API Route des thumbnails
- **Taille** : S
- **Description** : Servir les thumbnails. Generation a la volee si absent. Routes pour comics et series.
- **Criteres d'acceptation** :
  - [ ] `GET /api/comics/[id]/thumbnail` retourne le thumbnail du comic
  - [ ] `GET /api/library/series/[id]/thumbnail` retourne le thumbnail de la serie
  - [ ] Genere a la volee si le thumbnail n'existe pas (puis le cache)
  - [ ] Headers `Cache-Control: public, max-age=86400`
  - [ ] Retourne une image placeholder SVG si erreur
- **Fichiers cibles** :
  - `src/app/api/comics/[id]/thumbnail/route.ts` - creer
  - `src/app/api/library/series/[id]/thumbnail/route.ts` - creer
  - `public/placeholder-cover.svg` - creer
- **Dependances** : Story 4.1

---

### Epic 5 : Interface bibliotheque

#### Story 5.1 : Creer le layout principal et la navigation
- **Taille** : M
- **Description** : Layout racine avec header, navigation, et structure responsive. Theme sombre par defaut. Textes en francais.
- **Criteres d'acceptation** :
  - [ ] Layout responsive avec header fixe
  - [ ] Navigation : Accueil, Series, "En cours"
  - [ ] Theme sombre par defaut (variables CSS shadcn dark)
  - [ ] Textes en francais avec accents corrects
  - [ ] Meta tags PWA dans le layout (viewport, theme-color, apple-mobile-web-app)
  - [ ] Favicon + touch-icon
- **Fichiers cibles** :
  - `src/app/layout.tsx` - modifier
  - `src/app/globals.css` - creer
  - `src/components/layout/header.tsx` - creer
  - `src/components/layout/nav.tsx` - creer
- **Patterns** : `~/evan-workflow/technos/nextjs/patterns/component.md`
- **Dependances** : Story 1.1

#### Story 5.2 : Implementer la grille de series
- **Taille** : M
- **Description** : Page listant toutes les series en grille responsive.
- **Criteres d'acceptation** :
  - [ ] Grille responsive (2 colonnes mobile, 3 tablette, 4-6 desktop)
  - [ ] Carte avec thumbnail (aspect-ratio 2:3), titre, nombre de volumes
  - [ ] Indicateur de progression de lecture par serie (badge)
  - [ ] Chargement lazy des thumbnails (loading="lazy")
  - [ ] Etat vide si aucune serie ("Aucune serie trouvee. Lancez un scan.")
  - [ ] Bouton de scan dans le header si bibliotheque vide
- **Fichiers cibles** :
  - `src/app/(library)/series/page.tsx` - creer
  - `src/components/library/series-grid.tsx` - creer
  - `src/components/library/series-card.tsx` - creer
  - `src/components/library/empty-state.tsx` - creer
- **Dependances** : Story 5.1, Story 4.2, Story 2.3, Story 7.1

#### Story 5.3 : Implementer la page de detail d'une serie
- **Taille** : M
- **Description** : Page de detail d'une serie avec metadonnees, volumes et progression.
- **Criteres d'acceptation** :
  - [ ] Affiche le titre, l'auteur, le resume de la serie
  - [ ] Liste des volumes avec thumbnails en grille (aspect-ratio 2:3)
  - [ ] Indicateur de progression par volume : non lu / en cours (page/total) / lu (check)
  - [ ] Bouton "Continuer la lecture" visible en haut
  - [ ] Tri par numero de volume (croissant)
  - [ ] Nombre total de pages et progression globale de la serie
- **Fichiers cibles** :
  - `src/app/(library)/series/[id]/page.tsx` - creer
  - `src/components/library/volume-grid.tsx` - creer
  - `src/components/library/volume-card.tsx` - creer
  - `src/components/library/series-header.tsx` - creer
- **Dependances** : Story 5.2, Story 7.1

#### Story 5.4 : Implementer la recherche et les filtres
- **Taille** : M
- **Description** : Barre de recherche globale et filtres par statut de lecture.
- **Criteres d'acceptation** :
  - [ ] Recherche par titre et auteur (LIKE SQLite, case-insensitive)
  - [ ] Filtre par statut : tous / non lus / en cours / lus
  - [ ] Resultats via URL query params (debounce 300ms)
  - [ ] Etat vide avec message si aucun resultat
  - [ ] La recherche fonctionne sur la page des series et la page de detail
- **Fichiers cibles** :
  - `src/components/library/search-bar.tsx` - creer
  - `src/components/library/filters.tsx` - creer
- **Dependances** : Story 5.2, Story 7.1

#### Story 5.5 : Implementer la page d'accueil
- **Taille** : M
- **Description** : Page d'accueil avec sections horizontales scrollables.
- **Criteres d'acceptation** :
  - [ ] Section "Continuer la lecture" avec les derniers comics en cours (max 10)
  - [ ] Section "Recemment ajoutes" avec les derniers comics scannes (max 10)
  - [ ] Lien "Voir tout" vers /series
  - [ ] Carrousel horizontal scrollable sur mobile (scroll-snap)
  - [ ] Stats de la bibliotheque (nombre de series, volumes, % lus)
  - [ ] Etat de premier lancement : message de bienvenue + bouton scan
- **Fichiers cibles** :
  - `src/app/page.tsx` - modifier
  - `src/components/library/continue-reading.tsx` - creer
  - `src/components/library/recent-additions.tsx` - creer
  - `src/components/library/horizontal-scroll.tsx` - creer
  - `src/components/library/library-stats.tsx` - creer
- **Dependances** : Story 5.1, Story 6.3, Story 7.1

---

### Epic 6 : Lecteur de comics

#### Story 6.1 : Implementer le lecteur de base (affichage page par page)
- **Taille** : L
- **Description** : Lecteur page par page avec navigation clavier/souris/tap. Preloading. Header auto-hide.
- **Criteres d'acceptation** :
  - [ ] Affiche une page a la fois, centree, adaptee a l'ecran (object-fit contain)
  - [ ] Navigation : fleches gauche/droite, touches clavier (ArrowLeft/Right, A/D), tap sur les bords (tiers gauche/droite)
  - [ ] Preloading de la page N+1 et N+2
  - [ ] Barre de progression en bas (slider cliquable)
  - [ ] Header auto-hide avec bouton retour, titre, page courante/total
  - [ ] Tap au centre = toggle header/controls
  - [ ] Fond noir (pas de flash blanc au changement de page)
- **Fichiers cibles** :
  - `src/app/(reader)/read/[id]/page.tsx` - creer
  - `src/components/reader/page-viewer.tsx` - creer
  - `src/components/reader/reader-controls.tsx` - creer
  - `src/components/reader/progress-bar.tsx` - creer
- **Dependances** : Story 3.4

#### Story 6.2 : Implementer les gestes tactiles (swipe, pinch-to-zoom)
- **Taille** : L
- **Description** : Gestes tactiles via `@use-gesture/react` + transformation CSS. Gestion des conflits entre gestes.
- **Criteres d'acceptation** :
  - [ ] Swipe gauche/droite pour changer de page (seuil > 50px, velocite > 0.3)
  - [ ] Pinch-to-zoom fluide (min 1x, max 4x) via CSS transform scale
  - [ ] Double-tap pour alterner entre zoom 1x et 2x (sur le point tape)
  - [ ] Pan quand zoome, contraint aux bords de l'image
  - [ ] Reset du zoom au changement de page
  - [ ] Le swipe est desactive quand le zoom > 1x (priorite au pan)
  - [ ] Animations via CSS transitions (pas de re-render React)
  - [ ] Tests manuels sur iPhone Safari
- **Fichiers cibles** :
  - `src/components/reader/touch-handler.tsx` - creer
  - `src/hooks/use-comic-gestures.ts` - creer
- **Dependances** : Story 6.1

#### Story 6.3 : Implementer le suivi de progression de lecture
- **Taille** : M
- **Description** : Sauvegarde automatique de la page courante. Reprise. Marquage lu.
- **Criteres d'acceptation** :
  - [ ] Sauvegarde automatique de la page courante (debounce 2s, Server Action)
  - [ ] Reprise a la derniere page lue a l'ouverture
  - [ ] Marquage automatique "lu" a la derniere page
  - [ ] Possibilite de marquer manuellement comme lu/non lu (depuis la page serie)
  - [ ] `GET /api/comics/[id]/progress` — progression actuelle
  - [ ] `PUT /api/comics/[id]/progress` — sauvegarder la progression
  - [ ] Tests unitaires du service
- **Fichiers cibles** :
  - `src/lib/services/progress.ts` - creer
  - `src/app/api/comics/[id]/progress/route.ts` - creer
  - `tests/services/progress.test.ts` - creer
- **Dependances** : Story 1.2, Story 6.1

#### Story 6.4 : Implementer la navigation inter-volumes
- **Taille** : S
- **Description** : A la fin d'un comic, proposer de passer au volume suivant. Transition fluide.
- **Criteres d'acceptation** :
  - [ ] A la derniere page, overlay "Volume termine" avec bouton "Volume suivant" (si disponible)
  - [ ] Affiche le titre et le thumbnail du volume suivant
  - [ ] Si pas de volume suivant, "Serie terminee" avec bouton retour
  - [ ] Le volume courant est marque comme lu automatiquement
  - [ ] Swipe vers la droite a la derniere page declenche aussi la navigation
- **Fichiers cibles** :
  - `src/components/reader/volume-end-overlay.tsx` - creer
- **Dependances** : Story 6.1, Story 6.3, Story 7.1

#### Story 6.5 : Implementer le mode de lecture vertical (webtoon)
- **Taille** : M
- **Description** : Defilement vertical continu pour les webtoons. Chargement lazy. Persistance du choix.
- **Criteres d'acceptation** :
  - [ ] Defilement vertical avec toutes les pages empilees
  - [ ] Chargement lazy (IntersectionObserver, 3 pages autour de la vue)
  - [ ] Barre de progression reflète la position de scroll
  - [ ] Persistance du mode choisi par serie (localStorage)
  - [ ] Bouton toggle entre mode page et mode vertical
- **Fichiers cibles** :
  - `src/components/reader/vertical-reader.tsx` - creer
  - `src/components/reader/reading-mode-toggle.tsx` - creer
- **Dependances** : Story 6.1, Story 6.2

#### Story 6.6 : Implementer le mode double page et le sens de lecture
- **Taille** : M
- **Description** : Double page pour desktop. Sens de lecture configurable LTR/RTL.
- **Criteres d'acceptation** :
  - [ ] Mode double page (desktop uniquement, auto-desactive < 1024px)
  - [ ] Premiere page (couverture) affichee seule
  - [ ] Sens de lecture : gauche-a-droite (defaut) ou droite-a-gauche (manga)
  - [ ] En RTL, le swipe et le tap sont inverses
  - [ ] Persistance du sens de lecture par serie (localStorage)
- **Fichiers cibles** :
  - `src/components/reader/double-page-reader.tsx` - creer
  - `src/components/reader/reading-direction-toggle.tsx` - creer
- **Dependances** : Story 6.1, Story 6.2

---

### Epic 7 : API bibliotheque

#### Story 7.1 : Implementer les API Routes de la bibliotheque
- **Taille** : M
- **Description** : API Routes CRUD. Pagination, tri, filtrage, recherche. Index SQLite.
- **Criteres d'acceptation** :
  - [ ] `GET /api/library/series` — liste paginee (defaut 20/page)
  - [ ] `GET /api/library/series/[id]` — details + volumes
  - [ ] `GET /api/comics/[id]` — details d'un comic
  - [ ] Pagination (`page`, `limit`)
  - [ ] Tri (`sort=title|added_at|last_read`, `order=asc|desc`)
  - [ ] Filtre (`status=unread|reading|read`)
  - [ ] Recherche (`q=texte` sur titre + auteur)
  - [ ] Index SQLite sur les colonnes de tri/filtre
- **Fichiers cibles** :
  - `src/app/api/library/series/route.ts` - creer
  - `src/app/api/library/series/[id]/route.ts` - creer
  - `src/app/api/comics/[id]/route.ts` - creer
- **Dependances** : Story 1.2

---

### Epic 8 : OPDS

#### Story 8.1 : Implementer le service de generation OPDS
- **Taille** : M
- **Description** : Service generant des documents Atom/XML conformes a OPDS 1.2.
- **Criteres d'acceptation** :
  - [ ] Genere un catalogue de navigation OPDS valide (Atom/XML)
  - [ ] Genere un catalogue d'acquisition avec metadonnees
  - [ ] Liens de telechargement des fichiers originaux
  - [ ] Liens vers les thumbnails
  - [ ] Pagination OPDS (rel="next")
  - [ ] XML bien forme et valide
  - [ ] Tests unitaires (validation XML)
- **Fichiers cibles** :
  - `src/lib/services/opds.ts` - creer
  - `src/types/opds.ts` - creer
  - `tests/services/opds.test.ts` - creer
- **Dependances** : Story 7.1

#### Story 8.2 : Creer les API Routes OPDS
- **Taille** : S
- **Description** : Routes HTTP servant les flux OPDS + telechargement des fichiers originaux.
- **Criteres d'acceptation** :
  - [ ] `GET /api/opds` — catalogue racine
  - [ ] `GET /api/opds/series` — liste des series
  - [ ] `GET /api/opds/series/[id]` — volumes d'une serie
  - [ ] `GET /api/opds/download/[id]` — telechargement du fichier original
  - [ ] Content-Type `application/atom+xml; charset=utf-8`
  - [ ] Fonctionne avec Panels (iOS) et Chunky Reader
- **Fichiers cibles** :
  - `src/app/api/opds/route.ts` - creer
  - `src/app/api/opds/series/route.ts` - creer
  - `src/app/api/opds/series/[id]/route.ts` - creer
  - `src/app/api/opds/download/[id]/route.ts` - creer
- **Dependances** : Story 8.1, Story 4.2

---

### Epic 9 : PWA et mode offline

#### Story 9.1 : Configurer le manifest PWA et le service worker
- **Taille** : M
- **Description** : Manifest PWA + service worker via serwist. Cache des assets statiques.
- **Criteres d'acceptation** :
  - [ ] Manifest avec icones (192, 512, maskable), couleurs, display standalone
  - [ ] Installable sur iPhone et Android
  - [ ] Splash screen configure (Apple touch startup image)
  - [ ] Service worker via serwist : cache des assets statiques (JS, CSS, fonts)
  - [ ] Mode standalone (pas de barre de navigateur)
  - [ ] Les API Routes ne sont PAS cachees par le service worker
- **Fichiers cibles** :
  - `public/manifest.json` - modifier
  - `public/icons/` - ajouter icones
  - `src/app/layout.tsx` - modifier (meta tags PWA)
  - `next.config.ts` - modifier (config serwist)
  - `src/sw.ts` - creer (service worker)
- **Dependances** : Story 5.1

#### Story 9.2 : Implementer le telechargement offline de comics
- **Taille** : L
- **Description** : Telecharger un comic pour lecture offline via IndexedDB. Resolution reduite pour respecter les limites iOS.
- **Criteres d'acceptation** :
  - [ ] Bouton "Telecharger" sur la page detail serie (par volume)
  - [ ] Pages en resolution reduite (800px, webp qualite 70) dans IndexedDB
  - [ ] Barre de progression du telechargement
  - [ ] Badge "Hors ligne" sur les comics telecharges
  - [ ] Le lecteur sert depuis IndexedDB si offline
  - [ ] Page "Mes telechargements" : liste, espace utilise, bouton supprimer
  - [ ] Avertissement si espace > 40 Mo (limite iOS)
- **Fichiers cibles** :
  - `src/lib/services/offline-storage.ts` - creer
  - `src/components/library/offline-button.tsx` - creer
  - `src/components/library/offline-badge.tsx` - creer
  - `src/app/(library)/downloads/page.tsx` - creer
  - `src/hooks/use-offline-comic.ts` - creer
- **Dependances** : Story 9.1, Story 6.1

---

### Epic 10 : Vitest setup

#### Story 10.1 : Configurer Vitest avec le projet
- **Taille** : S
- **Description** : Setup Vitest. Les tests des services sont co-localises dans chaque story.
- **Criteres d'acceptation** :
  - [ ] `vitest.config.ts` configure avec path alias `@/`
  - [ ] `pnpm test` et `pnpm test:watch` fonctionnent
  - [ ] Dossier `tests/fixtures/` avec un CBZ et un ComicInfo.xml de test
  - [ ] Script CI-ready (`pnpm test:ci` avec coverage)
- **Fichiers cibles** :
  - `vitest.config.ts` - creer
  - `tests/setup.ts` - creer
  - `tests/fixtures/` - creer
- **Dependances** : Story 1.1

---

## Ordre d'implementation

### Phase 1 — Fondations (stories 1-4)
1. Story 1.1 - Initialiser le projet Next.js
2. Story 1.2 - Configurer Drizzle ORM avec SQLite
3. Story 1.4 - Configuration de l'application
4. Story 10.1 - Configurer Vitest

### Phase 2 — Backend core (stories 5-13)
5. Story 3.1 - Extraction CBZ
6. Story 3.2 - Extraction CBR
7. Story 3.3 - Extraction dossiers d'images
8. Story 2.1 - Scan de la bibliotheque
9. Story 2.2 - Extraction metadonnees
10. Story 7.1 - API Routes bibliotheque
11. Story 3.4 - Factory extracteurs + API Routes pages
12. Story 4.1 - Generation thumbnails
13. Story 4.2 - API Route thumbnails

### Phase 3 — Interface (stories 14-18)
14. Story 5.1 - Layout et navigation
15. Story 5.2 - Grille de series
16. Story 5.3 - Detail serie
17. Story 5.4 - Recherche et filtres
18. Story 2.3 - API Route scan + scan periodique

### Phase 4 — Lecteur (stories 19-24)
19. Story 6.1 - Lecteur de base
20. Story 6.2 - Gestes tactiles
21. Story 6.3 - Suivi de progression
22. Story 6.4 - Navigation inter-volumes
23. Story 6.5 - Mode vertical (webtoon)
24. Story 6.6 - Mode double page + sens de lecture

### Phase 5 — Page d'accueil + Docker (stories 25-26)
25. Story 5.5 - Page d'accueil
26. Story 1.3 - Docker multi-arch + healthcheck

### Phase 6 — OPDS + PWA (stories 27-30)
27. Story 8.1 - Service OPDS
28. Story 8.2 - Routes OPDS
29. Story 9.1 - PWA manifest + service worker
30. Story 9.2 - Telechargement offline

## Risques identifies

| Risque | Impact | Mitigation |
|--------|--------|------------|
| `better-sqlite3` + `sharp` compilation ARM64 dans Docker | Eleve | Tester la compilation ARM dans Story 1.2 et 1.3 en priorite. Fallback : `libsql` (pur JS) ou `@img/sharp-linux-arm64` (pre-built) |
| Binaire `unrar` absent ou incompatible ARM | Moyen | Package `unrar-free` disponible dans les repos Debian ARM. Tester dans Story 1.3 |
| Memoire > 100 Mo avec gros CBR | Moyen | Extraction via binaire sur disque, pas en memoire. Limiter la concurrence a 1 |
| Serwist + Next.js App Router (compatibilite) | Moyen | Tester tot (Story 9.1). Alternative : workbox |
| IndexedDB limite sur iOS Safari (~50 Mo) | Moyen | Resolution reduite (800px) pour le cache offline. Avertissement utilisateur |
| Oracle Cloud Free Tier CPU faible | Moyen | Batch thumbnails avec concurrence 2 |
| OPDS : compatibilite Panels/Chunky | Faible | Tester avec les deux clients |

## Estimations

| Epic | Stories | Effort estime |
|------|---------|---------------|
| Epic 1 : Fondations | 4 | S:1, M:3, L:0 |
| Epic 2 : Scan bibliotheque | 3 | S:0, M:2, L:1 |
| Epic 3 : Extraction comics | 4 | S:1, M:3, L:0 |
| Epic 4 : Thumbnails | 2 | S:1, M:1, L:0 |
| Epic 5 : Interface bibliotheque | 5 | S:0, M:5, L:0 |
| Epic 6 : Lecteur de comics | 6 | S:1, M:3, L:2 |
| Epic 7 : API bibliotheque | 1 | S:0, M:1, L:0 |
| Epic 8 : OPDS | 2 | S:1, M:1, L:0 |
| Epic 9 : PWA et offline | 2 | S:0, M:1, L:1 |
| Epic 10 : Vitest setup | 1 | S:1, M:0, L:0 |
| **Total** | **30** | **S:6, M:20, L:4** |

---

## Changelog v1 → v2

| Changement | Raison |
|------------|--------|
| **PDF reporte en v2** | Rendu PDF serveur trop complexe sur ARM (node-canvas + Cairo). Decision D7. |
| **CBR : binaire `unrar` au lieu de WASM** | `node-unrar-js` charge tout en memoire, incompatible objectif < 100 Mo. |
| **Story 1.4 ajoutee (Configuration)** | Chemin comics hardcode dans v1, doit etre configurable via env. |
| **Story 1.3 : Docker multi-arch + healthcheck** | ARM64 manquant, healthcheck manquant pour Coolify. |
| **Story 2.1 : mutex + gestion corruption** | Pas de protection contre les scans simultanes dans v1. |
| **Story 2.3 : scan periodique ajoute** | Pas de detection auto des nouveaux comics de Kapowarr dans v1. |
| **Story 6.4 originale eclatee en 6.4 + 6.5 + 6.6** | Story trop grosse : 3 paradigmes dans une story. |
| **Story 6.4 (Navigation inter-volumes) ajoutee** | Feature Komga manquante dans v1. |
| **Story 8.1 eclatee en 8.1 + 8.2** | Service XML + Routes dans une story = XL deguise. |
| **Story 10.1 reduite a setup seul** | Tests integres dans chaque story de service. |
| **Thumbnails de series definis** | Logique manquante dans v1 (couverture du 1er volume). |
| **Offline : resolution reduite** | Limites IndexedDB iOS non adressees dans v1. |
| **Phases d'implementation** | Ordre reorganise en 6 phases logiques. |
