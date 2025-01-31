import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const [stockInput, setStockInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
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
    if (inputError) setInputError('');
  };

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <section className="search-section">
          <h1 className="search-title">Search Stock Market Data</h1>
          <form onSubmit={handleSubmit} className="search-form">
            <div className={`input-wrapper ${isFocused ? 'focused' : ''}`}>
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                value={stockInput}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter stock symbol (e.g., AAPL)"
                className={`search-input ${inputError ? 'error' : ''}`}
              />
              {stockInput && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={() => setStockInput('')}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            {inputError && <div className="error-message">{inputError}</div>}
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
              <span>Search</span>
            </button>
          </form>
        </section>

        <section className="featured-section">
          <div className="featured-card">
            <i className="fas fa-rocket card-icon"></i>
            <h3>Getting Started</h3>
            <p>Enter a stock symbol to view detailed market data and analysis.</p>
          </div>
          <div className="featured-card">
            <i className="fas fa-chart-line card-icon"></i>
            <h3>Market Insights</h3>
            <p>Access historical data and price trends for informed decisions.</p>
          </div>
          <div className="featured-card">
            <i className="fas fa-star card-icon"></i>
            <h3>Track Favorites</h3>
            <p>Add stocks to your watchlist for easy monitoring.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;