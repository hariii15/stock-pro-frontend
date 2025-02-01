import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import axios from 'axios';

const GoogleLogin = () => {
  const { login } = useAuth();
  
  const testBackendConnection = async () => {
    try {
      const res = await api.get('/test');
      console.log('Backend test response:', res.data);
      alert('Backend connection successful!');
    } catch (error) {
      console.error('Backend test error:', error.response?.data || error.message);
      alert('Backend connection failed!');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
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

        if (res.data.token) {
          await login(res.data.token);
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Auth error:', error.response?.data || error.message);
        alert('Login failed. Please try again.');
      }
    },
    flow: 'implicit',
    scope: 'email profile',
    cookiePolicy: 'single_host_origin'
  });

  return (
    <div>
      <button onClick={googleLogin} className="auth-button google-login">
        Continue with Google
      </button>
      <button 
        onClick={testBackendConnection}
        style={{ marginTop: '10px' }}
      >
        Test Backend Connection
      </button>
    </div>
  );
};

export default GoogleLogin; 