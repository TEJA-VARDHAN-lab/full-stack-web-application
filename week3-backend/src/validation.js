const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128)
});

const createTaskSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional()
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required for update' }
);

module.exports = {
  registerSchema,
  loginSchema,
  createTaskSchema,
  updateTaskSchema
};
