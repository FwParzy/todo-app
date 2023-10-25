import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);

// app.post('/register', (req, res) => {
//   const sql = "INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)";
//   const values = [
//     req.body.username,
//     req.body.email,
//     req.body.password
//   ];
//
//   db.query(sql, values, (err, data) => {
//     if (err) {
//       return res.status(500).json("Error: " + err);
//     }
//     return res.json(data);
//   })
// })

app.listen(8081, () => {
  console.log("listening")
})
