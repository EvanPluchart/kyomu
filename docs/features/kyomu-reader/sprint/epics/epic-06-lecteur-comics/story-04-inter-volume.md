---
id: "6.4"
title: "Implementer la navigation inter-volumes"
status: todo
size: S
depends_on: ["6.1", "6.3", "7.1"]
epic: "Lecteur de comics"
---

# Implementer la navigation inter-volumes

## Contexte
Quand l'utilisateur termine un volume, il doit pouvoir passer au suivant sans retourner a la page de la serie. C'est une feature basique de Komga.

## Objectif
Afficher un overlay de fin de volume avec la possibilite de passer au volume suivant.

## Criteres d'acceptation
- [ ] A la derniere page, overlay "Volume termine" avec bouton "Volume suivant" (si disponible)
- [ ] Affiche le titre et le thumbnail du volume suivant
- [ ] Si pas de volume suivant, "Serie terminee" avec bouton retour
- [ ] Le volume courant est marque comme lu automatiquement
- [ ] Swipe vers la droite a la derniere page declenche aussi la navigation

## Fichiers cibles
- `src/components/reader/volume-end-overlay.tsx` - creer - overlay de fin

## Notes d'implementation
- **Volume suivant** : query `comics WHERE series_id = ? AND number > ? ORDER BY number ASC LIMIT 1`
- **Overlay** : s'affiche par-dessus le lecteur quand `currentPage === totalPages` et qu'on tente d'aller a la page suivante
- **Design** : fond semi-transparent, carte du volume suivant centree, boutons "Volume suivant" et "Retour a la serie"
- **Marquage lu** : reutiliser le service de progression (Story 6.3)

## Tests attendus
- [ ] L'overlay s'affiche a la derniere page
- [ ] Le bouton volume suivant navigue correctement
- [ ] Le volume est marque comme lu
