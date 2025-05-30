# Build stage
FROM node:20-alpine AS builder

WORKDIR /app/server

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/

COPY . .

RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app/server

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/server/prisma ./prisma
COPY --from=builder /app/server/dist ./dist

EXPOSE 3001

CMD ["sh", "-c", "pnpm run prisma:migrate:deploy && pnpm run prisma:generate && pnpm run start:prod"]