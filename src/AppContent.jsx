import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/stock.css';
import Navbar from './components/navbar.jsx';
import Home from './components/home.jsx';
import Login from './components/Login.jsx';
import Profile from './components/profile.jsx';
import WatchList from './components/Watchlist.jsx';
import StockData from './components/stock-data.jsx';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [stockInput, setStockInput] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setIsLoading(false);
    } else {
      try {
        JSON.parse(userData);
        setIsLoading(false);
      } catch (error) {
        localStorage.removeItem('user');
        setIsLoading(false);
      }
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const routes = [
    {
      path: '/',
      element: () => <Navigate to={user ? '/home' : '/login'} />,
      protected: false
    },
    {
      path: '/login',
      element: () => <Login />,
      protected: false
    },
    {
      path: '/home',
      element: () => <Home stockInput={stockInput} setStockInput={setStockInput} />,
      protected: true
    },
    {
      path: '/stock-data',
      element: () => <StockData stockInput={stockInput} />,
      protected: true
    },
    {
      path: '/stock/:symbol',
      element: () => <StockData />,
      protected: true
    },
    {
      path: '/profile',
      element: () => <Profile />,
      protected: true
    },
    {
      path: '/watchlist',
      element: () => <WatchList />,
      protected: true
    },
    {
      path: '*',
      element: () => <Navigate to={user ? "/home" : "/login"} />,
      protected: false
    }
  ];

  const renderRoute = (route) => {
    if (route.protected && !user) {
      return <Navigate to="/login" replace />;
    }
    return route.element();
  };

  return (
    <Router>
      <Navbar user={user} onLogout={logout} />
      <div className="app">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={renderRoute(route)}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default AppContent;
