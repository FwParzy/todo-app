import mysql from 'mysql';
import fs from 'fs';
import path from 'node:path'
import { fileURLToPath } from 'url';
import * as dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + '/.env' });
// SSL certificate
const sslCert = fs.readFileSync(path.join(__dirname, '/ca-app.crt'))

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  ssl: {
    ca: sslCert
  }
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to db")
})
