-- This is a log of all the Sql used in table creation and manipulation
CREATE DATABASE todo;

TRUNCATE TABLE users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createTs TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelTs TIMESTAMP NULL
);

TRUNCATE TABLE categories;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    createTs TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelTs TIMESTAMP NULL,
    deleteTs TIMESTAMP NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);

TRUNCATE TABLE tasks;

 UPDATE tasks SET cancelTs = CURDATE() - INTERVAL 1 DAY WHERE id = 3;
    SELECT * FROM tasks
    WHERE userId = 1
    AND completed = 1
    AND cancelTs IS NOT NULL
    AND deleteTs IS NULL
    AND DATE(cancelTs) < CURDATE();


CREATE TABLE tasks (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    categoryId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    createTs TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelTs TIMESTAMP NULL DEFAULT NULL,
    deleteTs TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

