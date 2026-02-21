// API service for communicating with the backend
const API_BASE_URL = '/api';

export const apiService = {
  // Set auth token in localStorage
  setToken(token) {
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  },

  getToken() {
    return localStorage.getItem('access_token');
  },

  // Make API request with auth header
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Unauthorized - clear token
      this.setToken(null);
      window.location.href = '/';
    }

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, ...data };
    }

    return data;
  },

  // ==================== AUTH ====================
  async register(username, email, password, fullName = '') {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
        full_name: fullName,
      }),
    });
  },

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // ==================== USER ====================
  async getProfile() {
    return this.request('/user/profile');
  },

  async updateProfile(fullName, email) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ full_name: fullName, email }),
    });
  },

  async getUserStats() {
    return this.request('/user/stats');
  },

  // ==================== GAME ====================
  async startGame(difficulty = 'normal') {
    return this.request('/game/start', {
      method: 'POST',
      body: JSON.stringify({ difficulty }),
    });
  },

  async endGame(sessionId, score, durationSeconds, tilesHit, tilesMissed) {
    return this.request('/game/end', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        score,
        duration_seconds: durationSeconds,
        tiles_hit: tilesHit,
        tiles_missed: tilesMissed,
      }),
    });
  },

  async getGameHistory(limit = 20) {
    return this.request(`/game/history?limit=${limit}`);
  },

  // ==================== LEADERBOARD ====================
  async getGlobalLeaderboard(limit = 20) {
    return this.request(`/leaderboard/global?limit=${limit}`);
  },

  async getWeeklyLeaderboard(limit = 20) {
    return this.request(`/leaderboard/weekly?limit=${limit}`);
  },

  async getUserRank(userId) {
    return this.request(`/leaderboard/rank/${userId}`);
  },

  // ==================== ACHIEVEMENTS ====================
  async getAllAchievements() {
    return this.request('/achievements');
  },

  async getUserAchievements() {
    return this.request('/user/achievements');
  },

  // ==================== DAILY CHALLENGE ====================
  async getDailyChallenge() {
    return this.request('/daily-challenge');
  },
};

export default apiService;
