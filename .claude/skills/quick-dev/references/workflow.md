# Quick Dev — Workflow Reference

## Arbre de decision

```
User decrit un changement
        |
        v
Evaluer la complexite
        |
   +----+----+
   |         |
  Petit    Gros (>5-6 fichiers, nouveau domaine)
   |         |
   v         v
Continuer  Suggerer /feature-planner
   |
   v
Detecter le stack
   |
   v
Charger les docs evan-workflow du stack
   |
   v
Scanner les fichiers concernes
   |
   v
Implementer (selon le mode)
   |
   +--- Mode A : Edit direct → proposer commit
   +--- Mode B : Edit direct → commit auto
   +--- Mode C : Dry run → decrire les changements
   |
   v
Verifier l'impact
   |
   v
Commit (selon le mode)
```

## Criteres de complexite

Un changement est adapte a quick-dev si :
- Il touche 1 a 5 fichiers maximum
- Il ne necessite pas de nouveau domaine metier
- Il ne change pas l'architecture existante
- Il peut etre decrit en 1-2 phrases
- Il ne necessite pas de migration de base de donnees complexe

Un changement necessite /feature-planner si :
- Il touche plus de 5-6 fichiers
- Il introduit un nouveau concept metier
- Il modifie l'architecture (nouveau module, nouveau service, nouveau pattern)
- Il necessite une planification en plusieurs etapes

## Chargement adaptatif du contexte

Selon le stack detecte, charger uniquement :

### Stack Symfony / API Platform
- `~/evan-workflow/technos/symfony/code-style.md`
- `~/evan-workflow/technos/symfony/patterns/` (seulement les patterns concernes)
- `~/evan-workflow/technos/apiplatform/patterns/` (si API impactee)

### Stack Next.js
- `~/evan-workflow/technos/nextjs/code-style.md`
- `~/evan-workflow/technos/nextjs/patterns/` (seulement les patterns concernes)
- `~/evan-workflow/technos/nextjs/libs/` (seulement les libs utilisees)

### Stack Expo
- `~/evan-workflow/technos/expo/` (docs pertinentes)

### Toujours charger
Lire `~/evan-workflow/common/manifest.yaml` et charger :
- Scope `always` : conventions transverses (nommage, code style, francais...)
- Scopes pertinents au projet : `frontend`, `backend`
- Scope `commit` : au moment du commit

## Format du commit

Le message de commit doit suivre les conventions du scope `commit` du manifeste evan-workflow. Le commit doit etre atomique : un seul commit representant l'ensemble du changement.
