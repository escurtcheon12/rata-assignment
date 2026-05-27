# Auth API — GraphQL Reference

Base URL: `http://localhost:3000/graphql`

All requests are `POST` to the single GraphQL endpoint.

---

## Mutations

### Login

Authenticates an existing user and returns an access token.

```graphql
mutation Login {
  login(input: { email: "test@example.com", password: "password123" }) {
    accessToken
    user {
      id
      email
      createdAt
    }
  }
}
```

---

### Register

Creates a new user account and returns an access token.

```graphql
mutation Register {
  register(input: { email: "test@example.com", password: "password123" }) {
    accessToken
    user {
      id
      email
      createdAt
    }
  }
}
```

---

## Queries

### Validate Token

Validates an existing access token and returns the associated user.

```graphql
query ValidateToken {
  validateToken(token: "YOUR_ACCESS_TOKEN_HERE") {
    id
    email
    createdAt
  }
}
```

---

## Response Types

### `AuthResponse`

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

## Testing in Postman

1. Set method to **POST**
2. URL: `http://localhost:3000/graphql`
3. Headers: `Content-Type: application/json`
4. Body → **GraphQL** tab → paste the query above

> **Note:** Use the `mutation` keyword for `login` and `register`. Use `query` for `validateToken`. Do not wrap mutations in outer `{}`.
