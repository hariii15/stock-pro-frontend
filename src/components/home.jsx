import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/home.css';

const Home = () => {
  const [stockInput, setStockInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    setStockInput(value);
    setInputError('');

    if (value.length >= 1) {
      try {
        const response = await api.get('/stocks/search', {
          params: { query: value }
        });
        
        if (Array.isArray(response.data)) {
          setSuggestions(response.data.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (symbol) => {
    navigate(`/stock/${symbol}`);
    setStockInput('');
    setSuggestions([]);
    setIsFocused(false);
  };

  return (
    <div className={`home-wrapper ${isFocused ? 'search-focused' : ''}`}>
      <div className="home-container">
        <section className="search-section">
          <h1 className="search-title">Search Stock Market Data</h1>
          <div className="search-container">
            <div className={`input-wrapper ${isFocused ? 'focused' : ''}`}>
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                value={stockInput}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  // Delay to allow clicking suggestions
                  setTimeout(() => setIsFocused(false), 200);
                }}
                placeholder="Enter stock symbol (e.g., AAPL)"
                className={`search-input ${inputError ? 'error' : ''}`}
              />
              {stockInput && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={() => {
                    setStockInput('');
                    setSuggestions([]);
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* Search Suggestions */}
            {isFocused && suggestions.length > 0 && (
              <div className="suggestions-container">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.symbol}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion.symbol)}
                  >
                    <div className="suggestion-symbol">{suggestion.symbol}</div>
                    <div className="suggestion-name">{suggestion.name}</div>
                  </div>
                ))}
              </div>
            )}
            
            {inputError && <div className="error-message">{inputError}</div>}
          </div>
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