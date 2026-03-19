# Kyomu — CLAUDE.md

> Ce fichier est le point d'entree pour l'IA. Il reference les conventions du projet et les docs evan-workflow pertinentes.

## Projet

- **Nom** : Kyomu (虚無)
- **Description** : Lecteur de comics/manga self-hosted leger et moderne, alternative a Komga — PWA installable
- **Stack** : Next.js + Tailwind CSS + shadcn/ui + SQLite + Drizzle ORM + Vitest
- **Repo** : repo unique
- **Hebergement** : Oracle Cloud Free Tier (Coolify)

## Structure

```
src/
  app/                    # App Router Next.js
    layout.tsx            # Layout racine + PWA manifest
    page.tsx              # Page d'accueil (bibliotheque)
    api/                  # API Routes
      library/            # Scan, liste, recherche
      comics/             # Lecture, progression, metadonnees
    (reader)/             # Groupe route lecteur
      read/[id]/page.tsx  # Lecteur de comics
    (library)/            # Groupe route bibliotheque
      series/page.tsx     # Liste des series
      series/[id]/page.tsx
  components/             # Composants React
    ui/                   # Composants shadcn/ui
    reader/               # Composants lecteur (pages, zoom, navigation)
    library/              # Composants bibliotheque (grilles, filtres)
  lib/                    # Logique metier
    db/                   # Schema Drizzle + connexion
    services/             # Services (scan, extraction, metadonnees)
    utils/                # Utilitaires
  types/                  # Types TypeScript
public/
  manifest.json           # PWA manifest
  icons/                  # Icones PWA
data/                     # Base SQLite + cache (volume Docker)
drizzle/                  # Migrations Drizzle
tests/                    # Tests Vitest
```

## Conventions

### Communes (evan-workflow)

- Git : `~/evan-workflow/common/git-conventions.md`
- Style : `~/evan-workflow/common/code-style-rules.md`
- Nommage : `~/evan-workflow/common/naming-conventions.md`
- Francais : `~/evan-workflow/common/french-content.md` — **Tous les textes visibles par l'utilisateur doivent etre en francais avec accents corrects**

### Stack-specifiques (evan-workflow)

### Frontend (Next.js)
- Index : `~/evan-workflow/technos/nextjs/index.md`
- Code style : `~/evan-workflow/technos/nextjs/code-style.md`
- Patterns : `~/evan-workflow/technos/nextjs/patterns/`
- Libs : `~/evan-workflow/technos/nextjs/libs/`

### Styling (Tailwind CSS + shadcn/ui)
- Tailwind : `~/evan-workflow/technos/tailwindcss/index.md` (placeholder)
- shadcn/ui : `~/evan-workflow/technos/shadcnui/index.md` (placeholder)

### ORM (Drizzle)
- Index : `~/evan-workflow/technos/drizzle/index.md` (placeholder)

<!-- SQLite : pas encore documente dans evan-workflow.
     Lancer /evan-workflow-builder --add-stack sqlite pour ajouter la documentation. -->

<!-- Vitest : pas encore documente dans evan-workflow.
     Lancer /evan-workflow-builder --add-stack vitest pour ajouter la documentation. -->

## Contexte projet

### Branches

- **Production** : `main`
- **Developpement** : `develop`
- **Format** : `type/description-courte`
- **Commits** : `Type - Description`

Types : `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`

### Points d'attention

- Support des formats : CBZ, CBR, PDF, images (jpg/png/webp)
- Extraction des images en streaming (pas tout en memoire)
- Cache des thumbnails pour la performance
- Volume Docker `/app/data` pour la DB + cache (persistance Coolify)
- PWA : manifest, service worker, mode offline pour les comics telecharges
- Interface tactile-first pour la lecture sur mobile (swipe, pinch-to-zoom)
- Objectif memoire : < 100 Mo RAM au repos (vs 465 Mo Komga)

## Documentation

- `docs/features/` — Documentation des features (generee par /feature-doc)
- `docs/features/README.md` — Index des domaines documentes

## Skills recommandes

Les skills evan-workflow sont installes dans `.claude/skills/`.

### Workflow de sprint

```
/feature-planner → /sprint-planner → /dev-story (batch/parallel)
                                    → /sprint-status (suivi)
                                    → /sprint-retro (bilan)
```

### Outils rapides

- `/quick-dev` — Fix/feature rapide
- `/code-review` — Analyse de code
- `/fix-review-code` — Correction auto des problemes
