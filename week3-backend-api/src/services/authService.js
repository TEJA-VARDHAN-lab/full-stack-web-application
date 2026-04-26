const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const createUserStmt = db.prepare(
  'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)'
);
const findUserByEmailStmt = db.prepare('SELECT * FROM users WHERE email = ?');

function registerUser({ name, email, password }) {
  const existing = findUserByEmailStmt.get(email);
  if (existing) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = createUserStmt.run(name, email, passwordHash);

  return {
    id: result.lastInsertRowid,
    name,
    email,
  };
}

function loginUser({ email, password }) {
  const user = findUserByEmailStmt.get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

module.exports = {
  registerUser,
  loginUser,
};
