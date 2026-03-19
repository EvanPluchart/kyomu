# Catalogue des technos — project-init

Reference pour les propositions de technos dans le questionnaire interactif.

Legende :
- `[doc]` — Documentation complete dans `~/evan-workflow/technos/`
- `[placeholder]` — Placeholder existe, documentation a completer
- _(rien)_ — Pas dans evan-workflow, proposer de documenter si choisi

---

## Frontend — Frameworks

| Techno | Status | Quand proposer | Description courte |
|--------|--------|---------------|-------------------|
| Next.js 16 | [doc] | Web app, site vitrine | SSR/SSG, App Router, React 19, le plus populaire |
| React SPA (Vite) | — | Web app simple, SPA | SPA pur, build rapide, pas de SSR |
| Astro | — | Site vitrine, blog, docs | Sites statiques, multi-framework, ultra-rapide |
| Nuxt.js | — | Web app (Vue.js) | Equivalent Next.js pour Vue |
| Remix | — | Web app avec forms | Web standards, nested routing |
| SvelteKit | — | Web app (Svelte) | Compilateur, reactif, performant |
| Expo | [placeholder] | App mobile | React Native, build cloud, OTA updates |
| Electron | [placeholder] | App desktop | Desktop avec web tech, ecosysteme large |
| Tauri | [placeholder] | App desktop | Desktop avec Rust, leger, securise |

## Frontend — Styling

| Techno | Status | Description courte |
|--------|--------|-------------------|
| Chakra UI v3 | [doc] | Composants accessibles, theming puissant, emotion-based |
| Chakra UI v2 | [doc] | Version stable, large ecosystem de composants |
| Tailwind CSS | [placeholder] | Utility-first, tres flexible, populaire |
| shadcn/ui | [placeholder] | Composants copiables + Tailwind + Radix UI |
| Material UI (MUI) | — | Design system Google, mature, complet |
| Mantine | — | Composants modernes, 100+ hooks, bon DX |
| Ant Design | — | Design system enterprise, riche en composants |
| Styled Components | — | CSS-in-JS classique, bonnes abstractions |
| CSS Modules | — | CSS scope natif, zero runtime |
| Panda CSS | — | Build-time CSS-in-JS, zero runtime, type-safe |

## Backend — Frameworks

| Techno | Status | Quand proposer | Description courte |
|--------|--------|---------------|-------------------|
| Symfony + API Platform | [doc] | API backend PHP, enterprise | PHP, robuste, API auto-generee, admin, docs |
| Node.js (Express) | [placeholder] | API backend JS, simple | Minimaliste, ecosystem massif |
| Node.js (Fastify) | [placeholder] | API backend JS, perf | Schema-first, plugins, 2x plus rapide qu'Express |
| Node.js (Hono) | [placeholder] | API backend JS, edge | Ultra-leger, multi-runtime (Bun, Deno, CF Workers) |
| tRPC | [placeholder] | Full-stack TS, pas d'API REST | Type-safe end-to-end, zero schema |
| Nest.js | — | API backend JS, structure | Architecture modulaire Angular-like, DI, decorators |
| Django | — | Backend Python, rapide | Batteries included, admin, ORM |
| FastAPI | — | Backend Python, API | Async, type hints, docs auto (OpenAPI) |
| Go (Gin/Echo) | — | Backend Go, microservices | Performant, compile, ideal microservices |
| Laravel | — | Backend PHP, rapid dev | PHP, eloquent ORM, ecosystem riche |

## Bases de donnees

| Techno | Status | Description courte |
|--------|--------|-------------------|
| PostgreSQL | [placeholder] | Robuste, JSONB, full-text search, extensible |
| SQLite | — | Zero config, embedded, ideal prototypage/mobile |
| MySQL / MariaDB | — | Populaire, performant en lecture, mature |
| MongoDB | — | NoSQL documents, schema flexible, horizontal scale |
| Redis | — | In-memory, cache, pub/sub, queues |
| Supabase | — | BaaS PostgreSQL, auth + realtime + storage inclus |
| Turso (libSQL) | — | SQLite distribue, edge, tier gratuit genereux |
| PlanetScale | — | MySQL serverless, branching, tier gratuit |

## ORM / Query builders

| Techno | Status | Quand proposer | Description courte |
|--------|--------|---------------|-------------------|
| Doctrine | [doc] | Symfony | PHP, mature, migrations auto, unit of work |
| Prisma | [placeholder] | Node.js / Next.js | Schema declaratif, migrations, type-safe |
| Drizzle | [placeholder] | Node.js / Next.js | SQL-like, leger, type-safe, pas de codegen |
| TypeORM | — | Node.js (NestJS) | Decorators, inspire de Doctrine, active record |
| Kysely | — | Node.js | Query builder type-safe, pas d'ORM |
| Knex.js | — | Node.js | Query builder mature, migrations |

## State management / Data fetching

| Techno | Status | Description courte |
|--------|--------|-------------------|
| RTK Query | [doc] | Cache API integre Redux, normalisation auto, mature |
| TanStack Query | [doc libs] | Cache API leger et flexible, le plus populaire |
| Zustand | [placeholder] | State simple, zero boilerplate, flux-inspired |
| Jotai | — | Atoms pour state granulaire, minimal, bottom-up |
| Valtio | — | State par proxy, mutations directes, reactif |
| SWR | — | Data fetching par Vercel, stale-while-revalidate |
| Recoil | — | Atoms + selectors, par Meta, concurrent mode |
| Redux Toolkit | — | State global complet, actions, reducers, devtools |
| Nanostores | — | Ultra-leger (300B), framework-agnostic |

## Tests

| Techno | Status | Quand proposer | Description courte |
|--------|--------|---------------|-------------------|
| Vitest | — | Frontend / Node.js | Rapide, compatible Vite, ESM natif, API Jest-like |
| Jest | [doc testing] | Frontend / Node.js | Mature, large ecosystem, snapshot testing |
| PHPUnit | [doc testing] | Symfony / PHP | Standard PHP, assertions riches |
| Playwright | [MCP] | Tests E2E | Multi-navigateur, auto-wait, codegen |
| Cypress | — | Tests E2E | Bonne DX, time-travel debugging |
| Testing Library | — | Tests composants | Tests orientes utilisateur, framework-agnostic |
| Pest | — | PHP (alternative PHPUnit) | Syntaxe expressive, architecture plugins |

## Gestion de tickets

| Outil | Description courte |
|-------|-------------------|
| Jira | Enterprise, workflow complexe, sprints (prefix: CODE-XXX) |
| Linear | Moderne, rapide, integrations dev (prefix: XXX) |
| GitHub Issues | Integre dans GitHub, simple, projets kanban |
| GitLab Issues | Integre dans GitLab, boards, epics |
| Notion | Flexible, databases, bon pour petites equipes |
| Shortcut | Equilibre Jira/Linear, bon pour equipes moyennes |

## Outils complementaires

| Outil | Status | Description courte |
|-------|--------|-------------------|
| Docker | [placeholder] | Containerisation, environnements reproductibles |
| Bruno | [doc tools] | Tests API, alternative Postman, versionnable |
| grepai | [doc tools] | Recherche semantique de code |
| Biome | [hook] | Formatter + linter JS/TS, rapide |
| ESLint + Prettier | [hook] | Linter + formatter, configurable |
| PHP-CS-Fixer | [hook] | Formatter PHP, standards PSR |
| PHPStan | — | Analyse statique PHP, niveaux 0-9 |
| Storybook | — | Dev UI isole, documentation composants |
| Turborepo | — | Monorepo build system, caching |
