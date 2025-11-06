// frontend/src/api.js
// Axios wrapper for your frontend. Uses relative '/api' base so Vite proxy can forward to Django in dev.

import axios from 'axios';

// Use Vite's env vars to set the base URL. In dev, this will be undefined, so we fall back to '/api' for the proxy.
// In production, you'll set VITE_API_BASE_URL on your hosting provider.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
});

// --- token storage helpers (simple localStorage) ---
export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
}
export function getAccessToken() { return localStorage.getItem('access_token'); }
export function getRefreshToken() { return localStorage.getItem('refresh_token'); }
export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// --- attach access token to outgoing requests ---
api.interceptors.request.use(
  (config) => {
    const t = getAccessToken();
    if (t) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${t}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// --- refresh-on-401 logic (queues requests while refreshing) ---
let isRefreshing = false;
let refreshQueue = []; // array of { resolve, reject }

function processQueue(err, token = null) {
  refreshQueue.forEach(p => err ? p.reject(err) : p.resolve(token));
  refreshQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!error.response) return Promise.reject(error); // network error

    if (error.response.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      isRefreshing = true;
      const refresh = getRefreshToken();
      if (!refresh) {
        clearTokens();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Adjust path if your refresh endpoint differs
        const r = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });
        const newAccess = r.data.access;
        setTokens({ access: newAccess }); // keep existing refresh unless changed
        processQueue(null, newAccess);
        isRefreshing = false;

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearTokens();
        isRefreshing = false;
        return Promise.reject(refreshErr);
      }
    }

    // Non-401 or already retried: convert server info to an Error with response attached
    const server = error.response && error.response.data ? error.response.data : error.response.statusText;
    const e = new Error(`Request failed: ${JSON.stringify(server)}`);
    e.response = error.response;
    return Promise.reject(e);
  }
);

// --- convenience endpoint helpers ---
export async function createFeedback(payload) {
  // payload should match your serializer (e.g. { name, email, message })
  const r = await api.post('/feedback/', payload);
  return r.data;
}

// export default axios instance if you need it elsewhere
export default api;