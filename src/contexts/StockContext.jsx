import React, { createContext, useContext, useState } from 'react';

const StockContext = createContext(null);

export const StockProvider = ({ children }) => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStock = (symbol, data) => {
    setStockSymbol(symbol);
    setStockData(data);
  };

  const clearStock = () => {
    setStockSymbol('');
    setStockData(null);
    setError(null);
  };

  return (
    <StockContext.Provider value={{
      stockSymbol,
      stockData,
      loading,
      error,
      setStockSymbol,
      setStockData,
      setLoading,
      setError,
      updateStock,
      clearStock
    }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
