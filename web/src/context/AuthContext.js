import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

/**
 * AuthContext - Manages authentication state across the application
 * Provides user information and authentication methods to all components
 */

const DEMO_USER = {
  id: 1,
  username: 'demo_user',
  email: 'demo@example.com',
  fullName: 'Demo User',
  role: 'USER'
};

const AuthContext = createContext(null);

/**
 * Custom hook to access auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider - Wraps application to provide auth state
 * @param {React.ReactNode} children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
        } catch (e) {
          // Invalid stored user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user with credentials
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @returns {Promise<Object>} User data
   */
  const login = useCallback(async (username, password) => {
    setError(null);

    try {
      // Try to import api dynamically to avoid issues during testing
      const { api } = await import('../services/api');
      const response = await api.login(username, password);

      // Handle different response formats from backend
      // Backend returns: { token, username, email }
      const authToken = response.token;
      const respUsername = response.username;
      const respEmail = response.email;

      // Build user payload from response - handle both nested and flat formats
      const userPayload = response.user || { username: respUsername, email: respEmail };

      // Store auth data
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userPayload));

      setToken(authToken);
      setUser(userPayload);

      return userPayload;
    } catch (err) {
      // Check if this is a demo token scenario
      const storedToken = localStorage.getItem('token');
      if (storedToken && storedToken.startsWith('demo_')) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const demoUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(demoUser);
            return demoUser;
          } catch (e) {
            // Continue to throw error
          }
        }
      }

      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @returns {Promise<Object>} User data
   */
  const register = useCallback(async (userData) => {
    setError(null);

    try {
      const { api } = await import('../services/api');
      const response = await api.register(userData);

      // Backend register returns { message: "..." } without a token
      // So we auto-login after successful registration
      if (!response.token) {
        // Auto-login with the same credentials
        const loginResponse = await api.login(userData.username, userData.password);
        const authToken = loginResponse.token;
        const userPayload = loginResponse.user || { username: loginResponse.username, email: loginResponse.email };

        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userPayload));

        setToken(authToken);
        setUser(userPayload);

        return userPayload;
      }

      // If backend does return a token directly
      const { token: authToken, user: userDataObj, ...rest } = response;
      const userPayload = userDataObj || rest;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userPayload));

      setToken(authToken);
      setUser(userPayload);

      return userPayload;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Logout user and clear auth state
   */
  const logout = useCallback(async () => {
    try {
      // Attempt server-side logout (optional)
      const { api } = await import('../services/api');
      await api.logout();
    } catch (err) {
      // Ignore logout errors - clear local state anyway
      console.warn('Logout API call failed:', err.message);
    } finally {
      // Always clear local state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setError(null);
    }
  }, []);

  /**
   * Update user data in state and localStorage
   * @param {Object} userData - Updated user data
   */
  const updateUser = useCallback((userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, [user]);

  /**
   * Clear any auth errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Context value
  const value = {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,

    // Methods
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Named exports for compatibility
export { AuthContext };
export default AuthContext;
