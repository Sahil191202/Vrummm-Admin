import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { DEFAULT_ROLE_PERMISSIONS } from '../contracts/rbac';

export const authService = {
  async login({ email, password }) {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const { accessToken, refreshToken, user } = response.data;
    const permissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];

    useAuthStore.getState().setSession({
      accessToken,
      refreshToken,
      user,
      permissions,
    });

    return { user, accessToken };
  },

  async logout() {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Even if server call fails, always clear local credentials
    } finally {
      useAuthStore.getState().clearSession();
    }
  },

  async getMe() {
    const response = await apiClient('/auth/me');
    const user = response.data;
    const permissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
    useAuthStore.getState().setSession({
      user,
      permissions,
    });
    return user;
  },
};
