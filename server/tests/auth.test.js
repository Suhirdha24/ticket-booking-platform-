import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

describe('Auth & Authorization API', () => {
  it('1. should successfully register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice Tester',
      email: 'alice@example.com',
      password: 'Password@123',
      phone: '+1 555-0100',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('alice@example.com');
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.token).toBeDefined();
  });

  it('2. should successfully login an existing user', async () => {
    await User.create({
      name: 'Bob Tester',
      email: 'bob@example.com',
      password: 'Password@123',
      role: 'user',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'bob@example.com',
      password: 'Password@123',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('bob@example.com');
  });

  it('3. should reject invalid login credentials', async () => {
    await User.create({
      name: 'Charlie Tester',
      email: 'charlie@example.com',
      password: 'Password@123',
      role: 'user',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'charlie@example.com',
      password: 'WrongPassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('4. should enforce admin authorization RBAC on admin endpoints', async () => {
    const regularUser = await User.create({
      name: 'Regular Joe',
      email: 'joe@example.com',
      password: 'Password@123',
      role: 'user',
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'joe@example.com',
      password: 'Password@123',
    });

    const userToken = loginRes.body.data.token;

    // Regular user attempting to access admin dashboard
    const adminRes = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${userToken}`);

    expect(adminRes.status).toBe(403);
    expect(adminRes.body.success).toBe(false);
    expect(adminRes.body.error.code).toBe('FORBIDDEN_ADMIN_REQUIRED');
  });
});
