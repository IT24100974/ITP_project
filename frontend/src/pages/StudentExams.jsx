import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import '../css/dashboard.css';

const StudentExams = () => {
  const { user } = useContext(AuthContext);
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamData();
  }, []);

  const fetchExamData = async () => {
    try {
      const { data } = await api.get(`/exams/student/${user._id}`);
      setExamData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exam data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <h1>My Exam Results</h1>

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

      <div className="exam-records-section">
        <h2>All Exam Results</h2>
        {examData?.exams && examData.exams.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Exam Date</th>
              </tr>
            </thead>
            <tbody>
              {examData.exams.map((exam) => (
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
          <p className="no-data">No exam records found</p>
        )}
      </div>
    </div>
  );
};

export default StudentExams;
