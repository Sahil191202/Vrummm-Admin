import { describe, it, expect, vi, beforeEach } from 'vitest';
import { promotionService } from './promotionService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('Promotion Service (promotionService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists promotions with query parameters', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'promo_1', code: 'VRUMM50', discountValue: 50, isActive: true }],
      meta: { total: 1, page: 1, pages: 1, limit: 20 },
      requestId: 'req_promo_list',
    });

    const res = await promotionService.listPromotions({ isActive: true, search: 'VRUMM' });

    expect(apiClient).toHaveBeenCalledWith('/promotions?page=1&limit=20&isActive=true&search=VRUMM');
    expect(res.promotions).toHaveLength(1);
    expect(res.promotions[0].code).toBe('VRUMM50');
  });

  it('fetches a single promotion by ID', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'promo_1', code: 'VRUMM50' },
      requestId: 'req_promo_get',
    });

    const res = await promotionService.getPromotion('promo_1');
    expect(apiClient).toHaveBeenCalledWith('/promotions/promo_1');
    expect(res.promotion.code).toBe('VRUMM50');
  });

  it('creates a new promotion code with mandatory justification reason', async () => {
    const payload = {
      code: 'DIWALI25',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      maxDiscountPaise: 4000,
      minRideFarePaise: 8000,
      firstRideOnly: false,
      allowedVehicleTypes: ['AUTO', 'CAB'],
      expiresAt: '2026-11-15T23:59:59.000Z',
      reason: 'Diwali festive holiday commuter acquisition campaign',
    };

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'promo_new', ...payload },
      requestId: 'req_promo_create',
    });

    const res = await promotionService.createPromotion(payload);
    expect(apiClient).toHaveBeenCalledWith('/promotions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    expect(res.promotion.code).toBe('DIWALI25');
  });

  it('validates a promo code against ride fare and vehicle type', async () => {
    const payload = {
      code: 'VRUMM50',
      rideFarePaise: 15000,
      vehicleType: 'AUTO',
    };

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { valid: true, discountAmountPaise: 5000, finalFarePaise: 10000 },
      requestId: 'req_promo_val',
    });

    const res = await promotionService.validatePromotion(payload);
    expect(apiClient).toHaveBeenCalledWith('/promotions/validate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    expect(res.validation.valid).toBe(true);
    expect(res.validation.discountAmountPaise).toBe(5000);
  });
});
