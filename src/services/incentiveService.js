import { apiClient } from '../api/client';

export const incentiveService = {
  async listCampaigns({ page = 1, limit = 20, targetType, isActive } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (targetType && targetType !== 'ALL') params.set('targetType', targetType);
    if (isActive !== undefined && isActive !== 'ALL') params.set('isActive', String(isActive));

    const query = params.toString();
    const res = await apiClient(`/incentives${query ? `?${query}` : ''}`);
    return {
      campaigns: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  async getCampaign(campaignId) {
    const res = await apiClient(`/incentives/${campaignId}`);
    return {
      campaign: res.data,
      requestId: res.requestId,
    };
  },

  async createCampaign(data) {
    const res = await apiClient('/incentives', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      campaign: res.data,
      requestId: res.requestId,
    };
  },
};
