/**
 * API Service - Integrates with Spring Boot Backend
 * Base URL: http://localhost:8080/api
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Get authentication headers with Bearer token
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Generic request handler
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<any>} Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        if (response.ok) {
          return { success: true };
        }
        throw new Error('An unexpected error occurred');
      }

      const data = await response.json();

      // Handle HTTP errors
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // =========================================
  // Authentication Endpoints
  // =========================================

  /**
   * Login user
   * POST /api/auth/login
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @returns {Promise<Object>} Auth response with token and user data
   */
  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  /**
   * Register new user
   * POST /api/auth/register
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @returns {Promise<Object>} Auth response with token and user data
   */
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * Logout user
   * POST /api/auth/logout
   * @returns {Promise<Object>} Logout confirmation
   */
  async logout() {
    const token = localStorage.getItem('token');
    if (!token) return { success: true };

    return this.request('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // =========================================
  // User Profile Endpoints
  // =========================================

  /**
   * Get current user profile
   * GET /api/user/profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    return this.request('/user/profile');
  }

  /**
   * Update user profile
   * PUT /api/user/profile
   * @param {Object} userData - Profile data to update
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // =========================================
  // Utility Methods
  // =========================================

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token');
  }
}

// Export singleton instance
export const api = new ApiService();

// Export class for testing
export default ApiService;
