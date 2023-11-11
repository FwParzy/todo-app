import express from 'express';
import {
  getTasks,
  getAllTasks,
  create,
  deleteOne,
  completeOne,
  updateName,
  updateCategory,
  deleteAllInCat,
  deleteOldTasks
} from '../controllers/tasks.js';

const router = express.Router();

router.post('/create', create);
router.get('/:userId&:categoryId', getTasks);
router.get('/all-:userId', getAllTasks);
router.post('/deleteOne', deleteOne);
router.post('/updateName', updateName);
router.post('/complete', completeOne);
router.post('/changeCat', updateCategory);
router.post('/deleteOld', deleteOldTasks);
router.post('/deleteCat', deleteAllInCat);

export default router;
