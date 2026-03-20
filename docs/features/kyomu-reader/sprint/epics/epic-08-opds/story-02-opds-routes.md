---
id: "8.2"
title: "Creer les API Routes OPDS"
status: todo
size: S
depends_on: ["8.1", "4.2"]
epic: "OPDS"
---

# Creer les API Routes OPDS

## Contexte
Les clients OPDS accedent au catalogue via des URLs HTTP. Il faut exposer les feeds generes par le service OPDS et une route de telechargement.

## Objectif
Exposer les routes HTTP OPDS avec le bon Content-Type et une route de telechargement des fichiers originaux.

## Criteres d'acceptation
- [ ] `GET /api/opds` — catalogue racine
- [ ] `GET /api/opds/series` — liste des series
- [ ] `GET /api/opds/series/[id]` — volumes d'une serie
- [ ] `GET /api/opds/download/[id]` — telechargement du fichier original
- [ ] Content-Type `application/atom+xml; charset=utf-8`
- [ ] Fonctionne avec Panels (iOS) et Chunky Reader

## Fichiers cibles
- `src/app/api/opds/route.ts` - creer - catalogue racine
- `src/app/api/opds/series/route.ts` - creer - liste series
- `src/app/api/opds/series/[id]/route.ts` - creer - volumes
- `src/app/api/opds/download/[id]/route.ts` - creer - telechargement fichier

## Notes d'implementation
- **Content-Type** : les routes OPDS doivent retourner `application/atom+xml; charset=utf-8`, pas `application/json`
- **Telechargement** : streamer le fichier original (CBZ/CBR) avec `fs.createReadStream` et le bon `Content-Disposition`
- **Chunky Reader** : peut avoir des comportements specifiques. Tester avec un vrai client.
- **Pas d'authentification** : un seul utilisateur, pas de protection des routes OPDS

## Tests attendus
- [ ] Les routes retournent du XML valide
- [ ] Le Content-Type est correct
- [ ] Le telechargement stream le fichier
