import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// Initialize the context
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Encloses the application and exposes authentication states and dispatchers
 * (user data, active token, loading overlays, login/register triggers, and logout).
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Try to restore user session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('crm-token');
      if (storedToken) {
        try {
          setToken(storedToken);
          const profileData = await authService.getProfile();
          if (profileData.success && profileData.user) {
            setUser(profileData.user);
          } else {
            // Failed validation, clean credentials
            localStorage.removeItem('crm-token');
            setToken(null);
          }
        } catch (error) {
          console.error('[AuthContext] Session restore failure:', error);
          localStorage.removeItem('crm-token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  /**
   * Log in credentials, save token, and update user state.
   * 
   * @param {string} email - User email address.
   * @param {string} password - User password.
   * @returns {Promise<{ success: boolean, message?: string }>} Response indicators.
   */
  const login = async (email, password) => {
    try {
      const loginData = await authService.login(email, password);
      if (loginData.success && loginData.token) {
        localStorage.setItem('crm-token', loginData.token);
        setToken(loginData.token);
        setUser(loginData.user);
        return { success: true };
      }
      return { success: false, message: loginData.message || 'Login failed' };
    } catch (error) {
      console.error('[AuthContext] Login Error:', error);
      const msg = error.response?.data?.message || 'Invalid email or password';
      return { success: false, message: msg };
    }
  };

  /**
   * Register a new user, save token, and update user state.
   * 
   * @param {string} name - User's full name.
   * @param {string} email - User email address.
   * @param {string} password - User password.
   * @returns {Promise<{ success: boolean, message?: string }>} Response indicators.
   */
  const register = async (name, email, password) => {
    try {
      const regData = await authService.register(name, email, password);
      if (regData.success && regData.token) {
        localStorage.setItem('crm-token', regData.token);
        setToken(regData.token);
        setUser(regData.user);
        return { success: true };
      }
      return { success: false, message: regData.message || 'Registration failed' };
    } catch (error) {
      console.error('[AuthContext] Registration Error:', error);
      const msg = error.response?.data?.message || 'Email already exists or invalid data';
      return { success: false, message: msg };
    }
  };

  /**
   * Terminate active user session and redirect to /login.
   */
  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom React Hook to consume the AuthContext properties.
 * 
 * @returns {object} AuthContext values.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
