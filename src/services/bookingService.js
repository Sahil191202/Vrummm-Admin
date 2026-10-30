import { apiClient } from '../api/client';

export const bookingService = {
  async listBookings({ page = 1, limit = 20, status, search, vehicleType } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (status && status !== 'ALL') params.set('status', status);
    if (search) params.set('search', search);
    if (vehicleType && vehicleType !== 'ALL') params.set('vehicleType', vehicleType);

    const query = params.toString();
    const endpoint = `/bookings${query ? `?${query}` : ''}`;
    const res = await apiClient(endpoint);

    return {
      bookings: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  async getBooking(bookingId) {
    const res = await apiClient(`/bookings/${bookingId}`);
    return {
      booking: res.data,
      requestId: res.requestId,
    };
  },

  async cancelBooking(bookingId, { reason }) {
    const res = await apiClient(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return {
      booking: res.data,
      requestId: res.requestId,
    };
  },

  async resolveBooking(bookingId, { reason, action = 'FORCE_RESOLVE' }) {
    const res = await apiClient(`/bookings/${bookingId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ reason, action }),
    });
    return {
      booking: res.data,
      requestId: res.requestId,
    };
  },

  async getDispatchRounds(bookingId) {
    const res = await apiClient(`/dispatch/rounds/${bookingId}`);
    return {
      rounds: res.data || [],
      requestId: res.requestId,
    };
  },
};
