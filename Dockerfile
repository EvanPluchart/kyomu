# Stage 1 - build
FROM node:22-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true

WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
# pnpm skips build scripts — build better-sqlite3 manually
RUN cd node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3 && npm run build-release

COPY . .
RUN pnpm build

# Stage 2 - runner
FROM node:22-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    unrar-free \
    poppler-utils \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/drizzle ./drizzle

# Copy node_modules with symlinks preserved
RUN --mount=from=build,source=/app/node_modules,target=/tmp/nm cp -a /tmp/nm ./node_modules

COPY start.sh ./
RUN chmod +x start.sh

RUN mkdir -p /app/data

ENV HOSTNAME="0.0.0.0"
ENV PORT="3000"
ENV NODE_ENV="production"

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>{if(!r.ok)throw r})" || exit 1

CMD ["./start.sh"]
