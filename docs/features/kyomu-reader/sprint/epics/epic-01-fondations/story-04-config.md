---
id: "1.4"
title: "Implementer la configuration de l'application"
status: todo
size: S
depends_on: ["1.1"]
epic: "Fondations"
---

# Implementer la configuration de l'application

## Contexte
Kyomu doit etre configurable sans rebuild Docker. Les parametres cles (chemin comics, intervalle de scan, chemin DB) doivent etre configurables via variables d'environnement.

## Objectif
Avoir un module de configuration centralise, type-safe, avec valeurs par defaut et validation au demarrage.

## Criteres d'acceptation
- [ ] `COMICS_PATH` configurable (defaut `/mnt/media/comics`)
- [ ] `SCAN_INTERVAL_MINUTES` configurable (defaut 60)
- [ ] `DATABASE_PATH` configurable (defaut `./data/kyomu.db`)
- [ ] Validation au demarrage avec messages d'erreur explicites si le dossier comics n'existe pas
- [ ] Type-safe avec un schema de config centralise

## Fichiers cibles
- `src/lib/config.ts` - creer - schema de config avec valeurs par defaut et validation

## Notes d'implementation
- Pattern simple : objet config exporte avec `process.env` + valeurs par defaut
- Validation au premier acces : verifier que `COMICS_PATH` existe et est un dossier lisible
- Ne PAS utiliser de lib externe (pas besoin de zod ou dotenv pour 3 variables)
- Exporter un type `Config` pour le typage

## Tests attendus
- [ ] Config charge les valeurs par defaut si pas d'env
- [ ] Config charge les valeurs d'env si presentes
- [ ] Erreur explicite si le dossier comics n'existe pas
