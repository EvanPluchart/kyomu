---
id: "5.1"
title: "Creer le layout principal et la navigation"
status: todo
size: M
depends_on: ["1.1"]
epic: "Interface bibliotheque"
---

# Creer le layout principal et la navigation

## Contexte
Kyomu a besoin d'un layout racine avec une navigation coherente, un theme sombre par defaut et une structure responsive pour mobile et desktop.

## Objectif
Avoir le squelette de l'interface : header, navigation, theme sombre, textes en francais.

## Criteres d'acceptation
- [ ] Layout responsive avec header fixe
- [ ] Navigation : Accueil, Series, "En cours"
- [ ] Theme sombre par defaut (variables CSS shadcn dark)
- [ ] Textes en francais avec accents corrects
- [ ] Meta tags PWA dans le layout (viewport, theme-color, apple-mobile-web-app)
- [ ] Favicon + touch-icon

## Fichiers cibles
- `src/app/layout.tsx` - modifier - layout racine avec providers, fonts, meta
- `src/app/globals.css` - creer - variables CSS shadcn + reset
- `src/components/layout/header.tsx` - creer - header avec logo et nav
- `src/components/layout/nav.tsx` - creer - liens de navigation

## Patterns et references
- `~/evan-workflow/technos/nextjs/patterns/component.md`
- `~/evan-workflow/common/french-content.md`

## Notes d'implementation
- **Theme sombre** : ajouter `dark` comme classe par defaut sur `<html>`. shadcn/ui utilise des CSS variables qui changent selon la classe.
- **Textes francais** : "Bibliotheque", "Series", "En cours de lecture", "Parametres" — avec accents corrects partout
- **Header mobile** : hamburger menu ou bottom nav bar (plus adapte au tactile). Privilegier la bottom nav pour le mobile.
- **Font** : Inter via `next/font/google` (standard shadcn)
- **Meta PWA** : `<meta name="apple-mobile-web-app-capable" content="yes">`, `<meta name="theme-color" content="#000000">`

## Tests attendus
- [ ] Le layout s'affiche sans erreur
- [ ] La navigation fonctionne entre les pages
- [ ] Le theme sombre est applique par defaut
