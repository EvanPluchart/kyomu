---
id: "1.2"
title: "Configurer Drizzle ORM avec SQLite"
status: todo
size: M
depends_on: ["1.1"]
epic: "Fondations"
---

# Configurer Drizzle ORM avec SQLite

## Contexte
Kyomu a besoin d'une base de donnees pour stocker les series, comics, progression de lecture et configuration. SQLite est ideal pour un usage mono-utilisateur : simple, performant, fichier unique facile a sauvegarder.

## Objectif
Avoir un schema de base de donnees fonctionnel avec Drizzle ORM, des migrations generees et une connexion operationnelle.

## Criteres d'acceptation
- [ ] Schema Drizzle compile sans erreur
- [ ] Tables : `series`, `comics`, `reading_progress`, `app_settings`
- [ ] Champs `file_path`, `file_size`, `file_mtime` sur la table `comics` (scan differentiel)
- [ ] Migration generee dans `drizzle/`
- [ ] Connexion DB fonctionne (fichier SQLite cree dans `data/`)
- [ ] Script de migration executable (`pnpm db:migrate`)
- [ ] Verification : `better-sqlite3` compile sur ARM64 (tester dans Docker)

## Fichiers cibles
- `src/lib/db/schema.ts` - creer - tables series, comics, reading_progress, app_settings
- `src/lib/db/index.ts` - creer - connexion singleton avec better-sqlite3
- `drizzle.config.ts` - creer - config Drizzle (driver, schema, out)
- `drizzle/0000_init.sql` - generer - premiere migration

## Patterns et references
- Pas de pattern evan-workflow pour Drizzle (placeholder)
- Documentation Drizzle : https://orm.drizzle.team/docs/get-started/sqlite-new

## Notes d'implementation
- **Schema `series`** : id, title, slug, description, author, publisher, year, thumbnail_path, comics_count, created_at, updated_at
- **Schema `comics`** : id, series_id (FK), title, number, file_path, file_size, file_mtime, format (cbz/cbr/folder), page_count, metadata_json, created_at, updated_at
- **Schema `reading_progress`** : id, comic_id (FK), current_page, total_pages, status (unread/reading/read), started_at, completed_at, updated_at
- **Schema `app_settings`** : key, value (pour stocker les preferences comme le mode de lecture par serie)
- Utiliser `better-sqlite3` pour le driver (synchrone, plus performant que `sql.js`)
- Connexion singleton : une seule instance de DB partagee dans tout le process
- Ajouter des index sur : `comics.series_id`, `comics.file_path`, `reading_progress.comic_id`
- **Risque ARM** : `better-sqlite3` necessite compilation native. Si probleme, fallback sur `libsql`

## Tests attendus
- [ ] `pnpm db:migrate` cree la base sans erreur
- [ ] Les tables existent apres migration
- [ ] Insert/Select basique fonctionne
