import express from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass
} from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleAuth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

router.route('/')
  .get(getAllStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

router.get('/class/:className', getStudentsByClass);

export default router;
