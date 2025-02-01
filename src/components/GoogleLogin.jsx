import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import axios from 'axios';

const GoogleLogin = () => {
  const { login } = useAuth();
  
  const testBackendConnection = async () => {
    try {
      // Test the main backend connection
      const testRes = await api.get('/test');
      console.log('General backend test:', testRes.data);

      // Test the auth routes specifically
      const authRes = await api.get('/auth/test');
      console.log('Auth routes test:', authRes.data);

      alert('Backend connection successful!');
    } catch (error) {
      console.error('Backend test error:', error.response?.data || error.message);
      alert(`Backend connection failed: ${error.message}`);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Starting Google login process...');
        
        // Get user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { 
              'Authorization': `Bearer ${tokenResponse.access_token}`,
              'Accept': 'application/json'
            }
          }
        );

        console.log('Got user info from Google');

        // Send to backend
        const res = await api.post('/auth/google', {
          token: tokenResponse.access_token,
          userData: {
            googleId: userInfo.data.sub,
            email: userInfo.data.email,
            name: userInfo.data.name,
            picture: userInfo.data.picture
          }
        });

        console.log('Backend auth response:', res.data);

        if (res.data.token) {
          await login(res.data.token);
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Auth error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        alert('Login failed. Please try again.');
      }
    },
    flow: 'implicit',
    scope: 'email profile',
    cookiePolicy: 'single_host_origin'
  });

  return (
    <div className="auth-buttons">
      <button onClick={googleLogin} className="auth-button google-login">
        Continue with Google
      </button>
      <button 
        onClick={testBackendConnection}
        className="test-button"
        style={{ 
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Backend Connection
      </button>
    </div>
  );
};

export default GoogleLogin; 