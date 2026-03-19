# Templates .claudeignore par stack

## Base commune (toujours inclure)

```
# OS
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Git
.git/
```

## Next.js / React

```
# Dependencies
node_modules/

# Build
.next/
dist/
build/
out/

# Lock files
pnpm-lock.yaml
package-lock.json
yarn.lock
bun.lockb

# Assets binaires
public/uploads/
*.png
*.jpg
*.jpeg
*.gif
*.ico
*.svg
*.woff
*.woff2
*.ttf
*.eot

# Coverage
coverage/

# Storybook
storybook-static/

# Env (garder .env.example)
.env.local
.env.production
```

## Symfony / PHP

```
# Dependencies
vendor/

# Cache et logs
var/cache/
var/log/
var/sessions/

# Lock files
composer.lock
symfony.lock

# PHPUnit
.phpunit.result.cache
.phpunit.cache/

# Docker data
docker-data/

# Uploads
public/uploads/

# Migrations (decommenter si trop nombreuses)
# migrations/
```

## Fullstack (Next.js + Symfony)

Combiner les deux templates ci-dessus. Ajouter :

```
# Monorepo specifique
**/node_modules/
**/vendor/
**/var/cache/
**/var/log/
**/.next/
```

## Node.js Backend (Express/Fastify/Hono)

```
# Dependencies
node_modules/

# Build
dist/
build/

# Lock files
pnpm-lock.yaml
package-lock.json
yarn.lock

# Env
.env
.env.local
.env.production

# Logs
logs/
*.log

# Coverage
coverage/

# Prisma (si utilise)
prisma/migrations/
```

## Mobile (Expo / React Native)

```
# Dependencies
node_modules/

# Build
android/app/build/
ios/Pods/
ios/build/
.expo/

# Lock files
pnpm-lock.yaml
package-lock.json
yarn.lock

# Assets binaires
assets/images/
*.png
*.jpg
*.gif
```

## Desktop (Electron)

```
# Dependencies
node_modules/

# Build
dist/
out/
release/
build/

# Lock files
pnpm-lock.yaml
package-lock.json
yarn.lock

# Binaires
*.exe
*.dmg
*.AppImage
*.deb
*.rpm
```

## Desktop (Tauri)

```
# Dependencies
node_modules/
target/

# Build
src-tauri/target/
dist/

# Lock files
pnpm-lock.yaml
package-lock.json
Cargo.lock
```

## CLI / Outil

```
# Dependencies
node_modules/

# Build
dist/
build/

# Lock files
pnpm-lock.yaml
package-lock.json

# Binaires
bin/
*.exe
```
