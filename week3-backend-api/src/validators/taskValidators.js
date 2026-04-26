const { z } = require('zod');

const statusEnum = z.enum(['todo', 'in_progress', 'done']);

const createTaskSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  status: statusEnum.optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(120).optional(),
    description: z.string().max(1000).optional(),
    status: statusEnum.optional(),
    dueDate: z.string().datetime().optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
