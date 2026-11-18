import { describe, it, expect, vi, beforeEach } from 'vitest';
import { incentiveService } from './incentiveService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('Incentive Service (incentiveService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists incentive campaigns with filters', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'inc_1', name: 'Peak Hour Boost', targetType: 'PEAK_HOUR', rewardAmountPaise: 25000 }],
      meta: { total: 1, page: 1, pages: 1, limit: 20 },
      requestId: 'req_inc_list',
    });

    const res = await incentiveService.listCampaigns({ targetType: 'PEAK_HOUR', isActive: true });
    expect(apiClient).toHaveBeenCalledWith('/incentives?page=1&limit=20&targetType=PEAK_HOUR&isActive=true');
    expect(res.campaigns).toHaveLength(1);
    expect(res.campaigns[0].targetType).toBe('PEAK_HOUR');
  });

  it('fetches a single campaign by ID', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'inc_1', name: 'Peak Hour Boost' },
      requestId: 'req_inc_get',
    });

    const res = await incentiveService.getCampaign('inc_1');
    expect(apiClient).toHaveBeenCalledWith('/incentives/inc_1');
    expect(res.campaign.name).toBe('Peak Hour Boost');
  });

  it('creates an incentive campaign with target counts and reward in paise', async () => {
    const payload = {
      name: 'Weekend Marathon 30',
      description: 'Complete 30 rides during Saturday and Sunday',
      targetType: 'WEEKLY_RIDES',
      targetCount: 30,
      rewardAmountPaise: 150000,
      expiresAt: '2026-11-30T23:59:59.000Z',
      reason: 'Driver incentive program for weekend supply guarantees',
    };

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'inc_new', ...payload },
      requestId: 'req_inc_create',
    });

    const res = await incentiveService.createCampaign(payload);
    expect(apiClient).toHaveBeenCalledWith('/incentives', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    expect(res.campaign.targetCount).toBe(30);
    expect(res.campaign.rewardAmountPaise).toBe(150000);
  });
});
