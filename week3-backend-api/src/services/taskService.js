const db = require('../config/database');

const createTaskStmt = db.prepare(
  `INSERT INTO tasks (title, description, status, due_date, owner_id)
   VALUES (?, ?, ?, ?, ?)`
);
const listTasksStmt = db.prepare(
  `SELECT id, title, description, status, due_date as dueDate, owner_id as ownerId, created_at as createdAt, updated_at as updatedAt
   FROM tasks
   WHERE owner_id = ?
   ORDER BY created_at DESC`
);
const findTaskStmt = db.prepare(
  `SELECT id, title, description, status, due_date as dueDate, owner_id as ownerId, created_at as createdAt, updated_at as updatedAt
   FROM tasks
   WHERE id = ? AND owner_id = ?`
);
const updateTaskStmt = db.prepare(
  `UPDATE tasks
   SET title = @title,
       description = @description,
       status = @status,
       due_date = @dueDate,
       updated_at = CURRENT_TIMESTAMP
   WHERE id = @id AND owner_id = @ownerId`
);
const deleteTaskStmt = db.prepare('DELETE FROM tasks WHERE id = ? AND owner_id = ?');

function createTask(payload, ownerId) {
  const result = createTaskStmt.run(
    payload.title,
    payload.description || null,
    payload.status || 'todo',
    payload.dueDate || null,
    ownerId
  );
  return findTask(result.lastInsertRowid, ownerId);
}

function listTasks(ownerId) {
  return listTasksStmt.all(ownerId);
}

function findTask(id, ownerId) {
  const task = findTaskStmt.get(id, ownerId);
  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
  return task;
}

function updateTask(id, updates, ownerId) {
  const existing = findTask(id, ownerId);

  const merged = {
    id,
    ownerId,
    title: updates.title ?? existing.title,
    description: updates.description ?? existing.description,
    status: updates.status ?? existing.status,
    dueDate: updates.dueDate === undefined ? existing.dueDate : updates.dueDate,
  };

  updateTaskStmt.run(merged);
  return findTask(id, ownerId);
}

function deleteTask(id, ownerId) {
  const result = deleteTaskStmt.run(id, ownerId);
  if (!result.changes) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  createTask,
  listTasks,
  findTask,
  updateTask,
  deleteTask,
};
