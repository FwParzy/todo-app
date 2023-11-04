import { db } from '../db.js';

export const create = (req, res) => {
  // Check if Task already exists for the user
  const checkQuery = `
    SELECT * FROM tasks
    WHERE name = ?
    AND userId = ?
    AND categoryId = ?
    AND deleteTs IS NULL
  `;

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
  const query = `
    SELECT * FROM tasks
    WHERE userId = ?
    AND completed = 1
    AND cancelTs IS NOT NULL
    AND deleteTs IS NULL
    AND DATE(cancelTs) < CURDATE();
  `;

  if (!req.body.userId) return res.status(500).json({ message: 'Server error: No user ID' });
  db.query(query, [req.body.userId], (err, tasks) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching tasks' });

    if (tasks.length === 0) {
      return res.status(200).json({ message: 'No tasks found to delete.' });
    }

    // Extract task names and unique category IDs
    const taskNames = tasks.map(task => task.name);
    const categoryIds = [...new Set(tasks.map(task => task.categoryId))];

    // Set Delete Timestamp for all tasks that were selected
    const deleteQuery = `
      UPDATE tasks
      SET deleteTs = NOW()
      WHERE userId = ?
      AND completed = 1
      AND cancelTs IS NOT NULL
      AND deleteTs IS NULL
      AND DATE(cancelTs) < CURDATE();
    `;

    db.query(deleteQuery, [req.body.userId], (err, updateResult) => {
      if (err) return res.status(500).json({ message: 'Server error: Deleting tasks' });

      // Check if tasks were deleted
      if (updateResult.affectedRows === 0) {
        // No tasks were deleted
        return res.status(200).json({ message: 'No tasks were deleted. Tasks are not old enough or not completed.', taskNames: taskNames });
      }

      // Tasks were deleted
      return res.status(200).json({
        message: 'Tasks were deleted.',
        taskNames: taskNames,
        categoryIds: categoryIds
      });
    });
  });
};

export const deleteAllInCat = (req, res) => {
  if (!req.body.id) return res.status(400).json({ message: 'No categoryId provided.' });

  const query = 'SELECT * FROM tasks WHERE userId = ? AND categoryId = ? AND deleteTs IS NULL';

  db.query(query, [req.body.userId, req.body.id], (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error: Fetching tasks under your category' });
    if (data.length === 0)
      return res.status(200).json({ message: 'Category was empty' });

    // SQL query to set deleteTs to NOW() for all tasks in the given category
    const deleteQuery = `
      UPDATE tasks
      SET deleteTs = NOW()
      WHERE userId = ?
      AND categoryId = ?
      AND deleteTs IS NULL;
    `;

    db.query(deleteQuery, [req.body.userId, req.body.id], (err, data) => {
      if (err) {
        console.error('Error deleting tasks:', err);
        return res.status(500).json({ message: 'Server error: Deleting tasks' });
      }

      return res.status(200).json({ message: 'All tasks in the category have been deleted.', deletedTasksCount: data.affectedRows });
    });
  });
};
