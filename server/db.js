import mysql from 'mysql';
import fs from 'fs';
import path from 'node:path'
import { fileURLToPath } from 'url';
import * as dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

let dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS
};

if (process.env.NODE_ENV === 'prod') {
  const sslCert = fs.readFileSync(path.join(__dirname, '/ca-app.crt'));
  dbConfig = {
    ...dbConfig,
    port: process.env.DB_PORT,
    ssl: {
      ca: sslCert
    }
  };
}
console.log(dbConfig)

export const db = mysql.createConnection(dbConfig);
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to db")
})
