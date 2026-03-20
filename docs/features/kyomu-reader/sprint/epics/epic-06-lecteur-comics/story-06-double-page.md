---
id: "6.6"
title: "Implementer le mode double page et le sens de lecture"
status: todo
size: M
depends_on: ["6.1", "6.2"]
epic: "Lecteur de comics"
---

# Implementer le mode double page et le sens de lecture

## Contexte
Sur desktop, afficher deux pages cote a cote est plus confortable. Pour les manga, le sens de lecture est droite-a-gauche.

## Objectif
Ajouter le mode double page (desktop) et le sens de lecture configurable (LTR/RTL).

## Criteres d'acceptation
- [ ] Mode double page (desktop uniquement, auto-desactive < 1024px)
- [ ] Premiere page (couverture) affichee seule
- [ ] Sens de lecture : gauche-a-droite (defaut) ou droite-a-gauche (manga)
- [ ] En RTL, le swipe et le tap sont inverses
- [ ] Persistance du sens de lecture par serie (localStorage)

## Fichiers cibles
- `src/components/reader/double-page-reader.tsx` - creer - affichage double page
- `src/components/reader/reading-direction-toggle.tsx` - creer - toggle LTR/RTL

## Notes d'implementation
- **Double page** : afficher page N et N+1 cote a cote. La premiere page (couverture) est seule. Navigation par 2 pages a la fois.
- **Auto-disable** : `window.innerWidth < 1024` -> retour au mode page simple. Utiliser un `useMediaQuery` hook.
- **RTL** : inverser l'ordre des pages affichees (droite = page N, gauche = page N+1). Inverser aussi les zones de tap et la direction du swipe.
- **localStorage** : cle `reading-direction-{series-id}` avec valeur `ltr` ou `rtl`
- **UX** : un petit indicateur visuel du sens de lecture dans les controls (fleche)

## Tests attendus
- [ ] Double page affiche 2 pages cote a cote
- [ ] La couverture est seule
- [ ] Le RTL inverse les controles
- [ ] La persistance fonctionne
