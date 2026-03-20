---
id: "3.4"
title: "Creer la factory d'extracteurs et les API Routes de pages"
status: todo
size: M
depends_on: ["3.1", "3.2", "3.3", "1.2"]
epic: "Extraction de comics"
---

# Creer la factory d'extracteurs et les API Routes de pages

## Contexte
Les trois extracteurs (CBZ, CBR, folder) partagent la meme interface. Il faut une factory qui choisit le bon extracteur, et des API Routes pour servir les pages aux clients.

## Objectif
Avoir une factory d'extracteurs et des endpoints HTTP pour lister et servir les pages d'un comic.

## Criteres d'acceptation
- [ ] Factory `getExtractor(comic)` retourne le bon extracteur selon le format
- [ ] `GET /api/comics/[id]/pages` retourne la liste des pages (nombre)
- [ ] `GET /api/comics/[id]/pages/[page]` retourne l'image streamee
- [ ] Headers `Cache-Control: public, max-age=31536000, immutable` sur les pages
- [ ] Content-Type correct selon le format de l'image
- [ ] 404 si comic ou page introuvable, 500 si erreur d'extraction

## Fichiers cibles
- `src/lib/services/extractors/factory.ts` - creer - factory pattern
- `src/app/api/comics/[id]/pages/route.ts` - creer - liste des pages
- `src/app/api/comics/[id]/pages/[page]/route.ts` - creer - image d'une page

## Notes d'implementation
- **Factory** : switch sur `comic.format` (`cbz` -> CbzExtractor, `cbr` -> CbrExtractor, `folder` -> FolderExtractor)
- **Cache immutable** : les pages d'un comic ne changent jamais, donc cache longue duree
- **Content-Type** : detecter depuis l'extension ou les magic bytes (jpg = `image/jpeg`, png = `image/png`, webp = `image/webp`)
- **Streaming** : utiliser `new Response(stream)` de Next.js pour streamer l'image sans la buffer entierement
- **Attention** : ne pas oublier `extractor.close()` apres usage (surtout CBR qui a un dossier temp)

## Tests attendus
- [ ] Factory retourne le bon extracteur pour chaque format
- [ ] API retourne une image valide
- [ ] 404 pour un comic inexistant
- [ ] Headers Cache-Control corrects
