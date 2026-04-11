import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../css/dashboard.css';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="page-container">
      <h1>My Profile</h1>
      
      <div className="profile-detail-card">
        <div className="profile-photo-container">
          <img src={user.photo} alt={user.name} className="profile-photo-large" />
        </div>
        
        <div className="profile-details">
          <div className="profile-detail-item">
            <label>Full Name:</label>
            <p>{user.name}</p>
          </div>
          
          <div className="profile-detail-item">
            <label>Email Address:</label>
            <p>{user.email}</p>
          </div>
          
          <div className="profile-detail-item">
            <label>Phone Number:</label>
            <p>{user.phone}</p>
          </div>
          
          <div className="profile-detail-item">
            <label>Class:</label>
            <p>{user.class}</p>
          </div>
          
          <div className="profile-detail-item">
            <label>Address:</label>
            <p>{user.address}</p>
          </div>
          
          <div className="profile-detail-item">
            <label>Role:</label>
            <p className="role-badge">{user.role.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
