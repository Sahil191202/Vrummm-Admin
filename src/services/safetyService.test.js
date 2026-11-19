import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safetyService } from './safetyService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('Safety Service (safetyService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists incidents with query parameters', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'inc_1', type: 'SOS_SIMULATED', severity: 'CRITICAL', status: 'REPORTED' }],
      meta: { total: 1, page: 1, pages: 1, limit: 20 },
      requestId: 'req_inc_list',
    });

    const res = await safetyService.listIncidents({ status: 'REPORTED', severity: 'CRITICAL' });
    expect(apiClient).toHaveBeenCalledWith('/safety/incidents?page=1&limit=20&status=REPORTED&severity=CRITICAL');
    expect(res.incidents).toHaveLength(1);
    expect(res.incidents[0].severity).toBe('CRITICAL');
  });

  it('resolves an incident with notes and audit justification', async () => {
    const payload = {
      status: 'RESOLVED',
      resolutionNotes: 'Customer contacted and confirmed safe at destination.',
      reason: 'Police and safety team investigation concluded.',
    };

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'inc_1', ...payload },
      requestId: 'req_inc_res',
    });

    const res = await safetyService.resolveIncident('inc_1', payload);
    expect(apiClient).toHaveBeenCalledWith('/safety/incidents/inc_1/resolve', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    expect(res.incident.status).toBe('RESOLVED');
  });

  it('lists support tickets and updates status', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'ticket_1', subject: 'Fare query', category: 'BILLING', status: 'OPEN' }],
      meta: { total: 1, page: 1, pages: 1, limit: 20 },
      requestId: 'req_tkt_list',
    });

    const res = await safetyService.listSupportTickets({ category: 'BILLING' });
    expect(apiClient).toHaveBeenCalledWith('/safety/support/tickets?page=1&limit=20&category=BILLING');
    expect(res.tickets[0].category).toBe('BILLING');

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'ticket_1', status: 'RESOLVED' },
      requestId: 'req_tkt_patch',
    });

    const patchRes = await safetyService.updateTicketStatus('ticket_1', { status: 'RESOLVED' });
    expect(apiClient).toHaveBeenCalledWith('/safety/support/tickets/ticket_1/status', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'RESOLVED' }),
    });
    expect(patchRes.ticket.status).toBe('RESOLVED');
  });
});
