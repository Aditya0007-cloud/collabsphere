import express from 'express';
import { addTaskComment, createTask, deleteTask, listTasks, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router({ mergeParams: true });

router.use(protect);
router.route('/:workspaceId').get(listTasks).post(requireFields('title'), createTask);
router.route('/:workspaceId/:taskId').patch(updateTask).delete(deleteTask);
router.post('/:workspaceId/:taskId/comments', requireFields('body'), addTaskComment);

export default router;
