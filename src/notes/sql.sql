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
