const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models/db');
require('dotenv').config();

const register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  if (!['organizer', 'attendee'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be organizer or attendee' });
  }

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    role,
  };

  users.push(newUser);
  res.status(201).json({ message: 'User registered successfully' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'supersecretkey123',
    { expiresIn: '1h' }
  );

  res.status(200).json({ token, role: user.role });
};

module.exports = {
  register,
  login,
};
