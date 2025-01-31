import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import './styles/stock.css'; 
import StockData from './components/stock-data.jsx';
import Login from './components/Login.jsx';
import Navbar from './components/navbar.jsx';
import Home from './components/home.jsx';
import Profile from './components/profile.jsx';
import WatchList from './components/Watchlist.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StockProvider } from './contexts/StockContext.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute check:', { user, loading });
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Separate component for authenticated content
function AppContent() {
  const { user, loading, token } = useAuth();

  // Debug logs for user, token
  console.log('AppContent rendering:', { user, token, loading });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {user && <Navbar />}
      <div className="app">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/home" replace /> : <Login />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/home" : "/login"} replace />} 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
          <Route path="/stock-data" element={<PrivateRoute><StockData /></PrivateRoute>} />
          <Route path="/stock/:symbol" element={<PrivateRoute><StockData /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/watchlist" element={<PrivateRoute><WatchList /></PrivateRoute>} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

// Main App component
function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <StockProvider>
          <AppContent />
        </StockProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
