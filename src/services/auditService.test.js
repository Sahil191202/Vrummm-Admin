import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auditService } from './auditService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('Audit Service (auditService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists audit logs with actor and action filters', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'audit_1', actorRole: 'SUPER_ADMIN', action: 'bookings.admin_cancel', reason: 'Customer stranded' }],
      meta: { total: 1, page: 1, pages: 1, limit: 20 },
      requestId: 'req_audit_list',
    });

    const res = await auditService.listAuditLogs({ actorRole: 'SUPER_ADMIN', action: 'bookings.admin_cancel' });
    expect(apiClient).toHaveBeenCalledWith('/audit/logs?page=1&limit=20&actorRole=SUPER_ADMIN&action=bookings.admin_cancel');
    expect(res.logs).toHaveLength(1);
    expect(res.logs[0].action).toBe('bookings.admin_cancel');
  });

  it('fetches operations and financial reports', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { totalBookings: 154, completionRate: 0.92 },
      requestId: 'req_ops_rep',
    });

    const opsRes = await auditService.getOperationsReport({ from: '2026-10-01', to: '2026-10-31' });
    expect(apiClient).toHaveBeenCalledWith('/admin/reports/operations?from=2026-10-01&to=2026-10-31');
    expect(opsRes.report.totalBookings).toBe(154);

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { grossBookingsPaise: 12500000, netPlatformRevenuePaise: 1875000 },
      requestId: 'req_fin_rep',
    });

    const finRes = await auditService.getFinancialReport();
    expect(apiClient).toHaveBeenCalledWith('/admin/reports/financial');
    expect(finRes.report.grossBookingsPaise).toBe(12500000);
  });
});
