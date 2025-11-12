FROM oven/bun:1-alpine AS base

FROM base AS deps
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY package.json ./
RUN bun install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["bun", "run", "./dist/server/entry.mjs"]
