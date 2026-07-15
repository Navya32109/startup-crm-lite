import api from './api';

/**
 * Register a new user account.
 * POST /api/auth/register
 * 
 * @param {string} name - The user's full name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} Returns the unwrapped data payload { success, token, user }.
 */
export const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', { name, email, password });
  return response.data;
};

/**
 * Authenticate existing credentials.
 * POST /api/auth/login
 * 
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} Returns the unwrapped data payload { success, token, user }.
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

/**
 * Logout of current session (Client is stateless, so we wipe credentials locally).
 */
export const logout = () => {
  localStorage.removeItem('crm-token');
};

/**
 * Get profile details of currently logged in user.
 * GET /api/auth/profile
 * 
 * @returns {Promise<object>} Returns the unwrapped data payload { success, user }.
 */
export const getProfile = async () => {
  const response = await api.get('/api/auth/profile');
  return response.data;
};

/**
 * Update current user profile details (e.g. name or change password).
 * PUT /api/auth/profile
 * 
 * @param {object} data - Object containing name, oldPassword, password.
 * @returns {Promise<object>} Returns the unwrapped data payload { success, user }.
 */
export const updateProfile = async (data) => {
  const response = await api.put('/api/auth/profile', data);
  return response.data;
};

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile
};
