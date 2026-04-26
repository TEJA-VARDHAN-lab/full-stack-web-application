const express = require('express');
const { createTaskSchema, updateTaskSchema } = require('../validators/taskValidators');
const {
  createTask,
  listTasks,
  findTask,
  updateTask,
  deleteTask,
} = require('../services/taskService');

const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    const tasks = listTasks(req.user.userId);
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res, next) => {
  try {
    const payload = createTaskSchema.parse(req.body);
    const task = createTask(payload, req.user.userId);
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const task = findTask(Number(req.params.id), req.user.userId);
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', (req, res, next) => {
  try {
    const payload = updateTaskSchema.parse(req.body);
    const task = updateTask(Number(req.params.id), payload, req.user.userId);
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    deleteTask(Number(req.params.id), req.user.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
