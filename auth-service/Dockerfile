FROM node:22-alpine AS base
RUN npm install -g pnpm@11

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml .npmrc pnpm-lock.yaml ./
COPY auth-service/package.json auth-service/
RUN pnpm install --frozen-lockfile --registry=https://registry.npmjs.org/

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/auth-service/node_modules ./auth-service/node_modules
COPY auth-service/ ./auth-service/
COPY package.json pnpm-workspace.yaml .npmrc ./
WORKDIR /app/auth-service
RUN npx prisma generate
RUN rm -rf dist && rm -f *.tsbuildinfo tsconfig*.tsbuildinfo
RUN ./node_modules/.bin/nest build

FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/auth-service/node_modules ./auth-service/node_modules
COPY --from=builder /app/auth-service/dist ./auth-service/dist
COPY --from=builder /app/auth-service/package.json ./auth-service/package.json
COPY --from=builder /app/auth-service/prisma.config.ts ./auth-service/prisma.config.ts
COPY --from=builder /app/auth-service/src/common/thirdparties/prisma ./auth-service/src/common/thirdparties/prisma

WORKDIR /app/auth-service
EXPOSE 3001
CMD ["node", "dist/src/main"]
