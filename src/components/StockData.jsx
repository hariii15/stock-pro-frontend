import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StockService from '../services/stockService.js';
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

const handleAddToWatchlist = async () => {
  try {
    const lastClose = stockData.historicalData[stockData.historicalData.length - 1].close;
    const firstClose = stockData.historicalData[0].close;
    const profitLoss = ((lastClose - firstClose) / firstClose) * 100;

    const watchlistItem = {
      symbol: symbol,
      companyName: stockData.currentData.companyName,
      currentPrice: stockData.currentData.price,
      profitLoss: profitLoss
    };

    const response = await api.post('/watchlist', watchlistItem);

    if (response.data.success) {
      setIsInWatchlist(true);
      alert('Added to watchlist successfully!');
    } else {
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.error('Error adding to watchlist:', err);
    alert(err.response?.data?.message || 'Failed to add to watchlist');
  }
};

const StockData = () => {
  // ... rest of your component code ...
};

export default StockData; 