import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}>
            Tuition Management System
          </Link>
        </div>
        
        <div className="navbar-menu">
          {user ? (
            <>
              <span className="navbar-user">
                Welcome, {user.name} ({user.role})
              </span>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/admin/students" className="navbar-link">Students</Link>
                  <Link to="/admin/exams" className="navbar-link">Exams</Link>
                </>
              )}
              {user.role === 'student' && (
                <>
                  <Link to="/student/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/student/profile" className="navbar-link">Profile</Link>
                  <Link to="/student/exams" className="navbar-link">My Exams</Link>
                </>
              )}
              <button onClick={logout} className="navbar-button">Logout</button>
            </>
          ) : (
            <Link to="/login" className="navbar-link">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
