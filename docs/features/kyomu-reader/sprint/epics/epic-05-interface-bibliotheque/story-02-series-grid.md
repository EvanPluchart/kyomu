---
id: "5.2"
title: "Implementer la grille de series"
status: todo
size: M
depends_on: ["5.1", "4.2", "2.3", "7.1"]
epic: "Interface bibliotheque"
---

# Implementer la grille de series

## Contexte
La page principale de la bibliotheque affiche toutes les series sous forme de grille de cartes avec thumbnails.

## Objectif
Avoir une page `/series` avec une grille responsive de cartes de series.

## Criteres d'acceptation
- [ ] Grille responsive (2 colonnes mobile, 3 tablette, 4-6 desktop)
- [ ] Carte avec thumbnail (aspect-ratio 2:3), titre, nombre de volumes
- [ ] Indicateur de progression de lecture par serie (badge)
- [ ] Chargement lazy des thumbnails (loading="lazy")
- [ ] Etat vide si aucune serie ("Aucune serie trouvee. Lancez un scan.")
- [ ] Bouton de scan dans le header si bibliotheque vide

## Fichiers cibles
- `src/app/(library)/series/page.tsx` - creer - page Server Component
- `src/components/library/series-grid.tsx` - creer - grille de cartes
- `src/components/library/series-card.tsx` - creer - carte individuelle
- `src/components/library/empty-state.tsx` - creer - etat vide reutilisable

## Notes d'implementation
- **Server Component** : la page fetch les series directement en SQL (pas d'API call cote serveur)
- **Grille CSS** : `grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))` pour le responsive
- **Aspect-ratio 2:3** : standard des couvertures de comics. `aspect-ratio: 2/3` en CSS.
- **Badge progression** : petit badge en bas de la carte. Vert = tout lu, bleu = en cours, pas de badge = non lu.
- **Etat vide** : composant reutilisable avec icone, message et bouton d'action

## Tests attendus
- [ ] La grille s'affiche avec les series
- [ ] L'etat vide s'affiche si pas de series
- [ ] Les thumbnails sont en lazy loading
