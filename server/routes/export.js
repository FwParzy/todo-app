import express from 'express';
import { getMd } from '../controllers/export.js';

const router = express.Router();

router.post('/md', getMd);

export default router;
