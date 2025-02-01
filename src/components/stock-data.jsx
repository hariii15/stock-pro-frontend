import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/stock-data.css';

const StockData = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Get the auth token
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // Validate symbol format
  const isValidSymbol = (sym) => {
    return /^[A-Za-z]{1,5}$/.test(sym);
  };

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return;

      try {
        setLoading(true);
        console.log('API URL:', import.meta.env.VITE_API_URL);
        console.log('Auth Token:', token);

        // Skip health check and directly fetch stock data
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/stocks/${symbol}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        console.log('API Response:', response.data);
        setStockData(response.data);
        setError(null);
      } catch (err) {
        console.error('API Error:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.message || 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, token]);

  // Show detailed loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">
          <div>Loading data for {symbol}...</div>
          <div className="loading-status">
            Status: {connectionStatus === 'connecting' 
              ? 'Connecting to server...' 
              : connectionStatus === 'connected'
              ? 'Connected, fetching data...'
              : 'Connection failed'}
          </div>
          <div className="loading-details">
            Attempting to reach: {import.meta.env.VITE_API_URL}/api/stocks/{symbol}
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="error">{error}</div>;
  if (!stockData) return <div>No data available</div>;

  return (
    <div className="stock-data-container">
      <h2>{symbol} Stock Data</h2>
      
      {stockData.price && (
        <div className="price-section">
          <h3>Current Price: ${stockData.price}</h3>
        </div>
      )}

      {stockData.historicalData && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {stockData.historicalData.map((day, index) => (
                <tr key={index}>
                  <td>{day.date}</td>
                  <td>${day.open}</td>
                  <td>${day.high}</td>
                  <td>${day.low}</td>
                  <td>${day.close}</td>
                  <td>{day.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockData;
