# Regles de generation du CLAUDE.md

Reference pour la generation du CLAUDE.md par project-init.

## Base

Utiliser `~/evan-workflow/templates/CLAUDE.template.md` comme base. Remplir tous les placeholders.

## Regles toujours actives

Ces regles doivent TOUJOURS etre presentes dans le CLAUDE.md genere :

1. **Francais avec accents** : Tous les textes visibles par l'utilisateur doivent etre en francais correct avec accents. Ref: `~/evan-workflow/common/french-content.md`
2. **Docker pour Symfony** : Si le projet a un backend Symfony, TOUTES les commandes PHP/Composer passent par `docker compose exec {container}`. Ref: `~/evan-workflow/common/docker-conventions.md`

## Sections a decommenter

Selon le stack choisi, decommenter les sections pertinentes et ajouter les references :

### Si Next.js choisi

```markdown
### Frontend (Next.js)
- Index : `~/evan-workflow/technos/nextjs/index.md`
- Code style : `~/evan-workflow/technos/nextjs/code-style.md`
- Patterns : `~/evan-workflow/technos/nextjs/patterns/`
- Libs : `~/evan-workflow/technos/nextjs/libs/`
```

Ajouter les libs specifiques choisies :
```markdown
#### Libs frontend
- {lib} : `~/evan-workflow/technos/nextjs/libs/{lib}.md`
```

### Si Symfony choisi

```markdown
### Backend (Symfony)
- Index : `~/evan-workflow/technos/symfony/index.md`
- Code style : `~/evan-workflow/technos/symfony/code-style.md`
- Patterns : `~/evan-workflow/technos/symfony/patterns/`
- Migrations : `~/evan-workflow/common/doctrine-migrations.md`
- Docker : `~/evan-workflow/common/docker-conventions.md`
```

### Si API Platform choisi

```markdown
### API (API Platform)
- Index : `~/evan-workflow/technos/apiplatform/index.md`
- Patterns : `~/evan-workflow/technos/apiplatform/patterns/`
```

### Pour les technos avec placeholder uniquement

Ajouter une note :

```markdown
### {Techno}
- Index : `~/evan-workflow/technos/{techno}/index.md` (placeholder — a completer)
```

### Pour les technos sans documentation evan-workflow

Ajouter un commentaire :

```markdown
<!-- {Techno} : pas encore documente dans evan-workflow.
     Lancer /evan-workflow-builder --add-stack {techno} pour ajouter la documentation. -->
```

## Conventions de branches

Selon l'outil de tickets choisi :

### Jira
```markdown
- **Format** : `type/{PREFIX}-XXX-description`
- **Commits** : `Type - #{PREFIX}-XXX - Description`
```

### Linear
```markdown
- **Format** : `type/{PREFIX}-XXX-description`
- **Commits** : `Type - {PREFIX}-XXX - Description`
```

### GitHub Issues
```markdown
- **Format** : `type/GH-XXX-description`
- **Commits** : `Type - #XXX - Description`
```

### GitLab Issues
```markdown
- **Format** : `type/GL-XXX-description`
- **Commits** : `Type - #XXX - Description`
```

### Pas de tickets
```markdown
- **Format** : `type/description-courte`
- **Commits** : `Type - Description`
```

## Skills a recommander

### Toujours recommandes
- feature-planner, sprint-planner, dev-story, quick-dev, code-review

### Si backend avec API
- api-test-gen

### Si Jira
- dev-jira-ticket

### Si projet existant a documenter
- onboard-project, feature-doc

### Si projet mature
- dependency-audit, refactor-planner, tech-debt-tracker

### Si migration prevue
- migration-planner

### Si tests a developper
- test-coverage-analyzer
