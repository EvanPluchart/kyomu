---
id: "7.1"
title: "Implementer les API Routes de la bibliotheque"
status: todo
size: M
depends_on: ["1.2"]
epic: "API bibliotheque"
---

# Implementer les API Routes de la bibliotheque

## Contexte
L'interface et les clients OPDS ont besoin d'endpoints pour lister les series, les volumes et les details des comics.

## Objectif
Exposer des API Routes REST avec pagination, tri, filtrage et recherche.

## Criteres d'acceptation
- [ ] `GET /api/library/series` — liste paginee (defaut 20/page)
- [ ] `GET /api/library/series/[id]` — details + volumes
- [ ] `GET /api/comics/[id]` — details d'un comic
- [ ] Pagination (`page`, `limit`)
- [ ] Tri (`sort=title|added_at|last_read`, `order=asc|desc`)
- [ ] Filtre (`status=unread|reading|read`)
- [ ] Recherche (`q=texte` sur titre + auteur)
- [ ] Index SQLite sur les colonnes de tri/filtre

## Fichiers cibles
- `src/app/api/library/series/route.ts` - creer - liste des series
- `src/app/api/library/series/[id]/route.ts` - creer - detail serie
- `src/app/api/comics/[id]/route.ts` - creer - detail comic

## Notes d'implementation
- **Pagination** : `LIMIT` + `OFFSET` en SQL. Retourner `{ data: [...], total: N, page: N, limit: N }`
- **Recherche** : `WHERE title LIKE '%query%' OR author LIKE '%query%'` — SQLite est case-insensitive pour ASCII, utiliser `COLLATE NOCASE`
- **Filtre par statut** : JOIN avec `reading_progress`. `unread` = pas de ligne ou `status = 'unread'`, `reading` = `status = 'reading'`, `read` = `status = 'read'`
- **Index** : `CREATE INDEX idx_comics_series_id ON comics(series_id)`, `CREATE INDEX idx_comics_title ON comics(title)`, etc. Les ajouter dans le schema Drizzle.
- **Detail serie** : inclure la liste des volumes avec leur progression individuelle

## Tests attendus
- [ ] Liste des series paginee
- [ ] Recherche par titre retourne les bons resultats
- [ ] Filtre par statut fonctionne
- [ ] Detail serie inclut les volumes
