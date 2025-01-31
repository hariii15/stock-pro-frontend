import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/profile.css';

const Profile = () => {
  const { user } = useAuth();

  // Debug: Log user object to see its structure
  useEffect(() => {
    console.log('User object:', user);
  }, [user]);

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  // Try different ways to access the profile picture
  const profilePicture = user.imageUrl || // Try imageUrl
                        user.picture ||    // Try picture
                        user.photoURL ||   // Try photoURL
                        (user.googleUser && user.googleUser.picture) || // Try nested googleUser
                        user.profilePic;   // Try profilePic

  console.log('Profile picture URL:', profilePicture); // Debug: Log the URL

  return (
    <div className="whole">
<div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          {profilePicture ? (
            <img 
            className="profile-avatar"
              src={profilePicture}
              alt="Profile" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                console.log('Image failed to load:', e); // Debug: Log any load errors
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/150?text=Profile'; // Fallback image
              }}
            />
          ) : (
            <div className="profile-picture-placeholder">
              <i className="fas fa-user"></i>
            </div>
          )}
          <h2 className="info-label">{user.name || user.displayName || 'User'}</h2>
          <p className="info-label">{user.email}</p>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <i className="fas fa-user"></i>
            <div className="detail-info">
              <label>Username</label>
              <p>{user.name || user.displayName || 'Not available'}</p>
            </div>
          </div>

          <div className="detail-item">
            <i className="fas fa-envelope"></i>
            <div className="detail-info">
              <label>Email</label>
              <p>{user.email || 'Not available'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default Profile;