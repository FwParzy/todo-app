import mysql from 'mysql';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter MySQL username: ', (username) => {
  rl.question('Enter MySQL password: ', (password) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: username,
      password: password
    });

    const databaseName = 'todo';
    const queries = [
      `CREATE DATABASE IF NOT EXISTS ${databaseName};`,
      `USE ${databaseName};`,
      `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createTs TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelTs TIMESTAMP NULL
  );`,
      `CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    createTs TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelTs TIMESTAMP NULL,
    deleteTs TIMESTAMP NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
  );`,
      `CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    categoryId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    createTs TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelTs TIMESTAMP NULL,
    deleteTs TIMESTAMP NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  );`
    ];

    connection.connect(err => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }

      console.log('Connected to MySQL.');

      queries.forEach(query => {
        connection.query(query, err => {
          if (err) {
            console.error('Error executing query:', err);
            return;
          }
          console.log('Successfully executed query:', query);
        });
      });

      connection.end(() => {
        rl.close();
      });
    });
  });
});
