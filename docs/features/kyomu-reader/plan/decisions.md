# Decisions — Kyomu

> Log des decisions prises lors de la planification

## Plan v1 — 2026-03-19

### D1 : Pas de RTK Query, utiliser Server Components + Server Actions
- **Contexte** : evan-workflow documente RTK Query comme pattern de data fetching
- **Decision** : Kyomu est une app simple (un seul utilisateur), les Server Components de Next.js suffisent. Pas besoin de Redux.
- **Raison** : Moins de complexite, moins de JS client, meilleure performance, coherent avec l'objectif < 100 Mo RAM.

### D2 : shadcn/ui au lieu de Chakra UI
- **Contexte** : evan-workflow documente Chakra UI v2/v3
- **Decision** : Utiliser shadcn/ui + Tailwind comme specifie dans le CLAUDE.md du projet
- **Raison** : shadcn/ui est plus leger (pas de runtime CSS-in-JS), copie du code source (pas de dependance), meilleur pour la performance.

### D3 : Pas de gestion multi-utilisateurs
- **Contexte** : Komga supporte plusieurs utilisateurs
- **Decision** : Kyomu est pour un seul utilisateur, pas d'authentification
- **Raison** : Simplifie enormement l'architecture, reduit le code et la surface d'attaque.

### D4 : Streaming obligatoire pour l'extraction
- **Contexte** : Objectif memoire < 100 Mo RAM
- **Decision** : Tous les extracteurs doivent travailler en streaming, pas de chargement complet en memoire
- **Raison** : Un CBZ/CBR peut faire plusieurs centaines de Mo. Sans streaming, un seul comic saturerait la memoire.

### D5 : Thumbnails en WebP
- **Contexte** : Choix du format de thumbnail
- **Decision** : WebP a 300px de large
- **Raison** : WebP offre un bon ratio qualite/taille, supporte par tous les navigateurs modernes. 300px suffisant pour les grilles.

### D6 : OPDS 1.2 minimal
- **Contexte** : La spec OPDS est vaste (search, facets, authentication)
- **Decision** : Implementer OPDS 1.2 avec navigation + acquisition basique, sans search ni facets
- **Raison** : Couvre les besoins des clients Panels/Chunky. Les features avancees pourront etre ajoutees iterativement.

## Plan v2 — 2026-03-19 (post-review adversariale)

### D7 : Reporter le support PDF en v2
- **Contexte** : Le rendu PDF cote serveur Node.js necessite `node-canvas` + dependances systeme Cairo, ou ImageMagick. Sur ARM64 (Oracle Free Tier), c'est un risque majeur de compilation et de performance.
- **Decision** : Retirer le support PDF du scope v1. Le support sera ajoute dans une version future une fois le reste stable.
- **Raison** : Risque technique trop eleve pour le premier sprint. Les comics sont majoritairement en CBZ/CBR. Les PDF sont rares dans l'usage de Kapowarr.

### D8 : CBR via binaire `unrar` au lieu de lib WASM
- **Contexte** : `node-unrar-js` (seule lib Node.js pour RAR) charge l'archive complete en memoire via WASM. Un CBR de 500 Mo depasse l'objectif < 100 Mo RAM.
- **Decision** : Appeler le binaire `unrar` en subprocess securise, avec extraction page par page dans un dossier temporaire.
- **Raison** : L'extraction via binaire ecrit sur disque, pas en memoire. Le binaire `unrar-free` est disponible dans les repos Debian ARM.

### D9 : Configuration via variables d'environnement
- **Contexte** : Le plan v1 hardcodait `/mnt/media/comics`. L'utilisateur doit pouvoir changer le chemin sans rebuild Docker.
- **Decision** : `COMICS_PATH`, `SCAN_INTERVAL_MINUTES`, `DATABASE_PATH` configurables via env avec valeurs par defaut.
- **Raison** : Standard Docker, zero friction pour le deploiement Coolify.

### D10 : Scan periodique via setInterval
- **Contexte** : Kapowarr ajoute des comics automatiquement. Le plan v1 ne prevoyait pas de detection automatique.
- **Decision** : setInterval avec intervalle configurable (defaut 60 min) + scan au demarrage.
- **Raison** : Solution simple, sans dependance externe (pas de cron, pas de file watcher). Suffisant pour un seul utilisateur.

### D11 : Tests co-localises dans chaque story
- **Contexte** : Le plan v1 avait un epic tests fourre-tout (Story 10.1 = 5 suites de tests).
- **Decision** : Chaque story de service inclut ses propres tests unitaires. L'epic 10 se limite au setup Vitest.
- **Raison** : Meilleure atomicite des stories, les tests sont ecrits avec le contexte frais du code.

### D12 : Docker reporte en phase 5
- **Contexte** : Le plan v1 mettait Docker en 3eme position.
- **Decision** : Reporter le Dockerfile en phase 5 (apres backend + UI + lecteur).
- **Raison** : Permet de valider d'abord que `sharp` et `better-sqlite3` fonctionnent en dev local, puis de containeriser une app fonctionnelle. Evite les allers-retours Docker pendant le dev.
