FROM node:22-alpine AS base
RUN npm install -g pnpm@11

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml .npmrc pnpm-lock.yaml ./
COPY schedule-service/package.json schedule-service/
RUN pnpm install --frozen-lockfile --registry=https://registry.npmjs.org/

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/schedule-service/node_modules ./schedule-service/node_modules
COPY schedule-service/ ./schedule-service/
COPY package.json pnpm-workspace.yaml .npmrc ./
WORKDIR /app/schedule-service
RUN npx prisma generate
RUN ./node_modules/.bin/nest build
RUN test -f /app/schedule-service/dist/main.js || (echo "BUILD FAILED: dist/main.js not found, listing dist:" && find /app/schedule-service/dist -type f && exit 1)

FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/schedule-service/node_modules ./schedule-service/node_modules
COPY --from=builder /app/schedule-service/dist ./schedule-service/dist
COPY --from=builder /app/schedule-service/package.json ./schedule-service/package.json
COPY --from=builder /app/schedule-service/prisma.config.ts ./schedule-service/prisma.config.ts
COPY --from=builder /app/schedule-service/src/common/thirdparties/prisma ./schedule-service/src/common/thirdparties/prisma

WORKDIR /app/schedule-service
EXPOSE 3002
CMD ["node", "dist/main"]
