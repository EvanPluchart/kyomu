---
id: "10.1"
title: "Configurer Vitest avec le projet"
status: todo
size: S
depends_on: ["1.1"]
epic: "Vitest setup"
---

# Configurer Vitest avec le projet

## Contexte
Les stories de service incluent des tests unitaires. Vitest doit etre configure pour que ces tests puissent etre ecrits et executes.

## Objectif
Avoir Vitest operationnel avec les path aliases, les fixtures et les scripts npm.

## Criteres d'acceptation
- [ ] `vitest.config.ts` configure avec path alias `@/`
- [ ] `pnpm test` et `pnpm test:watch` fonctionnent
- [ ] Dossier `tests/fixtures/` avec un CBZ et un ComicInfo.xml de test
- [ ] Script CI-ready (`pnpm test:ci` avec coverage)

## Fichiers cibles
- `vitest.config.ts` - creer - config Vitest
- `tests/setup.ts` - creer - setup global (si necessaire)
- `tests/fixtures/` - creer - fixtures de test

## Notes d'implementation
- **Config** : heriter de `vite.config.ts` ou definir les aliases manuellement
- **CBZ de test** : creer un petit ZIP avec 3 images JPEG (10x10 pixels) et un ComicInfo.xml
- **Coverage** : utiliser `@vitest/coverage-v8`
- **Scripts package.json** : `"test": "vitest"`, `"test:watch": "vitest --watch"`, `"test:ci": "vitest run --coverage"`

## Tests attendus
- [ ] `pnpm test` execute sans erreur (meme sans tests)
- [ ] Les path aliases `@/` fonctionnent dans les tests
