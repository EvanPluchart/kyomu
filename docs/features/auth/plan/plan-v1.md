# Plan v1 : Authentification unique

> Date : 2026-03-21
> Statut : final
> Complexite : moyenne (5 stories)

## Contexte

Kyomu est deploye sur un domaine public. Il faut proteger l'acces avec un compte unique cree au premier lancement.

## Architecture

- Table `auth_users` : id, username, password_hash, session_token, created_at
- Password hashé avec crypto.subtle (Web Crypto API, pas de bcrypt = pas de dep native)
- Session : token random stocké en DB + cookie httpOnly secure
- Middleware Next.js : vérifie le cookie sur chaque requête
- Routes publiques : /login, /api/auth/*, /api/health, /_next/*, /favicon.*, /icons/*, /manifest.json, /sw.js

## Decisions

- **Pas de bcrypt** : nécessite une dep native, complique le Docker. On utilise PBKDF2 via Web Crypto API (standard, pas de dep)
- **Session token en DB** : permet de révoquer les sessions, pas besoin de JWT
- **OPDS auth basique** : les clients OPDS envoient username:password en header Authorization, on vérifie en DB
- **Un seul utilisateur auth** : les profils restent pour le multi-lecture, l'auth protege l'accès global

## Stories

### Story 1 : Schema DB + helpers crypto (M)
- Table `auth_users` dans schema.ts
- Migration Drizzle
- Helper `hashPassword(password)` et `verifyPassword(password, hash)` via PBKDF2
- Helper `generateSessionToken()` via crypto.randomUUID

### Story 2 : API auth (M)
- GET /api/auth/status → `{ configured: boolean, authenticated: boolean }`
- POST /api/auth/register → créer le compte (seulement si aucun compte n'existe)
- POST /api/auth/login → vérifier credentials, créer session, set cookie
- POST /api/auth/logout → supprimer session, clear cookie

### Story 3 : Middleware Next.js (L)
- Middleware qui intercepte TOUTES les requêtes
- Vérifie le cookie `kyomu-session`
- Si pas de cookie ou session invalide → redirect vers /login
- Routes publiques exclues
- OPDS : vérifier aussi le header Authorization Basic

### Story 4 : Page login + modification onboarding (M)
- Page /login avec formulaire username/password
- Si aucun compte n'existe → afficher le formulaire d'inscription
- Si compte existe → afficher le formulaire de connexion
- Redirect vers / après login/register
- Modifier le wizard onboarding pour inclure la création du compte

### Story 5 : Indicateur auth dans le header (S)
- Bouton logout dans les paramètres
- Ou dans le menu profil

## Ordre
1. Story 1 (DB + crypto)
2. Story 2 (API)
3. Story 3 (Middleware)
4. Story 4 (Pages)
5. Story 5 (Header)
