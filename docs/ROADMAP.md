# Kyomu — Roadmap

> Feuille de route des améliorations post-v1. Chaque section est une feature indépendante
> à planifier avec `/feature-planner` → `/sprint-planner` → `/dev-story`.

## Priorité haute — UX essentielle

### 1. Page de paramètres
- Page `/settings` accessible depuis la navigation
- Bouton de scan manuel avec indicateur de progression
- Statut du dernier scan (date, résultat, erreurs)
- Chemin des comics affiché (lecture seule)
- Intervalle de scan configurable
- Version de l'application
- **Skills** : `/feature-planner`, `/frontend-design`, `/impeccable`

### 2. Favicon et branding
- Favicon `.ico` + `.svg` pour le navigateur
- Apple touch icon correctement lié
- Open Graph meta tags pour le partage
- **Skills** : `/quick-dev`

### 3. Nettoyage des titres d'issues
- Parser les noms de fichiers Kapowarr intelligemment
- "Batman (2025) Volume 01 Issue 001" → titre "Batman" + numéro 1
- "Flash (2012) Volume 01 Issue 045" → titre "Flash" + numéro 45
- Afficher "#1", "#45" dans les cartes au lieu du titre complet
- Extraire l'année et le volume du nom de fichier
- **Skills** : `/quick-dev`

### 4. Tri et ordre des comics
- Trier les "Récemment ajoutés" par date réelle d'ajout au filesystem
- Trier les séries par : nom (défaut), nombre de volumes, dernière lecture
- Trier les volumes par numéro croissant (déjà fait, vérifier)
- **Skills** : `/quick-dev`

---

## Priorité moyenne — Expérience de lecture

### 5. Améliorations du lecteur
- Raccourci clavier Espace = page suivante
- Bouton plein écran natif (Fullscreen API)
- Slider de progression draggable (range input natif)
- Préchargement de 4 pages au lieu de 2
- Transition animée entre les pages (fade ou slide)
- Bouton de retour plus visible sur mobile
- **Skills** : `/feature-planner`, `/frontend-design`, `/impeccable`

### 6. Marquage lu/non lu
- Bouton marquer comme lu/non lu sur chaque volume (page série)
- Menu contextuel (clic droit ou long press) sur les cartes
- Marquer toute une série comme lue
- **Skills** : `/quick-dev`

### 7. Page "En cours de lecture"
- Page dédiée `/reading` accessible depuis la navigation
- Liste de tous les comics avec statut "reading"
- Indicateur de progression pour chaque comic
- Lien direct vers la reprise de lecture
- **Skills** : `/feature-planner`, `/frontend-design`

---

## Priorité basse — Polish et intégrations

### 8. Intégration Kapowarr
- Lien direct vers Kapowarr depuis le header ou la page paramètres
- Bouton "Ajouter sur Kapowarr" sur une page série (lien externe)
- Détection automatique de l'URL Kapowarr via variable d'env
- **Skills** : `/quick-dev`

### 9. Notifications et badges
- Badge "Nouveau" sur les comics ajoutés dans les dernières 24h
- Compteur de non-lus par série (badge sur la carte)
- Indicateur de scan en cours dans le header
- **Skills** : `/quick-dev`, `/frontend-design`

### 10. Raccourcis clavier globaux
- `/` ou `Ctrl+K` pour ouvrir la recherche (command palette)
- `Escape` pour revenir en arrière
- `←` `→` pour naviguer entre séries
- Documentation des raccourcis accessible via `?`
- **Skills** : `/feature-planner`, `/frontend-design`

### 11. Tri et filtres avancés dans la page séries
- Sélecteur de tri : nom, volumes, dernier lu, date d'ajout
- Tri ascendant/descendant
- Filtre par éditeur (si disponible dans les métadonnées)
- Persistance des préférences de tri (localStorage)
- **Skills** : `/quick-dev`

---

## Long terme — v2

### 12. Support PDF
- Rendu PDF côté serveur via pdf.js ou pdf2pic
- Même interface ComicExtractor que CBZ/CBR
- Tests de performance et mémoire sur ARM
- **Skills** : `/feature-planner`, `/sprint-planner`, `/dev-story`

### 13. Collections et tags
- Créer des collections manuelles (ex: "À lire cet été")
- Tags automatiques par éditeur (DC, Marvel, Image)
- Page de navigation par tags
- **Skills** : `/feature-planner`, `/sprint-planner`, `/dev-story`

### 14. Import métadonnées ComicVine
- Recherche de séries sur l'API ComicVine
- Import automatique : résumé, auteurs, éditeur, année
- Enrichissement des couvertures si ComicInfo.xml absent
- **Skills** : `/feature-planner`, `/sprint-planner`, `/dev-story`

### 15. Mode kiosque / tablette
- Interface simplifiée pour TV ou tablette murale
- Navigation par gestes uniquement (pas de clavier)
- Affichage grande grille avec couvertures dominantes
- Auto-rotation des "à lire" en screensaver
- **Skills** : `/feature-planner`, `/frontend-design`, `/sprint-planner`, `/dev-story`

---

## Workflow pour chaque feature

```
1. /feature-planner --new <nom>     → Plan + stories
2. /feature-planner --review <nom>  → Review adversariale
3. /feature-planner --finalize <nom>→ Plan final
4. /sprint-planner                  → Arborescence sprint
5. /dev-story --next                → Implémentation
6. /feature-doc --update            → Documentation
7. /frontend-design + /impeccable   → Design (si UI)
8. git push → rebuild docker        → Déploiement
```
