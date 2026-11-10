import { apiClient } from '../api/client';

export const fareService = {
  /**
   * List versioned fare configs with server-side pagination and filters
   */
  async listFareConfigs({ vehicleType, zone, page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (vehicleType && vehicleType !== 'ALL') params.set('vehicleType', vehicleType);
    if (zone && zone !== 'ALL') params.set('zone', zone);

    const query = params.toString();
    const endpoint = `/fares/configs${query ? `?${query}` : ''}`;
    const res = await apiClient(endpoint);

    return {
      configs: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  /**
   * Get single fare config by ID
   */
  async getFareConfig(configId) {
    const res = await apiClient(`/fares/configs/${configId}`);
    return {
      config: res.data,
      requestId: res.requestId,
    };
  },

  /**
   * Create a new version of a fare config (pinned, effective-dated, with written reason)
   */
  async createFareConfig(payload) {
    const res = await apiClient('/fares/configs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return {
      config: res.data,
      requestId: res.requestId,
    };
  },

  /**
   * Calculate public fare quote based on coordinates and vehicle
   */
  async getFareQuote({ vehicleType, zone = 'mumbai', pickupLng, pickupLat, dropLng, dropLat }) {
    const params = new URLSearchParams({
      vehicleType,
      zone,
      pickupLng: String(pickupLng),
      pickupLat: String(pickupLat),
      dropLng: String(dropLng),
      dropLat: String(dropLat),
    });
    const res = await apiClient(`/fares/quote?${params.toString()}`);
    return {
      quote: res.data,
      requestId: res.requestId,
    };
  },

  /**
   * Fetch dispatch & relative-distance tunables
   */
  async getDispatchSettings() {
    const res = await apiClient('/settings/dispatch');
    return {
      settings: res.data,
      requestId: res.requestId,
    };
  },

  /**
   * Update dispatch & relative-distance tunables (requires written reason for audit)
   */
  async updateDispatchSettings(payload) {
    const res = await apiClient('/settings/dispatch', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return {
      settings: res.data,
      requestId: res.requestId,
    };
  },

  /**
   * List versioned revenue & commission plans
   */
  async listRevenuePlans() {
    const res = await apiClient('/revenue-plans');
    return {
      plans: res.data || [],
      requestId: res.requestId,
    };
  },

  /**
   * Create or update revenue plan version (requires written reason for audit)
   */
  async createRevenuePlan(payload) {
    const res = await apiClient('/revenue-plans', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return {
      plan: res.data,
      requestId: res.requestId,
    };
  },
};
