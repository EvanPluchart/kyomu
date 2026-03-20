# Stage 1 - base
FROM node:20-slim AS base
RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Stage 2 - deps
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Stage 3 - build
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Stage 4 - runner
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    unrar-free \
  && rm -rf /var/lib/apt/lists/*

RUN groupadd --system nodejs && useradd --system --gid nodejs nextjs

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs

ENV HOSTNAME="0.0.0.0"
ENV PORT="3000"
ENV NODE_ENV="production"

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>{if(!r.ok)throw r})" || exit 1

CMD ["node", "server.js"]
