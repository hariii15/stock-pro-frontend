import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import SearchBar from './SearchBar';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Google Login Success:', tokenResponse);
      // Handle successful login here
      navigate('/home');
    },
    onError: error => {
      console.error('Google Login Failed:', error);
    }
  });

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to StockPista</h1>
        <p className="welcome-subtitle">Track, analyze, and manage your investments</p>
        <button 
          onClick={() => login()} 
          className="google-login-button"
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
            alt="Google logo" 
            className="google-icon"
          />
          <span>Sign in with Google</span>
          <i className="fas fa-rocket"></i>
        </button>
      </div>
      <SearchBar />
    </div>
  );
};

export default Dashboard; 