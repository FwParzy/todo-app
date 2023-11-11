import { db } from '../db.js';

export const create = (req, res) => {
  // Check if category already exists for the user
  const checkQuery = `
    SELECT * FROM tasks
    WHERE name = ?
    AND userId = ?
    AND deleteTs IS NULL
  `;

  db.query(checkQuery, [req.body.name, req.body.userId], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Checking Category Existance' });
    if (data.length)
      return res.status(409).json({ message: 'Category already exists for this user' });

    // Insert new category
    const insertQuery = 'INSERT INTO categories (`name`, `userId`) VALUES (?, ?)';
    const values = [req.body.name, req.body.userId];

    db.query(insertQuery, values, (err) => {
      if (err) return res.status(500).json({ message: 'Server error: Inserting Category' });
      return res.status(200).json({ message: 'Category was created.' });
    });
  });
};

export const getCats = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT * FROM categories
    WHERE userId = ? AND cancelTs IS NULL AND deleteTs IS NULL
  `;

  db.query(query, [userId], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching Categories' });
    return res.status(200).json(data);
  });
};

export const deleteOne = (req, res) => {
  const query = 'SELECT * FROM categories WHERE userId = ? AND id = ?';

  db.query(query, [req.body.userId, req.body.id], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching Categories' });
    if (data.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Set Delete and Cancel Timestamps
    let deleteQuery = 'UPDATE categories SET deleteTs = Now()'
    if (!data[0].cancelTs) deleteQuery += ', cancelTs = Now()'
    deleteQuery += ' WHERE id = ?';

    db.query(deleteQuery, [req.body.id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error: Deleting Category' });
      return res.status(200).json({ message: 'Category was deleted.' });
    });
  });
};

export const updateName = (req, res) => {
  const query = 'SELECT * FROM categories WHERE userId = ? AND id = ?';

  db.query(query, [req.body.userId, req.body.id], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching Categories' });
    if (data.length === 0)
      return res.status(404).json({ message: 'Category not found' });
    if (data[0].name === req.body.name)
      return res.status(409).json({ message: 'Category name was not changed' });

    // Set new name
    let newNameQuery = 'UPDATE categories SET name = ? WHERE id = ?'

    db.query(newNameQuery, [req.body.name, req.body.id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error: Changing Category Name' });
      return res.status(200).json({ message: 'Category name was changed.' });
    });
  });
};
