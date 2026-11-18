import { apiClient } from '../api/client';

export const paymentService = {
  async listPayments({ page = 1, limit = 20, status, rideId, customerUserId, captainUserId } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (status && status !== 'ALL') params.set('status', status);
    if (rideId) params.set('rideId', rideId);
    if (customerUserId) params.set('customerUserId', customerUserId);
    if (captainUserId) params.set('captainUserId', captainUserId);

    const query = params.toString();
    const res = await apiClient(`/payments${query ? `?${query}` : ''}`);
    return {
      payments: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  async getPaymentForRide(rideId) {
    const res = await apiClient(`/payments/ride/${rideId}`);
    return {
      payment: res.data,
      requestId: res.requestId,
    };
  },

  async simulateRefund(paymentId, { reason }) {
    const res = await apiClient(`/payments/${paymentId}/refund/simulate`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return {
      refund: res.data,
      requestId: res.requestId,
    };
  },
};
