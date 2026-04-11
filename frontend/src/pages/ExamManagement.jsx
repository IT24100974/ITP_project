import { useState, useEffect } from 'react';
import api from '../services/api';
import '../css/forms.css';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    subject: '',
    marks: '',
    totalMarks: '',
    examDate: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
    fetchStudents();
  }, []);

  const fetchExams = async () => {
    try {
      const { data } = await api.get('/exams');
      setExams(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.studentId || !formData.subject || !formData.marks || !formData.totalMarks) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.marks) > parseFloat(formData.totalMarks)) {
      setError('Marks cannot be greater than total marks');
      return;
    }

    try {
      await api.post('/exams', formData);
      setMessage('Exam record created successfully');
      setFormData({
        studentId: '',
        subject: '',
        marks: '',
        totalMarks: '',
        examDate: ''
      });
      setShowForm(false);
      fetchExams();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating exam record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam record?')) {
      try {
        await api.delete(`/exams/${id}`);
        setMessage('Exam record deleted successfully');
        fetchExams();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting exam record');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Exam Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add New Exam Record'}
        </button>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="exam-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentId">Select Student *</label>
              <select
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                required
              >
                <option value="">Choose a student</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} - {student.class}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="marks">Marks Obtained *</label>
              <input
                type="number"
                id="marks"
                name="marks"
                value={formData.marks}
                onChange={handleChange}
                placeholder="Enter marks"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalMarks">Total Marks *</label>
              <input
                type="number"
                id="totalMarks"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                placeholder="Enter total marks"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="examDate">Exam Date (Optional)</label>
            <input
              type="date"
              id="examDate"
              name="examDate"
              value={formData.examDate}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary">Create Exam Record</button>
        </form>
      )}

      <div className="exam-records-section">
        <h2>All Exam Records</h2>
        {exams.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Marks</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Exam Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td>{exam.studentId?.name || 'N/A'}</td>
                  <td>{exam.studentId?.class || 'N/A'}</td>
                  <td>{exam.subject}</td>
                  <td>{exam.marks}</td>
                  <td>{exam.totalMarks}</td>
                  <td>{exam.percentage}%</td>
                  <td>
                    <span className={`grade-badge grade-${exam.grade.toLowerCase()}`}>
                      {exam.grade}
                    </span>
                  </td>
                  <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDelete(exam._id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No exam records found</p>
        )}
      </div>
    </div>
  );
};

export default ExamManagement;
