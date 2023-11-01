import { db } from '../db.js';

export const create = (req, res) => {
  // Check if Task already exists for the user
  const checkQuery = 'SELECT * FROM tasks WHERE name = ? AND userId = ? AND categoryId = ?';

  db.query(checkQuery, [req.body.name, req.body.userId, req.body.categoryId], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Checking Task Existance' });
    if (data.length)
      return res.status(409).json({ message: 'Task already exists for this user' });

    // Insert new Task
    const insertQuery = 'INSERT INTO tasks (`name`, `userId`, `categoryId`) VALUES (?, ?, ?)';
    const values = [req.body.name, req.body.userId, req.body.categoryId];

    db.query(insertQuery, values, (err) => {
      if (err) return res.status(500).json({ message: 'Server error: Inserting Task' });
      return res.status(200).json({ message: 'Task was created.' });
    });
  });
};

export const get = (req, res) => {
  const userId = req.params.userId;
  const catId = req.params.categoryId;

  const query = `
    SELECT * FROM tasks
    WHERE userId = ? AND categoryId = ?
      AND deleteTs IS NULL
  `;

  db.query(query, [userId, catId], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching tasks' });
    return res.status(200).json(data);
  });
};

export const deleteOne = (req, res) => {
  const query = 'SELECT * FROM tasks WHERE userId = ? AND id = ?';

  db.query(query, [req.body.userId, req.body.id], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching tasks' });
    if (data.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Set Delete Timestamp
    const deleteQuery = 'UPDATE tasks SET deleteTs = Now() WHERE id = ?'

    db.query(deleteQuery, [req.body.id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error: Deleting Task' });
      return res.status(200).json({ message: 'Task was deleted.' });
    });
  });
};

export const updateName = (req, res) => {
  const query = 'SELECT * FROM tasks WHERE userId = ? AND id = ?';

  db.query(query, [req.body.userId, req.body.id], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching tasks' });
    if (data.length === 0)
      return res.status(404).json({ message: 'Task not found' });
    if (data[0].name === req.body.name)
      return res.status(409).json({ message: 'Task name was not changed' });

    // Set new name
    let newNameQuery = 'UPDATE tasks SET name = ? WHERE id = ?'

    db.query(newNameQuery, [req.body.name, req.body.id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error: Changing Task Name' });
      return res.status(200).json({ message: 'Task name was changed.' });
    });
  });
};

export const completeOne = (req, res) => {
  const query = 'SELECT * FROM tasks WHERE userId = ? AND id = ?';

  db.query(query, [req.body.userId, req.body.id], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching tasks' });
    if (data.length === 0)
      return res.status(404).json({ message: 'Task not found' });

    // Set task to completed
    let completeTaskQuery = `
      UPDATE tasks
      SET completed = NOT completed,
          cancelTs = CASE WHEN completed THEN Now() ELSE NULL END
      WHERE id = ?
`;

    db.query(completeTaskQuery, [req.body.id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error: Error toggling the task status' });
      return res.status(200).json({ message: 'Task was completed' });
    });
  });
};

export const updateCategory = (req, res) => {
  const query = 'SELECT * FROM tasks WHERE userId = ? AND id = ?';

  db.query(query, [req.body.userId, req.body.id], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching tasks' });
    if (data.length === 0)
      return res.status(404).json({ message: 'Task not found' });

    // Set task to completed
    let changeCatQuery = `
      UPDATE tasks
      SET categoryId = ?
      WHERE id = ?
`;

    db.query(changeCatQuery, [req.body.newCatId, req.body.id], (err) => {
      if (err) return res.status(500).json({ message: 'Server error: Changing task Category' });
      return res.status(200).json({ message: 'Task category was changed' });
    });
  });
};

export const deleteOldTasks = (req, res) => {
  const query = 'SELECT * FROM tasks WHERE userId = ? AND id = ?';

  db.query(query, [req.body.userId, req.body.id], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching tasks' });
    if (data.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if the task is not completed
    if (data[0].completed !== 1) {
      return res.status(200).json({ message: 'Task is not completed.', taskName: data[0].name });
    }

    // Set Delete Timestamp if it's a new day and the task is completed
    const deleteQuery = `
      UPDATE tasks
      SET deleteTs = NOW()
      WHERE userId = ?
      AND id = ?
      AND completed = 1
      AND cancelTs IS NOT NULL
      AND deleteTs IS NULL
      AND DATE(cancelTs) < CURDATE();
    `;

    db.query(deleteQuery, [req.body.userId, req.body.id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error: Deleting Task' });
      if (result.affectedRows === 0) {
        // No tasks were deleted, meaning the task was not old enough or not completed
        return res.status(200).json({ message: 'No tasks were deleted. Task is not old enough or not completed.', taskName: data[0].name });
      }
      // Task was deleted
      return res.status(200).json({ message: 'Task was deleted.', taskName: data[0].name });
    });
  });
};

export const deleteAllInCat = (req, res) => {
  console.log("pretend I did something")
};
