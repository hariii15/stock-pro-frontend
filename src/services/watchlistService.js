import axios from 'axios';

class WatchlistService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api/watchlist',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
  }

  checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.googleId) {
      throw new Error('Please login to continue');
    }
    this.api.defaults.headers['x-user-id'] = user.googleId;
    return user;
  }

  async getWatchlist() {
    const user = this.checkAuth();
    try {
      const response = await this.api.get('/');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Please log in to view your watchlist');
      }
      throw error;
    }
  }

  async addSymbol(symbol) {
    const user = this.checkAuth();
    try {
      const response = await this.api.post('/', { symbol });
      return response.data;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  }

  async removeSymbol(symbol) {
    const user = this.checkAuth();
    try {
      const response = await this.api.delete('/', {
        data: { symbol }
      });
      return response.data;
    } catch (error) {
      const errorDetails = {
        endpoint: 'http://localhost:5000/api/watchlist',
        method: 'DELETE',
        requestBody: { symbol },
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      };
      console.error('Error removing from watchlist:', errorDetails);
      throw error;
    }
  }
}

export default new WatchlistService();
