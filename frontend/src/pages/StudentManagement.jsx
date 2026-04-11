import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../css/forms.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [search, classFilter]);

  const fetchStudents = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (classFilter) params.class = classFilter;

      const { data } = await api.get('/students', { params });
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        setMessage('Student deleted successfully');
        fetchStudents();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting student');
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
        <h1>Student Management</h1>
        <Link to="/admin/students/add" className="btn-primary">Add New Student</Link>
      </div>

      {message && <div className="success-message">{message}</div>}

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Classes</option>
          <option value="Class 1">Class 1</option>
          <option value="Class 2">Class 2</option>
          <option value="Class 3">Class 3</option>
          <option value="Class 4">Class 4</option>
          <option value="Class 5">Class 5</option>
          <option value="Class 6">Class 6</option>
          <option value="Class 7">Class 7</option>
          <option value="Class 8">Class 8</option>
          <option value="Class 9">Class 9</option>
          <option value="Class 10">Class 10</option>
        </select>
      </div>

      {students.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Class</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  <img src={student.photo} alt={student.name} className="student-photo-small" />
                </td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.class}</td>
                <td>{student.phone}</td>
                <td>{student.address}</td>
                <td>
                  <div className="action-buttons-inline">
                    <Link to={`/admin/students/edit/${student._id}`} className="btn-edit">Edit</Link>
                    <button onClick={() => handleDelete(student._id)} className="btn-delete">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No students found</p>
      )}
    </div>
  );
};

export default StudentManagement;
