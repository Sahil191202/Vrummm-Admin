import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fareService } from './fareService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('Fare Service (fareService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds listFareConfigs query with vehicleType and zone filters', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'fare_01', vehicleType: 'BIKE', version: 2, isActive: true }],
      meta: { total: 1, page: 1, pages: 1, limit: 20 },
      requestId: 'req_fare_1',
    });

    const res = await fareService.listFareConfigs({ vehicleType: 'BIKE', zone: 'mumbai' });

    expect(apiClient).toHaveBeenCalledWith('/fares/configs?page=1&limit=20&vehicleType=BIKE&zone=mumbai');
    expect(res.configs).toHaveLength(1);
    expect(res.configs[0].version).toBe(2);
  });

  it('creates new version of fare configuration with written reason for audit', async () => {
    const payload = {
      vehicleType: 'BIKE',
      zone: 'mumbai',
      baseFarePaise: 2500,
      perKmPaise: 1200,
      perMinutePaise: 150,
      minimumFarePaise: 3000,
      minimumBillableDistanceMetres: 1500,
      reason: 'Aligning with index inflation',
    };

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'fare_new', version: 3, ...payload },
      requestId: 'req_fare_create',
    });

    const res = await fareService.createFareConfig(payload);

    expect(apiClient).toHaveBeenCalledWith('/fares/configs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    expect(res.config.version).toBe(3);
  });

  it('fetches and updates dispatch & relative-distance tunables', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { offerDurationSeconds: 10, maxRounds: 3 },
      requestId: 'req_disp_get',
    });

    const getRes = await fareService.getDispatchSettings();
    expect(apiClient).toHaveBeenCalledWith('/settings/dispatch');
    expect(getRes.settings.offerDurationSeconds).toBe(10);

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { offerDurationSeconds: 15, maxRounds: 4 },
      requestId: 'req_disp_patch',
    });

    const updateRes = await fareService.updateDispatchSettings({
      offerDurationSeconds: 15,
      reason: 'Extend driver acceptance window during peak rain',
    });

    expect(apiClient).toHaveBeenCalledWith('/settings/dispatch', {
      method: 'PATCH',
      body: JSON.stringify({
        offerDurationSeconds: 15,
        reason: 'Extend driver acceptance window during peak rain',
      }),
    });
    expect(updateRes.settings.offerDurationSeconds).toBe(15);
  });

  it('manages revenue and commission plans with basis points', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'rev_1', name: '15% Standard Take-Rate', commissionBasisPoints: 1500 }],
      requestId: 'req_rev_list',
    });

    const listRes = await fareService.listRevenuePlans();
    expect(apiClient).toHaveBeenCalledWith('/revenue-plans');
    expect(listRes.plans[0].commissionBasisPoints).toBe(1500);

    const newPlan = {
      name: 'Daily Driver Pass',
      type: 'SUBSCRIPTION',
      fixedFeePaise: 4900,
      commissionBasisPoints: 0,
      reason: 'New zero-commission auto driver incentive',
    };

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'rev_2', ...newPlan },
      requestId: 'req_rev_create',
    });

    const createRes = await fareService.createRevenuePlan(newPlan);
    expect(apiClient).toHaveBeenCalledWith('/revenue-plans', {
      method: 'POST',
      body: JSON.stringify(newPlan),
    });
    expect(createRes.plan.fixedFeePaise).toBe(4900);
  });
});
