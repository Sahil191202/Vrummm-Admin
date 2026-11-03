import { apiClient } from '../api/client';

export const documentService = {
  /**
   * List captains with server-side pagination and filters
   */
  async listCaptains({ page = 1, limit = 20, approvalStatus, search } = {}) {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (approvalStatus && approvalStatus !== 'ALL') params.set('approvalStatus', approvalStatus);
    if (search) params.set('search', search);

    const query = params.toString();
    const endpoint = `/captains${query ? `?${query}` : ''}`;
    const res = await apiClient(endpoint);

    return {
      captains: res.data || [],
      total: res.meta?.total ?? res.data?.length ?? 0,
      page: res.meta?.page ?? page,
      pages: res.meta?.pages ?? 1,
      limit: res.meta?.limit ?? limit,
      requestId: res.requestId,
    };
  },

  /**
   * Get single captain profile
   */
  async getCaptain(captainId) {
    const res = await apiClient(`/captains/${captainId}`);
    return {
      captain: res.data,
      requestId: res.requestId,
    };
  },

  /**
   * Set overall captain approval status (requires written reason for reject/suspend)
   */
  async setCaptainApproval(captainId, { status, reason }) {
    const res = await apiClient(`/captains/${captainId}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
    return {
      captain: res.data,
      requestId: res.requestId,
    };
  },

  /**
   * List documents for a specific captain
   */
  async listCaptainDocuments(captainId) {
    const res = await apiClient(`/documents/captain/${captainId}`);
    return {
      documents: res.data?.documents || [],
      missingRequired: res.data?.missingRequired || [],
      requestId: res.requestId,
    };
  },

  /**
   * Review a document (approve or reject with reason)
   */
  async reviewDocument(docId, { status, rejectionReason }) {
    const res = await apiClient(`/documents/${docId}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, rejectionReason }),
    });
    return {
      document: res.data,
      requestId: res.requestId,
    };
  },

  /**
   * Get signed preview URL for a document (short-lived signed URL)
   */
  async getSignedUrl(docId) {
    const res = await apiClient(`/documents/${docId}/url`);
    return {
      url: res.data?.url,
      expiresInSeconds: res.data?.expiresInSeconds || 300,
      documentType: res.data?.documentType,
      status: res.data?.status,
      requestId: res.requestId,
    };
  },
};
