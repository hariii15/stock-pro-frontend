import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const GoogleLogin = () => {
  const { login } = useAuth();
  
  const apiClient = axios.create({
    baseURL: 'https://stock-pro-backend.onrender.com',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // First, get user info from Google
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        // Then send to our backend
        const res = await apiClient.post('/api/auth/google-login', {
          googleId: userInfo.data.sub,
          email: userInfo.data.email,
          name: userInfo.data.name,
          picture: userInfo.data.picture
        });
        
        if (res.data.token) {
          await login(res.data.token);
        }
      } catch (error) {
        console.error('Google login error:', error.response?.data || error.message);
        alert('Login failed. Please try again.');
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      alert('Google login failed. Please try again.');
    },
    flow: 'implicit'
  });

  return (
    <button 
      onClick={() => googleLogin()} 
      className="google-login-button"
      style={{
        padding: '10px 20px',
        backgroundColor: '#4285f4',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '16px'
      }}
    >
      <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
      </svg>
      Sign in with Google
    </button>
  );
};

export default GoogleLogin; 