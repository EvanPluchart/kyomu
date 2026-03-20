---
id: "9.2"
title: "Implementer le telechargement offline de comics"
status: todo
size: L
depends_on: ["9.1", "6.1"]
epic: "PWA et mode offline"
---

# Implementer le telechargement offline de comics

## Contexte
L'utilisateur veut pouvoir telecharger des comics pour les lire sans connexion (dans le metro, en avion). iOS Safari limite le stockage IndexedDB a ~50 Mo par origine.

## Objectif
Permettre le telechargement de comics pour lecture offline, avec gestion de l'espace de stockage.

## Criteres d'acceptation
- [ ] Bouton "Telecharger" sur la page detail serie (par volume)
- [ ] Pages en resolution reduite (800px, webp qualite 70) dans IndexedDB
- [ ] Barre de progression du telechargement
- [ ] Badge "Hors ligne" sur les comics telecharges
- [ ] Le lecteur sert depuis IndexedDB si offline
- [ ] Page "Mes telechargements" : liste, espace utilise, bouton supprimer
- [ ] Avertissement si espace > 40 Mo (limite iOS)

## Fichiers cibles
- `src/lib/services/offline-storage.ts` - creer - gestion IndexedDB
- `src/components/library/offline-button.tsx` - creer - bouton telecharger
- `src/components/library/offline-badge.tsx` - creer - badge disponible offline
- `src/app/(library)/downloads/page.tsx` - creer - page mes telechargements
- `src/hooks/use-offline-comic.ts` - creer - hook pour detecter disponibilite offline

## Notes d'implementation
- **IndexedDB** : utiliser `idb` (wrapper Promise pour IndexedDB). Stocker chaque page comme un Blob dans un object store.
- **Resolution reduite** : cote serveur, ajouter un query param `?width=800&quality=70` sur l'API de pages. Le serveur redimensionne via sharp avant d'envoyer.
- **Telechargement** : telecharger les pages une par une (pas tout d'un coup) avec une barre de progression
- **Detection offline** : `navigator.onLine` + event listeners `online`/`offline`. Le hook `use-offline-comic` verifie si le comic est dans IndexedDB.
- **Espace** : `navigator.storage.estimate()` pour estimer l'espace utilise. Afficher en Mo.
- **Avertissement iOS** : au-dela de 40 Mo, iOS peut purger le cache sans prevenir. Afficher un warning.
- **Suppression** : supprimer toutes les pages d'un comic de IndexedDB en un clic

## Tests attendus
- [ ] Le telechargement stocke les pages dans IndexedDB
- [ ] Le lecteur lit depuis IndexedDB quand offline
- [ ] La page telechargements liste les comics offline
- [ ] La suppression fonctionne
