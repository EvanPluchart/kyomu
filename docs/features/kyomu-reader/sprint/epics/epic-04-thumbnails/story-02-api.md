---
id: "4.2"
title: "Creer l'API Route des thumbnails"
status: todo
size: S
depends_on: ["4.1"]
epic: "Thumbnails"
---

# Creer l'API Route des thumbnails

## Contexte
L'interface a besoin de servir les thumbnails via des URLs previsibles pour les images de couverture dans les grilles.

## Objectif
Exposer des routes HTTP pour les thumbnails de comics et de series, avec generation a la volee et placeholder de fallback.

## Criteres d'acceptation
- [ ] `GET /api/comics/[id]/thumbnail` retourne le thumbnail du comic
- [ ] `GET /api/library/series/[id]/thumbnail` retourne le thumbnail de la serie
- [ ] Genere a la volee si le thumbnail n'existe pas (puis le cache)
- [ ] Headers `Cache-Control: public, max-age=86400`
- [ ] Retourne une image placeholder SVG si erreur

## Fichiers cibles
- `src/app/api/comics/[id]/thumbnail/route.ts` - creer - thumbnail comic
- `src/app/api/library/series/[id]/thumbnail/route.ts` - creer - thumbnail serie
- `public/placeholder-cover.svg` - creer - placeholder generique

## Notes d'implementation
- **Thumbnail serie** : chercher le premier comic de la serie (ORDER BY number ASC), retourner son thumbnail
- **Generation a la volee** : si le fichier thumbnail n'existe pas sur disque, le generer, le sauver, puis le retourner
- **Placeholder SVG** : un rectangle gris avec un icone de livre, en SVG inline pour zero dependance
- **Cache 1 jour** : le thumbnail peut changer apres un rescan (nouveau fichier, meilleure couverture)

## Tests attendus
- [ ] Route retourne une image valide
- [ ] Route retourne le placeholder si comic inexistant
- [ ] Headers Cache-Control corrects
