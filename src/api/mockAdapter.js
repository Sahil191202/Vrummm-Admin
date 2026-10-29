/**
 * MOCK API ADAPTER (LEARNING & DEMO FALLBACK)
 * Status: Clearly labelled and OFF by default.
 * Only engaged when `useUIStore.getState().isMockApi` is explicitly toggled true.
 */

import { DEFAULT_ROLE_PERMISSIONS, ROLES } from '../contracts/rbac';

const MOCK_USERS = {
  'superadmin@vrumm.dev': {
    id: 'mock-usr-superadmin',
    email: 'superadmin@vrumm.dev',
    displayName: 'Super Admin',
    role: ROLES.SUPER_ADMIN,
    phone: '+919999900001',
  },
  'ops@vrumm.dev': {
    id: 'mock-usr-ops',
    email: 'ops@vrumm.dev',
    displayName: 'Ops Agent',
    role: ROLES.OPERATIONS,
    phone: '+919999900002',
  },
  'support@vrumm.dev': {
    id: 'mock-usr-support',
    email: 'support@vrumm.dev',
    displayName: 'Support Agent',
    role: ROLES.SUPPORT,
    phone: '+919999900003',
  },
  'finance@vrumm.dev': {
    id: 'mock-usr-finance',
    email: 'finance@vrumm.dev',
    displayName: 'Finance Agent',
    role: ROLES.FINANCE,
    phone: '+919999900004',
  },
  'marketing@vrumm.dev': {
    id: 'mock-usr-marketing',
    email: 'marketing@vrumm.dev',
    displayName: 'Marketing Agent',
    role: ROLES.MARKETING,
    phone: '+919999900005',
  },
  'compliance@vrumm.dev': {
    id: 'mock-usr-compliance',
    email: 'compliance@vrumm.dev',
    displayName: 'Compliance Agent',
    role: ROLES.COMPLIANCE,
    phone: '+919999900006',
  },
};

export async function handleMockRequest(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const requestId = 'mock-req-' + Math.random().toString(36).slice(2, 9);
  const body = options.body ? JSON.parse(options.body) : {};

  await new Promise((r) => setTimeout(r, 200)); // simulate network latency

  if (url.includes('/auth/login') && method === 'POST') {
    const user = MOCK_USERS[body.email?.toLowerCase().trim()];
    if (!user || body.password !== 'Vrumm@Dev2026!') {
      return {
        status: 401,
        body: {
          success: false,
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Invalid email or password (Mock Adapter)',
          },
          requestId,
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        data: {
          accessToken: 'mock-jwt-access-token-' + user.role,
          refreshToken: 'mock-jwt-refresh-token-' + user.role,
          user,
        },
        requestId,
      },
    };
  }

  if (url.includes('/auth/me')) {
    return {
      status: 200,
      body: {
        success: true,
        data: {
          id: 'mock-usr-superadmin',
          email: 'superadmin@vrumm.dev',
          displayName: 'Super Admin',
          role: ROLES.SUPER_ADMIN,
          isActive: true,
        },
        requestId,
      },
    };
  }

  if (url.includes('/auth/logout')) {
    return {
      status: 200,
      body: { success: true, data: { message: 'Logged out (Mock)' }, requestId },
    };
  }

  return {
    status: 404,
    body: {
      success: false,
      error: { code: 'NOT_FOUND', message: `Mock endpoint not found: ${method} ${url}` },
      requestId,
    },
  };
}
