# Build stage
FROM node:20-alpine AS builder

WORKDIR /app/client

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app/client

COPY package*.json ./

RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /app/client/.next ./.next
COPY --from=builder /app/client/public ./public
COPY --from=builder /app/client/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]