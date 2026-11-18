import { apiClient } from '../api/client';

export const ledgerService = {
  async listEntries({ page = 1, limit = 20, accountType, entryType, rideId, paymentId } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (accountType && accountType !== 'ALL') params.set('accountType', accountType);
    if (entryType && entryType !== 'ALL') params.set('entryType', entryType);
    if (rideId) params.set('rideId', rideId);
    if (paymentId) params.set('paymentId', paymentId);

    const query = params.toString();
    const res = await apiClient(`/ledger/entries${query ? `?${query}` : ''}`);
    return {
      entries: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  async getBalance() {
    const res = await apiClient('/ledger/balance');
    return {
      balancePaise: res.data?.balancePaise ?? 0,
      requestId: res.requestId,
    };
  },

  async createAdjustment(data) {
    const res = await apiClient('/ledger/adjustments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return {
      adjustment: res.data,
      requestId: res.requestId,
    };
  },

  async getReconciliationReport() {
    const [balanceRes, entriesRes] = await Promise.all([
      apiClient('/ledger/balance'),
      apiClient('/ledger/entries?limit=100'),
    ]);

    const balancePaise = balanceRes.data?.balancePaise ?? 0;
    const entries = entriesRes.data || [];

    const totalCollectedPaise = entries
      .filter((e) => e.entryType === 'FARE_COLLECTED')
      .reduce((sum, e) => sum + (e.amountPaise || 0), 0);

    const totalCommissionPaise = entries
      .filter((e) => e.entryType === 'COMMISSION_EARNED')
      .reduce((sum, e) => sum + (e.amountPaise || 0), 0);

    const totalCaptainEarningsPaise = entries
      .filter((e) => e.entryType === 'CAPTAIN_EARNING')
      .reduce((sum, e) => sum + (e.amountPaise || 0), 0);

    const totalPayoutsPaise = entries
      .filter((e) => e.entryType === 'CAPTAIN_PAYOUT_SIMULATED')
      .reduce((sum, e) => sum + (e.amountPaise || 0), 0);

    return {
      balancePaise,
      totalCollectedPaise,
      totalCommissionPaise,
      totalCaptainEarningsPaise,
      totalPayoutsPaise,
      discrepanciesCount: 0,
      reconciledAt: new Date().toISOString(),
    };
  },
};
