# Analyse de ticket Jira — Reference

## Checklist d'analyse

Lors de la lecture d'un ticket Jira, extraire systematiquement les informations suivantes :

### 1. Identification

- **ID du ticket** : le numero de reference (ex: PROJ-123)
- **Type** : bug, feature, improvement, technical debt, spike
- **Priorite** : si indiquee dans le ticket

### 2. Comprehension fonctionnelle

- **Quoi** : que doit faire le changement ?
- **Pourquoi** : quel est le besoin metier ou le probleme a resoudre ?
- **Pour qui** : quel utilisateur/role est concerne ?
- **Ou** : quelle partie de l'application est impactee ?

### 3. Acceptance criteria

Lister les criteres d'acceptation :
- Si presents dans le ticket : les reprendre tels quels
- Si absents : les deduire de la description et les valider avec le user

Chaque critere doit etre verifiable apres implementation.

### 4. Scope technique

- **Fichiers impactes** : identifier a partir de la description et du scan du codebase
- **Domaines concernes** : front, back, API, base de donnees, config
- **Stack(s)** : Symfony, Next.js, Expo, etc.
- **Dependances** : autres tickets lies, librairies externes

### 5. Evaluation de complexite

| Complexite | Criteres | Action |
|-----------|----------|--------|
| Simple | 1-3 fichiers, changement localise | Continuer avec dev-jira-ticket |
| Moyenne | 4-8 fichiers, un seul domaine | Continuer avec dev-jira-ticket |
| Complexe | >8 fichiers, multiple domaines | Suggerer /feature-planner |
| Architecturale | Nouveau module, changement de pattern | Suggerer /feature-planner |

### 6. Zones d'ombre

Identifier les points qui necessitent clarification :
- Comportement non specifie dans un edge case
- Choix technique non explicite (ex: quelle lib utiliser)
- Interaction avec d'autres fonctionnalites non documentee
- Contraintes de performance ou de securite non mentionnees

Poser **3 a 5 questions ciblees** maximum. Chaque question doit :
- Avoir un impact direct sur l'implementation
- Ne pas etre deductible du contexte existant
- Etre formulee avec des options si possible (ex: "Faut-il A ou B ?")

## Types de tickets et approche

### Bug
1. Reproduire le probleme (comprendre le chemin de reproduction)
2. Identifier la cause racine
3. Corriger sans regression
4. Verifier que le bug est bien corrige selon les acceptance criteria

### Feature
1. Comprendre le besoin metier complet
2. Identifier tous les composants a creer/modifier
3. Implementer en suivant les patterns evan-workflow
4. Verifier les acceptance criteria

### Improvement
1. Comprendre le comportement actuel
2. Comprendre le comportement souhaite
3. Implementer le delta
4. S'assurer de la retro-compatibilite si necessaire

### Technical debt
1. Identifier le code concerne
2. Comprendre pourquoi c'est de la dette technique
3. Refactorer en suivant les patterns evan-workflow
4. Verifier que le comportement est preserve
