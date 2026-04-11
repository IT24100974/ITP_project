import Exam from '../models/Exam.js';
import User from '../models/User.js';

// @desc    Create new exam record
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = async (req, res) => {
  try {
    const { studentId, subject, marks, totalMarks, examDate } = req.body;

    // Validation
    if (!studentId || !subject || marks === undefined || !totalMarks) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Create exam record
    const exam = await Exam.create({
      studentId,
      subject,
      marks,
      totalMarks,
      examDate: examDate || Date.now()
    });

    const populatedExam = await Exam.findById(exam._id).populate('studentId', 'name email class');
    res.status(201).json(populatedExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private/Admin
export const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate('studentId', 'name email class').sort({ examDate: -1 });
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get exams by student ID
// @route   GET /api/exams/student/:studentId
// @access  Private
export const getExamsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // If user is a student, they can only view their own exams
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'You can only view your own exam records' });
    }

    const exams = await Exam.find({ studentId }).populate('studentId', 'name email class').sort({ examDate: -1 });
    
    // Calculate statistics
    if (exams.length > 0) {
      const totalMarksObtained = exams.reduce((sum, exam) => sum + exam.marks, 0);
      const totalMaxMarks = exams.reduce((sum, exam) => sum + exam.totalMarks, 0);
      const averagePercentage = (totalMarksObtained / totalMaxMarks * 100).toFixed(2);
      
      res.json({
        exams,
        statistics: {
          totalExams: exams.length,
          totalMarksObtained,
          totalMaxMarks,
          averagePercentage
        }
      });
    } else {
      res.json({
        exams: [],
        statistics: {
          totalExams: 0,
          totalMarksObtained: 0,
          totalMaxMarks: 0,
          averagePercentage: 0
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('studentId', 'name email class');
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam record not found' });
    }

    // If user is a student, they can only view their own exams
    if (req.user.role === 'student' && req.user._id.toString() !== exam.studentId._id.toString()) {
      return res.status(403).json({ message: 'You can only view your own exam records' });
    }
    
    res.json(exam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update exam record
// @route   PUT /api/exams/:id
// @access  Private/Admin
export const updateExam = async (req, res) => {
  try {
    const { subject, marks, totalMarks, examDate } = req.body;

    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam record not found' });
    }

    // Update fields
    exam.subject = subject || exam.subject;
    exam.marks = marks !== undefined ? marks : exam.marks;
    exam.totalMarks = totalMarks || exam.totalMarks;
    exam.examDate = examDate || exam.examDate;

    const updatedExam = await exam.save();
    const populatedExam = await Exam.findById(updatedExam._id).populate('studentId', 'name email class');
    
    res.json(populatedExam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete exam record
// @route   DELETE /api/exams/:id
// @access  Private/Admin
export const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam record not found' });
    }

    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam record removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
