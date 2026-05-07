require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const { createDb } = require('./db');
const { authMiddleware } = require('./auth');
const {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema
} = require('./validation');

function createApp({ dbFile = ':memory:' } = {}) {
  const app = express();
  const db = createDb(dbFile);

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      const passwordHash = await bcrypt.hash(data.password, 10);

      const stmt = db.prepare(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
      );
      const result = stmt.run(data.name, data.email.toLowerCase(), passwordHash);

      return res.status(201).json({
        id: result.lastInsertRowid,
        name: data.name,
        email: data.email.toLowerCase()
      });
    } catch (err) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.errors });
      }

      if (String(err.message).includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = db
        .prepare('SELECT id, email, password_hash FROM users WHERE email = ?')
        .get(data.email.toLowerCase());

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const ok = await bcrypt.compare(data.password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET || 'dev-secret',
        { subject: String(user.id), expiresIn: '2h' }
      );

      return res.json({ token, token_type: 'Bearer', expires_in: 7200 });
    } catch (err) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.errors });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/tasks', authMiddleware, (req, res) => {
    const tasks = db
      .prepare(
        'SELECT id, title, description, status, created_at, updated_at FROM tasks WHERE user_id = ? ORDER BY id DESC'
      )
      .all(req.user.id);

    res.json({ data: tasks });
  });

  app.post('/api/tasks', authMiddleware, (req, res) => {
    try {
      const data = createTaskSchema.parse(req.body);
      const stmt = db.prepare(
        'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)'
      );
      const result = stmt.run(
        data.title,
        data.description || null,
        data.status || 'todo',
        req.user.id
      );

      const task = db
        .prepare(
          'SELECT id, title, description, status, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ?'
        )
        .get(result.lastInsertRowid, req.user.id);

      return res.status(201).json(task);
    } catch (err) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.errors });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/tasks/:id', authMiddleware, (req, res) => {
    const task = db
      .prepare(
        'SELECT id, title, description, status, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ?'
      )
      .get(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.json(task);
  });

  app.put('/api/tasks/:id', authMiddleware, (req, res) => {
    try {
      const data = updateTaskSchema.parse(req.body);

      const existing = db
        .prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
        .get(req.params.id, req.user.id);

      if (!existing) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updated = {
        title: data.title ?? existing.title,
        description: data.description ?? existing.description,
        status: data.status ?? existing.status
      };

      db.prepare(
        `UPDATE tasks
         SET title = ?, description = ?, status = ?, updated_at = datetime('now')
         WHERE id = ? AND user_id = ?`
      ).run(updated.title, updated.description, updated.status, req.params.id, req.user.id);

      const task = db
        .prepare(
          'SELECT id, title, description, status, created_at, updated_at FROM tasks WHERE id = ? AND user_id = ?'
        )
        .get(req.params.id, req.user.id);

      return res.json(task);
    } catch (err) {
      if (err.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation failed', details: err.errors });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
    const result = db
      .prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);

    if (!result.changes) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(204).send();
  });

  app.use((err, _req, res, _next) => {
    // Fallback error handler
    console.error(err);
    res.status(500).json({ error: 'Unhandled server error' });
  });

  return app;
}

module.exports = { createApp };
