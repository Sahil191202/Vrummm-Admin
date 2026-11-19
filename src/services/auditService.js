import { apiClient } from '../api/client';

export const auditService = {
  async listAuditLogs({
    page = 1,
    limit = 20,
    actorRole,
    action,
    targetType,
    targetId,
    startDate,
    endDate,
    search,
  } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (actorRole && actorRole !== 'ALL') params.set('actorRole', actorRole);
    if (action && action !== 'ALL') params.set('action', action);
    if (targetType && targetType !== 'ALL') params.set('targetType', targetType);
    if (targetId) params.set('targetId', targetId);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (search) params.set('search', search);

    const query = params.toString();
    const res = await apiClient(`/audit/logs${query ? `?${query}` : ''}`);
    return {
      logs: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  async getOperationsReport({ from, to } = {}) {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const query = params.toString();
    const res = await apiClient(`/admin/reports/operations${query ? `?${query}` : ''}`);
    return {
      report: res.data || {},
      requestId: res.requestId,
    };
  },

  async getFinancialReport({ from, to } = {}) {
    const params = new URLSearchParams();
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    const query = params.toString();
    const res = await apiClient(`/admin/reports/financial${query ? `?${query}` : ''}`);
    return {
      report: res.data || {},
      requestId: res.requestId,
    };
  },

  async getCaptainLeaderboard({ limit = 10, sortBy = 'completedRides' } = {}) {
    const params = new URLSearchParams();
    if (limit) params.set('limit', String(limit));
    if (sortBy) params.set('sortBy', sortBy);
    const query = params.toString();
    const res = await apiClient(`/admin/reports/captains/leaderboard${query ? `?${query}` : ''}`);
    return {
      leaderboard: res.data || [],
      requestId: res.requestId,
    };
  },
};
