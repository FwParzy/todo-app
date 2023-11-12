import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import pkg from 'electron';
const { app } = pkg;

dotenv.config();

let db;
let initDatabase; // Declare initDatabase outside
const isSQLite = process.env.USE_SQLITE === 'true';

const isMainProcess = process && process.type === 'browser';

if (isSQLite) {
  // SQLite configuration
  const dbPath = path.join(app.getPath('userData'), 'todo.db');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database', err);
    }
  });

  // Define initDatabase for SQLite
  initDatabase = () => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT NOT NULL,
email TEXT NOT NULL UNIQUE,
password TEXT NOT NULL,
createTs TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
cancelTs TIMESTAMP NULL
)`);

      db.run(`CREATE TABLE IF NOT EXISTS categories (
id INTEGER PRIMARY KEY AUTOINCREMENT,
userId INTEGER NOT NULL,
name TEXT NOT NULL,
createTs TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
cancelTs TIMESTAMP NULL,
deleteTs TIMESTAMP NULL,
FOREIGN KEY (userId) REFERENCES users(id)
)`);

      db.run(`CREATE TABLE IF NOT EXISTS tasks (
id INTEGER PRIMARY KEY AUTOINCREMENT,
userId INTEGER NOT NULL,
categoryId INTEGER NOT NULL,
name TEXT NOT NULL,
completed BOOLEAN NOT NULL DEFAULT 0,
createTs TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
cancelTs TIMESTAMP NULL,
deleteTs TIMESTAMP NULL,
FOREIGN KEY (categoryId) REFERENCES categories(id),
FOREIGN KEY (userId) REFERENCES users(id)
)`);
    });
  };
} else {
  let mysql;
  if (isMainProcess) {
    mysql = require('mysql');
  }
  // MySQL configuration
  db = isMainProcess ? mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS
  }) : null;

  initDatabase = () => {
  };
}

const executeQuery = (query, params, callback) => {
  if (isSQLite) {
    if (query.toLowerCase().startsWith("select")) {
      db.all(query, params, callback);
    } else {
      db.run(query, params, callback);
    }
  } else {
    db.query(query, params, callback);
  }
};

export { db, initDatabase, executeQuery };
