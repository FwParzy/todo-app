import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import catRoutes from './routes/categories.js';
import taskRoutes from './routes/tasks.js';
import exportRoutes from './routes/export.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/cat', catRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/export', exportRoutes);

app.listen(8081, () => {
  console.log("listening")
})
