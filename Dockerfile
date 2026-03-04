# -------------------------
# Base build image
# -------------------------
FROM node:24.14.0-bookworm AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

# -------------------------
# Dependencies (all)
# -------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# -------------------------
# Build
# -------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm exec node ace build

# -------------------------
# Production dependencies only
# -------------------------
FROM base AS production-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prod

# -------------------------
# Runtime (production)
# -------------------------
FROM node:24.14.0-bookworm-slim AS production
ENV NODE_ENV=production
WORKDIR /app

COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY package.json ./

# # ⚠️ Si CHANGELOG.md n'existe pas toujours, ça fera échouer le build.
# # Soit tu le gardes en t'assurant qu'il existe, soit tu le retires.
# COPY CHANGELOG.md ./build/public

EXPOSE 3333

WORKDIR /app/build
CMD ["node", "bin/server.js"]