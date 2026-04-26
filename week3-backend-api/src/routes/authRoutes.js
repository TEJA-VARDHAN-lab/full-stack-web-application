const express = require('express');
const { registerSchema, loginSchema } = require('../validators/authValidators');
const { registerUser, loginUser } = require('../services/authService');

const router = express.Router();

router.post('/register', (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const user = registerUser(payload);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

router.post('/login', (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = loginUser(payload);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
