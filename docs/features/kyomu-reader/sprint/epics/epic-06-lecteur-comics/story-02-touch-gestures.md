---
id: "6.2"
title: "Implementer les gestes tactiles (swipe, pinch-to-zoom)"
status: todo
size: L
depends_on: ["6.1"]
epic: "Lecteur de comics"
---

# Implementer les gestes tactiles (swipe, pinch-to-zoom)

## Contexte
Kyomu est tactile-first. Le lecteur doit supporter les gestes naturels : swipe pour naviguer, pinch pour zoomer, double-tap pour zoom rapide, pan pour se deplacer quand zoome.

## Objectif
Ajouter un systeme de gestes tactiles fluide avec gestion des conflits entre gestes.

## Criteres d'acceptation
- [ ] Swipe gauche/droite pour changer de page (seuil > 50px, velocite > 0.3)
- [ ] Pinch-to-zoom fluide (min 1x, max 4x) via CSS transform scale
- [ ] Double-tap pour alterner entre zoom 1x et 2x (sur le point tape)
- [ ] Pan quand zoome, contraint aux bords de l'image
- [ ] Reset du zoom au changement de page
- [ ] Le swipe est desactive quand le zoom > 1x (priorite au pan)
- [ ] Animations via CSS transitions (pas de re-render React)
- [ ] Tests manuels sur iPhone Safari

## Fichiers cibles
- `src/components/reader/touch-handler.tsx` - creer - wrapper de gestion des gestes
- `src/hooks/use-comic-gestures.ts` - creer - hook encapsulant la logique

## Notes d'implementation
- **@use-gesture/react** : lib legere et declarative pour les gestes. Supporte pinch, drag, tap simultanement.
- **CSS transforms** : `transform: scale(${zoom}) translate(${x}px, ${y}px)`. Pas de re-render React, juste une ref DOM.
- **Conflit swipe/pan** : quand `zoom > 1`, le drag deplace l'image (pan). Quand `zoom === 1`, le drag est un swipe. Seuil de velocite pour distinguer.
- **Double-tap** : detecter 2 taps en < 300ms. Zoomer sur le point tape (pas le centre).
- **Contrainte du pan** : ne pas permettre de deplacer l'image au-dela de ses bords quand zoomee.
- **Reset** : a chaque changement de page, `zoom = 1, x = 0, y = 0`
- **iPhone Safari** : tester specifiquement car Safari a des comportements de gestes specifiques (prevention du zoom natif avec `touch-action: none`)

## Tests attendus
- [ ] Swipe change de page
- [ ] Pinch zoome l'image
- [ ] Double-tap alterne zoom 1x/2x
- [ ] Pan fonctionne quand zoome
- [ ] Swipe desactive quand zoome
