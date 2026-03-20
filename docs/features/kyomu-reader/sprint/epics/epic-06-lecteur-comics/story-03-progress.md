---
id: "6.3"
title: "Implementer le suivi de progression de lecture"
status: todo
size: M
depends_on: ["1.2", "6.1"]
epic: "Lecteur de comics"
---

# Implementer le suivi de progression de lecture

## Contexte
L'utilisateur doit pouvoir fermer l'app et reprendre sa lecture exactement ou il en etait. La progression doit etre sauvegardee automatiquement.

## Objectif
Sauvegarder la page courante automatiquement, permettre la reprise et le marquage comme lu.

## Criteres d'acceptation
- [ ] Sauvegarde automatique de la page courante (debounce 2s, Server Action)
- [ ] Reprise a la derniere page lue a l'ouverture
- [ ] Marquage automatique "lu" a la derniere page
- [ ] Possibilite de marquer manuellement comme lu/non lu (depuis la page serie)
- [ ] `GET /api/comics/[id]/progress` — progression actuelle
- [ ] `PUT /api/comics/[id]/progress` — sauvegarder la progression
- [ ] Tests unitaires du service

## Fichiers cibles
- `src/lib/services/progress.ts` - creer - logique metier progression
- `src/app/api/comics/[id]/progress/route.ts` - creer - API endpoints
- `tests/services/progress.test.ts` - creer - tests

## Notes d'implementation
- **Debounce 2s** : ne pas sauvegarder a chaque changement de page si l'utilisateur navigue rapidement
- **Upsert** : `INSERT OR REPLACE` dans la table `reading_progress`
- **Statuts** : `unread` (defaut, pas de ligne en DB), `reading` (des qu'une page est lue), `read` (derniere page atteinte)
- **Marquage manuel** : un bouton dans l'UI qui change le statut directement (toggle read/unread)
- **Server Action vs API Route** : utiliser une Server Action pour la sauvegarde depuis le lecteur (plus simple), et les API Routes pour les clients externes (OPDS)

## Tests attendus
- [ ] Sauvegarde une progression
- [ ] Retourne la progression existante
- [ ] Marque comme lu a la derniere page
- [ ] Le marquage manuel fonctionne
