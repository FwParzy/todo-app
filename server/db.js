import mysql from 'mysql';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// SSL certificate
const sslCert = {
  ca: fs.readFileSync(process.env.SSL_CERT_PATH)
};

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

db.connect((err)=>{
  if (err) throw err;
  console.log("Connected to db")
})
