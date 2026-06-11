import { getAccessToken } from '../services/api';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Download a file from the API as a blob and trigger a browser download.
 * @param {string} endpoint - API endpoint path (e.g., '/documents/123')
 * @param {string} filename - The filename for the downloaded file
 * @returns {Promise<void>}
 */
export const downloadFile = async (endpoint, filename) => {
  const accessToken = getAccessToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Download failed');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
