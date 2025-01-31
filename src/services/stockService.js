import axios from 'axios';

class StockService {
  constructor() {
    // Using allorigins as a CORS proxy
    this.proxyUrl = 'https://api.allorigins.win/raw?url=';
  }

  async getStockData(symbol) {
    try {
      // Validate symbol
      if (!symbol) {
        throw new Error('Stock symbol is required');
      }

      // Fetch current quote data
      const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
      const historicalUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=30d`;

      console.log('Fetching data for:', symbol);

      const [quoteResponse, historicalResponse] = await Promise.all([
        axios.get(`${this.proxyUrl}${encodeURIComponent(quoteUrl)}`),
        axios.get(`${this.proxyUrl}${encodeURIComponent(historicalUrl)}`)
      ]);

      // Validate responses
      if (!quoteResponse.data?.chart?.result?.[0] || !historicalResponse.data?.chart?.result?.[0]) {
        throw new Error('Invalid data received from Yahoo Finance');
      }

      const quote = quoteResponse.data.chart.result[0];
      const historical = historicalResponse.data.chart.result[0];

      // Validate required data
      if (!quote.meta || !historical.timestamp || !historical.indicators?.quote?.[0]) {
        throw new Error('Incomplete data received from Yahoo Finance');
      }

      // Format current data
      const currentData = {
        price: quote.meta.regularMarketPrice || 0,
        change: (quote.meta.regularMarketPrice - quote.meta.previousClose) || 0,
        changePercent: ((quote.meta.regularMarketPrice - quote.meta.previousClose) / quote.meta.previousClose * 100) || 0,
        companyName: symbol,
        dayHigh: quote.meta.regularMarketDayHigh || 0,
        dayLow: quote.meta.regularMarketDayLow || 0,
        volume: quote.meta.regularMarketVolume || 0
      };

      // Format historical data with validation
      const historicalData = historical.timestamp.map((time, index) => {
        const quotes = historical.indicators.quote[0];
        return {
          date: new Date(time * 1000).toISOString().split('T')[0],
          open: quotes.open?.[index] || null,
          high: quotes.high?.[index] || null,
          low: quotes.low?.[index] || null,
          close: quotes.close?.[index] || null,
          volume: quotes.volume?.[index] || 0
        };
      }).filter(day => day.close !== null);

      // Validate we have some historical data
      if (historicalData.length === 0) {
        throw new Error('No historical data available');
      }

      return {
        symbol,
        currentData,
        historicalData
      };
    } catch (error) {
      console.error('Yahoo Finance API Error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw new Error(
        error.message === 'Failed to fetch stock data' 
          ? error.message 
          : `Failed to fetch data for ${symbol}: ${error.message}`
      );
    }
  }

  async getStockHistory(symbol, days = 30) {
    try {
      if (!symbol) {
        throw new Error('Stock symbol is required');
      }

      console.log('Fetching data for symbol:', symbol);
      // Use 1d interval to get daily data for the past 30 days
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${days}d&interval=1d`;
      const response = await axios.get(`${this.proxyUrl}${encodeURIComponent(yahooUrl)}`);

      const result = response.data.chart.result[0];
      if (!result) {
        throw new Error(`No data available for symbol: ${symbol}`);
      }

      const { timestamp, meta, indicators } = result;
      const quote = indicators.quote[0];

      // Format only the necessary data
      const formattedData = timestamp.map((time, index) => ({
        date: new Date(time * 1000).toLocaleDateString(),
        price: quote.close?.[index]?.toFixed(2) || null,
        volume: quote.volume?.[index] || 0
      })).filter(item => item.price !== null);

      return {
        symbol: meta.symbol,
        companyName: meta.symbol, // Yahoo Finance API doesn't provide company name in chart data
        data: formattedData
      };

    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw new Error(error.response?.data?.message || `Failed to fetch data for ${symbol}`);
    }
  }

  async getMultipleStocks(symbols = ['AAPL', 'GOOGL', 'MSFT']) {
    try {
      const promises = symbols.map(symbol => this.getStockHistory(symbol, '1d', '5m'));
      const results = await Promise.all(promises);
      
      return results.reduce((acc, curr) => {
        acc[curr.symbol] = curr;
        return acc;
      }, {});

    } catch (error) {
      console.error('Error fetching multiple stocks:', error);
      throw new Error('Failed to fetch multiple stocks data');
    }
  }

  // Get real-time quote
  async getQuote(symbol) {
    try {
      const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
      const response = await axios.get(`${this.proxyUrl}${encodeURIComponent(yahooUrl)}`);

      const quote = response.data.quoteResponse.result[0];
      return {
        symbol: quote.symbol,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        volume: quote.regularMarketVolume,
        high: quote.regularMarketDayHigh,
        low: quote.regularMarketDayLow,
        open: quote.regularMarketOpen,
        previousClose: quote.regularMarketPreviousClose,
        marketCap: quote.marketCap,
        timestamp: quote.regularMarketTime,
        exchange: quote.exchange,
        currency: quote.currency
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw new Error('Failed to fetch stock quote');
    }
  }

  // Search for stocks
  async searchStocks(query) {
    try {
      const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}&quotesCount=10&newsCount=0`;
      const response = await axios.get(`${this.proxyUrl}${encodeURIComponent(searchUrl)}`);
      
      return response.data.quotes.map(quote => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname,
        exchange: quote.exchange,
        type: quote.quoteType
      }));
    } catch (error) {
      console.error('Search Error:', error);
      throw new Error('Failed to search stocks');
    }
  }
}

export default new StockService();

