import express from 'express';
import { create, deleteOne, getCats, updateName } from '../controllers/categories.js';

const router = express.Router();

router.post('/create', create);
router.get('/:userId', getCats);
router.post('/delete', deleteOne);
router.post('/updateName', updateName);

export default router;
