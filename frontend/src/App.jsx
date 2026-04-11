import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import StudentRoute from './components/StudentRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentManagement from './pages/StudentManagement';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import ExamManagement from './pages/ExamManagement';
import StudentExams from './pages/StudentExams';
import Profile from './pages/Profile';
import './css/styles.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/students" element={
                <AdminRoute>
                  <StudentManagement />
                </AdminRoute>
              } />
              <Route path="/admin/students/add" element={
                <AdminRoute>
                  <AddStudent />
                </AdminRoute>
              } />
              <Route path="/admin/students/edit/:id" element={
                <AdminRoute>
                  <EditStudent />
                </AdminRoute>
              } />
              <Route path="/admin/exams" element={
                <AdminRoute>
                  <ExamManagement />
                </AdminRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={
                <StudentRoute>
                  <StudentDashboard />
                </StudentRoute>
              } />
              <Route path="/student/profile" element={
                <StudentRoute>
                  <Profile />
                </StudentRoute>
              } />
              <Route path="/student/exams" element={
                <StudentRoute>
                  <StudentExams />
                </StudentRoute>
              } />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
