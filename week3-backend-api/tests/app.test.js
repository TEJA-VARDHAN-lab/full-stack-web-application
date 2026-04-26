const path = require('path');
const fs = require('fs');
const request = require('supertest');

const testDbPath = path.join(__dirname, 'test.sqlite');

process.env.DB_PATH = testDbPath;
process.env.JWT_SECRET = 'test-secret';

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

const app = require('../src/app');

describe('Week 3 API', () => {
  let token;
  let taskId;

  it('registers a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('jane@example.com');
  });

  it('logs in a user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'jane@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    token = res.body.token;
  });

  it('creates a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Build API docs',
        description: 'Write endpoint documentation',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.task.title).toBe('Build API docs');
    taskId = res.body.task.id;
  });

  it('lists tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });

  it('updates a task', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' });

    expect(res.statusCode).toBe(200);
    expect(res.body.task.status).toBe('done');
  });

  it('deletes a task', async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
