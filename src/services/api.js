const API_BASE_URL = 'http://localhost:5000/api';

// Token storage helpers
export const getAccessToken = () => localStorage.getItem('staffbase_access_token');
export const getRefreshToken = () => localStorage.getItem('staffbase_refresh_token');

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('staffbase_access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('staffbase_refresh_token', refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem('staffbase_access_token');
  localStorage.removeItem('staffbase_refresh_token');
};

// Refresh token interceptor logic using native fetch
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    const data = await res.json();
    if (data.success && data.data.accessToken) {
      setTokens(data.data.accessToken);
      return data.data.accessToken;
    } else {
      clearTokens();
      throw new Error('Refresh token invalid');
    }
  } catch (error) {
    clearTokens();
    throw error;
  }
};

// Wrapper around native fetch
const apiFetch = async (endpoint, options = {}) => {
  const headers = { ...options.headers };

  // Set Content-Type unless we're sending FormData (which browser sets automatically)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Inject Access Token
  const accessToken = getAccessToken();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config = {
    ...options,
    headers
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // If unauthorized due to token expiry, attempt silent refresh once
  if (response.status === 401) {
    const errorData = await response.clone().json().catch(() => ({}));
    if (errorData.message === 'Token expired') {
      try {
        const newAccessToken = await refreshAccessToken();
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      } catch (refreshErr) {
        // Redirect to session expired route if refresh fails
        window.location.hash = '/session-expired';
        throw refreshErr;
      }
    }
  }

  let result = {};
  try {
    result = await response.json();
  } catch (err) {
    console.warn(`Failed to parse JSON response from ${endpoint} (status ${response.status}):`, err.message);
  }

  if (!response.ok) {
    throw new Error(result.message || `API request failed with status ${response.status}`);
  }

  return result;
};

// REST methods export
export const api = {
  get: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => apiFetch(endpoint, { ...options, method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => apiFetch(endpoint, { ...options, method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (endpoint, options = {}) => apiFetch(endpoint, { ...options, method: 'DELETE' })
};
