---
id: "3.1"
title: "Implementer l'extraction des pages CBZ"
status: todo
size: M
depends_on: ["1.1"]
epic: "Extraction de comics"
---

# Implementer l'extraction des pages CBZ

## Contexte
CBZ (Comic Book Zip) est le format le plus courant. C'est une archive ZIP contenant des images. L'extraction doit etre en streaming pour respecter l'objectif memoire < 100 Mo.

## Objectif
Definir l'interface commune `ComicExtractor` et implementer l'extracteur CBZ avec streaming via yauzl.

## Criteres d'acceptation
- [ ] Interface `ComicExtractor` definie : `getPageCount()`, `getPage(n)`, `getPageList()`, `close()`
- [ ] Extrait les images d'un CBZ sans decompresser tout en memoire (streaming yauzl)
- [ ] Tri naturel des noms de fichiers (page1, page2... page10)
- [ ] Supporte jpg, png, webp dans l'archive
- [ ] Ignore les fichiers non-image (thumbs.db, .DS_Store, xml, __MACOSX)
- [ ] Tests unitaires inclus

## Fichiers cibles
- `src/lib/services/extractors/types.ts` - creer - interface ComicExtractor
- `src/lib/services/extractors/cbz.ts` - creer - extracteur CBZ
- `src/lib/services/extractors/utils.ts` - creer - tri naturel, detection image, filtrage
- `tests/services/extractors/cbz.test.ts` - creer - tests
- `tests/fixtures/test.cbz` - creer - CBZ de test avec 3 images

## Notes d'implementation
- **Interface ComicExtractor** :
  ```typescript
  interface ComicExtractor {
    getPageCount(): Promise<number>
    getPageList(): Promise<PageInfo[]>
    getPage(index: number): Promise<ReadableStream | Buffer>
    close(): Promise<void>
  }
  ```
- **yauzl** : lib ZIP qui supporte le streaming (readEntry par readEntry). Ne charge pas tout en memoire.
- **Tri naturel** : implementer une fonction `naturalSort` qui trie "page2" avant "page10" (pas de tri lexicographique)
- **Filtrage** : extensions image = `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`. Tout le reste est ignore.
- **__MACOSX** : les archives creees sur Mac contiennent un dossier `__MACOSX/` avec des fichiers `._*`. Les ignorer.

## Tests attendus
- [ ] Extrait les pages d'un CBZ de test
- [ ] Les pages sont dans l'ordre naturel
- [ ] Les fichiers non-image sont ignores
- [ ] getPageCount() retourne le bon nombre
- [ ] getPage(0) retourne la premiere image
