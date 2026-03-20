---
id: "5.3"
title: "Implementer la page de detail d'une serie"
status: todo
size: M
depends_on: ["5.2", "7.1"]
epic: "Interface bibliotheque"
---

# Implementer la page de detail d'une serie

## Contexte
Quand l'utilisateur clique sur une serie, il voit la page de detail avec les metadonnees et la liste des volumes.

## Objectif
Avoir une page `/series/[id]` avec les infos de la serie et la grille de ses volumes.

## Criteres d'acceptation
- [ ] Affiche le titre, l'auteur, le resume de la serie
- [ ] Liste des volumes avec thumbnails en grille (aspect-ratio 2:3)
- [ ] Indicateur de progression par volume : non lu / en cours (page/total) / lu (check)
- [ ] Bouton "Continuer la lecture" visible en haut
- [ ] Tri par numero de volume (croissant)
- [ ] Nombre total de pages et progression globale de la serie

## Fichiers cibles
- `src/app/(library)/series/[id]/page.tsx` - creer - page detail
- `src/components/library/volume-grid.tsx` - creer - grille de volumes
- `src/components/library/volume-card.tsx` - creer - carte volume
- `src/components/library/series-header.tsx` - creer - header avec metadonnees

## Notes d'implementation
- **Server Component** : fetch directement en SQL avec le `params.id`
- **Continuer la lecture** : trouver le premier volume avec statut `reading`, ou le premier `unread`. Lien direct vers `/read/[comic-id]`
- **Progression globale** : `(volumes lus / total volumes) * 100`
- **Tri** : ORDER BY `number ASC` en SQL. Le champ `number` vient de ComicInfo.xml ou du parsing du nom de fichier

## Tests attendus
- [ ] La page affiche les infos de la serie
- [ ] Les volumes sont tries par numero
- [ ] Le bouton "Continuer la lecture" pointe vers le bon volume
