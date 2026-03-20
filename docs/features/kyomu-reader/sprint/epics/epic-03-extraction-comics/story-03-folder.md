---
id: "3.3"
title: "Implementer le support des dossiers d'images"
status: todo
size: S
depends_on: ["3.1"]
epic: "Extraction de comics"
---

# Implementer le support des dossiers d'images

## Contexte
Certains comics sont stockes comme des dossiers d'images plutot que des archives. L'extracteur doit simplement lister et servir ces images.

## Objectif
Implementer un extracteur pour les dossiers d'images, avec la meme interface que CBZ/CBR.

## Criteres d'acceptation
- [ ] Liste les images d'un dossier (jpg, png, webp)
- [ ] Tri naturel des noms de fichiers
- [ ] Ignore les sous-dossiers
- [ ] Meme interface `ComicExtractor`
- [ ] Tests unitaires inclus

## Fichiers cibles
- `src/lib/services/extractors/folder.ts` - creer - extracteur dossier
- `tests/services/extractors/folder.test.ts` - creer - tests

## Notes d'implementation
- Le plus simple des extracteurs : `fs.readdir` + filtre images + tri naturel
- `getPage(n)` retourne un `fs.createReadStream` du fichier
- Pas de dossier temp, pas de nettoyage
- Reutiliser `isImageFile` et `naturalSort` de `extractors/utils.ts`

## Tests attendus
- [ ] Liste les images d'un dossier de test
- [ ] Tri naturel correct
- [ ] Ignore les sous-dossiers
- [ ] Ignore les fichiers non-image
