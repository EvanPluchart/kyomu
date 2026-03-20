---
id: "2.3"
title: "Creer l'API Route de scan et le scan periodique"
status: todo
size: M
depends_on: ["2.1", "2.2"]
epic: "Scan de la bibliotheque"
---

# Creer l'API Route de scan et le scan periodique

## Contexte
Le scan doit pouvoir etre declenche manuellement via l'interface et automatiquement a intervalles reguliers pour detecter les nouveaux comics ajoutes par Kapowarr.

## Objectif
Avoir un endpoint de scan, un endpoint de statut, et un scheduler qui declenche des scans periodiques.

## Criteres d'acceptation
- [ ] `POST /api/library/scan` declenche un scan et retourne immediatement `{ status: "started" }` ou `{ status: "already_running" }`
- [ ] `GET /api/library/scan/status` retourne l'etat du scan (idle/running + stats)
- [ ] Scan automatique au premier demarrage de l'app
- [ ] Scan periodique configurable via `SCAN_INTERVAL_MINUTES`
- [ ] Le scan s'execute de maniere decouplee (pas de timeout HTTP)
- [ ] Log du resultat du scan (series/comics ajoutes/supprimes)

## Fichiers cibles
- `src/app/api/library/scan/route.ts` - creer - POST pour declencher un scan
- `src/app/api/library/scan/status/route.ts` - creer - GET pour le statut
- `src/lib/services/scan-scheduler.ts` - creer - scheduler avec setInterval

## Notes d'implementation
- **Decouplage** : le POST lance le scan via `setTimeout(0)` puis retourne immediatement. Le scan tourne en arriere-plan dans le meme process Node.
- **Scheduler** : `setInterval` qui appelle le scanner. Initialise dans un module qui s'auto-execute a l'import (ou via `instrumentation.ts` de Next.js).
- **Statut** : le scanner expose un etat observable (`idle`, `running`, `last_scan_at`, `last_scan_result`)
- **Premier demarrage** : le scheduler detecte si la DB est vide et declenche un scan immediat
- **Attention** : Next.js peut recharger les modules en dev. Le scheduler doit etre resilient aux reloads (ne pas dupliquer les intervals).

## Tests attendus
- [ ] POST /api/library/scan retourne 200 avec status started
- [ ] POST pendant un scan retourne status already_running
- [ ] GET /api/library/scan/status retourne l'etat correct
