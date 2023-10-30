import express from 'express';
import { login, logout, register, editUser } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/editUser', editUser);

export default router;
