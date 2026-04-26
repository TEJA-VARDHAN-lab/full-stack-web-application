# Week 3 - Back-End API Development

This folder contains a complete RESTful back-end API implementation for the Week 3 task. The API supports:

- Secure authentication with JWT
- CRUD operations for tasks
- SQLite relational database integration
- Input validation and consistent error handling
- Automated API tests

## Tech Stack

- Node.js + Express
- SQLite (`better-sqlite3`)
- JWT (`jsonwebtoken`)
- Validation (`zod`)
- Security (`helmet`, `express-rate-limit`, `cors`)
- Testing (`jest`, `supertest`)

## Project Structure

```
week3-backend/
├── docs/
│   └── API.md
├── src/
│   ├── app.js
│   ├── auth.js
│   ├── db.js
│   ├── server.js
│   └── validation.js
├── test/
│   └── tasks.test.js
└── package.json
```

## Setup

1. Go to the project directory:
   ```bash
   cd week3-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an environment file:
   ```bash
   cp .env.example .env
   ```
   Then set values (or keep defaults for local development).

## Environment Variables

Create `.env` with:

```env
PORT=4000
DB_FILE=./week3.sqlite
JWT_SECRET=replace-with-a-secure-secret
```

## Run the API

```bash
npm start
```

Health endpoint:

```bash
GET http://localhost:4000/health
```

## Run Tests

```bash
npm test
```

## API Documentation

Full endpoint documentation is available at:

- [`docs/API.md`](./docs/API.md)
