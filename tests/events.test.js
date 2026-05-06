const request = require('supertest');
const app = require('../src/app');
const { users, events } = require('../src/models/db');

describe('Event Endpoints', () => {
  let organizerToken;
  let attendeeToken;

  beforeAll(async () => {
    // Clear data
    users.length = 0;
    events.length = 0;

    // Register and login organizer
    await request(app).post('/register').send({
      email: 'org@test.com',
      password: 'password123',
      role: 'organizer'
    });
    const orgLogin = await request(app).post('/login').send({
      email: 'org@test.com',
      password: 'password123'
    });
    organizerToken = orgLogin.body.token;

    // Register and login attendee
    await request(app).post('/register').send({
      email: 'att@test.com',
      password: 'password123',
      role: 'attendee'
    });
    const attLogin = await request(app).post('/login').send({
      email: 'att@test.com',
      password: 'password123'
    });
    attendeeToken = attLogin.body.token;
  });

  it('should allow organizer to create an event', async () => {
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Tech Conference 2026',
        description: 'A futuristic tech conference',
        date: '2026-10-10',
        time: '10:00 AM'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.event).toHaveProperty('title', 'Tech Conference 2026');
  });

  it('should not allow attendee to create an event', async () => {
    const res = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({
        title: 'Shadow Event',
        description: 'Should fail',
        date: '2026-11-11',
        time: '11:00 AM'
      });
    expect(res.statusCode).toEqual(403);
  });

  it('should allow everyone to view events', async () => {
    const res = await request(app)
      .get('/events')
      .set('Authorization', `Bearer ${attendeeToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should allow organizer to update an event', async () => {
    const eventId = events[0].id;
    const res = await request(app)
      .put(`/events/${eventId}`)
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Updated Tech Conference 2026'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.event).toHaveProperty('title', 'Updated Tech Conference 2026');
  });

  it('should allow attendee to register for an event', async () => {
    const eventId = events[0].id;
    const res = await request(app)
      .post(`/events/${eventId}/register`)
      .set('Authorization', `Bearer ${attendeeToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Successfully registered for the event');
    
    // Check if participant is added
    expect(events[0].participants.length).toBe(1);
    expect(events[0].participants[0].email).toBe('att@test.com');
  });

  it('should allow organizer to delete an event', async () => {
    const eventId = events[0].id;
    const res = await request(app)
      .delete(`/events/${eventId}`)
      .set('Authorization', `Bearer ${organizerToken}`);
    expect(res.statusCode).toEqual(200);
    expect(events.length).toBe(0);
  });
});
