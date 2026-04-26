# API Documentation

Base URL: `http://localhost:4000`

## Authentication

### Register user
- **Endpoint:** `POST /api/auth/register`
- **Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```
- **Responses:**
  - `201 Created` user created.
  - `400 Bad Request` validation error.
  - `409 Conflict` email already exists.

### Login user
- **Endpoint:** `POST /api/auth/login`
- **Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```
- **Responses:**
  - `200 OK` returns JWT token.
  - `401 Unauthorized` invalid credentials.

## Tasks (Protected)
All `/api/tasks` endpoints require:
- Header: `Authorization: Bearer <JWT_TOKEN>`

### Create task
- **Endpoint:** `POST /api/tasks`
- **Body:**
```json
{
  "title": "Build API docs",
  "description": "Write endpoint documentation",
  "status": "todo",
  "dueDate": "2026-05-01T10:00:00.000Z"
}
```
- **Responses:**
  - `201 Created`
  - `400 Bad Request`
  - `401 Unauthorized`

### List tasks
- **Endpoint:** `GET /api/tasks`
- **Responses:**
  - `200 OK` array of tasks for authenticated user.

### Get task by id
- **Endpoint:** `GET /api/tasks/:id`
- **Responses:**
  - `200 OK`
  - `404 Not Found`

### Update task
- **Endpoint:** `PATCH /api/tasks/:id`
- **Body:** any subset of:
```json
{
  "title": "Updated title",
  "description": "Updated details",
  "status": "in_progress",
  "dueDate": "2026-05-03T18:30:00.000Z"
}
```
- **Responses:**
  - `200 OK`
  - `400 Bad Request`
  - `404 Not Found`

### Delete task
- **Endpoint:** `DELETE /api/tasks/:id`
- **Responses:**
  - `204 No Content`
  - `404 Not Found`

## Health Check
- **Endpoint:** `GET /health`
- **Response:** `200 OK`
