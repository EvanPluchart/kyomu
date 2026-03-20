---
id: "3.2"
title: "Implementer l'extraction des pages CBR via binaire unrar"
status: todo
size: M
depends_on: ["3.1"]
epic: "Extraction de comics"
---

# Implementer l'extraction des pages CBR via binaire unrar

## Contexte
CBR (Comic Book RAR) est le second format le plus courant. Les libs Node.js pour RAR (node-unrar-js) chargent tout en memoire via WASM, ce qui est incompatible avec l'objectif < 100 Mo RAM. On utilise le binaire `unrar` en subprocess.

## Objectif
Implementer un extracteur CBR qui appelle le binaire `unrar` pour extraire les pages une par une, sans charger l'archive en memoire.

## Criteres d'acceptation
- [ ] Utilise le binaire `unrar` installe dans le systeme en subprocess securise
- [ ] Extrait une page a la fois dans un dossier temp (pas tout en memoire)
- [ ] Gere les archives RAR4 et RAR5
- [ ] Nettoie le dossier temp apres usage
- [ ] Retourne une erreur claire si `unrar` n'est pas installe
- [ ] Meme interface `ComicExtractor` que CBZ
- [ ] Tests unitaires inclus (avec mock du binaire pour CI)

## Fichiers cibles
- `src/lib/services/extractors/cbr.ts` - creer - extracteur CBR
- `tests/services/extractors/cbr.test.ts` - creer - tests

## Notes d'implementation
- **Lister les fichiers** : `unrar lb archive.cbr` retourne la liste des fichiers (un par ligne)
- **Extraire un fichier** : `unrar p -inul archive.cbr "nom-du-fichier"` extrait sur stdout (binaire)
- **Alternative extraction** : `unrar e -o+ archive.cbr "nom-du-fichier" /tmp/kyomu-extract/` extrait dans un dossier
- Utiliser `execFile` (pas `exec`) pour eviter l'injection de commandes — ne JAMAIS passer le chemin via un shell
- **Dossier temp** : `os.tmpdir()` + sous-dossier unique par extraction. Nettoyer dans `close()`.
- **Verification au demarrage** : verifier que `unrar` est dans le PATH. Si absent, logger un warning et retourner une erreur claire quand on tente d'ouvrir un CBR.
- **Filtrage** : reutiliser les utils de Story 3.1 (isImageFile, naturalSort)

## Tests attendus
- [ ] Liste les pages d'un CBR
- [ ] Extrait une page specifique
- [ ] Les pages sont dans l'ordre naturel
- [ ] Erreur claire si unrar absent
- [ ] Le dossier temp est nettoye apres close()
