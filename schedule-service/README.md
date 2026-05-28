# Schedule Service

GraphQL scheduling service (customers, doctors, schedules) built with NestJS + Prisma + Postgres + Redis.

## Endpoints

- GraphQL Playground: `http://localhost:3002/graphql`

## Environment Variables

This service expects:

- `PORT` (default `3002`)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRED`
- `EMAIL_USER`, `EMAIL_PASSWORD` (for notification emails)

## Run With Docker

From the repo root:

```bash
docker compose up -d --build postgres redis schedule-service
docker compose exec -T postgres psql -U postgres -d rata -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
docker compose exec -T schedule-service sh -lc "npx prisma db push --accept-data-loss --config prisma.config.ts"
docker compose restart schedule-service
```

Logs:

```bash
docker compose logs -f schedule-service
```

## Run Manually (Local Node.js)

From the repo root:

```bash
pnpm install
docker compose up -d postgres redis
cd schedule-service
npx prisma db push --accept-data-loss --config prisma.config.ts
pnpm run start:dev
```
