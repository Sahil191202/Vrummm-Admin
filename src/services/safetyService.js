import { apiClient } from '../api/client';

export const safetyService = {
  async listIncidents({ page = 1, limit = 20, status, severity, type, rideId } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (status && status !== 'ALL') params.set('status', status);
    if (severity && severity !== 'ALL') params.set('severity', severity);
    if (type && type !== 'ALL') params.set('type', type);
    if (rideId) params.set('rideId', rideId);

    const query = params.toString();
    const res = await apiClient(`/safety/incidents${query ? `?${query}` : ''}`);
    return {
      incidents: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  async getIncident(incidentId) {
    const res = await apiClient(`/safety/incidents/${incidentId}`);
    return {
      incident: res.data,
      requestId: res.requestId,
    };
  },

  async resolveIncident(incidentId, { status, resolutionNotes, reason }) {
    const res = await apiClient(`/safety/incidents/${incidentId}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ status, resolutionNotes, reason }),
    });
    return {
      incident: res.data,
      requestId: res.requestId,
    };
  },

  async listSupportTickets({ page = 1, limit = 20, status, category, priority, userId } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (status && status !== 'ALL') params.set('status', status);
    if (category && category !== 'ALL') params.set('category', category);
    if (priority && priority !== 'ALL') params.set('priority', priority);
    if (userId) params.set('userId', userId);

    const query = params.toString();
    const res = await apiClient(`/safety/support/tickets${query ? `?${query}` : ''}`);
    return {
      tickets: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  async getSupportTicket(ticketId) {
    const res = await apiClient(`/safety/support/tickets/${ticketId}`);
    return {
      ticket: res.data,
      requestId: res.requestId,
    };
  },

  async addTicketMessage(ticketId, { message }) {
    const res = await apiClient(`/safety/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return {
      ticket: res.data,
      requestId: res.requestId,
    };
  },

  async updateTicketStatus(ticketId, { status }) {
    const res = await apiClient(`/safety/support/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return {
      ticket: res.data,
      requestId: res.requestId,
    };
  },

  async getSharedTrip(token) {
    const res = await apiClient(`/safety/trip-share/${token}`);
    return {
      sharedTrip: res.data,
      requestId: res.requestId,
    };
  },
};
