import express from 'express';
import {
  createExam,
  getAllExams,
  getExamsByStudent,
  getExamById,
  updateExam,
  deleteExam
} from '../controllers/examController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/roleAuth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.post('/', adminOnly, createExam);
router.get('/', adminOnly, getAllExams);
router.put('/:id', adminOnly, updateExam);
router.delete('/:id', adminOnly, deleteExam);

// Routes accessible by both admin and student (with restrictions)
router.get('/student/:studentId', getExamsByStudent);
router.get('/:id', getExamById);

export default router;
