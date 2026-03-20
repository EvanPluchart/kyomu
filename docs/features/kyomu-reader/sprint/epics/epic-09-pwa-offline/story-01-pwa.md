---
id: "9.1"
title: "Configurer le manifest PWA et le service worker"
status: todo
size: M
depends_on: ["5.1"]
epic: "PWA et mode offline"
---

# Configurer le manifest PWA et le service worker

## Contexte
Kyomu doit etre installable comme une PWA sur iPhone et Android pour une experience de lecture native (pas de barre de navigateur, icone sur l'ecran d'accueil).

## Objectif
Configurer le manifest, les icones et le service worker pour rendre l'app installable et cacher les assets statiques.

## Criteres d'acceptation
- [ ] Manifest avec icones (192, 512, maskable), couleurs, display standalone
- [ ] Installable sur iPhone et Android
- [ ] Splash screen configure (Apple touch startup image)
- [ ] Service worker via serwist : cache des assets statiques (JS, CSS, fonts)
- [ ] Mode standalone (pas de barre de navigateur)
- [ ] Les API Routes ne sont PAS cachees par le service worker

## Fichiers cibles
- `public/manifest.json` - modifier - manifest PWA complet
- `public/icons/` - ajouter - icones 192, 512, maskable
- `src/app/layout.tsx` - modifier - meta tags PWA + apple-mobile-web-app
- `next.config.ts` - modifier - config serwist
- `src/sw.ts` - creer - service worker avec strategie de cache

## Notes d'implementation
- **serwist** : successeur de `next-pwa`. S'integre avec Next.js App Router. Config dans `next.config.ts`.
- **Strategie de cache** : `CacheFirst` pour les assets statiques (JS, CSS, fonts, icones). `NetworkFirst` ou `NetworkOnly` pour les API Routes.
- **Apple meta tags** : iOS ne supporte pas entierement le manifest. Il faut des meta tags specifiques :
  - `apple-mobile-web-app-capable`
  - `apple-mobile-web-app-status-bar-style`
  - `apple-touch-icon`
  - `apple-touch-startup-image` (splash screen)
- **Icones** : generer les tailles 192x192, 512x512 et une version maskable. Utiliser un generateur ou creer un simple icone avec le kanji 虚.

## Tests attendus
- [ ] L'app est installable sur iPhone (Add to Home Screen)
- [ ] L'app s'ouvre en mode standalone
- [ ] Les assets sont caches par le service worker
