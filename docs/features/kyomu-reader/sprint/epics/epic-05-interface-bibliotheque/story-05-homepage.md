---
id: "5.5"
title: "Implementer la page d'accueil"
status: todo
size: M
depends_on: ["5.1", "6.3", "7.1"]
epic: "Interface bibliotheque"
---

# Implementer la page d'accueil

## Contexte
La page d'accueil est le point d'entree de l'application. Elle doit offrir un apercu rapide de la bibliotheque et permettre de reprendre la lecture.

## Objectif
Avoir une page d'accueil avec les sections "Continuer la lecture", "Recemment ajoutes" et les stats de la bibliotheque.

## Criteres d'acceptation
- [ ] Section "Continuer la lecture" avec les derniers comics en cours (max 10)
- [ ] Section "Recemment ajoutes" avec les derniers comics scannes (max 10)
- [ ] Lien "Voir tout" vers /series
- [ ] Carrousel horizontal scrollable sur mobile (scroll-snap)
- [ ] Stats de la bibliotheque (nombre de series, volumes, % lus)
- [ ] Etat de premier lancement : message de bienvenue + bouton scan

## Fichiers cibles
- `src/app/page.tsx` - modifier - page d'accueil
- `src/components/library/continue-reading.tsx` - creer - section en cours
- `src/components/library/recent-additions.tsx` - creer - section recents
- `src/components/library/horizontal-scroll.tsx` - creer - carrousel horizontal
- `src/components/library/library-stats.tsx` - creer - stats

## Notes d'implementation
- **Carrousel horizontal** : `overflow-x: auto` + `scroll-snap-type: x mandatory` + `scroll-snap-align: start` sur chaque carte. Pas de lib de carousel.
- **Continuer la lecture** : query `reading_progress WHERE status = 'reading' ORDER BY updated_at DESC LIMIT 10`
- **Recemment ajoutes** : query `comics ORDER BY created_at DESC LIMIT 10`
- **Stats** : `COUNT(*)` sur series, comics, et `reading_progress WHERE status = 'read'`
- **Premier lancement** : si 0 series en DB, afficher un ecran de bienvenue avec explication et bouton "Scanner la bibliotheque"

## Tests attendus
- [ ] Les sections s'affichent avec des donnees
- [ ] L'etat de premier lancement s'affiche si DB vide
- [ ] Le carrousel scroll horizontalement sur mobile
