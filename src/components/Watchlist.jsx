import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/watchlist.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/watchlist');
      if (response.data.success) {
        setWatchlist(response.data.watchlist);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (symbol) => {
    try {
      const response = await api.delete(`/watchlist/${symbol}`);
      if (response.data.success) {
        setWatchlist(response.data.watchlist);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove from watchlist');
    }
  };

  const handleViewDetails = (symbol) => {
    navigate(`/stock/${symbol}`);
  };

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (value.length >= 1) {
      try {
        const response = await api.get(`/stocks/search`, {
          params: { query: value }
        });
        
        if (Array.isArray(response.data)) {
          setSuggestions(response.data.slice(0, 5));
        } else {
          console.error('Unexpected response format:', response.data);
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
    setSearchTerm('');
    setSuggestions([]);
  };

  const filteredWatchlist = watchlist.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading watchlist...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className={`watchlist-container ${isFocused ? 'search-focused' : ''}`}>
      <h2 className="watchlist-title">My Watchlist</h2>
      
      <div className="search-container">
        <div className={`search-wrapper ${isFocused ? 'focused' : ''}`}>
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow clicking on suggestions
              setTimeout(() => setIsFocused(false), 200);
            }}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-button"
              onClick={() => {
                setSearchTerm('');
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
      </div>

      {watchlist.length === 0 ? (
        <p className="no-stocks">No stocks in watchlist</p>
      ) : (
        <div className="watchlist-grid">
          {filteredWatchlist.map((stock) => (
            <div key={stock.symbol} className="watchlist-card">
              <div className="card-header">
                <h3 className="stock-symbol">{stock.symbol}</h3>
                <button 
                  onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                  className="remove-button"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <p className="company-name">{stock.companyName}</p>
              <p className="current-price">${stock.currentPrice.toFixed(2)}</p>
              <p className={`profit-loss ${stock.profitLoss >= 0 ? 'positive' : 'negative'}`}>
                {stock.profitLoss >= 0 ? '+' : ''}{stock.profitLoss.toFixed(2)}%
              </p>
              <button 
                onClick={() => handleViewDetails(stock.symbol)}
                className="details-button"
              >
                <i className="fas fa-chart-line"></i>
                See Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
