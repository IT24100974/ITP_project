import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../css/dashboard.css';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const { data } = await api.get(`/exams/student/${user._id}`);
      setExamData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Student Dashboard</h1>
      
      <div className="profile-card">
        <img src={user.photo} alt={user.name} className="profile-photo" />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Class:</strong> {user.class}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Exams</h3>
          <p className="stat-number">{examData?.statistics?.totalExams || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Average Performance</h3>
          <p className="stat-number">{examData?.statistics?.averagePercentage || 0}%</p>
        </div>
        <div className="stat-card">
          <h3>Total Marks</h3>
          <p className="stat-number">
            {examData?.statistics?.totalMarksObtained || 0} / {examData?.statistics?.totalMaxMarks || 0}
          </p>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Exam Results</h2>
        {examData?.exams && examData.exams.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {examData.exams.slice(0, 5).map((exam) => (
                <tr key={exam._id}>
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
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No exam records found</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
