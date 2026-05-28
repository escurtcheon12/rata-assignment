# Auth Service

GraphQL authentication service (NestJS + Prisma + Postgres + Redis).

## Endpoints

- GraphQL Playground: `http://localhost:3001/graphql`

## Environment Variables

This service expects:

- `PORT` (default `3001`)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRED`

## Run With Docker

From the repo root:

```bash
docker compose up -d --build postgres redis auth-service
docker compose exec -T postgres psql -U postgres -d rata -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
docker compose exec -T auth-service sh -lc "npx prisma db push --accept-data-loss --config prisma.config.ts"
docker compose restart auth-service
```

Logs:

```bash
docker compose logs -f auth-service
```

## Run Manually (Local Node.js)

From the repo root:

```bash
pnpm install
docker compose up -d postgres redis
cd auth-service
npx prisma db push --accept-data-loss --config prisma.config.ts
pnpm run start:dev
```
