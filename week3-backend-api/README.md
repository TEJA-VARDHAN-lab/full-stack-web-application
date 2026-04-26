# Week 3 Task - Back-End API Development

This folder contains a complete back-end REST API implementation using **Node.js + Express + SQLite**.

## Features
- User registration and login with JWT authentication.
- Task CRUD endpoints (Create, Read, Update, Delete).
- Request validation with Zod.
- Secure middleware stack: Helmet, CORS, rate limiting.
- Consistent error handling.
- SQLite relational schema (`users`, `tasks`).
- Automated API tests with Jest + Supertest.

## Project Structure
```text
week3-backend-api/
├── docs/
│   └── API.md
├── src/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── authenticate.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   └── taskService.js
│   ├── validators/
│   │   ├── authValidators.js
│   │   └── taskValidators.js
│   ├── app.js
│   └── server.js
├── tests/
│   └── app.test.js
├── .env.example
└── package.json
```

## Setup Instructions
1. Navigate to this directory:
   ```bash
   cd week3-backend-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Server will run on:
   - `http://localhost:4000` (default)

## Run Tests
```bash
npm test
```

## API Documentation
Detailed endpoint documentation is available in:
- [`docs/API.md`](./docs/API.md)

## Security and Best Practices
- Passwords are hashed with bcrypt.
- JWT-based authentication for protected endpoints.
- Basic rate limiting on `/api/*` routes.
- Input validation to prevent malformed payloads.
- Centralized error handling and normalized responses.
