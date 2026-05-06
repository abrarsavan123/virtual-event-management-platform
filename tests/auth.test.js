const request = require('supertest');
const app = require('../src/app');
const { users } = require('../src/models/db');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    // Clear in-memory users before each test
    users.length = 0;
  });

  it('should register a new organizer', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        email: 'organizer@test.com',
        password: 'password123',
        role: 'organizer'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should register a new attendee', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        email: 'attendee@test.com',
        password: 'password123',
        role: 'attendee'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should not register user with existing email', async () => {
    await request(app)
      .post('/register')
      .send({
        email: 'duplicate@test.com',
        password: 'password123',
        role: 'attendee'
      });
    
    const res = await request(app)
      .post('/register')
      .send({
        email: 'duplicate@test.com',
        password: 'password123',
        role: 'attendee'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should login and return a JWT', async () => {
    await request(app)
      .post('/register')
      .send({
        email: 'login@test.com',
        password: 'password123',
        role: 'attendee'
      });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'login@test.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('role', 'attendee');
  });

  it('should fail login with wrong password', async () => {
    await request(app)
      .post('/register')
      .send({
        email: 'wrongpass@test.com',
        password: 'password123',
        role: 'attendee'
      });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'wrongpass@test.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
