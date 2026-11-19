import { apiClient } from '../api/client';

export const settingsService = {
  async getSettings() {
    const res = await apiClient('/settings');
    return {
      settings: res.data || {},
      requestId: res.requestId,
    };
  },

  async updateSettings(data) {
    const res = await apiClient('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return {
      settings: res.data || {},
      requestId: res.requestId,
    };
  },
};
