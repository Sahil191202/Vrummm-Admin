import { apiClient } from '../api/client';

export const promotionService = {
  async listPromotions({ page = 1, limit = 20, isActive, search } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (isActive !== undefined && isActive !== 'ALL') params.set('isActive', String(isActive));
    if (search) params.set('search', search);

    const query = params.toString();
    const res = await apiClient(`/promotions${query ? `?${query}` : ''}`);
    return {
      promotions: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  async getPromotion(promotionId) {
    const res = await apiClient(`/promotions/${promotionId}`);
    return {
      promotion: res.data,
      requestId: res.requestId,
    };
  },

  async createPromotion(data) {
    const res = await apiClient('/promotions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      promotion: res.data,
      requestId: res.requestId,
    };
  },

  async validatePromotion(data) {
    const res = await apiClient('/promotions/validate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      validation: res.data,
      requestId: res.requestId,
    };
  },
};
