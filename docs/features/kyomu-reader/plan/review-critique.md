# Review adversariale : Kyomu — Plan v1

> Date : 2026-03-19
> Reviewer : adversarial-mode

## Resume

Le plan couvre bien le scope fonctionnel mais presente **plusieurs failles structurelles** : des couplages caches entre stories, des estimations sous-evaluees, une story fourre-tout (10.1), un epic API redondant, et des risques techniques sous-estimes sur le PDF et le CBR. Le plan necessite une iteration avant implementation.

## Completude

### Exigences couvertes
- [x] Scan bibliotheque -> Story 2.1, 2.2, 2.3
- [x] Formats CBZ, CBR, PDF, images -> Story 3.1, 3.2, 3.3, 3.4
- [x] Metadonnees ComicInfo.xml -> Story 2.2
- [x] Lecteur tactile-first (swipe, pinch-to-zoom) -> Story 6.1, 6.2
- [x] Suivi de progression -> Story 6.3
- [x] Thumbnails -> Story 4.1, 4.2
- [x] Interface bibliotheque (grille, recherche, filtres) -> Story 5.1-5.5
- [x] OPDS -> Story 8.1
- [x] PWA installable -> Story 9.1
- [x] Mode offline -> Story 9.2
- [x] Docker/Coolify -> Story 1.3
- [x] Un seul utilisateur -> Decision D3

### Exigences manquantes

- **Chemin comics configurable** : Le plan hardcode `/mnt/media/comics`. Il faut un mecanisme de configuration (variable d'env ou table `library_config`). L'utilisateur pourrait vouloir changer le chemin sans rebuild Docker.
- **Scan automatique periodique / file watcher** : Le plan prevoit un scan au demarrage et un endpoint POST, mais pas de scan periodique quand Kapowarr ajoute de nouveaux comics. Il manque un cron ou un file watcher.
- **Navigation entre volumes** : Le lecteur ne prevoit pas la navigation automatique vers le volume suivant quand on termine un comic. C'est une feature basique de Komga.
- **Thumbnails de series** : Story 4.1 genere des thumbnails par comic, mais pas par serie. Comment la grille de series (Story 5.2) affiche-t-elle un thumbnail ? Il faut definir la logique (premiere couverture de la serie ?).
- **Healthcheck Docker** : Le Dockerfile ne prevoit pas de healthcheck, necessaire pour Coolify et le monitoring.

## Faisabilite technique

### Patterns valides
- Streaming d'extraction CBZ avec `yauzl` ou `unzipper` — faisable et bien documente
- SQLite + Drizzle — bon choix pour la simplicite et la performance mono-user
- Next.js standalone output — pattern Docker eprouve
- sharp pour les thumbnails — standard industriel

### Problemes detectes

- **Story 3.3 (PDF) : Rendu PDF cote serveur sous-estime en L** : `pdf.js` est concu pour le navigateur. Cote serveur Node.js, il n'y a pas de `canvas` natif. Il faut soit `canvas` (node-canvas, necessite des dependances systeme Cairo dans le Docker), soit `pdf2pic` (dependance GraphicsMagick/ImageMagick), soit `pdfjs-dist` avec un worker custom. C'est un **XL** deguise en L. La story ne mentionne aucune de ces contraintes.

- **Story 3.2 (CBR) : `node-unrar-js` ne supporte pas le streaming** : Cette lib charge tout en memoire via WASM. Cela contredit directement l'objectif < 100 Mo RAM. Un CBR de 500 Mo ferait exploser la memoire. La story dit "extraction en streaming si possible" — ce n'est pas "si possible", c'est obligatoire. Alternative : appeler le binaire `unrar` en subprocess avec extraction page par page.

- **Story 6.2 (Gestes tactiles) : Sous-estimee** : Implementer pinch-to-zoom fluide + pan + swipe avec gestion des conflits entre gestes (le swipe ne doit pas se declencher pendant un zoom) est un des morceaux les plus complexes du projet. C'est realiste en L uniquement si on utilise une lib (use-gesture + react-zoom-pan-pinch), mais la story ne le mentionne pas.

- **Story 9.2 (Offline) : IndexedDB + pages d'images = bombe a retardement sur iOS** : iOS Safari limite le stockage a ~50 Mo par origine (extensible par quota request mais peu fiable). Un seul comic de 50 pages en haute resolution depasse ca. La story ne prevoit pas de strategie de compression ou de resolution reduite pour le cache offline.

- **Story 2.3 : "Scan en arriere-plan" dans une API Route Next.js** : Les API Routes Next.js ne sont pas concues pour les taches longues. Le process peut etre kill par le runtime apres le timeout. Il faut un mecanisme de background job (ex: lancer le scan dans un `setTimeout` decouple, ou utiliser un pattern de queue en memoire).

## Decoupage

### Stories bien decoupees
- Story 3.1 (CBZ), 3.4 (Folder), 4.2 (API thumbnail) — atomiques, claires
- Story 1.1, 1.2 — fondations bien isolees

### Stories a redecouper

- **Story 10.1 (Tests)** : C'est une story fourre-tout qui teste 4 services differents. Elle devrait etre eclatee en une story de setup Vitest + une story de tests par service, ou mieux : les tests devraient etre integres dans chaque story de service (TDD ou co-localisation).

- **Story 6.4 (Modes de lecture)** : Contient 3 modes differents (simple, double, vertical) + persistance + sens de lecture. C'est au minimum 2 stories separees : une pour le vertical reader (different paradigme) et une pour le double-page + sens de lecture.

- **Story 8.1 (OPDS)** : Estimee en L, mais contient 3 routes, un service de generation XML, un type, la pagination... C'est un XL. A minimum, separer le service OPDS (generation XML) des routes.

- **Story 5.5 (Page d'accueil)** : Depend de Story 6.3 (progression), mais c'est listee apres Story 6.4. Si on suit l'ordre d'implementation, il faut que la progression soit faite avant la page d'accueil, ce qui est le cas dans l'ordre (position 21 avant 23). OK, mais la dependance devrait etre Story 6.3 seulement, pas Story 6.2.

## Risques non identifies

| Risque | Impact | Stories concernees |
|--------|--------|--------------------|
| `sharp` necessite des binaires natifs — peut poser probleme dans Docker ARM (Oracle Free Tier = ARM Ampere) | Eleve | Story 4.1, Dockerfile |
| Next.js App Router + `better-sqlite3` : le mode synchrone de SQLite peut bloquer l'event loop sur des queries lourdes (scan de 10k comics) | Moyen | Story 2.1, Story 7.1 |
| `better-sqlite3` necessite `node-gyp` + compilation native dans Docker — complexifie le build multi-arch | Moyen | Story 1.2, Story 1.3 |
| Le scan differentiel (Story 2.1) necessite de stocker le mtime/hash de chaque fichier — pas dans le schema DB actuel | Faible | Story 1.2, Story 2.1 |
| Le passage au volume suivant automatiquement impacte le suivi de progression (marquer lu + ouvrir le suivant) | Faible | Story 6.3 |
| Les fichiers CBZ/CBR telecharges par Kapowarr peuvent avoir des noms non standards (caracteres unicode, espaces, parentheses) | Faible | Story 2.1 |

## Edge cases manquants

- **Comic avec 0 pages valides** (archive corrompue ou vide) — comment le scanner et le lecteur reagissent-ils ?
- **Comic tres lourd (2 Go+)** — le streaming tient-il ou y a-t-il un timeout ?
- **Scan pendant une lecture** — le scan modifie-t-il l'etat de la DB d'un comic en cours de lecture ?
- **Deux scans simultanes** (double-clic sur le bouton scan) — mutex necessaire ?
- **Thumbnail d'un PDF** — requiert le rendu de la premiere page, mais le rendu PDF est le point le plus complexe. La generation de thumbnails depend du PDF renderer.
- **Comic sans couverture identifiable** — certains CBZ n'ont pas de page nommee "cover" et la premiere page est une page blanche ou un disclaimer.
- **Dossier d'images contenant des sous-dossiers** — le scan les traite comment ?

## Recommandations

1. **Redecouper Story 3.3 (PDF) en XL** et preciser la strategie de rendu (node-canvas vs ImageMagick vs pdf2pic). Evaluer la faisabilite sur ARM (Oracle Free Tier) avant de commencer. Envisager de reporter le support PDF en v2 si trop complexe.

2. **Changer la strategie CBR** (Story 3.2) : abandonner le streaming pur avec `node-unrar-js` et utiliser le binaire `unrar` en subprocess avec extraction page par page dans un dossier temp. Ajouter `unrar` dans le Dockerfile.

3. **Eclater Story 10.1** : integrer les tests dans chaque story de service (ajout d'un critere d'acceptation "tests unitaires passes") au lieu d'un epic tests separe.

4. **Ajouter une story "Configuration"** : variable d'env pour le chemin comics, page de settings minimaliste dans l'UI (chemin, scan auto, intervalle).

5. **Ajouter un mecanisme de scan periodique** : cron interne (setInterval) ou file watcher (chokidar) pour detecter les nouveaux comics de Kapowarr.

6. **Ajouter la navigation inter-volumes** au lecteur : passage automatique au volume suivant en fin de comic, avec confirmation.

7. **Verifier la compatibilite ARM** pour `sharp` et `better-sqlite3` dans le Dockerfile. Utiliser les images `node:XX-slim` avec les packages systeme necessaires.

8. **Ajouter un healthcheck Docker** (`/api/health`) pour le monitoring Coolify.

9. **Reduire la resolution du cache offline** : stocker les pages offline en qualite reduite (800px) pour rester sous les limites iOS Safari.

10. **Definir la strategie de thumbnail pour les series** : utiliser la couverture du premier volume.

## Verdict

- [ ] Pret pour implementation
- [x] Necessite une iteration (mode B)
- [ ] Necessite une refonte majeure

Le plan est solide sur la structure globale et le scope, mais les problemes techniques sur PDF/CBR/ARM et les stories mal decoupees (10.1, 6.4, 8.1) necessitent une v2 avant de lancer le sprint.
