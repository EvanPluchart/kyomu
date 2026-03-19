# Strategies de correction — Fix Review Code

## Nommage

**Quand** : une variable, fonction, classe ou fichier ne respecte pas les conventions de nommage evan-workflow (scope `always` du manifeste).

**Strategie** :
- Renommer l'element selon la convention applicable (camelCase, PascalCase, snake_case, etc.)
- Mettre a jour toutes les references dans le fichier
- Verifier les imports dans les autres fichiers qui referencent cet element
- Si c'est un fichier qui doit etre renomme : renommer le fichier et mettre a jour tous les imports

**Ambiguite** : faible. Les conventions de nommage sont generalement sans ambiguite.

## Style

**Quand** : le code ne respecte pas les regles de `~/evan-workflow/technos/{stack}/code-style.md` ou les regles de style du scope `always` du manifeste evan-workflow.

**Strategie** :
- Reformater le code selon les regles applicables
- Respecter l'indentation, les espaces, les retours a la ligne
- Reorganiser les blocs si necessaire (ordre des methodes, groupement logique)

**Ambiguite** : faible. Les regles de style sont explicites.

## Type safety

**Quand** : des types sont manquants, incorrects ou trop permissifs (any, unknown non justifie).

**Strategie** :
- Ajouter les types manquants sur les parametres, retours de fonctions, variables
- Remplacer `any` par le type specifique quand il est deductible du contexte
- Ajouter les types de retour explicites sur les fonctions publiques
- Verifier la coherence avec les interfaces/types existants

**Ambiguite** : moyenne. Le type exact peut ne pas etre evident. Si le type est deductible du contexte → corriger. Sinon → demander au user.

## Pattern

**Quand** : le code ne suit pas le pattern evan-workflow defini dans `~/evan-workflow/technos/{stack}/patterns/`.

**Strategie** :
- Identifier le pattern applicable (component, service, entity, DTO, etc.)
- Refactorer le code pour suivre la structure du pattern
- Deplacer le code dans les bons fichiers si necessaire
- Respecter l'organisation prescrite par le pattern

**Ambiguite** : haute. Un refactoring de pattern peut avoir des effets de bord importants. Toujours demander confirmation sauf si le changement est trivial (ex: ajouter un type de retour manquant).

## Security

**Quand** : une faille de securite est detectee (injection, XSS, CSRF, exposition de secrets, etc.).

**Strategie** :
- Injection SQL : utiliser des requetes preparees / query builder
- XSS : echapper les sorties, utiliser les mecanismes du framework
- CSRF : activer la protection CSRF du framework
- Secrets : supprimer les secrets du code, utiliser des variables d'environnement
- Validation : ajouter la validation des entrees utilisateur

**Ambiguite** : faible pour les cas evidents (injection, XSS). Haute pour les cas subtils (logique d'autorisation). En cas de doute → demander au user.

## Import

**Quand** : les imports sont mal organises, dupliques, ou inutiles.

**Strategie** :
- Supprimer les imports inutilises
- Reorganiser les imports selon les conventions du stack (groupement, ordre alphabetique)
- Corriger les chemins d'import incorrects
- Fusionner les imports multiples du meme module

**Ambiguite** : faible. L'organisation des imports est generalement deterministe.

## Ordre de priorite des strategies

Lors de la correction, appliquer les strategies dans cet ordre :
1. **Security** — corriger les failles en priorite
2. **Type safety** — assurer la coherence des types
3. **Pattern** — aligner sur les patterns evan-workflow
4. **Nommage** — respecter les conventions
5. **Style** — reformater
6. **Import** — reorganiser les imports
