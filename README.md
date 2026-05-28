# GraphQL API Reference

Base URL: `http://localhost:3000/graphql`

All requests are `POST` to the single GraphQL endpoint.

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
    data {
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

Creates a new user account and returns an access token.

```graphql
mutation Register {
  register(input: { email: "test@example.com", password: "password123" }) {
    message
    data {
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
| `data`    | `AuthDataDto` | Auth response data |

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
    data {
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
    data {
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
    message
    data {
      id
      name
      email
    }
  }
}
```

### Queries

#### Get All Customers

```graphql
query GetCustomers {
  customers(pagination: { page: "1", pageSize: "10" }) {
    message
    data {
      records {
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
    data {
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

## Testing in Postman

1. Set method to **POST**
2. Set URL to the port of the module you're testing
3. Headers: `Content-Type: application/json`
4. Body → **GraphQL** tab → paste the query above

> **Note:** Use `mutation` for create/update/delete operations. Use `query` for read operations. Do not wrap operations in outer `{}`.
