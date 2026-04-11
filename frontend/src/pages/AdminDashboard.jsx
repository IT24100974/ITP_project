import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../css/dashboard.css';

// charting libraries
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalExams: 0,
    averagePerformance: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // chart data for subjects
  const [subjectStats, setSubjectStats] = useState({
    labels: [],
    counts: [],
    avgPerc: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, examsRes] = await Promise.all([
        api.get('/students'),
        api.get('/exams')
      ]);

      const students = studentsRes.data;
      const exams = examsRes.data;

      // Calculate average performance
      let avgPerformance = 0;
      if (exams.length > 0) {
        const totalPercentage = exams.reduce((sum, exam) => sum + parseFloat(exam.percentage), 0);
        avgPerformance = (totalPercentage / exams.length).toFixed(2);
      }

      setStats({
        totalStudents: students.length,
        totalExams: exams.length,
        averagePerformance: avgPerformance
      });

      // build subject statistics for charts
      const groups = {};
      exams.forEach((exam) => {
        const subj = exam.subject || 'Unknown';
        if (!groups[subj]) {
          groups[subj] = { count: 0, totalPerc: 0 };
        }
        groups[subj].count += 1;
        groups[subj].totalPerc += parseFloat(exam.percentage || 0);
      });

      const labels = Object.keys(groups);
      const counts = labels.map((l) => groups[l].count);
      const avgPerc = labels.map((l) =>
        groups[l].count > 0
          ? (groups[l].totalPerc / groups[l].count).toFixed(2)
          : 0
      );

      setSubjectStats({ labels, counts, avgPerc });

      setRecentStudents(students.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{stats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h3>Total Exams</h3>
          <p className="stat-number">{stats.totalExams}</p>
        </div>
        <div className="stat-card">
          <h3>Average Performance</h3>
          <p className="stat-number">{stats.averagePerformance}%</p>
        </div>
      </div>

      {/* Charts Section */}
      {subjectStats.labels.length > 0 && (
        <>
          <div className="chart-container">
            <h2>Exams by Subject</h2>
            <Bar
              data={{
                labels: subjectStats.labels,
                datasets: [
                  {
                    label: 'Number of Exams',
                    data: subjectStats.counts,
                    backgroundColor: 'rgba(75,192,192,0.6)'
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }}
            />
          </div>

          <div className="chart-container">
            <h2>Average Performance by Subject</h2>
            <Line
              data={{
                labels: subjectStats.labels,
                datasets: [
                  {
                    label: 'Average %',
                    data: subjectStats.avgPerc,
                    borderColor: 'rgba(153,102,255,1)',
                    backgroundColor: 'rgba(153,102,255,0.2)',
                    fill: true
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }}
            />
          </div>
        </>
      )}

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/students/add" className="action-button">Add New Student</Link>
          <Link to="/admin/students" className="action-button">Manage Students</Link>
          <Link to="/admin/exams" className="action-button">Manage Exams</Link>
        </div>
      </div>

      <div className="recent-section">
        <h2>Recent Students</h2>
        {recentStudents.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.map((student) => (
                <tr key={student._id}>
                  <td>
                    <img src={student.photo} alt={student.name} className="student-photo-small" />
                  </td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.class}</td>
                  <td>{student.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students found</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
