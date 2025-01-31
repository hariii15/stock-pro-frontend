import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStock } from '../contexts/StockContext';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const { stockSymbol, setStockSymbol } = useStock();
  console.log('Stock Context:', { stockSymbol, setStockSymbol }); // Debug log

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', stockSymbol); // Debug log
    
    if (stockSymbol?.trim()) {
      navigate(`/stock/${stockSymbol.trim().toUpperCase()}`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    console.log('Input Change:', value); // Debug log
    
    if (/^[A-Z]*$/.test(value) || value === '') {
      setStockSymbol(value);
    }
  };

  return (
    <div className="home-container">
      <section className="search-section">
        <h1 className="search-title">Search Stock Market Data</h1>
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={stockSymbol || ''}
            onChange={handleInputChange}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="search-input"
            maxLength={5}
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
            <span>Search</span>
          </button>
        </form>
      </section>
      {/* ...existing code... */}
    </div>
  );
};

export default Home;
