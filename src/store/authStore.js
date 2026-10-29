import { create } from 'zustand';
import { DEFAULT_ROLE_PERMISSIONS, checkPermission } from '../contracts/rbac';

const SAVED_ACCESS_TOKEN = localStorage.getItem('vrumm_access_token');
const SAVED_REFRESH_TOKEN = localStorage.getItem('vrumm_refresh_token');
const SAVED_USER_STR = localStorage.getItem('vrumm_user');

let initialUser = null;
let initialPermissions = [];

if (SAVED_USER_STR) {
  try {
    initialUser = JSON.parse(SAVED_USER_STR);
    if (initialUser?.role) {
      initialPermissions = DEFAULT_ROLE_PERMISSIONS[initialUser.role] || [];
    }
  } catch {
    // Ignore corrupt localstorage
  }
}

export const useAuthStore = create((set, get) => ({
  accessToken: SAVED_ACCESS_TOKEN || null,
  refreshToken: SAVED_REFRESH_TOKEN || null,
  user: initialUser,
  permissions: initialPermissions,
  isAuthenticated: Boolean(SAVED_ACCESS_TOKEN && initialUser),

  setSession: ({ accessToken, refreshToken, user, permissions }) => {
    const role = user?.role;
    const finalPermissions = permissions || (role ? DEFAULT_ROLE_PERMISSIONS[role] || [] : []);

    if (accessToken) localStorage.setItem('vrumm_access_token', accessToken);
    if (refreshToken) localStorage.setItem('vrumm_refresh_token', refreshToken);
    if (user) localStorage.setItem('vrumm_user', JSON.stringify(user));

    set({
      accessToken: accessToken || get().accessToken,
      refreshToken: refreshToken || get().refreshToken,
      user: user || get().user,
      permissions: finalPermissions,
      isAuthenticated: Boolean(accessToken || get().accessToken),
    });
  },

  clearSession: () => {
    localStorage.removeItem('vrumm_access_token');
    localStorage.removeItem('vrumm_refresh_token');
    localStorage.removeItem('vrumm_user');

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      permissions: [],
      isAuthenticated: false,
    });
  },

  hasPermission: (permission) => {
    return checkPermission(get().permissions, permission);
  },

  hasAnyPermission: (permList = []) => {
    return permList.some((p) => checkPermission(get().permissions, p));
  },
}));
