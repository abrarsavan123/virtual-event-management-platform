const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorizeOrganizer = (req, res, next) => {
  if (req.user && req.user.role === 'organizer') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Organizers only' });
  }
};

const authorizeAttendee = (req, res, next) => {
  if (req.user && req.user.role === 'attendee') {
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Attendees only' });
  }
};

module.exports = {
  authenticate,
  authorizeOrganizer,
  authorizeAttendee,
};
