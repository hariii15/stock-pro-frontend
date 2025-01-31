import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import '../styles/login.css';

/**
 * Login Component - Handles Google OAuth authentication
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (googleData) => {
    try {
      const response = await api.post('/auth/google', {
        token: googleData.credential
      });

      if (response.data.success && response.data.token) {
        login(response.data.token);
        navigate('/home');
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="wrapper">
      <div className="container">
        <div className="left">
          <h1>Welcome to Stock Pista</h1>
        </div>
        <div className="right">
          <h2>Login with Google</h2>
          <GoogleLogin
            onSuccess={handleLogin}
            onError={() => {
              console.error('Google Login Failed');
              alert('Google login failed. Please try again.');
            }}
            className="modern-button"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;