export const mockNews = [
  {
    title: "Tesla Q4 Earnings Beat Expectations, Revenue Up 25%",
    url: "https://example.com/tesla-earnings",
    publishedAt: new Date().toISOString(),
    category: "Earnings",
    symbol: "TSLA",
    summary: "Tesla reported Q4 earnings above analyst estimates with revenue growth of 25% year-over-year..."
  },
  {
    title: "Fed Signals Potential Rate Cuts in 2024",
    url: "https://example.com/fed-rates",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    category: "Economy",
    summary: "Federal Reserve officials indicated they may consider interest rate cuts later this year..."
  },
  {
    title: "Apple's AI Strategy Revealed in Latest Patent Filings",
    url: "https://example.com/apple-ai",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    category: "Technology",
    symbol: "AAPL",
    summary: "New patent filings reveal Apple's ambitious plans in artificial intelligence..."
  },
  {
    title: "S&P 500 Hits New All-Time High",
    url: "https://example.com/sp500-record",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    category: "Markets",
    summary: "The S&P 500 index reached a new record high, driven by strong tech sector performance..."
  }
];
