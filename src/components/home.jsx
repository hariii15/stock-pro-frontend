import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const [stockInput, setStockInput] = useState('');
  const [inputError, setInputError] = useState('');
  const navigate = useNavigate();

  const isValidSymbol = (sym) => {
    return /^[A-Za-z]{1,5}$/.test(sym);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const symbol = stockInput.trim().toUpperCase();
    
    if (!isValidSymbol(symbol)) {
      setInputError('Please enter a valid stock symbol (1-5 letters)');
      return;
    }
    
    setInputError('');
    navigate(`/stock/${symbol}`);
  };

  const handleInputChange = (e) => {
    setStockInput(e.target.value);
  };

  return (
    <div className="home-container">
      <section className="search-section">
        <h1 className="search-title">Search Stock Market Data</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={stockInput}
            onChange={handleInputChange}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className={`search-input ${inputError ? 'error' : ''}`}
          />
          {inputError && <div className="error-message">{inputError}</div>}
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
            <span>Search</span>
          </button>
        </form>
      </section>

      <section className="featured-section">
        <div className="featured-card">
          <h3>Getting Started</h3>
          <p>Enter a stock symbol to view detailed market data and analysis.</p>
        </div>
        <div className="featured-card">
          <h3>Market Insights</h3>
          <p>Access historical data and price trends for informed decisions.</p>
        </div>
        <div className="featured-card">
          <h3>Track Favorites</h3>
          <p>Add stocks to your watchlist for easy monitoring.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;