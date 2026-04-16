const API_URL = '/api';

export const api = {
  getHeaders: (endpoint = '') => {
    const isAuthRoute = endpoint.includes('/auth/login') || endpoint.includes('/auth/signup') || endpoint.includes('/auth/admin-login') || endpoint.includes('/auth/admin-signup');
    const token = (!isAuthRoute) ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },

  handleResponse: async (response) => {
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (response.status === 401) {
      const hadToken = !!localStorage.getItem('token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const isAuthPath = window.location.pathname.includes('/auth');
      
      // If trying to login (on auth path), return the direct backend error message (e.g. Invalid credentials)
      if (isAuthPath) {
        throw new Error(data?.message || 'Invalid credentials');
      }

      // If user was using application and token became invalid
      if (!isAuthPath && hadToken) {
        try {
          const { navigate } = await import('../router.js');
          const { refreshNav } = await import('../components/nav.js');
          refreshNav();
          navigate('/auth');
        } catch {
          window.location.href = '/auth';
        }
        throw new Error('Session expired. Please log in again.');
      } 
      
      // Otherwise, generic unauthorized
      throw new Error(data?.message || 'Unauthorized access');
    }

    if (!response.ok) {
      throw new Error(data?.message || response.statusText);
    }
    return data;
  },

  // FIX BUG #1: Wrap all fetch calls in try/catch to handle network errors gracefully
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: api.getHeaders(endpoint),
      });
      return api.handleResponse(response);
    } catch (err) {
      if (err.message === 'Session expired. Please log in again.') throw err;
      throw new Error(err.message === 'Failed to fetch' ? 'Network error — please check your connection and ensure the server is running.' : err.message);
    }
  },

  post: async (endpoint, body) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: api.getHeaders(endpoint),
        body: JSON.stringify(body),
      });
      return api.handleResponse(response);
    } catch (err) {
      if (err.message === 'Session expired. Please log in again.') throw err;
      throw new Error(err.message === 'Failed to fetch' ? 'Network error — please check your connection and ensure the server is running.' : err.message);
    }
  },

  put: async (endpoint, body) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: api.getHeaders(endpoint),
        body: JSON.stringify(body),
      });
      return api.handleResponse(response);
    } catch (err) {
      if (err.message === 'Session expired. Please log in again.') throw err;
      throw new Error(err.message === 'Failed to fetch' ? 'Network error — please check your connection and ensure the server is running.' : err.message);
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: api.getHeaders(endpoint),
      });
      return api.handleResponse(response);
    } catch (err) {
      if (err.message === 'Session expired. Please log in again.') throw err;
      throw new Error(err.message === 'Failed to fetch' ? 'Network error — please check your connection and ensure the server is running.' : err.message);
    }
  },
};
