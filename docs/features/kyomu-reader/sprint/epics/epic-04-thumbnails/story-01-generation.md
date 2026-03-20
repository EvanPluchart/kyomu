---
id: "4.1"
title: "Implementer la generation et le cache de thumbnails"
status: todo
size: M
depends_on: ["3.1", "3.2", "3.3"]
epic: "Thumbnails"
---

# Implementer la generation et le cache de thumbnails

## Contexte
Les grilles de series et de volumes ont besoin de thumbnails pour etre visuellement utiles. Les thumbnails doivent etre generes a partir de la premiere page de chaque comic et caches sur disque.

## Objectif
Generer des thumbnails WebP depuis la premiere page de chaque comic, avec un cache sur disque et une generation en batch.

## Criteres d'acceptation
- [ ] Genere un thumbnail (300px de large, webp, qualite 80) depuis la premiere page
- [ ] Stocke dans `data/thumbnails/{comic-id}.webp`
- [ ] Thumbnail de serie = thumbnail du premier volume (par numero)
- [ ] Ne regenere pas si le thumbnail existe et le fichier source n'a pas change
- [ ] Generation en batch avec concurrence limitee (2 thumbnails simultanes max)
- [ ] Gere les erreurs d'extraction gracieusement (placeholder generique)
- [ ] Verification : `sharp` fonctionne sur ARM64
- [ ] Tests unitaires inclus

## Fichiers cibles
- `src/lib/services/thumbnails.ts` - creer - generation + cache
- `tests/services/thumbnails.test.ts` - creer - tests

## Notes d'implementation
- **sharp** : `sharp(buffer).resize(300).webp({ quality: 80 }).toFile(path)`
- **Concurrence** : utiliser un simple semaphore (compteur) pour limiter a 2 generations simultanees
- **Cache invalidation** : comparer le `file_mtime` du comic avec le `mtime` du thumbnail. Si le comic est plus recent, regenerer.
- **Thumbnail de serie** : pas de fichier separe. La route API de thumbnail de serie va chercher le thumbnail du premier comic (par numero).
- **Erreurs** : si l'extraction de la premiere page echoue, ne pas crash. Logger et retourner un flag pour que l'API serve le placeholder.

## Tests attendus
- [ ] Genere un thumbnail valide depuis un CBZ de test
- [ ] Le thumbnail est bien en webp, 300px de large
- [ ] Ne regenere pas si deja en cache
- [ ] Gere une erreur d'extraction sans crash
