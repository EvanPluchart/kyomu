---
id: "6.1"
title: "Implementer le lecteur de base (affichage page par page)"
status: todo
size: L
depends_on: ["3.4"]
epic: "Lecteur de comics"
---

# Implementer le lecteur de base (affichage page par page)

## Contexte
Le lecteur est le coeur de Kyomu. Il doit afficher les pages une par une en plein ecran, avec une navigation fluide et un preloading intelligent.

## Objectif
Avoir un lecteur fonctionnel avec navigation clavier/souris/tap, preloading et controles auto-hide.

## Criteres d'acceptation
- [ ] Affiche une page a la fois, centree, adaptee a l'ecran (object-fit contain)
- [ ] Navigation : fleches gauche/droite, touches clavier (ArrowLeft/Right, A/D), tap sur les bords (tiers gauche/droite)
- [ ] Preloading de la page N+1 et N+2
- [ ] Barre de progression en bas (slider cliquable)
- [ ] Header auto-hide avec bouton retour, titre, page courante/total
- [ ] Tap au centre = toggle header/controls
- [ ] Fond noir (pas de flash blanc au changement de page)

## Fichiers cibles
- `src/app/(reader)/read/[id]/page.tsx` - creer - page lecteur (Client Component)
- `src/components/reader/page-viewer.tsx` - creer - affichage de la page
- `src/components/reader/reader-controls.tsx` - creer - header + controles
- `src/components/reader/progress-bar.tsx` - creer - barre de progression

## Notes d'implementation
- **Client Component** : le lecteur est entierement cote client (interactions, etat, preloading)
- **Preloading** : utiliser `new Image()` pour precharger N+1 et N+2 en arriere-plan
- **Fond noir** : `bg-black` sur le body quand le lecteur est ouvert (via le layout du groupe route `(reader)`)
- **Auto-hide** : les controles disparaissent apres 3 secondes d'inactivite. Reapparaissent au tap centre ou mouvement souris.
- **Zones de tap** : diviser l'ecran en 3 tiers verticaux. Gauche = page precedente, centre = toggle UI, droite = page suivante.
- **URL** : `/read/[comic-id]?page=5` — la page courante est dans l'URL pour le refresh
- **Performance** : utiliser `<img>` natif, pas `next/image` (les images sont deja servies via API avec cache immutable)

## Tests attendus
- [ ] La page s'affiche avec la premiere image du comic
- [ ] Navigation clavier fonctionne
- [ ] Le preloading charge les pages suivantes
- [ ] Les controles s'auto-hide
