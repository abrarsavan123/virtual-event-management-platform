const { events } = require('../models/db');
const { sendRegistrationEmail } = require('../services/emailService');

const getEvents = (req, res) => {
  res.status(200).json(events);
};

const createEvent = (req, res) => {
  const { title, description, date, time } = req.body;

  if (!title || !description || !date || !time) {
    return res.status(400).json({ message: 'All fields (title, description, date, time) are required' });
  }

  const newEvent = {
    id: events.length + 1,
    title,
    description,
    date,
    time,
    participants: [],
    organizerId: req.user.id,
  };

  events.push(newEvent);
  res.status(201).json({ message: 'Event created successfully', event: newEvent });
};

const updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, description, date, time } = req.body;

  const eventIndex = events.findIndex(e => e.id === parseInt(id));
  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Optional: Check if the requester is the owner of the event
  // if (events[eventIndex].organizerId !== req.user.id) {
  //   return res.status(403).json({ message: 'Not authorized to update this event' });
  // }

  const updatedEvent = {
    ...events[eventIndex],
    title: title || events[eventIndex].title,
    description: description || events[eventIndex].description,
    date: date || events[eventIndex].date,
    time: time || events[eventIndex].time,
  };

  events[eventIndex] = updatedEvent;
  res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
};

const deleteEvent = (req, res) => {
  const { id } = req.params;
  const eventIndex = events.findIndex(e => e.id === parseInt(id));

  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }

  events.splice(eventIndex, 1);
  res.status(200).json({ message: 'Event deleted successfully' });
};

const registerForEvent = async (req, res) => {
  const { id } = req.params;
  const event = events.find(e => e.id === parseInt(id));

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Check if already registered
  const isRegistered = event.participants.some(p => p.email === req.user.email);
  if (isRegistered) {
    return res.status(400).json({ message: 'Already registered for this event' });
  }

  const participant = {
    userId: req.user.id,
    email: req.user.email,
  };

  event.participants.push(participant);

  // Send email asynchronously
  sendRegistrationEmail(req.user.email, event.title)
    .then(result => console.log(result.message))
    .catch(err => console.error('Failed to send email:', err));

  res.status(200).json({ message: 'Successfully registered for the event' });
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
};
