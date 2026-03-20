---
id: "1.3"
title: "Configurer Docker multi-arch avec healthcheck"
status: todo
size: M
depends_on: ["1.1"]
epic: "Fondations"
---

# Configurer Docker multi-arch avec healthcheck

## Contexte
Kyomu sera deploye via Coolify sur Oracle Cloud Free Tier (ARM Ampere). Le Dockerfile doit supporter AMD64 et ARM64, installer les dependances systeme (unrar, sharp), et fournir un healthcheck pour le monitoring.

## Objectif
Avoir une image Docker fonctionnelle, optimisee et multi-arch, prete pour le deploiement Coolify.

## Criteres d'acceptation
- [ ] `docker build` reussit sur AMD64 et ARM64
- [ ] `docker compose up` lance l'app accessible sur le port 3000
- [ ] Le volume `data/` est persiste entre les redemarrages
- [ ] Le dossier comics est monte en lecture seule (chemin configurable via env)
- [ ] `unrar` installe et fonctionnel dans le container
- [ ] `sharp` compile correctement sur ARM64
- [ ] Healthcheck sur `/api/health` (status 200)
- [ ] Image finale < 250 Mo
- [ ] Variable d'env `COMICS_PATH` pour le chemin de la bibliotheque

## Fichiers cibles
- `Dockerfile` - creer - multi-stage build (deps, build, runtime)
- `docker-compose.yml` - creer - service app + volumes
- `.dockerignore` - creer - exclure node_modules, .git, data
- `src/app/api/health/route.ts` - creer - endpoint healthcheck

## Notes d'implementation
- **Dockerfile multi-stage** :
  1. `deps` : `node:20-slim`, install pnpm, copy package.json, `pnpm install --frozen-lockfile`
  2. `build` : copy source, `pnpm build`
  3. `runtime` : `node:20-slim`, copy standalone output + static + public, install `unrar-free`
- `sharp` : utiliser `@img/sharp-linux-arm64` pre-built pour eviter la compilation
- **docker-compose.yml** : monter `./data:/app/data` et `${COMICS_PATH}:/comics:ro`
- **Healthcheck** : `GET /api/health` retourne `{ status: "ok", version: "..." }`
- Ajouter `HEALTHCHECK --interval=30s CMD curl -f http://localhost:3000/api/health || exit 1`
- **Ordre** : cette story est en phase 5, apres que le backend et l'UI soient fonctionnels

## Tests attendus
- [ ] `docker build .` reussit
- [ ] `docker compose up` demarre l'app
- [ ] `curl localhost:3000/api/health` retourne 200
- [ ] L'app a acces en lecture seule au dossier comics monte
