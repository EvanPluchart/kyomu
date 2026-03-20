---
id: "2.2"
title: "Implementer l'extraction de metadonnees ComicInfo.xml"
status: todo
size: M
depends_on: ["3.1", "3.2"]
epic: "Scan de la bibliotheque"
---

# Implementer l'extraction de metadonnees ComicInfo.xml

## Contexte
Les fichiers CBZ et CBR peuvent contenir un fichier ComicInfo.xml avec des metadonnees riches (titre, auteurs, resume, numero). Ces metadonnees enrichissent l'affichage dans la bibliotheque.

## Objectif
Extraire et parser ComicInfo.xml depuis les archives, avec un fallback sur le nom de fichier si absent.

## Criteres d'acceptation
- [ ] Parse correctement ComicInfo.xml depuis un CBZ (extraction selective du XML uniquement via yauzl)
- [ ] Parse correctement ComicInfo.xml depuis un CBR (extraction selective via binaire unrar)
- [ ] Gere l'absence de ComicInfo.xml (fallback : titre = nom du fichier sans extension)
- [ ] Mappe les champs : Title, Series, Number, Writer, Penciller, Summary, Year, Publisher
- [ ] Gere les ComicInfo.xml malformes (log warning, fallback)
- [ ] Tests unitaires inclus

## Fichiers cibles
- `src/lib/services/metadata.ts` - creer - parsing ComicInfo.xml
- `src/types/comic-info.ts` - creer - types TypeScript pour ComicInfo
- `tests/services/metadata.test.ts` - creer - tests unitaires
- `tests/fixtures/sample-comicinfo.xml` - creer - fixture de test

## Notes d'implementation
- **ComicInfo.xml** est un standard de fait dans l'ecosysteme comics. Pas de spec formelle mais des champs communs.
- Parser le XML avec un parser leger (pas de lib lourde). `fast-xml-parser` est un bon choix.
- **Extraction selective** : ne pas extraire toutes les images, juste le fichier `ComicInfo.xml` de l'archive.
  - CBZ : ouvrir avec yauzl, chercher l'entree `ComicInfo.xml`, lire uniquement celle-la
  - CBR : `unrar p archive.cbr ComicInfo.xml` (extrait sur stdout)
- **Fallback** : si pas de ComicInfo.xml, extraire le titre depuis le nom de fichier : `Batman 001.cbz` -> titre "Batman 001", numero 1
- **Regex pour le numero** : chercher un pattern numerique en fin de nom (`(\d+)\.cb[rz]$`)

## Tests attendus
- [ ] Parse un ComicInfo.xml valide avec tous les champs
- [ ] Parse un ComicInfo.xml avec des champs manquants
- [ ] Fallback correct si ComicInfo.xml absent
- [ ] Gere un ComicInfo.xml malformed sans crash
