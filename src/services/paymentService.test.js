import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentService } from './paymentService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('Payment Service (paymentService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists payments with status and entity filters', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'pay_01', amountPaise: 9500, status: 'CAPTURED', provider: 'RAZORPAY' }],
      meta: { total: 1, page: 1, pages: 1, limit: 20 },
      requestId: 'req_pay_list',
    });

    const res = await paymentService.listPayments({ status: 'CAPTURED', rideId: 'ride_123' });
    expect(apiClient).toHaveBeenCalledWith('/payments?page=1&limit=20&status=CAPTURED&rideId=ride_123');
    expect(res.payments).toHaveLength(1);
    expect(res.payments[0].amountPaise).toBe(9500);
  });

  it('fetches payment for a specific ride', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'pay_01', rideId: 'ride_123', status: 'CAPTURED' },
      requestId: 'req_pay_ride',
    });

    const res = await paymentService.getPaymentForRide('ride_123');
    expect(apiClient).toHaveBeenCalledWith('/payments/ride/ride_123');
    expect(res.payment.rideId).toBe('ride_123');
  });

  it('triggers simulated refund with required audit justification', async () => {
    const payload = { reason: 'Customer vehicle breakdown compensation test' };

    apiClient.mockResolvedValueOnce({
      success: true,
      data: {
        payment: { _id: 'pay_01', status: 'REFUNDED_SIMULATED' },
        refundId: 'sim_rfnd_1',
        status: 'REFUNDED_SIMULATED',
      },
      requestId: 'req_refund',
    });

    const res = await paymentService.simulateRefund('pay_01', payload);
    expect(apiClient).toHaveBeenCalledWith('/payments/pay_01/refund/simulate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    expect(res.refund.status).toBe('REFUNDED_SIMULATED');
  });
});
