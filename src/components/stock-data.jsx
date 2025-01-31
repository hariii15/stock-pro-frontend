import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StockService from '../services/stockService';
import api from '../api/axios';
import '../styles/stock-data.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockData = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) {
        setError('No symbol provided');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await StockService.getStockData(symbol);
        setStockData(data);
      } catch (err) {
        console.error('Stock Data Error:', err);
        setError(err.message || 'Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (stockData && user) {
        try {
          const response = await api.get('/api/watchlist');
          setIsInWatchlist(response.data.some(stock => stock.symbol === symbol));
        } catch (err) {
          console.error('Error checking watchlist:', err);
        }
      }
    };

    checkWatchlist();
  }, [stockData, user, symbol]);

  const handleAddToWatchlist = async () => {
    try {
      const lastClose = stockData.historicalData[stockData.historicalData.length - 1].close;
      const firstClose = stockData.historicalData[0].close;
      const profitLoss = ((lastClose - firstClose) / firstClose) * 100;

      const watchlistItem = {
        symbol: symbol,
        companyName: stockData.currentData.companyName,
        currentPrice: lastClose,
        profitLoss: profitLoss
      };

      console.log('Adding to watchlist:', watchlistItem); // Debug log

      const response = await api.post('/watchlist', watchlistItem);
      console.log('Watchlist response:', response.data); // Debug log

      setIsInWatchlist(true);
      alert('Added to watchlist successfully!');
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      if (err.code === 'ERR_NETWORK') {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert(err.response?.data?.message || 'Failed to add to watchlist');
      }
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      await api.delete(`/api/watchlist/${symbol}`);
      setIsInWatchlist(false);
      alert('Removed from watchlist successfully!');
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      alert('Failed to remove from watchlist');
    }
  };

  const handleBackToHome = () => {
    navigate('/home');
  };

  if (loading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stockData) return <div>No data available</div>;

  return (
    <div className="stock-data-container">
      <div className="header-section">
        <div className="stock-info">
          <h2>{stockData.currentData.companyName} ({symbol})</h2>
          <p className="current-price">
            ${stockData.currentData.price.toFixed(2)}
          </p>
        </div>
        <div className="action-buttons">
          {isInWatchlist ? (
            <button 
              onClick={handleRemoveFromWatchlist} 
              className="action-button watchlist-button remove"
            >
              <i className="fas fa-star"></i> Remove from Watchlist
            </button>
          ) : (
            <button 
              onClick={handleAddToWatchlist} 
              className="action-button watchlist-button add"
            >
              <i className="far fa-star"></i> Add to Watchlist
            </button>
          )}
          <button 
            onClick={handleBackToHome} 
            className="action-button back-button"
          >
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
        </div>
      </div>

      <div className="current-data-card">
        <div className="card-item">
          <span className="label">Current Price</span>
          <span className="value">${stockData.currentData.price.toFixed(2)}</span>
        </div>
        <div className="card-item">
          <span className="label">Change</span>
          <span className={`value ${stockData.currentData.change >= 0 ? 'positive' : 'negative'}`}>
            {stockData.currentData.change >= 0 ? '+' : ''}
            ${Math.abs(stockData.currentData.change).toFixed(2)} 
            ({stockData.currentData.changePercent.toFixed(2)}%)
          </span>
        </div>
        <div className="card-item">
          <span className="label">Day High</span>
          <span className="value">${stockData.currentData.dayHigh.toFixed(2)}</span>
        </div>
        <div className="card-item">
          <span className="label">Day Low</span>
          <span className="value">${stockData.currentData.dayLow.toFixed(2)}</span>
        </div>
        <div className="card-item">
          <span className="label">Volume</span>
          <span className="value">{stockData.currentData.volume.toLocaleString()}</span>
        </div>
      </div>

      <div className="historical-data-table">
        <h3>Historical Data (Last 30 Days)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Close Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {stockData.historicalData.map((day) => (
                <tr key={day.date}>
                  <td>{day.date}</td>
                  <td>${day.close.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-section">
        <Line 
          data={{
            labels: stockData.historicalData.map(day => day.date),
            datasets: [{
              label: 'Stock Price',
              data: stockData.historicalData.map(day => day.close),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Stock Price History - Last 30 Days'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default StockData;
