import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: 0
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks are required'],
    min: 0
  },
  percentage: {
    type: Number
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B', 'C', 'D', 'F']
  },
  examDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate percentage and grade before saving
examSchema.pre('save', function(next) {
  // Calculate percentage
  this.percentage = ((this.marks / this.totalMarks) * 100).toFixed(2);
  
  // Calculate grade
  if (this.percentage >= 90) {
    this.grade = 'A+';
  } else if (this.percentage >= 80) {
    this.grade = 'A';
  } else if (this.percentage >= 70) {
    this.grade = 'B';
  } else if (this.percentage >= 60) {
    this.grade = 'C';
  } else if (this.percentage >= 50) {
    this.grade = 'D';
  } else {
    this.grade = 'F';
  }
  
  next();
});

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
