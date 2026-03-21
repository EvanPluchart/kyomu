# 虚 Kyomu

> Lecteur de comics self-hosted léger et moderne — Alternative à Komga

Kyomu (虚無, "le vide") est un lecteur de comics, manga et webtoons self-hosted conçu pour être léger, rapide et visuellement soigné.

## Fonctionnalités

- 📚 **Bibliothèque** — Scan automatique de votre collection (CBZ, CBR, PDF, dossiers d'images)
- 📖 **Lecteur** — Page par page, défilement vertical (webtoon), double page
- 🎯 **Gestes tactiles** — Swipe, pinch-to-zoom, double-tap (PWA installable)
- 🔍 **Découverte** — Catalogue ComicVine avec recherche et catégories (style Seerr)
- ⬇️ **Téléchargement** — Intégration Kapowarr + Mylar3 pour le téléchargement automatique
- 📊 **Progression** — Suivi de lecture, reprise automatique, navigation inter-volumes
- 🏷️ **Tags** — Organisez vos séries avec des tags personnalisés
- 🌓 **Thèmes** — Mode clair/sombre + couleur d'accent personnalisable
- 📡 **OPDS** — Compatible avec les clients externes (Panels, Chunky Reader)
- 🔌 **API REST** — Complète pour l'intégration avec d'autres services

## Installation

### Docker Compose (recommandé)

```yaml
services:
  kyomu:
    build: https://github.com/EvanPluchart/kyomu.git
    ports:
      - "3000:3000"
    volumes:
      - kyomu-data:/app/data
      - /path/to/comics:/comics:ro
    environment:
      - COMICS_PATH=/comics
      - DATABASE_PATH=/app/data/kyomu.db
    restart: unless-stopped

volumes:
  kyomu-data:
```

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `COMICS_PATH` | Chemin des comics | `/mnt/media/comics` |
| `DATABASE_PATH` | Chemin de la base SQLite | `./data/kyomu.db` |
| `SCAN_INTERVAL_MINUTES` | Intervalle de scan auto | `60` |
| `COMICVINE_API_KEY` | Clé API ComicVine (optionnel) | — |
| `KAPOWARR_API_KEY` | Clé API Kapowarr (optionnel) | — |
| `KAPOWARR_INTERNAL_URL` | URL interne Kapowarr | `http://localhost:5656` |
| `MYLAR3_API_KEY` | Clé API Mylar3 (optionnel) | — |
| `MYLAR3_INTERNAL_URL` | URL interne Mylar3 | `http://localhost:8090` |

### Formats supportés

- **CBZ** (Comic Book Zip) — streaming natif
- **CBR** (Comic Book RAR) — via `unrar-free`
- **PDF** — via `poppler-utils` (pdftoppm)
- **Dossiers d'images** (jpg, png, webp)

## Stack technique

- [Next.js 16](https://nextjs.org/) — App Router, Server Components
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + SQLite (better-sqlite3)
- [Vitest](https://vitest.dev/) — Tests unitaires

## Développement

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

## Licence

MIT
