import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const GoogleLogin = () => {
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.post('/api/auth/google', {
          token: response.access_token
        });
        
        if (res.data.token) {
          await login(res.data.token);
        }
      } catch (error) {
        console.error('Google login error:', error);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
    },
    flow: 'implicit'
  });

  return (
    <button 
      onClick={() => googleLogin()} 
      className="google-login-button"
    >
      Sign in with Google
    </button>
  );
};

export default GoogleLogin; 