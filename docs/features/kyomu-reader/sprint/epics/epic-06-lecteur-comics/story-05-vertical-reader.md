---
id: "6.5"
title: "Implementer le mode de lecture vertical (webtoon)"
status: todo
size: M
depends_on: ["6.1", "6.2"]
epic: "Lecteur de comics"
---

# Implementer le mode de lecture vertical (webtoon)

## Contexte
Les webtoons et certains manga longs sont concus pour etre lus en defilement vertical continu, pas page par page.

## Objectif
Ajouter un mode de lecture vertical avec chargement lazy et persistance du choix.

## Criteres d'acceptation
- [ ] Defilement vertical avec toutes les pages empilees
- [ ] Chargement lazy (IntersectionObserver, 3 pages autour de la vue)
- [ ] Barre de progression reflète la position de scroll
- [ ] Persistance du mode choisi par serie (localStorage)
- [ ] Bouton toggle entre mode page et mode vertical

## Fichiers cibles
- `src/components/reader/vertical-reader.tsx` - creer - lecteur vertical
- `src/components/reader/reading-mode-toggle.tsx` - creer - toggle de mode

## Notes d'implementation
- **IntersectionObserver** : observer chaque `<img>` placeholder. Quand il entre dans la zone visible (+/- 1 viewport), charger l'image.
- **Progression** : la "page courante" dans le mode vertical est determinee par quelle image est la plus visible dans le viewport
- **Scroll snap** : optionnel. Certains lecteurs le font, d'autres non. A tester pour voir ce qui est le plus confortable.
- **localStorage** : cle `reading-mode-{series-id}` avec valeur `page` ou `vertical`
- **Toggle** : bouton dans les reader-controls qui switch entre les modes sans recharger la page

## Tests attendus
- [ ] Le mode vertical affiche toutes les pages
- [ ] Le chargement lazy fonctionne
- [ ] La persistance du mode fonctionne
