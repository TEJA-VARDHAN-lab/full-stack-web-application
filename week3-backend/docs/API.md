# API Documentation

Base URL: `http://localhost:4000`

Authentication: Bearer JWT required for `/api/tasks*` endpoints.

---

## 1) Health Check

### `GET /health`
Checks whether the API is running.

**Response 200**
```json
{
  "status": "ok"
}
```

---

## 2) Authentication

### `POST /api/auth/register`
Create a new user account.

**Request Body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongPass123"
}
```

**Validations**
- `name`: 2-80 chars
- `email`: valid email
- `password`: 8-128 chars

**Response 201**
```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Errors**
- `400` validation failed
- `409` email already registered

### `POST /api/auth/login`
Authenticate and obtain JWT.

**Request Body**
```json
{
  "email": "jane@example.com",
  "password": "StrongPass123"
}
```

**Response 200**
```json
{
  "token": "<jwt>",
  "token_type": "Bearer",
  "expires_in": 7200
}
```

**Errors**
- `400` validation failed
- `401` invalid credentials

---

## 3) Task Endpoints (Protected)

Include header:

```http
Authorization: Bearer <jwt-token>
```

### `GET /api/tasks`
List all tasks for authenticated user.

**Response 200**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Build API",
      "description": "Week 3 project",
      "status": "todo",
      "created_at": "2026-04-26 15:00:00",
      "updated_at": "2026-04-26 15:00:00"
    }
  ]
}
```

### `POST /api/tasks`
Create a new task.

**Request Body**
```json
{
  "title": "Build API",
  "description": "Week 3 project",
  "status": "todo"
}
```

**Validations**
- `title`: 1-120 chars (required)
- `description`: max 1000 chars (optional)
- `status`: `todo` | `in_progress` | `done` (optional)

**Response 201**
```json
{
  "id": 1,
  "title": "Build API",
  "description": "Week 3 project",
  "status": "todo",
  "created_at": "2026-04-26 15:00:00",
  "updated_at": "2026-04-26 15:00:00"
}
```

### `GET /api/tasks/:id`
Get one task owned by authenticated user.

**Response 200**
```json
{
  "id": 1,
  "title": "Build API",
  "description": "Week 3 project",
  "status": "todo",
  "created_at": "2026-04-26 15:00:00",
  "updated_at": "2026-04-26 15:00:00"
}
```

**Errors**
- `404` task not found

### `PUT /api/tasks/:id`
Update one task (partial update supported).

**Request Body (example)**
```json
{
  "status": "done"
}
```

**Response 200**
Returns updated task object.

**Errors**
- `400` validation failed / no fields passed
- `404` task not found

### `DELETE /api/tasks/:id`
Delete one task owned by authenticated user.

**Response 204**
No body.

**Errors**
- `404` task not found

---

## Standard Error Format

```json
{
  "error": "Validation failed",
  "details": []
}
```
