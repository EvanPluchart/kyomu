---
id: "5.4"
title: "Implementer la recherche et les filtres"
status: todo
size: M
depends_on: ["5.2", "7.1"]
epic: "Interface bibliotheque"
---

# Implementer la recherche et les filtres

## Contexte
Avec une bibliotheque de plusieurs centaines de series, la recherche et le filtrage sont essentiels pour trouver rapidement un comic.

## Objectif
Ajouter une barre de recherche et des filtres par statut de lecture a la page des series.

## Criteres d'acceptation
- [ ] Recherche par titre et auteur (LIKE SQLite, case-insensitive)
- [ ] Filtre par statut : tous / non lus / en cours / lus
- [ ] Resultats via URL query params (debounce 300ms)
- [ ] Etat vide avec message si aucun resultat
- [ ] La recherche fonctionne sur la page des series et la page de detail

## Fichiers cibles
- `src/components/library/search-bar.tsx` - creer - barre de recherche avec debounce
- `src/components/library/filters.tsx` - creer - boutons de filtre par statut

## Notes d'implementation
- **URL query params** : utiliser `useSearchParams` + `useRouter().push()` pour persister la recherche dans l'URL. Permet le refresh et le partage.
- **Debounce** : 300ms avant de mettre a jour l'URL (pas de requete a chaque frappe)
- **Client Component** : la search bar et les filtres sont des Client Components qui mettent a jour les query params. La page (Server Component) lit les params et filtre en SQL.
- **Filtre statut** : boutons toggle (shadcn Toggle ou ToggleGroup)

## Tests attendus
- [ ] La recherche filtre les series par titre
- [ ] Le filtre par statut fonctionne
- [ ] L'URL est mise a jour avec les params
