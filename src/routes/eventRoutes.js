const express = require('express');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
} = require('../controllers/eventController');
const { authenticate, authorizeOrganizer, authorizeAttendee } = require('../middleware/auth');
const router = express.Router();

// Publicly view events (authenticated users)
router.get('/', authenticate, getEvents);

// Organizer only CRUD
router.post('/', authenticate, authorizeOrganizer, createEvent);
router.put('/:id', authenticate, authorizeOrganizer, updateEvent);
router.delete('/:id', authenticate, authorizeOrganizer, deleteEvent);

// Attendee only registration
router.post('/:id/register', authenticate, authorizeAttendee, registerForEvent);

module.exports = router;
