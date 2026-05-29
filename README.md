# Rata Assignment Test

Monorepo with two NestJS GraphQL services:

- Auth Service: `http://localhost:3001/graphql`
- Schedule Service: `http://localhost:3002/graphql`

---

## Arsitektur

### Gambaran Umum

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
└────────────────┬────────────────────┬───────────────────┘
                 │                    │
                 ▼                    ▼
   ┌─────────────────────┐  ┌─────────────────────────┐
   │    Auth Service     │  │    Schedule Service     │
   │    :3001/graphql    │  │    :3002/graphql        │
   └──────────┬──────────┘  └────────────┬────────────┘
              │                          │
       ┌──────┴──────┐           ┌───────┴───────┐
       │             │           │               │
       ▼             ▼           ▼               ▼
  ┌─────────┐  ┌─────────┐ ┌─────────┐    ┌─────────┐
  │PostgreSQL│  │  Redis  │ │PostgreSQL│   │  Redis  │
  └─────────┘  └─────────┘ └─────────┘    └─────────┘
                                                │
                                           ┌────┴────┐
                                           │  SMTP   │
                                           │ (Email) │
                                           └─────────┘
```

---

### Auth Service — Layer Architecture

```
 Client (GraphQL Request)
         │
         ▼
 ┌───────────────┐
 │   Resolver    │  ← Menerima query/mutation GraphQL
 └───────┬───────┘
         │
         ▼
 ┌───────────────┐
 │    Service    │  ← Logika bisnis (login, register, validate token)
 └───────┬───────┘
         │
         ├─────────────────────┐
         ▼                     ▼
 ┌───────────────┐     ┌───────────────┐
 │  Repository   │     │     Redis     │
 │  (Prisma)     │     │  (Token/Cache)│
 └───────┬───────┘     └───────────────┘
         │
         ▼
 ┌───────────────┐
 │  PostgreSQL   │
 └───────────────┘
```

---

### Schedule Service — Layer Architecture

```
 Client (GraphQL Request)
         │
         ▼
 ┌───────────────┐
 │   Resolver    │  ← Menerima query/mutation GraphQL
 └───────┬───────┘
         │
         ▼
 ┌───────────────┐
 │    Service    │  ← Logika bisnis & validasi
 └───────┬───────┘
         │
         ├──────────────────────────────┐
         ▼                              ▼
 ┌───────────────┐              ┌───────────────┐
 │  Repository   │              │  Email Service│
 │  (Prisma)     │              │  (SMTP)       │
 └───────┬───────┘              └───────────────┘
         │
         ├─────────────────────┐
         ▼                     ▼
 ┌───────────────┐     ┌───────────────┐
 │  PostgreSQL   │     │     Redis     │
 └───────────────┘     └───────────────┘
```

> Email dikirim otomatis oleh Service saat jadwal **dibuat** atau **dibatalkan**.

---

## Environment Variables

Setiap service membutuhkan file `.env` masing-masing. Salin contoh di bawah dan sesuaikan nilainya.

### Auth Service (`auth-service/.env`)

```dotenv
SERVICE_NAME='auth-service'

PORT=3001

# Database
DB_HOST=''         # e.g. localhost
DB_PORT=''         # e.g. 5432
DB_NAME=''         # e.g. rata
DB_USERNAME=''     # e.g. postgres
DB_PASSWORD=''
DB_DRIVER=''       # e.g. postgresql

# JWT
JWT_SECRET=''      # random string panjang, e.g. hasil openssl rand -base64 32
JWT_EXPIRED=''     # e.g. 1h / 7d / 30d

# Redis
REDIS_HOST=''      # e.g. localhost
REDIS_PORT=''      # e.g. 6379
REDIS_PASSWORD=''
# REDIS_DB=0
```

### Schedule Service (`schedule-service/.env`)

```dotenv
SERVICE_NAME='schedule-service'

PORT=3002

# Database
DB_HOST=''         # e.g. localhost
DB_PORT=''         # e.g. 5432
DB_NAME=''         # e.g. rata
DB_USERNAME=''     # e.g. postgres
DB_PASSWORD=''
DB_DRIVER=''       # e.g. postgresql

# JWT (harus sama dengan auth-service)
JWT_SECRET=''
JWT_EXPIRED=''     # e.g. 1h / 7d / 30d

# Redis
REDIS_HOST=''      # e.g. localhost
REDIS_PORT=''      # e.g. 6379
REDIS_PASSWORD=''
# REDIS_DB=0

# Email (SMTP)
EMAIL_USER=''      # e.g. noreply@yourdomain.com
EMAIL_PASSWORD=''  # app password jika menggunakan Gmail
```

> **Catatan:** `JWT_SECRET` pada kedua service harus bernilai sama agar token yang dibuat oleh `auth-service` bisa divalidasi oleh `schedule-service`.

---

## Getting Started

### Docker (Recommended)

```bash
docker compose up -d --build
```

Initialize Postgres (first run only):

```bash
docker compose exec -T postgres psql -U postgres -d rata -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
docker compose exec -T auth-service sh -lc "npx prisma db push --accept-data-loss --config prisma.config.ts"
docker compose exec -T schedule-service sh -lc "npx prisma db push --accept-data-loss --config prisma.config.ts"
docker compose restart auth-service schedule-service
```

Useful commands:

```bash
docker compose ps
docker compose logs -f auth-service schedule-service
docker compose down
```

### Manual (Local Node.js)

Prereqs: Node.js 22+, pnpm 11+, Postgres 16+, Redis 7+.

Start Postgres + Redis (using Docker):

```bash
docker compose up -d postgres redis
```

Install dependencies and run Prisma schema sync per service:

```bash
pnpm install
cd auth-service
npx prisma db push --accept-data-loss --config prisma.config.ts
pnpm run start:dev
```

In another terminal:

```bash
cd schedule-service
npx prisma db push --accept-data-loss --config prisma.config.ts
pnpm run start:dev
```

---

## GraphQL API Reference

All requests are `POST` to the GraphQL endpoint for the service you are calling.

---

# Auth Module

> **Port:** `3001`

## Mutations

### Login

Authenticates an existing user and returns an access token.

```graphql
mutation Login {
  login(input: { email: "test@example.com", password: "password123" }) {
    message
    result {
      accessToken
      user {
        id
        email
        createdAt
      }
    }
  }
}
```

### Register

Creates a new user account.

```graphql
mutation Register {
  register(input: { email: "test@example.com", password: "password123" }) {
    message
    result {
      id
      email
      createdAt
    }
  }
}
```

## Queries

### Validate Token

Validates an existing access token and returns the associated user.

```graphql
query ValidateToken {
  validateToken(token: "YOUR_ACCESS_TOKEN_HERE") {
    message
    result {
      id
      email
      createdAt
    }
  }
}
```

## Response Types

### `AuthResponseDto`

| Field     | Type          | Description        |
| --------- | ------------- | ------------------ |
| `message` | `String`      | Operation message  |
| `result`  | `AuthDataDto` | Auth response data |

### `AuthDataDto`

| Field         | Type     | Description                          |
| ------------- | -------- | ------------------------------------ |
| `accessToken` | `String` | JWT token for authenticated requests |
| `user`        | `User`   | The authenticated user object        |

### `User`

| Field       | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `id`        | `ID`       | Unique user identifier     |
| `email`     | `String`   | User's email address       |
| `createdAt` | `DateTime` | Account creation timestamp |

---

# Schedule Module

> **Port:** `3002`

## Customer Module

### Mutations

#### Create Customer

```graphql
mutation CreateCustomer {
  createCustomer(input: { name: "John Doe", email: "john@example.com" }) {
    message
    result {
      id
      name
      email
      createdAt
    }
  }
}
```

#### Update Customer

```graphql
mutation UpdateCustomer {
  updateCustomer(id: "uuid-here", input: { name: "Jane Doe" }) {
    message
    result {
      id
      name
      email
    }
  }
}
```

#### Delete Customer

```graphql
mutation DeleteCustomer {
  deleteCustomer(id: "uuid-here") {
    id
    name
    email
    createdAt
    updatedAt
  }
}
```

### Queries

#### Get All Customers

```graphql
query GetCustomers {
  customers(pagination: { page: "1", pageSize: "10" }) {
    message
    result {
      data {
        id
        name
        email
        createdAt
      }
      totalRecords
      page
      pageSize
      totalPages
    }
  }
}
```

#### Get Customer by ID

```graphql
query GetCustomer {
  customer(id: "uuid-here") {
    message
    result {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
}
```

## Response Types

### `CustomerResponseDto`

| Field     | Type          | Description       |
| --------- | ------------- | ----------------- |
| `message` | `String`      | Operation message |
| `data`    | `CustomerDto` | Customer data     |

### `CustomerDto`

| Field       | Type       | Description                |
| ----------- | ---------- | -------------------------- |
| `id`        | `ID`       | Unique customer identifier |
| `name`      | `String`   | Customer name              |
| `email`     | `String`   | Customer email address     |
| `createdAt` | `DateTime` | Record creation timestamp  |
| `updatedAt` | `DateTime` | Record updated timestamp   |

---

## Doctor Module

### Mutations

#### Create Doctor

```graphql
mutation CreateDoctor {
  createDoctor(input: { name: "Dr. Smith" }) {
    message
    result {
      id
      name
      createdAt
    }
  }
}
```

#### Update Doctor

```graphql
mutation UpdateDoctor {
  updateDoctor(id: "uuid-here", input: { name: "Dr. Johnson" }) {
    message
    result {
      id
      name
    }
  }
}
```

#### Delete Doctor

```graphql
mutation DeleteDoctor {
  deleteDoctor(id: "uuid-here") {
    message
    result {
      id
      name
    }
  }
}
```

### Queries

#### Get All Doctors

```graphql
query GetDoctors {
  doctors(pagination: { page: "1", pageSize: "10" }) {
    message
    result {
      data {
        id
        name
        createdAt
      }
      totalRecords
      page
      pageSize
      totalPages
    }
  }
}
```

#### Get Doctor by ID

```graphql
query GetDoctor {
  doctor(id: "uuid-here") {
    message
    result {
      id
      name
      createdAt
      updatedAt
    }
  }
}
```

## Response Types

### `DoctorResponseDto`

| Field     | Type        | Description       |
| --------- | ----------- | ----------------- |
| `message` | `String`    | Operation message |
| `result`  | `DoctorDto` | Doctor data       |

### `DoctorDto`

| Field       | Type       | Description               |
| ----------- | ---------- | ------------------------- |
| `id`        | `ID`       | Unique doctor identifier  |
| `name`      | `String`   | Doctor name               |
| `createdAt` | `DateTime` | Record creation timestamp |
| `updatedAt` | `DateTime` | Record updated timestamp  |

---

## Schedule Module

### Mutations

#### Create Schedule

```graphql
mutation CreateSchedule {
  createSchedule(
    input: {
      customerId: "uuid-here"
      doctorId: "uuid-here"
      objective: "General checkup"
      scheduledAt: "2026-06-01T09:00:00Z"
    }
  ) {
    message
    result {
      id
      customerId
      doctorId
      objective
      scheduledAt
      createdAt
    }
  }
}
```

#### Delete Schedule

```graphql
mutation DeleteSchedule {
  deleteSchedule(id: "uuid-here") {
    message
    result {
      id
      customerId
      doctorId
      objective
      scheduledAt
    }
  }
}
```

### Queries

#### Get All Schedules

Supports optional filtering by `customerId`, `doctorId`, and date range.

```graphql
query GetSchedules {
  schedules(
    pagination: {
      page: "1"
      pageSize: "10"
      filter: {
        customerId: "uuid-here"
        doctorId: "uuid-here"
        scheduledFrom: "2026-06-01T00:00:00Z"
        scheduledTo: "2026-06-30T23:59:59Z"
      }
    }
  ) {
    message
    result {
      data {
        id
        customerId
        doctorId
        objective
        scheduledAt
        createdAt
      }
      totalRecords
      page
      pageSize
      totalPages
    }
  }
}
```

#### Get Schedule by ID

```graphql
query GetSchedule {
  schedule(id: "uuid-here") {
    message
    result {
      id
      customerId
      doctorId
      objective
      scheduledAt
      createdAt
      updatedAt
    }
  }
}
```

### Input Types

#### `CreateScheduleDto`

| Field         | Type     | Required | Description              |
| ------------- | -------- | -------- | ------------------------ |
| `customerId`  | `String` | Yes      | ID of the customer       |
| `doctorId`    | `String` | Yes      | ID of the doctor         |
| `objective`   | `String` | Yes      | Purpose of the schedule  |
| `scheduledAt` | `String` | Yes      | ISO 8601 datetime string |

#### `SchedulePaginationDto`

| Field      | Type                | Required | Description                  |
| ---------- | ------------------- | -------- | ---------------------------- |
| `page`     | `String`            | No       | Page number (default: 1)     |
| `pageSize` | `String`            | No       | Items per page (default: 10) |
| `filter`   | `ScheduleFilterDto` | No       | Optional filters             |

#### `ScheduleFilterDto`

| Field           | Type     | Required | Description                    |
| --------------- | -------- | -------- | ------------------------------ |
| `customerId`    | `String` | No       | Filter by customer ID          |
| `doctorId`      | `String` | No       | Filter by doctor ID            |
| `scheduledFrom` | `String` | No       | Start of date range (ISO 8601) |
| `scheduledTo`   | `String` | No       | End of date range (ISO 8601)   |

### Response Types

#### `ScheduleResponseDto`

| Field     | Type          | Description       |
| --------- | ------------- | ----------------- |
| `message` | `String`      | Operation message |
| `result`  | `ScheduleDto` | Schedule data     |

#### `ScheduleDto`

| Field         | Type       | Description                |
| ------------- | ---------- | -------------------------- |
| `id`          | `ID`       | Unique schedule identifier |
| `customerId`  | `String`   | Associated customer ID     |
| `doctorId`    | `String`   | Associated doctor ID       |
| `objective`   | `String`   | Purpose of the schedule    |
| `scheduledAt` | `DateTime` | Scheduled date and time    |
| `createdAt`   | `DateTime` | Record creation timestamp  |
| `updatedAt`   | `DateTime` | Record updated timestamp   |

---

## Testing in Postman

1. Set method to **POST**
2. Set URL to the port of the module you're testing
3. Headers: `Content-Type: application/json`
4. Body → **GraphQL** tab → paste the query above

> **Note:** Use `mutation` for create/update/delete operations. Use `query` for read operations. Do not wrap operations in outer `{}`.
