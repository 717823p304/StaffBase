import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAccessToken, getRefreshToken, setTokens, clearTokens, api } from './api';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('Token storage helpers', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('getAccessToken returns null when no token stored', () => {
    expect(getAccessToken()).toBeNull();
  });

  it('setTokens stores both access and refresh tokens', () => {
    setTokens('access123', 'refresh456');

    expect(localStorageMock.setItem).toHaveBeenCalledWith('staffbase_access_token', 'access123');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('staffbase_refresh_token', 'refresh456');
  });

  it('setTokens stores only access token when refresh is falsy', () => {
    setTokens('access123', null);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('staffbase_access_token', 'access123');
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
  });

  it('clearTokens removes both tokens', () => {
    clearTokens();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('staffbase_access_token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('staffbase_refresh_token');
  });

  it('getRefreshToken returns stored refresh token', () => {
    localStorageMock.setItem('staffbase_refresh_token', 'myRefresh');
    expect(getRefreshToken()).toBe('myRefresh');
  });
});

describe('api methods', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('api.get sends GET request with auth header', async () => {
    localStorageMock.setItem('staffbase_access_token', 'test-token');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: [] }),
    });

    const result = await api.get('/employees');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('http://localhost:5000/api/employees');
    expect(options.method).toBe('GET');
    expect(options.headers['Authorization']).toBe('Bearer test-token');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(result).toEqual({ success: true, data: [] });
  });

  it('api.post sends POST request with JSON body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, message: 'Created' }),
    });

    const body = { name: 'Alice', email: 'alice@test.com' };
    const result = await api.post('/employees', body);

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('http://localhost:5000/api/employees');
    expect(options.method).toBe('POST');
    expect(options.body).toBe(JSON.stringify(body));
    expect(result.success).toBe(true);
  });

  it('api.put sends PUT request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await api.put('/employees/EMP-101', { name: 'Updated' });

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('http://localhost:5000/api/employees/EMP-101');
    expect(options.method).toBe('PUT');
  });

  it('api.delete sends DELETE request', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await api.delete('/employees/EMP-101');

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('http://localhost:5000/api/employees/EMP-101');
    expect(options.method).toBe('DELETE');
  });

  it('api.get throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Internal Server Error' }),
      clone: function () { return this; },
    });

    await expect(api.get('/fail')).rejects.toThrow('Internal Server Error');
  });

  it('api.get without stored token does not send Authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    await api.get('/public');

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Authorization']).toBeUndefined();
  });

  it('api.post with FormData does not set Content-Type', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    const formData = new FormData();
    formData.append('file', 'test');
    await api.post('/documents/upload', formData);

    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Content-Type']).toBeUndefined();
    expect(options.body).toBe(formData);
  });

  it('api.get attempts token refresh on 401 with "Token expired"', async () => {
    localStorageMock.setItem('staffbase_access_token', 'expired-token');
    localStorageMock.setItem('staffbase_refresh_token', 'my-refresh');

    // First call returns 401 with Token expired
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Token expired' }),
      clone: function () { return this; },
    });

    // Refresh call succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: { accessToken: 'new-access' } }),
    });

    // Retry with new token succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: 'retried' }),
    });

    const result = await api.get('/protected');

    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(result).toEqual({ success: true, data: 'retried' });
  });
});
