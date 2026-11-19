import { describe, it, expect, vi, beforeEach } from 'vitest';
import { settingsService } from './settingsService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('Settings Service (settingsService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches system settings', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { commercialLaunchDisabled: true, demoMode: true, clusterZone: 'mumbai' },
      requestId: 'req_set_get',
    });

    const res = await settingsService.getSettings();
    expect(apiClient).toHaveBeenCalledWith('/settings');
    expect(res.settings.commercialLaunchDisabled).toBe(true);
  });

  it('updates system settings with justification reason', async () => {
    const payload = {
      commercialLaunchDisabled: false,
      reason: 'Alpha trial stage approved for pilot rides in Bandra BKC corridor',
    };

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { ...payload },
      requestId: 'req_set_patch',
    });

    const res = await settingsService.updateSettings(payload);
    expect(apiClient).toHaveBeenCalledWith('/settings', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    expect(res.settings.commercialLaunchDisabled).toBe(false);
  });
});
