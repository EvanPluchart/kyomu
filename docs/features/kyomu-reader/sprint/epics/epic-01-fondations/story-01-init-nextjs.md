---
id: "1.1"
title: "Initialiser le projet Next.js avec Tailwind et shadcn/ui"
status: todo
size: M
depends_on: []
epic: "Fondations"
---

# Initialiser le projet Next.js avec Tailwind et shadcn/ui

## Contexte
Kyomu est un projet greenfield. Toute l'infrastructure frontend doit etre creee from scratch : Next.js App Router, Tailwind CSS, shadcn/ui, TypeScript strict, ESLint/Prettier.

## Objectif
Avoir un projet Next.js fonctionnel avec le design system en place, pret pour le developpement des features.

## Criteres d'acceptation
- [ ] `pnpm dev` lance le serveur sans erreur
- [ ] Tailwind fonctionne (classe utilitaire visible)
- [ ] Un composant shadcn/ui (Button) s'affiche correctement
- [ ] TypeScript strict active, path alias `@/` configure
- [ ] ESLint + Prettier configures

## Fichiers cibles
- `package.json` - creer - dependances Next.js, Tailwind, TypeScript
- `pnpm-lock.yaml` - generer - lockfile
- `next.config.ts` - creer - config Next.js avec standalone output
- `tailwind.config.ts` - creer - config Tailwind avec shadcn preset
- `tsconfig.json` - creer - TypeScript strict + path aliases
- `src/app/layout.tsx` - creer - layout racine minimal
- `src/app/page.tsx` - creer - page d'accueil placeholder
- `src/lib/utils.ts` - creer - utilitaire cn() pour shadcn
- `components.json` - creer - config shadcn/ui

## Patterns et references
- `~/evan-workflow/technos/nextjs/code-style.md`
- `~/evan-workflow/common/code-style-rules.md`

## Notes d'implementation
- Utiliser `pnpm` comme gestionnaire de paquets
- Next.js avec App Router (pas Pages Router)
- Configurer `output: 'standalone'` dans next.config.ts des le depart (necessaire pour Docker)
- shadcn/ui : initialiser avec `pnpm dlx shadcn@latest init` puis ajouter Button comme premier composant
- Path alias `@/` pointe vers `src/`

## Tests attendus
- [ ] `pnpm dev` demarre sans erreur
- [ ] `pnpm build` compile sans erreur
- [ ] `pnpm lint` passe sans warning
