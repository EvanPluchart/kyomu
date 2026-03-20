# Synthese executive — Kyomu

> Date : 2026-03-19
> Plan : v2 (final)

## Objectif

Remplacer Komga par un lecteur de comics self-hosted leger (< 100 Mo RAM), deploye sur Oracle Cloud Free Tier (ARM). Un seul utilisateur, pas d'authentification.

## Scope v1

- **Inclus** : CBZ, CBR, dossiers d'images, scan auto, metadonnees ComicInfo.xml, lecteur tactile-first, progression, thumbnails, recherche/filtres, OPDS, PWA + offline, Docker multi-arch
- **Exclus** : PDF (reporte — complexite ARM), multi-users, edition metadonnees

## Chiffres

| Metrique | Valeur |
|----------|--------|
| Epics | 10 |
| Stories | 30 |
| Taille S | 6 |
| Taille M | 20 |
| Taille L | 4 |
| Taille XL | 0 (toutes redecouppees) |
| Phases | 6 |

## Phases

| Phase | Contenu | Stories |
|-------|---------|--------|
| 1. Fondations | Next.js, Drizzle, config, Vitest | 4 |
| 2. Backend core | Extracteurs, scan, API, thumbnails | 9 |
| 3. Interface | Layout, grille series, detail, recherche, scan UI | 5 |
| 4. Lecteur | Page par page, gestes, progression, inter-volumes, vertical, double page | 6 |
| 5. Integration | Page d'accueil, Docker multi-arch | 2 |
| 6. Extensions | OPDS, PWA, offline | 4 |

## Decisions cles

1. **Pas de RTK Query** — Server Components + Server Actions suffisent
2. **shadcn/ui** — plus leger que Chakra UI, pas de runtime CSS-in-JS
3. **PDF reporte** — rendu serveur sur ARM trop complexe pour la v1
4. **CBR via binaire `unrar`** — la lib WASM charge tout en memoire
5. **Tests co-localises** — chaque story inclut ses tests
6. **Docker en phase 5** — valider le dev local avant de containeriser

## Risques principaux

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Compilation ARM (sharp, better-sqlite3) | Eleve | Tester tot, fallbacks identifies |
| Memoire > 100 Mo | Eleve | Streaming CBZ, extraction CBR sur disque, concurrence limitee |
| Serwist + Next.js App Router | Moyen | Alternative workbox identifiee |
| IndexedDB iOS (~50 Mo) | Moyen | Resolution reduite 800px pour offline |

## Prochaine etape

Lancer `/sprint-planner` pour decouper les 30 stories en sprints de 1-2 semaines.
