---
id: "8.1"
title: "Implementer le service de generation OPDS"
status: todo
size: M
depends_on: ["7.1"]
epic: "OPDS"
---

# Implementer le service de generation OPDS

## Contexte
OPDS (Open Publication Distribution System) est un standard pour distribuer des catalogues de publications. Les clients comme Panels (iOS) et Chunky Reader supportent OPDS.

## Objectif
Creer un service qui genere des documents Atom/XML conformes a OPDS 1.2.

## Criteres d'acceptation
- [ ] Genere un catalogue de navigation OPDS valide (Atom/XML)
- [ ] Genere un catalogue d'acquisition avec metadonnees
- [ ] Liens de telechargement des fichiers originaux
- [ ] Liens vers les thumbnails
- [ ] Pagination OPDS (rel="next")
- [ ] XML bien forme et valide
- [ ] Tests unitaires (validation XML)

## Fichiers cibles
- `src/lib/services/opds.ts` - creer - generation des feeds OPDS
- `src/types/opds.ts` - creer - types TypeScript OPDS
- `tests/services/opds.test.ts` - creer - tests avec validation XML

## Notes d'implementation
- **OPDS 1.2** est base sur Atom (RFC 4287). Chaque catalogue est un feed Atom avec des extensions OPDS.
- **Navigation feed** : liste des series avec liens vers les catalogues d'acquisition
- **Acquisition feed** : liste des comics d'une serie avec liens de telechargement
- **Liens importants** :
  - `rel="http://opds-spec.org/image/thumbnail"` pour les thumbnails
  - `rel="http://opds-spec.org/acquisition"` pour le telechargement
  - `rel="next"` pour la pagination
- **Generation XML** : construire le XML manuellement avec des template literals (pas de lib pour si peu de XML), ou utiliser `fast-xml-parser` en mode builder
- **Content types** : `application/epub+zip` pour CBZ, `application/x-cbr` pour CBR

## Tests attendus
- [ ] Le XML genere est bien forme
- [ ] Le catalogue de navigation contient les series
- [ ] Le catalogue d'acquisition contient les comics avec liens
- [ ] La pagination fonctionne
