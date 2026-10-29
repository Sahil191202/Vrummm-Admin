import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { handleMockRequest } from './mockAdapter';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export class ApiError extends Error {
  constructor(message, { code = 'UNKNOWN_ERROR', status = 500, details = null, requestId = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.requestId = requestId;
  }
}

function generateRequestId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'req_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export async function apiClient(endpoint, options = {}) {
  const isMock = useUIStore.getState().isMockApi;

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (isMock) {
    const res = await handleMockRequest(url, options);
    if (!res.body.success) {
      throw new ApiError(res.body.error?.message || 'Mock request failed', {
        code: res.body.error?.code || 'ERROR',
        status: res.status,
        details: res.body.error?.details,
        requestId: res.body.requestId,
      });
    }
    return res.body;
  }

  const requestId = generateRequestId();
  const headers = {
    'Content-Type': 'application/json',
    'x-request-id': requestId,
    ...(options.headers || {}),
  };

  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const config = {
    ...options,
    headers,
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (netErr) {
    throw new ApiError('Unable to connect to Vrumm backend API server. Check if backend is running on port 4000.', {
      code: 'NETWORK_ERROR',
      status: 0,
      details: netErr.message,
      requestId,
    });
  }

  // Handle 401 Unauthorized with token refresh
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      useAuthStore.getState().clearSession();
      throw new ApiError('Session expired. Please log in again.', {
        code: 'UNAUTHENTICATED',
        status: 401,
        requestId,
      });
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          config.headers.Authorization = `Bearer ${newToken}`;
          return fetch(url, config).then(handleEnvelope);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-request-id': generateRequestId(),
        },
        body: JSON.stringify({ refreshToken }),
      });

      const refreshBody = await refreshRes.json();

      if (!refreshRes.ok || !refreshBody.success) {
        throw new Error('Refresh token rejected');
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshBody.data;
      useAuthStore.getState().setSession({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      processQueue(null, newAccessToken);

      // Replay original request
      config.headers.Authorization = `Bearer ${newAccessToken}`;
      return await fetch(url, config).then(handleEnvelope);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      useAuthStore.getState().clearSession();
      throw new ApiError('Session revoked or expired. Please sign in again.', {
        code: 'UNAUTHENTICATED',
        status: 401,
        requestId,
      });
    } finally {
      isRefreshing = false;
    }
  }

  return handleEnvelope(response);
}

async function handleEnvelope(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok || !body?.success) {
    const errorObj = body?.error || {};
    const message = errorObj.message || `Request failed with status ${response.status}`;
    const code = errorObj.code || (response.status === 403 ? 'FORBIDDEN' : 'SERVER_ERROR');

    throw new ApiError(message, {
      code,
      status: response.status,
      details: errorObj.details || null,
      requestId: body?.requestId || response.headers.get('x-request-id') || null,
    });
  }

  return body;
}
