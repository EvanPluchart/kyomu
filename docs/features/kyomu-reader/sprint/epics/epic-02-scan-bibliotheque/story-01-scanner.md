---
id: "2.1"
title: "Implementer le service de scan du systeme de fichiers"
status: todo
size: L
depends_on: ["1.2", "1.4"]
epic: "Scan de la bibliotheque"
---

# Implementer le service de scan du systeme de fichiers

## Contexte
Les comics sont telecharges par Kapowarr dans un dossier configure. Kyomu doit scanner ce dossier pour detecter les series et volumes, puis maintenir la base de donnees a jour.

## Objectif
Avoir un service de scan capable de detecter les fichiers CBZ, CBR et dossiers d'images, de les organiser en series/volumes, et de faire des scans differentiels.

## Criteres d'acceptation
- [ ] Detecte les fichiers CBZ, CBR et les dossiers d'images (jpg/png/webp)
- [ ] Identifie les series a partir de la structure de dossiers (1 dossier = 1 serie)
- [ ] Scan differentiel : ignore les fichiers deja connus avec meme mtime/taille
- [ ] Supprime de la DB les comics dont le fichier source n'existe plus
- [ ] Mutex : un seul scan a la fois, retourne un message si deja en cours
- [ ] Gere les caracteres speciaux/unicode dans les noms de fichiers
- [ ] Gere les archives corrompues ou vides (log warning, skip)
- [ ] Tests unitaires inclus

## Fichiers cibles
- `src/lib/services/scanner.ts` - creer - service de scan principal
- `src/lib/services/file-utils.ts` - creer - utilitaires fichiers (detection format, listing)
- `tests/services/scanner.test.ts` - creer - tests unitaires

## Notes d'implementation
- **Structure attendue de `/mnt/media/comics`** :
  ```
  /mnt/media/comics/
    Batman (2016)/
      Batman 001.cbz
      Batman 002.cbz
    Spider-Man/
      Amazing Spider-Man 001.cbr
  ```
- Chaque dossier de niveau 1 = une serie
- Chaque fichier dans ce dossier = un volume/issue
- **Scan differentiel** : comparer `file_mtime` + `file_size` stockes en DB avec `fs.stat()` du fichier actuel. Si identiques, skip.
- **Mutex** : simple boolean `isScanning` dans le module. Pas besoin de lib.
- **Formats detectes** : `.cbz`, `.cbr` (extensions). Dossiers contenant au moins 1 image = comic type `folder`.
- Utiliser `fs.readdir` avec `withFileTypes: true` pour eviter des `stat` supplementaires
- Logger les warnings via `console.warn` (pas de lib de logging pour le moment)

## Tests attendus
- [ ] Detecte un CBZ dans un dossier
- [ ] Detecte un CBR dans un dossier
- [ ] Detecte un dossier d'images comme comic
- [ ] Organise les fichiers en series (par dossier parent)
- [ ] Scan differentiel : ne re-scanne pas un fichier inchange
- [ ] Supprime un comic dont le fichier n'existe plus
- [ ] Mutex : refuse un second scan concurrent
