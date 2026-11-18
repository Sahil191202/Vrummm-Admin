import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ledgerService } from './ledgerService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('Ledger Service (ledgerService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists append-only ledger entries with pagination and filters', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'ledg_1', accountType: 'PLATFORM', direction: 'CREDIT', amountPaise: 2925, entryType: 'COMMISSION_EARNED' }],
      meta: { total: 1, page: 1, pages: 1, limit: 20 },
      requestId: 'req_ledg_list',
    });

    const res = await ledgerService.listEntries({ accountType: 'PLATFORM', entryType: 'COMMISSION_EARNED' });
    expect(apiClient).toHaveBeenCalledWith('/ledger/entries?page=1&limit=20&accountType=PLATFORM&entryType=COMMISSION_EARNED');
    expect(res.entries).toHaveLength(1);
    expect(res.entries[0].direction).toBe('CREDIT');
  });

  it('fetches platform ledger balance', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { balancePaise: 1250000, currency: 'INR' },
      requestId: 'req_bal',
    });

    const res = await ledgerService.getBalance();
    expect(apiClient).toHaveBeenCalledWith('/ledger/balance');
    expect(res.balancePaise).toBe(1250000);
  });

  it('creates manual adjustment entry with strict audit reason', async () => {
    const payload = {
      accountUserId: '65f0plat0000000000000000',
      accountType: 'PLATFORM',
      direction: 'CREDIT',
      amountPaise: 5000,
      description: 'Fee reconciliation round-up correction',
      reason: 'Audit reconciliation identified rounding difference in gateway fee',
    };

    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'ledg_adj', ...payload, entryType: 'ADJUSTMENT' },
      requestId: 'req_adj',
    });

    const res = await ledgerService.createAdjustment(payload);
    expect(apiClient).toHaveBeenCalledWith('/ledger/adjustments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    expect(res.adjustment.amountPaise).toBe(5000);
  });

  it('computes reconciliation report aggregates', async () => {
    apiClient
      .mockResolvedValueOnce({
        success: true,
        data: { balancePaise: 50000 },
        requestId: 'req_bal',
      })
      .mockResolvedValueOnce({
        success: true,
        data: [
          { entryType: 'FARE_COLLECTED', amountPaise: 100000 },
          { entryType: 'COMMISSION_EARNED', amountPaise: 15000 },
          { entryType: 'CAPTAIN_EARNING', amountPaise: 85000 },
          { entryType: 'CAPTAIN_PAYOUT_SIMULATED', amountPaise: 50000 },
        ],
        requestId: 'req_entries',
      });

    const report = await ledgerService.getReconciliationReport();
    expect(report.balancePaise).toBe(50000);
    expect(report.totalCollectedPaise).toBe(100000);
    expect(report.totalCommissionPaise).toBe(15000);
    expect(report.totalCaptainEarningsPaise).toBe(85000);
    expect(report.totalPayoutsPaise).toBe(50000);
    expect(report.discrepanciesCount).toBe(0);
  });
});
