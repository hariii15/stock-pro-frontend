import axios from 'axios';
import { mockNews } from '../data/mockNews';

class NewsService {
  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 5000
    });
    this.retryCount = 0;
    this.maxRetries = 2;
  }

  async getNews(symbols = 'AAPL') {
    try {
      const response = await this.api.get('/yahoo-finance/news', {
        params: { symbols }
      });
      this.retryCount = 0; // Reset retry count on success
      return this.transformNewsData(response.data);
    } catch (error) {
      console.warn('API Error:', error.message);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying... Attempt ${this.retryCount}`);
        return new Promise(resolve => 
          setTimeout(() => resolve(this.getNews(symbols)), 1000)
        );
      }

      console.log('Using mock data as fallback');
      return this.transformNewsData(mockNews);
    }
  }

  transformNewsData(data) {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => ({
      id: item.link, // Use link as unique identifier
      title: item.title,
      url: item.link,
      date: new Date(item.pubDate).toLocaleString(),
      category: this.getCategoryFromTitle(item.title),
      symbol: item.symbol,
      summary: item.description?.replace(/<[^>]*>/g, '') || '' // Remove HTML tags
    }));
  }

  getCategoryFromTitle(title) {
    const categories = {
      'earnings': 'Earnings',
      'stock': 'Markets',
      'shares': 'Markets',
      'revenue': 'Finance',
      'profit': 'Finance',
      'tech': 'Technology',
      'ai': 'Technology'
    };

    const lowercaseTitle = title.toLowerCase();
    return Object.entries(categories).find(([key]) => 
      lowercaseTitle.includes(key))?.[1] || 'General';
  }
}

export default new NewsService();
