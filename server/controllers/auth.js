import { db } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = (req, res) => {
  // Check if user exists
  const q = 'SELECT * FROM users WHERE email = ? OR username = ?';

  db.query(q, [req.body.email, req.body.username], (err, data) => {
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
    if (err) return res.status(500).json({ message: 'Server error: Checking db for Username' });
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

export const editUser = (req, res) => {
  // Check if user exists
  const checkUserQuery = 'SELECT * FROM users WHERE id != ? AND (email = ? OR username = ?)';
  const values = [req.body.id, req.body.email, req.body.username];

  db.query(checkUserQuery, values, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: 'Server error: Checking Existence' });
    }

    if (results.length >= 1) {
      return res.status(404).json({ message: 'User already exists' });
    }

    let updateUserQuery = 'UPDATE users SET username = ?, email = ?';
    const values = [req.body.username, req.body.email];

    // If password is provided in the request, hash it and add to the update query
    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      updateUserQuery += ', password = ?';
      values.push(hash);
    }

    updateUserQuery += ' WHERE id = ?';
    values.push(req.body.id);

    db.query(updateUserQuery, values, (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: 'Server error: Updating User' });
      }

      // After updating, retrieve the updated user details
      const retrieveUserQuery = 'SELECT * FROM users WHERE id = ?';
      db.query(retrieveUserQuery, [req.body.id], (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: 'Server error: Retrieving Updated User' });
        }

        if (data.length === 0) {
          return res.status(404).json({ message: 'Updated user not found' });
        }

        // Generate JWT token for the user
        const token = jwt.sign({ id: data[0].id }, 'jwtKey');
        const { password, ...other } = data[0];

        // Set JWT token in the cookie and return updated user details
        res.cookie('access_token', token, {
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
          .status(200)
          .json(other);
      });
    });
  });
};
