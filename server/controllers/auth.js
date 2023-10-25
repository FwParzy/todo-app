import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
  // Check if user exists
  const q = 'SELECT * FROM users WHERE email = ? OR username = ?';

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    console.error("Database error:", err);
    if (err) return res.status(500).json({ message: 'Server error: Checking Existance' });
    if (data.length)
      return res.status(409).json({ message: 'User already exists' });

    // Encrypt password and create user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q = 'INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)';
    const values = [req.body.username, req.body.email, hash];

    db.query(q, values, (err) => {
      if (err) return res.status(500).json({ message: 'Server error: Inserting User' });
      return res.status(200).json({ message: 'User was created.' });
    });
  });
};

export const login = (req, res) => {
  // Check if user exists
  const q = 'SELECT * FROM users WHERE username = ?';

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (data.length === 0)
      return res.status(404).json({ message: 'User not found' });

    // Check if user's account is cancelled
    if (data[0].cancelTs !== null) {
      return res.status(403).json({ message: 'Your account has been deleted.' });
    }

    // Check password
    const isPassCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password,
    );

    if (!isPassCorrect)
      return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: data[0].id }, 'jwtKey');
    const { password, ...other } = data[0];

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })
      .status(200)
      .json(other);
  });
};

export const logout = (_req, res) => {
  res.clearCookie('access_token', {
    sameSite: 'None',
    secure: true,
  })
    .status(200)
    .json({ message: 'User has been logged out' });
};
