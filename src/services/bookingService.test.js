import { describe, it, expect, vi, beforeEach } from 'vitest';
import { bookingService } from './bookingService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('bookingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('queries /bookings with pagination and filter params', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'b1', vehicleType: 'BIKE', status: 'SEARCHING' }],
      meta: { total: 45, page: 2, pages: 3, limit: 20 },
      requestId: 'req-123',
    });

    const result = await bookingService.listBookings({
      page: 2,
      limit: 20,
      status: 'SEARCHING',
      vehicleType: 'BIKE',
    });

    expect(apiClient).toHaveBeenCalledWith('/bookings?page=2&limit=20&status=SEARCHING&vehicleType=BIKE');
    expect(result.total).toBe(45);
    expect(result.page).toBe(2);
    expect(result.bookings).toHaveLength(1);
    expect(result.requestId).toBe('req-123');
  });

  it('fetches single booking by id from /bookings/:bookingId', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'b99', status: 'COMPLETED' },
      requestId: 'req-456',
    });

    const result = await bookingService.getBooking('b99');
    expect(apiClient).toHaveBeenCalledWith('/bookings/b99');
    expect(result.booking._id).toBe('b99');
  });

  it('sends mandatory reason when cancelling a booking via /bookings/:id/cancel', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'b99', status: 'CANCELLED' },
      requestId: 'req-789',
    });

    const result = await bookingService.cancelBooking('b99', { reason: 'Customer stranded in rain' });
    expect(apiClient).toHaveBeenCalledWith('/bookings/b99/cancel', {
      method: 'POST',
      body: JSON.stringify({ reason: 'Customer stranded in rain' }),
    });
    expect(result.booking.status).toBe('CANCELLED');
  });
});
